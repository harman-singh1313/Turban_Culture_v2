import {
  Calendar,
  ShoppingBag,
  IndianRupee,
  Users,
} from "lucide-react";

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
    <div
      className="
        grid
        grid-cols-2
        gap-3
        sm:gap-4
        xl:grid-cols-4
        xl:gap-5
      "
    >
      {cards.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="
              min-w-0
              rounded-2xl
              border
              border-gray-100
              bg-white
              p-3
              transition-shadow
              hover:shadow-md
              sm:p-4
              lg:p-5
            "
          >
            <div
              className="
                flex
                min-w-0
                items-center
                gap-2.5
                sm:gap-3
                lg:gap-4
              "
            >
              {/* Icon */}
              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  sm:h-12
                  sm:w-12
                  lg:h-14
                  lg:w-14
                "
                style={{
                  background: "rgba(176,125,42,0.1)",
                }}
              >
                <Icon
                  className="
                    h-5
                    w-5
                    sm:h-[22px]
                    sm:w-[22px]
                    lg:h-[26px]
                    lg:w-[26px]
                  "
                  style={{ color: "#b07d2a" }}
                />
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <p
                  className="
                    text-[11px]
                    leading-4
                    text-gray-400
                    sm:text-xs
                    lg:text-sm
                  "
                >
                  {item.title}
                </p>

                <h2
                  className="
                    mt-0.5
                    break-words
                    text-xl
                    font-bold
                    leading-tight
                    text-gray-950
                    sm:text-2xl
                    lg:text-3xl
                  "
                >
                  {item.value}
                </h2>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;