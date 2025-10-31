import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

interface TimePickerProps {
  value?: string;
  onChange: (time: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: boolean;
}

export function TimePicker({
  value,
  onChange,
  placeholder = "選擇時間",
  disabled = false,
  className,
  error = false,
}: TimePickerProps) {
  const [open, setOpen] = useState(false);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = [0, 15, 30, 45];

  const handleTimeSelect = (hour: number, minute: number) => {
    const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    onChange(timeString);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            error && "border-red-500 border-2 focus-visible:ring-red-500",
            className
          )}
          disabled={disabled}
          data-testid="button-time-picker"
        >
          <Clock className="mr-2 h-4 w-4" />
          {value || <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex max-h-[300px]">
          <div className="overflow-y-auto border-r">
            <div className="p-2">
              <div className="text-xs font-medium text-muted-foreground mb-2 px-2">小時</div>
              {hours.map((hour) => (
                <Button
                  key={hour}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full justify-center",
                    value?.startsWith(hour.toString().padStart(2, '0')) && "bg-accent"
                  )}
                  onClick={() => {
                    const currentMinute = value ? parseInt(value.split(':')[1]) : 0;
                    handleTimeSelect(hour, currentMinute);
                  }}
                >
                  {hour.toString().padStart(2, '0')}
                </Button>
              ))}
            </div>
          </div>
          <div className="overflow-y-auto">
            <div className="p-2">
              <div className="text-xs font-medium text-muted-foreground mb-2 px-2">分鐘</div>
              {minutes.map((minute) => (
                <Button
                  key={minute}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full justify-center",
                    value?.endsWith(minute.toString().padStart(2, '0')) && "bg-accent"
                  )}
                  onClick={() => {
                    const currentHour = value ? parseInt(value.split(':')[0]) : 0;
                    handleTimeSelect(currentHour, minute);
                  }}
                >
                  {minute.toString().padStart(2, '0')}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
