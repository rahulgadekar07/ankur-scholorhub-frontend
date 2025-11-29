import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { submitContactForm } from "../services/contactService";

import {
  faUser,
  faEnvelope,
  faCommentDots,
  faPhone,
  faPaperPlane,
  faEraser,
} from "@fortawesome/free-solid-svg-icons";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    website: "", // honeypot
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (form.website) return { valid: false, message: "Spam detected" };
    if (!form.name.trim()) return { valid: false, message: "Name is required" };
    if (!form.email.trim()) return { valid: false, message: "Email is required" };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email))
      return { valid: false, message: "Enter a valid email" };
    if (!form.phone.trim()) return { valid: false, message: "Mobile number is required" };
    if (!/^[6-9]\d{9}$/.test(form.phone))
      return { valid: false, message: "Enter a valid 10-digit mobile number" };
    if (!form.message.trim()) return { valid: false, message: "Message is required" };
    return { valid: true };
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const check = validate();
  if (!check.valid) {
    toast.error(check.message);
    return;
  }

  setLoading(true);
  try {
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      mobile: form.phone.trim(),
      message: form.message.trim(),
      datetime: new Date().toISOString().slice(0, 19).replace("T", " "),
    };

    await submitContactForm(payload);

    toast.success("Message sent successfully!");
    setForm({ name: "", email: "", phone: "", message: "", website: "" });
  } catch (err) {
    toast.error(err.message || "Failed to send message");
  } finally {
    setLoading(false);
  }
};

  const handleClear = () => {
    setForm({ name: "", email: "", phone: "", message: "", website: "" });
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center  px-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <motion.div
        className="relative  shadow-xl rounded-3xl w-full max-w-[1200px] p-8 md:p-12 overflow-hidden"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Soft glowing border */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#1d4ed8] via-sky-500 to-red-500 opacity-60 blur-[3px]"></div>

        {/* Inner content */}
        <div className="relative z-10 bg-gradient-to-b from-white via-sky-50 to-white rounded-3xl p-6 md:p-10">
          <h2 className="text-4xl font-bold text-center text-[#1d4ed8] mb-3">
            Get in Touch
          </h2>
          <p className="text-center text-gray-600 mb-10 text-lg">
            We'd love to hear from you! Fill out the form below and we'll respond soon.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Name
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg px-3 focus-within:border-blue-600">
                  <FontAwesomeIcon icon={faUser} className="text-gray-400 mr-2" />
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full py-2 outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Email
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg px-3 focus-within:border-blue-600">
                  <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 mr-2" />
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full py-2 outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Mobile Number
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg px-3 focus-within:border-blue-600">
                  <FontAwesomeIcon icon={faPhone} className="text-gray-400 mr-2" />
                  <input
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter 10-digit mobile number"
                    className="w-full py-2 outline-none bg-transparent"
                    maxLength={10}
                  />
                </div>
              </div>

              {/* Honeypot */}
              <input
                type="text"
                name="website"
                value={form.website}
                onChange={handleChange}
                className="hidden"
              />
            </div>

            {/* Right Column */}
            <div className="flex flex-col justify-between space-y-6">
              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Message
                </label>
                <div className="flex items-start border border-gray-300 rounded-lg px-3 focus-within:border-blue-600">
                  <FontAwesomeIcon
                    icon={faCommentDots}
                    className="text-gray-400 mt-3 mr-2"
                  />
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Write your message..."
                    className="w-full py-2 outline-none bg-transparent resize-none min-h-[150px]"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  disabled={loading}
                  type="submit"
                  className={`flex-1 py-3 rounded-lg text-white font-semibold shadow-md transition-all duration-300 ${
                    loading
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-[#1d4ed8] hover:bg-[#143ea0]"
                  }`}
                >
                  <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                  {loading ? "Sending..." : "Send Message"}
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={handleClear}
                  className="flex-1 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md transition-all duration-300"
                >
                  <FontAwesomeIcon icon={faEraser} className="mr-2" />
                  Clear
                </motion.button>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;
