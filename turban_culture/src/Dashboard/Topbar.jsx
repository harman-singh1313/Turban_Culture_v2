import { Bell, User, Calendar } from "lucide-react";

const Topbar = () => {
  return (
    <div
      className="
        sticky top-0 z-20
        flex items-center justify-between
        border-b border-gray-100
        bg-white
        px-4 py-3
        sm:px-5
        lg:px-7 lg:py-4
      "
    >
      {/* Page Title */}
      <div className="min-w-0 pl-14 lg:pl-0">
        <h1
          className="
            truncate
            text-lg font-bold text-gray-900
            sm:text-xl
            lg:text-2xl
          "
        >
          Dashboard
        </h1>
      </div>

      {/* Right Side */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">

        {/* Date Range - Desktop */}
        <button
          type="button"
          className="
            hidden
            md:flex
            items-center
            gap-2
            rounded-xl
            border border-gray-200
            bg-white
            px-4 py-2
            text-sm text-gray-600
            transition-colors
            hover:border-[#b07d2a]/40
          "
        >
          <span>
            May 20, 2024 – Jun 20, 2024
          </span>

          <Calendar
            size={15}
            className="text-gray-400"
          />
        </button>

        {/* Calendar - Mobile */}
        <button
          type="button"
          aria-label="Date range"
          className="
            flex
            h-9 w-9
            items-center justify-center
            rounded-xl
            border border-gray-200
            bg-white
            transition-colors
            hover:border-[#b07d2a]/40
            md:hidden
          "
        >
          <Calendar
            size={17}
            className="text-gray-500"
          />
        </button>

        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications"
          className="
            flex
            h-9 w-9
            items-center justify-center
            rounded-xl
            border border-gray-200
            bg-white
            transition-colors
            hover:border-[#b07d2a]/40
            sm:h-10 sm:w-10
          "
        >
          <Bell
            size={18}
            className="text-gray-500"
          />
        </button>

        {/* Profile */}
        <button
          type="button"
          aria-label="Admin profile"
          className="
            flex
            h-9 w-9
            items-center justify-center
            rounded-xl
            border border-gray-200
            bg-white
            transition-colors
            hover:border-[#b07d2a]/40
            sm:h-10 sm:w-10
          "
        >
          <User
            size={18}
            className="text-gray-500"
          />
        </button>

      </div>
    </div>
  );
};

export default Topbar;