'use client';

import React from "react";
import { motion } from "framer-motion";
import {
  Target,
  Rocket,
  Handshake,
  BookOpen,
  GraduationCap,
  Users,
  Trophy,
} from "lucide-react";

const timeline = [
  {
    Icon: Target,
    title: "Vision",
    text: "Empowering students with scholarships and resources for academic excellence.",
    dotColor: "bg-pink-100",
    iconColor: "text-pink-600",
  },
  {
    Icon: Rocket,
    title: "Mission",
    text: "To modernize scholarship management and provide seamless opportunities to students.",
    dotColor: "bg-indigo-100",
    iconColor: "text-indigo-600",
  },
  {
    Icon: Handshake,
    title: "Values",
    text: "Integrity, Transparency, and Commitment to education for all.",
    dotColor: "bg-teal-100",
    iconColor: "text-teal-600",
  },
  {
    Icon: BookOpen,
    title: "What We Do",
    text: "Manage scholarships, tests, results, and donor engagement efficiently.",
    dotColor: "bg-amber-100",
    iconColor: "text-amber-600",
  },
];

export default function About() {
  return (
    <div className="min-h-screen  py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900">
          About <span className="text-blue-600">Ankur ScholarHub</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
          A modern platform bridging students, donors, and opportunities.
        </p>
      </motion.header>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
        {/* Timeline */}
        <div className="space-y-12">
          {timeline.map((item, idx) => {
            const Icon = item.Icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 0.5 }}
                className="flex items-start gap-4"
              >
                {/* Dot + Line */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center ${item.dotColor} shadow-md`}
                  >
                    <Icon className={`w-7 h-7 ${item.iconColor}`} />
                  </div>
                  {idx < timeline.length - 1 && (
                    <div className="w-px h-20 bg-gray-300 mt-2" />
                  )}
                </div>

                {/* Text */}
                <div className="flex-1 pb-8">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-gray-600 leading-relaxed">{item.text}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Illustration (Desktop) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="hidden lg:flex justify-center"
        >
          <ScholarIllustration />
        </motion.div>
      </div>

      {/* Illustration (Mobile) */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-12 lg:hidden flex justify-center"
      >
        <ScholarIllustration />
      </motion.div>
    </div>
  );
}

/* --------------------------------------------------------------
   SVG Illustration – Students celebrating scholarships
   -------------------------------------------------------------- */
function ScholarIllustration() {
  return (
    <div className="bg-gradient-to-br from-blue-100 to-indigo-200 rounded-3xl p-8 shadow-xl max-w-md w-full">
      <svg
        viewBox="0 0 380 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        aria-labelledby="illustration-title"
      >
        <title id="illustration-title">Students celebrating scholarships</title>

        {/* Background blobs */}
        <path
          d="M50 100c-30 0-50-40-20-70 30-30 80 0 80 40s-30 70-60 30z"
          fill="#C3DAFE"
        />
        <path
          d="M320 180c20 0 40-30 30-60-10-30-50-40-70-20-20 20-10 60 40 80z"
          fill="#E0E7FF"
        />

        {/* Student 1 – holding trophy */}
        <g transform="translate(80,80)">
          <circle cx="0" cy="0" r="30" fill="#FDBCB4" />
          <path d="M-20 30h40v80h-40z" fill="#4A90E2" />
          <circle cx="-10" cy="-10" r="5" fill="#FFF" />
          <circle cx="10" cy="-10" r="5" fill="#FFF" />
          <path d="M-15 10c0 8 30 8 30 0" stroke="#333" strokeWidth="2" fill="none" />
          <path d="M-35 110h70" stroke="#333" strokeWidth="3" />
          <path d="M-15 130h30l-10 30h-10z" fill="#FDBCB4" />
        </g>

        {/* Trophy */}
        <g transform="translate(100,40)">
          <path
            d="M0 0v30h-15a15 15 0 0 1-15-15h60a15 15 0 0 1-15 15h-15v-30z"
            fill="#FFD700"
          />
          <rect x="-20" y="-10" width="40" height="20" rx="5" fill="#FFA500" />
          <text
            x="0"
            y="55"
            fontFamily="Arial, sans-serif"
            fontSize="14"
            fill="#333"
            textAnchor="middle"
          >
            1st
          </text>
        </g>

        {/* Student 2 – graduation cap */}
        <g transform="translate(220,90)">
          <circle cx="0" cy="0" r="30" fill="#A0C4FF" />
          <path d="M-20 30h40v80h-40z" fill="#50C878" />
          <circle cx="-10" cy="-10" r="5" fill="#FFF" />
          <circle cx="10" cy="-10" r="5" fill="#FFF" />
          <path d="M-15 10c0 8 30 8 30 0" stroke="#333" strokeWidth="2" fill="none" />
          <path d="M-35 110h70" stroke="#333" strokeWidth="3" />
          <path d="M-15 130h30l-10 30h-10z" fill="#A0C4FF" />
          {/* Graduation cap */}
          <path
            d="M-25 -40h50l-10-20h-30z"
            fill="#333"
            transform="translate(0,-10)"
          />
          <rect x="-5" y="-55" width="10" height="15" fill="#333" />
        </g>

        {/* Confetti */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const x = 190 + 120 * Math.cos(angle);
          const y = 140 + 120 * Math.sin(angle);
          const hue = (i * 37) % 360;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={4 + (i % 3)}
              fill={`hsl(${hue}, 80%, 60%)`}
            />
          );
        })}
      </svg>
    </div>
  );
}