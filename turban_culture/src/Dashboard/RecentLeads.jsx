import { useEffect, useState } from "react";
import axios from "axios";

const isToday = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
};

const RecentLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/leads`
        );
        setLeads(res.data.leads || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  const todayCount = leads.filter((l) => isToday(l.createdAt)).length;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">Recent Leads</h3>
        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
          {todayCount} today
        </span>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : leads.length === 0 ? (
        <p className="text-sm text-gray-400">No leads yet.</p>
      ) : (
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {leads.map((lead) => (
            <div
              key={lead._id}
              className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {lead.name}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {lead.phone}
                  {lead.location ? ` • ${lead.location}` : ""}
                </p>
              </div>

              {isToday(lead.createdAt) ? (
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full shrink-0 ml-2">
                  Today
                </span>
              ) : (
                <span className="text-xs text-gray-400 shrink-0 ml-2">
                  {formatDate(lead.createdAt)}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentLeads;
