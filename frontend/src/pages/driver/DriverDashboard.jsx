import { motion } from "framer-motion";
import { DollarSign, Car, Star, MapPin, Clock, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import StatsCard from "../../components/common/StatsCard";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";

const stats = [
  {
    icon: DollarSign,
    label: "Today's Earnings",
    value: "$127.50",
    change: "+12%",
    changeType: "up",
  },
  {
    icon: Car,
    label: "Rides Today",
    value: "8",
    change: "+2",
    changeType: "up",
  },
  {
    icon: Star,
    label: "Rating",
    value: "4.9",
    change: "Top 5%",
    changeType: "up",
  },
  {
    icon: Clock,
    label: "Online Hours",
    value: "6.5h",
    change: "Today",
    changeType: "neutral",
  },
];

const rideRequests = [
  {
    id: "RC-101",
    passenger: "Emma W.",
    from: "Central Mall",
    to: "Airport",
    distance: "12.3 km",
    fare: "$22.50",
    eta: "4 min",
  },
  {
    id: "RC-102",
    passenger: "James L.",
    from: "Hotel Plaza",
    to: "University",
    distance: "5.8 km",
    fare: "$11.20",
    eta: "2 min",
  },
];

export default function DriverDashboard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-text">
            Driver Dashboard
          </h1>
          <p className="text-muted text-sm mt-1">
            Welcome back! Here's your overview.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="success" dot>
            Online
          </Badge>
          <Button size="sm" variant="secondary">
            Go Offline
          </Button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatsCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Ride Requests */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text">
            Incoming Ride Requests
          </h3>
          <Badge variant="primary" dot>
            {rideRequests.length} pending
          </Badge>
        </div>
        {rideRequests.length === 0 ? (
          <p className="text-sm text-muted py-8 text-center">
            No ride requests at the moment.
          </p>
        ) : (
          <div className="space-y-3">
            {rideRequests.map((req) => (
              <div
                key={req.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-secondary/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text">
                      {req.passenger} · {req.from} → {req.to}
                    </p>
                    <p className="text-xs text-muted">
                      {req.distance} · {req.eta} away · {req.id}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-display font-bold text-text">
                    {req.fare}
                  </span>
                  <Button size="sm" variant="success">
                    Accept
                  </Button>
                  <Button size="sm" variant="ghost">
                    Decline
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </motion.div>
  );
}
