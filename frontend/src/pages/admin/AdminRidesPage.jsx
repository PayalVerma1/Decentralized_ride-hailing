import { motion } from "framer-motion";
import { MapPin, Search, Filter } from "lucide-react";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";

const rides = [
  {
    id: "RC-089",
    passenger: "Emma W.",
    driver: "Alex M.",
    from: "Central Mall",
    to: "Airport",
    fare: "$24.50",
    status: "completed",
    date: "Jun 28",
  },
  {
    id: "RC-088",
    passenger: "James L.",
    driver: "Sofia R.",
    from: "Hotel Plaza",
    to: "University",
    fare: "$11.20",
    status: "completed",
    date: "Jun 28",
  },
  {
    id: "RC-087",
    passenger: "Sofia R.",
    driver: "—",
    from: "Station",
    to: "Park",
    fare: "$15.80",
    status: "cancelled",
    date: "Jun 27",
  },
  {
    id: "RC-086",
    passenger: "Mike T.",
    driver: "Lisa C.",
    from: "Gym",
    to: "Home",
    fare: "$9.25",
    status: "completed",
    date: "Jun 27",
  },
  {
    id: "RC-085",
    passenger: "Anna K.",
    driver: "—",
    from: "Office",
    to: "Mall",
    fare: "$13.00",
    status: "pending",
    date: "Jun 27",
  },
];

export default function AdminRidesPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-display font-bold text-text">Rides</h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/50 border border-border">
            <Search className="w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search rides..."
              className="bg-transparent text-sm text-text placeholder:text-muted/50 outline-none"
            />
          </div>
          <Button variant="secondary" size="sm" icon={Filter}>
            Filter
          </Button>
        </div>
      </div>

      <Card padding="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-5 text-muted font-medium">
                  Ride ID
                </th>
                <th className="text-left py-3 px-5 text-muted font-medium">
                  Route
                </th>
                <th className="text-left py-3 px-5 text-muted font-medium hidden sm:table-cell">
                  Passenger
                </th>
                <th className="text-left py-3 px-5 text-muted font-medium hidden md:table-cell">
                  Driver
                </th>
                <th className="text-left py-3 px-5 text-muted font-medium">
                  Fare
                </th>
                <th className="text-left py-3 px-5 text-muted font-medium">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {rides.map((ride) => (
                <tr
                  key={ride.id}
                  className="border-b border-border/50 hover:bg-secondary/20 transition-colors"
                >
                  <td className="py-3 px-5 font-mono text-muted">{ride.id}</td>
                  <td className="py-3 px-5">
                    <p className="text-text">
                      {ride.from} → {ride.to}
                    </p>
                    <p className="text-xs text-muted">{ride.date}</p>
                  </td>
                  <td className="py-3 px-5 text-text hidden sm:table-cell">
                    {ride.passenger}
                  </td>
                  <td className="py-3 px-5 text-muted hidden md:table-cell">
                    {ride.driver}
                  </td>
                  <td className="py-3 px-5 font-semibold text-text">
                    {ride.fare}
                  </td>
                  <td className="py-3 px-5">
                    <Badge
                      variant={
                        ride.status === "completed"
                          ? "success"
                          : ride.status === "pending"
                            ? "warning"
                            : "danger"
                      }
                      dot
                    >
                      {ride.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  );
}
