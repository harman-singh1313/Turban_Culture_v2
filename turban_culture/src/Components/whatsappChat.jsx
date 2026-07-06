import React, { useState, useEffect } from "react";
import { IoLogoWhatsapp } from "react-icons/io";

const WhatsappChat = () => {
    const [showBubble, setShowBubble] = useState(false);

    const phone = "9350517309";

    const message =
        "Sat Sri Akal Ji, I want information about Turban Styling Service.";

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowBubble(true);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {/* Popup Bubble */}
            {showBubble && (
                <div className="fixed bottom-24 right-4 z-40 bg-white px-3 py-2 rounded-xl shadow-xl w-[160px] sm:w-[220px] text-[11px] sm:text-sm leading-snug">
                    Need a <b>Turban Artist</b> for your wedding?

                    <a
                        href={`https://wa.me/${phone}?text=${encodeURIComponent(message)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      className="block mt-2 text-center bg-green-500 text-white py-1.5 sm:py-2 rounded-lg font-semibold text-[11px] sm:text-sm hover:scale-105 transition" 
                    >
                        Chat on WhatsApp
                    </a>
                </div>
            )}

            {/* Floating Button */}
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={() => setShowBubble((prev) => !prev)}
                    className="relative bg-green-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition"
                >
                    <IoLogoWhatsapp size={28} />

                    {/* Pulse Ring */}
                    <span className="absolute inset-0 rounded-full animate-ping bg-green-400 opacity-30"></span>
                </button>
            </div>
        </>
    );
};

export default WhatsappChat;