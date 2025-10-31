import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { zhTW } from "date-fns/locale/zh-TW";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

registerLocale("zh-TW", zhTW);

interface BootstrapTimePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
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
    data-testid="button-time-picker"
  >
    <Clock className="h-4 w-4 text-muted-foreground" />
    <span className="flex-1">{value || placeholder}</span>
  </button>
));
CustomInput.displayName = "CustomInput";

export function BootstrapTimePicker({
  selected,
  onChange,
  placeholder = "選擇時間",
  error = false,
  disabled = false,
  className,
}: BootstrapTimePickerProps) {
  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      showTimeSelect
      showTimeSelectOnly
      timeIntervals={15}
      timeCaption="時間"
      dateFormat="HH:mm"
      timeFormat="HH:mm"
      disabled={disabled}
      customInput={<CustomInput placeholder={placeholder} error={error} disabled={disabled} />}
      calendarClassName="bootstrap-timepicker-calendar"
      className={className}
      locale="zh-TW"
    />
  );
}
