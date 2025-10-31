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
  const [tempHour, setTempHour] = useState<number | null>(null);
  const [tempMinute, setTempMinute] = useState<number | null>(null);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = [0, 15, 30, 45];

  // 解析當前值
  const currentHour = value ? parseInt(value.split(':')[0]) : null;
  const currentMinute = value ? parseInt(value.split(':')[1]) : null;

  // 顯示的小時和分鐘（暫時選擇 > 當前值）
  const displayHour = tempHour ?? currentHour;
  const displayMinute = tempMinute ?? currentMinute;

  // 當彈窗打開時，初始化暫時值
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      // 打開時，使用當前值初始化暫時值
      setTempHour(currentHour);
      setTempMinute(currentMinute);
    } else {
      // 關閉時清空暫時值
      setTempHour(null);
      setTempMinute(null);
    }
  };

  const handleHourSelect = (hour: number) => {
    setTempHour(hour);
  };

  const handleMinuteSelect = (minute: number) => {
    setTempMinute(minute);
    
    // 選擇完分鐘後，組合完整時間並提交
    const finalHour = tempHour ?? currentHour ?? 0;
    const timeString = `${finalHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    onChange(timeString);
    
    // 關閉彈窗
    setOpen(false);
    setTempHour(null);
    setTempMinute(null);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
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
                    displayHour === hour && "bg-accent"
                  )}
                  onClick={() => handleHourSelect(hour)}
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
                    displayMinute === minute && "bg-accent"
                  )}
                  onClick={() => handleMinuteSelect(minute)}
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
