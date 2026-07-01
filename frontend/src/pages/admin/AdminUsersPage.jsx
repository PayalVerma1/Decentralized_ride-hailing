import { motion } from "framer-motion";
import { Users, Search, MoreVertical, Shield, Ban } from "lucide-react";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";

const users = [
  {
    id: "U-001",
    name: "Emma Watson",
    email: "emma@email.com",
    role: "passenger",
    rides: 47,
    joined: "Jan 2026",
    status: "active",
  },
  {
    id: "U-002",
    name: "James Lee",
    email: "james@email.com",
    role: "passenger",
    rides: 23,
    joined: "Feb 2026",
    status: "active",
  },
  {
    id: "U-003",
    name: "Sofia Rodriguez",
    email: "sofia@email.com",
    role: "driver",
    rides: 156,
    joined: "Dec 2025",
    status: "active",
  },
  {
    id: "U-004",
    name: "Mike Thompson",
    email: "mike@email.com",
    role: "passenger",
    rides: 8,
    joined: "May 2026",
    status: "suspended",
  },
  {
    id: "U-005",
    name: "Lisa Chen",
    email: "lisa@email.com",
    role: "driver",
    rides: 203,
    joined: "Nov 2025",
    status: "active",
  },
];

export default function AdminUsersPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-display font-bold text-text">Users</h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/50 border border-border">
            <Search className="w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search users..."
              className="bg-transparent text-sm text-text placeholder:text-muted/50 outline-none"
            />
          </div>
        </div>
      </div>

      <Card padding="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-5 text-muted font-medium">
                  User
                </th>
                <th className="text-left py-3 px-5 text-muted font-medium hidden sm:table-cell">
                  Role
                </th>
                <th className="text-left py-3 px-5 text-muted font-medium hidden md:table-cell">
                  Rides
                </th>
                <th className="text-left py-3 px-5 text-muted font-medium hidden lg:table-cell">
                  Joined
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
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-border/50 hover:bg-secondary/20 transition-colors"
                >
                  <td className="py-3 px-5">
                    <div>
                      <p className="font-medium text-text">{user.name}</p>
                      <p className="text-xs text-muted">{user.email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-5 hidden sm:table-cell">
                    <Badge
                      variant={user.role === "driver" ? "primary" : "default"}
                    >
                      {user.role}
                    </Badge>
                  </td>
                  <td className="py-3 px-5 text-text hidden md:table-cell">
                    {user.rides}
                  </td>
                  <td className="py-3 px-5 text-muted hidden lg:table-cell">
                    {user.joined}
                  </td>
                  <td className="py-3 px-5">
                    <Badge
                      variant={user.status === "active" ? "success" : "danger"}
                      dot
                    >
                      {user.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-5 text-right">
                    <button className="p-1 rounded-lg hover:bg-secondary/50 text-muted hover:text-text transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
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
