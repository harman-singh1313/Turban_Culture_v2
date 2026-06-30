import { RiMoneyRupeeCircleLine } from "react-icons/ri";

const themes = {
  silver: {
    card: "bg-gradient-to-br from-[#faf9f6] to-[#ede8e0]",
    shadow: "shadow-[0_4px_24px_rgba(120,107,94,0.13)] hover:shadow-[0_16px_40px_rgba(120,107,94,0.22)]",
    badge: "bg-[#786b5e]/10 text-[#786b5e]",
    name: "text-[#3d3229]",
    desc: "text-[#9a8878]",
    divider: "via-[#c9b99a]",
    dot: "bg-[#a08060]",
    feat: "text-[#786b5e]",
    rupee: "text-[#a08060]",
    price: "text-[#3d3229]",
    sub: "text-[#b0a090]",
    btn: "from-[#786b5e] to-[#5a4e44] shadow-[0_4px_14px_rgba(90,78,68,0.3)]",
    blob: "bg-[#c9b99a]",
  },
  gold: {
    card: "bg-gradient-to-br from-[#fffbef] to-[#fdefc5]",
    shadow: "shadow-[0_4px_24px_rgba(180,140,30,0.15)] hover:shadow-[0_16px_40px_rgba(180,140,30,0.28)]",
    badge: "bg-[#b8860b]/10 text-[#a07820]",
    name: "text-[#5a3d00]",
    desc: "text-[#8a6820]",
    divider: "via-[#d4a017]",
    dot: "bg-[#c8940a]",
    feat: "text-[#7a5010]",
    rupee: "text-[#b8860b]",
    price: "text-[#5a3d00]",
    sub: "text-[#a07830]",
    btn: "from-[#c8940a] to-[#a07010] shadow-[0_4px_14px_rgba(180,130,10,0.35)]",
    blob: "bg-[#f0c040]",
  },
  platinum: {
    card: "bg-gradient-to-br from-[#1a1a2e] to-[#16213e]",
    shadow: "shadow-[0_4px_24px_rgba(10,10,30,0.35)] hover:shadow-[0_20px_48px_rgba(10,10,30,0.5)]",
    badge: "bg-[#8b5cf6]/20 text-[#a78bfa]",
    name: "text-[#f1f5f9]",
    desc: "text-[#94a3b8]",
    divider: "via-[#6d28d9]",
    dot: "bg-[#8b5cf6]",
    feat: "text-[#cbd5e1]",
    rupee: "text-[#a78bfa]",
    price: "text-[#f8fafc]",
    sub: "text-[#64748b]",
    btn: "from-[#7c3aed] to-[#4f46e5] shadow-[0_4px_18px_rgba(124,58,237,0.45)]",
    blob: "bg-[#8b5cf6]",
  },
};

const PackagesCard = ({ badge, icon, name, desc, features, price, popular, theme, onBook }) => {
const t = themes[theme] || themes["silver"];

  return (
    <div
      className={`relative w-full sm:w-72 rounded-3xl p-6 overflow-hidden
      border border-white/30 ${t.card} ${t.shadow}
      transition-all duration-300 hover:-translate-y-3
      hover:scale-[1.03] flex flex-col`}
    >
      {popular && (
        <div className="absolute top-4 -left-7 bg-gradient-to-r from-[#c8940a] to-[#f0c040]
          text-white text-[9px] font-bold tracking-widest uppercase
          py-1 px-8 -rotate-45 z-10 shadow-md">
          Popular
        </div>
      )}

      <div className={`absolute rounded-full blur-3xl opacity-20 w-32 h-32 top-[-30px] right-[-20px] pointer-events-none ${t.blob}`} />

      <div className="absolute top-4 right-4 text-3xl opacity-20 transition-all duration-300 hover:opacity-40 hover:rotate-12">
        {icon}
      </div>

      <span className={`inline-block text-[10px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-3 ${t.badge}`}>
        {badge}
      </span>

      <h2 className={`font-serif text-2xl font-bold leading-tight mb-2 ${t.name}`}>
        {name}
      </h2>

      <p className={`text-[11.5px] leading-relaxed mb-4 ${t.desc}`}>
        {desc}
      </p>

      <div className={`h-px bg-gradient-to-r from-transparent ${t.divider} to-transparent mb-4`} />

      {/* flex-1 — yeh features section stretch karega taaki button hamesha neeche rahe */}
      <ul className="flex flex-col gap-2 mb-5 flex-1">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 text-[12px]">
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${t.dot}`} />
            <span className={t.feat}>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="flex items-baseline gap-1 mb-5">
        <RiMoneyRupeeCircleLine className={`text-lg ${t.rupee}`} />
        <span className={`font-serif text-3xl font-bold ${t.price}`}>₹{price}</span>
        <span className={`text-[10px] ${t.sub}`}>onwards</span>
      </div>

      {onBook && (
        <button
          onClick={() => onBook({ badge, icon, name, desc, features, price, popular, theme })}
          className={`w-full py-3 rounded-2xl text-white text-[13px]
          font-semibold bg-gradient-to-br ${t.btn}
          transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]`}
        >
          Book Now
        </button>
      )}
    </div>
  );
};

export default PackagesCard;