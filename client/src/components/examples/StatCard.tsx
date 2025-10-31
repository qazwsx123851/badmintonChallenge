import StatCard from '../StatCard'
import { Calendar } from 'lucide-react'

export default function StatCardExample() {
  return (
    <div className="max-w-sm">
      <StatCard
        title="本月活動"
        value={12}
        icon={Calendar}
        description="較上月增加"
        trend={{ value: "+20%", isPositive: true }}
      />
    </div>
  )
}
