import { useEffect, useState } from "react";
import axios from "axios";

import Topbar from "../Topbar";
import StatsCards from "../StatsCards";
import RevenueChart from "../RevenueChart";
import RecentBookings from "../RecentBookings";
import RecentLeads from "../RecentLeads.jsx";
import ServicesList from "../ServicesList";
import ProductsList from "../ProductsList";
import QuickActions from "../QuickActions";

const API_URL =
  import.meta.env.VITE_API_URL || "http://3.27.155.171:5000";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/dashboard/stats`
        );

        setData(res.data);
      } catch (err) {
        console.log("Dashboard Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div
        className="
          flex
          min-h-[60vh]
          items-center
          justify-center
          bg-gray-50
        "
      >
        <div className="text-center">
          <div
            className="
              mx-auto
              mb-3
              h-9
              w-9
              animate-spin
              rounded-full
              border-4
              border-[#c9913a]/20
              border-t-[#c9913a]
            "
          />

          <p className="text-sm text-gray-500">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen min-w-0 bg-gray-50">

      {/* ================= TOP BAR ================= */}

      <Topbar />

      {/* ================= DASHBOARD CONTENT ================= */}

      <main
        className="
          w-full
          min-w-0
          space-y-4
          p-3

          sm:space-y-5
          sm:p-4

          md:p-5

          lg:p-6
        "
      >
        {/* ================= STATS ================= */}

        <StatsCards data={data?.stats} />

        {/* ================= CHART + BOOKINGS ================= */}

        <div
          className="
            grid
            min-w-0
            grid-cols-1
            gap-4

            lg:grid-cols-5
            lg:gap-5
          "
        >
          {/* Revenue Chart */}
          <div className="min-w-0 lg:col-span-3">
            <RevenueChart
              data={data?.monthly || []}
            />
          </div>

          {/* Recent Bookings */}
          <div className="min-w-0 lg:col-span-2">
            <RecentBookings />
          </div>
        </div>

        {/* ================= LEADS + SERVICES ================= */}

        <div
          className="
            grid
            min-w-0
            grid-cols-1
            gap-4

            lg:grid-cols-2
            lg:gap-5
          "
        >
          <div className="min-w-0">
            <RecentLeads />
          </div>

          <div className="min-w-0">
            <ServicesList />
          </div>
        </div>

        {/* ================= PRODUCTS ================= */}

        <div className="min-w-0">
          <ProductsList />
        </div>

        {/* ================= QUICK ACTIONS ================= */}

        <div className="min-w-0">
          <QuickActions />
        </div>

      </main>
    </div>
  );
};

export default Dashboard;