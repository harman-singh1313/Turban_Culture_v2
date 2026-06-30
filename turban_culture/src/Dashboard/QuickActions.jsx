import { PlusCircle, Package, Tag, Image } from "lucide-react";

const actions = [
  { icon: PlusCircle, label: "Add Service" },
  { icon: Package,    label: "Add Product" },
  { icon: Tag,        label: "Add Coupon"  },
  { icon: Image,      label: "Add Banner"  },
];

const QuickActions = () => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5">
    <h2 className="text-base font-bold text-gray-900 mb-4">Quick Actions</h2>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {actions.map(({ icon: Icon, label }) => (
        <button
          key={label}
          className="flex items-center justify-center gap-2 py-3.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:border-[#b07d2a] hover:text-[#b07d2a] hover:bg-[#b07d2a]/05 transition-all duration-150"
        >
          <Icon size={17} />
          {label}
        </button>
      ))}
    </div>
  </div>
);

export default QuickActions;
