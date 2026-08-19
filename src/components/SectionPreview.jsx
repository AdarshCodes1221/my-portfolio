import { AnimatePresence, motion } from "framer-motion";
import { achievements, projects } from "../constants";
import { SKILLS } from "../constants/skills";

const previewTransition = {
  duration: 0.32,
  ease: [0.22, 1, 0.36, 1],
};

const PreviewFrame = ({ children, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.96, y: 10 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 1.02, y: -8 }}
    transition={previewTransition}
    className={`relative h-[270px] w-[480px] max-w-[90vw] overflow-hidden rounded-lg border border-white/15 bg-[#0b1220] p-5 shadow-2xl ${className}`}
  >
    {children}
  </motion.div>
);

const PreviewHeader = ({ eyebrow, title }) => (
  <div className="relative z-10 flex items-start justify-between">
    <div>
      <p className="text-[9px] uppercase tracking-[0.24em] text-[#8ec5ff]">{eyebrow}</p>
      <h3 className="mt-1 text-xl font-semibold tracking-tight text-white">{title}</h3>
    </div>
    <span className="text-lg font-bold tracking-[0.2em] text-white">AJ</span>
  </div>
);

const AboutPreview = () => (
  <PreviewFrame className="bg-[radial-gradient(circle_at_80%_15%,rgba(142,197,255,0.3),transparent_35%),linear-gradient(135deg,#111d35,#07080d)]">
    <PreviewHeader eyebrow="Introduction" title="ADARSH JHA" />
    <div className="relative z-10 mt-6 grid grid-cols-[1.3fr_0.7fr] gap-4">
      <div>
        <p className="text-sm font-medium text-white/85">Computer Science Undergraduate</p>
        <p className="mt-3 text-[11px] leading-5 text-white/60">
          Interested in software engineering, cloud and AWS, data/AI, and cybersecurity. Building practical projects across web, data and infrastructure.
        </p>
      </div>
      <div className="flex flex-wrap content-start gap-1.5">
        {["Software Engineering", "Cloud", "Data/AI", "Cybersecurity"].map((item) => (
          <span key={item} className="rounded border border-white/15 bg-white/5 px-2 py-1 text-[9px] text-[#b8d8ff]">{item}</span>
        ))}
      </div>
    </div>
    <div className="absolute bottom-0 left-0 h-1 w-2/5 bg-[#8ec5ff]" />
  </PreviewFrame>
);

const SkillsPreview = () => {
  const skillNames = ["python", "java", "cpp", "javascript", "react", "aws", "docker", "mongodb", "spark", "kali-linux"];

  return (
    <PreviewFrame className="bg-[linear-gradient(135deg,#0a1720,#111522)]">
      <PreviewHeader eyebrow="Interactive skill keyboard" title="Skills" />
      <div className="relative z-10 mt-5 grid grid-cols-5 gap-2">
        {skillNames.map((name) => {
          const currentSkill = SKILLS[name];
          return (
            <div key={name} className="flex aspect-square flex-col items-center justify-center rounded-md border border-white/10 bg-white/[0.06] px-1 text-center shadow-inner">
              <span className="text-[10px] font-semibold" style={{ color: currentSkill.color }}>{currentSkill.label}</span>
              <span className="mt-1 text-[8px] text-white/40">{currentSkill.name === "spark" ? "Data" : "Core"}</span>
            </div>
          );
        })}
      </div>
      <p className="absolute bottom-4 left-5 text-[9px] uppercase tracking-[0.2em] text-white/40">Explore the keyboard to inspect each skill</p>
    </PreviewFrame>
  );
};

const ProjectsPreview = () => (
  <PreviewFrame className="bg-[linear-gradient(135deg,#121329,#080b14)]">
    <PreviewHeader eyebrow="Selected work" title="Projects" />
    <div className="relative z-10 mt-4 grid grid-cols-3 gap-2">
      {projects.slice(0, 6).map((project, index) => (
        <div key={project.name} className="min-h-[83px] rounded-md border border-white/10 bg-white/[0.045] p-2">
          <div className={`mb-2 h-5 rounded-sm ${["bg-cyan-400/30", "bg-emerald-400/30", "bg-pink-400/30", "bg-violet-400/30", "bg-amber-400/30", "bg-sky-400/30"][index]}`} />
          <p className="line-clamp-1 text-[10px] font-semibold text-white">{project.name}</p>
          <p className="mt-1 line-clamp-1 text-[8px] text-white/45">{project.tags.slice(0, 2).map((tag) => tag.name).join(" · ")}</p>
        </div>
      ))}
    </div>
  </PreviewFrame>
);

const AchievementsPreview = () => (
  <PreviewFrame className="bg-[radial-gradient(circle_at_15%_90%,rgba(96,165,250,0.22),transparent_35%),linear-gradient(135deg,#0c1424,#101522)]">
    <PreviewHeader eyebrow="Verified learning" title="Achievements" />
    <div className="relative z-10 mt-5 space-y-3 border-l border-[#8ec5ff]/50 pl-4">
      {achievements.map((achievement) => (
        <div key={achievement.title[0]} className="relative">
          <span className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-[#8ec5ff] shadow-[0_0_10px_#8ec5ff]" />
          <p className="text-[10px] font-semibold text-white">{achievement.title[0]}</p>
          <p className="mt-1 text-[9px] text-white/50">{achievement.company_name}</p>
        </div>
      ))}
    </div>
  </PreviewFrame>
);

const ContactPreview = () => (
  <PreviewFrame className="bg-[linear-gradient(135deg,#101a2b,#07080d)]">
    <PreviewHeader eyebrow="Get in touch" title="Contact" />
    <div className="relative z-10 mt-5 grid grid-cols-[1.1fr_0.9fr] gap-4">
      <div className="space-y-2">
        {["Full name", "Email address", "Your message"].map((label) => (
          <div key={label} className="rounded border border-white/10 bg-black/20 px-3 py-2 text-[9px] text-white/35">{label}</div>
        ))}
        <div className="inline-block rounded bg-[#8ec5ff] px-3 py-1.5 text-[9px] font-semibold text-[#07080d]">Send message</div>
      </div>
      <div className="space-y-3 rounded border border-white/10 bg-white/[0.04] p-3">
        <p className="text-sm font-semibold text-white">ADARSH JHA</p>
        <a href="https://github.com/AdarshCodes1221" className="block text-[10px] text-[#8ec5ff]">GitHub</a>
        <a href="https://www.linkedin.com/in/adarsh-jha-46a0041bb/" className="block text-[10px] text-[#8ec5ff]">LinkedIn</a>
        <p className="text-[9px] text-white/45">Email contact is ready for personal configuration.</p>
      </div>
    </div>
  </PreviewFrame>
);

const PREVIEWS = [AboutPreview, SkillsPreview, ProjectsPreview, AchievementsPreview, ContactPreview];

const SectionPreview = ({ sectionIndex }) => {
  const Preview = PREVIEWS[sectionIndex] || AboutPreview;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Preview key={sectionIndex} />
    </AnimatePresence>
  );
};

export default SectionPreview;
