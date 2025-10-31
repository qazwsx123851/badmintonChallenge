import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  colorScheme?: "primary" | "secondary" | "accent";
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  colorScheme = "primary",
}: StatCardProps) {
  const gradients = {
    primary: "from-primary to-blue-600",
    secondary: "from-secondary to-orange-600",
    accent: "from-accent to-green-600",
  };

  return (
    <Card className={`p-8 shadow-xl rounded-2xl border-0 bg-gradient-to-br ${gradients[colorScheme]} text-white overflow-hidden relative`}>
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
        <Icon className="w-full h-full" />
      </div>
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm font-medium uppercase tracking-wide opacity-90 mb-2">{title}</p>
            <p className="text-5xl font-bold mb-2" data-testid={`stat-value-${title}`}>{value}</p>
            {description && (
              <p className="text-sm opacity-80">{description}</p>
            )}
            {trend && (
              <p className={`text-sm font-bold mt-3 ${trend.isPositive ? 'text-green-200' : 'text-red-200'}`}>
                {trend.isPositive ? '↑' : '↓'} {trend.value}
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
