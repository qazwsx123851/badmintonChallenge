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
        "border md-ripple focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        active
          ? "bg-primary text-white border-primary shadow-[0_16px_40px_-18px_rgba(37,99,235,0.45)]"
          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
      )}
    >
      {icon && <span className="text-lg">{icon}</span>}
      <span>{label}</span>
      {typeof count === "number" && (
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-xs font-semibold transition-colors",
            active ? "bg-white/25" : "bg-slate-100"
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}
