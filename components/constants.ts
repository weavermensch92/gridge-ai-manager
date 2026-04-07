
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
        toc: ["01. SIGNAL", "02. CONNECT", "03. ANALYZE", "04. COACH", "05. TRANSFORM", "06. ACCESS"],
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
                web: { label: "API Proxy", subLabel: "" },
                agent: { label: "AI Analyzer", subLabel: "Pattern Engine" },
                sw: { label: "Router", subLabel: "" },
                get: { label: "Fetch Data", subLabel: "" },
                post: { label: "Push Alert", subLabel: "" },
                del: { label: "Cleanup", subLabel: "" },
                conf1: { label: "Prompt DB", subLabel: "" },
                conf2: { label: "Config", subLabel: "" },
                conf3: { label: "Web Capture", subLabel: "" },
                rss: { label: "Extension", subLabel: "" },
                gen: { label: "Coach Gen", subLabel: "Claude Haiku" },
                rev: { label: "HITL Review", subLabel: "" },
                blog: { label: "Report", subLabel: "" },
                social: { label: "Slack Alert", subLabel: "" },
                brand: { label: "Template Kit", subLabel: "" },
                tic: { label: "Log Ingest", subLabel: "" },
                class: { label: "Classifier", subLabel: "Risk Detection" },
                kb: { label: "Pattern DB", subLabel: "" },
                reply: { label: "Auto Coach", subLabel: "" },
                esc: { label: "Escalate", subLabel: "" },
                db: { label: "Log Store", subLabel: "" }
            },
            profiles: {
                web: { name: 'API_Proxy', role: 'Channel Ingest' },
                agent: { name: 'Pattern_Engine', role: 'AI Core' },
                sw: { name: 'Channel_Router', role: 'Routing' },
                get: { name: 'Data_Fetcher', role: 'I/O Operation' },
                post: { name: 'Alert_Sender', role: 'Notification' },
                del: { name: 'Log_Cleanup', role: 'Maintenance' },
                rss: { name: 'Browser_Extension', role: 'Web Capture' },
                gen: { name: 'Coach_Generator', role: 'Advisory Core' },
                rev: { name: 'HITL_Reviewer', role: 'Human Approval' },
                blog: { name: 'Report_Engine', role: 'Publisher' },
                social: { name: 'Slack_Webhook', role: 'Notification' },
                brand: { name: 'Template_Store', role: 'Context Provider' },
                tic: { name: 'Log_Receiver', role: 'Ingest' },
                class: { name: 'Risk_Classifier', role: 'Detection' },
                kb: { name: 'Pattern_DB', role: 'Knowledge Base' },
                reply: { name: 'Auto_Coach', role: 'Advisory' },
                esc: { name: 'Admin_Alert', role: 'Escalation' },
                db: { name: 'Log_Store', role: 'Storage' },
                conf1: { name: 'Prompt_Library', role: 'Context' },
                conf2: { name: 'Config_Store', role: 'Config' },
                conf3: { name: 'Web_Crawler', role: 'Share Link Capture' }
            },
            sidebar: {
                title: "AiOPS Workflows",
                dev: { title: "Monitoring", sub: "Real-time Logging" },
                mkt: { title: "Analysis", sub: "Pattern Engine" },
                sup: { title: "Coaching", sub: "Auto-Advisory" },
                monitor: "Platform Health"
            },
            ui: {
                zoom: "Zoom",
                autoSave: "Auto-save",
                efficiency: "Efficiency",
                reliability: "Reliability"
            }
        },
        genesis: {
            leftNodes: ["Dev Team A", "Dev Team B", "Designer", "PM", "QA"],
            rightNodes: ["Claude Code", "ChatGPT", "Cursor", "Copilot", "Gemini"],
            midComplex: ["No Tracking", "Unknown Cost", "Security Blind"],
            midSimple: ["Usage Monitor", "GRIDGE AiOPS", "AI Coaching"]
        },
        stage1: { line1: "YOUR TEAM", line2: "USES AI" },
        stage2: { text1: "Claude, Cursor, ChatGPT, Copilot — everywhere.", text2: "But you have zero visibility." },
        stage2_transform: { text1: "Who uses what. How much it costs. What's at risk.", text2: "GRIDGE AiOPS makes it all visible — in 30 minutes." },
        stage3: {
            title1: "Step 1.", title2: "Connect Your AI Stack", title3: "In Minutes",
            widgets: {
                profile: { name: "All Your AI Tools — One View", desc: "Claude, ChatGPT, Cursor, Copilot, Gemini — all in a single dashboard." },
                score: { title: "Setup in Minutes", desc: "From zero to full visibility — no infrastructure changes required.", items: [{ l: "API Proxy", v: "10 min" }, { l: "Claude Code", v: "5 min" }, { l: "Browser Extension", v: "5 min" }, { l: "Share Link", v: "2 min" }] },
                change: { title: "Zero Code Change", desc: "One environment variable. That's all it takes to start logging.", before: "Each team pays and manages separately", after: ["One Dashboard, Full Visibility", "Unified Cost Tracking"] },
                perf: { title: "Web Conversations Too", desc: "Browser extension auto-captures Claude.ai, ChatGPT, and Gemini conversations.", s1: { t: "Before", d: "Web AI conversations — invisible to management" }, s2: { t: "After", d: "Auto-collected every 15 minutes via extension" } },
                effect: { title: "Everything Gets Recorded", desc: "Every AI interaction becomes structured, queryable data.", items: ["Prompt + Response (full text)", "Token Count & Cost (per model)", "Latency · Channel · User · Team"] },
                health: { title: "30-Minute Onboarding", desc: "From zero to full-channel logging in under 30 minutes. No infrastructure changes.", items: [{ l: "API Proxy", v: "10 min" }, { l: "Claude Code", v: "5 min" }, { l: "Extension", v: "5 min" }, { l: "Share Link", v: "2 min" }] },
                sfia: { title: "Enterprise Security Built-in", desc: "Enterprise-grade data protection from day one.", items: [{ l: "Encryption", v: "AES-256" }, { l: "Data Isolation", v: "Per-org" }, { l: "Retention", v: "Configurable" }] }
            }
        },
        stage4_genesis: {
            text1: "Individual AI adoption",
            text2: "Without visibility is just noise."
        },
        stage5_genesis: {
            text1: "Same AI services. Same cost.",
            text2: "Plus visibility, coaching, and control."
        },
        stage6_genesis: {
            text1: "Trusted by Korea's leading teams.",
            text2: "Proven results across industries."
        },
        stage7_genesis: {
            text1: "Built on Claude.",
            text2: "Partnered with the world's leading AI platforms."
        },
        stage8_genesis: {
            text1: "How does it work?",
            text2: "Three steps. Nine channels. One platform."
        },
        stage4: {
            title1: "Step 2.", title2: "Analyze Usage", title3: "Across Your Organization",
            cards: {
                trad: { title: "Personal Dashboard", sub: "Every engineer sees their own\nAI usage, cost, and patterns.", outLabel: "Metrics", outVal: "Per-person", skill: "Self-awareness" },
                ai: { title: "Admin Dashboard", sub: "CTO/Lead sees team-wide\nusage, cost, risk, and trends.", outLabel: "Metrics", outVal: "Org-wide", skill: "Full Visibility" }
            }
        },
        stage5: {
            title1: "Step 3.", title2: "Coach Teams to", title3: "AI Excellence",
            widgets: {
                lifecycle: {
                    title: "AI Maturity Level",
                    data: [{ l: "Explorer", v: 20 }, { l: "Experimenter", v: 40 }, { l: "Adopter", v: 60 }, { l: "Scaler", v: 80 }, { l: "Optimizer", v: 100 }],
                    interp: { title: "YOUR TEAM", text: "Most teams start at Level 2. AiOPS gets you to Level 4 in 3 months." },
                    implic: { title: "TARGET", text: "Level 4+ teams show 40% higher productivity." }
                },
                intent: {
                    title: "Auto-Generated Coaching",
                    data: [{ l: "Re-question ratio", v: 38, c: "bg-red-500" }, { l: "Target", v: 25, c: "bg-blue-500" }, { l: "Model optimization", v: 20, c: "bg-yellow-500" }, { l: "Usage expansion", v: 17, c: "bg-green-500" }],
                    insight: "Weekly coaching cards auto-generated from usage patterns. Actionable. Personalized."
                },
                artifact: {
                    title: "Issue Detection",
                    data: [{ l: "Re-question Loop", v: 35 }, { l: "Inactive User", v: 22 }, { l: "Budget Overrun", v: 20 }, { l: "Cost Spike", v: 15 }, { l: "Sensitive Data", v: 8 }],
                    note: "* Auto-detected. Admin alerted. HITL review for sensitive data."
                },
                strategy: {
                    title: "Next Step Advisor",
                    current: { title: "CURRENT STATE (Level 2)", text: "Dev team uses Claude Code actively. Other teams barely experiment." },
                    next: { title: "NEXT STEP → Level 3", text: "Deploy prompt templates to marketing team. Activate monitoring for design team." }
                },
                defects: {
                    title: "5 Core Metrics",
                    stats: [{ l: "Prompt Quality", v: "68%" }, { l: "Usage Breadth", v: "3/7 types" }, { l: "Cost Efficiency", v: "$2.40/task" }],
                    risk: { title: "COACHING TRIGGER", text: "Re-question rate above 30% triggers automatic coaching card delivery." }
                },
                collab: {
                    title: "Team Comparison",
                    headers: ["TEAM", "AI USAGE", "MATURITY", "COST/HEAD", "TREND"],
                    rows: [
                        { t: "Platform", p: "High", s: 95, v: "Lv.4", u: "$18" },
                        { t: "Backend", p: "High", s: 82, v: "Lv.3", u: "$24" },
                        { t: "Frontend", p: "Mid", s: 76, v: "Lv.3", u: "$12" },
                        { t: "QA", p: "Low", s: 45, v: "Lv.2", u: "$6" },
                        { t: "Design", p: "Low", s: 30, v: "Lv.1", u: "$3" },
                        { t: "Marketing", p: "Low", s: 25, v: "Lv.1", u: "$2" },
                        { t: "Support", p: "None", s: 10, v: "—", u: "$0" }
                    ]
                },
                bias: {
                    title: "Auto Weekly Report",
                    chart: [
                        { t: "Platform", d: 12.6, te: 5, i: 82.4 },
                        { t: "Backend", d: 11.1, te: 4, i: 84.9 },
                        { t: "Frontend", d: 8.5, te: 3, i: 88.5 },
                        { t: "QA", d: 5, te: 8, i: 87 },
                        { t: "Design", d: 4, te: 7, i: 89 }
                    ],
                    insight: "AI-generated weekly report delivered to management every Monday. No manual work."
                },
                standard: {
                    title: "ROI Calculator",
                    mainStat: "₩12.4M",
                    segments: [{ l: "Saved per quarter", v: "₩12.4M" }, { l: "50-person team avg.", v: "" }],
                    rca: { title: "HOW", text: "10% cost optimization + 25% re-question reduction + model right-sizing = measurable ROI." }
                }
            }
        },
        stage6: {
            title1: "Step 4. (Preview)", title2: "Transform the Entire", title3: "AI Operations Pipeline",
            nodeDetails: {
                'planning': {
                    name: 'Connect', role: '"API Proxy + Extension"', capabilities: "One environment variable change for full request/response logging.", problemTarget: "Scattered, untracked AI usage"
                },
                'design': {
                    name: 'Log', role: '"Async Storage Engine"', capabilities: "Asynchronous logging with zero latency impact on production.", problemTarget: "No usage data available"
                },
                'execution': {
                    name: 'Analyze', role: '"Pattern Detection"', capabilities: "Auto-detects usage patterns, cost anomalies, and re-question loops.", problemTarget: "Invisible inefficiencies"
                },
                'val_top': {
                    name: 'Detect', role: '"Risk & Anomaly"', capabilities: "Flags sensitive data exposure, budget overruns, and inactive users.", problemTarget: "Security and cost blind spots"
                },
                'val_bot': {
                    name: 'Review (HITL)', role: '"Human Approval"', capabilities: "Sensitive data flagged for human-in-the-loop review before action.", problemTarget: "Unreviewed AI outputs at scale"
                },
                'operations': {
                    name: 'Report', role: '"Weekly Digest"', capabilities: "AI-generated weekly report delivered to management automatically.", problemTarget: "Manual reporting burden"
                },
                'knowledge': {
                    name: 'Coach', role: '"Auto Advisory"', capabilities: "Generates personalized coaching cards from usage patterns.", problemTarget: "No learning or improvement loop"
                },
                'gen': {
                    name: 'Analyze', role: '"Pattern Detection"', capabilities: "Auto-detects usage patterns, cost anomalies, and re-question loops.", problemTarget: "Invisible inefficiencies"
                },
                'ops': {
                    name: 'Report', role: '"Weekly Digest"', capabilities: "AI-generated weekly report delivered to management automatically.", problemTarget: "Manual reporting burden"
                },
                'arch': {
                    name: 'Cost Scattered', role: '"No Visibility"', capabilities: "AI costs distributed across individual accounts with no central tracking.", problemTarget: "Uncontrolled AI spending"
                },
                'review': {
                    name: 'No Tracking', role: '"Blind Spot"', capabilities: "AI usage data not collected — no basis for optimization or compliance.", problemTarget: "Zero data for decision making"
                },
                'repo': {
                    name: 'AiOPS Platform', role: '"Unified AI Management"', capabilities: "Centralizes monitoring, analysis, coaching, and reporting for all AI usage.", problemTarget: "Fragmented tools & No central control"
                }
            }
        },
        genesisBenefits: [
            { title: "40% Faster Cycles", detail: "Selvas AI reduced development cycles by 40% and code review time by 60%." },
            { title: "3× API Speed", detail: "StepPay achieved 3× faster API development with 95% vulnerability pre-detection." },
            { title: "25% Cost Reduction", detail: "EdenT&S cut project person-months by 25% and improved margins by 15%p." },
            { title: "500+ Projects Delivered", detail: "Serving Korail, Hybe, Samsung affiliates, LG affiliates, and more." }
        ],
        stage7: {
            headlinePart1: "With GRIDGE AiOPS, ", headlinePart2: "Your Team's AI Potential ", headlinePart3: "Becomes Visible.",
            intro: "Keep your current AI tools. Keep your current cost.\nAdd visibility, coaching, and control — starting today.",
            benefitTitle: "Why Teams Choose Gridge", btnStart: "Start Free PoC", btnDemo: "Request a Demo",
            benefits: [
                { title: "30-Minute Setup", detail: "From zero to full monitoring. No infrastructure change required." },
                { title: "9 Channels Covered", detail: "Claude Code, ChatGPT, Cursor, Copilot, Gemini, API — all in one view." },
                { title: "AI-Powered Coaching", detail: "Personalized weekly coaching cards. Auto-generated maturity reports." },
                { title: "Enterprise-Grade Security", detail: "AES-256 encryption. Per-org data isolation. Configurable retention." }
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
        toc: ["01. 시그널 (SIGNAL)", "02. 연동 (CONNECT)", "03. 분석 (ANALYZE)", "04. 코칭 (COACH)", "05. 전환 (TRANSFORM)", "06. 접속 (ACCESS)"],
        footer: {
            companyName: "(주) 소프트스퀘어드", ceo: "대표 이하늘", industry: "업종 컴퓨터 프로그래밍업", regNo: "사업자등록번호 723-81-01101",
            addrMain: "본사 (48733) 부산광역시 동구 중앙대로214번길 7-8, 24층 (초량동)",
            addrBranch: "지점 (06691) 서울특별시 서초구 방배천로2안길 75, 1, 2층 (방배동)",
            links: ["이용약관", "포인트 이용 약관", "개인정보 처리방침", "이메일무단수집 거부", "제3자마케팅동의"],
            copyright: "© 2026 Soft Squared. All rights reserved."
        },
        nodeGraph: {
            nodes: {
                web: { label: "API 프록시", subLabel: "" },
                agent: { label: "AI 분석기", subLabel: "패턴 엔진" },
                sw: { label: "라우터", subLabel: "" },
                get: { label: "데이터 조회", subLabel: "" },
                post: { label: "알림 전송", subLabel: "" },
                del: { label: "정리", subLabel: "" },
                conf1: { label: "프롬프트 DB", subLabel: "" },
                conf2: { label: "설정", subLabel: "" },
                conf3: { label: "웹 캡처", subLabel: "" },
                rss: { label: "익스텐션", subLabel: "" },
                gen: { label: "코칭 생성", subLabel: "Claude Haiku" },
                rev: { label: "HITL 검토", subLabel: "" },
                blog: { label: "리포트", subLabel: "" },
                social: { label: "Slack 알림", subLabel: "" },
                brand: { label: "템플릿 키트", subLabel: "" },
                tic: { label: "로그 수신", subLabel: "" },
                class: { label: "분류기", subLabel: "리스크 감지" },
                kb: { label: "패턴 DB", subLabel: "" },
                reply: { label: "자동 코칭", subLabel: "" },
                esc: { label: "에스컬레이션", subLabel: "" },
                db: { label: "로그 저장소", subLabel: "" }
            },
            profiles: {
                web: { name: 'API_프록시', role: '채널 수신' },
                agent: { name: '패턴_엔진', role: 'AI 코어' },
                sw: { name: '채널_라우터', role: '라우팅' },
                get: { name: '데이터_페처', role: 'I/O 작업' },
                post: { name: '알림_발송기', role: '알림' },
                del: { name: '로그_정리기', role: '유지보수' },
                rss: { name: '브라우저_익스텐션', role: '웹 캡처' },
                gen: { name: '코칭_생성기', role: '어드바이저 코어' },
                rev: { name: 'HITL_검토자', role: '사람 승인' },
                blog: { name: '리포트_엔진', role: '퍼블리셔' },
                social: { name: 'Slack_웹훅', role: '알림' },
                brand: { name: '템플릿_저장소', role: '컨텍스트 제공자' },
                tic: { name: '로그_수신기', role: '수신' },
                class: { name: '리스크_분류기', role: '감지' },
                kb: { name: '패턴_DB', role: '지식 베이스' },
                reply: { name: '자동_코칭', role: '어드바이저' },
                esc: { name: '관리자_알림', role: '에스컬레이션' },
                db: { name: '로그_저장소', role: '스토리지' },
                conf1: { name: '프롬프트_라이브러리', role: '컨텍스트' },
                conf2: { name: '설정_저장소', role: '설정' },
                conf3: { name: '웹_크롤러', role: '공유 링크 캡처' }
            },
            sidebar: {
                title: "AiOPS 워크플로우",
                dev: { title: "모니터링", sub: "실시간 로깅" },
                mkt: { title: "분석", sub: "패턴 엔진" },
                sup: { title: "코칭", sub: "자동 어드바이저" },
                monitor: "플랫폼 상태"
            },
            ui: {
                zoom: "확대",
                autoSave: "자동 저장",
                efficiency: "효율성",
                reliability: "신뢰성"
            }
        },
        genesis: {
            leftNodes: ["개발팀 A", "개발팀 B", "디자이너", "PM", "QA"],
            rightNodes: ["Claude Code", "ChatGPT", "Cursor", "Copilot", "Gemini"],
            midComplex: ["사용 추적 불가", "비용 미파악", "보안 사각지대"],
            midSimple: ["사용 모니터링", "GRIDGE AiOPS", "AI 코칭"]
        },
        stage1: { line1: "당신의 팀은", line2: "AI를 쓴다" },
        stage2: { text1: "Claude, Cursor, ChatGPT, Copilot — 모든 곳에서.", text2: "하지만 당신은 아무것도 보이지 않는다." },
        stage2_transform: { text1: "누가, 무엇을, 얼마나 쓰는지. 비용은 얼마인지. 리스크는 무엇인지.", text2: "GRIDGE AiOPS가 전부 보여준다 — 30분 안에." },
        stage3: {
            title1: "Step 1.", title2: "AI 스택 연동", title3: "몇 분이면 끝",
            widgets: {
                profile: { name: "모든 AI 도구 — 한 눈에", desc: "Claude, ChatGPT, Cursor, Copilot, Gemini — 하나의 대시보드에서 전부 확인." },
                score: { title: "몇 분이면 셋업 완료", desc: "제로에서 전체 가시화까지 — 인프라 변경 불필요.", items: [{ l: "API 프록시", v: "10분" }, { l: "Claude Code", v: "5분" }, { l: "브라우저 익스텐션", v: "5분" }, { l: "공유 링크", v: "2분" }] },
                change: { title: "코드 수정 제로", desc: "환경변수 하나면 됩니다. 그것만으로 로깅이 시작됩니다.", before: "각 팀이 개별 결제·관리", after: ["하나의 대시보드, 전체 가시화", "통합 비용 추적"] },
                perf: { title: "웹 대화도 놓치지 않는다", desc: "브라우저 익스텐션이 Claude.ai, ChatGPT, Gemini 대화를 자동 수집합니다.", s1: { t: "도입 전", d: "웹 AI 대화 — 관리자에게 보이지 않음" }, s2: { t: "도입 후", d: "익스텐션으로 15분마다 자동 수집" } },
                effect: { title: "모든 것이 기록된다", desc: "모든 AI 상호작용이 구조화된 조회 가능 데이터로 변환.", items: ["프롬프트 + 응답 (전문)", "토큰 수 & 비용 (모델별)", "지연시간 · 채널 · 사용자 · 팀"] },
                health: { title: "30분 온보딩", desc: "제로에서 전채널 로깅까지 30분 이내. 인프라 변경 불필요.", items: [{ l: "API 프록시", v: "10분" }, { l: "Claude Code", v: "5분" }, { l: "익스텐션", v: "5분" }, { l: "공유 링크", v: "2분" }] },
                sfia: { title: "엔터프라이즈 보안 기본 탑재", desc: "엔터프라이즈급 데이터 보호가 처음부터 내장.", items: [{ l: "암호화", v: "AES-256" }, { l: "데이터 격리", v: "고객사별" }, { l: "보관 기간", v: "설정 가능" }] }
            }
        },
        stage4_genesis: {
            text1: "가시성 없는 개별 AI 도입은",
            text2: "그냥 소음일 뿐이다."
        },
        stage5_genesis: {
            text1: "같은 AI 서비스. 같은 비용.",
            text2: "여기에 가시성, 코칭, 통제력까지."
        },
        stage6_genesis: {
            text1: "한국 최고의 팀들이 선택했습니다.",
            text2: "산업 전반에 걸친 검증된 성과."
        },
        stage7_genesis: {
            text1: "Claude 위에 구축.",
            text2: "세계 최고의 AI 플랫폼과 파트너."
        },
        stage8_genesis: {
            text1: "어떻게 작동하나요?",
            text2: "세 단계. 아홉 채널. 하나의 플랫폼."
        },
        stage4: {
            title1: "Step 2.", title2: "사용 현황 분석", title3: "조직 전체를 한눈에",
            cards: {
                trad: { title: "개인 대시보드", sub: "각 엔지니어가 자신의\nAI 사용량, 비용, 패턴을 확인.", outLabel: "지표", outVal: "개인별", skill: "자기 인식" },
                ai: { title: "관리자 대시보드", sub: "CTO/리드가 팀 전체의\n사용량, 비용, 리스크, 트렌드를 확인.", outLabel: "지표", outVal: "조직 전체", skill: "완전한 가시성" }
            }
        },
        stage5: {
            title1: "Step 3.", title2: "팀의 AI 역량을", title3: "코칭하다",
            widgets: {
                lifecycle: {
                    title: "AI 성숙도 레벨",
                    data: [{ l: "탐색기", v: 20 }, { l: "실험기", v: 40 }, { l: "정착기", v: 60 }, { l: "확장기", v: 80 }, { l: "최적화기", v: 100 }],
                    interp: { title: "당신의 팀", text: "대부분 Level 2에서 시작. AiOPS로 3개월 만에 Level 4 도달." },
                    implic: { title: "목표", text: "Level 4+ 팀은 생산성이 40% 더 높다." }
                },
                intent: {
                    title: "자동 코칭 카드",
                    data: [{ l: "재질문 비율", v: 38, c: "bg-red-500" }, { l: "목표", v: 25, c: "bg-blue-500" }, { l: "모델 최적화", v: 20, c: "bg-yellow-500" }, { l: "활용 확장", v: 17, c: "bg-green-500" }],
                    insight: "사용 패턴에서 자동 생성되는 주간 코칭 카드. 실행 가능. 개인화."
                },
                artifact: {
                    title: "이슈 자동 감지",
                    data: [{ l: "재질문 반복", v: 35 }, { l: "미사용자", v: 22 }, { l: "예산 초과", v: 20 }, { l: "비용 폭증", v: 15 }, { l: "민감 정보", v: 8 }],
                    note: "* 자동 감지. 관리자 알림. 민감 정보는 HITL 검토."
                },
                strategy: {
                    title: "다음 단계 어드바이저",
                    current: { title: "현재 상태 (Level 2)", text: "개발팀은 Claude Code를 적극 사용. 다른 팀은 거의 실험 수준." },
                    next: { title: "NEXT STEP → Level 3", text: "마케팅팀에 프롬프트 템플릿 배포. 디자인팀 모니터링 활성화." }
                },
                defects: {
                    title: "5대 핵심 지표",
                    stats: [{ l: "프롬프팅 품질", v: "68%" }, { l: "활용 다양성", v: "3/7 유형" }, { l: "비용 효율", v: "$2.40/작업" }],
                    risk: { title: "코칭 트리거", text: "재질문 비율 30% 초과 시 자동 코칭 카드 발송." }
                },
                collab: {
                    title: "팀 비교",
                    headers: ["팀", "AI 이용률", "성숙도", "1인당 비용", "추세"],
                    rows: [
                        { t: "플랫폼", p: "높음", s: 95, v: "Lv.4", u: "$18" },
                        { t: "백엔드", p: "높음", s: 82, v: "Lv.3", u: "$24" },
                        { t: "프론트엔드", p: "중간", s: 76, v: "Lv.3", u: "$12" },
                        { t: "QA", p: "낮음", s: 45, v: "Lv.2", u: "$6" },
                        { t: "디자인", p: "낮음", s: 30, v: "Lv.1", u: "$3" },
                        { t: "마케팅", p: "낮음", s: 25, v: "Lv.1", u: "$2" },
                        { t: "고객지원", p: "없음", s: 10, v: "—", u: "$0" }
                    ]
                },
                bias: {
                    title: "주간 자동 리포트",
                    chart: [
                        { t: "플랫폼", d: 12.6, te: 5, i: 82.4 },
                        { t: "백엔드", d: 11.1, te: 4, i: 84.9 },
                        { t: "프론트엔드", d: 8.5, te: 3, i: 88.5 },
                        { t: "QA", d: 5, te: 8, i: 87 },
                        { t: "디자인", d: 4, te: 7, i: 89 }
                    ],
                    insight: "매주 월요일 경영진에게 자동 전달되는 AI 활용 보고서. 수작업 제로."
                },
                standard: {
                    title: "ROI 계산기",
                    mainStat: "1,240만원",
                    segments: [{ l: "분기당 절감액", v: "1,240만원" }, { l: "50인 팀 기준 평균", v: "" }],
                    rca: { title: "산출 근거", text: "10% 비용 최적화 + 25% 재질문 감소 + 모델 최적화 = 측정 가능한 ROI." }
                }
            }
        },
        stage6: {
            title1: "Step 4. (미리보기)", title2: "AI 운영 파이프라인을", title3: "전환하다",
            nodeDetails: {
                'planning': {
                    name: '연동 (Connect)', role: '"API 프록시 + 익스텐션"', capabilities: "환경변수 하나 변경으로 요청/응답 전문 로깅을 시작합니다.", problemTarget: "분산되고 추적 불가능한 AI 사용"
                },
                'design': {
                    name: '로깅 (Log)', role: '"비동기 저장 엔진"', capabilities: "프로덕션에 지연 시간 영향 없이 비동기 로깅을 수행합니다.", problemTarget: "사용 데이터 부재"
                },
                'execution': {
                    name: '분석 (Analyze)', role: '"패턴 감지"', capabilities: "사용 패턴, 비용 이상, 재질문 반복을 자동 감지합니다.", problemTarget: "보이지 않는 비효율"
                },
                'val_top': {
                    name: '감지 (Detect)', role: '"리스크 & 이상치"', capabilities: "민감 정보 노출, 예산 초과, 미사용자를 자동 플래그합니다.", problemTarget: "보안 및 비용 사각지대"
                },
                'val_bot': {
                    name: '검토 (HITL)', role: '"사람 승인"', capabilities: "민감 정보가 플래그되면 사람이 검토 후 조치합니다.", problemTarget: "대규모 AI 출력물 미검토"
                },
                'operations': {
                    name: '리포트 (Report)', role: '"주간 보고서"', capabilities: "AI가 생성한 주간 리포트를 경영진에게 자동 전달합니다.", problemTarget: "수동 보고 부담"
                },
                'knowledge': {
                    name: '코칭 (Coach)', role: '"자동 어드바이저"', capabilities: "사용 패턴에서 개인화된 코칭 카드를 자동 생성합니다.", problemTarget: "학습 및 개선 루프 부재"
                },
                'req_interpreter': {
                    name: '연동 (Connect)', role: '"API 프록시 + 익스텐션"', capabilities: "환경변수 하나 변경으로 요청/응답 전문 로깅을 시작합니다.", problemTarget: "분산되고 추적 불가능한 AI 사용"
                },
                'architect': {
                    name: '로깅 (Log)', role: '"비동기 저장 엔진"', capabilities: "프로덕션에 지연 시간 영향 없이 비동기 로깅을 수행합니다.", problemTarget: "사용 데이터 부재"
                },
                'code_gen': {
                    name: '분석 (Analyze)', role: '"패턴 감지"', capabilities: "사용 패턴, 비용 이상, 재질문 반복을 자동 감지합니다.", problemTarget: "보이지 않는 비효율"
                },
                'validator': {
                    name: '감지 (Detect)', role: '"리스크 & 이상치"', capabilities: "민감 정보 노출, 예산 초과, 미사용자를 자동 플래그합니다.", problemTarget: "보안 및 비용 사각지대"
                },
                'test_gen': {
                    name: '코칭 (Coach)', role: '"자동 어드바이저"', capabilities: "사용 패턴에서 개인화된 코칭 카드를 자동 생성합니다.", problemTarget: "학습 및 개선 루프 부재"
                },
                'reviewer': {
                    name: '검토 (HITL)', role: '"사람 승인"', capabilities: "민감 정보가 플래그되면 사람이 검토 후 조치합니다.", problemTarget: "대규모 AI 출력물 미검토"
                },
                'incident': {
                    name: '리포트 (Report)', role: '"주간 보고서"', capabilities: "AI가 생성한 주간 리포트를 경영진에게 자동 전달합니다.", problemTarget: "수동 보고 부담"
                },
                'runbook': {
                    name: '대시보드', role: '"실시간 현황판"', capabilities: "팀별 AI 사용량, 비용, 성숙도를 실시간으로 시각화합니다.", problemTarget: "현황 파악 지연"
                },
                'gen': {
                    name: '분석 (Analyze)', role: '"패턴 감지"', capabilities: "사용 패턴, 비용 이상, 재질문 반복을 자동 감지합니다.", problemTarget: "보이지 않는 비효율"
                },
                'ops': {
                    name: '리포트 (Report)', role: '"주간 보고서"', capabilities: "AI가 생성한 주간 리포트를 경영진에게 자동 전달합니다.", problemTarget: "수동 보고 부담"
                },
                'arch': {
                    name: '비용 분산', role: '"가시성 없음"', capabilities: "AI 비용이 개인 계정에 분산되어 중앙 추적이 불가합니다.", problemTarget: "통제 불가능한 AI 비용"
                },
                'review': {
                    name: '추적 불가', role: '"사각지대"', capabilities: "AI 사용 데이터가 수집되지 않아 최적화나 컴플라이언스의 기반이 없습니다.", problemTarget: "의사결정 데이터 제로"
                },
                'repo': {
                    name: 'AiOPS 플랫폼', role: '"통합 AI 관리"', capabilities: "모든 AI 사용에 대한 모니터링, 분석, 코칭, 리포팅을 중앙화합니다.", problemTarget: "분산된 도구 & 중앙 통제 부재"
                }
            }
        },
        genesisBenefits: [
            { title: "개발 주기 40% 단축", detail: "셀바스AI — 개발주기 40% 단축, 코드리뷰 시간 60% 절감" },
            { title: "API 개발 속도 3배", detail: "스텝페이 — API 개발 속도 3배 향상, 보안 취약점 95% 사전 감지" },
            { title: "인건비 25% 절감", detail: "이든T&S — 프로젝트 M/M 25% 절감, 수익률 15%p 개선" },
            { title: "500+ 프로젝트 완료", detail: "코레일, Hybe, 삼성·LG·현대 계열사 등 다수 엔터프라이즈 고객사" }
        ],
        stage7: {
            headlinePart1: "GRIDGE AiOPS로 ", headlinePart2: "팀의 AI 잠재력이 ", headlinePart3: "보이기 시작합니다.",
            intro: "기존 AI 도구 유지. 기존 비용 유지.\n가시성, 코칭, 통제력을 더하세요 — 오늘부터.",
            benefitTitle: "팀들이 Gridge를 선택하는 이유", btnStart: "무료 PoC 상담", btnDemo: "데모 요청",
            benefits: [
                { title: "30분 셋업", detail: "제로에서 전채널 모니터링까지. 인프라 변경 불필요." },
                { title: "9개 채널 통합", detail: "Claude Code, ChatGPT, Cursor, Copilot, Gemini, API — 하나의 뷰." },
                { title: "AI 코칭 자동화", detail: "개인화된 주간 코칭 카드. 자동 생성 성숙도 리포트." },
                { title: "엔터프라이즈 보안", detail: "AES-256 암호화. 고객사별 데이터 격리. 보관 기간 설정." }
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
        toc: ["01. シグナル (SIGNAL)", "02. 連携 (CONNECT)", "03. 分析 (ANALYZE)", "04. コーチング (COACH)", "05. 転換 (TRANSFORM)", "06. 接続 (ACCESS)"],
        footer: {
            companyName: "(株) Soft Squared", ceo: "代表 Ha-neul Lee", industry: "業種 コンピュータプログラミング業", regNo: "事業者登録番号 723-81-01101",
            addrMain: "本社 (48733) 釜山広域市東区中央大路214番ギル7-8、24階 (草梁洞)",
            addrBranch: "支店 (06691) ソウル特別市瑞草区方背川路2アンギル75、1、2階 (方背洞)",
            links: ["利用規約", "ポイント利用規約", "個人情報処理方針", "メール無断収集拒否", "第三者マーケティング同意"],
            copyright: "© 2026 Soft Squared. All rights reserved."
        },
        nodeGraph: {
            nodes: {
                web: { label: "API Proxy", subLabel: "" },
                agent: { label: "AI分析器", subLabel: "パターンエンジン" },
                sw: { label: "ルーター", subLabel: "" },
                get: { label: "データ取得", subLabel: "" },
                post: { label: "アラート送信", subLabel: "" },
                del: { label: "クリーンアップ", subLabel: "" },
                conf1: { label: "プロンプトDB", subLabel: "" },
                conf2: { label: "設定", subLabel: "" },
                conf3: { label: "Webキャプチャ", subLabel: "" },
                rss: { label: "Extension", subLabel: "" },
                gen: { label: "コーチング生成", subLabel: "Claude Haiku" },
                rev: { label: "HITLレビュー", subLabel: "" },
                blog: { label: "レポート", subLabel: "" },
                social: { label: "Slackアラート", subLabel: "" },
                brand: { label: "テンプレートキット", subLabel: "" },
                tic: { label: "ログ受信", subLabel: "" },
                class: { label: "分類器", subLabel: "リスク検出" },
                kb: { label: "パターンDB", subLabel: "" },
                reply: { label: "自動コーチング", subLabel: "" },
                esc: { label: "エスカレーション", subLabel: "" },
                db: { label: "ログストア", subLabel: "" }
            },
            profiles: {
                web: { name: 'API_Proxy', role: 'チャネル受信' },
                agent: { name: 'パターンエンジン', role: 'AIコア' },
                sw: { name: 'チャネルルーター', role: 'ルーティング' },
                get: { name: 'データフェッチャー', role: 'I/O操作' },
                post: { name: 'アラート送信器', role: '通知' },
                del: { name: 'ログクリーナー', role: 'メンテナンス' },
                rss: { name: 'ブラウザExtension', role: 'Webキャプチャ' },
                gen: { name: 'コーチング生成器', role: 'アドバイザリーコア' },
                rev: { name: 'HITLレビュアー', role: '人間承認' },
                blog: { name: 'レポートエンジン', role: 'パブリッシャー' },
                social: { name: 'Slack Webhook', role: '通知' },
                brand: { name: 'テンプレートストア', role: 'コンテキストプロバイダー' },
                tic: { name: 'ログレシーバー', role: '受信' },
                class: { name: 'リスク分類器', role: '検出' },
                kb: { name: 'パターンDB', role: 'ナレッジベース' },
                reply: { name: '自動コーチ', role: 'アドバイザリー' },
                esc: { name: '管理者アラート', role: 'エスカレーション' },
                db: { name: 'ログストア', role: 'ストレージ' },
                conf1: { name: 'プロンプトライブラリ', role: 'コンテキスト' },
                conf2: { name: '設定ストア', role: '設定' },
                conf3: { name: 'Webクローラー', role: '共有リンクキャプチャ' }
            },
            sidebar: {
                title: "AiOPSワークフロー",
                dev: { title: "モニタリング", sub: "リアルタイムロギング" },
                mkt: { title: "分析", sub: "パターンエンジン" },
                sup: { title: "コーチング", sub: "自動アドバイザー" },
                monitor: "プラットフォーム状態"
            },
            ui: {
                zoom: "ズーム",
                autoSave: "自動保存",
                efficiency: "効率性",
                reliability: "信頼性"
            }
        },
        genesis: {
            leftNodes: ["開発チーム A", "開発チーム B", "デザイナー", "PM", "QA"],
            rightNodes: ["Claude Code", "ChatGPT", "Cursor", "Copilot", "Gemini"],
            midComplex: ["追跡不可", "コスト不明", "セキュリティ盲点"],
            midSimple: ["使用モニタリング", "GRIDGE AiOPS", "AIコーチング"]
        },
        stage1: { line1: "あなたのチームは", line2: "AIを使っている" },
        stage2: { text1: "Claude、Cursor、ChatGPT、Copilot — あらゆる場所で。", text2: "しかし、可視性はゼロです。" },
        stage2_transform: { text1: "誰が何を使い、コストはいくらか。リスクは何か。", text2: "GRIDGE AiOPSがすべてを可視化します — 30分で。" },
        stage3: {
            title1: "Step 1.", title2: "AIスタックを連携", title3: "数分で完了",
            widgets: {
                profile: { name: "すべてのAIツール — 一目で", desc: "Claude、ChatGPT、Cursor、Copilot、Gemini — 一つのダッシュボードで確認。" },
                score: { title: "数分でセットアップ完了", desc: "ゼロから完全な可視化まで — インフラ変更不要。", items: [{ l: "API Proxy", v: "10分" }, { l: "Claude Code", v: "5分" }, { l: "ブラウザExtension", v: "5分" }, { l: "共有リンク", v: "2分" }] },
                change: { title: "コード変更ゼロ", desc: "環境変数一つだけ。それだけでロギングが始まります。", before: "各チームが個別に決済・管理", after: ["一つのダッシュボード、完全可視化", "統合コスト追跡"] },
                perf: { title: "Web会話も逃さない", desc: "ブラウザExtensionがClaude.ai、ChatGPT、Geminiの会話を自動収集。", s1: { t: "導入前", d: "Web AI会話 — 管理者に見えない" }, s2: { t: "導入後", d: "Extensionで15分ごとに自動収集" } },
                effect: { title: "すべてが記録される", desc: "すべてのAIインタラクションが構造化されたクエリ可能なデータに変換。", items: ["プロンプト + レスポンス (全文)", "トークン数 & コスト (モデル別)", "レイテンシ · チャネル · ユーザー · チーム"] },
                health: { title: "30分オンボーディング", desc: "ゼロから全チャネルロギングまで30分以内。インフラ変更不要。", items: [{ l: "API Proxy", v: "10分" }, { l: "Claude Code", v: "5分" }, { l: "Extension", v: "5分" }, { l: "共有リンク", v: "2分" }] },
                sfia: { title: "エンタープライズセキュリティ内蔵", desc: "エンタープライズグレードのデータ保護が初日から内蔵。", items: [{ l: "暗号化", v: "AES-256" }, { l: "データ分離", v: "組織別" }, { l: "保持期間", v: "設定可能" }] }
            }
        },
        stage4_genesis: {
            text1: "可視性のない個別AI導入は",
            text2: "ただのノイズに過ぎない。"
        },
        stage5_genesis: {
            text1: "同じAIサービス。同じコスト。",
            text2: "可視性、コーチング、コントロールをプラス。"
        },
        stage6_genesis: {
            text1: "韓国のトップチームが選択しました。",
            text2: "業界全体で実証された成果。"
        },
        stage7_genesis: {
            text1: "Claudeの上に構築。",
            text2: "世界最高のAIプラットフォームとパートナー。"
        },
        stage8_genesis: {
            text1: "どのように動作しますか？",
            text2: "3ステップ。9チャネル。1つのプラットフォーム。"
        },
        stage4: {
            title1: "Step 2.", title2: "使用状況を分析", title3: "組織全体を一目で",
            cards: {
                trad: { title: "個人ダッシュボード", sub: "各エンジニアが自分の\nAI使用量、コスト、パターンを確認。", outLabel: "指標", outVal: "個人別", skill: "自己認識" },
                ai: { title: "管理者ダッシュボード", sub: "CTO/リードがチーム全体の\n使用量、コスト、リスク、トレンドを確認。", outLabel: "指標", outVal: "組織全体", skill: "完全な可視性" }
            }
        },
        stage5: {
            title1: "Step 3.", title2: "チームのAI力量を", title3: "コーチングする",
            widgets: {
                lifecycle: {
                    title: "AI成熟度レベル",
                    data: [{ l: "探索期", v: 20 }, { l: "実験期", v: 40 }, { l: "定着期", v: 60 }, { l: "拡張期", v: 80 }, { l: "最適化期", v: 100 }],
                    interp: { title: "あなたのチーム", text: "ほとんどのチームはLevel 2から開始。AiOPSで3ヶ月でLevel 4に到達。" },
                    implic: { title: "目標", text: "Level 4+のチームは生産性が40%高い。" }
                },
                intent: {
                    title: "自動コーチングカード",
                    data: [{ l: "再質問率", v: 38, c: "bg-red-500" }, { l: "目標", v: 25, c: "bg-blue-500" }, { l: "モデル最適化", v: 20, c: "bg-yellow-500" }, { l: "活用拡大", v: 17, c: "bg-green-500" }],
                    insight: "使用パターンから自動生成される週次コーチングカード。実行可能。個人化。"
                },
                artifact: {
                    title: "イシュー自動検知",
                    data: [{ l: "再質問ループ", v: 35 }, { l: "未使用者", v: 22 }, { l: "予算超過", v: 20 }, { l: "コスト急増", v: 15 }, { l: "機密情報", v: 8 }],
                    note: "* 自動検知。管理者通知。機密情報はHITLレビュー。"
                },
                strategy: {
                    title: "ネクストステップアドバイザー",
                    current: { title: "現在の状態 (Level 2)", text: "開発チームはClaude Codeを積極的に使用。他のチームはほぼ実験レベル。" },
                    next: { title: "NEXT STEP → Level 3", text: "マーケティングチームにプロンプトテンプレートを配布。デザインチームのモニタリングを活性化。" }
                },
                defects: {
                    title: "5大核心指標",
                    stats: [{ l: "プロンプト品質", v: "68%" }, { l: "活用多様性", v: "3/7タイプ" }, { l: "コスト効率", v: "$2.40/タスク" }],
                    risk: { title: "コーチングトリガー", text: "再質問率30%超過時に自動コーチングカード配信。" }
                },
                collab: {
                    title: "チーム比較",
                    headers: ["チーム", "AI利用率", "成熟度", "1人当たりコスト", "トレンド"],
                    rows: [
                        { t: "プラットフォーム", p: "高", s: 95, v: "Lv.4", u: "$18" },
                        { t: "バックエンド", p: "高", s: 82, v: "Lv.3", u: "$24" },
                        { t: "フロントエンド", p: "中", s: 76, v: "Lv.3", u: "$12" },
                        { t: "QA", p: "低", s: 45, v: "Lv.2", u: "$6" },
                        { t: "デザイン", p: "低", s: 30, v: "Lv.1", u: "$3" },
                        { t: "マーケティング", p: "低", s: 25, v: "Lv.1", u: "$2" },
                        { t: "サポート", p: "なし", s: 10, v: "—", u: "$0" }
                    ]
                },
                bias: {
                    title: "週次自動レポート",
                    chart: [
                        { t: "プラットフォーム", d: 12.6, te: 5, i: 82.4 },
                        { t: "バックエンド", d: 11.1, te: 4, i: 84.9 },
                        { t: "フロントエンド", d: 8.5, te: 3, i: 88.5 },
                        { t: "QA", d: 5, te: 8, i: 87 },
                        { t: "デザイン", d: 4, te: 7, i: 89 }
                    ],
                    insight: "毎週月曜日に経営陣へ自動配信されるAI活用レポート。手作業ゼロ。"
                },
                standard: {
                    title: "ROI計算機",
                    mainStat: "¥180万",
                    segments: [{ l: "四半期節約額", v: "¥180万" }, { l: "50人チーム平均", v: "" }],
                    rca: { title: "算出根拠", text: "10%コスト最適化 + 25%再質問削減 + モデル最適化 = 測定可能なROI。" }
                }
            }
        },
        stage6: {
            title1: "Step 4. (プレビュー)", title2: "AI運用パイプラインを", title3: "転換する",
            nodeDetails: {
                'planning': {
                    name: '連携 (Connect)', role: '"API Proxy + Extension"', capabilities: "環境変数一つの変更でリクエスト/レスポンス全文ロギングを開始。", problemTarget: "分散し追跡不可能なAI使用"
                },
                'design': {
                    name: 'ロギング (Log)', role: '"非同期ストレージエンジン"', capabilities: "プロダクションにレイテンシ影響なしの非同期ロギング。", problemTarget: "使用データの不在"
                },
                'execution': {
                    name: '分析 (Analyze)', role: '"パターン検出"', capabilities: "使用パターン、コスト異常、再質問ループを自動検出。", problemTarget: "見えない非効率"
                },
                'val_top': {
                    name: '検知 (Detect)', role: '"リスク & 異常値"', capabilities: "機密データ露出、予算超過、未使用者を自動フラグ。", problemTarget: "セキュリティとコストの盲点"
                },
                'val_bot': {
                    name: 'レビュー (HITL)', role: '"人間承認"', capabilities: "機密データがフラグされると人間がレビュー後に対処。", problemTarget: "大規模AI出力の未レビュー"
                },
                'operations': {
                    name: 'レポート (Report)', role: '"週次ダイジェスト"', capabilities: "AIが生成した週次レポートを経営陣に自動配信。", problemTarget: "手動レポート負担"
                },
                'knowledge': {
                    name: 'コーチング (Coach)', role: '"自動アドバイザー"', capabilities: "使用パターンから個人化されたコーチングカードを自動生成。", problemTarget: "学習・改善ループの不在"
                },
                'req_interpreter': {
                    name: '連携 (Connect)', role: '"API Proxy + Extension"', capabilities: "環境変数一つの変更でリクエスト/レスポンス全文ロギングを開始。", problemTarget: "分散し追跡不可能なAI使用"
                },
                'architect': {
                    name: 'ロギング (Log)', role: '"非同期ストレージエンジン"', capabilities: "プロダクションにレイテンシ影響なしの非同期ロギング。", problemTarget: "使用データの不在"
                },
                'code_gen': {
                    name: '分析 (Analyze)', role: '"パターン検出"', capabilities: "使用パターン、コスト異常、再質問ループを自動検出。", problemTarget: "見えない非効率"
                },
                'validator': {
                    name: '検知 (Detect)', role: '"リスク & 異常値"', capabilities: "機密データ露出、予算超過、未使用者を自動フラグ。", problemTarget: "セキュリティとコストの盲点"
                },
                'test_gen': {
                    name: 'コーチング (Coach)', role: '"自動アドバイザー"', capabilities: "使用パターンから個人化されたコーチングカードを自動生成。", problemTarget: "学習・改善ループの不在"
                },
                'reviewer': {
                    name: 'レビュー (HITL)', role: '"人間承認"', capabilities: "機密データがフラグされると人間がレビュー後に対処。", problemTarget: "大規模AI出力の未レビュー"
                },
                'incident': {
                    name: 'レポート (Report)', role: '"週次ダイジェスト"', capabilities: "AIが生成した週次レポートを経営陣に自動配信。", problemTarget: "手動レポート負担"
                },
                'runbook': {
                    name: 'ダッシュボード', role: '"リアルタイム現況板"', capabilities: "チーム別AI使用量、コスト、成熟度をリアルタイムで可視化。", problemTarget: "現況把握の遅延"
                },
                'gen': {
                    name: '分析 (Analyze)', role: '"パターン検出"', capabilities: "使用パターン、コスト異常、再質問ループを自動検出。", problemTarget: "見えない非効率"
                },
                'ops': {
                    name: 'レポート (Report)', role: '"週次ダイジェスト"', capabilities: "AIが生成した週次レポートを経営陣に自動配信。", problemTarget: "手動レポート負担"
                },
                'arch': {
                    name: 'コスト分散', role: '"可視性なし"', capabilities: "AIコストが個人アカウントに分散し中央追跡が不可能。", problemTarget: "制御不能なAI支出"
                },
                'review': {
                    name: '追跡不可', role: '"盲点"', capabilities: "AI使用データが収集されず、最適化やコンプライアンスの基盤がない。", problemTarget: "意思決定データゼロ"
                },
                'repo': {
                    name: 'AiOPSプラットフォーム', role: '"統合AI管理"', capabilities: "すべてのAI使用に対するモニタリング、分析、コーチング、レポーティングを集約。", problemTarget: "分散ツール & 中央制御の不在"
                }
            }
        },
        genesisBenefits: [
            { title: "開発サイクル40%短縮", detail: "Selvas AI — 開発サイクル40%短縮、コードレビュー時間60%節約" },
            { title: "API開発速度3倍", detail: "StepPay — API開発速度3倍向上、セキュリティ脆弱性95%事前検知" },
            { title: "人件費25%削減", detail: "EdenT&S — プロジェクトM/M 25%削減、収益率15%p改善" },
            { title: "500+プロジェクト完了", detail: "Korail、Hybe、Samsung・LG・Hyundai系列会社など多数のエンタープライズ顧客" }
        ],
        stage7: {
            headlinePart1: "GRIDGE AiOPSで、", headlinePart2: "チームのAIポテンシャルが ", headlinePart3: "見えるようになります。",
            intro: "既存のAIツールはそのまま。既存のコストもそのまま。\n可視性、コーチング、コントロールを加えましょう — 今日から。",
            benefitTitle: "チームがGridgeを選ぶ理由", btnStart: "無料PoC相談", btnDemo: "デモリクエスト",
            benefits: [
                { title: "30分セットアップ", detail: "ゼロから全チャネルモニタリングまで。インフラ変更不要。" },
                { title: "9チャネル統合", detail: "Claude Code、ChatGPT、Cursor、Copilot、Gemini、API — 一つのビュー。" },
                { title: "AIコーチング自動化", detail: "個人化された週次コーチングカード。自動生成成熟度レポート。" },
                { title: "エンタープライズセキュリティ", detail: "AES-256暗号化。組織別データ分離。保持期間設定。" }
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
