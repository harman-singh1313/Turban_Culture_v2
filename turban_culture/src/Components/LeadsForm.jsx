import React, { useState } from 'react'
import axios from 'axios'

const LeadsForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        date: "",
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
                date: "",
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
        <div className="w-full max-w-[260px] mx-auto bg-white rounded-2xl shadow-[0_0_25px_rgba(0,0,0,0.12)] hover:shadow-[0_0_35px_rgba(0,0,0,0.18)] hover:-translate-y-0.5 transition-all duration-300 p-4">
            <div className="text-center mb-2">
                <h2 className="text-lg font-bold">
                    Free Consultation
                </h2>

                <p className="text-gray-600 text-xs">
                    Get a quick callback.                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">

                <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-gray-50 rounded-xl px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-orange-400"
                />

                <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-gray-50 rounded-xl px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-orange-400"
                />

                {/* <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full bg-gray-50 rounded-xl px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-orange-400"
                /> */}

                <input
                    type="text"
                    name="location"
                    placeholder="Event Location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full bg-gray-50 rounded-xl px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-orange-400"
                />

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-1.5 text-sm rounded-xl transition"
                >
                    {submitting ? "Submitting..." : "Submit"}
                </button>
            </form>


        </div>
    );
};

export default LeadsForm
