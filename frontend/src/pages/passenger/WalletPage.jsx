import { motion } from "framer-motion";
import {
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";

const transactions = [
  {
    id: 1,
    type: "credit",
    amount: "+$50.00",
    desc: "Added funds",
    time: "2 hours ago",
  },
  {
    id: 2,
    type: "debit",
    amount: "-$24.50",
    desc: "Ride to Airport",
    time: "Yesterday",
  },
  {
    id: 3,
    type: "debit",
    amount: "-$12.00",
    desc: "Ride to Office",
    time: "Jun 27",
  },
  {
    id: 4,
    type: "reward",
    amount: "+150 pts",
    desc: "Ride reward",
    time: "Jun 27",
  },
  {
    id: 5,
    type: "credit",
    amount: "+$100.00",
    desc: "Added funds",
    time: "Jun 25",
  },
];

export default function WalletPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <h1 className="text-2xl font-display font-bold text-text">Wallet</h1>

      {/* Balance Card */}
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-[60px]" />
        <div className="relative">
          <p className="text-sm text-muted mb-1">Available Balance</p>
          <p className="text-4xl font-display font-bold text-text mb-4">
            $124.50
          </p>
          <div className="flex gap-3">
            <Button size="sm" icon={Plus}>
              Add Funds
            </Button>
            <Button size="sm" variant="secondary" icon={ArrowUpRight}>
              Withdraw
            </Button>
          </div>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "Total Spent", value: "$384.20", icon: CreditCard },
          { label: "This Month", value: "$67.50", icon: TrendingUp },
          { label: "Saved", value: "$23.40", icon: Wallet },
        ].map((stat) => (
          <Card key={stat.label} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center">
              <stat.icon className="w-5 h-5 text-muted" />
            </div>
            <div>
              <p className="text-lg font-display font-bold text-text">
                {stat.value}
              </p>
              <p className="text-xs text-muted">{stat.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Transactions */}
      <Card>
        <h3 className="text-lg font-semibold text-text mb-4">
          Recent Transactions
        </h3>
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary/20 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    tx.type === "credit"
                      ? "bg-success/10"
                      : tx.type === "reward"
                        ? "bg-yellow-400/10"
                        : "bg-danger/10"
                  }`}
                >
                  {tx.type === "credit" ? (
                    <ArrowDownLeft className="w-4 h-4 text-success" />
                  ) : tx.type === "reward" ? (
                    <TrendingUp className="w-4 h-4 text-yellow-400" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4 text-danger" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-text">{tx.desc}</p>
                  <p className="text-xs text-muted">{tx.time}</p>
                </div>
              </div>
              <span
                className={`text-sm font-semibold ${
                  tx.type === "credit" || tx.type === "reward"
                    ? "text-success"
                    : "text-text"
                }`}
              >
                {tx.amount}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
