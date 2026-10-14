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
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const chartData = {
    labels: months,

    datasets: [
      {
        label: "Bookings",
        data: data.length ? data : Array(12).fill(0),

        borderColor: "#b07d2a",
        backgroundColor: "rgba(176,125,42,0.2)",

        tension: 0.4,

        pointRadius: 3,
        pointHoverRadius: 5,

        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    interaction: {
      mode: "index",
      intersect: false,
    },

    plugins: {
      legend: {
        display: true,
        position: "top",

        labels: {
          boxWidth: 28,
          boxHeight: 10,
          padding: 12,
          font: {
            size: 11,
          },
        },
      },

      tooltip: {
        enabled: true,
      },
    },

    scales: {
      x: {
        grid: {
          display: true,
        },

        ticks: {
          autoSkip: true,
          maxTicksLimit: 12,
          font: {
            size: 10,
          },
        },
      },

      y: {
        beginAtZero: true,

        ticks: {
          precision: 0,
          font: {
            size: 10,
          },
        },
      },
    },
  };

  return (
    <div
      className="
        w-full
        min-w-0
        rounded-2xl
        border
        border-gray-200
        bg-white
        p-4
        sm:p-5
        lg:p-6
      "
    >
      {/* Heading */}
      <h2
        className="
          mb-4
          text-base
          font-bold
          text-gray-900
          sm:text-lg
          lg:text-xl
        "
      >
        Revenue Overview
      </h2>

      {/* Chart */}
      {data.length ? (
        <div
          className="
            relative
            h-[250px]
            w-full
            min-w-0
            sm:h-[300px]
            lg:h-[320px]
          "
        >
          <Line
            data={chartData}
            options={options}
          />
        </div>
      ) : (
        <div
          className="
            flex
            h-[250px]
            items-center
            justify-center
            text-sm
            text-gray-400
            sm:h-[300px]
          "
        >
          No data available
        </div>
      )}
    </div>
  );
};

export default RevenueChart;