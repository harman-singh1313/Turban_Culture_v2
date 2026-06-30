import { Pencil } from "lucide-react";

const services = [
  { name: "Basic Turban Service",   desc: "Simple and elegant turban style",        price: "₹499",   color: "#d4a55a" },
  { name: "Premium Turban Service", desc: "Premium style with expert handling",      price: "₹799",   color: "#5b8dd4" },
  { name: "Deluxe Turban Service",  desc: "Deluxe turban with accessories",          price: "₹999",   color: "#c0453a" },
  { name: "Royal Turban Service",   desc: "Royal look for special occasions",        price: "₹1,299", color: "#d4c89a" },
];

const ServicesList = () => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-base font-bold text-gray-900">Popular Services</h2>
      <button className="text-sm font-semibold" style={{ color: "#b07d2a" }}>View All</button>
    </div>

    <div className="space-y-1">
      {services.map((s, i) => (
        <div key={i} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
          {/* Thumbnail */}
          <div
            className="w-11 h-11 rounded-xl flex-shrink-0"
            style={{ background: s.color, opacity: 0.85 }}
          />
          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-gray-900 truncate">{s.name}</p>
            <p className="text-[11px] text-gray-400 truncate mt-0.5">{s.desc}</p>
          </div>
          {/* Price */}
          <span className="text-[14px] font-bold text-gray-900 flex-shrink-0">{s.price}</span>
          {/* Edit */}
          <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:border-[#b07d2a]/40 flex-shrink-0 transition-colors">
            <Pencil size={13} className="text-gray-400" />
          </button>
        </div>
      ))}
    </div>
  </div>
);

export default ServicesList;
