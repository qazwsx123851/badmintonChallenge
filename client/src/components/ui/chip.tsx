import { cn } from "@/lib/utils";

interface ChipProps {
  active?: boolean;
  icon?: React.ReactNode;
  label: string;
  onClick?: () => void;
  count?: number;
}

export function FilterChip({ active, icon, label, onClick, count }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all",
        "border border-white/30 backdrop-blur-lg md-ripple focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
        active
          ? "bg-primary/90 text-white shadow-[0_16px_40px_-18px_rgba(124,94,255,0.6)]"
          : "bg-white/18 text-white/90 hover:bg-white/26 dark:bg-white/8 dark:text-white/85 dark:hover:bg-white/12"
      )}
    >
      {icon && <span className="text-lg">{icon}</span>}
      <span>{label}</span>
      {typeof count === "number" && (
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-xs font-semibold transition-colors",
            active ? "bg-white/20" : "bg-white/12 dark:bg-white/10"
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}
