// src/pages/Home.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  MapPin,
  Users,
  GraduationCap,
  IndianRupee,
  Bell,
  ChevronDown,
} from "lucide-react";
import { Routes, Route } from "react-router-dom";
import MainContent from "../components/MainContent";
import Donate from "./Donate";
const Home = () => {
  // ── MOCK NOTICES (shrinkable) ─────────────────────────────────────
  const [notices, setNotices] = useState([
    {
      id: 1,
      title: "Notice 1",
      desc: "Scholarship deadline: Nov 15",
      date: "2025-10-20",
    },
    { id: 2, title: "Notice 2", desc: "AGM on Dec 5", date: "2025-10-18" },
    {
      id: 3,
      title: "Notice 3",
      desc: "New donor portal live",
      date: "2025-10-15",
    },
  ]);

  // Uncomment for real API
  /* 
  useEffect(() => {
    fetch("/api/notices").then(r => r.json()).then(setNotices);
  }, []);
  */

  // ── Count-Up Hook (same as before) ───────────────────────────────
  const useCountUp = (end, duration = 1800, delay = 0) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const frame = useRef();
    const start = useRef();

    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

    const step = (ts) => {
      if (!start.current) start.current = ts;
      const elapsed = ts - start.current;
      const prog = Math.min(elapsed / duration, 1);
      setCount(Math.floor(easeOutQuart(prog) * end));
      if (prog < 1) frame.current = requestAnimationFrame(step);
    };

    useEffect(() => {
      const obs = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            setTimeout(() => {
              start.current = undefined;
              frame.current = requestAnimationFrame(step);
            }, delay);
            obs.disconnect();
          }
        },
        { threshold: 0.6 }
      );
      if (ref.current) obs.observe(ref.current);
      return () => {
        obs.disconnect();
        if (frame.current) cancelAnimationFrame(frame.current);
      };
    }, [end, duration, delay]);

    return { count, ref };
  };

  const fmt = (n) => new Intl.NumberFormat("en-IN").format(n);
  const donors = useCountUp(120, 1800, 0);
  const students = useCountUp(850, 2000, 150);
  const turnover = useCountUp(4_500_000, 2200, 300);

  return (
    <div className="space-y-6 pb-8">
      {/* ── COMPACT HERO STRIP: MAP + COUNTERS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-48 lg:h-40">
        {/* MAP */}
        <div className="relative overflow-hidden rounded-xl shadow-md border border-gray-300">
          <iframe
            title="Ankur Vidyarthi Foundation"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3174.5740442791234!2d74.25575317421406!3d17.57679259732301!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc3d376539e24bd%3A0x306c8c15870b80f4!2z4KSF4KSC4KSV4KWB4KSwIOCkteCkv-CkpuCljeCkr-CkvuCksOCljeCkpeClgCDgpKvgpL7gpIngpILgpKHgpYfgpLbgpKggKOCkheCkreCljeCkr-CkvuCkuOCkv-CkleCkviksIOCkteClh-Cks-Clgg!5e1!3m2!1sen!2sin!4v1761282395843!5m2!1sen!2sin"
            width="100%"
            height="100%"
            className="rounded-xl"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          />
          <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded-full shadow text-xs font-medium flex items-center gap-1">
            <MapPin className="w-3 h-3 text-red-600" />
            View Map
          </div>
        </div>

        {/* COUNTERS */}
        <div className="grid grid-cols-3 gap-3 bg-white rounded-xl shadow-md p-4 border border-gray-300">
          <CounterCard
            ref={donors.ref}
            icon={<Users className="w-7 h-7" />}
            value={`${fmt(donors.count)}+`}
            label="Donors"
            gradient="from-indigo-500 to-indigo-700"
            textColor="text-indigo-600"
          />
          <CounterCard
            ref={students.ref}
            icon={<GraduationCap className="w-7 h-7" />}
            value={`${fmt(students.count)}+`}
            label="Students"
            gradient="from-green-500 to-green-700"
            textColor="text-green-600"
          />
          <CounterCard
            ref={turnover.ref}
            icon={<IndianRupee className="w-7 h-7" />}
            value={`₹${fmt(turnover.count)}`}
            label="Turnover"
            gradient="from-amber-500 to-amber-700"
            textColor="text-amber-600"
          />
        </div>
      </div>

      {/* ── MAIN CONTENT: LEFT (Small Notices) | RIGHT (Testimonials + CTA) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* LEFT: SHRINKED NOTICEBOARD */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md border border-gray-300 overflow-hidden h-full flex flex-col">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-3 flex items-center justify-between text-sm">
              <h3 className="font-bold flex items-center gap-1">
                <Bell className="w-5 h-5" />
                Notices
              </h3>
              <ChevronDown className="w-4 h-4 animate-bounce" />
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin text-xs">
              {notices.length === 0 ? (
                <p className="text-center text-gray-400 py-6">No notices</p>
              ) : (
                <div className="divide-y divide-gray-200">
                  {notices.map((n) => (
                    <div
                      key={n.id}
                      className="p-3 hover:bg-gray-50 cursor-pointer"
                    >
                      <h4 className="font-medium text-gray-800">{n.title}</h4>
                      <p className="text-gray-600 text-xs mt-1">{n.desc}</p>
                      <span className="text-xs text-gray-400">
                        {new Date(n.date).toLocaleDateString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-2 text-center border-t">
              <button className="text-blue-600 text-xs hover:underline">
                View All
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: MAIN CONTENT – TESTIMONIALS + CTA */}
        <Routes>
          <Route path="*" element={<MainContent />} />
          <Route path="/donate" element={<Donate />} />
        </Routes>
      </div>
    </div>
  );
};

/* ── Reusable Components ── */
const CounterCard = React.forwardRef(
  ({ icon, value, label, gradient, textColor }, ref) => (
    <div
      ref={ref}
      className="flex flex-col items-center justify-center text-center opacity-0 animate-[fadeIn_0.6s_ease-out_0s_forwards]"
      style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}
    >
      <div
        className={`p-2.5 rounded-full bg-gradient-to-br ${gradient} text-white shadow animate-[pulse_2s_infinite]`}
      >
        {icon}
      </div>
      <p className={`mt-2 text-xl font-bold ${textColor}`}>{value}</p>
      <p className="text-xs text-gray-600 mt-1">{label}</p>
    </div>
  )
);

export default Home;
