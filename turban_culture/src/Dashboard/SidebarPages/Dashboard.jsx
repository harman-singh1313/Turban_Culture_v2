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

const API_URL = import.meta.env.VITE_API_URL || "http://3.27.155.171:5000";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/dashboard/stats`);
        setData(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">

      <div className="flex-1 flex flex-col min-w-0">

        <Topbar />

        <div className="p-6 space-y-5">

          {/* ✅ PASS DATA */}
          <StatsCards data={data?.stats} />

          <div className="grid lg:grid-cols-5 gap-5">

            <div className="lg:col-span-3">
              <RevenueChart data={data?.monthly||[]} />
            </div>

            <div className="lg:col-span-2">
              <RecentBookings />
            </div>

          </div>

          {/* ✅ LEADS */}
          <div className="grid lg:grid-cols-2 gap-5">
            <RecentLeads />
            <ServicesList />
          </div>

          <ProductsList />

          <QuickActions />

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
