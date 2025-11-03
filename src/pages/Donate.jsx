import React, { useState } from "react";
import "../styles/globalStyles.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useConfetti } from "../context/ConfettiContext"; // ✅ correct

const presetAmounts = [500, 1000, 2500, 5000, 10000];

export default function Donate() {
  const { triggerConfetti } = useConfetti();
  const [amount, setAmount] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    pan: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ── Load Razorpay script ─────────────────────────────
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

  // ── Handlers ───────────────────────────────────
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
    setForm({
      name: "",
      email: "",
      phone: "",
      pan: "",
      address: "",
    });
  };

  // ── Razorpay integration ────────────────────────
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
      toast.error("Razorpay SDK failed to load. Check your connection.", {
        autoClose: 3000,
      });
      return;
    }

    try {
      const createOrderUrl =
        (process.env.REACT_APP_BASE_URL || "/api/") + "payment/create-order";

      const response = await fetch(createOrderUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, name: form.name, email: form.email }),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => "");
        console.error("Create order failed:", response.status, text);
        setLoading(false);
        toast.error("Server error while initiating payment. Try again.", {
          autoClose: 3000,
        });
        return;
      }

      const data = await response.json();

      if (!data.success) {
        setLoading(false);
        toast.error(data.message || "Failed to initiate payment. Try again.", {
          autoClose: 3000,
        });
        return;
      }

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency || "INR",
        name: "Ankur Vidyarthi Foundation",
        description: "Donation towards education",
        order_id: data.orderId,
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        notes: {
          pan: form.pan,
          address: form.address,
        },
        theme: { color: "#2563eb" },
        handler: async function (response) {
          try {
            const verifyUrl =
              (process.env.REACT_APP_BASE_URL || "/api/") +
              "payment/verify-payment";

            const verify = await fetch(verifyUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });

            if (!verify.ok) {
              const txt = await verify.text().catch(() => "");
              console.error("Verify failed:", verify.status, txt);
              toast.error("Payment verification failed. Contact support.", {
                autoClose: 3000,
              });
              setLoading(false);
              return;
            }

            const verifyData = await verify.json();

            if (verifyData.success) {
              toast.success("Payment successful. Thank you!", {
                autoClose: 2000,
              });
              resetForm();
              setLoading(false);

              triggerConfetti(18000); // GLOBAL confetti for 18s

              setTimeout(() => {
                if (navigate) navigate("/");
              }, 5000);
            }
          } catch (err) {
            console.error("Verification error:", err);
            toast.error("Error verifying payment. Contact support.", {
              autoClose: 3000,
            });
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            toast.info("Payment cancelled", { autoClose: 1800 });
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on &&
        rzp.on("payment.failed", function (response) {
          console.error("Payment failed event:", response);
          toast.error("Payment failed. Please try again.", { autoClose: 2500 });
          setLoading(false);
        });

      rzp.open();
    } catch (err) {
      console.error("Payment initiation error:", err);
      toast.error("Something went wrong while initiating payment.", {
        autoClose: 2500,
      });
      setLoading(false);
    }
  };

  // ── Render ─────────────────────────────────────
  return (
    <main className="backCommonColor py-8 px-4 md:py-4">
      <div className="max-w-7xl mx-auto">
        <section className="text-center mb-8 md:mb-6">
          <h1 className="text-4xl md:text-3xl font-bold text-blue-700 mb-1">
            LET'S DONATE
          </h1>
          <p className="text-lg text-gray-700">
            Your contribution helps underprivileged students get quality education.
          </p>
        </section>

        <div
          className="grid gap-6 md:gap-8 
                      grid-cols-1 
                      md:grid-cols-3 
                      lg:grid-cols-[1fr_1.2fr_1fr] 
                      auto-rows-min"
        >
          {/* Amount Selector */}
          <section className="bg-white rounded-2xl shadow-lg p-5 md:p-7">
            <h2 className="text-xl md:text-2xl font-semibold text-blue-700 mb-4 text-center">
              Select Amount
            </h2>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {presetAmounts.map((v) => (
                <button
                  key={v}
                  onClick={() => handleAmount(v)}
                  type="button"
                  className={`py-2 rounded-lg font-medium transition-all
                    ${
                      amount === v
                        ? "bg-blue-700 text-white shadow-sm scale-105"
                        : "bg-gray-100 text-gray-800 hover:bg-blue-50"
                    }`}
                >
                  ₹{v.toLocaleString("en-IN")}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-blue-700">₹</span>
              <input
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
              <p className="text-xs text-amber-600 mt-2 text-center">Minimum ₹100</p>
            )}
          </section>

          {/* Donor Details */}
          <section className="bg-white rounded-2xl shadow-lg p-5 md:p-7">
            <h2 className="text-xl md:text-2xl font-semibold text-blue-700 mb-4">
              Your Details
            </h2>

            <div className="grid grid-cols-1 gap-3">
              <input
                name="name"
                placeholder="Full Name *"
                required
                value={form.name}
                onChange={handleInput}
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
              />
              <input
                name="email"
                type="email"
                placeholder="Email *"
                required
                value={form.email}
                onChange={handleInput}
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
              />
              <input
                name="phone"
                placeholder="Phone (10 digits)"
                value={form.phone}
                onChange={handleInput}
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
              />
              <input
                name="pan"
                placeholder="PAN (for 80G receipt)"
                value={form.pan}
                onChange={handleInput}
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
              />
              <textarea
                name="address"
                rows={2}
                placeholder="Address (optional)"
                value={form.address}
                onChange={handleInput}
                className="border rounded-lg px-3 py-2 resize-none
                           focus:outline-none focus:ring-2 focus:ring-blue-700"
              />
            </div>
          </section>

          {/* Pay Summary */}
          <section
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

            <button
              onClick={handleDonate}
              disabled={!amount || amount < 100 || !form.name || !form.email || loading}
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
            </button>

            <div className="flex justify-center gap-3 mt-4 text-xs opacity-80">
              <span>SSL Secured</span>
              <span>•</span>
              <span>80G Tax Benefit</span>
              <span>•</span>
              <span>No Hidden Fees</span>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
