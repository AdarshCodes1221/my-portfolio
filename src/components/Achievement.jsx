import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useMemo, useState } from "react";
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";

import "react-vertical-timeline-component/style.min.css";

import { achievements } from "../constants";
import { SectionWrapper } from "../hoc";
import { styles } from "../styles";
import { textVariant } from "../utils/motion";

const FEATURED_TITLES = new Set([
  "Hadoop",
  "Nutanix Certified Associate 6",
  "Cloud Computing Fundamentals",
  "AWS Academy Graduate – AWS Academy Cloud Foundations",
  "CCNA: Introduction to Networks",
  "CS205: Building with Artificial Intelligence",
  "Introduction to AI Concepts",
  "Deloitte Australia – Data Analytics Job Simulation",
  "Cybersecurity and Ethical Hacking",
  "Dynamic Programming Camp Completion Certificate",
]);

const FILTERS = ["All", "2026", "2025", "2024", "2023"];

const categoryStyles = {
  cloud: { label: "Cloud", accent: "#67e8f9", soft: "rgba(103,232,249,0.12)", border: "rgba(103,232,249,0.42)", glow: "rgba(103,232,249,0.14)" },
  aiData: { label: "AI / Data", accent: "#a78bfa", soft: "rgba(167,139,250,0.12)", border: "rgba(167,139,250,0.42)", glow: "rgba(167,139,250,0.14)" },
  programming: { label: "Programming / DSA", accent: "#fbbf24", soft: "rgba(251,191,36,0.12)", border: "rgba(251,191,36,0.42)", glow: "rgba(251,191,36,0.14)" },
  networking: { label: "Networking", accent: "#2dd4bf", soft: "rgba(45,212,191,0.12)", border: "rgba(45,212,191,0.42)", glow: "rgba(45,212,191,0.14)" },
  cybersecurity: { label: "Cybersecurity", accent: "#fb7185", soft: "rgba(251,113,133,0.12)", border: "rgba(251,113,133,0.42)", glow: "rgba(251,113,133,0.14)" },
  development: { label: "Development", accent: "#34d399", soft: "rgba(52,211,153,0.12)", border: "rgba(52,211,153,0.42)", glow: "rgba(52,211,153,0.14)" },
  osLinux: { label: "Operating Systems / Linux", accent: "#818cf8", soft: "rgba(129,140,248,0.12)", border: "rgba(129,140,248,0.42)", glow: "rgba(129,140,248,0.14)" },
  other: { label: "Other", accent: "#94a3b8", soft: "rgba(148,163,184,0.12)", border: "rgba(148,163,184,0.38)", glow: "rgba(148,163,184,0.12)" },
};

const getCategoryStyle = (credential) => {
  const title = credential.title[0];
  if (title.includes("Operating System") || title.includes("Linux and SQL")) return categoryStyles.osLinux;
  if (["Design Thinking", "Service Learning Internship – Content Creation & App Development", "Chandrayaan-3 Mahaquiz"].includes(title)) return categoryStyles.other;
  if (credential.category === "Data" || credential.category === "AI/Data") return categoryStyles.aiData;
  if (credential.category === "Programming") return categoryStyles.programming;
  return categoryStyles[credential.category?.toLowerCase()] || categoryStyles.other;
};

const CredentialActions = ({ credential, style }) => credential.credentialUrl ? (
  <a
    href={credential.credentialUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[#07101c] transition hover:brightness-110"
    style={{ backgroundColor: style.accent }}
    onClick={(event) => event.stopPropagation()}
  >
    Verify Credential <span className="ml-2">→</span>
  </a>
) : (
  <span className="inline-flex items-center rounded-lg border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/55">
    Credential details available
  </span>
);

const CredentialCard = ({ credential, onOpen, featured = false }) => {
  const style = getCategoryStyle(credential);

  return (
  <motion.button
    type="button"
    whileHover={{ y: -5 }}
    transition={{ duration: 0.2 }}
    onClick={() => onOpen(credential)}
    className={`group relative w-full overflow-hidden rounded-2xl border bg-[#0d1422]/90 p-5 text-left shadow-[0_10px_35px_rgba(0,0,0,0.22)] transition duration-300 hover:border-[var(--credential-border)] hover:shadow-[0_14px_45px_var(--credential-glow)] ${featured ? "border-white/20" : "border-white/10"}`}
    style={{ "--credential-accent": style.accent, "--credential-soft": style.soft, "--credential-border": style.border, "--credential-glow": style.glow }}
  >
    <span className="absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl transition group-hover:scale-110" style={{ backgroundColor: style.glow }} />
    <div className="relative flex items-start justify-between gap-4">
      <span className="rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ borderColor: style.border, backgroundColor: style.soft, color: style.accent }}>{style.label}</span>
      {credential.date && <span className="text-xs font-medium text-white/45">{credential.date}</span>}
    </div>
    <h3 className="relative mt-5 min-h-[3.5rem] text-lg font-bold leading-snug text-white transition group-hover:text-[#cce7ff]">{credential.title[0]}</h3>
    <p className="relative mt-3 text-sm font-medium" style={{ color: style.accent }}>{credential.issuer}</p>
    <div className="relative mt-5 flex items-center justify-between text-[10px] uppercase tracking-[0.14em] text-white/35"><span>{credential.skills.slice(0, 2).join(" · ")}</span><span className="transition group-hover:text-white">Details ↗</span></div>
    <span className="absolute bottom-0 left-5 h-0.5 w-14 transition-all duration-300 group-hover:w-24" style={{ backgroundColor: style.accent }} />
  </motion.button>
  );
};

const CredentialModal = ({ credential, onClose }) => {
  const style = credential ? getCategoryStyle(credential) : categoryStyles.other;

  return (
  <AnimatePresence>
    {credential && (
      <motion.div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
        <motion.div role="dialog" aria-modal="true" aria-labelledby="credential-title" initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18, scale: 0.97 }} transition={{ duration: 0.25 }} onClick={(event) => event.stopPropagation()} className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border bg-[#111a2b] p-6 shadow-2xl sm:p-8" style={{ borderColor: style.border, boxShadow: `0 20px 80px ${style.glow}` }}>
          <button type="button" onClick={onClose} aria-label="Close credential details" className="absolute right-4 top-4 text-2xl leading-none text-white/45 transition hover:text-white">×</button>
          <p className="text-xs uppercase tracking-[0.22em]" style={{ color: style.accent }}>Credential detail · {style.label}</p>
          <h3 id="credential-title" className="mt-3 pr-8 text-2xl font-bold leading-tight text-white sm:text-3xl">{credential.title[0]}</h3>
          <div className="mt-6 grid gap-4 border-y border-white/10 py-5 sm:grid-cols-2">
            <div><p className="text-[10px] uppercase tracking-[0.16em] text-white/40">Issuer</p><p className="mt-1 font-semibold" style={{ color: style.accent }}>{credential.issuer}</p></div>
            <div><p className="text-[10px] uppercase tracking-[0.16em] text-white/40">Issued</p><p className="mt-1 font-semibold text-white">{credential.date || "Date not provided"}</p></div>
            <div><p className="text-[10px] uppercase tracking-[0.16em] text-white/40">Category</p><p className="mt-1 font-semibold" style={{ color: style.accent }}>{style.label}</p></div>
            {credential.credentialId && <div><p className="text-[10px] uppercase tracking-[0.16em] text-white/40">Credential ID</p><p className="mt-1 break-all font-semibold text-white">{credential.credentialId}</p></div>}
          </div>
          <div className="mt-5"><p className="text-[10px] uppercase tracking-[0.16em] text-white/40">Relevant skills</p><div className="mt-3 flex flex-wrap gap-2">{credential.skills.map((skill) => <span key={skill} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/75">{skill}</span>)}</div></div>
          <div className="mt-7"><CredentialActions credential={credential} style={style} /></div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
  );
};

const AllCredentialsDrawer = ({ open, onClose, onOpen }) => {
  const [filter, setFilter] = useState("All");
  const filteredCredentials = useMemo(() => achievements.filter((credential) => filter === "All" || credential.date?.includes(filter)), [filter]);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div role="dialog" aria-modal="true" aria-label="All credentials" className="fixed inset-0 z-[60] flex bg-[#070b13]/95 p-4 backdrop-blur-xl sm:p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
          <div className="mx-auto flex h-full w-full max-w-6xl flex-col" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.22em] text-[#8ec5ff]">Credential archive</p><h3 className="mt-2 text-3xl font-bold text-white">All credentials</h3></div><button type="button" onClick={onClose} aria-label="Close credentials" className="rounded-md p-1 text-3xl leading-none text-white/55 transition hover:text-white">×</button></div>
            <div className="mt-6 flex gap-2 overflow-x-auto pb-2">{FILTERS.map((item) => <button key={item} type="button" onClick={() => setFilter(item)} className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition ${filter === item ? "border-[#8ec5ff] bg-[#8ec5ff] text-[#07101c]" : "border-white/15 text-white/60 hover:border-white/40 hover:text-white"}`}>{item}</button>)}</div>
            <div className="mt-6 grid flex-1 auto-rows-max gap-4 overflow-y-auto pb-8 pr-1 sm:grid-cols-2 lg:grid-cols-3">{filteredCredentials.map((credential) => <CredentialCard key={credential.id} credential={credential} onOpen={onOpen} />)}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Achievement = () => {
  const [selectedCredential, setSelectedCredential] = useState(null);
  const [allOpen, setAllOpen] = useState(false);
  const featured = achievements.filter((credential) => FEATURED_TITLES.has(credential.title[0]));

  return (
    <>
      <div className="achievement-background">
        <style>{`
          .achievement-background {
            position: relative;
            isolation: isolate;
            overflow: hidden;
            margin: -2rem -1rem;
            padding: 2rem 1rem;
            background: radial-gradient(circle at 50% 48%, rgba(74, 96, 117, 0.08), transparent 42%);
          }
          .achievement-background__art {
            position: absolute;
            inset: 0;
            z-index: -1;
            width: 100%;
            height: 100%;
            opacity: 0.18;
            pointer-events: none;
          }
          .achievement-background__art rect:first-of-type { opacity: 0.34; }
          .achievement-background__arcs {
            opacity: 0.52;
            transform-origin: 50% 50%;
            animation: achievement-drafting-rotation 90s linear infinite;
          }
          .achievement-background__marks { opacity: 0.42; }
          .achievement-background__points { opacity: 0.5; }
          @keyframes achievement-drafting-rotation {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @media (prefers-reduced-motion: reduce) {
            .achievement-background__arcs { animation: none; }
          }
        `}</style>
        <svg className="achievement-background__art" viewBox="0 0 1200 1500" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <pattern id="achievement-grid" width="96" height="96" patternUnits="userSpaceOnUse">
              <path d="M 96 0 L 0 0 0 96" fill="none" stroke="#7890a8" strokeWidth="1" />
              <path d="M 48 44 v 8 M 44 48 h 8" fill="none" stroke="#7890a8" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="1200" height="1500" fill="url(#achievement-grid)" />
          <g className="achievement-background__arcs" fill="none" stroke="#7890a8" strokeWidth="1.5">
            <circle cx="600" cy="730" r="425" />
            <circle cx="600" cy="730" r="505" strokeDasharray="280 90 18 120" />
            <path d="M 118 920 A 500 500 0 0 1 420 270" />
            <path d="M 1035 390 A 500 500 0 0 1 1085 1110" />
          </g>
          <g className="achievement-background__marks" fill="none" stroke="#9aa39e" strokeWidth="1">
            <path d="M 110 210 h 112 v 78 M 110 210 v 78 h 48" />
            <path d="M 1090 1260 H 978 v-78 M 1090 1260 v-78 h-48" />
            <path d="M 600 198 v 28 M 586 212 h 28 M 600 1232 v 28" />
            <circle cx="600" cy="730" r="74" strokeDasharray="3 8" />
            <rect x="527" y="657" width="146" height="104" rx="2" />
            <circle cx="645" cy="704" r="18" />
            <path d="M 545 690 h 66 M 545 710 h 48 M 545 730 h 34" />
            <path d="M 634 704 l 7 7 14 -16" />
          </g>
          <g className="achievement-background__points" fill="#7890a8">
            <circle cx="168" cy="520" r="2" />
            <circle cx="1032" cy="840" r="2" />
            <circle cx="904" cy="252" r="1.5" />
            <circle cx="286" cy="1190" r="1.5" />
          </g>
        </svg>
        <motion.div variants={textVariant()} className="relative z-10"><p className={`${styles.sectionSubText} text-center`}>Verified learning and credentials</p><h2 className={`${styles.sectionHeadText} text-center`}>Achievements.</h2></motion.div>
        <div className="relative z-10 mx-auto mt-14 max-w-6xl">
          <div className="mb-8 flex items-end justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.2em] text-[#8ec5ff]">Featured</p><p className="mt-2 max-w-xl text-sm text-white/50">A focused collection of certifications, courses and technical milestones.</p></div><span className="hidden text-xs uppercase tracking-[0.16em] text-white/35 sm:block">{achievements.length} credentials</span></div>
          <VerticalTimeline lineColor="rgba(142,197,255,0.28)">
            {featured.map((credential, index) => <VerticalTimelineElement key={credential.id} date={credential.date || "Credential"} iconStyle={{ background: "#162338", boxShadow: "0 0 0 4px rgba(142,197,255,0.24), 0 0 24px rgba(142,197,255,0.18)" }} icon={<span className="flex h-full items-center justify-center text-xs font-bold text-[#8ec5ff]">{String(index + 1).padStart(2, "0")}</span>} contentStyle={{ padding: 0, background: "transparent", boxShadow: "none" }} contentArrowStyle={{ borderRight: "7px solid transparent" }}><CredentialCard credential={credential} featured onOpen={setSelectedCredential} /></VerticalTimelineElement>)}
          </VerticalTimeline>
          <div className="mt-10 flex justify-center"><button type="button" onClick={() => setAllOpen(true)} className="rounded-lg border border-[#8ec5ff]/50 bg-[#8ec5ff]/10 px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] text-[#b9dcff] transition hover:border-[#8ec5ff] hover:bg-[#8ec5ff] hover:text-[#07101c]">View all credentials <span className="ml-2">→</span></button></div>
        </div>
      </div>
      <CredentialModal credential={selectedCredential} onClose={() => setSelectedCredential(null)} />
      <AllCredentialsDrawer open={allOpen} onClose={() => setAllOpen(false)} onOpen={setSelectedCredential} />
      <span id="skills"></span>
    </>
  );
};

export default SectionWrapper(Achievement, "achievements");
