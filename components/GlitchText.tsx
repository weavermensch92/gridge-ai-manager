import React, { useState, useEffect, useRef } from 'react';

interface GlitchTextProps {
  text: string;
  as?: React.ElementType;
  className?: string;
  speed?: number; // Speed of decoding (higher is slower)
  delay?: number; // Delay before starting the effect in ms
}

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

export const GlitchText: React.FC<GlitchTextProps> = ({ 
  text = '', 
  as: Component = 'span', 
  className = '',
  speed = 2.5, // Slower default (approx 70% of original speed)
  delay = 0 
}) => {
  const [displayText, setDisplayText] = useState(text || '');
  const intervalRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  
  useEffect(() => {
    // Clear any existing timers
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (!text) return; // Guard clause

    // Function to start the glitch effect
    const startGlitch = () => {
        let iteration = 0;
        
        intervalRef.current = window.setInterval(() => {
          setDisplayText(prev => 
            (text || '')
              .split('')
              .map((letter, index) => {
                // If the character is a space, keep it a space
                if (letter === ' ') return ' ';
                // If the character is a newline, keep it a newline to preserve layout
                if (letter === '\n') return '\n';
                
                // If we've passed this index in iteration, show the real letter
                if (index < iteration) {
                  return text[index];
                }
                
                // Otherwise show a random character
                return CHARS[Math.floor(Math.random() * CHARS.length)];
              })
              .join('')
          );

          if (iteration >= text.length) {
            if (intervalRef.current) clearInterval(intervalRef.current);
          }

          // Increment iteration
          iteration += 1 / speed; 
        }, 30);
    };

    // Apply delay
    if (delay > 0) {
        timeoutRef.current = window.setTimeout(startGlitch, delay);
    } else {
        startGlitch();
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, speed, delay]);

  return <Component className={className}>{displayText}</Component>;
};