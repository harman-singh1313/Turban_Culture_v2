import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Sidebar from "../Dashboard/Sidebar";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">

      {/* MOBILE ADMIN HEADER */}
      <div
        className="
          lg:hidden
          sticky
          top-0
          z-30
          flex
          items-center
          justify-between
          h-[64px]
          bg-white
          px-5
          border-b
          border-gray-200
          shadow-sm
        "
      >
        <h1 className="text-lg font-bold text-gray-900">
          Admin Panel
        </h1>

        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            bg-[#c9913a]
            text-white
            shadow-md
          "
        >
          <Menu size={24} />
        </button>
      </div>

      {/* MOBILE OVERLAY */}
      <div
        onClick={() => setSidebarOpen(false)}
        className={`
          fixed
          inset-0
          z-40
          bg-black/50
          transition-opacity
          duration-300
          lg:hidden

          ${
            sidebarOpen
              ? "visible opacity-100"
              : "invisible opacity-0"
          }
        `}
      />

      {/* SIDEBAR */}
      <div
        className={`
          fixed
          left-0
          top-0
          z-50
          h-[100dvh]
          w-[280px]
          max-w-[85vw]

          transform
          transition-transform
          duration-300
          ease-in-out

          lg:translate-x-0

          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* MOBILE CLOSE */}
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="
            absolute
            right-4
            top-4
            z-[70]
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            bg-white/15
            text-white
            lg:hidden
          "
        >
          <X size={23} />
        </button>

        <Sidebar
          onNavigate={() => setSidebarOpen(false)}
        />
      </div>

      {/* MAIN CONTENT */}
      <div
        className="
          min-h-screen
          min-w-0
          lg:ml-[280px]
        "
      >
        <Outlet />
      </div>

    </div>
  );
};

export default AdminLayout;