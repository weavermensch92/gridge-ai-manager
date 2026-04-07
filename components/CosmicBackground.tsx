
import React, { useEffect, useRef, useCallback } from 'react';
import { BranchNode, Theme } from './types';
import { createBranchPool, BASE_RADIUS, PHI, MAX_LAYERS } from './constants';

interface CosmicBackgroundProps {
    theme: Theme;
    stage: number;
    footerMode: boolean;
}

// Linear interpolation helper
const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

export const CosmicBackground: React.FC<CosmicBackgroundProps> = ({ theme, stage, footerMode }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number>(0);
    const timeRef = useRef<number>(0);
    const mouseRef = useRef({ x: 0, y: 0 });
    const smoothMouseRef = useRef({ x: 0, y: 0 });
    const smoothStageRef = useRef<number>(0); 
    const smoothFooterValRef = useRef<number>(0);
    const camOffsetRef = useRef<number>(0);
    const rotationRef = useRef({ x: Math.PI / 2, y: 0 });
    const mainBranchPool = useRef<BranchNode[]>(createBranchPool());
    const stage3BranchPool = useRef<BranchNode[]>(createBranchPool());
    const stage4BranchPool1 = useRef<BranchNode[]>(createBranchPool());
    const stage4BranchPool2 = useRef<BranchNode[]>(createBranchPool());
    const startupRef = useRef(0); // For cinematic intro

    // Local mouse listener for background parallax
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = {
                x: (e.clientX / window.innerWidth) * 2 - 1,
                y: -(e.clientY / window.innerHeight) * 2 + 1
            };
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const projectToScreen = useCallback((x: number, y: number, z: number, originX: number, originY: number, originZ: number, zoom: number, fov: number, width: number, height: number, rotation: {x: number, y: number}) => {
        const cosY = Math.cos(rotation.y); const sinY = Math.sin(rotation.y); const cosX = Math.cos(rotation.x); const sinX = Math.sin(rotation.x);
        const tx = x - originX; const ty = y - originY; const tz = z - originZ;
        const x1 = tx * cosY - tz * sinY; const z1 = tx * sinY + tz * cosY;
        const y2 = ty * cosX - z1 * sinX; const z2 = ty * sinX + z1 * cosX;
        const scale = (fov * zoom) / (fov + z2);
        return { x: x1 * scale + width / 2, y: y2 * scale + height / 2, scale: scale };
    }, []);

    const draw = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
        // Clear Rect with slight trail for video-like motion blur during intro
        const isDarkMode = theme === 'dark';
        const baseColorRGB = isDarkMode ? '255, 255, 255' : '20, 20, 20';
        
        ctx.clearRect(0, 0, width, height);
        
        // Cinematic Intro Logic (Big Bang Effect)
        // startupRef goes from 0 to 1.
        startupRef.current = lerp(startupRef.current, 1, 0.015);
        const startup = startupRef.current;
        const introEase = 1 - Math.pow(1 - startup, 4); // Ease out quart
        
        // Intro effects
        const expansion = 0.05 + (0.95 * introEase); // Grow from 5% to 100%
        const introRotationSpeed = (1 - introEase) * 0.2; // Fast spin initially
        const introZoom = 1 + ((1 - introEase) * 4); // Zoom out from 5x close up
        const introOpacity = Math.min(1, startup * 3); // Fade in quickly
        
        smoothFooterValRef.current = lerp(smoothFooterValRef.current, footerMode ? 1 : 0, 0.08);
        
        // Logic to prevent zoom out during stages 4, 5, 6 (User Phases 4, 5, 6)
        // Stage 0-1: Normal
        // Stage 2-5: Keep visual at "2" (visual val 0) -> No Zoom
        // Stage 6 (Awakening): Target 3 (visual val 1) -> Zoom once
        // Stage 7+: Target stage-3 (visual val increases by 1)
        let targetVisualStage = stage;
        if (stage >= 2 && stage <= 5) {
            targetVisualStage = 2;
        } else if (stage >= 6) {
            targetVisualStage = stage - 3;
        }

        smoothStageRef.current = lerp(smoothStageRef.current, targetVisualStage, 0.05);
        const smoothStage = smoothStageRef.current;
        // Adjusted visual stage value to account for the new Stage 3 (Benefits)
        // The tree/network visual should only start transitioning after Stage 3.
        const visualStageVal = Math.max(0, smoothStage - 2); 
        const currentStageVal = Math.min(visualStageVal, 4.05);
        
        smoothMouseRef.current.x = lerp(smoothMouseRef.current.x, mouseRef.current.x, 0.05);
        smoothMouseRef.current.y = lerp(smoothMouseRef.current.y, mouseRef.current.y, 0.05);
        
        const rotation = rotationRef.current;
        const activeMaxLayer = 2 * currentStageVal; 
        const maxActiveRadius = BASE_RADIUS * Math.pow(PHI, activeMaxLayer);
        const currentFov = Math.max(1000, maxActiveRadius * 4); 
        const minDim = Math.min(width, height);
        
        // Apply Intro Zoom
        const currentZoom = ((minDim * 0.35) / maxActiveRadius) / introZoom;
        
        ctx.lineCap = 'round'; 
        ctx.globalCompositeOperation = isDarkMode ? 'screen' : 'multiply';
        
        let globalOpacity = 1.0 * introOpacity;
        if (smoothStage > 1.5 && smoothStage < 3.5) { globalOpacity *= 0.6; }
        if (smoothStage > 3.8 && smoothStage < 4.5) { globalOpacity *= 0.3; }
        
        const updateBranchPhysics = (pool: BranchNode[], angleOffset: number) => {
            let currentPos = { x: 0, y: 0, z: 0 }; 
            let currentRadius = BASE_RADIUS;
            
            pool[0].x = 0; pool[0].y = 0; pool[0].z = 0; pool[0].orbitRadius = currentRadius;
            
            for (let i = 0; i < MAX_LAYERS; i++) {
                const direction = i % 2 === 0 ? 1 : -1;
                const angle = timeRef.current * (0.005 * direction) + angleOffset;
                
                const nextX = currentPos.x + Math.cos(angle) * currentRadius * expansion; 
                const nextZ = currentPos.z + Math.sin(angle) * currentRadius * expansion;
                
                currentPos = { x: nextX, y: 0, z: nextZ }; 
                currentRadius *= PHI;
                
                const node = pool[i + 1]; 
                node.x = currentPos.x; 
                node.y = currentPos.y; 
                node.z = currentPos.z; 
                node.orbitRadius = currentRadius * expansion; 
            }
        };
        
        updateBranchPhysics(mainBranchPool.current, 0);
        if (currentStageVal > 1.9) updateBranchPhysics(stage3BranchPool.current, Math.PI);
        if (currentStageVal > 2.9) { updateBranchPhysics(stage4BranchPool1.current, Math.PI / 2); updateBranchPhysics(stage4BranchPool2.current, 3 * Math.PI / 2); }
        
        const lowerIdx = Math.floor(currentStageVal); const upperIdx = Math.ceil(currentStageVal); const frac = currentStageVal - lowerIdx;
        const getTargetIndex = (s: number) => (s <= 0 ? 0 : 2 * s - 1);
        const targetIdx1 = Math.min(getTargetIndex(lowerIdx), MAX_LAYERS); const targetIdx2 = Math.min(getTargetIndex(upperIdx), MAX_LAYERS);
        
        // Camera Offset Logic for Stage 2 (Awakening)
        // User requested: "Move the camera slightly to the right" (which moves content left)
        let targetCamOffset = 0;
        if (stage === 2) {
            targetCamOffset = 150; // Positive X moves camera right, content left
        }
        camOffsetRef.current = lerp(camOffsetRef.current, targetCamOffset, 0.05);

        const camTargetX = lerp(mainBranchPool.current[targetIdx1].x, mainBranchPool.current[targetIdx2].x, frac) + camOffsetRef.current;
        const camTargetY = lerp(mainBranchPool.current[targetIdx1].y, mainBranchPool.current[targetIdx2].y, frac);
        const camTargetZ = lerp(mainBranchPool.current[targetIdx1].z, mainBranchPool.current[targetIdx2].z, frac);
        
        const drawGrid = () => {
            const spacingMultiplier = 1.0 + (currentStageVal / 4.0);
            const baseGridSpacing = BASE_RADIUS * Math.pow(PHI, 2) * spacingMultiplier;
            const gridZoom = (minDim * 0.35) / (BASE_RADIUS * Math.pow(PHI, 2.0 + (activeMaxLayer * 0.25)));
            const screenSpacing = baseGridSpacing * gridZoom; if (screenSpacing < 3) return;
            
            const gridOpacity = Math.max(0, (startup - 0.5) * 2); 
            
            ctx.strokeStyle = `rgba(${baseColorRGB}, ${Math.min(0.15, (screenSpacing - 3) / 10 * 0.15) * globalOpacity * gridOpacity})`; ctx.lineWidth = 1;
            let gridCamX = 0, gridCamZ = 0;
            if (width > 768) { gridCamX = smoothMouseRef.current.x * maxActiveRadius * 0.2; gridCamZ = smoothMouseRef.current.y * maxActiveRadius * 0.2; }
            const startWorldX = Math.floor((gridCamX - (width/gridZoom)/2) / baseGridSpacing) * baseGridSpacing;
            const startWorldZ = Math.floor((gridCamZ - (height/gridZoom)/2) / baseGridSpacing) * baseGridSpacing;
            ctx.beginPath();
            for (let wx = startWorldX - baseGridSpacing; wx <= startWorldX + (width/gridZoom) + baseGridSpacing; wx += baseGridSpacing) {
                for (let wz = startWorldZ - baseGridSpacing; wz <= startWorldZ + (height/gridZoom) + baseGridSpacing; wz += baseGridSpacing) {
                    const sx = width / 2 + (wx - gridCamX) * gridZoom; const sy = height / 2 + (wz - gridCamZ) * gridZoom + (smoothFooterValRef.current * -50);
                    ctx.moveTo(sx - 3, sy); ctx.lineTo(sx + 3, sy); ctx.moveTo(sx, sy - 3); ctx.lineTo(sx, sy + 3);
                }
            }
            ctx.stroke();
        };
        drawGrid();
        
        const drawBranch = (branch: BranchNode[], globalAlpha: number) => {
            const parallax = smoothFooterValRef.current * -120; if (globalAlpha < 0.01) return;
            const effectiveAlpha = globalAlpha * globalOpacity;
            for (let i = 0; i < MAX_LAYERS; i++) {
                let layerAlpha = Math.max(0, Math.min(1, (currentStageVal - (Math.ceil(i / 2) - 1) - 0.2) / 0.7)) * effectiveAlpha; if (layerAlpha <= 0.01) continue;
                const p1 = projectToScreen(branch[i].x, branch[i].y, branch[i].z, camTargetX, camTargetY, camTargetZ, currentZoom, currentFov, width, height, rotation); p1.y += parallax;
                const screenRadius = branch[i].orbitRadius * p1.scale;
                if (screenRadius < 6) { if (screenRadius > 0.5) { ctx.beginPath(); ctx.fillStyle = `rgba(${baseColorRGB}, ${0.5 * layerAlpha})`; ctx.arc(p1.x, p1.y, 2, 0, Math.PI * 2); ctx.fill(); } continue; }
                ctx.beginPath(); ctx.strokeStyle = `rgba(${baseColorRGB}, ${0.5 * layerAlpha})`; ctx.lineWidth = 1;
                for (let j = 0; j <= 48; j++) {
                    const theta = (j * Math.PI * 2) / 48;
                    const wx = branch[i].x + Math.cos(theta) * branch[i].orbitRadius;
                    const wz = branch[i].z + Math.sin(theta) * branch[i].orbitRadius;
                    const p = projectToScreen(wx, branch[i].y, wz, camTargetX, camTargetY, camTargetZ, currentZoom, currentFov, width, height, rotation);
                    const px = p.x; const py = p.y + parallax;
                    if (j === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
                }
                ctx.stroke();
                const p2 = projectToScreen(branch[i+1].x, branch[i+1].y, branch[i+1].z, camTargetX, camTargetY, camTargetZ, currentZoom, currentFov, width, height, rotation); p2.y += parallax;
                ctx.beginPath(); ctx.strokeStyle = `rgba(${baseColorRGB}, ${0.2 * layerAlpha})`; ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
                ctx.beginPath(); ctx.fillStyle = `rgba(${baseColorRGB}, ${layerAlpha})`; ctx.arc(p2.x, p2.y, 2.5, 0, Math.PI * 2); ctx.fill();
            }
        };
        drawBranch(mainBranchPool.current, 1.0);
        const s3a = Math.max(0, Math.min(1, currentStageVal - 2.0)); if (s3a > 0.01) drawBranch(stage3BranchPool.current, s3a);
        const s4a = Math.max(0, Math.min(1, currentStageVal - 3.0)); if (s4a > 0.01) { drawBranch(stage4BranchPool1.current, s4a); drawBranch(stage4BranchPool2.current, s4a); }
        
        if (startup < 0.2) {
             const flashOpacity = (1 - (startup * 5)) * 0.8;
             ctx.fillStyle = `rgba(${baseColorRGB}, ${flashOpacity})`;
             ctx.fillRect(0, 0, width, height);
        }

        ctx.globalCompositeOperation = 'source-over'; 
        timeRef.current += 1; 
        rotationRef.current.y += 0.0005 + introRotationSpeed;
        
        requestRef.current = requestAnimationFrame(() => draw(ctx, width, height));
    }, [stage, theme, footerMode, projectToScreen]); 

    const handleResize = useCallback(() => {
        if (canvasRef.current) {
            const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
            canvasRef.current.width = window.innerWidth * dpr;
            canvasRef.current.height = window.innerHeight * dpr;
            canvasRef.current.style.width = `${window.innerWidth}px`;
            canvasRef.current.style.height = `${window.innerHeight}px`;
            canvasRef.current.getContext('2d')?.scale(dpr, dpr);
        }
    }, []);

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (canvas && ctx) {
             requestRef.current = requestAnimationFrame(() => draw(ctx, window.innerWidth, window.innerHeight));
        }
        return () => {
             window.removeEventListener('resize', handleResize);
             if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [draw, handleResize]);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};
