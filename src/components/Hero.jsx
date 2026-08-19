import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import useParallax from "../reactbits/hooks/useParallax";
import { styles } from "../styles";
import useMediaQuery from "../utils/useMediaQuery";
import { ComputersCanvas } from "./canvas";

const Hero = () => {
  const [typedText, setTypedText] = useState("");
  const typedItems = ["Software Engineering", "Cloud", "Data/AI", "Cybersecurity"];
  const [itemIndex, setItemIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  const isMobile = useMediaQuery("(max-width: 768px)");
  const { style: parallaxStyle } = useParallax({
    strength: 0.03,
    maxOffset: 15,
    enabled: !isMobile,
  });

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
        <button type="button" disabled title="CV file is not available in this repository yet" className="rounded-lg border border-white/10 bg-white/[0.04] px-5 py-3 font-semibold text-white/45 shadow-lg cursor-not-allowed">
          Download CV
        </button>
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
