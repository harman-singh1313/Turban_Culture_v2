import React from "react";
import { IoLogoWhatsapp } from "react-icons/io";

const WhatsappChat = () => {
    const phone = "9350517309";

    const message =
        "Sat Sri Akal Ji, I want information about Turban Styling Service.";

    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
                className="relative flex items-center justify-center bg-green-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition"
            >
                <IoLogoWhatsapp size={28} />

                {/* Pulse Ring */}
                <span className="absolute inset-0 rounded-full animate-ping bg-green-400 opacity-30"></span>
            </a>
        </div>
    );
};

export default WhatsappChat;