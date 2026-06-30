import React, { useState, useEffect } from "react";
import { IoLogoWhatsapp } from "react-icons/io";
import { IoGift } from "react-icons/io5";

const WhatsappChat = () => {
    const [open, setOpen] = useState(false);
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
            {/* Message Bubble */}
            {showBubble && !open && (
                <div className="fixed bottom-30 right-5 z-40 bg-white px-4 py-3 rounded-xl shadow-xl max-w-[250px] animate-bounce">
                    Need a Turban Artist for your wedding?
                </div>
            )}

            {/* Floating Button */}
            <div className="fixed bottom-15 right-8 z-50">
                <button
                    onClick={() => setOpen(!open)}
                    className="relative bg-green-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition"
                >
                    <IoLogoWhatsapp />

                    {/* Notification Badge */}
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs h-5 w-5 flex items-center justify-center rounded-full">
                        1
                    </span>

                    {/* Pulse Ring */}
                    <span className="absolute inset-0 rounded-full animate-ping bg-green-400 opacity-30"></span>
                </button>
            </div>

            {/* Chat Widget */}
            {open && (
                <div className="fixed bottom-24 right-5 z-50 w-[340px] bg-white border-transparent rounded-3xl shadow-2xl overflow-hidden border">

                    {/* Header */}
                    <div className="bg-green-500 text-white p-4 flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-lg">
                                Turban Culture
                            </h3>
                            {/* <p className="text-xs">
                Usually replies within 5 minutes
              </p> */}
                        </div>

                        <button
                            onClick={() => setOpen(false)}
                            className="text-xl"
                        >
                            ×
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-4 bg-gray-50">
                        <div className="bg-white p-3 rounded-2xl shadow text-sm ">

                            <ul>
                                <li>
                                    <p >Sat Sri Akal Ji</p>
                                </li>
                                <li >
                                    <p className=" flex items-center gap-2 text-gray-500">  < IoGift className="text-red-400" />Get FREE Consultation for:</p>
                                </li>
                                <li>
                                    <p className=" text-gray-500 ">  ✔ Groom Turban</p>
                                </li>
                                <li>
                                    <p className=" text-gray-500 ">  ✔ Family Turbans</p>
                                </li>
                                <li>
                                    <p className=" text-gray-500 ">✔ Wedding Styling</p>
                                </li>

                            </ul>
                        </div>

                        <a
                            href={`https://wa.me/${phone}?text=${encodeURIComponent(
                                message
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 block w-full text-center bg-green-500 text-white py-3 rounded-xl font-bold hover:scale-105 transition"
                        >
                            📲 Check Availability
                        </a>

                        <p className="text-center text-xs text-gray-500 mt-3">
                            No advance payment required for inquiry
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};

export default WhatsappChat;