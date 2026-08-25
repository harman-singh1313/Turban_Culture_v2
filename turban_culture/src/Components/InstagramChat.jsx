import React, { useEffect, useState } from "react";
import { FaInstagram } from "react-icons/fa";

const InstagramChat = () => {
    const [showInstagram, setShowInstagram] = useState(false);

    const instagramUrl = "https://instagram.com/turbanculture.in";

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowInstagram(true);
        }, 6000);

        return () => clearTimeout(timer);
    }, []);

    if (!showInstagram) return null;

    return (
        <div className="fixed bottom-66 left-6 z-50">
            <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Instagram"
                className="relative flex items-center justify-center bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition"
            >
                <FaInstagram size={28} />

                <span className="absolute inset-0 rounded-full animate-ping bg-pink-400 opacity-30"></span>
            </a>
        </div>
    );
};

export default InstagramChat;