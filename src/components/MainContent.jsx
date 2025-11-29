import React from "react";
import { Heart, ArrowRight, Quote, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
const MainContent = () => {
  const Navigate = useNavigate();
  const handleDonateClick = () => {
    Navigate("/donate");
    // alert(
    //   "Thank you for your interest in donating! Redirecting to the donation page..."
    // );
    // In a real app, redirect to donation page
  };

  return (
    <div className="lg:col-span-3 space-y-6">
      {/* CTA Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:shadow-xl transition shadow-lg"
          onClick={handleDonateClick}
        >
          <Heart className="w-6 h-6" />
          Donate Now
        </button>
        <button className="bg-gradient-to-r from-green-600 to-green-800 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:shadow-xl transition shadow-lg">
          Get Started
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
      {/* Testimonial heading */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          What Our Supporters Say:
        </h2>
        </div>
      {/* Testimonial 1 */}
      <TestimonialCard
        quote="Ankur Vidyarthi gave me wings. From a small village to IIT — all because of their support."
        author="Priya M."
        role="IIT Bombay, 2025"
        rating={5}
      />

      {/* Testimonial 2 */}
      <TestimonialCard
        quote="I donated once. Now I see my money turning into futures. This is real impact."
        author="Sanjay K."
        role="Donor since 2022"
        rating={5}
      />

      {/* Testimonial 3 */}
      <TestimonialCard
        quote="Transparent, accountable, and life-changing. Proud to be part of this family."
        author="Asha R."
        role="Volunteer"
        rating={5}
      />
    </div>
  );
};
const TestimonialCard = ({ quote, author, role, rating }) => (
  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-xl shadow-md border border-blue-100">
    <Quote className="w-8 h-8 text-blue-600 mb-3" />
    <p className="text-gray-700 italic leading-relaxed mb-4">"{quote}"</p>
    <div className="flex items-center justify-between">
      <div>
        <p className="font-bold text-blue-900">{author}</p>
        <p className="text-sm text-gray-600">{role}</p>
      </div>
      <div className="flex gap-1">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
    </div>
  </div>
);
export default MainContent;
