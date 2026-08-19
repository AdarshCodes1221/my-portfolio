import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import useParallax from "../reactbits/hooks/useParallax";
import { styles } from "../styles";
import useMediaQuery from "../utils/useMediaQuery";
import { ComputersCanvas } from "./canvas";

const Hero = () => {
  const cvPath = "/cv/Adarsh-Jha-CV.pdf";
  const [typedText, setTypedText] = useState("");
  const typedItems = ["Software Engineering", "Cloud", "Data/AI", "Cybersecurity"];
  const [itemIndex, setItemIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [cvAvailable, setCvAvailable] = useState(false);
  const [showDownloadEffect, setShowDownloadEffect] = useState(false);

  const isMobile = useMediaQuery("(max-width: 768px)");
  const { style: parallaxStyle } = useParallax({
    strength: 0.03,
    maxOffset: 15,
    enabled: !isMobile,
  });

  useEffect(() => {
    let mounted = true;

    fetch(cvPath, { method: "HEAD" })
      .then((response) => {
        if (mounted) setCvAvailable(response.ok);
      })
      .catch(() => {
        if (mounted) setCvAvailable(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const typeItem = () => {
      if (charIndex < typedItems[itemIndex].length) {
        setTypedText((prevText) => prevText + typedItems[itemIndex][charIndex]);
        setCharIndex(charIndex + 1);
      } else {
        setIsTyping(false);
        setTimeout(() => {
          setIsTyping(true);
          setItemIndex((itemIndex + 1) % typedItems.length);
          setCharIndex(0);
          setTypedText("");
        }, 1000); // Delay before typing the next item
      }
    };

    const typingInterval = setInterval(typeItem, 100); // Typing speed

    return () => clearInterval(typingInterval);
  }, [charIndex, itemIndex]);

  const handleCvDownload = () => {
    setShowDownloadEffect(true);
    window.setTimeout(() => setShowDownloadEffect(false), 950);
  };

  return (
    <section className={`relative w-full h-screen mx-auto`} id="hero">
      <div
        className={`hero-copy absolute inset-x-0 top-[120px] max-w-7xl mx-auto ${styles.paddingX} flex flex-row items-start gap-5`}
      >
        <div className="flex flex-col justify-center items-center mt-5">
          <div className="w-5 h-5 rounded-full bg-[#915EFF]" />
          <div className="w-1 sm:h-80 h-40 violet-gradient" />
        </div>

        <div style={parallaxStyle}>
          <h1 className={`${styles.heroHeadText} text-white`}>
            ADARSH JHA
          </h1>
          <p className={`${styles.heroSubText} mt-2 text-white-100`}>
            Computer Science Undergraduate
            <br />
            <span
              className="typed"
              aria-hidden="true"
              style={{
                backgroundImage:
                  "linear-gradient(to bottom, rgba(245, 202, 153, 0.5), rgba(245, 202, 153, 0.5))",
                backgroundRepeat: "no-repeat",
                backgroundSize: "100% 8px",
                backgroundPosition: "0 100%",
                color: "#915EFF",
                display: "inline-block",
                fontWeight: "bold",
              }}
            >
              {typedText}
            </span>
            <span className="typed-cursor" aria-hidden="true">
              |
            </span>
            <br />
            <b>Building practical software across cloud, data and security.</b>
          </p>
        </div>
      </div>

      <ComputersCanvas />

      <div className="hero-actions absolute left-6 bottom-28 z-10 max-w-[calc(100%-3rem)]">
        <style>{`
          .cv-download-effect {
            position: absolute;
            left: 50%;
            top: 50%;
            width: 5rem;
            height: 5rem;
            pointer-events: none;
            transform: translate(-50%, -50%);
          }
          .cv-download-effect__document {
            position: absolute;
            left: 50%;
            top: 50%;
            width: 1.25rem;
            height: 1.5rem;
            border: 1px solid rgba(210, 231, 255, 0.9);
            border-radius: 2px;
            background: rgba(83, 119, 157, 0.65);
            box-shadow: 0 0 10px rgba(142, 197, 255, 0.3);
            transform: translate(-50%, -50%);
            animation: cv-document-lift 950ms ease-out forwards;
          }
          .cv-download-effect__heart {
            position: absolute;
            left: 50%;
            top: 50%;
            width: 0.7rem;
            height: 0.7rem;
            border: 1px solid rgba(142, 197, 255, 0.8);
            transform: translate(-50%, -50%) rotate(45deg) scale(0);
            opacity: 0;
            animation: cv-heart-burst 950ms 160ms ease-out forwards;
          }
          .cv-download-effect__heart::before,
          .cv-download-effect__heart::after {
            content: "";
            position: absolute;
            width: 0.7rem;
            height: 0.7rem;
            border: 1px solid rgba(142, 197, 255, 0.8);
            border-radius: 50%;
          }
          .cv-download-effect__heart::before { left: -1px; top: -0.4rem; }
          .cv-download-effect__heart::after { left: -0.4rem; top: -1px; }
          @keyframes cv-document-lift {
            0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            55% { opacity: 1; transform: translate(-50%, -85%) scale(0.8); }
            100% { opacity: 0; transform: translate(-50%, -105%) scale(0.35); }
          }
          @keyframes cv-heart-burst {
            0% { opacity: 0; transform: translate(-50%, -50%) rotate(45deg) scale(0); }
            35% { opacity: 0.9; transform: translate(-50%, -50%) rotate(45deg) scale(1); }
            100% { opacity: 0; transform: translate(-50%, -50%) rotate(45deg) scale(2.7); }
          }
        `}</style>
        {cvAvailable ? (
          <a
            href={cvPath}
            download="Adarsh-Jha-CV.pdf"
            aria-label="Download Adarsh Jha CV"
            onClick={handleCvDownload}
            className="rounded-lg border border-white/10 bg-white/[0.04] px-5 py-3 font-semibold text-white shadow-lg"
          >
            Download CV
          </a>
        ) : (
          <button
            type="button"
            disabled
            title="CV file is not available in this repository yet"
            aria-label="Download Adarsh Jha CV unavailable"
            className="rounded-lg border border-white/10 bg-white/[0.04] px-5 py-3 font-semibold text-white/45 shadow-lg cursor-not-allowed"
          >
            Download CV
          </button>
        )}
        {showDownloadEffect && (
          <span className="cv-download-effect" aria-hidden="true">
            <span className="cv-download-effect__document" />
            <span className="cv-download-effect__heart" />
          </span>
        )}
      </div>

      <div className="hero-scroll absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center">
        <a href="#about">
          <div className="w-[35px] h-[64px] rounded-3xl border-4 border-secondary flex justify-center items-start p-2">
            <motion.div
              animate={{
                y: [0, 24, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className="w-3 h-3 rounded-full bg-secondary mb-1"
            />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;
