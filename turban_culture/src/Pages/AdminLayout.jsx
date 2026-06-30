import { useState } from "react";
import { Outlet } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import Sidebar from "../Dashboard/Sidebar";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="md:hidden flex items-center justify-between bg-white px-4 py-3 shadow">
        <h1 className="font-semibold text-lg">Admin Panel</h1>

        <button onClick={() => setSidebarOpen(true)} className="text-2xl">
          <HiMenu />
        </button>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`
        fixed top-0 left-0 h-screen w-64 bg-white z-50 shadow-lg
        transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}>
        <div className="md:hidden flex justify-end p-4">
          <button onClick={() => setSidebarOpen(false)} className="text-2xl">
            <HiX />
          </button>
        </div>

        <Sidebar />
      </div>

      <div className="md:ml-64 p-4 md:p-6">
        <Outlet />
      </div>

    </div>
  );
};

export default AdminLayout;