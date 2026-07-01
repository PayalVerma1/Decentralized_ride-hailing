import { motion } from "framer-motion";
import { MapPin, History, Wallet, Gift, TrendingUp, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import StatsCard from "../../components/common/StatsCard";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";

const stats = [
  {
    icon: MapPin,
    label: "Total Rides",
    value: "47",
    change: "+3 this week",
    changeType: "up",
  },
  {
    icon: Wallet,
    label: "Wallet Balance",
    value: "$124.50",
    change: "+$20",
    changeType: "up",
  },
  {
    icon: Gift,
    label: "Reward Points",
    value: "2,340",
    change: "+150 pts",
    changeType: "up",
  },
  {
    icon: Clock,
    label: "Time Saved",
    value: "12h",
    change: "This month",
    changeType: "neutral",
  },
];

const recentRides = [
  {
    id: 1,
    from: "Downtown Station",
    to: "Airport Terminal 2",
    fare: "$24.50",
    status: "completed",
    time: "2h ago",
  },
  {
    id: 2,
    from: "Home",
    to: "Office Park",
    fare: "$12.00",
    status: "completed",
    time: "Yesterday",
  },
  {
    id: 3,
    from: "Mall Plaza",
    to: "University Campus",
    fare: "$8.75",
    status: "completed",
    time: "2 days ago",
  },
];

export default function PassengerDashboard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-text">
            Welcome back 👋
          </h1>
          <p className="text-muted text-sm mt-1">
            Here's what's happening with your rides.
          </p>
        </div>
        <Link to="/passenger/book">
          <Button icon={MapPin}>Book a Ride</Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <StatsCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Recent Rides */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text">Recent Rides</h3>
          <Link
            to="/passenger/history"
            className="text-sm text-primary hover:text-hover transition-colors"
          >
            View all →
          </Link>
        </div>
        <div className="space-y-3">
          {recentRides.map((ride) => (
            <div
              key={ride.id}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text">
                    {ride.from} → {ride.to}
                  </p>
                  <p className="text-xs text-muted">{ride.time}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-text">{ride.fare}</p>
                <span className="text-[10px] font-medium text-success bg-success/10 px-2 py-0.5 rounded-md">
                  {ride.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
