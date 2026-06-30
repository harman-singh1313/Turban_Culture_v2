import { Pencil } from "lucide-react";

const products = [
  { name: "Premium Pagg (Full Voil)", sold: "120 Sold", price: "₹599",  color: "#d4a55a" },
  { name: "Cotton Pagg",              sold: "98 Sold",  price: "₹399",  color: "#3a7d44" },
  { name: "Wattan Wali Pagg",         sold: "75 Sold",  price: "₹699",  color: "#7d3a3a" },
  { name: "Kids Pagg",                sold: "60 Sold",  price: "₹299",  color: "#3a5a8d" },
];

const ProductsList = () => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-base font-bold text-gray-900">Top Selling Products</h2>
      <button className="text-sm font-semibold" style={{ color: "#b07d2a" }}>View All</button>
    </div>

    <div className="space-y-1">
      {products.map((p, i) => (
        <div key={i} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
          {/* Thumbnail */}
          <div
            className="w-11 h-11 rounded-xl flex-shrink-0"
            style={{ background: p.color, opacity: 0.85 }}
          />
          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-gray-900 truncate">{p.name}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{p.sold}</p>
          </div>
          {/* Price */}
          <span className="text-[14px] font-bold text-gray-900 flex-shrink-0">{p.price}</span>
          {/* Edit */}
          <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:border-[#b07d2a]/40 flex-shrink-0 transition-colors">
            <Pencil size={13} className="text-gray-400" />
          </button>
        </div>
      ))}
    </div>
  </div>
);

export default ProductsList;
