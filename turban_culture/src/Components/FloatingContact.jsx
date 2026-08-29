import { useState } from "react";
import { FiMessageCircle } from "react-icons/fi";

export default function FloatingContact() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* BACKDROP */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/20 z-[9998] backdrop-blur-[2px]"
        />
      )}

      {/* CONTAINER */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col items-end gap-3">
        {/* SLIDE UP MENU */}
        <div
          className={`flex flex-col gap-2.5 transition-all duration-300 ease-out ${
            open
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0 pointer-events-none"
          }`}
        >
          {/* Instagram */}
          <a
            href="https://instagram.com/turbanculture.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-white rounded-full pl-2 pr-5 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.15)] border border-black/5 hover:scale-105 transition-transform"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#515bd4] flex items-center justify-center text-white">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.9.3 2.3.5.6.2 1.4.4 1.8.8.4.4.6.8.8 1.4.2.4.4 1.1.5 2.3.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.9-.5 2.3-.2.6-.4 1-.8 1.4-.4.4-.8.6-1.4.8-.4.2-1.1.4-2.3.5-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.9-.3-2.3-.5-.6-.2-1-.4-1.4-.8-.4-.4-.6-.8-.8-1.4-.2-.4-.4-1.1-.5-2.3C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.9.5-2.3.2-.6.4-1.8.8-1.4.4-.4.8-.6 1.4-.8.4-.2 1.1-.4 2.3-.5C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.4 0-4.7.1-1.1.1-1.6.2-1.9.4-.5.2-.8.4-1.1.7-.3.3-.5.6-.7 1.1-.2.3-.3.9-.4 1.9C3.2 8.6 3.2 8.9 3.2 12s0 3.4.1 4.7c.1 1.2.2 1.6.4 1.9.2.5.4.8.7 1.1.3.3.6.5 1.1.7.3.2.9.3 1.9.4 1.3.1 1.6.1 4.7.1s3.4 0 4.7-.1c1-.1 1.6-.2 1.9-.4.5-.2.8-.4 1.1-.7.3-.3.5-.6.7-1.1.2-.3.3-.9.4-1.9.1-1.3.1-1.6.1-4.7s0-3.4-.1-4.7c-.1-1-.2-1.6-.4-1.9-.2-.5-.4-.8-.7-1.1-.3-.3-.6-.5-1.1-.7-.3-.2-.9-.3-1.9-.4-1.2-.1-1.6-.1-4.7-.1zm0 3.9a4.1 4.1 0 100 8.2 4.1 4.1 0 000-8.2zm0 6.4a2.3 2.3 0 110-4.6 2.3 2.3 0 010 4.6zm5.2-6.6a1 1 0 11-2 0 1 1 0 012 0z" />
              </svg>
            </div>

            <span className="text-[13px] font-bold text-[#222]">
              Instagram
            </span>
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/919350517309"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-white rounded-full pl-2 pr-5 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.15)] border border-black/5 hover:scale-105 transition-transform"
          >
            <div className="w-9 h-9 rounded-full bg-[#25D366] flex items-center justify-center text-white">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19.05 4.91A9.82 9.82 0 0012.04 2C6.55 2 2.09 6.45 2.09 11.93c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.82 9.82 0 004.79 1.22h.01c5.49 0 9.95-4.45 9.95-9.93 0-2.65-1.03-5.14-2.95-7zM12.05 20c-1.49 0-2.95-.4-4.22-1.15l-.3-.18-3.12.82.83-3.04-.2-.31A8.1 8.1 0 013.9 11.93C3.9 7.45 7.56 3.8 12.04 3.8a7.9 7.9 0 015.6 2.31 7.85 7.85 0 012.3 5.6c0 4.48-3.66 8.13-8.14 8.29h-.01zm4.52-6.08c-.25-.12-1.46-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.22-1.45-1.36-1.69-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.4-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.84-.86 2.05s.88 2.38 1 2.55c.12.17 1.73 2.64 4.19 3.7.59.25 1.05.4 1.4.51.59.19 1.12.16 1.54.1.47-.07 1.46-.6 1.66-1.17.2-.58.2-1.07.14-1.17-.06-.11-.23-.17-.47-.29z" />
              </svg>
            </div>

            <span className="text-[13px] font-bold text-[#222]">
              WhatsApp
            </span>
          </a>
        </div>

        {/* MAIN CONTACT BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close contact menu" : "Open contact menu"}
          className={`group relative w-[56px] h-[56px] rounded-full bg-white text-[#16a34a] border border-black/10 shadow-[0_8px_24px_rgba(0,0,0,0.18)] flex items-center justify-center transition-all duration-300 active:scale-95 hover:scale-110 ${
            !open ? "animate-[bounce_2s_ease-in-out_infinite]" : ""
          }`}
        >
          {/* GREEN PULSE RING */}
          {!open && (
            <>
              <span className="absolute inset-0 rounded-full border-2 border-[#22c55e] animate-ping opacity-25" />
              <span className="absolute -inset-1 rounded-full border border-[#22c55e]/20 animate-pulse" />
            </>
          )}

          {/* ICON */}
          <span
            className={`relative z-10 transition-transform duration-300 ${
              open
                ? "rotate-90"
                : "rotate-0 group-hover:rotate-[-8deg]"
            }`}
          >
            {open ? (
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <FiMessageCircle size={27} strokeWidth={2.2} />
            )}
          </span>
        </button>
      </div>

      {/* CUSTOM BOUNCE ANIMATION */}
      <style jsx>{`
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-5px);
          }
        }
      `}</style>
    </>
  );
}