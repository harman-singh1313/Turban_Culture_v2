import { Calendar, ShoppingBag, IndianRupee, Users } from "lucide-react";

const StatsCards = ({ data }) => {
  if (!data) return null;

  const cards = [
    {
      title: "Total Bookings",
      value: data.totalBookings,
      icon: Calendar,
    },
    {
      title: "Total Orders",
      value: data.totalOrders,
      icon: ShoppingBag,
    },
    {
      title: "Total Revenue",
      value: `₹${data.totalRevenue}`,
      icon: IndianRupee,
    },
    {
      title: "Total Customers",
      value: data.customers,
      icon: Users,
    },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
      {cards.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: "rgba(176,125,42,0.1)" }}
              >
                <Icon size={26} style={{ color: "#b07d2a" }} />
              </div>

              <div>
                <p className="text-sm text-gray-400">{item.title}</p>
                <h2 className="text-3xl font-bold">{item.value}</h2>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;