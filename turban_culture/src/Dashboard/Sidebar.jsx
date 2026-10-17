import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  Shirt,
  ShoppingBag,
  Settings,
  Images,
  Image,
  Video,
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
    title: "Media Manager",
    path: "/admin/MediaManager",
    icon: ShoppingBag,
  },
  {
    title: "Gallery Manager",
    path: "/admin/GalleryManger",
    icon: Images,
  },
  {
    title: "Slider Manager",
    path: "/admin/sliderManager",
    icon: Image,
  },
  {
    title: "Video Manager",
    path: "/admin/videoManager",
    icon: Video,
  },
  {
    title: "Settings",
    path: "/admin/settings",
    icon: Settings,
  },
];

const Sidebar = ({ onNavigate }) => {
  return (
    <aside
      className="
        flex
        h-full
        w-full
        flex-col
        justify-between
        bg-gradient-to-b
        from-[#a0752f]
        to-[#66420a]
        text-white
        shadow-xl
      "
    >
      {/* ================= TOP SECTION ================= */}
      <div className="flex-1 overflow-y-auto">

        {/* Logo */}
        <div className="border-b border-white/10 px-6 py-7">
          <h1 className="text-3xl font-bold tracking-wide">
            TURBAN
          </h1>

          <p className="text-xl font-light">
            CULTURE
          </p>
        </div>

        {/* ================= MENU ================= */}
        <nav className="space-y-2 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.title}
                to={item.path}
                end={item.path === "/admin"}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    px-4
                    py-3
                    transition-all
                    duration-200

                    ${
                      isActive
                        ? "bg-[#d9a74d] shadow-md"
                        : "hover:bg-white/10"
                    }
                  `
                }
              >
                <Icon
                  size={20}
                  className="shrink-0"
                />

                <span className="font-medium">
                  {item.title}
                </span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
