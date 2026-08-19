import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import React, { useRef, useState } from "react";

import { SectionWrapper } from "../hoc";
import useMagnetic from "../reactbits/hooks/useMagnetic";
import useSoundCue from "../reactbits/hooks/useSoundCue";
import { styles } from "../styles";
import { slideIn } from "../utils/motion";
import { EarthCanvas } from "./canvas";
import Toast from "./ui/toast";

const Contact = () => {
  const formRef = useRef();
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "success",
  });
  const { play } = useSoundCue("notification");
  const { ref: submitButtonRef, style: magneticStyle } = useMagnetic({
    radius: 90,
    strength: 0.35,
  });

  const handleChange = (e) => {
    const { target } = e;
    const { name, value } = target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const name = form.name.trim();
    const email = form.email.trim();
    const message = form.message.trim();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!name || !email || !message || !isValidEmail) {
      play("notification");
      setToast({
        open: true,
        message: !isValidEmail && email
          ? "Please enter a valid email address."
          : "Please fill in all fields before submitting.",
        type: "error",
      });
      return;
    }
    setLoading(true);

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      setLoading(false);
      play("error");
      console.error("EmailJS configuration is incomplete.");
      setToast({
        open: true,
        message: "Contact form is temporarily unavailable. Please use email directly.",
        type: "error",
      });
      return;
    }

    try {
      await emailjs.send(
        serviceId,
        templateId,
        { name, email, message },
        publicKey
      );
      setForm({ name: "", email: "", message: "" });
      play("success");
      setToast({
        open: true,
        message: "Message sent successfully. Thanks for reaching out.",
        type: "success",
      });
    } catch {
      play("error");
      setToast({
        open: true,
        message: "Unable to send your message right now. Please try again or contact me directly.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {toast.open && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, open: false })}
        />
      )}
      <div className="w-full min-h-screen">
        <h2 className="text-white text-center font-black md:text-[60px] sm:text-[50px] xs:text-[40px] text-[30px] px-4">
          Let's Work Together
        </h2>
        <div className="xl:mt-12 flex xl:flex-row flex-col-reverse gap-6 lg:gap-10 overflow-hidden text-white px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={slideIn("left", "tween", 0.2, 1)}
            className="flex-[0.75] w-full xl:w-[40rem] bg-[#111522] p-4 sm:p-6 lg:p-8 rounded-2xl"
          >
            <p className={`text-[#8ec5ff] ${styles.sectionSubText}`}>
              Get in touch
            </p>
            <h3
              className={`${styles.sectionHeadText} text-[28px] sm:text-[32px] lg:text-[36px]`}
            >
              Contact.
            </h3>

            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="mt-6 flex flex-col gap-6 sm:gap-8"
              id="contact"
            >
              <label className="flex flex-col">
                <span className="font-medium text-[#8ec5ff] mb-2 sm:mb-4 text-sm sm:text-base">
                  Full name
                </span>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="bg-[#07080d] py-3 sm:py-4 px-4 sm:px-6 placeholder:text-[#fafafa8a] rounded-lg outline-none border-none font-medium text-sm sm:text-base w-full"
                />
              </label>
              <label className="flex flex-col">
                <span className="font-medium text-[#8ec5ff] mb-2 sm:mb-4 text-sm sm:text-base">
                  Email Address
                </span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="bg-[#07080d] py-3 sm:py-4 px-4 sm:px-6 placeholder:text-[#fafafa8a] rounded-lg outline-none border-none font-medium text-sm sm:text-base w-full"
                />
              </label>
              <label className="flex flex-col">
                <span className="font-medium text-[#8ec5ff] mb-2 sm:mb-4 text-sm sm:text-base">
                  Your Message
                </span>
                <textarea
                  rows={5}
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project,"
                  className="bg-[#07080d] py-3 sm:py-4 px-4 sm:px-6 placeholder:text-[#fafafa8a] rounded-lg outline-none border-none font-medium text-sm sm:text-base w-full resize-none"
                />
              </label>

              <button
                ref={submitButtonRef}
                type="submit"
                disabled={loading}
                style={magneticStyle}
                className="bg-[#07080d] py-3 px-6 sm:px-8 rounded-xl outline-none w-fit text-white font-bold shadow-md shadow-primary text-sm sm:text-base hover:bg-[#0a0b12] transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send"}
              </button>
            </form>
          </motion.div>

          <motion.div
            variants={slideIn("right", "tween", 0.2, 1)}
            className="xl:flex-1 my-auto h-[300px] sm:h-[350px] md:h-[450px] lg:h-[550px] w-full"
          >
            <EarthCanvas />
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default SectionWrapper(Contact, "contact");
