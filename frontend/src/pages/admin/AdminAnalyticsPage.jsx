import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Users,
  Car,
  DollarSign,
  MapPin,
} from "lucide-react";
import Card from "../../components/common/Card";

const monthlyData = [
  { month: "Jan", rides: 2800, revenue: 42000 },
  { month: "Feb", rides: 3200, revenue: 48000 },
  { month: "Mar", rides: 3600, revenue: 54000 },
  { month: "Apr", rides: 4100, revenue: 61500 },
  { month: "May", rides: 4500, revenue: 67500 },
  { month: "Jun", rides: 5200, revenue: 78000 },
];

const maxRides = Math.max(...monthlyData.map((d) => d.rides));

export default function AdminAnalyticsPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <h1 className="text-2xl font-display font-bold text-text">Analytics</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: MapPin,
            label: "Total Rides",
            value: "45,230",
            change: "+18%",
          },
          {
            icon: DollarSign,
            label: "Total Revenue",
            value: "$351,000",
            change: "+24%",
          },
          {
            icon: Users,
            label: "Active Users",
            value: "12,847",
            change: "+12%",
          },
          { icon: Car, label: "Active Drivers", value: "2,156", change: "+8%" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-5 group hover:shadow-glow hover:border-primary/20 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs text-success font-medium">
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-display font-bold text-text">
              {stat.value}
            </p>
            <p className="text-sm text-muted">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <Card>
        <h3 className="text-lg font-semibold text-text mb-6">
          Monthly Rides & Revenue
        </h3>
        <div className="flex items-end justify-between gap-4 h-64">
          {monthlyData.map((d) => (
            <div
              key={d.month}
              className="flex-1 flex flex-col items-center gap-2 h-full justify-end"
            >
              <span className="text-xs text-muted">
                ${(d.revenue / 1000).toFixed(0)}k
              </span>
              <div
                className="w-full rounded-t-lg gradient-primary transition-all duration-500 hover:opacity-80"
                style={{ height: `${(d.rides / maxRides) * 80}%` }}
              />
              <span className="text-xs text-muted">{d.month}</span>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
