import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const RevenueChart = ({ data = [] }) => {

  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  const chartData = {
    labels: months,
    datasets: [
      {
        label: "Bookings",
        data: data.length ? data : Array(12).fill(0),
        borderColor: "#b07d2a",
        backgroundColor: "rgba(176,125,42,0.2)",
        tension: 0.4,   // smooth curve
        pointRadius: 4,
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-2xl border h-[350px]">

      <h2 className="font-bold text-xl mb-4">
        Revenue Overview
      </h2>

      {data.length ? (
        <Line data={chartData} />
      ) : (
        <div className="h-[250px] flex items-center justify-center text-gray-400">
          No data available
        </div>
      )}

    </div>
  );
};

export default RevenueChart;