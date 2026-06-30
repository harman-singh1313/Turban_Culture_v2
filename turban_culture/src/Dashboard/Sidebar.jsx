import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  Shirt,
  ShoppingBag,
  Package,
  Users,
  Star,
  Settings,
  BarChart3,
  Bell,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
  },
{
  title: "Bookings",
  path: "/admin/bookings",
  icon: CalendarDays,
},
  {
    title: "Turban Services",
    path: "/admin/services",
    icon: Shirt,
  },
  {
    title: "Gallery Manager",
    path: "/admin/galleryManager",
    icon: ShoppingBag,
  },
  // {
  //   title: "Orders",
  //   path: "/admin/orders",
  //   icon: Package,
  // },
  // {
  //   title: "Customers",
  //   path: "/admin/customers",
  //   icon: Users,
  // },
  // {
  //   title: "Reviews",
  //   path: "/admin/reviews",
  //   icon: Star,
  // },
  // {
  //   title: "Analytics",
  //   path: "/admin/analytics",
  //   icon: BarChart3,
  // },
  // {
  //   title: "Notifications",
  //   path: "/admin/notifications",
  //   icon: Bell,
  // },
  {
    title: "Settings",
    path: "/admin/settings",
    icon: Settings,
  },
];

const Sidebar = () => {
  return (
    <aside
      className="
      w-[280px]
      min-h-screen
      bg-gradient-to-b
      from-[#c9913a]
      to-[#b18236]
      text-white
      flex
      flex-col
      justify-between
      shadow-xl
    "
    >
      {/* Logo */}
      <div>
        <div className="px-6 py-8 border-b border-white/10">
          <h1 className="text-3xl font-bold tracking-wide">
            TURBAN
          </h1>
          <p className="text-xl font-light">
            CULTURE
          </p>
        </div>

        {/* Menu */}
        <div className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.title}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${
                    isActive
                      ? "bg-[#d9a74d] shadow-md"
                      : "hover:bg-white/10"
                  }`
                }
              >
                <Icon size={20} />
                <span className="font-medium">
                  {item.title}
                </span>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Admin Profile */}
      <div className="p-4">
        <div
          className="
          bg-white/10
          backdrop-blur-sm
          rounded-2xl
          p-4
          flex
          items-center
          gap-3
          border
          border-white/20
        "
        >
          <img
            src="https://i.pravatar.cc/100"
            alt="admin"
            className="w-12 h-12 rounded-full"
          />

          <div>
            <h3 className="font-semibold">
              Admin
            </h3>

            <p className="text-sm text-white/80">
              admin@turbanculture.com
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;