import { motion } from 'framer-motion'
import { Users, Car, DollarSign, TrendingUp, AlertTriangle, MapPin } from 'lucide-react'
import StatsCard from '../../components/common/StatsCard'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'

const stats = [
  { icon: Users, label: 'Total Users', value: '12,847', change: '+340 this month', changeType: 'up' },
  { icon: Car, label: 'Active Drivers', value: '2,156', change: '+89 this month', changeType: 'up' },
  { icon: MapPin, label: 'Total Rides', value: '45,230', change: '+2,340 this week', changeType: 'up' },
  { icon: DollarSign, label: 'Revenue', value: '$89,420', change: '+12% MoM', changeType: 'up' },
]

const recentActivity = [
  { type: 'ride', desc: 'New ride completed by Alex M.', time: '2 min ago', badge: 'success' },
  { type: 'driver', desc: 'New driver registration: Sarah K.', time: '15 min ago', badge: 'primary' },
  { type: 'dispute', desc: 'Payment dispute filed by user #4521', time: '1 hour ago', badge: 'warning' },
  { type: 'ride', desc: 'Ride cancelled by passenger #8832', time: '2 hours ago', badge: 'danger' },
]

export default function AdminDashboard() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-text">Admin Dashboard</h1>
        <p className="text-muted text-sm mt-1">Platform overview and management.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => <StatsCard key={stat.label} {...stat} />)}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <h3 className="text-lg font-semibold text-text mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/20">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  item.badge === 'success' ? 'bg-success/10' :
                  item.badge === 'primary' ? 'bg-primary/10' :
                  item.badge === 'warning' ? 'bg-yellow-400/10' : 'bg-danger/10'
                }`}>
                  {item.type === 'ride' ? <MapPin className="w-4 h-4 text-primary" /> :
                   item.type === 'driver' ? <Car className="w-4 h-4 text-success" /> :
                   <AlertTriangle className="w-4 h-4 text-yellow-400" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-text">{item.desc}</p>
                  <p className="text-xs text-muted">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Platform Health */}
        <Card>
          <h3 className="text-lg font-semibold text-text mb-4">Platform Health</h3>
          <div className="space-y-4">
            {[
              { label: 'Completion Rate', value: '94%', color: 'bg-success' },
              { label: 'Avg Rating', value: '4.8', color: 'bg-primary' },
              { label: 'Driver Satisfaction', value: '89%', color: 'bg-hover' },
              { label: 'Dispute Rate', value: '0.3%', color: 'bg-yellow-400' },
            ].map((metric) => (
              <div key={metric.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted">{metric.label}</span>
                  <span className="text-text font-medium">{metric.value}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
                  <div className={`h-full rounded-full ${metric.color}`} style={{ width: metric.value }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </motion.div>
  )
}
