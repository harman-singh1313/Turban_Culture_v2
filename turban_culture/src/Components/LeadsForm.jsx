import React, { useState } from "react";
import axios from "axios";
import { User, Phone, MapPin, Sparkles } from "lucide-react";

const LeadsForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/leads`,
        formData
      );

      alert("Thank you! We will contact you soon.");

      setFormData({
        name: "",
        phone: "",
        location: "",
      });
    } catch (error) {
      console.log(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative group w-full max-w-md mx-auto">
      {/* Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 via-orange-500 to-yellow-400 rounded-[24px] blur opacity-15 group-hover:opacity-30 transition duration-500"></div>

      {/* Card */}
      <div className="relative bg-white rounded-[24px] shadow-xl border border-orange-100 p-5 md:p-6 overflow-hidden">
        {/* Decorative Circle */}
        <div className="absolute top-0 right-0 w-28 h-28 bg-orange-100 rounded-full -translate-y-10 translate-x-10 opacity-70"></div>

        {/* Header */}
        <div className="relative text-center mb-5">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white flex items-center justify-center shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Free Consultation
          </h2>

          <p className="text-sm text-gray-600 leading-relaxed">
            Share your wedding or event details and our Turban Artist will call you shortly.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 relative">
          {/* Name */}
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500" />

            <input
              type="text"
              name="name"
              placeholder="Your Full Name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-orange-50/70 border border-orange-100 rounded-xl outline-none text-sm text-gray-800 placeholder-gray-400 focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all duration-300"
            />
          </div>

          {/* Phone */}
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500" />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-orange-50/70 border border-orange-100 rounded-xl outline-none text-sm text-gray-800 placeholder-gray-400 focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all duration-300"
            />
          </div>

          {/* Location */}
          <div className="relative">
            <MapPin className="absolute left-3 top-3 w-4 h-4 text-orange-500" />

            <textarea
              name="location"
              placeholder="Wedding / Event Location"
              rows="2"
              value={formData.location}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-orange-50/70 border border-orange-100 rounded-xl outline-none text-sm text-gray-800 placeholder-gray-400 focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all duration-300 resize-none"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-orange-200 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
          >
            {submitting ? "Submitting..." : "Get Free Callback"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          Usually responds within 15–30 minutes
        </div>
      </div>
    </div>
  );
};

export default LeadsForm;