import { motion } from "framer-motion";
import {
  Bell,
  Car,
  DollarSign,
  Gift,
  Shield,
  CheckCircle,
  Trash2,
} from "lucide-react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";

const notifications = [
  {
    id: 1,
    icon: Car,
    title: "Ride Completed",
    message: "Your ride to Airport Terminal 2 has been completed. Fare: $24.50",
    time: "2 hours ago",
    read: false,
    type: "success",
  },
  {
    id: 2,
    icon: DollarSign,
    title: "Payment Processed",
    message: "$50.00 has been added to your wallet.",
    time: "3 hours ago",
    read: false,
    type: "primary",
  },
  {
    id: 3,
    icon: Gift,
    title: "Reward Earned!",
    message: "You earned 150 reward points for your recent ride.",
    time: "Yesterday",
    read: true,
    type: "warning",
  },
  {
    id: 4,
    icon: Shield,
    title: "Security Alert",
    message: "Your account was accessed from a new device.",
    time: "2 days ago",
    read: true,
    type: "danger",
  },
  {
    id: 5,
    icon: Car,
    title: "Driver Arriving",
    message: "Your driver Alex M. is 3 minutes away.",
    time: "3 days ago",
    read: true,
    type: "success",
  },
];

export default function NotificationsPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-text">
          Notifications
        </h1>
        <Button size="sm" variant="ghost">
          Mark all read
        </Button>
      </div>

      <div className="space-y-2">
        {notifications.map((notif) => (
          <Card
            key={notif.id}
            hover
            className={`transition-all ${!notif.read ? "border-primary/20" : ""}`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  notif.type === "success"
                    ? "bg-success/10 text-success"
                    : notif.type === "primary"
                      ? "bg-primary/10 text-primary"
                      : notif.type === "warning"
                        ? "bg-yellow-400/10 text-yellow-400"
                        : "bg-danger/10 text-danger"
                }`}
              >
                <notif.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-text">{notif.title}</p>
                  {!notif.read && (
                    <span className="w-2 h-2 bg-primary rounded-full" />
                  )}
                </div>
                <p className="text-sm text-muted mt-0.5 line-clamp-2">
                  {notif.message}
                </p>
                <p className="text-xs text-muted/60 mt-2">{notif.time}</p>
              </div>
              <button className="p-1 rounded-lg hover:bg-secondary/50 text-muted hover:text-text transition-colors shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
