import { motion } from "framer-motion";
import { MapPin, Clock, Filter } from "lucide-react";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";

const rides = [
  {
    id: "RC-001",
    from: "Downtown Station",
    to: "Airport Terminal 2",
    date: "Jun 28, 2026",
    fare: "$24.50",
    status: "completed",
    driver: "Alex M.",
    rating: 5,
  },
  {
    id: "RC-002",
    from: "Home",
    to: "Office Park",
    date: "Jun 27, 2026",
    fare: "$12.00",
    status: "completed",
    driver: "Sarah K.",
    rating: 4,
  },
  {
    id: "RC-003",
    from: "Mall Plaza",
    to: "University",
    date: "Jun 25, 2026",
    fare: "$8.75",
    status: "completed",
    driver: "Mike R.",
    rating: 5,
  },
  {
    id: "RC-004",
    from: "Hotel Grand",
    to: "Central Station",
    date: "Jun 22, 2026",
    fare: "$15.30",
    status: "cancelled",
    driver: "—",
    rating: 0,
  },
  {
    id: "RC-005",
    from: "Gym",
    to: "Home",
    date: "Jun 20, 2026",
    fare: "$9.25",
    status: "completed",
    driver: "Lisa T.",
    rating: 4,
  },
];

export default function RideHistoryPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-text">
          Ride History
        </h1>
        <Button variant="secondary" size="sm" icon={Filter}>
          Filter
        </Button>
      </div>

      <div className="space-y-3">
        {rides.map((ride) => (
          <Card key={ride.id} hover>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text">
                    {ride.from} → {ride.to}
                  </p>
                  <p className="text-xs text-muted mt-1">
                    {ride.id} · {ride.date} · Driver: {ride.driver}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 sm:text-right">
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
