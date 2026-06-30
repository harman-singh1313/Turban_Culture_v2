function EventCard({ name, icon, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`py-2.5 px-2 rounded-xl border text-xs font-medium tracking-wide
                  transition-all duration-200 flex flex-col items-center gap-1
                  ${selected
                    ? "border-[#c9913a] bg-[#c9913a]/10 text-[#a07030] shadow-sm -translate-y-0.5"
                    : "border-[#c9913a]/25 bg-[#faf8f5] text-[#888888] hover:border-[#c9913a]/50 hover:text-[#a08060] hover:-translate-y-0.5"
                  }`}
    >
      {icon && <span className="text-lg">{icon}</span>}
      {name}
      {selected && <span className="w-1 h-1 rounded-full bg-[#c9913a] block" />}
    </button>
  );
}

export default EventCard;