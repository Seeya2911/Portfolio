// Quiet Systems Studio — restructured as Academic + Research + AI/Data Science portfolio.
import { useEffect, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  BookOpen,
  BriefcaseBusiness,
  ChevronRight,
  ExternalLink,
  FileText,
  Github,
  Mail,
  Menu,
  Network,
  X,
  GraduationCap,
  Star,
  BarChart3,
  Linkedin,
  MapPin,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useScrollReveal } from "@/hooks/useScrollReveal";

// ── Asset paths ───────────────────────────────────────────────────────────────
const markAsset = "/manus-storage/seeya-ssk-mark_dc91885b.png";
const portraitAsset = "/seeya-portrait.jpg";

// ── Navigation ────────────────────────────────────────────────────────────────
const navItems: [string, string][] = [
  ["Profile", "profile"],
  ["Academic", "academic"],
  ["Research", "research"],
  ["Projects", "projects"],
  ["Experience", "experience"],
  ["Interests", "interests"],
  ["Skills", "skills"],
  ["Credentials", "credentials"],
  ["Contact", "contact"],
];

// ── Shared utility components (preserved from original design system) ─────────
function SectionLabel({ number, children }: { number?: string; children: string }) {
  return (
    <div className="section-label">
      {number && <span>{number}</span>}
      <i className="section-signal" aria-hidden="true">
        <b />
        <b />
        <b />
      </i>
      <span>{children}</span>
    </div>
  );
}

function Pill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "terracotta" | "sage";
}) {
  return <span className={`pill pill-${tone}`}>{children}</span>;
}

function Workflow({ items }: { items: string[] }) {
  return (
    <div className="workflow" aria-label="Project workflow">
      {items.map((item, index) => (
        <div className="workflow-item" key={item}>
          <span className="workflow-node">{String(index + 1).padStart(2, "0")}</span>
          <span>{item}</span>
          {index < items.length - 1 && <ChevronRight className="workflow-arrow" size={15} />}
        </div>
      ))}
    </div>
  );
}

// ── Semester chart data ───────────────────────────────────────────────────────
const semesters = [
  { sem: "I",   sgpi: 7.28,  highlight: false },
  { sem: "II",  sgpi: 7.10,  highlight: false },
  { sem: "III", sgpi: 9.09,  highlight: false },
  { sem: "IV",  sgpi: 9.25,  highlight: false },
  { sem: "V",   sgpi: 9.09,  highlight: false },
  { sem: "VI",  sgpi: 10.00, highlight: true  },
  { sem: "VII", sgpi: 9.18,  highlight: false },
  { sem: "VIII",sgpi: 9.71,  highlight: true  },
];

function SemesterChart() {
  const max = 10;
  const chartHeight = 120; // px, bar container height
  return (
    <div>
      <p className="semester-section-title">SGPI Progression · I – VIII</p>
      <div className="semester-chart" role="img" aria-label="Semester-wise SGPI progression bar chart">
        {semesters.map(({ sem, sgpi, highlight }) => {
          const barH = Math.round((sgpi / max) * chartHeight);
          return (
            <div className="sem-col" key={sem}>
              <div className="sem-bar-wrap">
                <span className={`sem-value ${highlight ? "bold-val" : ""}`}>{sgpi.toFixed(2)}</span>
                <div
                  className={`sem-bar ${highlight ? "highlight" : ""}`}
                  style={{ height: barH }}
                  aria-label={`Semester ${sem}: ${sgpi}`}
                />
              </div>
              <span className="sem-label">{sem}</span>
            </div>
          );
        })}
      </div>
      <div className="semester-chart-footer">
        <span>Semesters I – VIII · University of Mumbai</span>
        <div className="cgpi-inline">
          <strong>8.90</strong>
          <span>/ 10 CGPI</span>
        </div>
      </div>
    </div>
  );
}

// ── Main page component ────────────────────────────────────────────────────────
export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { data: managedAssets } = trpc.portfolioAssets.publicMap.useQuery();
  useScrollReveal();
  const publicPortraitAsset = managedAssets?.profile?.storageUrl ?? portraitAsset;
  const publicResumeAsset =
    managedAssets?.resume?.storageUrl ?? "/documents/seeya-kangutkar-resume.pdf";
  const publicGateScorecard =
    (managedAssets as Record<string, any> | undefined)?.gateScorecard?.storageUrl ??
    "/documents/gate-2025-scorecard.pdf";
  const publicIeltsScorecard =
    (managedAssets as Record<string, any> | undefined)?.ieltsScorecard?.storageUrl ??
    "/documents/ielts-scorecard.pdf";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? window.scrollY / docHeight : 0);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="site-shell">
      {/* ── Navigation ─────────────────────────────────────────────────────── */}
      <header className={`site-nav ${scrolled ? "nav-scrolled" : ""}`}>
        <a className="wordmark" href="#top" aria-label="Seeya Sameer Kangutkar home">
          <span className="ssk-monogram">SSK</span>
          <span className="full-lockup">
            Seeya <b>Kangutkar</b>
          </span>
        </a>
        <nav
          className={`desktop-nav ${menuOpen ? "mobile-open" : ""}`}
          aria-label="Primary navigation"
        >
          <button className="mobile-close" onClick={closeMenu} aria-label="Close menu">
            <X size={22} />
          </button>
          {navItems.map(([label, id]) => (
            <a href={`#${id}`} key={id} onClick={closeMenu}>
              {label}
            </a>
          ))}
          <a className="nav-cta" href="mailto:seeyakangutkar@gmail.com">
            Say hello <ArrowUpRight size={14} />
          </a>
        </nav>
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <span
          className="nav-progress"
          style={{ transform: `scaleX(${scrollProgress})` }}
        />
      </header>

      <main id="top">
        {/* ── HERO ────────────────────────────────────────────────────────── */}
        <section className="hero section-wrap">
          <div className="hero-copy reveal">
            <p className="eyebrow">
              AI &amp; DATA SCIENCE GRADUATE
            </p>
            <h1>
              Building<br />
              <em>Research-Driven</em><br />
              Intelligent<br />
              Systems
            </h1>
            <p className="hero-intro">
              AI &amp; Data Science graduate with a strong foundation in machine
              learning, deep learning, data analytics and computer science, with
              research experience in behavioural malware detection and experience
              building applied AI systems.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#research">
                Explore Research <ArrowDownRight size={17} />
              </a>
              <a className="button button-secondary" href="#projects">
                View Projects <ArrowUpRight size={16} />
              </a>
              <a
                className="button button-secondary"
                href={publicResumeAsset}
                target="_blank"
                rel="noreferrer"
              >
                Download CV <FileText size={16} />
              </a>
            </div>

            <div className="hero-stats-grid">
              <div className="hero-stat-item">
                <GraduationCap size={18} className="stat-icon" />
                <div>
                  <span className="stat-title">B.E. AI &amp; Data Science</span>
                  <strong className="stat-main">2026</strong>
                  <span className="stat-desc">University of Mumbai</span>
                </div>
              </div>
              <div className="hero-stat-item">
                <Star size={18} className="stat-icon" />
                <div>
                  <span className="stat-title">CGPI</span>
                  <strong className="stat-main">8.90 / 10</strong>
                  <span className="stat-desc">Final CGPI</span>
                </div>
              </div>
              <div className="hero-stat-item">
                <BarChart3 size={18} className="stat-icon" />
                <div>
                  <span className="stat-title">Semester VIII</span>
                  <strong className="stat-main">9.71 / 10</strong>
                  <span className="stat-desc">Final SGPI</span>
                </div>
              </div>
            </div>

            <div className="hero-links">
              <a href="mailto:seeyak2911@gmail.com" className="flex items-center gap-1.5">
                <Mail size={15} /> seeyak2911@gmail.com
              </a>
              <a
                href="https://linkedin.com/in/seeya-kangutkar"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5"
              >
                <Linkedin size={15} /> LinkedIn
              </a>
              <span className="hero-location flex items-center gap-1.5">
                <MapPin size={14} /> Mumbai, Maharashtra, India
              </span>
            </div>
          </div>
          <div className="hero-portrait-container reveal reveal-delay">
            <img
              src={publicPortraitAsset}
              alt="Portrait of Seeya Sameer Kangutkar"
              className="hero-portrait-image"
            />
            <div className="identity-card-overlay">
              <span className="id-name">SEEYA SAMEER KANGUTKAR</span>
              <span className="id-title">AI &amp; Data Science Graduate</span>
              <div className="id-divider" />
              <span className="id-subtitle">B.E. Artificial Intelligence &amp; Data Science · 2026</span>
            </div>
          </div>
        </section>

        {/* ── PROFILE STRIP ───────────────────────────────────────────────── */}
        <section className="profile-strip reveal-on-scroll">
          <div className="section-wrap profile-grid">
            <div className="profile-lead">
              <span className="profile-kicker">AT A GLANCE</span>
              <p>
                A technically grounded graduate with academic preparation, published
                research, industry exposure and project work connecting research
                questions to working prototypes.
              </p>
            </div>
            <div className="profile-item">
              <span>01</span>
              <strong>8.90 / 10</strong>
              <small>Final CGPI · B.E.</small>
            </div>
            <div className="profile-item">
              <span>02</span>
              <strong>ICSICE 2026</strong>
              <small>Published · Conference</small>
            </div>
            <div className="profile-item">
              <span>03</span>
              <strong>GATE 2025</strong>
              <small>Data Science &amp; AI · Qualified</small>
            </div>
          </div>
        </section>

        {/* ── 01 — PROFILE ────────────────────────────────────────────────── */}
        <section id="profile" className="section-wrap about-section section-pad reveal-on-scroll">
          <div className="section-aside">
            <SectionLabel number="01">Profile</SectionLabel>
            <span className="aside-note">
              A foundation built to keep learning.
            </span>
          </div>
          <div className="about-content">
            <h2>Curious about how intelligent systems become useful in the real world.</h2>
            <div className="about-columns">
              <p>
                My academic path in Artificial Intelligence &amp; Data Science at the University of Mumbai gave me a strong foundation in mathematics, statistics, algorithms, and core computer science. Building on this theoretical baseline, I focused my practical work on developing machine learning and deep learning applications, transitioning from course projects to functional prototypes.
              </p>
              <p>
                To understand these technologies in professional settings, I undertook industry internships focusing on end-to-end AI pipelines and data-driven analysis. My final-year research focused on behavioral malware detection, where our team designed a hybrid ML/DL classification framework that was subsequently published at ICSICE 2026. Motivated by this experience, I aim to pursue advanced graduate study to deepen my theoretical and methodological understanding of intelligent systems.
              </p>
            </div>
            <div className="about-sub-block" style={{ marginTop: 32, borderTop: "1px solid var(--line)", paddingTop: 20 }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--terracotta)", display: "block", marginBottom: 6 }}>FROM COURSEWORK TO SYSTEMS</span>
              <p style={{ fontSize: "14px", color: "var(--muted)", margin: 0, maxWidth: "680px", lineHeight: 1.5 }}>
                My work has moved across machine learning, deep learning, NLP, computer vision and data-driven systems, with a recurring focus on turning structured data and behavioural signals into useful decisions.
              </p>
            </div>
          </div>
        </section>

        {/* ── 02 — ACADEMIC FOUNDATION ─────────────────────────────────────── */}
        <section id="academic" className="academic-section section-pad">
          <div className="section-wrap">
            <div className="academic-inner">
              <div className="section-aside">
                <SectionLabel number="02">Academic Foundation</SectionLabel>
                <span className="aside-note">
                  B.E. Artificial Intelligence &amp; Data Science · University of Mumbai
                </span>
              </div>
              <div className="academic-content">
                {/* Degree stats */}
                <div className="degree-stats-row" role="group" aria-label="Academic performance">
                  <div className="stat-block">
                    <span className="stat-block-label">Final CGPI</span>
                    <span className="stat-block-value">8.90</span>
                    <span className="stat-block-sub">out of 10</span>
                  </div>
                  <div className="stat-block">
                    <span className="stat-block-label">Sem VIII SGPI</span>
                    <span className="stat-block-value">9.71</span>
                    <span className="stat-block-sub">Final semester</span>
                  </div>
                  <div className="stat-block">
                    <span className="stat-block-label">Degree Percentage</span>
                    <span className="stat-block-value">77.63%</span>
                    <span className="stat-block-sub">Overall</span>
                  </div>
                  <div className="stat-block">
                    <span className="stat-block-label">Year</span>
                    <span className="stat-block-value">2026</span>
                    <span className="stat-block-sub">Vasantdada Patil Pratishthan's CoE</span>
                  </div>
                </div>

                {/* Course categories */}
                <div className="course-categories" role="list" aria-label="Curriculum areas">
                  <div className="course-category" role="listitem">
                    <div className="course-category-label">
                      <span>01</span>Mathematics
                    </div>
                    <div className="course-tags">
                      {["Calculus", "Matrices / Linear Algebra foundations", "Probability", "Statistics", "Numerical Methods", "Optimization", "Regression"].map(c => (
                        <span key={c} className="course-tag math-tag">{c}</span>
                      ))}
                    </div>
                  </div>
                  <div className="course-category" role="listitem">
                    <div className="course-category-label">
                      <span>02</span>Computer Science
                    </div>
                    <div className="course-tags">
                      {["Programming", "Data Structures", "Algorithms", "Database Management Systems", "Operating Systems", "Computer Networks", "Object-Oriented Programming", "Software Engineering", "Discrete Structures & Graph Theory"].map(c => (
                        <span key={c} className="course-tag">{c}</span>
                      ))}
                    </div>
                  </div>
                  <div className="course-category" role="listitem">
                    <div className="course-category-label">
                      <span>03</span>Artificial Intelligence
                    </div>
                    <div className="course-tags">
                      {["Artificial Intelligence", "Machine Learning", "Deep Learning", "Natural Language Processing", "Computer Vision / Image Processing", "Reinforcement Learning"].map(c => (
                        <span key={c} className="course-tag ai-tag">{c}</span>
                      ))}
                    </div>
                  </div>
                  <div className="course-category" role="listitem">
                    <div className="course-category-label">
                      <span>04</span>Data &amp; Systems
                    </div>
                    <div className="course-tags">
                      {["Data Warehousing & Mining", "Data Analytics & Visualization", "Big Data Analytics", "Cloud Computing", "Cryptography & System Security"].map(c => (
                        <span key={c} className="course-tag">{c}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Semester SGPI chart */}
                <SemesterChart />

                {/* Final semester strip */}
                <div className="final-sem-strip">
                  <div className="final-sem-header">
                    <span className="final-sem-title">Final Semester · SGPI 9.71</span>
                  </div>
                  <div className="final-sem-subjects">
                    {[
                      { name: "Advanced Artificial Intelligence", grade: "O" },
                      { name: "Reinforcement Learning", grade: "O" },
                      { name: "Research Methodology", grade: "A" },
                      { name: "Major Project II", grade: "O" },
                    ].map(({ name, grade }) => (
                      <span key={name} className="final-sem-subject">
                        {name}
                        <span className="final-sem-subject-grade">{grade}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 03 — RESEARCH ────────────────────────────────────────────────── */}
        <section id="research" className="research-case-study section-pad reveal-on-scroll">
          <div className="section-wrap">
            <div className="research-case-inner">
              {/* Left meta column */}
              <div className="research-meta-col">
                <SectionLabel number="03">Research</SectionLabel>
                <div style={{ marginTop: 28 }}>
                  <div className="research-stamp">
                    <span>
                      RESEARCH
                      <br />
                      PUBLICATION
                    </span>
                    <Network size={42} strokeWidth={1.2} />
                    <span className="stamp-year">2026</span>
                  </div>
                </div>
                <div style={{ marginTop: 28 }}>
                  <p style={{ fontSize: 14, color: "#596052", lineHeight: 1.5, margin: 0 }}>
                    Final-year research project. Hybrid ML/DL framework for
                    behavioural malware detection. Published at ICSICE 2026.
                  </p>
                </div>
                {/* Publication card in sidebar */}
                <div className="pub-card" style={{ marginTop: 24 }}>
                  <span className="pub-card-status">Published · ICSICE 2026</span>
                  <span className="pub-card-title">
                    Behavioural Malware Detection Using a Hybrid ML/DL Framework
                  </span>
                  <span className="pub-card-meta">
                    Research Publication<br />
                    AI / ML · Cybersecurity<br />
                    5 authors (3 students, 2 supervisors)
                  </span>
                </div>
              </div>

              {/* Right main column */}
              <div className="research-main-col">
                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(28px,3.6vw,46px)", letterSpacing: "-.05em", lineHeight: 1.1, margin: "0 0 16px" }}>
                  Behavioural Malware Detection Using a Hybrid ML/DL Framework
                </h2>
                <div className="research-quick-meta" style={{ display: "flex", gap: "32px", margin: "16px 0 24px", borderBottom: "1px solid var(--line)", paddingBottom: "16px", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", color: "var(--terracotta)", letterSpacing: ".08em", textTransform: "uppercase" }}>DESIGNATION</span>
                    <strong style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "13px", color: "var(--foreground)", fontWeight: 600 }}>FINAL-YEAR PROJECT</strong>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", color: "var(--terracotta)", letterSpacing: ".08em", textTransform: "uppercase" }}>ARCHITECTURE</span>
                    <strong style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "13px", color: "var(--foreground)", fontWeight: 600 }}>HYBRID ML/DL</strong>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", color: "var(--terracotta)", letterSpacing: ".08em", textTransform: "uppercase" }}>STATUS</span>
                    <strong style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "13px", color: "var(--foreground)", fontWeight: 600 }}>PUBLISHED · ICSICE 2026</strong>
                  </div>
                </div>
                <p style={{ fontSize: 17, color: "#596052", marginBottom: 8 }}>
                  <b>Research question:</b> Can a hierarchical ML/DL framework
                  combine fast machine-learning classification with deeper temporal
                  behavioural analysis for real-time malware detection?
                </p>
                <p style={{ fontSize: 15, color: "#596052", marginBottom: 0 }}>
                  The framework processes runtime host behaviour through an
                  n-gram TF-IDF feature pipeline, applies XGBoost for first-level
                  classification, and routes uncertain or context-dependent cases
                  to a CNN-BiLSTM layer for deeper temporal analysis. A per-process
                  risk accumulation mechanism aggregates decisions before producing
                  an ALLOW, BLOCK or RESPONSE verdict.
                </p>

                {/* Pipeline diagram */}
                <div className="pipeline-wrap">
                  <p className="pipeline-title">Detection Pipeline</p>
                  <div className="pipeline-flow" role="list" aria-label="Malware detection pipeline steps">
                    {[
                      { label: "Runtime Host Behaviour", note: "Sysmon event logs", key: false },
                      { label: "Event / System Behaviour Data", note: "telemetry stream", key: false },
                      { label: "Sliding Windows", note: "temporal windowing", key: false },
                      { label: "N-gram TF-IDF Feature Representation", note: "text-based feature extraction", key: true },
                    ].map(({ label, note, key }) => (
                      <div key={label} className={`pipeline-step${key ? " step-key" : ""}`} role="listitem">
                        <span className="pipeline-step-text">{label}</span>
                        <span className="pipeline-step-note">· {note}</span>
                      </div>
                    ))}

                    {/* Branch — two models */}
                    <div className="pipeline-branch">
                      <div className="pipeline-branch-col">
                        <span className="pipeline-branch-label">First-Level · Fast Path</span>
                        <span className="pipeline-branch-model">XGBoost First-Level Classification</span>
                        <span className="pipeline-branch-desc">
                          Gradient-boosted classifier on TF-IDF features.
                          Handles confident classifications directly.
                        </span>
                      </div>
                      <div className="pipeline-branch-col">
                        <span className="pipeline-branch-label">Deep Analysis · Uncertain Cases</span>
                        <span className="pipeline-branch-model">CNN-BiLSTM Deep Learning Analysis</span>
                        <span className="pipeline-branch-desc">
                          Convolutional + bidirectional LSTM for temporal
                          behavioural pattern analysis.
                        </span>
                      </div>
                    </div>

                    {[
                      { label: "Hierarchical Decision", note: "verdict fusion", key: true },
                      { label: "Per-Process Risk Accumulation", note: "cross-window aggregation", key: false },
                      { label: "ALLOW / BLOCK / RESPONSE", note: "final verdict", key: true },
                    ].map(({ label, note, key }) => (
                      <div key={label} className={`pipeline-step${key ? " step-key" : ""}`} role="listitem">
                        <span className="pipeline-step-text">{label}</span>
                        <span className="pipeline-step-note">· {note}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key results headline stats */}
                <p className="results-section-title">Model Evaluation Results</p>
                <div className="highlight-stats-row" aria-label="Key XGBoost results">
                  <div className="highlight-stat">
                    <span className="highlight-stat-val">98.7%</span>
                    <span className="highlight-stat-label">XGBoost Accuracy</span>
                  </div>
                  <div className="highlight-stat">
                    <span className="highlight-stat-val">99.2%</span>
                    <span className="highlight-stat-label">F1 Score</span>
                  </div>
                  <div className="highlight-stat">
                    <span className="highlight-stat-val">0.996</span>
                    <span className="highlight-stat-label">AUC</span>
                  </div>
                </div>

                {/* Full comparison table */}
                <div className="results-table-wrap" role="region" aria-label="Model comparison table">
                  <table className="results-table">
                    <thead>
                      <tr>
                        <th>Metric</th>
                        <th>XGBoost</th>
                        <th>CNN-BiLSTM</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hero-row">
                        <td className="metric-name">Accuracy</td>
                        <td className="val-primary">98.7%</td>
                        <td>90.1%</td>
                      </tr>
                      <tr>
                        <td className="metric-name">Precision</td>
                        <td className="val-primary">99.4%</td>
                        <td>100%<span className="note-cell"> †</span></td>
                      </tr>
                      <tr className="hero-row">
                        <td className="metric-name">Recall</td>
                        <td className="val-primary">99.0%</td>
                        <td>87.6%</td>
                      </tr>
                      <tr>
                        <td className="metric-name">F1 Score</td>
                        <td className="val-primary">99.2%</td>
                        <td>93.4%</td>
                      </tr>
                      <tr className="hero-row">
                        <td className="metric-name">AUC</td>
                        <td className="val-primary">0.996</td>
                        <td>0.933</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="results-note">
                  Reported results are based on the evaluated study dataset; broader benchmark evaluation and generalisation remain important areas for further work. † CNN-BiLSTM 100% precision reflects the evaluated test split; recall (87.6%) and AUC (0.933) provide a more complete picture of performance.
                </p>

                {/* Prototype runtime note */}
                <div className="prototype-note" role="note">
                  <span className="prototype-note-label">Prototype Run</span>
                  <p className="prototype-note-text">
                    Prototype runtime evaluation processed 165 analysis windows and
                    generated 164 decisions with zero pipeline errors in the reported
                    run. ML/DL scores and verdicts were generated within the same
                    second for the observed events. These results are from a single
                    captured evaluation run and should not be generalised as a
                    performance guarantee across all environments.
                  </p>
                </div>

                {/* Limitations */}
                <div className="limitations-block">
                  <p className="limitations-title">Limitations &amp; Future Work</p>
                  <div className="limitations-list">
                    {[
                      "Dataset diversity",
                      "Generalisation to unseen malware",
                      "Broader benchmark evaluation (e.g. EMBER)",
                      "Obfuscated malware robustness",
                      "Additional OS-level telemetry (ETW)",
                      "Online learning",
                      "Computational cost of DL layer",
                      "Improved explainability",
                    ].map(l => (
                      <span key={l} className="limitation-tag">{l}</span>
                    ))}
                  </div>
                </div>

                {/* GitHub link */}
                <a
                  className="project-link"
                  href="https://github.com/Seeya2911/Malware-Detection"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Github size={15} /> View on GitHub <ArrowUpRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── 04 — SELECTED PROJECTS ───────────────────────────────────────── */}
        <section id="projects" className="projects-section section-pad">
          <div className="section-wrap">
            <div className="section-heading reveal-on-scroll">
              <SectionLabel number="04">Selected Projects</SectionLabel>
              <p>
                Projects documented with repository-backed evidence.
                The malware detection project is presented in full as the Research
                case study above.
              </p>
            </div>

            {/* Project 01 — Research reference card (concise, links to Research section) */}
            <div className="research-ref-card">
              <span className="research-ref-index">01</span>
              <div className="research-ref-body">
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <h3>Behavioural Malware Detection</h3>
                  <Pill tone="terracotta">FINAL-YEAR RESEARCH</Pill>
                  <Pill tone="terracotta">PUBLISHED</Pill>
                </div>
                <p>
                  A hybrid ML/DL framework for host-based behavioural malware
                  detection using n-gram TF-IDF features, XGBoost first-level
                  classification and CNN-BiLSTM deep analysis. Published at ICSICE 2026.
                </p>
                <div className="research-ref-tags">
                  <Pill>XGBoost</Pill>
                  <Pill>CNN-BiLSTM</Pill>
                  <Pill>N-gram TF-IDF</Pill>
                  <Pill>Real-time pipeline</Pill>
                  <Pill>Sysmon</Pill>
                </div>
              </div>
              <div className="research-ref-cta">
                <a className="research-ref-link" href="#research">
                  <BookOpen size={14} /> Full case study <ArrowUpRight size={13} />
                </a>
                <a
                  className="research-ref-link"
                  href="https://github.com/Seeya2911/Malware-Detection"
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontWeight: 400, fontSize: 12 }}
                >
                  <Github size={13} /> GitHub
                </a>
              </div>
            </div>

            {/* Projects 02 and 03 */}
            <div className="project-list">
              {/* Project 02 — Smart Inbox AI */}
              <article className="project-card reveal-stagger">
                <div className="project-card-number">02</div>
                <div className="project-card-body">
                  <div className="project-card-head">
                    <h3>Smart Inbox AI</h3>
                    <span className="card-arrow">
                      <ArrowUpRight size={18} />
                    </span>
                  </div>
                  <p>
                    Applied NLP system for email prioritization using sentiment
                    analysis, intent detection, summarization and feedback-driven
                    prioritization. Features a Streamlit dashboard and
                    text-to-speech output.
                  </p>
                  <Workflow
                    items={["Email input", "NLP analysis", "Priority scoring", "Feedback loop"]}
                  />
                  <div className="project-tags">
                    <Pill>NLP</Pill>
                    <Pill>Sentiment Analysis</Pill>
                    <Pill>Streamlit</Pill>
                    <Pill>TTS</Pill>
                  </div>
                  <div className="project-evidence-grid">
                    <div>
                      <span>Problem</span>
                      <b>Managing large volumes of incoming email requires more than simple keyword filtering.</b>
                    </div>
                    <div>
                      <span>Approach</span>
                      <b>NLP-based analysis combining sentiment analysis, intent detection, summarization and feedback-driven priority scoring.</b>
                    </div>
                    <div>
                      <span>Technology</span>
                      <b>Python · NLP · Streamlit · TextBlob · TTS · Matplotlib</b>
                    </div>
                    <div>
                      <span>Result / Outcome</span>
                      <b>Interactive email prioritization workflow with visual analytics and audio readouts.</b>
                    </div>
                  </div>
                  <a
                    className="project-link"
                    href="https://github.com/Seeya2911/smart-inbox-ai.git"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Github size={15} /> View on GitHub <ArrowUpRight size={14} />
                  </a>
                </div>
              </article>

              {/* Project 03 — Medicinal Plant Detection */}
              <article className="project-card reveal-stagger">
                <div className="project-card-number">03</div>
                <div className="project-card-body">
                  <div className="project-card-head">
                    <h3>Medicinal Plant Detection</h3>
                    <span className="card-arrow">
                      <ArrowUpRight size={18} />
                    </span>
                  </div>
                  <p>
                    Computer vision + classical ML system for classifying medicinal
                    plants from leaf images using hand-crafted feature extraction
                    and ensemble classifiers.
                  </p>
                  <Workflow
                    items={["Leaf image", "OpenCV preprocessing", "Feature extraction", "Classification"]}
                  />
                  <div className="project-tags">
                    <Pill>OpenCV</Pill>
                    <Pill>SVM</Pill>
                    <Pill>Random Forest</Pill>
                    <Pill>GLCM · Gabor · LBP</Pill>
                  </div>
                  <div className="project-evidence-grid">
                    <div>
                      <span>Problem</span>
                      <b>Identify and classify medicinal plants from leaf images.</b>
                    </div>
                    <div>
                      <span>Approach</span>
                      <b>Image preprocessing, segmentation and handcrafted texture descriptors using GLCM, Gabor and LBP followed by ensemble classification.</b>
                    </div>
                    <div>
                      <span>Technology</span>
                      <b>OpenCV · scikit-learn · SVM · Random Forest · GLCM · Gabor · LBP</b>
                    </div>
                    <div>
                      <span>Result / Outcome</span>
                      <b>Automated leaf-image classification pipeline for medicinal plant identification.</b>
                    </div>
                  </div>
                  <a
                    className="project-link"
                    href="https://github.com/Seeya2911/medicinal-plant-detection.git"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Github size={15} /> View on GitHub <ArrowUpRight size={14} />
                  </a>
                </div>
              </article>
            </div>
            {/* Structural placeholder for future 4th project — not shown visually */}
          </div>
        </section>

        {/* ── 05 — EXPERIENCE ──────────────────────────────────────────────── */}
        <section
          id="experience"
          className="section-wrap section-pad experience-section"
        >
          <div className="section-aside">
            <SectionLabel number="05">Experience</SectionLabel>
            <span className="aside-note">
              Industry exposure across AI pipelines and data analysis.
            </span>
          </div>
          <div className="timeline">
            {/* Megaplast */}
            <article className="timeline-item current">
              <div className="timeline-marker" />
              <div className="timeline-date">2026 – PRESENT</div>
              <div className="timeline-content">
                <div className="timeline-heading">
                  <div>
                    <h3>Data Science Intern</h3>
                    <p>Megaplast India Pvt. Ltd.</p>
                  </div>
                  <BriefcaseBusiness size={21} />
                </div>
                <p>
                  Working on data-driven search and website performance analysis
                  for a B2B platform using Google Search Console, SEMrush and
                  structured data workflows (Excel, JSON). Work covers SEO/GEO
                  performance analysis, search trend identification and B2B
                  digital data reporting.
                </p>
                <div className="timeline-project-note">
                  <span className="timeline-project-note-label">
                    IN DEVELOPMENT · Lead Intelligence &amp; Outreach Automation
                  </span>
                  <p>
                    Planned workflow: identify potential B2B leads from search/data sources, structure and qualify lead information, and generate personalised outreach for the sales workflow.
                  </p>
                </div>
              </div>
            </article>

            {/* Blackhole Infiverse */}
            <article className="timeline-item">
              <div className="timeline-marker" />
              <div className="timeline-date">SEP 2025 — MAR 2026</div>
              <div className="timeline-content">
                <div className="timeline-heading">
                  <div>
                    <h3>AI/ML Intern</h3>
                    <p>Blackhole Infiverse LLP</p>
                  </div>
                  <BriefcaseBusiness size={21} />
                </div>
                <p>
                  Contributed to News AI, an end-to-end AI content processing
                  pipeline involving modular data ingestion, content processing,
                  AI-assisted classification, API integration, feedback handling
                  and automated testing.
                </p>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", color: "var(--terracotta)", marginTop: 8, letterSpacing: ".04em" }}>
                  Data ingestion → content processing → AI classification → API integration → feedback → testing
                </div>
                <div className="project-tags" style={{ marginTop: 14 }}>
                  <Pill>LLM-based classification</Pill>
                  <Pill>API integration</Pill>
                  <Pill>Pipeline architecture</Pill>
                  <Pill>Automated testing</Pill>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* ── 06 — RESEARCH INTERESTS ───────────────────────────────────────── */}
        <section id="interests" className="interests-section section-pad reveal-on-scroll">
          <div className="section-wrap">
            <div className="interests-inner">
              <div className="section-aside">
                <SectionLabel number="06">Research Interests</SectionLabel>
                <span className="aside-note">
                  A coherent direction, not a list of every AI field.
                </span>
              </div>
              <div className="interests-grid">
                {[
                  {
                    num: "01",
                    title: "Machine Learning & Deep Learning",
                    desc: "Model development, representation learning, evaluation and optimisation across classical and neural methods.",
                  },
                  {
                    num: "02",
                    title: "Trustworthy & Explainable AI",
                    desc: "Interpretability, robustness and understanding model behaviour — how and why a model reaches a decision.",
                  },
                  {
                    num: "03",
                    title: "AI for Cybersecurity",
                    desc: "Behavioural malware detection, anomaly detection and intelligent security systems grounded in my final-year research.",
                  },
                  {
                    num: "04",
                    title: "Data-Centric AI",
                    desc: "Feature engineering, statistical modelling, data quality and its effect on model robustness and generalisation.",
                  },
                ].map(({ num, title, desc }) => (
                  <div key={num} className="interest-card">
                    <span className="interest-card-number">{num}</span>
                    <span className="interest-card-title">{title}</span>
                    <p className="interest-card-desc">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 07 — TECHNICAL SKILLS ─────────────────────────────────────────── */}
        <section id="skills" className="section-wrap section-pad skills-section">
          <div className="section-aside">
            <SectionLabel number="07">Technical Skills</SectionLabel>
            <span className="aside-note">Tools I work with, not labels I hide behind.</span>
          </div>
          <div className="skills-grid-expanded">
            <div className="skill-group reveal-stagger">
              <h3>Programming</h3>
              <p>Python · SQL · Java · C</p>
            </div>
            <div className="skill-group reveal-stagger">
              <h3>Data &amp; Analytics</h3>
              <p>Pandas · NumPy · Matplotlib · Excel · Google Search Console · SEMrush</p>
            </div>
            <div className="skill-group reveal-stagger">
              <h3>Machine Learning</h3>
              <p>Scikit-learn · XGBoost · Feature Engineering · Model Evaluation · Cross-Validation</p>
            </div>
            <div className="skill-group reveal-stagger">
              <h3>Deep Learning</h3>
              <p>TensorFlow · PyTorch · CNN · RNN · LSTM · BiLSTM · Attention</p>
            </div>
            <div className="skill-group reveal-stagger">
              <h3>AI / NLP</h3>
              <p>NLP · LLMs · Text Classification · Summarization · Sentiment Analysis</p>
            </div>
            <div className="skill-group reveal-stagger">
              <h3>Computer Vision</h3>
              <p>OpenCV · Image Processing · Feature Extraction · GLCM · Gabor · LBP</p>
            </div>
            <div className="skill-group reveal-stagger">
              <h3>Tools &amp; Development</h3>
              <p>Git · GitHub · Streamlit · FastAPI · Google Colab · VS Code · Power BI</p>
            </div>
            <div className="skill-group reveal-stagger">
              <h3>Research &amp; Methods</h3>
              <p>Experimental Evaluation · Feature Engineering · Model Evaluation · Cross-Validation · Data Preprocessing · Statistical Analysis · Research Methodology</p>
            </div>
          </div>
        </section>

        {/* ── 08 — CREDENTIALS ──────────────────────────────────────────────── */}
        <section id="credentials" className="credentials-section section-pad">
          <div className="section-wrap">
            <div className="section-heading reveal-on-scroll">
              <SectionLabel number="08">Credentials</SectionLabel>
              <p>Academic qualifications, standardised tests and certifications.</p>
            </div>

            <div className="credentials-inner">
              {/* Left col — degree + tests */}
              <div className="credentials-col">
                <h3>Academic &amp; Standardised</h3>

                <div className="cred-item reveal-stagger">
                  <div className="cred-item-main">
                    <span className="cred-item-label">Bachelor of Engineering · 2026</span>
                    <span className="cred-item-name">AI &amp; Data Science</span>
                    <span className="cred-item-sub">
                      Vasantdada Patil Pratishthan's CoE · University of Mumbai
                    </span>
                  </div>
                  <div className="cred-item-value">
                    8.90
                    <small>/ 10 CGPI</small>
                  </div>
                </div>

                <div className="cred-item reveal-stagger">
                  <div className="cred-item-main">
                    <span className="cred-item-label">GATE 2025</span>
                    <span className="cred-item-name">Data Science &amp; Artificial Intelligence</span>
                    <span className="cred-item-sub">
                      Score 26.67 · All India Rank 10,571
                    </span>
                    <a
                      className="cred-item-link"
                      href={publicGateScorecard}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View scorecard <ArrowUpRight size={12} />
                    </a>
                  </div>
                  <div className="cred-item-value">
                    <Pill tone="sage">Qualified</Pill>
                  </div>
                </div>

                <div className="cred-item reveal-stagger">
                  <div className="cred-item-main">
                    <span className="cred-item-label">English Language Proficiency</span>
                    <span className="cred-item-name">IELTS Academic</span>
                    <span className="cred-item-sub">Overall band score · CEFR C1</span>
                    <a
                      className="cred-item-link"
                      href={publicIeltsScorecard}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View scorecard <ArrowUpRight size={12} />
                    </a>
                  </div>
                  <div className="cred-item-value">
                    7.0
                    <small>Band</small>
                  </div>
                </div>
              </div>

              {/* Right col — certifications */}
              <div className="credentials-col">
                <h3>Certifications</h3>
                <div className="cred-cert-list">
                  {[
                    {
                      num: "01",
                      name: "Python for Data Science",
                      issuer: "NPTEL",
                      link: managedAssets?.certificates?.[0]?.storageUrl ?? "https://drive.google.com/file/d/1YEwGTZ0ROYyJIdnLseDG6Yg912JXL9-F/view?usp=drive_link",
                    },
                    {
                      num: "02",
                      name: "Machine Learning",
                      issuer: "Infosys Springboard",
                      link: managedAssets?.certificates?.[3]?.storageUrl ?? "https://drive.google.com/file/d/1JzMez29wDzxkek0tXhVk32kMtNQJNU9f/view?usp=drive_link",
                    },
                    {
                      num: "03",
                      name: "Data Visualization",
                      issuer: "Tata Forage",
                      link: managedAssets?.certificates?.[1]?.storageUrl ?? "https://drive.google.com/file/d/1Dd37IoQj4IZgtiRCpddSuG__L6D5UKn5/view?usp=drive_link",
                    },
                    {
                      num: "04",
                      name: "Data Analytics &amp; Visualization",
                      issuer: "Accenture Forage",
                      link: managedAssets?.certificates?.[2]?.storageUrl ?? "https://drive.google.com/file/d/1F97dXjQ99ejPZbbWt2AhOwdB5xlk24PA/view?usp=drive_link",
                    },
                  ].map(({ num, name, issuer, link }) => (
                    <div key={num} className="cred-cert-item reveal-stagger">
                      <span className="cred-cert-num">{num}</span>
                      <div className="cred-cert-body">
                        <span className="cred-cert-name" dangerouslySetInnerHTML={{ __html: name }} />
                        <span className="cred-cert-issuer">{issuer}</span>
                      </div>
                      <a
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        className="cred-cert-link"
                        aria-label={`View ${name} certificate`}
                      >
                        View <ArrowUpRight size={11} />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Beyond Academics — visually separate */}
            <div className="beyond-academics">
              <p className="beyond-title">Beyond Academics</p>
              <div className="activity-list">
                {[
                  {
                    text: "PRO Head — Student Council",
                    sub: "Public relations and institutional communications role",
                  },
                  {
                    text: "Senior Member — IETE",
                    sub: "Institution of Electronics and Telecommunication Engineers · 2024–25",
                  },
                  {
                    text: "Smart India Hackathon",
                    sub: "National-level student hackathon participation",
                  },
                  {
                    text: "Department-level volunteering",
                    sub: "Academic events, workshops and department activities",
                  },
                  {
                    text: "College and inter-collegiate sports representation",
                    sub: "Competitive sports participation at college level",
                  },
                ].map(({ text, sub }) => (
                  <div key={text} className="activity-item">
                    <div className="activity-dot" aria-hidden="true" />
                    <span className="activity-text">
                      {text}
                      <span className="activity-sub">{sub}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── WHAT'S NEXT ───────────────────────────────────────────────────── */}
        <section className="next-section section-pad reveal-on-scroll">
          <div className="section-wrap next-inner-centered">
            <div>
              <SectionLabel children="Graduate Study" />
              <h2>Deepening the theory behind the practice.</h2>
              <p>
                Building on my undergraduate work in machine learning, deep learning
                and behavioural malware detection, I aim to deepen my theoretical
                and methodological understanding of intelligent systems through
                graduate study, with particular interest in machine learning,
                trustworthy AI, data-centric methods and AI for cybersecurity.
              </p>
            </div>
          </div>
        </section>

        {/* ── CONTACT ──────────────────────────────────────────────────────── */}
        <section id="contact" className="contact-section section-pad">
          <div className="section-wrap contact-inner">
            <div>
              <SectionLabel number="09">Contact</SectionLabel>
              <h2>
                Open to thoughtful conversations around AI, data, research, and
                graduate study.
              </h2>
            </div>
            <div className="contact-links">
              <a href="mailto:seeyakangutkar@gmail.com">
                <span>Email</span>
                <b>seeyakangutkar@gmail.com</b>
                <ArrowUpRight size={18} />
              </a>
              <a
                href="https://linkedin.com/in/seeya-kangutkar"
                target="_blank"
                rel="noreferrer"
              >
                <span>LinkedIn</span>
                <b>linkedin.com/in/seeya-kangutkar</b>
                <ArrowUpRight size={18} />
              </a>
              <div className="contact-location">
                <span>Based in</span>
                <b>Mumbai, Maharashtra, India</b>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="site-footer">
        <div className="section-wrap footer-inner">
          <a className="wordmark" href="#top">
            <span className="ssk-monogram">SSK</span>
            <span>
              Seeya <b>Kangutkar</b>
            </span>
          </a>
          <span>B.E. AI &amp; Data Science · 2026 · University of Mumbai</span>
          <span>Built with care, grounded in evidence.</span>
        </div>
      </footer>
    </div>
  );
}
