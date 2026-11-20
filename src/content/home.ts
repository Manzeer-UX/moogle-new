/**
 * Home page copy. Source of truth: content/home-page.md (from "Moogle Home Page.pdf").
 * Friction answers reuse the wording of the delivery-stage and services sections.
 */

import type { StaticImageData } from "next/image";

export type StageLink = { label: string; href: string };

export type DeliveryStage = {
  number: string;
  name: string;
  /**
   * DRAFT, not in content/home-page.md (its note asks for a time frame per stage). Sized so
   * Discover + Strategize make the FAQ's "2 to 4 week" strategy sprint and Architect + Build +
   * Deploy its "8 to 16 weeks" to production. Review before launch.
   */
  duration: string;
  focus: string;
  execution: string;
  outcome: string;
  solves: StageLink[];
};

export type Friction = {
  id: string;
  question: string;
  /** Service named in the delivery stage's "Solves" line */
  service: string;
  /** Engineering execution / service description from the source document */
  detail: string;
  /** Index into deliveryStages where the engagement would start */
  stageIndex: number;
};

export const navLinks = [
  { label: "Solutions", href: "#solutions" },
  { label: "Industries", href: "#industries" },
  { label: "Case studies", href: "#case-studies" },
  { label: "Approach", href: "#approach" },
  { label: "Why MoogleLabs", href: "#why-mooglelabs" },
] as const;

export const contactCta = { label: "Schedule a call", href: "#contact" } as const;

/**
 * Where each "Solves" link lands. There are no service pages yet, so these point at the matching
 * service category on this page, or at the contact section when no category covers it.
 * Swap in the real service URLs once those pages exist.
 */
const SOLUTION_HREF = {
  strategy: "#contact",
  data: "#data-cloud",
  build: "#build-scale-ai",
  governance: "#trust-quality",
} as const;

/** "Delivery Stages" (section 8) from content/home-page.md, plus draft time frames */
export const deliveryStages: DeliveryStage[] = [
  {
    number: "01",
    name: "Discover",
    duration: "1–2 weeks",
    focus: "Commercial Feasibility & Technical Scoping",
    execution:
      "We audit data readiness, legacy architecture constraints, and operational bottlenecks to define technically viable, high-ROI target applications.",
    outcome: "Identify the right problems",
    solves: [{ label: "Enterprise AI Strategy & Opportunity Mapping", href: SOLUTION_HREF.strategy }],
  },
  {
    number: "02",
    name: "Strategize",
    duration: "1–2 weeks",
    focus: "Use-Case Prioritization & Commercial Roadmapping",
    execution:
      "We map technical dependencies against business urgency, defining delivery milestones, infrastructure resource requirements, and risk thresholds.",
    outcome: "A clear transformation plan",
    solves: [
      { label: "Enterprise AI Strategy", href: SOLUTION_HREF.strategy },
      { label: "AI Value & Cost Optimization", href: SOLUTION_HREF.strategy },
    ],
  },
  {
    number: "03",
    name: "Architect",
    duration: "2–3 weeks",
    focus: "Platform, Vector, & Infrastructure Design",
    execution:
      "We design production data pipelines, foundation model integration layers, vector storage, and zero-trust security postures.",
    outcome: "An implementation blueprint",
    solves: [
      { label: "AI-Ready Data Foundation", href: SOLUTION_HREF.data },
      { label: "AI PoC-to-Production", href: SOLUTION_HREF.build },
    ],
  },
  {
    number: "04",
    name: "Build",
    duration: "4–10 weeks",
    focus: "Full-Stack AI/ML development & Data Pipeline Engineering",
    execution:
      "We develop clean data ingestion flows, train or fine-tune task-specific models, build retrieval pipelines (RAG), and deploy autonomous workflow agents.",
    outcome: "A production-grade solution",
    solves: [
      { label: "AI-Ready Data Foundation", href: SOLUTION_HREF.data },
      { label: "AI PoC-to-Production", href: SOLUTION_HREF.build },
    ],
  },
  {
    number: "05",
    name: "Deploy",
    duration: "2–3 weeks",
    focus: "Cloud, DevOps, MLOps, Orchestration, & System Integration",
    execution:
      "We automate continuous delivery pipelines (CI/CD/CT), containerized model serving, fallback routing, and latency-budget monitoring.",
    outcome: "Complete deployment",
    solves: [{ label: "AI PoC-to-Production Integration", href: SOLUTION_HREF.build }],
  },
  {
    number: "06",
    name: "Govern",
    duration: "Continuous",
    focus: "Model Safety, Guardrails, & Auditability",
    execution:
      "We implement continuous red-teaming, automated prompt-injection defenses, drift monitoring, and compliance logging across the full stack.",
    outcome: "Secure and compliant operations",
    solves: [{ label: "AI Security & Enterprise Governance", href: SOLUTION_HREF.governance }],
  },
  {
    number: "07",
    name: "Scale",
    duration: "Ongoing",
    focus: "Compute Optimization, FinOps, & Continuous Learning",
    execution:
      "We run model quantization, caching strategies, active inference tuning, and sustained multi-tenant infrastructure support.",
    outcome: "Sustainable enterprise adoption",
    solves: [
      { label: "AI Value Optimization", href: SOLUTION_HREF.strategy },
      { label: "AI Implementation", href: SOLUTION_HREF.build },
    ],
  },
];

/** Section 8's framing. The two figures are the engagement lengths from FAQ answer 7. */
export const delivery = {
  heading: "The 7 delivery stages",
  figures: [
    { value: "2–4 weeks", label: "AI Readiness & Strategy Sprint" },
    { value: "8–16 weeks", label: "To a live production deployment" },
  ],
  labels: {
    focus: "Focus",
    execution: "Engineering execution",
    outcome: "Enterprise outcome",
    solves: "Solves",
  },
  governance: {
    title: "Governed end to end.",
    description: "Security, data and AI governance checks run at every stage, not just at the end.",
  },
  stages: deliveryStages,
};

export const hero = {
  eyebrow: "Enterprise AI Engineering",
  title: "From Experimental AI to Production Intelligence",
  description:
    "We bridge the gap between AI pilots and live deployment by engineering secure, governed, cost-efficient platforms inside your core operational stack.",
  primaryCta: { label: "Discuss your AI roadmap", href: "#contact" },
  secondaryCta: { label: "Explore solutions below", href: "#solutions" },
  friction: {
    heading: "Where is your AI roadmap encountering friction?",
    hint: "Pick one to start",
    stagesLink: { label: "See all seven delivery stages", href: "#approach" },
    items: [
      {
        id: "start",
        question: "We know AI can help, but where should we start?",
        service: "Enterprise AI Strategy & Opportunity Mapping",
        detail:
          "We audit data readiness, legacy architecture constraints, and operational bottlenecks to define technically viable, high-ROI target applications.",
        stageIndex: 0,
      },
      {
        id: "production",
        question: "Our AI pilots aren’t reaching production.",
        service: "AI PoC-to-Production Integration",
        detail:
          "We automate continuous delivery pipelines (CI/CD/CT), containerized model serving, fallback routing, and latency-budget monitoring.",
        stageIndex: 4,
      },
      {
        id: "data",
        question:
          "How can we make sense of complex, unstructured, and growing data?",
        service: "AI-Ready Data Foundation",
        detail:
          "Consolidate siloed enterprise data into structured, clean, and vector-indexed pipelines ready for high-accuracy model training and retrieval.",
        stageIndex: 2,
      },
      {
        id: "governance",
        question: "How do we make AI secure, compliant and controllable?",
        service: "AI Security & Enterprise Governance",
        detail:
          "We implement continuous red-teaming, automated prompt-injection defenses, drift monitoring, and compliance logging across the full stack.",
        stageIndex: 5,
      },
      {
        id: "cost",
        question: "Our AI costs are growing, but the value isn’t clear.",
        service: "AI Value & Cost Optimization",
        detail:
          "We run model quantization, caching strategies, active inference tuning, and sustained multi-tenant infrastructure support.",
        stageIndex: 6,
      },
    ] satisfies Friction[],
  },
};

export type Service = {
  id: string;
  name: string;
  description: string;
};

export type ServiceCategory = {
  id: string;
  title: string;
  tagline: string;
  services: Service[];
};

/** "Services Section: Capabilities & Solutions" from content/home-page.md */
export const services = {
  heading: "Capabilities & Solutions",
  categories: [
    {
      id: "build-scale-ai",
      title: "Build & Scale AI",
      tagline:
        "Transform models from lab experiments into resilient, revenue-generating enterprise software with our AI/ML services.",
      services: [
        {
          id: "ai-implementation",
          name: "AI Implementation Services",
          description:
            "Deploy production-grade machine learning models into live environments with hardened security, minimal latency, and measurable business ROI.",
        },
        {
          id: "enterprise-intelligence",
          name: "Enterprise Intelligence",
          description:
            "Unify predictive analytics and custom LLMs across operational workflows to accelerate executive decision-making and automate complex problem-solving.",
        },
        {
          id: "agentic-operations",
          name: "Agentic Operations",
          description:
            "Deploy autonomous AI agents that orchestrate multi-step business logic, interact with enterprise software, and execute complex workflows reliably.",
        },
        {
          id: "workflow-automation",
          name: "Workflow Automation",
          description:
            "Eliminate manual bottlenecks with enterprise workflow automation that integrates intelligent agents across legacy architectures, enterprise ERPs, and modern cloud applications.",
        },
      ],
    },
    {
      id: "data-cloud",
      title: "Data Engineering & Cloud Infrastructure",
      tagline:
        "Build the high-throughput, governed pipelines through specialized data engineering services and resilient cloud architectures.",
      services: [
        {
          id: "ai-ready-data",
          name: "AI-Ready Data Foundation",
          description:
            "Consolidate siloed enterprise data into structured, clean, and vector-indexed pipelines ready for high-accuracy model training and retrieval.",
        },
        {
          id: "ai-cloud-reliability",
          name: "AI Cloud & Reliability",
          description:
            "Combine AI cloud engineering, continuous MLOps pipelines, and infrastructure guardrails for zero-downtime model serving at scale.",
        },
      ],
    },
    {
      id: "trust-quality",
      title: "Trust, Quality & Verification",
      tagline:
        "De-risk deployment through comprehensive compliance, model security, and quality assurance.",
      services: [
        {
          id: "ai-security-governance",
          name: "AI Security & Governance",
          description:
            "Protect proprietary intellectual property, eliminate hallucinations, and enforce strict regulatory compliance through continuous model monitoring and guardrails.",
        },
        {
          id: "ai-testing",
          name: "AI Testing",
          description:
            "Stress-test model accuracy, safety limits, and edge-case behavior before launch to prevent hallucination, drift, and unexpected runtime failures.",
        },
        {
          id: "ai-quality-engineering",
          name: "AI Quality Engineering",
          description:
            "Accelerate traditional software release cycles using AI-driven automated testing, intelligent test design, and continuous regression analysis.",
        },
      ],
    },
    {
      id: "decentralized",
      title: "Decentralized Architecture",
      tagline: "Ensure tamper-proof provenance, data sovereignty, and distributed execution.",
      services: [
        {
          id: "web3-decentralized-ai",
          name: "Web3 & Decentralized AI",
          description:
            "Combine distributed ledgers with artificial intelligence to ensure cryptographic data provenance, secure compute sharing, and verifiable model execution.",
        },
      ],
    },
  ] satisfies ServiceCategory[],
};

export type Industry = {
  id: string;
  name: string;
  /** DRAFT, not in content/home-page.md: typical AI applications for the sector. Review before launch. */
  useCases: string[];
};

/**
 * "Industries We Serve" from content/home-page.md. The eyebrow, heading and sector names are
 * source copy; the use-case label and the use cases are draft additions.
 */
export const industries = {
  eyebrow: "Industries we serve",
  heading: "Intelligence tailored to how your sector actually operates.",
  useCasesLabel: "Where AI fits",
  cta: hero.primaryCta,
  items: [
    {
      id: "healthcare",
      name: "Healthcare",
      useCases: ["Clinical documentation", "Patient-flow forecasting", "Medical coding automation"],
    },
    {
      id: "logistics",
      name: "Logistics & Supply Chain",
      useCases: ["Demand forecasting", "Route optimization", "Inventory visibility"],
    },
    {
      id: "fintech",
      name: "Fintech",
      useCases: ["Fraud detection", "Credit risk scoring", "KYC & onboarding automation"],
    },
    {
      id: "edtech",
      name: "EdTech",
      useCases: ["Adaptive learning paths", "Automated assessment", "Learner analytics"],
    },
    {
      id: "real-estate",
      name: "Real Estate",
      useCases: ["Automated valuation", "Lease abstraction", "Portfolio analytics"],
    },
    {
      id: "manufacturing",
      name: "Manufacturing",
      useCases: ["Predictive maintenance", "Visual quality inspection", "Production planning"],
    },
    {
      id: "insurance",
      name: "Insurance",
      useCases: ["Claims triage", "Underwriting support", "Fraud analytics"],
    },
    {
      id: "construction",
      name: "Construction",
      useCases: ["Project risk forecasting", "RFI & document automation", "Site safety monitoring"],
    },
    {
      id: "government",
      name: "Government",
      useCases: ["Citizen service automation", "Records & case processing", "Policy search & summarization"],
    },
  ] satisfies Industry[],
};

export type TraceStep = {
  name: string;
  /** Latency in milliseconds */
  ms: number;
};

/** "The Enterprise Stack & Tooling" (section 6) from content/home-page.md */
export const enterpriseStack = {
  eyebrow: "End-to-end enterprise delivery",
  heading: "One unified team across the full enterprise AI lifecycle.",
  description: "One team across the whole AI stack, backed by our own platform and product suite.",
  capabilities: ["AI", "Data", "Engineering", "Cloud", "Security", "Governance", "Automation"],
  platform: {
    label: "Our platform",
    name: "PRISM AI",
    description:
      "Our AI observability and governance platform. See and control every AI system in one place.",
    features: ["Tracing", "Evaluations", "Prompt management", "Cost tracking", "Audit trail"],
    /** Illustrative sample trace from the source document, labelled as a sample on the page */
    trace: {
      label: "Sample trace",
      name: "customer assistant",
      status: "Passed",
      steps: [
        { name: "Input guardrail", ms: 12 },
        { name: "Retrieve 3 sources", ms: 140 },
        { name: "Model call", ms: 820 },
        { name: "Output check · PII", ms: 9 },
      ] satisfies TraceStep[],
      metrics: [
        { label: "Groundedness", value: "0.94" },
        { label: "Policy", value: "Pass" },
        { label: "Cost", value: "$0.004" },
      ],
    },
    cta: { label: "See PRISM AI in action", href: "https://prismai.mooglelabs.com/" },
  },
  products: {
    label: "Our product suite",
    name: "DevForge.ai",
    description: "Purpose-built AI products we designed and run in production, reused in client work.",
    link: { label: "devforge.ai", href: "https://devforge.ai/" },
    count: "14 AI products",
    innerRing: ["Autonomo AI", "Agent-Pipeline", "Pulse-AI", "STAGE", "REX", "VIRA"],
    outerRing: ["ELVIS", "IAN", "ThinkDocs", "Alluvium", "Presales", "PropIQ", "Review Attendant", "AttendAI"],
  },
};

export type Pillar = {
  id: string;
  title: string;
  description: string;
  differentiator: string;
};

/** "Why MoogleLabs" (section 9) from content/home-page.md */
export const whyMoogle = {
  eyebrow: "Why MoogleLabs",
  heading: "We do not sell headcount or prototypes. We deliver operational capability.",
  description:
    "An end-to-end transformation partner, taking ownership from the business problem to a secure, governed, and scalable AI/ML solutions.",
  pillars: [
    {
      id: "problem-first",
      title: "Business problem first, technology second",
      description:
        "We start with the commercial outcome you need, then engineer the stack that achieves it.",
      differentiator: "Outcome-led, not technology-led",
    },
    {
      id: "poc-to-production",
      title: "PoC-to-production ownership",
      description:
        "We bridge the gap between experimental prototypes and dependable, mission-critical systems.",
      differentiator: "We stay through the hard part",
    },
    {
      id: "ip-ownership",
      title: "Full IP ownership & architectural independence",
      description:
        "You retain 100% ownership of your custom models, data pipelines, and codebase; built on open, portable standards without proprietary platform traps.",
      differentiator: "Zero vendor lock-in",
    },
    {
      id: "foundation",
      title: "AI and data foundation together",
      description:
        "Data engineering, knowledge retrieval layers, and security controls built alongside the model.",
      differentiator: "The foundation, not just the interface",
    },
    {
      id: "enterprise-grade",
      title: "Enterprise-grade by design",
      description:
        "Model guardrails, zero-trust security, cost optimization, and observability embedded from day one.",
      differentiator: "Production-ready from the first commit",
    },
    {
      id: "operating-model",
      title: "From one use case to an operating model",
      description:
        "Once initial value is proven, we establish the platform architecture to scale AI across the enterprise.",
      differentiator: "Point solutions to an AI-enabled enterprise",
    },
  ] satisfies Pillar[],
};

export type ScaleStage = {
  number: string;
  name: string;
  description: string;
};

export type Foundation = {
  name: string;
  /** One entry per scale stage, in stage order */
  stages: [string, string, string];
};

/** "Operating Model (Scale Visual)" (section 10) from content/home-page.md */
export const operatingModel = {
  eyebrow: "From one use case to an operating model",
  heading: { lead: "We don’t build isolated AI apps. We build", accent: "AI that scales." },
  description:
    "Once the first use case proves value, we put the architecture, data foundation, governance, reusable components and engineering practices in place, so every next use case is faster, cheaper and safer.",
  valueLabel: "Business value",
  foundationsLabel: "Foundations that compound",
  stages: [
    { number: "01", name: "AI experiments", description: "Promising pilots, each built on its own." },
    {
      number: "02",
      name: "Repeatable AI capability",
      description: "Shared data, platforms, governance and patterns the next use case reuses.",
    },
    {
      number: "03",
      name: "AI-enabled enterprise",
      description: "AI running across business functions, measured, governed and improving.",
    },
  ] satisfies ScaleStage[],
  foundations: [
    {
      name: "Architecture",
      stages: ["Designed for one use case", "Reference architecture, reused", "One enterprise AI platform"],
    },
    {
      name: "Data foundation",
      stages: ["Data for one use case", "Shared, governed data products", "Trusted knowledge layer"],
    },
    {
      name: "Governance",
      stages: ["Controls built in from day one", "Standard approval path", "One model for every use case"],
    },
    {
      name: "Reusable components",
      stages: ["First connectors and guardrails", "Component library", "New use cases in weeks"],
    },
    {
      name: "Engineering practices",
      stages: ["CI/CD and evaluation", "LLMOps on every release", "AI Center of Excellence"],
    },
  ] satisfies Foundation[],
  footnote: "Every stage measured with PRISM AI: quality, cost and reliability",
  cta: { label: "Plan your operating model", href: "#contact" },
};

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  /** Square headshot (import it from src/assets); a placeholder tile shows until there is one */
  photo?: StaticImageData;
};

/**
 * "Testimonials" (section 11). The source has no quotes yet ("Add real testimonials here"), so
 * these are PLACEHOLDERS, worded as placeholders on purpose. Replace every entry with a real,
 * approved client quote before launch; never ship them as they are.
 */
export const testimonials = {
  heading: "Don’t take our word for it. Take theirs.",
  items: [
    {
      id: "placeholder-production",
      quote: "Placeholder: a client quote on taking an AI pilot from proof-of-concept into live production.",
      name: "Client name",
      role: "Role, Company",
    },
    {
      id: "placeholder-data",
      quote: "Placeholder: a client quote on the AI-ready data foundation and what it unlocked.",
      name: "Client name",
      role: "Role, Company",
    },
    {
      id: "placeholder-governance",
      quote: "Placeholder: a client quote on governance, security and passing compliance review.",
      name: "Client name",
      role: "Role, Company",
    },
    {
      id: "placeholder-cost",
      quote: "Placeholder: a client quote on bringing inference and cloud costs under control.",
      name: "Client name",
      role: "Role, Company",
    },
    {
      id: "placeholder-team",
      quote: "Placeholder: a client quote on working with one accountable team across the stack.",
      name: "Client name",
      role: "Role, Company",
    },
  ] satisfies Testimonial[],
};

/**
 * "Final CTA" (section 12) from content/home-page.md. Every "#contact" link on the page lands here.
 * The button needs the real booking link (calendar or form); until then it points back at this section.
 */
export const finalCta = {
  eyebrow: "Next steps",
  heading: "Discuss your roadmap with an AI solutions architect.",
  description:
    "Share where your team is facing friction. In a focused 30-minute technical session, we will assess your current constraints and outline a practical path toward production. No sales pitch, no commitment.",
  cta: { label: "Schedule a Technical Discovery Call", href: "#contact" },
  microcopy: ["Direct access to senior engineering leads", "Zero obligation"],
};

export type FaqItem = {
  id: string;
  question: string;
  /** Plain text; **double asterisks** mark emphasis, as in the source */
  answer: string;
};

/** "Frequently Asked Questions" (section 13) from content/home-page.md */
export const faq = {
  heading: "Frequently asked questions",
  cta: finalCta.cta,
  items: [
    {
      id: "reach-production",
      question: "How do you ensure our AI pilots actually reach production instead of stalling in testing?",
      answer:
        "Most proofs-of-concept fail because they are built in isolated sandboxes without accounting for live data pipelines, latency budgets, or security requirements. We engineer for production constraints from day one, building data ingestion, MLOps deployment pipelines, automated testing, and fallback routing concurrently with the model so your system integrates cleanly into existing enterprise infrastructure.",
    },
    {
      id: "ip-ownership",
      question: "Who owns the intellectual property, custom models, and codebase once a project is delivered?",
      answer:
        "You retain 100% ownership of all custom code, fine-tuned weights, data pipelines, and architectural documentation. We build on open, portable cloud and MLOps frameworks with zero proprietary vendor lock-in, ensuring your internal teams can maintain, audit, and extend the platform independently.",
    },
    {
      id: "data-protection",
      question:
        "How do you protect proprietary enterprise data, prevent model hallucinations, and ensure compliance?",
      answer:
        "Governance is embedded across every stage of delivery rather than treated as a post-launch checklist. We deploy private VPC or on-premise model hosting so your data never trains public third-party models, enforce Retrieval-Augmented Generation (RAG) grounded strictly in verified enterprise sources, and implement automated guardrails, red-teaming, and audit logging aligned with your regulatory standards.",
    },
    {
      id: "fragmented-data",
      question:
        "Our enterprise data is currently fragmented across legacy systems. Can we still start an AI initiative?",
      answer:
        "Yes. You do not need a multi-year data warehouse overhaul before capturing AI value. Our data engineering team builds targeted, AI-ready ingestion and vector pipelines specifically scoped to the workflows required for your initial use cases. This allows you to launch securely while modernizing your broader data foundation incrementally.",
    },
    {
      id: "inference-costs",
      question: "How do you keep cloud compute and LLM inference costs from spiraling as usage grows?",
      answer:
        "We incorporate AI FinOps directly into our architecture. Rather than defaulting to oversized, expensive foundation models for every task, we optimize unit economics through right-sized small language models (SLMs), model quantization, semantic caching, and intelligent query routing. This ensures infrastructure costs scale predictably alongside business value.",
    },
    {
      id: "how-we-differ",
      question: "How does MoogleLabs differ from traditional IT staffing agencies or niche AI boutiques?",
      answer:
        "Staffing agencies supply disconnected headcount without architectural accountability, while niche AI boutiques often lack the enterprise engineering depth required for cloud security, legacy ERP integration, and quality assurance. We provide a single, accountable team covering the full stack: data engineering, AI/ML development, cloud MLOps, security governance, and automated QA.",
    },
    {
      id: "engagement",
      question: "What does a typical engagement look like, and how quickly can we see measurable results?",
      // Highlighted in the source document, likely flagged for review
      answer:
        "Engagements are structured around your current maturity. For organizations defining their roadmap, a fixed-scope **2 to 4 week AI Readiness & Strategy Sprint** validates feasibility and ROI. For defined initiatives, production-grade deployments typically reach live operational environments within **8 to 16 weeks**, using milestone-based delivery so you see working capability early.",
    },
  ] satisfies FaqItem[],
};
