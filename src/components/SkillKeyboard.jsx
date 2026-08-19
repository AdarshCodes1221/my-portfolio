// SkillKeyboard.jsx
// This component renders an interactive 3D skill keyboard using Spline and GSAP animations.
// Each key represents a skill, and the keyboard animates in response to user actions.

import gsap from "gsap";
import { motion } from "framer-motion";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { SKILLS, skillList } from "../constants/skills";
import { sleep } from "../utils/sleep";
import useMediaQuery from "../utils/useMediaQuery";
import soundEffects from "../utils/soundEffects";

// Lazy-load the Spline React component for 3D rendering
const Spline = React.lazy(() => import("@splinetool/react-spline"));

const SKILL_GROUPS = [
  { label: "Programming", categories: ["Programming"] },
  { label: "Web", categories: ["Web"] },
  { label: "Data / Database", categories: ["Data", "Database"] },
  { label: "Cloud", categories: ["Cloud"] },
  { label: "DevOps", categories: ["DevOps"] },
  { label: "Security", categories: ["Security"] },
  { label: "Tools", categories: ["Tools"] },
];

// Keyboard transformation states for different sections and device types
const STATES = {
  hero: {
    desktop: {
      scale: { x: 0.35, y: 0.33, z: 0.35 },
      position: { x: 20, y: 0, z: 40 }, // Centered horizontally and vertically
      rotation: { x: 0, y: 0, z: 0 },
    },
    mobile: {
      scale: { x: 0.17, y: 0.17, z: 0.17 },
      position: { x: 10, y: 0, z: 0 }, // Centered for mobile
      rotation: { x: 0, y: 0, z: 0 },
    },
  },
  // State for the skills section
  skills: {
    desktop: {
      scale: { x: 0.33, y: 0.33, z: 0.33 },
      position: { x: 0, y: 0, z: 0 }, // Centered
      rotation: { x: 0, y: Math.PI / 12, z: 0 },
    },
    mobile: {
      scale: { x: 0.24, y: 0.24, z: 0.24 },
      position: { x: 0, y: 0, z: 0 }, // Centered
      rotation: { x: 0, y: Math.PI / 6, z: 0 },
    },
  },
  // State for the projects section
  projects: {
    desktop: {
      scale: { x: 0.25, y: 0.25, z: 0.25 },
      position: { x: 0, y: 0, z: 0 }, // Centered
      rotation: { x: Math.PI, y: Math.PI / 3, z: Math.PI },
    },
    mobile: {
      scale: { x: 0.18, y: 0.18, z: 0.18 },
      position: { x: 0, y: 0, z: 0 }, // Centered
      rotation: { x: Math.PI, y: Math.PI / 3, z: Math.PI },
    },
  },
  // State for the contact section
  contact: {
    desktop: {
      scale: { x: 0.33, y: 0.33, z: 0.33 },
      position: { x: 0, y: 0, z: 0 }, // Centered
      rotation: { x: 0, y: 0, z: 0 },
    },
    mobile: {
      scale: { x: 0.24, y: 0.24, z: 0.24 },
      position: { x: 0, y: 0, z: 0 }, // Centered
      rotation: { x: Math.PI, y: Math.PI / 3, z: Math.PI },
    },
  },
};

const SkillKeyboard = () => {
  // Detect if the user is on a mobile device
  const isMobile = useMediaQuery("(max-width: 768px)");
  // Ref for the Spline component instance
  const splineContainer = useRef(null);
  // Ref for the section element to observe
  const sectionRef = useRef(null);
  // Spline application instance (lets you control the 3D scene)
  const [splineApp, setSplineApp] = useState();
  // Currently highlighted skill (when a key is hovered or pressed)
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [showAllSkills, setShowAllSkills] = useState(false);
  // Which section of the site is active (affects keyboard animation)
  const [activeSection, setActiveSection] = useState("skills");
  // Whether the keyboard animation has finished revealing
  const [keyboardRevealed, setKeyboardRevealed] = useState(false);
  // Whether the section is in view (for triggering animation)
  const [isInView, setIsInView] = useState(false);
  const [mobileSectionWidth, setMobileSectionWidth] = useState(0);

  useEffect(() => {
    if (!isMobile) return undefined;

    const updateSectionWidth = () => {
      setMobileSectionWidth(sectionRef.current?.clientWidth || window.innerWidth);
    };

    updateSectionWidth();
    window.addEventListener("resize", updateSectionWidth);
    return () => window.removeEventListener("resize", updateSectionWidth);
  }, [isMobile]);

  const getMobileKeyboardScale = () => {
    const availableWidth = mobileSectionWidth || window.innerWidth;
    const scale = availableWidth / 1400;
    return Math.max(0.24, Math.min(0.31, scale));
  };

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  // Helper to get the correct transformation state for the current section/device
  const keyboardStates = (section) => {
    const deviceState = STATES[section][isMobile ? "mobile" : "desktop"];

    if (isMobile && section === "skills") {
      const mobileScale = getMobileKeyboardScale();
      return {
        ...deviceState,
        scale: { x: mobileScale, y: mobileScale, z: mobileScale },
      };
    }

    return deviceState;
  };

  const positionSplineText = (target) => {
    if (!splineApp || !target?.position) return;

    const textObjects = [
      splineApp.findObjectByName("text-desktop"),
      splineApp.findObjectByName("text-mobile"),
    ].filter(Boolean);

    if (textObjects.length === 0) return;

    const horizontalLimit = isMobile ? 90 : 170;
    const verticalLimit = isMobile ? 55 : 100;
    const baseX = target.position.x ?? 0;
    const baseY = (target.position.y ?? 0) - (isMobile ? 42 : 68);

    let safeX = baseX;
    let safeY = baseY;

    if (baseX < -60) safeX += isMobile ? 48 : 72;
    if (baseX > 80) safeX -= isMobile ? 48 : 72;
    if (baseY > 40) safeY -= isMobile ? 24 : 42;
    if (baseY < -38) safeY += isMobile ? 24 : 42;

    const finalX = clamp(safeX, -horizontalLimit, horizontalLimit);
    const finalY = clamp(safeY, -verticalLimit, verticalLimit);

    textObjects.forEach((textObject) => {
      textObject.position.x = finalX;
      textObject.position.y = finalY;
    });
  };

  const updateSplineSkill = (skill, target) => {
    if (!splineApp) return;
    splineApp.setVariable("heading", skill?.label || "");
    splineApp.setVariable("desc", skill?.shortDescription || "");
    if (target) positionSplineText(target);
  };

  const selectSkill = (skill, target) => {
    setSelectedSkill(skill);
    updateSplineSkill(skill, target);
    soundEffects.playClick();
  };

  useEffect(() => {
    if (!showAllSkills) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setShowAllSkills(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showAllSkills]);

  // Set up intersection observer to detect when skills section comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      {
        threshold: 0.3, // Trigger when 30% of the section is visible
        rootMargin: "0px 0px -100px 0px", // Trigger slightly before the section is fully in view
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Handle mouse hover events on the 3D keys
  const handleMouseHover = (e) => {
    if (!splineApp) return;
    // If hovering over the keyboard body/platform, clear selection
    if (e.target.name === "body" || e.target.name === "platform") {
      setSelectedSkill(null);
      if (!selectedSkill) updateSplineSkill(null);
    } else {
      const skill = SKILLS[e.target.name];
      if (skill) {
        updateSplineSkill(skill, e.target);
      }
    }
  };

  // Show/hide skill labels depending on section and device
  useEffect(() => {
    if (!splineApp) return;
    // Only light mode for now
    const textDesktopLight = splineApp.findObjectByName("text-desktop");
    const textMobileLight = splineApp.findObjectByName("text-mobile");
    if (!textDesktopLight || !textMobileLight) return;
    if (activeSection !== "skills") {
      textDesktopLight.visible = false;
      textMobileLight.visible = false;
      return;
    }
    if (!isMobile) {
      textDesktopLight.visible = true;
      textMobileLight.visible = false;
    } else {
      textDesktopLight.visible = false;
      textMobileLight.visible = true;
    }
  }, [splineApp, isMobile, activeSection]);

  // Set up Spline event listeners and GSAP animations when the scene loads
  useEffect(() => {
    if (!splineApp) return undefined;

    handleSplineInteractions();
    handleGsapAnimations();

    return () => {
      if (!splineApp || typeof splineApp.removeEventListener !== "function") return;
      splineApp.removeEventListener("keyUp", () => {});
      splineApp.removeEventListener("keyDown", () => {});
      splineApp.removeEventListener("mouseHover", () => {});
    };
  }, [splineApp]);
  // Trigger the keyboard reveal animation when the scene is ready AND section is in view
  useEffect(() => {
    if (!splineApp || keyboardRevealed || !isInView) return;
    revealKeyCaps();
  }, [splineApp, keyboardRevealed, activeSection, isInView]);

  useEffect(() => {
    if (!isMobile || !splineApp || !keyboardRevealed) return;

    const keyboard = splineApp.findObjectByName("keyboard");
    if (!keyboard) return;

    const mobileScale = getMobileKeyboardScale();
    gsap.set(keyboard.scale, {
      x: mobileScale,
      y: mobileScale,
      z: mobileScale,
    });
  }, [isMobile, mobileSectionWidth, splineApp, keyboardRevealed]);

  // Animate the keyboard and keycaps into view
  const revealKeyCaps = async () => {
    if (!splineApp) return;
    const kbd = splineApp.findObjectByName("keyboard");
    if (!kbd) return;
    kbd.visible = false;
    await sleep(400); // Wait before revealing
    kbd.visible = true;
    setKeyboardRevealed(true);
    // Animate keyboard scale
    gsap.fromTo(
      kbd?.scale,
      { x: 0.01, y: 0.01, z: 0.01 },
      {
        x: keyboardStates(activeSection).scale.x,
        y: keyboardStates(activeSection).scale.y,
        z: keyboardStates(activeSection).scale.z,
        duration: 1.5,
        ease: "elastic.out(1, 0.6)",
      }
    );
    // Animate keycaps
    const allObjects = splineApp.getAllObjects();
    const keycaps = allObjects.filter((obj) => obj.name === "keycap");
    await sleep(900);
    if (isMobile) {
      // Show all mobile keycaps at once
      const mobileKeyCaps = allObjects.filter(
        (obj) => obj.name === "keycap-mobile"
      );
      mobileKeyCaps.forEach((keycap) => {
        keycap.visible = true;
      });
    } else {
      // Animate desktop keycaps one by one
      const desktopKeyCaps = allObjects.filter(
        (obj) => obj.name === "keycap-desktop"
      );
      desktopKeyCaps.forEach(async (keycap, idx) => {
        await sleep(idx * 70);
        keycap.visible = true;
      });
    }
    // Animate all keycaps with a bounce effect
    keycaps.forEach(async (keycap, idx) => {
      keycap.visible = false;
      await sleep(idx * 70);
      keycap.visible = true;
      gsap.fromTo(
        keycap.position,
        { y: 100 },
        { y: 25, duration: 0.5, delay: 0.1, ease: "bounce.out" }
      );
    });
  };

  // Set up Spline event listeners for key presses and hovers
  const handleSplineInteractions = () => {
    if (!splineApp) return;

    const onKeyUp = () => {
      if (!selectedSkill) updateSplineSkill(null);
    };

    const onKeyDown = (e) => {
      const skill = SKILLS[e.target.name];
      if (skill) selectSkill(skill, e.target);
    };

    splineApp.addEventListener("keyUp", onKeyUp);
    splineApp.addEventListener("keyDown", onKeyDown);
    splineApp.addEventListener("mouseHover", handleMouseHover);

    // Keep the listener references on the Spline instance so the handlers remain stable.
    splineApp.__skillHandlers = { onKeyUp, onKeyDown };
  };

  // Set up initial GSAP animations for the keyboard
  const handleGsapAnimations = () => {
    if (!splineApp) return;
    const kbd = splineApp.findObjectByName("keyboard");
    if (!kbd || !splineContainer.current) return;
    // Set initial scale and position
    gsap.set(kbd.scale, { ...keyboardStates("hero").scale });
    gsap.set(kbd.position, { ...keyboardStates("hero").position });
    gsap.timeline({
      onStart: () => setActiveSection("skills"),
    });
    // You can add scroll-based triggers here if you want to animate between sections
  };

  // Render the 3D keyboard section
  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          setSelectedSkill(null);
          updateSplineSkill(null);
        }
      }}
      style={{
        width: "100%",
        height: "100vh",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Skills Title */}

      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h2
          style={{
            fontSize: isMobile ? "clamp(2.5rem, 12vw, 3.5rem)" : "4rem",
            fontWeight: 700,
            marginTop: isMobile ? 12 : 34,
            textAlign: "center",
            letterSpacing: 2,
            color: "#fff",
            textShadow: "0 2px 16px rgba(0,0,0,0.2)",
          }}
        >
          Skills
        </h2>
        <p style={{ textAlign: "center", color: "#aaa" }}>
          (hint: press a key)
        </p>
        {/* Suspense fallback while loading the Spline 3D scene */}
        <div className="flex w-full max-w-6xl flex-col items-center justify-center gap-3 px-3">
          <div
            className="min-w-0 w-full flex-none"
            style={{
              width: "min(100%, 900px)",
              height: isMobile ? "52vh" : "58vh",
              minHeight: isMobile ? 320 : 420,
              maxHeight: 600,
            }}
          >
            {isInView ? (
              <Suspense fallback={<div>Loading 3D Keyboard...</div>}>
                <Spline
                  ref={splineContainer}
                  onLoad={(app) => setSplineApp(app)}
                  scene="/assets/skills-keyboard.spline"
                />
              </Suspense>
            ) : (
              <div className="h-[420px] w-full" aria-hidden="true" />
            )}
          </div>
          <motion.button
            type="button"
            onClick={() => setShowAllSkills(true)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="shrink-0 rounded-lg border border-cyan-200/20 bg-[#081321]/85 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-cyan-100/75 shadow-[0_6px_18px_rgba(34,211,238,0.1)] backdrop-blur-md transition hover:border-cyan-200/45 hover:text-white hover:shadow-[0_8px_22px_rgba(34,211,238,0.16)]"
          >
            View All Skills
          </motion.button>
        </div>
      </div>
      {showAllSkills ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="All skills"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-40 flex items-center justify-center bg-[#050b14]/80 p-4 backdrop-blur-md"
          onClick={(event) => {
            if (event.target === event.currentTarget) setShowAllSkills(false);
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="max-h-[86vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-cyan-200/20 bg-[#091321]/95 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.5)] sm:p-7"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/70">Technical toolkit</p>
                <h3 className="mt-1 text-2xl font-bold text-white">All Skills</h3>
              </div>
                <button type="button" onClick={() => setShowAllSkills(false)} aria-label="Close all skills" className="rounded-md p-1 text-2xl leading-none text-white/45 transition hover:text-white">X</button>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {SKILL_GROUPS.map((group) => {
                const groupSkills = skillList.filter((skill) => group.categories.includes(skill.category));
                return (
                  <div key={group.label}>
                    <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/50">{group.label}</h4>
                    <div className="space-y-2">
                      {groupSkills.map((skill) => (
                        <button
                          key={skill.name}
                          type="button"
                          onMouseEnter={() => updateSplineSkill(skill)}
                          onFocus={() => updateSplineSkill(skill)}
                          onClick={() => selectSkill(skill)}
                          className="group w-full rounded-lg border border-white/10 bg-white/[0.03] p-3 text-left transition hover:-translate-y-0.5 hover:bg-white/[0.07]"
                          style={{ borderColor: `${skill.accent}35` }}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-semibold text-white transition group-hover:text-cyan-100">{skill.label}</span>
                          </div>
                          <p className="mt-1 text-[10px] uppercase tracking-[0.12em]" style={{ color: skill.accent }}>{skill.category}</p>
                          <p className="mt-2 text-xs leading-5 text-white/55">{skill.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
      <span id="projects"></span>
    </section>
  );
};

export default SkillKeyboard;
