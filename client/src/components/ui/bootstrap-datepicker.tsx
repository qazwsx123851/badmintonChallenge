import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface BootstrapDatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
  minDate?: Date;
  className?: string;
}

const CustomInput = forwardRef<
  HTMLButtonElement,
  { value?: string; onClick?: () => void; placeholder?: string; error?: boolean; disabled?: boolean }
>(({ value, onClick, placeholder, error, disabled }, ref) => (
  <button
    type="button"
    ref={ref}
    onClick={onClick}
    disabled={disabled}
    className={cn(
      "w-full h-12 px-3 rounded-xl border bg-background text-left flex items-center gap-2 transition-all",
      "hover:border-accent-foreground/30",
      "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      !value && "text-muted-foreground",
      error && "border-red-500 border-2 focus:ring-red-500",
      disabled && "opacity-50 cursor-not-allowed"
    )}
    data-testid="button-date-picker"
  >
    <Calendar className="h-4 w-4 text-muted-foreground" />
    <span className="flex-1">{value || placeholder}</span>
  </button>
));
CustomInput.displayName = "CustomInput";

export function BootstrapDatePicker({
  selected,
  onChange,
  placeholder = "選擇日期",
  error = false,
  disabled = false,
  minDate,
  className,
}: BootstrapDatePickerProps) {
  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      dateFormat="yyyy/MM/dd"
      minDate={minDate}
      disabled={disabled}
      customInput={<CustomInput placeholder={placeholder} error={error} disabled={disabled} />}
      calendarClassName="bootstrap-datepicker-calendar"
      className={className}
      locale="zh-TW"
    />
  );
}
