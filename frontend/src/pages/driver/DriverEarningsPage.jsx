import { motion } from "framer-motion";
import { DollarSign, TrendingUp, Calendar, Wallet } from "lucide-react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";

const weeklyData = [
  { day: "Mon", amount: 85 },
  { day: "Tue", amount: 120 },
  { day: "Wed", amount: 95 },
  { day: "Thu", amount: 140 },
  { day: "Fri", amount: 160 },
  { day: "Sat", amount: 200 },
  { day: "Sun", amount: 127 },
];

export default function DriverEarningsPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-text">Earnings</h1>
        <Button size="sm" variant="secondary" icon={Calendar}>
          This Week
        </Button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-success/5 rounded-full blur-[60px]" />
          <p className="text-sm text-muted mb-1">Today</p>
          <p className="text-3xl font-display font-bold text-text">$127.50</p>
          <p className="text-xs text-success mt-1">↑ 12% vs yesterday</p>
        </Card>
        <Card>
          <p className="text-sm text-muted mb-1">This Week</p>
          <p className="text-3xl font-display font-bold text-text">$927.50</p>
          <p className="text-xs text-success mt-1">↑ 8% vs last week</p>
        </Card>
        <Card>
          <p className="text-sm text-muted mb-1">This Month</p>
          <p className="text-3xl font-display font-bold text-text">$3,842.00</p>
          <p className="text-xs text-muted mt-1">245 rides completed</p>
        </Card>
      </div>

      {/* Weekly Chart Placeholder */}
      <Card>
        <h3 className="text-lg font-semibold text-text mb-6">
          Weekly Overview
        </h3>
        <div className="flex items-end justify-between gap-3 h-48">
          {weeklyData.map((d) => (
            <div
              key={d.day}
              className="flex-1 flex flex-col items-center gap-2"
            >
              <span className="text-xs text-muted">${d.amount}</span>
              <div
                className="w-full rounded-t-lg gradient-primary transition-all duration-500 hover:opacity-80"
                style={{ height: `${(d.amount / 200) * 100}%` }}
              />
              <span className="text-xs text-muted">{d.day}</span>
            </div>
          ))}
        </div>
      </Card>

      <Button fullWidth variant="secondary" icon={Wallet}>
        Withdraw to Bank Account
      </Button>
    </motion.div>
  );
}
