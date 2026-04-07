
import { BranchNode } from './types';

export const BASE_RADIUS = 12;
export const PHI = 2.0;
export const MAX_LAYERS = 13; // Increased to support extra stage

export const createBranchPool = (): BranchNode[] => Array.from({ length: MAX_LAYERS + 1 }, () => ({ x: 0, y: 0, z: 0, orbitRadius: 0 }));

const WIZARD_CONSTANTS = {
    scopes: ["Business Strategy", "AX Transformation", "AI Implementation Project", "LLM", "RAG", "Solution Development", "Dispatch Collaboration", "UXUI Design", "Website", "App", "Frontend", "Backend", "SaaS", "Commerce", "Marketplace", "Matching", "Madoros", "Government Support", "Proof of Concept", "AR/VR/3D", "Other"],
    budgets: ["Under 100M", "100M ~ 200M", "200M ~ 300M", "300M ~ 400M", "400M ~ 500M", "500M ~ 1B", "Over 1B"],
    teamSizes: ["1-5", "6-20", "21-50", "51-100", "100+"],
    aiCosts: ["Not using AI", "Under $1k", "$1k ~ $5k", "$5k ~ $10k", "$10k ~ $50k", "Over $50k"],
    aiTools: ["ChatGPT", "Gemini", "Gemini (Enterprise)", "Google API", "Claude Code", "Claude", "Grok", "Other"],
    periods: ["Early", "Mid", "Late"]
};

export const TRANSLATIONS = {
    en: {
        toc: ["01. GENESIS", "02. AWAKENING", "03. EXPANSION", "04. SYNERGY", "05. HARMONY", "06. ACCESS"],
        footer: {
            companyName: "Soft Squared Inc.",
            ceo: "CEO Ha-neul Lee",
            industry: "Industry Computer Programming",
            regNo: "Reg. No. 723-81-01101",
            addrMain: "HQ: 24F, 7-8, Jungang-daero 214beon-gil, Dong-gu, Busan",
            addrBranch: "Branch: 1-2F, 75, Bangbaecheon-ro 2-an-gil, Seocho-gu, Seoul",
            links: ["Terms of Use", "Point Terms", "Privacy Policy", "No Email Collection", "Marketing Consent"],
            copyright: "© 2026 Soft Squared. All rights reserved."
        },
        nodeGraph: {
            nodes: {
                web: { label: "Webhook", subLabel: "" },
                agent: { label: "AI Agent", subLabel: "Tools Agent" },
                sw: { label: "Switch", subLabel: "" },
                get: { label: "Get Prop", subLabel: "" },
                post: { label: "Post URL", subLabel: "" },
                del: { label: "Delete", subLabel: "" },
                conf1: { label: "Docs", subLabel: "" },
                conf2: { label: "Settings", subLabel: "" },
                conf3: { label: "Web", subLabel: "" },
                rss: { label: "Trend Watch", subLabel: "" },
                gen: { label: "Content Gen", subLabel: "GPT-4o" },
                rev: { label: "Review", subLabel: "" },
                blog: { label: "WordPress", subLabel: "" },
                social: { label: "LinkedIn", subLabel: "" },
                brand: { label: "Brand Kit", subLabel: "" },
                tic: { label: "Ticket In", subLabel: "" },
                class: { label: "Classifier", subLabel: "Fine-tuned" },
                kb: { label: "KB Search", subLabel: "" },
                reply: { label: "Auto Reply", subLabel: "" },
                esc: { label: "Escalate", subLabel: "" },
                db: { label: "History", subLabel: "" }
            },
            profiles: {
                web: { name: 'System Hook', role: 'Event Trigger' },
                agent: { name: 'Model_Orchestrator', role: 'AI Core' },
                sw: { name: 'Mike Ross', role: 'Product Owner' },
                get: { name: 'Data Fetcher', role: 'I/O Operation' },
                post: { name: 'System Writer', role: 'I/O Operation' },
                del: { name: 'Garbage Collector', role: 'Cleanup' },
                rss: { name: 'Trend_Watcher_V1', role: 'Data Ingestion' },
                gen: { name: 'Creator_LLM', role: 'Generative Core' },
                rev: { name: 'Sarah Lee', role: 'Content Lead' },
                blog: { name: 'CMS_Connector', role: 'Publisher' },
                social: { name: 'SNS_API', role: 'Distributor' },
                brand: { name: 'Brand_Guard', role: 'Context Provider' },
                tic: { name: 'Support_Inbound', role: 'Trigger' },
                class: { name: 'Triage_Model', role: 'Classifier' },
                kb: { name: 'Vector_DB', role: 'Knowledge Base' },
                reply: { name: 'Responder_Bot', role: 'Action' },
                esc: { name: 'David Kim', role: 'Support Manager' },
                db: { name: 'Log_Store', role: 'Memory' },
                conf1: { name: 'RAG_Source', role: 'Context' },
                conf2: { name: 'Param_Store', role: 'Config' },
                conf3: { name: 'Search_Tool', role: 'External Tool' }
            },
            sidebar: {
                title: "Team Workflows",
                dev: { title: "DevOps", sub: "Automated Pipeline" },
                mkt: { title: "Marketing", sub: "Content Engine" },
                sup: { title: "Support", sub: "Ticket Routing" },
                monitor: "Team Performance Monitor"
            },
            ui: {
                zoom: "Zoom",
                autoSave: "Auto-save",
                efficiency: "Efficiency",
                reliability: "Reliability"
            }
        },
        genesis: {
            leftNodes: ["Dev A", "Dev B", "Dev C", "Designer A", "Planner A"],
            rightNodes: ["Google", "Claude Code", "Claude", "BKIT", "Manifesto"],
            midComplex: ["Individual Payment", "Finance Request", "Team Budget"],
            midSimple: ["Prompt Improvement", "GRIDGE AiOPS", "Context Storage"]
        },
        stage1: { line1: "AI PERFORMANCE", line2: "MATTERS" },
        stage2: { text1: "AI is used everywhere in the team,", text2: "but who and how it's used is invisible." },
        stage2_transform: { text1: "Identifying where AI is utilized across the team,", text2: "We will show you who, how, and where it should be used." },
        stage3: {
            title1: "Feature 1.", title2: "Individual Competence", title3: "To Team Performance",
            widgets: {
                profile: { name: "Kyungho Min", desc: "Core Developer focused on AI-driven Architecture & AX." },
                score: { title: "5 Core Competencies", desc: "Diagnose individual competencies across 5 key dimensions from Prompt Engineering to Validation Maturity.", items: [{ l: "Prompt Eng", v1: 3, v2: 4 }, { l: "Efficiency", v1: 2, v2: 3 }, { l: "Tech Depth", v1: 3, v2: 4 }, { l: "Validation", v1: 2, v2: 3 }] },
                change: { title: "Workflow Change", desc: "Shift from vague requests like 'Make it pretty' to defined engineering standards with Visual Rules and DoD.", before: "\"Make it pretty\"", after: ["Visual Rules Applied", "DoD Scope Defined"] },
                perf: { title: "Process Evolution", desc: "Evolution from ad-hoc implementation to a design-first architecture where constraints are defined before coding.", s1: { t: "Implementation Focused", d: "Ad-hoc module creation" }, s2: { t: "Design Driven", d: "Structured architecture first" } },
                effect: { title: "ROI Analysis", desc: "Quantifiable improvements in efficiency, including reduced iterations and optimized token costs.", items: ["Reduced UI Iterations", "Optimized Token Costs", "Faster Convergence"] },
                health: { title: "Project Health", desc: "Real-time analysis of project code health and activity metrics like cycle time and commit frequency.", items: [{ l: "Commits", v: "556" }, { l: "Files", v: "69" }, { l: "Cycle Time", v: "107s" }, { l: "Events", v: "2.3k" }] },
                sfia: { title: "SFIA Mapping", desc: "Alignment of individual skills with the global standard SFIA (Skills Framework for the Information Age).", items: [{ l: "Problem Def.", v: "Structuring" }, { l: "Reproducibility", v: "Auto-patterns" }, { l: "Governance", v: "Design->Approve" }] }
            }
        },
        stage4_genesis: {
            text1: "Teams utilizing AI individually",
            text2: "Cannot achieve company-wide efficiency."
        },
        stage5_genesis: {
            text1: "Manage teams utilizing AI individually",
            text2: "At once with GRIDGE AiOPS."
        },
        stage6_genesis: {
            text1: "Same cost, same AI services",
            text2: "Experience the benefits and additional features below."
        },
        stage7_genesis: {
            text1: "Customer Success Stories",
            text2: "See how other teams transformed with GRIDGE."
        },
        stage8_genesis: {
            text1: "How is this possible?",
            text2: "Seamless integration with your existing workflow."
        },
        stage4: {
            title1: "Feature 2.", title2: "Expand Career from Developer", title3: "To AI Engineer",
            cards: {
                trad: { title: "Traditional Dev", sub: "Implements defined specs.\nFocuses on syntax & logic.", outLabel: "Output", outVal: "Function", skill: "Syntax Mastery" },
                ai: { title: "AI Engineer", sub: "Architects with AI.\nFocuses on context & orchestrating.", outLabel: "Output", outVal: "Product", skill: "Context Control" }
            }
        },
        stage5: {
            title1: "Feature 3.", title2: "Beyond the Developer", title3: "Team-level AX Empowerment",
            widgets: {
                lifecycle: {
                    title: "3.1 SW Lifecycle",
                    data: [{ l: "Implementation", v: 70 }, { l: "Requirements", v: 15 }, { l: "Ops/Maint", v: 8 }, { l: "Testing", v: 5 }, { l: "Design/Arch", v: 2 }],
                    interp: { title: "INTERPRETATION", text: "AI usage is extremely skewed towards Implementation (70%)." },
                    implic: { title: "IMPLICATION", text: "Shifting AI to Design/Test is the key lever for ROI." }
                },
                intent: {
                    title: "3.2 Task Intent",
                    data: [{ l: "Generation", v: 60, c: "bg-blue-600" }, { l: "Debugging", v: 20, c: "bg-blue-500" }, { l: "Documentation", v: 15, c: "bg-blue-400" }, { l: "Ops Support", v: 5, c: "bg-blue-300" }],
                    insight: "Currently an Execution-focused org. Increasing Decision/Review improves design quality."
                },
                artifact: {
                    title: "2.3 Artifacts",
                    data: [{ l: "App Code", v: 72 }, { l: "Docs/Design", v: 11 }, { l: "Infra/CICD", v: 8 }, { l: "Data/Schema", v: 6 }, { l: "Test Code", v: 3 }],
                    note: "* Focused on App Code (72%). Low Test Code (3%) usage may lead to operational risks."
                },
                strategy: {
                    title: "2.4 Strategy POS",
                    current: { title: "CURRENT STATE", text: "Execution Focused: High productivity but limited in debt control." },
                    next: { title: "NEXT STEP: LV.3", text: "Internalize Validation to reach Organizational Productivity." }
                },
                defects: {
                    title: "2.5 SDLC Defects",
                    stats: [{ l: "Short Prompt", v: "65.3%" }, { l: "Rich Context", v: "54.4%" }, { l: "No Validation", v: "88.3%" }],
                    risk: { title: "RISK PATTERN", text: "\"Implementation Bias + Low Validation\" defers rework costs. Missing design/test checks opportunities to block technical debt early." }
                },
                collab: {
                    title: "3.1 Team Collab",
                    headers: ["TEAM", "PROFILE", "EFF. SCORE", "VALIDATION", "USAGE"],
                    rows: [
                        { t: "C3", p: "Type 1", s: 85, v: "18.5%", u: "240 pts" },
                        { t: "B1", p: "Type 1", s: 82, v: "24.1%", u: "210 pts" },
                        { t: "A1", p: "Type 1", s: 80, v: "15.2%", u: "190 pts" },
                        { t: "B5", p: "Type 2", s: 65, v: "8.4%", u: "280 pts" },
                        { t: "A5", p: "Type 2", s: 62, v: "7.1%", u: "260 pts" },
                        { t: "B4", p: "Type 3", s: 45, v: "5.2%", u: "80 pts" },
                        { t: "C1", p: "Type 4", s: 40, v: "0%", u: "50 pts" }
                    ]
                },
                bias: {
                    title: "3.2 SDLC Bias",
                    chart: [
                        { t: "C3", d: 12.6, te: 5, i: 82.4 },
                        { t: "B3", d: 11.1, te: 4, i: 84.9 },
                        { t: "D4", d: 8.5, te: 3, i: 88.5 },
                        { t: "B1", d: 5, te: 8, i: 87 },
                        { t: "A2", d: 4, te: 7, i: 89 }
                    ],
                    insight: "Need to analyze high-design teams (C3 12.6%, B3 11.1%) to establish Shift-Left AI models."
                },
                standard: {
                    title: "3.4 Standardization",
                    mainStat: "86.8%",
                    segments: [{ l: "C1, C2 Team", v: "100%" }, { l: "D4 Team", v: "95%" }],
                    rca: { title: "Root Cause Analysis", text: "Good prompts are not shared. 'Prompt Library' channel and standard templates needed." }
                }
            }
        },
        stage6: {
            title1: "Feature 4. (Preview)", title2: "Transform the Entire", title3: "Dev Team to AI Agent",
            nodeDetails: {
                'planning': {
                    name: 'AI-Req-Interpreter', role: '"Requirement Structuring"', capabilities: "Identifies ambiguous requirements and drafts Acceptance Criteria (AC).", problemTarget: "Rework due to misinterpretation"
                },
                'design': {
                    name: 'AI-Architect', role: '"Design Options & Risk Analysis"', capabilities: "Analyzes design trade-offs and supports senior developer decision making.", problemTarget: "Build-first-fix-later patterns & Operational Risks"
                },
                'execution': {
                    name: 'AI-Code-Generator', role: '"Execution based on Design"', capabilities: "Generates implementation code based on confirmed architectural design.", problemTarget: "Repetitive implementation & low productivity"
                },
                'val_top': {
                    name: 'AI-Validator', role: '"Constraint Check & Edge Cases"', capabilities: "Checks requirements/design compliance and identifies edge cases.", problemTarget: "Unverified code & debugging cycles"
                },
                'val_bot': {
                    name: 'AI-Reviewer / Tester', role: '"PR Summary & Test Generation"', capabilities: "Generates unit tests and summarizes PRs for quality/maintainability.", problemTarget: "Review bottlenecks & Senior fatigue"
                },
                'operations': {
                    name: 'AI-Incident-Analyst', role: '"Root Cause & Runbook Generator"', capabilities: "Analyzes logs/alarms for root causes and generates runbooks automatically.", problemTarget: "Knowledge silos & Slow MTTR"
                },
                'knowledge': {
                    name: 'AI-Knowledge-Curator', role: '"Assetization of Intelligence"', capabilities: "Curates effective prompts/results into team assets.", problemTarget: "Low Reuse Prompt (86.8%) & Lack of learning"
                },
                'gen': {
                    name: 'AI-Code-Generator', role: '"Execution based on Design"', capabilities: "Generates implementation code based on confirmed architectural design.", problemTarget: "Repetitive implementation & low productivity"
                },
                'ops': {
                    name: 'AI-Incident-Analyst', role: '"Root Cause & Runbook Generator"', capabilities: "Analyzes logs/alarms for root causes and generates runbooks automatically.", problemTarget: "Knowledge silos & Slow MTTR"
                },
                'arch': {
                    name: 'Arch Gap', role: '"High Risk Area"', capabilities: "Technical debt area caused by jumping to implementation without design.", problemTarget: "Increased rework costs"
                },
                'review': {
                    name: 'Review Bottleneck', role: '"Process Slowdown"', capabilities: "Pipeline delay caused by senior developer review wait times.", problemTarget: "Delayed deployment cycles"
                },
                'repo': {
                    name: 'Knowledge Repository', role: '"Unified Intelligence Core"', capabilities: "Centralizes shared context, prompt assets, and validation skillsets for consistent AI performance.", problemTarget: "Fragmented knowledge & Inconsistent output"
                }
            }
        },
        stage7: {
            headlinePart1: "With GRIDGE AiOPS, ", headlinePart2: "The Overwhelming Gap of the Dev Team ", headlinePart3: "Create it.",
            intro: "Keep your current AI spending, keep your current services,\nand get GRIDGE AiOPS features as a bonus!",
            benefitTitle: "Early Bird Access", btnStart: "Start Early Bird Consultation",
            benefits: [
                { title: "10% AI Token Discount", detail: "10% discount on all AI costs (Claude, Cursor, Gemini, etc.) for 3 months." },
                { title: "Free Monitoring", detail: "Real-time AI monitoring and anomaly detection provided free for 1 year." },
                { title: "Consulting Session", detail: "3 free AI TaskForce consulting sessions (worth $12k) for annual contracts." },
                { title: "Priority Purchase", detail: "10% discount and priority rights for all future GRIDGE AiOPS services." }
            ]
        },
        chatbot: {
            greeting: "Hello! I am the GRIDGE AI Assistant. How can I help you optimize your team's workflow today?",
            name: "GRIDGE AI Assistant",
            status: "Online",
            thinking: "Thinking...",
            placeholder: "Ask about GRIDGE...",
            disclaimer: "AI can make mistakes. Check important info.",
            error: "Error: "
        },
        wizard: {
            startTitle: "Hello,\nAre you ready to\nAX with GRIDGE?", startSub: "(You can select both)",
            typeProject: "AX Project Request", typeOther: "AiOPS Inquiry",
            btnStart: "Start", btnNext: "Next", btnPrev: "Previous", btnSubmit: "Submit", btnClose: "Close",
            stepScopeTitle: "Select the scope\nof the project", stepScopeSub: "(Multiple selections allowed)",
            stepBudgetTitle: "Can we know the\napproximate budget?",
            stepScheduleTitle: "What is your expected\nschedule or duration?", startDate: "Start Date", endDate: "End Date",
            stepTeamTitle: "What is the size of\nyour current team?",
            stepCostTitle: "What is your approximate\nmonthly AI cost?", stepCostSub: "(It's okay if it's not exact)",
            stepToolsTitle: "Which AI tools are you\ncurrently using?", stepToolsSub: "(Multiple selections allowed)",
            stepConsultDateTitle: "When would you like\nto have a consultation?", consultDate: "Preferred Date",
            stepInfoTitle: "Please enter your\ninformation",
            stepExtraTitle: "Is there anything else\nwe should know?", fileUpload: "Attach Proposal (Max 3 files)", btnFileUpload: "Upload File",
            contactUs: "Contact Us",
            option: "OPTION",
            placeholders: {
                company: "COMPANY",
                name: "NAME",
                email: "EMAIL",
                phone: "PHONE"
            },
            sending: "Sending...", successTitle: "Submitted Successfully", successSub: "We will contact you shortly.",
            privacy: "I agree to the privacy policy.", year: "", month: "", period: "",
            contactBtn: "Contact Us",
            tooltipAiOPS: "Usage, cost, and ops management.", tooltipAX: "New service/system development.",
            maxDatesHint: "Max 3 dates allowed",
            placeholderAiTools: "Enter other tools or situation...", placeholderDetails: "(Optional)",
            options: WIZARD_CONSTANTS
        },
        caseStudy: {
            initialCards: ["I want to build new AI", "AI is being used but unorganized", "I'm not sure about our situation"],
            axNodeMapTexts: ["You need an AX Project", "Please select current state ->", "Let me ask a few questions for a precise diagnosis"],
            axScenarioTitle: "What kind of AI would you like to build?",
            axScenarioCards: ["AI-based New Service", "Internal AI Infrastructure", "RAG Construction", "Workflow Automation"],
            preparingTitle_3: "RAG Construction",
            preparingTitle_4: "Workflow Automation",
            preparingDesc: "The simulator for this service is currently being prepared.\nYou can receive detailed guidance through expert consultation.",
            preparingBtn: "Get Service Guidance via Expert Consultation",
            workflowTitle: "Internal AI Infrastructure",
            workflowViewHint: "Click a node on the left map to view details.",
            aiopsSimTitle: "Current State Simulation",
            aiopsSimFields: ["Team size", "AI users", "Monthly AI cost", "Number of teams"],
            aiopsSimBtn: "Generate Simulation",
            aiopsSimCurrencyUnit: "10k KRW",
            aiopsSimSavings: "Minimum {amount} saved",
            aiopsInquiryBtn: "Go to Inquiry",
            chatTitle: "AI-based New Service",
            diagnosisTitle: "AiOPS Diagnosis",
            chatInputPlaceholder: "Enter the feature you want to add...",
            diagInputPlaceholder: "Enter your answer...",
            chatConsultBtn: "Contact an Expert",
            chatInitMsg1: "I've simulated an initial IA (Information Architecture) for '{title}'. You can check it on the left node map.\n\nThis AI is a simplified model for demonstration. In actual service, experts and AI collaborate to provide higher quality results.",
            chatInitMsg2: "Would you like to add or refine any features? If you want a completely new IA, just let me know.",
            chatBusyMsg1: "This simulation AI is a demo version. For complex architecture design and detailed discussion, we recommend consulting with a professional consultant.",
            chatBusyMsg2: "Would you like to proceed with an expert consultation?",
            diagnosisInitMsg: "I'll ask you 5 questions for a precise diagnosis.\n\nFirst question: Is team-level AI usage aggregation available?",
            iaTemplates: [
                {
                    title: "Healthcare - AI Analysis SaaS for Patients",
                    root: {
                        label: "Healthcare SaaS",
                        common: "Common",
                        auth: "Auth (Login, Signup, Role)",
                        doctor: "Medical Staff",
                        doc_dash: "Dashboard (Analytics, High Risk Alert, Recent Uploads)",
                        doc_data: "Data Management (PDF/Image Upload, EMR Link, Value Mapping)",
                        doc_ai: "AI Analysis (Anomalies, Normal Range Comparison, Trend, Risk Prediction)",
                        doc_report: "Report Generation (Difficulty, Summary, Visualization, PDF)",
                        doc_history: "Analysis History (Patient History, Risk Trends, Edit History)",
                        patient: "Patient",
                        pat_result: "Results (Health Score, Risk Visualization, Explanation)",
                        pat_guide: "Guide (Follow-up, Lifestyle Advice, Booking)",
                        pat_qna: "AI Q&A (Result Q&A, Detailed Explanation)"
                    }
                },
                {
                    title: "Commerce - AI Demand Forecast Ordering System",
                    root: {
                        label: "Commerce Ordering",
                        common: "Common",
                        auth: "Auth (Login, Permissions)",
                        dash: "Dashboard",
                        dash_op: "Operations (Forecast, Out-of-Stock Risk, Over-stock, Required Qty)",
                        product: "Products",
                        prod_list: "SKU List (Stock, Forecast, Safety Stock, Run-out Date)",
                        prod_detail: "SKU Detail (History, Seasonality, Accuracy)",
                        order: "Auto-Order",
                        order_prop: "Proposals (Recommended Qty, Cost, Simulation, Confirm)",
                        order_erp: "ERP Link (Submission, History)",
                        data: "External Data",
                        data_api: "Data Integration (Weather API, SNS Trend, Ad Data, Events)",
                        report: "Report",
                        report_perf: "Performance (Accuracy, Turnover, Stock-out Rate, Cost Savings)"
                    }
                },
                {
                    title: "Manufacturing - AI Quality Inspection System",
                    root: {
                        label: "Quality Inspection",
                        common: "Common",
                        auth: "Auth (Login, Factory Select)",
                        dash: "Dashboard",
                        dash_rt: "Real-time (Inspection Qty, Defect Rate, Types, Line Status)",
                        inspect: "Inspection",
                        ins_rt: "Image Analysis (Source, Defects, Types, Pass/Fail)",
                        history: "History",
                        hist_view: "Record Search (Date, Line, Operator, Type Filter)",
                        model: "Model",
                        mod_op: "Operations (Version, Upload, Monitoring, Re-training)",
                        report: "Report",
                        rep_qual: "Quality Analysis (Process Trend, Variance, Root Cause, Proposals)"
                    }
                }
            ],
            workflowNodes: {
                req: "Request Received",
                req_api: "API Request Channel",
                review_man: "Manual Review",
                review_sys: "Integrated Request Channel",
                extract: "Data Extraction",
                agent: "AI AGENT (Extraction/Classification)",
                api_call: "Automated API Call",
                update_man: "Manual Update",
                update_auto: "Auto Update",
                email: "Send Email",
                noti: "Result Notification",
                wait: "Waiting for Reply",
                hitl: "HITL Expert Review"
            }
        }
    },
    ko: {
        toc: ["01. 기원 (GENESIS)", "02. 각성 (AWAKENING)", "03. 확장 (EXPANSION)", "04. 시너지 (SYNERGY)", "05. 조화 (HARMONY)", "06. 접속 (ACCESS)"],
        footer: {
            companyName: "(주) 소프트스퀘어드", ceo: "대표 이하늘", industry: "업종 컴퓨터 프로그래밍업", regNo: "사업자등록번호 723-81-01101",
            addrMain: "본사 (48733) 부산광역시 동구 중앙대로214번길 7-8, 24층 (초량동)",
            addrBranch: "지점 (06691) 서울특별시 서초구 방배천로2안길 75, 1, 2층 (방배동)",
            links: ["이용약관", "포인트 이용 약관", "개인정보 처리방침", "이메일무단수집 거부", "제3자마케팅동의"],
            copyright: "© 2026 Soft Squared. All rights reserved."
        },
        nodeGraph: {
            nodes: {
                web: { label: "웹훅", subLabel: "" },
                agent: { label: "AI 에이전트", subLabel: "도구 에이전트" },
                sw: { label: "스위치", subLabel: "" },
                get: { label: "속성 가져오기", subLabel: "" },
                post: { label: "URL 게시", subLabel: "" },
                del: { label: "삭제", subLabel: "" },
                conf1: { label: "문서", subLabel: "" },
                conf2: { label: "설정", subLabel: "" },
                conf3: { label: "웹", subLabel: "" },
                rss: { label: "트렌드 감지", subLabel: "" },
                gen: { label: "콘텐츠 생성", subLabel: "GPT-4o" },
                rev: { label: "검토", subLabel: "" },
                blog: { label: "워드프레스", subLabel: "" },
                social: { label: "링크드인", subLabel: "" },
                brand: { label: "브랜드 키트", subLabel: "" },
                tic: { label: "티켓 수신", subLabel: "" },
                class: { label: "분류기", subLabel: "파인튜닝" },
                kb: { label: "KB 검색", subLabel: "" },
                reply: { label: "자동 응답", subLabel: "" },
                esc: { label: "에스컬레이션", subLabel: "" },
                db: { label: "히스토리", subLabel: "" }
            },
            profiles: {
                web: { name: '시스템 훅', role: '이벤트 트리거' },
                agent: { name: '모델 오케스트레이터', role: 'AI 코어' },
                sw: { name: '마이크 로스', role: '프로덕트 오너' },
                get: { name: '데이터 페처', role: 'I/O 작업' },
                post: { name: '시스템 라이터', role: 'I/O 작업' },
                del: { name: '가비지 컬렉터', role: '정리' },
                rss: { name: '트렌드 와처 V1', role: '데이터 수집' },
                gen: { name: '크리에이터 LLM', role: '생성 코어' },
                rev: { name: '사라 리', role: '콘텐츠 리드' },
                blog: { name: 'CMS 커넥터', role: '퍼블리셔' },
                social: { name: 'SNS API', role: '배포자' },
                brand: { name: '브랜드 가드', role: '컨텍스트 제공자' },
                tic: { name: '서포트 인바운드', role: '트리거' },
                class: { name: '트라이아지 모델', role: '분류기' },
                kb: { name: '벡터 DB', role: '지식 베이스' },
                reply: { name: '응답 봇', role: '액션' },
                esc: { name: '데이비드 김', role: '서포트 매니저' },
                db: { name: '로그 스토어', role: '메모리' },
                conf1: { name: 'RAG 소스', role: '컨텍스트' },
                conf2: { name: '파라미터 스토어', role: '설정' },
                conf3: { name: '검색 도구', role: '외부 도구' }
            },
            sidebar: {
                title: "팀 워크플로우",
                dev: { title: "DevOps", sub: "자동화 파이프라인" },
                mkt: { title: "마케팅", sub: "콘텐츠 엔진" },
                sup: { title: "고객지원", sub: "티켓 라우팅" },
                monitor: "팀 성과 모니터"
            },
            ui: {
                zoom: "확대",
                autoSave: "자동 저장",
                efficiency: "효율성",
                reliability: "신뢰성"
            }
        },
        genesis: {
            leftNodes: ["개발자 A", "개발자 B", "개발자 C", "디자이너 A", "기획자 A"],
            rightNodes: ["Google", "Claude Code", "Claude", "BKIT", "Manifesto"],
            midComplex: ["개인 결제", "재무 요청", "팀 예산"],
            midSimple: ["프롬프트 개선", "GRIDGE AiOPS", "Context Storage"]
        },
        stage1: { line1: "AI PERFORMANCE", line2: "MATTERS" },
        stage2: { text1: "AI는 팀 곳곳에서 쓰이고 있지만,", text2: "누가, 어떻게 쓰는지는 보이지 않습니다." },
        stage2_transform: { text1: "AI를 활용하는 팀 곳곳을 확인하여,", text2: "누가, 어떻게 쓰고 있고, 써야 하는지, 보여드리겠습니다." },
        stage3: {
            title1: "Feature 1.", title2: "개발자 개인의 역량을", title3: "팀단위 퍼포먼스로",
            widgets: {
                profile: { name: "민경호", desc: "AI 기반 아키텍처 및 AX 중심의 핵심 개발자입니다." },
                score: { title: "5대 핵심 역량 진단", desc: "프롬프트 엔지니어링부터 검증 성숙도까지, 5가지 핵심 영역에 대해 개인별 역량을 정밀하게 진단합니다.", items: [{ l: "프롬프트 엔지니어링", v1: 3, v2: 4 }, { l: "프롬프트 효율성", v1: 2, v2: 3 }, { l: "기술적 깊이", v1: 3, v2: 4 }, { l: "검증 성숙도", v1: 2, v2: 3 }] },
                change: { title: "워크플로우 변화", desc: "'예쁘게 해주세요'와 같은 추상적 요청을 시각적 규칙과 DoD(Definition of Done)가 정의된 명확한 엔지니어링 표준으로 전환합니다.", before: "\"예쁘게 해주세요\"", after: ["Visual Rules Applied", "DoD Scope Defined"] },
                perf: { title: "수행 방식의 진화", desc: "단순 기능 구현 단계에서 벗어나, 상세 제약 사항과 구조를 먼저 확립하는 '설계 기반 구현'으로 업무 방식을 진화시킵니다.", s1: { t: "구현 중심 단계", d: "개별 모듈을 임시 방편으로 빠르게 생성" }, s2: { t: "설계 기반 구현 단계", d: "상세 제약 사항 전달 및 구조 확정 후 착수" } },
                effect: { title: "기대 효과 분석", desc: "반복적인 UI 수정 감소, 토큰 소비 비용 최적화, 그리고 결과물 수렴 속도 가속화 등 도입 효과를 정량적으로 분석합니다.", items: ["UI 반복 수정 횟수 감소", "토큰 소비 비용 최적화", "작업 결과 수렴 속도 가속"] },
                health: { title: "프로젝트 건전성 분석", desc: "커밋, 파일 변경, 사이클 타임 등 프로젝트의 코드 건전성과 개발 활동성을 실시간 데이터로 시각화합니다.", items: [{ l: "Code Commits", v: "556" }, { l: "Unique Files", v: "69" }, { l: "Avg Cycle Time", v: "107s" }, { l: "Stream Events", v: "2.3k" }] },
                sfia: { title: "글로벌 표준 역량 매핑", desc: "개인의 역량을 SFIA(Skills Framework for the Information Age) 글로벌 표준 프레임워크와 매핑하여 객관적인 수준을 제시합니다.", items: [{ l: "문제 정의 역량", v: "구조화 및 기능 분해" }, { l: "결과 재현성", v: "추상적 패턴 자동 형성" }, { l: "설계 거버넌스", v: "설계→승인→자동구현" }] }
            }
        },
        stage4_genesis: {
            text1: "AI를 각자 활용하는 팀은",
            text2: "회사 전체의 효율을 이뤄낼 수 없습니다."
        },
        stage5_genesis: {
            text1: "AI를 각자 활용하는 팀을",
            text2: "GRIDGE AiOPS로 한번에 관리하세요"
        },
        stage6_genesis: {
            text1: "쓰던 비용 그대로, 쓰던 AI 서비스 그대로",
            text2: "아래 혜택들과 추가 기능들을 경험하세요"
        },
        stage4: {
            title1: "Feature 2.", title2: "개발자의 AI 개발자로", title3: "커리어 확장 그리고 성장",
            cards: {
                trad: { title: "기존 개발자", sub: "주어진 명세를 구현합니다.\n문법과 로직 중심.", outLabel: "Output", outVal: "기능 (Function)", skill: "Syntax Mastery" },
                ai: { title: "AI 엔지니어", sub: "AI와 함께 설계합니다.\n맥락과 조율 중심.", outLabel: "Output", outVal: "제품 (Product)", skill: "Context Control" }
            }
        },
        stage5: {
            title1: "Feature 3.", title2: "개발자에서 멈춰선 안되죠", title3: "팀 단위 AX 역량 강화",
            widgets: {
                lifecycle: {
                    title: "3.1 SW 생명주기 분포 (조직 전체)",
                    data: [{ l: "구현", v: 70 }, { l: "요구사항 분석", v: 15 }, { l: "운영/유지보수", v: 8 }, { l: "테스트", v: 5 }, { l: "설계/아키텍처", v: 2 }],
                    interp: { title: "INTERPRETATION", text: "AI 활용이 구현 단계에 극도로 편중(70%)되어 있습니다." },
                    implic: { title: "IMPLICATION", text: "설계·검증 단계로 AI를 이동시키는 것이 ROI 개선의 핵심 레버리지입니다." }
                },
                intent: {
                    title: "3.2 과업 의도 분포 (Task Intent)",
                    data: [{ l: "생성", v: 60, c: "bg-blue-600" }, { l: "디버깅", v: 20, c: "bg-blue-500" }, { l: "문서화", v: 15, c: "bg-blue-400" }, { l: "운영지원", v: 5, c: "bg-blue-300" }],
                    insight: "현재는 Execution 중심 조직입니다. Decision/Review 활용을 늘릴 경우 설계 품질과 시니어 생산성을 동시에 개선할 수 있습니다."
                },
                artifact: {
                    title: "2.3 산출물 기준 분포",
                    data: [{ l: "애플리케이션 코드", v: 72 }, { l: "문서/설계 산출물", v: 11 }, { l: "인프라/CICD", v: 8 }, { l: "데이터/스키마", v: 6 }, { l: "테스트코드", v: 3 }],
                    note: "* 애플리케이션 코드(72%) 중심 사용. 테스트 코드(3%) 활용 미비는 운영 리스크로 이어질 수 있습니다."
                },
                strategy: {
                    title: "2.4 조직 AI 전략 포지셔닝",
                    current: { title: "CURRENT STATE", text: "Execution 중심: 생산성은 빠르게 올리지만, 설계 품질 및 기술 부채 억제에는 한계가 있는 단계입니다." },
                    next: { title: "NEXT STEP: LV.3 TRANSITION", text: "개인 생산성 단계를 넘어 조직 생산성 단계로 진입하기 위해 decision/hybrid + validation을 표준 프로세스로 내재화해야 합니다." }
                },
                defects: {
                    title: "2.5 조직 SDLC 구조적 결함 분석",
                    stats: [{ l: "Short 프롬프트", v: "65.3%" }, { l: "Rich Context 활용", v: "54.4%" }, { l: "Validation 부재", v: "88.3%" }],
                    risk: { title: "RISK PATTERN", text: "\"구현/생성 편중 + 저검증 구조\"는 재작업 비용을 뒤로 미루는 패턴입니다. 설계 2.8%, 테스트 2.9%의 수치는 기술 부채를 사전에 차단할 기회를 상실하고 있음을 의미합니다." }
                },
                collab: {
                    title: "3.1 팀별 협업 성숙도 격차",
                    headers: ["TEAM", "PROFILE", "EFF. SCORE", "VALIDATION", "USAGE"],
                    rows: [
                        { t: "C3", p: "Type 1", s: 85, v: "18.5%", u: "240 pts" },
                        { t: "B1", p: "Type 1", s: 82, v: "24.1%", u: "210 pts" },
                        { t: "A1", p: "Type 1", s: 80, v: "15.2%", u: "190 pts" },
                        { t: "B5", p: "Type 2", s: 65, v: "8.4%", u: "280 pts" },
                        { t: "A5", p: "Type 2", s: 62, v: "7.1%", u: "260 pts" },
                        { t: "B4", p: "Type 3", s: 45, v: "5.2%", u: "80 pts" },
                        { t: "C1", p: "Type 4", s: 40, v: "0%", u: "50 pts" }
                    ]
                },
                bias: {
                    title: "3.2 팀 SDLC 편향 분석",
                    chart: [
                        { t: "C3", d: 12.6, te: 5, i: 82.4 },
                        { t: "B3", d: 11.1, te: 4, i: 84.9 },
                        { t: "D4", d: 8.5, te: 3, i: 88.5 },
                        { t: "B1", d: 5, te: 8, i: 87 },
                        { t: "A2", d: 4, te: 7, i: 89 }
                    ],
                    insight: "설계 비중 상위 팀(C3 12.6%, B3 11.1%)과 테스트 비중 상위 팀(D4 8.5%)의 활용 모델을 분석하여 앞단(Shift-Left) AI 활용 모델을 정립해야 합니다."
                },
                standard: {
                    title: "3.4 팀 표준화 성숙도 (프롬프트 재사용)",
                    mainStat: "86.8%",
                    segments: [{ l: "C1, C2 Team", v: "100%" }, { l: "D4 Team", v: "95%" }],
                    rca: { title: "Root Cause Analysis", text: "좋은 프롬프트가 있어도 팀 내 공유나 재사용이 전혀 되지 않는 구조입니다. 팀별 'Prompt Library' 채널 개설 및 표준 템플릿 도입이 시급합니다." }
                }
            }
        },
        stage6: {
            title1: "Feature 4. (개발중)", title2: "우리 개발 팀을", title3: "AI Agent로",
            nodeDetails: {
                'planning': {
                    name: 'AI-Req-Interpreter', role: '"Requirement Structuring & AC Generation"', capabilities: "모호한 요구사항을 식별하고 수락 기준(AC) 초안을 생성하여 가장 앞단에서 품질 기준을 수립합니다.", problemTarget: "개발자 간 해석 차이 및 기획 누락으로 인한 재작업"
                },
                'design': {
                    name: 'AI-Architect', role: '"Design Options & Risk Analysis"', capabilities: "여러 설계 옵션의 트레이드오프를 분석하고 시니어 개발자의 최종 의사결정을 지원합니다.", problemTarget: "Type 2 팀의 \"일단 만들고 고치기\" 패턴 및 운영 리스크"
                },
                'execution': {
                    name: 'AI-Code-Generator', role: '"Execution based on Design"', capabilities: "확정된 아키텍처 설계를 기반으로 실제 구현 코드를 생성합니다.", problemTarget: "단순 구현 반복 및 생산성 저하"
                },
                'val_top': {
                    name: 'AI-Validator', role: '"Constraint Check & Edge Cases"', capabilities: "요구사항과 설계 기준 충족 여부를 체크하고 엣지 케이스를 지적합니다.", problemTarget: "검증 없는 코드 적용 및 디버깅 반복"
                },
                'val_bot': {
                    name: 'AI-Reviewer / Tester', role: '"PR Summary & Test Generation"', capabilities: "단위 테스트를 생성하고 PR 리뷰를 요약하여 품질 및 유지보수성을 체크합니다.", problemTarget: "테스트/리뷰 병목 및 시니어 과부하"
                },
                'operations': {
                    name: 'AI-Incident-Analyst', role: '"Root Cause & Runbook Generator"', capabilities: "장애 발생 시 로그와 알람을 기반으로 원인을 분석하고 대응 절차를 자동 생성합니다.", problemTarget: "운영 지식의 개인 종속 및 MTTR 지연"
                },
                'knowledge': {
                    name: 'AI-Knowledge-Curator', role: '"Assetization of Intelligence"', capabilities: "의미 있는 프롬프트와 결과를 선별하여 조직 자산으로 박제하고 팀 내 공유합니다.", problemTarget: "Low Reuse Prompt (86.8%) 및 조직 학습 부재"
                },
                'req_interpreter': {
                    name: 'AI-Req-Interpreter', role: '"Requirement Structuring & AC Generation"', capabilities: "모호한 요구사항을 식별하고 수락 기준(AC) 초안을 생성하여 가장 앞단에서 품질 기준을 수립합니다.", problemTarget: "개발자 간 해석 차이 및 기획 누락으로 인한 재작업"
                },
                'architect': {
                    name: 'AI-Architect', role: '"Design Options & Risk Analysis"', capabilities: "여러 설계 옵션의 트레이드오프를 분석하고 시니어 개발자의 최종 의사결정을 지원합니다.", problemTarget: "Type 2 팀의 \"일단 만들고 고치기\" 패턴 및 운영 리스크"
                },
                'code_gen': {
                    name: 'AI-Code-Generator', role: '"Execution based on Design"', capabilities: "확정된 아키텍처 설계를 기반으로 실제 구현 코드를 생성합니다.", problemTarget: "단순 구현 반복 및 생산성 저하"
                },
                'validator': {
                    name: 'AI-Validator', role: '"Constraint Check & Edge Cases"', capabilities: "요구사항과 설계 기준 충족 여부를 체크하고 엣지 케이스를 지적합니다.", problemTarget: "검증 없는 코드 적용 및 디버깅 반복"
                },
                'test_gen': {
                    name: 'AI-Test-Generator', role: '"Unit & Integration"', capabilities: "단위 테스트와 통합 테스트 코드를 생성하여 개발자의 테스트 작성 부담을 줄여줍니다.", problemTarget: "테스트 커버리지 부족"
                },
                'reviewer': {
                    name: 'AI-Reviewer / Tester', role: '"PR Summary & Test Generation"', capabilities: "단위 테스트를 생성하고 PR 리뷰를 요약하여 품질 및 유지보수성을 체크합니다.", problemTarget: "테스트/리뷰 병목 및 시니어 과부하"
                },
                'incident': {
                    name: 'AI-Incident-Analyst', role: '"Root Cause & Runbook Generator"', capabilities: "장애 발생 시 로그와 알람을 기반으로 원인을 분석하고 대응 절차를 자동 생성합니다.", problemTarget: "운영 지식의 개인 종속 및 MTTR 지연"
                },
                'runbook': {
                    name: 'AI-Runbook-Gen', role: '"Response Ready"', capabilities: "장애 상황에 맞는 실행 가능한 런북을 즉시 생성하여 대응 시간을 단축합니다.", problemTarget: "매뉴얼 부재 및 대응 지연"
                },
                'gen': {
                    name: 'AI-Code-Generator', role: '"Execution based on Design"', capabilities: "확정된 아키텍처 설계를 기반으로 실제 구현 코드를 생성합니다.", problemTarget: "단순 구현 반복 및 생산성 저하"
                },
                'ops': {
                    name: 'AI-Incident-Analyst', role: '"Root Cause & Runbook Generator"', capabilities: "장애 발생 시 로그와 알람을 기반으로 원인을 분석하고 대응 절차를 자동 생성합니다.", problemTarget: "운영 지식의 개인 종속 및 MTTR 지연"
                },
                'arch': {
                    name: 'Arch Gap', role: '"High Risk Area"', capabilities: "설계가 누락된 상태로 구현에 진입하여 발생하는 기술 부채 영역입니다.", problemTarget: "재작업 비용 증가"
                },
                'review': {
                    name: 'Review Bottleneck', role: '"Process Slowdown"', capabilities: "시니어 개발자의 리뷰 대기 시간으로 인한 전체 파이프라인 지연입니다.", problemTarget: "배포 주기 지연"
                },
                'repo': {
                    name: 'AI-Knowledge-Curator', role: '"Assetization of Intelligence"', capabilities: "의미 있는 프롬프트와 결과를 선별하여 조직 자산으로 박제하고 팀 내 공유합니다.", problemTarget: "Low Reuse Prompt (86.8%) 및 조직 학습 부재"
                }
            }
        },
        stage7: {
            headlinePart1: "GRIDGE AiOPS와 함께, ", headlinePart2: "개발팀의 압도적 격차", headlinePart3: "를 만드세요.",
            intro: "현재 AI에 지출하던 비용 그대로, 사용하던 서비스 그대로,\n그릿지 AiOPS 기능은 보너스로!",
            benefitTitle: "얼리버드 억세스", btnStart: "얼리버드 상담 신청",
            benefits: [
                { title: "AI Token 10% 할인", detail: "3개월 간 현재 사용 중인 모든 AI 비용 10% 페이백 (클로드, 커서 등)" },
                { title: "모니터링 1년 무료", detail: "실시간 사용량 모니터링 및 이상 징후 감지 솔루션 1년 간 무료 제공" },
                { title: "전담 컨설팅 3회", detail: "1년 약정 시 AI TaskForce 컨설팅 3회 무상 제공 (1500만원 상당)" },
                { title: "구매 우선권 제공", detail: "향후 출시되는 모든 GRIDGE AiOPS 서비스 10% 할인 및 우선 도입 권한 제공" }
            ]
        },
        chatbot: {
            greeting: "안녕하세요! GRIDGE AI 어시스턴트입니다. 오늘 팀의 워크플로우 최적화를 위해 무엇을 도와드릴까요?",
            name: "GRIDGE AI 어시스턴트",
            status: "온라인",
            thinking: "생각 중...",
            placeholder: "GRIDGE에 대해 물어보세요...",
            disclaimer: "AI는 실수를 할 수 있습니다. 중요한 정보를 확인하세요.",
            error: "오류: "
        },
        wizard: {
            startTitle: "안녕하세요,\n그릿지와 함께\nAX할 준비가 되셨나요?", startSub: "(두 가지 모두 선택 가능합니다)",
            typeProject: "AX 프로젝트 의뢰", typeOther: "AiOPS 도입 문의",
            btnStart: "시작하기", btnNext: "다음", btnPrev: "이전", btnSubmit: "제출하기", btnClose: "닫기",
            stepScopeTitle: "프로젝트의\n업무 범위를\n선택해 주세요", stepScopeSub: "(복수 선택 가능)",
            stepBudgetTitle: "대략적인 예산을\n알려주실 수 있나요?",
            stepScheduleTitle: "예상하시는 일정이나\n기간이 어떻게 되나요?", startDate: "시작 희망일", endDate: "종료 희망일",
            stepTeamTitle: "지금 함께 일하고 있는\n팀 규모는 어느 정도인가요?",
            stepCostTitle: "한 달에 AI 비용으로\n대략 어느 정도를 사용하시나요?", stepCostSub: "(정확하지 않아도 괜찮아요. 감으로 선택해 주세요)",
            stepToolsTitle: "현재 주로 사용하고 있는\nAI가 있다면 알려주세요.", stepToolsSub: "(여러 개 선택하셔도 됩니다)",
            stepConsultDateTitle: "상담이 가능한\n일정이 있으신가요?", consultDate: "상담 희망일",
            stepInfoTitle: "의뢰자님의\n정보를 입력해 주세요",
            stepExtraTitle: "그 외에 저희가\n참고해야 할 내용이 있나요?", fileUpload: "제안서나 참고 자료 첨부 (최대 3개, 20MB)", btnFileUpload: "파일 첨부하기",
            contactUs: "문의하기",
            option: "옵션",
            placeholders: {
                company: "회사명",
                name: "이름",
                email: "이메일",
                phone: "전화번호"
            },
            sending: "전송 중...", successTitle: "문의가 접수되었습니다", successSub: "담당자가 확인 후 빠르게 연락드리겠습니다.",
            privacy: "개인정보 처리방침에 동의합니다.", year: "년", month: "월", period: "",
            contactBtn: "문의하기",
            tooltipAiOPS: "이미 AI를 사용 중이며, 사용·비용·운영 관리가 필요한 경우", tooltipAX: "신규 서비스·시스템·AI 연동 개발이 필요한 경우",
            maxDatesHint: "상담 일시는 최대 3개까지 선택 가능합니다",
            placeholderAiTools: "사용 중인 AI 툴이나 상황을 입력해주세요", placeholderDetails: "(선택사항)",
            options: {
                scopes: ["비즈니스 전략", "AX 전환", "AI도입 프로젝트", "LLM", "RAG", "솔루션 개발", "파견 협업", "UXUI 디자인", "웹사이트", "앱", "프론트엔드", "백엔드", "SaaS", "커머스", "마켓플레이스", "매칭", "마도로스", "정부 지원", "실증 사업", "AR/VR/3D", "기타"],
                budgets: ["1,000만원 미만", "1~2,000만원", "2~3,000만원", "3~4,000만원", "4~5,000만원", "5,000~1억원", "1억원 이상"],
                teamSizes: ["1~5명", "6~20명", "21~50명", "51~100명", "101명 이상"],
                aiCosts: ["사용 안 함", "100만원 미만", "100~500만원", "500~1,000만원", "1,000~5,000만원", "5,000만원 이상"],
                aiTools: ["ChatGPT", "Gemini", "Gemini (기업용)", "Google API", "Claude Code", "Claude", "Grok", "기타"],
                periods: ["초", "중순", "말"]
            }
        },
        caseStudy: {
            initialCards: ["AI를 새로 만들고 싶다", "AI를 쓰고 있는데 정리가 안 된다", "어떤 상태인지 모르겠다"],
            axNodeMapTexts: ["AX 프로젝트가 필요하시군요", "지금 현재 상태를 선택해 주세요 ->", "정확한 진단을 위해 몇 가지 질문을 드릴게요"],
            axScenarioTitle: "어떤 AI를 만들고 싶으세요?",
            axScenarioCards: ["AI 기반 신규 서비스", "내부 AI 인프라 개선", "RAG 구축", "업무 자동화"],
            preparingTitle_3: "RAG 구축",
            preparingTitle_4: "업무 자동화",
            preparingDesc: "해당 서비스의 시뮬레이션은 현재 준비 중입니다.\n전문가 상담을 통해 상세한 안내를 받으실 수 있습니다.",
            preparingBtn: "전문가 상담으로 서비스 안내 받기",
            workflowTitle: "내부 AI 인프라 개선",
            workflowViewHint: "좌측 노드 맵에서 노드를 클릭하여 상세 정보를 확인하세요.",
            aiopsSimTitle: "현재 상태 시뮬레이션",
            aiopsSimFields: ["팀 인원 수", "AI 사용자 수", "월 AI 사용 비용", "팀 수"],
            aiopsSimBtn: "시뮬레이션 생성",
            aiopsSimCurrencyUnit: "만원",
            aiopsSimSavings: "최소 {amount}만원 절약",
            aiopsInquiryBtn: "도입 문의 하러 가기",
            chatTitle: "AI 기반 신규 서비스",
            diagnosisTitle: "AiOPS 진단",
            chatInputPlaceholder: "추가하고 싶은 기능을 입력하세요...",
            diagInputPlaceholder: "답변을 입력하세요...",
            chatConsultBtn: "전문가 상담 신청하기",
            chatInitMsg1: "가상으로 '{title}'의 초기 IA(Information Architecture)를 구현해 봤습니다. 왼쪽 노드 맵에서 확인하실 수 있습니다.\n\n본 AI는 체험을 위해 단순화된 모델이며, 실제 서비스에서는 전문가와 AI가 협업하여 더욱 수준 높은 서비스를 제공해 드립니다.",
            chatInitMsg2: "추가적으로 변형하거나 구체화하고 싶은 기능이 있으신가요? 완전히 새로운 IA를 원하신다면 말씀해 주세요.",
            chatBusyMsg1: "본 시뮬레이션 AI는 데모 버전으로, 더 복잡한 아키텍처 설계와 구체적인 논의는 전문 컨설턴트와의 상담을 통해 진행하는 것을 권장드립니다.",
            chatBusyMsg2: "전문가와 상담을 진행하시겠습니까?",
            diagnosisInitMsg: "정확한 진단을 위해 5가지 질문을 드리겠습니다.\n\n첫 번째 질문입니다. 팀 단위 AI 사용 집계가 가능한가요?",
            iaTemplates: [
                {
                    title: "헬스케어 - AI 검사결과 자동 해석 및 환자용 설명 생성 SaaS",
                    root: {
                        label: "헬스케어 SaaS",
                        common: "공통",
                        auth: "인증 (로그인, 회원가입, 역할 선택)",
                        doctor: "의료진",
                        doc_dash: "대시보드 (오늘 분석 건수, 고위험 환자 알림, 최근 업로드 목록)",
                        doc_data: "검사 데이터 관리 (PDF/이미지 업로드, EMR 연동, 수치 매핑)",
                        doc_ai: "AI 분석 결과 (이상 수치 하이라이트, 정상 범위 비교, 변화율, 리스크 예측, 권고 제안)",
                        doc_report: "환자용 리포트 생성 (난이도 선택, 요약 생성, 시각화, PDF 다운로드)",
                        doc_history: "분석 이력 관리 (환자별 기록, 리스크 추이, 수정 이력)",
                        patient: "환자",
                        pat_result: "내 검사 결과 (건강 점수, 위험도 시각화, 이상 항목 설명)",
                        pat_guide: "다음 행동 가이드 (재검 여부, 생활 습관 권고, 예약 연동)",
                        pat_qna: "AI 질문하기 (결과 Q&A, 추가 설명 요청)"
                    }
                },
                {
                    title: "커머스 - AI 수요예측 기반 자동 발주 시스템",
                    root: {
                        label: "커머스 발주 시스템",
                        common: "공통",
                        auth: "인증 (로그인, 사용자 권한 관리)",
                        dash: "대시보드",
                        dash_op: "운영 현황 (예상 판매량, 품절 위험, 과잉 재고, 발주 필요 수)",
                        product: "상품 관리",
                        prod_list: "SKU 리스트 (현재 재고, 예측 판매량, 안전 재고, 소진일)",
                        prod_detail: "SKU 상세 (과거 추이, 시즌성, 예측 정확도)",
                        order: "자동 발주",
                        order_prop: "발주 제안 (추천 수량, 예상 비용, 시뮬레이션, 확정)",
                        order_erp: "ERP 연동 (발주 전송, 이력 조회)",
                        data: "외부 데이터",
                        data_api: "데이터 연동 (날씨 API, SNS 트렌드, 광고 데이터, 이벤트)",
                        report: "리포트",
                        report_perf: "성과 분석 (예측 정확도, 재고 회전율, 품절률 감소, 비용 절감)"
                    }
                },
                {
                    title: "제조 - AI 품질 검사 이미지 시스템",
                    root: {
                        label: "제조 품질 검사",
                        common: "공통",
                        auth: "인증 (로그인, 공장 선택)",
                        dash: "대시보드",
                        dash_rt: "실시간 현황 (총 검사 수량, 불량률, 유형 분포, 라인별 현황)",
                        inspect: "검사 화면",
                        ins_rt: "실시간 이미지 분석 (원본, 결함 하이라이트, 유형 분류, 합격/불합격)",
                        history: "이력 관리",
                        hist_view: "검사 기록 조회 (날짜별, 라인별, 작업자별, 유형 필터)",
                        model: "모델 관리",
                        mod_op: "모델 운영 (버전 관리, 데이터 업로드, 정확도 모니터링, 재학습 요청)",
                        report: "분석 리포트",
                        rep_qual: "품질 분석 (공정별 추이, 시간대별 편차, 원인 예측, 개선 제안)"
                    }
                }
            ],
            workflowNodes: {
                req: "요청 접수",
                req_api: "API 요청 접수",
                review_man: "수동 검토",
                review_sys: "통합 요청 접수",
                extract: "데이터 추출",
                agent: "AI AGENT (추출/분류)",
                api_call: "자동화 API 호출",
                update_man: "수동 업데이트",
                update_auto: "자동 업데이트",
                email: "이메일 발송",
                noti: "결과 알림",
                wait: "회신 대기",
                hitl: "HITL 전문가 검토"
            }
        }
    },
    ja: {
        toc: ["01. 起源 (GENESIS)", "02. 覚醒 (AWAKENING)", "03. 拡張 (EXPANSION)", "04. シナジー (SYNERGY)", "05. 調和 (HARMONY)", "06. 接続 (ACCESS)"],
        footer: {
            companyName: "(株) Soft Squared", ceo: "代表 Ha-neul Lee", industry: "業種 コンピュータプログラミング業", regNo: "事業者登録番号 723-81-01101",
            addrMain: "本社 (48733) 釜山広域市東区中央大路214番ギル7-8、24階 (草梁洞)",
            addrBranch: "支店 (06691) ソウル特別市瑞草区方背川路2アンギル75、1、2階 (方背洞)",
            links: ["利用規約", "ポイント利用規約", "個人情報処理方針", "メール無断収集拒否", "第三者マーケティング同意"],
            copyright: "© 2026 Soft Squared. All rights reserved."
        },
        nodeGraph: {
            nodes: {
                web: { label: "Webhook", subLabel: "" },
                agent: { label: "AIエージェント", subLabel: "ツールエージェント" },
                sw: { label: "スイッチ", subLabel: "" },
                get: { label: "プロパティ取得", subLabel: "" },
                post: { label: "URL投稿", subLabel: "" },
                del: { label: "削除", subLabel: "" },
                conf1: { label: "ドキュメント", subLabel: "" },
                conf2: { label: "設定", subLabel: "" },
                conf3: { label: "Web", subLabel: "" },
                rss: { label: "トレンド監視", subLabel: "" },
                gen: { label: "コンテンツ生成", subLabel: "GPT-4o" },
                rev: { label: "レビュー", subLabel: "" },
                blog: { label: "WordPress", subLabel: "" },
                social: { label: "LinkedIn", subLabel: "" },
                brand: { label: "ブランドキット", subLabel: "" },
                tic: { label: "チケット受信", subLabel: "" },
                class: { label: "分類器", subLabel: "ファインチューニング" },
                kb: { label: "KB検索", subLabel: "" },
                reply: { label: "自動応答", subLabel: "" },
                esc: { label: "エスカレーション", subLabel: "" },
                db: { label: "履歴", subLabel: "" }
            },
            profiles: {
                web: { name: 'システムフック', role: 'イベントトリガー' },
                agent: { name: 'モデルオーケストレーター', role: 'AIコア' },
                sw: { name: 'マイク・ロス', role: 'プロダクトオーナー' },
                get: { name: 'データフェッチャー', role: 'I/O操作' },
                post: { name: 'システムライター', role: 'I/O操作' },
                del: { name: 'ガベージコレクター', role: 'クリーンアップ' },
                rss: { name: 'トレンドウォッチャーV1', role: 'データ収集' },
                gen: { name: 'クリエイターLLM', role: '生成コア' },
                rev: { name: 'サラ・リー', role: 'コンテンツリード' },
                blog: { name: 'CMSコネクター', role: 'パブリッシャー' },
                social: { name: 'SNS API', role: 'ディストリビューター' },
                brand: { name: 'ブランドガード', role: 'コンテキストプロバイダー' },
                tic: { name: 'サポートインバウンド', role: 'トリガー' },
                class: { name: 'トリアージモデル', role: '分類器' },
                kb: { name: 'ベクトルDB', role: 'ナレッジベース' },
                reply: { name: '応答ボット', role: 'アクション' },
                esc: { name: 'デイビッド・キム', role: 'サポートマネージャー' },
                db: { name: 'ログストア', role: 'メモリ' },
                conf1: { name: 'RAGソース', role: 'コンテキスト' },
                conf2: { name: 'パラメータストア', role: '設定' },
                conf3: { name: '検索ツール', role: '外部ツール' }
            },
            sidebar: {
                title: "チームワークフロー",
                dev: { title: "DevOps", sub: "自動化パイプライン" },
                mkt: { title: "マーケティング", sub: "コンテンツエンジン" },
                sup: { title: "サポート", sub: "チケットルーティング" },
                monitor: "チームパフォーマンスモニター"
            },
            ui: {
                zoom: "ズーム",
                autoSave: "自動保存",
                efficiency: "効率性",
                reliability: "信頼性"
            }
        },
        genesis: {
            leftNodes: ["開発者 A", "開発者 B", "開発者 C", "デザイナー A", "企画者 A"],
            rightNodes: ["Google", "Claude Code", "Claude", "BKIT", "Manifesto"],
            midComplex: ["個人決済", "財務リクエスト", "チーム予算"],
            midSimple: ["プロンプト改善", "GRIDGE AiOPS", "Context Storage"]
        },
        stage1: { line1: "AI PERFORMANCE", line2: "MATTERS" },
        stage2: { text1: "AIはチームの至る所で使われていますが、", text2: "誰が、どのように使っているかは見えません。" },
        stage2_transform: { text1: "AIを活用しているチームの至る所を確認し、", text2: "誰が、どのように使っていて、使うべきか、お見せします。" },
        stage3: {
            title1: "Feature 1.", title2: "開発者個人の力量を", title3: "チーム単位のパフォーマンスへ",
            widgets: {
                profile: { name: "Min Kyungho", desc: "AIベースのアーキテクチャおよびAX中心のコア開発者です。" },
                score: { title: "5大核心力量診断", desc: "プロンプトエンジニアリングから検証成熟度まで、5つの核心領域について個人の力量を精密に診断します。", items: [{ l: "プロンプトエンジニアリング", v1: 3, v2: 4 }, { l: "プロンプト効率性", v1: 2, v2: 3 }, { l: "技術的深さ", v1: 3, v2: 4 }, { l: "検証成熟度", v1: 2, v2: 3 }] },
                change: { title: "ワークフローの変化", desc: "「きれいにしてください」のような抽象的な要求を、視覚的ルールとDoD(Definition of Done)が定義された明確なエンジニアリング標準に転換します。", before: "\"きれいにしてください\"", after: ["Visual Rules Applied", "DoD Scope Defined"] },
                perf: { title: "遂行方式の進化", desc: "単純な機能実装段階から脱却し、詳細な制約事項と構造を先に確立する「設計ベースの実装」へと業務方式を進化させます。", s1: { t: "実装中心段階", d: "個別モジュールを一時しのぎで素早く生成" }, s2: { t: "設計ベース実装段階", d: "詳細制約事項の伝達および構造確定後に着手" } },
                effect: { title: "期待効果分析", desc: "反復的なUI修正の減少、トークン消費費用の最適化、そして成果物の収束速度の加速など、導入効果を定量的に分析します。", items: ["UI反復修正回数の減少", "トークン消費費用の最適化", "作業結果収束速度の加速"] },
                health: { title: "プロジェクト健全性分析", desc: "コミット、ファイル変更、サイクルタイムなど、プロジェクトのコード健全性と開発活動性をリアルタイムデータで可視化します。", items: [{ l: "Code Commits", v: "556" }, { l: "Unique Files", v: "69" }, { l: "Avg Cycle Time", v: "107s" }, { l: "Stream Events", v: "2.3k" }] },
                sfia: { title: "グローバル標準力量マッピング", desc: "個人の力量をSFIA(Skills Framework for the Information Age)グローバル標準フレームワークとマッピングし、客観的なレベルを提示します。", items: [{ l: "問題定義力量", v: "構造化および機能分解" }, { l: "結果再現性", v: "抽象的パターンの自動形成" }, { l: "設計ガバナンス", v: "設計→承認→自動実装" }] }
            }
        },
        stage4_genesis: {
            text1: "AIを各自で活用するチームは",
            text2: "会社全体の効率を達成できません。"
        },
        stage5_genesis: {
            text1: "AIを各自で活用するチームを",
            text2: "GRIDGE AiOPSで一度に管理してください"
        },
        stage6_genesis: {
            text1: "使っていた費用のまま、使っていたAIサービスのまま",
            text2: "以下の特典と追加機能を体験してください"
        },
        stage4: {
            title1: "Feature 2.", title2: "開発者からAIエンジニアへ", title3: "キャリア拡張そして成長",
            cards: {
                trad: { title: "既存の開発者", sub: "与えられた仕様を実装します。\n文法とロジック中心。", outLabel: "Output", outVal: "機能 (Function)", skill: "Syntax Mastery" },
                ai: { title: "AIエンジニア", sub: "AIと共に設計します。\n文脈と調整中心。", outLabel: "Output", outVal: "製品 (Product)", skill: "Context Control" }
            }
        },
        stage5: {
            title1: "Feature 3.", title2: "開発者で止まってはいけません", title3: "チーム単位のAX力量強化",
            widgets: {
                lifecycle: {
                    title: "3.1 SWライフサイクル分布 (組織全体)",
                    data: [{ l: "実装", v: 70 }, { l: "要求事項分析", v: 15 }, { l: "運営/保守", v: 8 }, { l: "テスト", v: 5 }, { l: "設計/アーキテクチャ", v: 2 }],
                    interp: { title: "INTERPRETATION", text: "AI活用が実装段階に極端に偏重(70%)しています。" },
                    implic: { title: "IMPLICATION", text: "設計・検証段階へAIを移動させることがROI改善の核心レバレッジです。" }
                },
                intent: {
                    title: "3.2 タスク意図分布 (Task Intent)",
                    data: [{ l: "生成", v: 60, c: "bg-blue-600" }, { l: "デバッグ", v: 20, c: "bg-blue-500" }, { l: "文書化", v: 15, c: "bg-blue-400" }, { l: "運営支援", v: 5, c: "bg-blue-300" }],
                    insight: "現在はExecution中心の組織です。Decision/Review活用を増やすことで、設計品質とシニアの生産性を同時に改善できます。"
                },
                artifact: {
                    title: "2.3 成果物基準分布",
                    data: [{ l: "アプリコード", v: 72 }, { l: "文書/設計成果物", v: 11 }, { l: "インフラ/CICD", v: 8 }, { l: "データ/スキーマ", v: 6 }, { l: "テストコード", v: 3 }],
                    note: "* アプリケーションコード(72%)中心の使用。テストコード(3%)活用の不備は運営リスクにつながる可能性があります。"
                },
                strategy: {
                    title: "2.4 組織AI戦略ポジショニング",
                    current: { title: "CURRENT STATE", text: "Execution中心: 生産性は素早く上がりますが、設計品質および技術的負債の抑制には限界がある段階です。" },
                    next: { title: "NEXT STEP: LV.3 TRANSITION", text: "個人生産性段階を超え、組織生産性段階へ進入するために、decision/hybrid + validationを標準プロセスとして内在化する必要があります。" }
                },
                defects: {
                    title: "2.5 組織SDLC構造的欠陥分析",
                    stats: [{ l: "Shortプロンプト", v: "65.3%" }, { l: "Rich Context活用", v: "54.4%" }, { l: "Validation不在", v: "88.3%" }],
                    risk: { title: "RISK PATTERN", text: "\"実装/生成偏重 + 低検証構造\"は再作業費用を先送りするパターンです。設計2.8%、テスト2.9%の数値は、技術的負債を事前に遮断する機会を喪失していることを意味します。" }
                },
                collab: {
                    title: "3.1 チーム別協業成熟度格差",
                    headers: ["TEAM", "PROFILE", "EFF. SCORE", "VALIDATION", "USAGE"],
                    rows: [
                        { t: "C3", p: "Type 1", s: 85, v: "18.5%", u: "240 pts" },
                        { t: "B1", p: "Type 1", s: 82, v: "24.1%", u: "210 pts" },
                        { t: "A1", p: "Type 1", s: 80, v: "15.2%", u: "190 pts" },
                        { t: "B5", p: "Type 2", s: 65, v: "8.4%", u: "280 pts" },
                        { t: "A5", p: "Type 2", s: 62, v: "7.1%", u: "260 pts" },
                        { t: "B4", p: "Type 3", s: 45, v: "5.2%", u: "80 pts" },
                        { t: "C1", p: "Type 4", s: 40, v: "0%", u: "50 pts" }
                    ]
                },
                bias: {
                    title: "3.2 チームSDLC偏向分析",
                    chart: [
                        { t: "C3", d: 12.6, te: 5, i: 82.4 },
                        { t: "B3", d: 11.1, te: 4, i: 84.9 },
                        { t: "D4", d: 8.5, te: 3, i: 88.5 },
                        { t: "B1", d: 5, te: 8, i: 87 },
                        { t: "A2", d: 4, te: 7, i: 89 }
                    ],
                    insight: "設計比重上位チーム(C3 12.6%, B3 11.1%)とテスト比重上位チーム(D4 8.5%)の活用モデルを分析し、前段(Shift-Left) AI活用モデルを確立する必要があります。"
                },
                standard: {
                    title: "3.4 チーム標準化成熟度 (プロンプト再利用)",
                    mainStat: "86.8%",
                    segments: [{ l: "C1, C2 Team", v: "100%" }, { l: "D4 Team", v: "95%" }],
                    rca: { title: "Root Cause Analysis", text: "良いプロンプトがあってもチーム内で共有や再利用が全くされない構造です。チーム別「Prompt Library」チャンネル開設および標準テンプレート導入が急務です。" }
                }
            }
        },
        stage6: {
            title1: "Feature 4. (開発中)", title2: "私たちの開発チームを", title3: "AI Agentへ",
            nodeDetails: {
                'planning': {
                    name: 'AI-Req-Interpreter', role: '"Requirement Structuring & AC Generation"', capabilities: "曖昧な要求事項を識別し、受入基準(AC)案を生成して、最前段で品質基準を樹立します。", problemTarget: "開発者間の解釈の相違および企画漏れによる再作業"
                },
                'design': {
                    name: 'AI-Architect', role: '"Design Options & Risk Analysis"', capabilities: "複数の設計オプションのトレードオフを分析し、シニア開発者の最終意思決定を支援します。", problemTarget: "Type 2チームの「とりあえず作って直す」パターンおよび運営リスク"
                },
                'execution': {
                    name: 'AI-Code-Generator', role: '"Execution based on Design"', capabilities: "確定したアーキテクチャ設計に基づき、実際の実装コードを生成します。", problemTarget: "単純実装の繰り返しおよび生産性低下"
                },
                'val_top': {
                    name: 'AI-Validator', role: '"Constraint Check & Edge Cases"', capabilities: "要求事項と設計基準の充足可否をチェックし、エッジケースを指摘します。", problemTarget: "検証のないコード適用およびデバッグの繰り返し"
                },
                'val_bot': {
                    name: 'AI-Reviewer / Tester', role: '"PR Summary & Test Generation"', capabilities: "単体テストを生成し、PRレビューを要約して品質および保守性をチェックします。", problemTarget: "テスト/レビューのボトルネックおよびシニアの過負荷"
                },
                'operations': {
                    name: 'AI-Incident-Analyst', role: '"Root Cause & Runbook Generator"', capabilities: "障害発生時、ログとアラームに基づき原因を分析し、対応手順を自動生成します。", problemTarget: "運営知識の個人依存およびMTTR遅延"
                },
                'knowledge': {
                    name: 'AI-Knowledge-Curator', role: '"Assetization of Intelligence"', capabilities: "意味のあるプロンプトと結果を選別して組織資産として保存し、チーム内で共有します。", problemTarget: "Low Reuse Prompt (86.8%) および組織学習の不在"
                },
                'req_interpreter': {
                    name: 'AI-Req-Interpreter', role: '"Requirement Structuring & AC Generation"', capabilities: "曖昧な要求事項を識別し、受入基準(AC)案を生成して、最前段で品質基準を樹立します。", problemTarget: "開発者間の解釈の相違および企画漏れによる再作業"
                },
                'architect': {
                    name: 'AI-Architect', role: '"Design Options & Risk Analysis"', capabilities: "複数の設計オプションのトレードオフを分析し、シニア開発者の最終意思決定を支援します。", problemTarget: "Type 2チームの「とりあえず作って直す」パターンおよび運営リスク"
                },
                'code_gen': {
                    name: 'AI-Code-Generator', role: '"Execution based on Design"', capabilities: "確定したアーキテクチャ設計に基づき、実際の実装コードを生成します。", problemTarget: "単純実装の繰り返しおよび生産性低下"
                },
                'validator': {
                    name: 'AI-Validator', role: '"Constraint Check & Edge Cases"', capabilities: "要求事項と設計基準の充足可否をチェックし、エッジケースを指摘します。", problemTarget: "検証のないコード適用およびデバッグの繰り返し"
                },
                'test_gen': {
                    name: 'AI-Test-Generator', role: '"Unit & Integration"', capabilities: "単体テストと統合テストコードを生成し、開発者のテスト作成負担を軽減します。", problemTarget: "テストカバレッジ不足"
                },
                'reviewer': {
                    name: 'AI-Reviewer / Tester', role: '"PR Summary & Test Generation"', capabilities: "単体テストを生成し、PRレビューを要約して品質および保守性をチェックします。", problemTarget: "テスト/レビューのボトルネックおよびシニアの過負荷"
                },
                'incident': {
                    name: 'AI-Incident-Analyst', role: '"Root Cause & Runbook Generator"', capabilities: "障害発生時、ログとアラームに基づき原因を分析し、対応手順を自動生成します。", problemTarget: "運営知識の個人依存およびMTTR遅延"
                },
                'runbook': {
                    name: 'AI-Runbook-Gen', role: '"Response Ready"', capabilities: "障害状況に合った実行可能なランブックを即座に生成し、対応時間を短縮します。", problemTarget: "マニュアル不在および対応遅延"
                },
                'gen': {
                    name: 'AI-Code-Generator', role: '"Execution based on Design"', capabilities: "確定したアーキテクチャ設計に基づき、実際の実装コードを生成します。", problemTarget: "単純実装の繰り返しおよび生産性低下"
                },
                'ops': {
                    name: 'AI-Incident-Analyst', role: '"Root Cause & Runbook Generator"', capabilities: "障害発生時、ログとアラームに基づき原因を分析し、対応手順を自動生成します。", problemTarget: "運営知識の個人依存およびMTTR遅延"
                },
                'arch': {
                    name: 'Arch Gap', role: '"High Risk Area"', capabilities: "設計が漏れた状態で実装に入り発生する技術的負債領域です。", problemTarget: "再作業費用増加"
                },
                'review': {
                    name: 'Review Bottleneck', role: '"Process Slowdown"', capabilities: "シニア開発者のレビュー待機時間による全体パイプライン遅延です。", problemTarget: "デプロイ周期遅延"
                },
                'repo': {
                    name: 'AI-Knowledge-Curator', role: '"Assetization of Intelligence"', capabilities: "意味のあるプロンプトと結果を選別して組織資産として保存し、チーム内で共有します。", problemTarget: "Low Reuse Prompt (86.8%) および組織学習の不在"
                }
            }
        },
        stage7: {
            headlinePart1: "GRIDGE AiOPSと共に、", headlinePart2: "開発チームの圧倒的格差", headlinePart3: "を作りましょう。",
            intro: "現在AIに支出していた費用のまま、使用していたサービスのまま、\nGRIDGE AiOPS機能はボーナスとして！",
            benefitTitle: "アーリーバードアクセス", btnStart: "アーリーバード相談申請",
            benefits: [
                { title: "AI Token 10%割引", detail: "3ヶ月間、現在使用中のすべてのAI費用10%ペイバック (Claude, Cursor, Geminiなど)" },
                { title: "モニタリング1年無料", detail: "リアルタイム使用量モニタリングおよび異常兆候検知ソリューションを1年間無料提供" },
                { title: "専任コンサルティング3回", detail: "1年契約時、AI TaskForceコンサルティング3回無償提供 (1500万ウォン相当)" },
                { title: "購入優先権提供", detail: "今後リリースされるすべてのGRIDGE AiOPSサービス10%割引および優先導入権限提供" }
            ]
        },
        chatbot: {
            greeting: "こんにちは！GRIDGE AIアシスタントです。チームのワークフロー最適化のために、どのようなお手伝いができますか？",
            name: "GRIDGE AIアシスタント",
            status: "オンライン",
            thinking: "考え中...",
            placeholder: "GRIDGEについて聞いてください...",
            disclaimer: "AIは間違いを犯す可能性があります。重要な情報を確認してください。",
            error: "エラー: "
        },
        wizard: {
            startTitle: "こんにちは、\nGRIDGEと共に\nAXする準備はできましたか？", startSub: "(両方選択可能です)",
            typeProject: "AXプロジェクト依頼", typeOther: "AiOPS導入問い合わせ",
            btnStart: "始める", btnNext: "次へ", btnPrev: "前へ", btnSubmit: "提出する", btnClose: "閉じる",
            stepScopeTitle: "プロジェクトの\n業務範囲を\n選択してください", stepScopeSub: "(複数選択可能)",
            stepBudgetTitle: "大体の予算を\n教えていただけますか？",
            stepScheduleTitle: "予想される日程や\n期間はどのくらいですか？", startDate: "開始希望日", endDate: "終了希望日",
            stepTeamTitle: "現在一緒に働いている\nチームの規模はどのくらいですか？",
            stepCostTitle: "1ヶ月のAIにかかる費用は\n大体どのくらいですか？", stepCostSub: "(正確でなくても大丈夫です。感覚で選択してください)",
            stepToolsTitle: "現在主に使用している\nAIがあれば教えてください。", stepToolsSub: "(複数選択しても構いません)",
            stepConsultDateTitle: "相談可能な\n日程はありますか？", consultDate: "相談希望日",
            stepInfoTitle: "依頼者様の\n情報を入力してください",
            stepExtraTitle: "その他に私たちが\n参考すべき内容はありますか？", fileUpload: "提案書や参考資料添付 (最大3つ, 20MB)", btnFileUpload: "ファイル添付",
            contactUs: "お問い合わせ",
            option: "オプション",
            placeholders: {
                company: "会社名",
                name: "名前",
                email: "メール",
                phone: "電話番号"
            },
            sending: "送信中...", successTitle: "お問い合わせを受け付けました", successSub: "担当者が確認後、迅速にご連絡いたします。",
            privacy: "個人情報処理方針に同意します。", year: "年", month: "月", period: "",
            contactBtn: "お問い合わせ",
            tooltipAiOPS: "すでにAIを使用中で、使用・費用・運営管理が必要な場合", tooltipAX: "新規サービス・システム・AI連動開発が必要な場合",
            maxDatesHint: "相談日時は最大3つまで選択可能です",
            placeholderAiTools: "使用中のAIツールや状況を入力してください", placeholderDetails: "(選択事項)",
            options: {
                scopes: ["ビジネス戦略", "AX転換", "AI導入プロジェクト", "LLM", "RAG", "ソリューション開発", "派遣協業", "UXUIデザイン", "ウェブサイト", "アプリ", "フロントエンド", "バックエンド", "SaaS", "コマース", "マーケットプレイス", "マッチング", "マドロス", "政府支援", "実証事業", "AR/VR/3D", "その他"],
                budgets: ["1,000万ウォン未満", "1~2,000万ウォン", "2~3,000万ウォン", "3~4,000万ウォン", "4~5,000万ウォン", "5,000~1億ウォン", "1億ウォン以上"],
                teamSizes: ["1~5名", "6~20名", "21~50名", "51~100名", "101名以上"],
                aiCosts: ["未使用", "10万円未満", "10~50万円", "50~100万円", "100~500万円", "500万円以上"],
                aiTools: ["ChatGPT", "Gemini", "Gemini (企業用)", "Google従量制API", "Claude Code", "Claude", "Grok", "その他"],
                periods: ["初旬", "中旬", "下旬"]
            }
        },
        caseStudy: {
            initialCards: ["新しいAIを作りたい", "AIを使っているが整理されていない", "現状がわからない"],
            axNodeMapTexts: ["AXプロジェクトが必要ですね", "現在の状態を選択してください ->", "正確な診断のためにいくつか質問させていただきます"],
            axScenarioTitle: "どのようなAIを作りたいですか？",
            axScenarioCards: ["AIベースの新規サービス", "社内AIインフラ改善", "RAG構築", "業務自動化"],
            preparingTitle_3: "RAG構築",
            preparingTitle_4: "業務自動化",
            preparingDesc: "このサービスのシミュレーターは現在準備中です。\n専門家によるコンサルティングで詳しいご案内をご提供できます。",
            preparingBtn: "専門家相談でサービス案内を受ける",
            workflowTitle: "社内AIインフラ改善",
            workflowViewHint: "左のノードマップでノードをクリックして詳細情報を確認してください。",
            aiopsSimTitle: "現状シミュレーション",
            aiopsSimFields: ["チーム人数", "AI利用者数", "月間AI利用費用", "チーム数"],
            aiopsSimBtn: "シミュレーション生成",
            aiopsSimCurrencyUnit: "万ウォン",
            aiopsSimSavings: "最低{amount}万ウォン節約",
            aiopsInquiryBtn: "導入問い合わせへ",
            chatTitle: "AIベースの新規サービス",
            diagnosisTitle: "AiOPS診断",
            chatInputPlaceholder: "追加したい機能を入力してください...",
            diagInputPlaceholder: "回答を入力してください...",
            chatConsultBtn: "専門家相談を申請する",
            chatInitMsg1: "仮想で'{title}'の初期IA(Information Architecture)を実装しました。左のノードマップでご確認いただけます。\n\nこのAIはデモ用に簡略化されたモデルです。実際のサービスでは、専門家とAIが協力してより高品質なサービスを提供いたします。",
            chatInitMsg2: "追加で変形または具体化したい機能はありますか？全く新しいIAをご希望であれば、おっしゃってください。",
            chatBusyMsg1: "このシミュレーションAIはデモ版です。より複雑なアーキテクチャ設計と具体的な議論は、専門コンサルタントとの相談を通じて進めることをお勧めします。",
            chatBusyMsg2: "専門家と相談を進めますか？",
            diagnosisInitMsg: "正確な診断のために5つの質問をさせていただきます。\n\n最初の質問です。チーム単位のAI使用集計は可能ですか？",
            iaTemplates: [
                {
                    title: "ヘルスケア - AI検査結果自動解釈および患者用説明生成 SaaS",
                    root: {
                        label: "ヘルスケア SaaS",
                        common: "共通",
                        auth: "認証 (ログイン, 会員登録, 役割選択)",
                        doctor: "医療陣",
                        doc_dash: "ダッシュボード (本日分析件数, 高リスク患者通知, 最近のアップロード)",
                        doc_data: "検査データ管理 (PDF/画像アップロード, EMR連動, 数値マッピング)",
                        doc_ai: "AI分析結果 (異常数値ハイライト, 正常範囲比較, 変化率, リスク予測)",
                        doc_report: "患者用レポート生成 (難易度選択, 要約生成, 視覚化, PDFダウンロード)",
                        doc_history: "分析履歴管理 (患者別記録, リスク推移, 修正履歴)",
                        patient: "患者",
                        pat_result: "検査結果 (健康スコア, リスク視覚化, 異常項目説明)",
                        pat_guide: "ガイド (再検査の有無, 生活習慣勧告, 予約連動)",
                        pat_qna: "AI質問 (結果Q&A, 追加説明リクエスト)"
                    }
                },
                {
                    title: "コマース - AI需要予測ベース自動発注システム",
                    root: {
                        label: "コマース発注システム",
                        common: "共通",
                        auth: "認証 (ログイン, ユーザー権限管理)",
                        dash: "ダッシュボード",
                        dash_op: "運営状況 (予想販売量, 品切れリスク, 過剰在庫, 発注必要数)",
                        product: "商品管理",
                        prod_list: "SKUリスト (現在庫, 予測販売量, 安全在庫, 消化日)",
                        prod_detail: "SKU詳細 (過去推移, シーズン性, 予測正確度)",
                        order: "自動発注",
                        order_prop: "発注提案 (推奨数量, 予想費用, シミュレーション, 確定)",
                        order_erp: "ERP連動 (発注送信, 履歴照会)",
                        data: "外部データ",
                        data_api: "データ連動 (天気API, SNSトレンド, 広告データ, イベント)",
                        report: "レポート",
                        report_perf: "成果分析 (予測正確度, 在庫回転率, 品切れ率減少, 費用削減)"
                    }
                },
                {
                    title: "製造 - AI品質検査画像システム",
                    root: {
                        label: "製造品質検査",
                        common: "共通",
                        auth: "認証 (ログイン, 工場選択)",
                        dash: "ダッシュボード",
                        dash_rt: "リアルタイム状況 (総検査数量, 不良率, タイプ分布, ライン別状況)",
                        inspect: "検査画面",
                        ins_rt: "リアルタイム画像分析 (原本, 欠陥ハイライト, タイプ分類, 合格/不合格)",
                        history: "履歴管理",
                        hist_view: "検査記録照会 (日付別, ライン別, 作業者別, タイプフィルタ)",
                        model: "モデル管理",
                        mod_op: "モデル運営 (バージョン管理, データアップロード, 正確度モニタリング, 再学習要請)",
                        report: "分析レポート",
                        rep_qual: "品質分析 (工程別推移, 時間帯別偏差, 原因予測, 改善提案)"
                    }
                }
            ],
            workflowNodes: {
                req: "お問い合わせ受付",
                req_api: "APIリクエスト受付",
                review_man: "手動検討",
                review_sys: "統合リクエスト受付",
                extract: "データ抽出",
                agent: "AIエージェント (抽出・分類)",
                api_call: "自動化API呼び出し",
                update_man: "手動アップデート",
                update_auto: "自動アップデート",
                email: "メール送信",
                noti: "結果通知",
                wait: "返信待ち",
                hitl: "HITL専門家検討"
            }
        },
        stage7_genesis: {
            text1: "カスタマーサクセスストーリー",
            text2: "他のチームがGRIDGEでどのように変革したかをご覧ください。"
        },
        stage8_genesis: {
            text1: "これはどのように可能なのですか？",
            text2: "既存のワークフローとシームレスに統合します。"
        }
    }
};
