import { motion } from "framer-motion";
import { Gift, Star, Trophy, Zap } from "lucide-react";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";

const tiers = [
  { name: "Bronze", min: 0, color: "text-orange-400", bg: "bg-orange-400/10" },
  { name: "Silver", min: 1000, color: "text-gray-300", bg: "bg-gray-300/10" },
  { name: "Gold", min: 5000, color: "text-yellow-400", bg: "bg-yellow-400/10" },
  { name: "Platinum", min: 15000, color: "text-primary", bg: "bg-primary/10" },
];

export default function RewardsPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <h1 className="text-2xl font-display font-bold text-text">Rewards</h1>

      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-400/5 rounded-full blur-[60px]" />
        <div className="relative flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-yellow-400/10 flex items-center justify-center">
            <Trophy className="w-7 h-7 text-yellow-400" />
          </div>
          <div>
            <p className="text-sm text-muted">Current Tier</p>
            <p className="text-2xl font-display font-bold text-text">
              Silver Member
            </p>
          </div>
        </div>
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted">Progress to Gold</span>
            <span className="text-text font-medium">2,340 / 5,000 pts</span>
          </div>
          <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
            <div className="h-full w-[47%] rounded-full gradient-primary" />
          </div>
        </div>
      </Card>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tiers.map((tier) => (
          <Card key={tier.name} className="text-center">
            <div
              className={`w-12 h-12 rounded-xl ${tier.bg} flex items-center justify-center mx-auto mb-3`}
            >
              <Star className={`w-6 h-6 ${tier.color}`} />
            </div>
            <h4 className="font-semibold text-text">{tier.name}</h4>
            <p className="text-xs text-muted mt-1">
              {tier.min.toLocaleString()}+ pts
            </p>
          </Card>
        ))}
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-text mb-4">How to Earn</h3>
        <div className="space-y-3">
          {[
            {
              icon: Zap,
              text: "Earn 10 points per ride completed",
              pts: "+10",
            },
            { icon: Star, text: "Rate your driver after each ride", pts: "+5" },
            { icon: Gift, text: "Refer a friend who signs up", pts: "+100" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-xl bg-secondary/20"
            >
              <item.icon className="w-5 h-5 text-primary" />
              <span className="flex-1 text-sm text-muted">{item.text}</span>
              <Badge variant="primary">{item.pts}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
