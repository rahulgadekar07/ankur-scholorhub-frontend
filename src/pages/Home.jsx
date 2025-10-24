// src/pages/Home.jsx
import React from "react";
import { useEffect, useRef, useState } from "react";

const Home = () => {
  // ------------------- Enhanced CountUp Hook -------------------
  const useCountUp = (end, duration = 2200, delay = 0, prefix = "", suffix = "") => {
    const [count, setCount] = useState(0);
    const [displayValue, setDisplayValue] = useState(prefix + "0" + suffix);
    const countRef = useRef(null);
    const frameRef = useRef(null);
    const startTimeRef = useRef(null);
    const hasStartedRef = useRef(false);

    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;

      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuart(progress);
      const current = Math.floor(eased * end);

      setCount(current);
      setDisplayValue(prefix + formatNumber(current) + suffix);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(prefix + formatNumber(end) + suffix);
      }
    };

    useEffect(() => {
      const startAnimation = () => {
        if (hasStartedRef.current) return;
        hasStartedRef.current = true;

        setTimeout(() => {
          startTimeRef.current = null;
          frameRef.current = requestAnimationFrame(animate);
        }, delay);
      };

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            startAnimation();
            observer.disconnect();
          }
        },
        { threshold: 0.6, rootMargin: "0px 0px -50px 0px" }
      );

      if (countRef.current) {
        observer.observe(countRef.current);
      }

      return () => {
        observer.disconnect();
        if (frameRef.current) cancelAnimationFrame(frameRef.current);
      };
    }, [end, duration, delay, prefix, suffix]);

    const ref = (node) => {
      countRef.current = node;
    };

    return { displayValue, ref };
  };

  // ------------------- Formatter -------------------
  const formatNumber = (n) => new Intl.NumberFormat("en-IN").format(n);

  // ------------------- Counters with Staggered Delays -------------------
  const donors = useCountUp(120, 2000, 0, "", "+");
  const students = useCountUp(850, 2200, 200, "", "+");
  const turnover = useCountUp(4_500_000, 2500, 400, "₹", "");

  return (
    <div className="flex h-[15vh] items-center justify-between bg-gradient-to-br from-sky-50 to-sky-100 overflow-hidden">
      {/* ---------- MAP ---------- */}
      <div className="w-1/2 h-full overflow-hidden rounded-l-lg shadow-xl">
        <iframe
          title="Ankur Vidyarthi Foundation Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3174.5740442791234!2d74.25575317421406!3d17.57679259732301!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc3d376539e24bd%3A0x306c8c15870b80f4!2z4KSF4KSC4KSV4KWB4KSwIOCkteCkv-CkpuCljeCkr-CkvuCksOCljeCkpeClgCDgpKvgpL7gpIngpILgpKHgpYfgpLbgpKggKOCkheCkreCljeCkr-CkvuCkuOCkv-CkleCkviksIOCkteClh-Cks-Clgg!5e1!3m2!1sen!2sin!4v1761282395843!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="rounded-l-lg scale-105 transition-transform duration-1000 hover:scale-110"
        />
      </div>

      {/* ---------- COUNTERS ---------- */}
      <div className="flex w-1/2 h-full bg-white rounded-r-lg shadow-xl overflow-hidden">
        {/* Donor */}
        <CounterItem
          ref={donors.ref}
          value={donors.displayValue}
          label="Donors"
          color="indigo"
          delay="animate-[fadeIn_0.6s_ease-out_0s_forwards]"
        />

        {/* Students */}
        <CounterItem
          ref={students.ref}
          value={students.displayValue}
          label="Students"
          color="green"
          delay="animate-[fadeIn_0.6s_ease-out_0.2s_forwards]"
        />

        {/* Market Turnover */}
        <CounterItem
          ref={turnover.ref}
          value={turnover.displayValue}
          label="Market Turnover"
          color="amber"
          delay="animate-[fadeIn_0.6s_ease-out_0.4s_forwards]"
        />
      </div>
    </div>
  );
};

// ------------------- Reusable Counter Item Component -------------------
const CounterItem = React.forwardRef(({ value, label, color, delay }, ref) => {
  const colorClasses = {
    indigo: "text-indigo-600 from-indigo-500 to-indigo-700",
    green: "text-green-600 from-green-500 to-green-700",
    amber: "text-amber-600 from-amber-500 to-amber-700",
  };

  return (
    <div
      ref={ref}
      className={`flex flex-col items-center justify-center w-1/3 border-r border-gray-200 last:border-r-0 opacity-0 ${delay}`}
      style={{ animationFillMode: "forwards" }}
    >
      <div className="relative">
        <span
          className={`text-4xl font-extrabold bg-gradient-to-r ${colorClasses[color]} bg-clip-text text-transparent 
            drop-shadow-sm animate-[pulse_2s_infinite] tracking-tight`}
          style={{
            textShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          {value}
        </span>
      </div>
      <span className="mt-2 text-sm font-semibold text-gray-700 tracking-wide">
        {label}
      </span>
    </div>
  );
});

// ------------------- Tailwind Animations (Add to globals.css) -------------------
/*
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.03); }
}
*/

export default Home;