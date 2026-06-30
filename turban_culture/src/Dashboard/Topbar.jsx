import { Bell, User, Calendar, ChevronDown } from "lucide-react";

const Topbar = () => (
  <div className="flex items-center justify-between px-7 py-4 bg-white border-b border-gray-100 sticky top-0 z-10">
    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

    <div className="flex items-center gap-3">
      {/* Date Range */}
      <button className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-600 hover:border-[#b07d2a]/40 transition-colors bg-white">
        <span>May 20, 2024 – Jun 20, 2024</span>
        <Calendar size={15} className="text-gray-400" />
      </button>

      {/* Bell */}
      <button className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:border-[#b07d2a]/40 transition-colors">
        <Bell size={18} className="text-gray-500" />
      </button>

      {/* Profile */}
      <button className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:border-[#b07d2a]/40 transition-colors">
        <User size={18} className="text-gray-500" />
      </button>
    </div>
  </div>
);

export default Topbar;
