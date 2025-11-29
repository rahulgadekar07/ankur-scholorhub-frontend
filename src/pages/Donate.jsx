import React, { useState } from "react";
import "../styles/globalStyles.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useConfetti } from "../context/ConfettiContext";
import { motion } from "framer-motion";

const presetAmounts = [500, 1000, 2500, 5000, 10000];



// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 120 },
  },
};

const inputVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export default function Donate() {
  const { triggerConfetti } = useConfetti();
  const [amount, setAmount] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    pan: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ── Razorpay & Handlers (unchanged) ─────────────────────
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.querySelector("#razorpay-script")) return resolve(true);
      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleAmount = (v) => setAmount(v);
  const handleCustom = (e) => {
    const v = e.target.value ? Number(e.target.value) : null;
    setAmount(v);
  };
  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const resetForm = () => {
    setAmount(null);
    setForm({ name: "", email: "", phone: "", pan: "", address: "" });
  };

  const handleDonate = async () => {
  if (!amount || amount < 100) {
    toast.warn("Minimum donation is ₹100", { autoClose: 2000 });
    return;
  }
  if (!form.name || !form.email) {
    toast.warn("Name and Email are required", { autoClose: 2000 });
    return;
  }

  setLoading(true);
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    setLoading(false);
    toast.error("Razorpay SDK failed to load.", { autoClose: 3000 });
    return;
  }

  try {
    const createOrderUrl = (process.env.REACT_APP_BASE_URL || "/api/") + "payment/create-order";
    const response = await fetch(createOrderUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, name: form.name, email: form.email }),
    });

    if (!response.ok) throw new Error("Create order failed");

    const data = await response.json();
    if (!data.success) throw new Error(data.message);

    // ── Razorpay options ─────────────────────────────
    const options = {
      key: data.key,
      amount: data.amount,
      currency: data.currency || "INR",
      name: "Ankur Vidyarthi Foundation",
      description: "Donation towards education",
      order_id: data.orderId,
      prefill: { name: form.name, email: form.email, contact: form.phone },
      notes: { pan: form.pan, address: form.address },
      theme: { color: "#2563eb" },

      // ✅ Handler inside options
      handler: async (response) => {
        setVerifying(true); // show overlay
        try {
          const verifyUrl = (process.env.REACT_APP_BASE_URL || "/api/") + "payment/verify-payment";
          const verify = await fetch(verifyUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });

          const verifyData = await verify.json();
          if (verifyData.success) {
            toast.success("Payment successful. Thank you!", { autoClose: 2000 });
            resetForm();
            triggerConfetti(18000);
            setTimeout(() => navigate("/"), 5000);
          } else {
            toast.error("Payment verification failed.", { autoClose: 3000 });
          }
        } catch (err) {
          toast.error("Payment verification error.", { autoClose: 3000 });
        } finally {
          setVerifying(false); // hide overlay
          setLoading(false);
        }
      },

      modal: {
        ondismiss: () => {
          toast.info("Payment cancelled");
          setLoading(false);
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (err) {
    toast.error("Payment failed. Try again.", { autoClose: 2500 });
    setLoading(false);
  }
};


  // ── Render with Animations ─────────────────────
  return (
    <motion.main
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="backCommonColor py-8 px-4 md:py-4"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.section
          variants={cardVariants}
          className="text-center mb-8 md:mb-6"
        >
          <h1 className="text-4xl md:text-3xl font-bold text-blue-700 mb-1">
            LET'S DONATE
          </h1>
          <p className="text-lg text-gray-700">
            Your contribution helps underprivileged students get quality education.
          </p>
        </motion.section>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          className="grid gap-6 md:gap-8 
                      grid-cols-1 
                      md:grid-cols-3 
                      lg:grid-cols-[1fr_1.2fr_1fr] 
                      auto-rows-min"
        >
          {/* Amount Selector */}
          <motion.section
            variants={cardVariants}
            className="bg-white rounded-2xl shadow-lg p-5 md:p-7"
          >
            <h2 className="text-xl md:text-2xl font-semibold text-blue-700 mb-4 text-center">
              Select Amount
            </h2>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {presetAmounts.map((v) => (
                <motion.button
                  key={v}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAmount(v)}
                  className={`py-2 rounded-lg font-medium transition-all
                    ${
                      amount === v
                        ? "bg-blue-700 text-white shadow-sm"
                        : "bg-gray-100 text-gray-800 hover:bg-blue-50"
                    }`}
                >
                  ₹{v.toLocaleString("en-IN")}
                </motion.button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-blue-700">₹</span>
              <motion.input
                variants={inputVariants}
                type="number"
                min="1"
                placeholder="Custom"
                value={amount || ""}
                onChange={handleCustom}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-base 
                           focus:outline-none focus:ring-2 focus:ring-blue-700"
              />
            </div>

            {amount && amount < 100 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-amber-600 mt-2 text-center"
              >
                Minimum ₹100
              </motion.p>
            )}
          </motion.section>

          {/* Donor Details */}
          <motion.section
            variants={cardVariants}
            className="bg-white rounded-2xl shadow-lg p-5 md:p-7"
          >
            <h2 className="text-xl md:text-2xl font-semibold text-blue-700 mb-4">
              Your Details
            </h2>

            <div className="grid grid-cols-1 gap-3">
              {["name", "email", "phone", "pan"].map((field) => (
                <motion.input
                  key={field}
                  variants={inputVariants}
                  name={field}
                  type={field === "email" ? "email" : "text"}
                  placeholder={
                    field === "name"
                      ? "Full Name *"
                      : field === "email"
                      ? "Email *"
                      : field === "phone"
                      ? "Phone (10 digits)"
                      : "PAN (for 80G receipt)"
                  }
                  required={field === "name" || field === "email"}
                  value={form[field]}
                  onChange={handleInput}
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
                />
              ))}
              <motion.textarea
                variants={inputVariants}
                name="address"
                rows={2}
                placeholder="Address (optional)"
                value={form.address}
                onChange={handleInput}
                className="border rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-700"
              />
            </div>
          </motion.section>

          {/* Pay Summary */}
          <motion.section
            variants={cardVariants}
            className="bg-gradient-to-r from-blue-700 to-blue-800 rounded-2xl 
                        shadow-xl p-5 md:p-7 text-white flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-3 text-center">
                Review & Pay
              </h2>
              <div className="text-4xl md:text-5xl font-extrabold text-center mb-2">
                ₹{amount ? amount.toLocaleString("en-IN") : "0"}
              </div>
            </div>

            <motion.button
              onClick={handleDonate}
              disabled={!amount || amount < 100 || !form.name || !form.email || loading}
              animate={
                amount && amount >= 100 && form.name && form.email && !loading
                  ? { scale: [1, 1.05, 1] }
                  : {}
              }
              transition={{ repeat: Infinity, duration: 1.5 }}
              className={`mt-4 w-full py-3 rounded-lg font-bold text-lg transition-all
                ${
                  amount && amount >= 100 && form.name && form.email
                    ? "bg-white text-blue-700 hover:bg-gray-100 shadow-md"
                    : "bg-white/30 text-white/70 cursor-not-allowed"
                }`}
            >
              {loading
                ? "Processing..."
                : amount && amount >= 100 && form.name && form.email
                ? "Pay Securely via Razorpay"
                : "Complete Details"}
            </motion.button>

            <div className="flex justify-center gap-3 mt-4 text-xs opacity-80">
              <span>SSL Secured</span>
              <span>•</span>
              <span>80G Tax Benefit</span>
              <span>•</span>
              <span>No Hidden Fees</span>
            </div>
          </motion.section>
        </motion.div>
      </div>
      {verifying && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white rounded-2xl p-6 flex flex-col items-center shadow-lg"
    >
      <svg
        className="animate-spin h-12 w-12 text-blue-700 mb-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
      <p className="text-gray-800 font-medium text-lg">Verifying Payment...</p>
    </motion.div>
  </div>
)}

    </motion.main>
    
  );
}