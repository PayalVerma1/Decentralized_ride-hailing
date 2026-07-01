import { motion } from "framer-motion";
import { Car, MapPin, Clock, DollarSign } from "lucide-react";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";

const rides = [
  {
    id: "RC-089",
    passenger: "Emma W.",
    from: "Central Mall",
    to: "Airport",
    fare: "$24.50",
    status: "completed",
    time: "10:30 AM",
  },
  {
    id: "RC-088",
    passenger: "James L.",
    from: "Hotel Plaza",
    to: "University",
    fare: "$11.20",
    status: "completed",
    time: "9:15 AM",
  },
  {
    id: "RC-087",
    passenger: "Sofia R.",
    from: "Train Station",
    to: "Business Park",
    fare: "$15.80",
    status: "completed",
    time: "8:00 AM",
  },
  {
    id: "RC-086",
    passenger: "Mike T.",
    from: "Gym",
    to: "Home",
    fare: "$9.25",
    status: "cancelled",
    time: "Yesterday",
  },
];

export default function DriverRidesPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <h1 className="text-2xl font-display font-bold text-text">My Rides</h1>
      <div className="space-y-3">
        {rides.map((ride) => (
          <Card key={ride.id} hover>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Car className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text">
                    {ride.id} · {ride.passenger}
                  </p>
                  <p className="text-xs text-muted mt-1">
                    {ride.from} → {ride.to} · {ride.time}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-lg font-display font-bold text-text">
                  {ride.fare}
                </p>
                <Badge
                  variant={ride.status === "completed" ? "success" : "danger"}
                  dot
                >
                  {ride.status}
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
