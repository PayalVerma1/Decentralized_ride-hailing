import { motion } from "framer-motion";
import { Car, Search, MoreVertical, CheckCircle, Clock } from "lucide-react";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";

const drivers = [
  {
    id: "D-001",
    name: "Alex Morgan",
    email: "alex@email.com",
    vehicle: "Toyota Camry 2023",
    rating: 4.9,
    rides: 312,
    earnings: "$8,420",
    status: "approved",
    online: true,
  },
  {
    id: "D-002",
    name: "Sofia Rodriguez",
    email: "sofia@email.com",
    vehicle: "Honda Civic 2022",
    rating: 4.8,
    rides: 156,
    earnings: "$4,230",
    status: "approved",
    online: true,
  },
  {
    id: "D-003",
    name: "Ryan Park",
    email: "ryan@email.com",
    vehicle: "Tesla Model 3 2024",
    rating: 5.0,
    rides: 89,
    earnings: "$3,100",
    status: "pending",
    online: false,
  },
  {
    id: "D-004",
    name: "Lisa Chen",
    email: "lisa@email.com",
    vehicle: "BMW 5 Series 2023",
    rating: 4.7,
    rides: 203,
    earnings: "$6,890",
    status: "approved",
    online: false,
  },
];

export default function AdminDriversPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-display font-bold text-text">Drivers</h1>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/50 border border-border">
          <Search className="w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search drivers..."
            className="bg-transparent text-sm text-text placeholder:text-muted/50 outline-none"
          />
        </div>
      </div>

      <Card padding="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-5 text-muted font-medium">
                  Driver
                </th>
                <th className="text-left py-3 px-5 text-muted font-medium hidden sm:table-cell">
                  Vehicle
                </th>
                <th className="text-left py-3 px-5 text-muted font-medium hidden md:table-cell">
                  Rating
                </th>
                <th className="text-left py-3 px-5 text-muted font-medium hidden lg:table-cell">
                  Earnings
                </th>
                <th className="text-left py-3 px-5 text-muted font-medium">
                  Status
                </th>
                <th className="text-right py-3 px-5 text-muted font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((d) => (
                <tr
                  key={d.id}
                  className="border-b border-border/50 hover:bg-secondary/20 transition-colors"
                >
                  <td className="py-3 px-5">
                    <div>
                      <p className="font-medium text-text">{d.name}</p>
                      <p className="text-xs text-muted">{d.email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-5 text-muted hidden sm:table-cell">
                    {d.vehicle}
                  </td>
                  <td className="py-3 px-5 hidden md:table-cell">
                    <span className="text-yellow-400">★</span>{" "}
                    <span className="text-text">{d.rating}</span>
                  </td>
                  <td className="py-3 px-5 text-text hidden lg:table-cell">
                    {d.earnings}
                  </td>
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          d.status === "approved" ? "success" : "warning"
                        }
                        dot
                      >
                        {d.status}
                      </Badge>
                      {d.online && (
                        <span className="w-2 h-2 bg-success rounded-full animate-pulse-soft" />
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-5 text-right">
                    {d.status === "pending" ? (
                      <Button size="sm" variant="success">
                        Approve
                      </Button>
                    ) : (
                      <button className="p-1 rounded-lg hover:bg-secondary/50 text-muted hover:text-text transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    )}
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
