import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { BootstrapDatePicker } from "@/components/ui/bootstrap-datepicker";
import { BootstrapTimePicker } from "@/components/ui/bootstrap-timepicker";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Event, InsertEvent } from "@shared/schema";
import { cn } from "@/lib/utils";

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateEventDialog({
  open,
  onOpenChange,
}: CreateEventDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    eventDate: null as Date | null,
    startTime: null as Date | null,
    endTime: null as Date | null,
    maxParticipants: 20,
  });
  const [errors, setErrors] = useState({
    name: false,
    eventDate: false,
    startTime: false,
    endTime: false,
    maxParticipants: false,
  });
  const { toast } = useToast();

  const createMutation = useMutation({
    mutationFn: async (data: InsertEvent) => {
      const res = await apiRequest("POST", "/api/events", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      onOpenChange(false);
      setFormData({
        name: "",
        eventDate: null,
        startTime: null,
        endTime: null,
        maxParticipants: 20,
      });
      setErrors({
        name: false,
        eventDate: false,
        startTime: false,
        endTime: false,
        maxParticipants: false,
      });
      toast({
        title: "成功",
        description: "活動已成功建立",
      });
    },
    onError: () => {
      toast({
        title: "錯誤",
        description: "建立活動失敗",
        variant: "destructive",
      });
    },
  });

  const validateForm = () => {
    const newErrors = {
      name: !formData.name.trim(),
      eventDate: !formData.eventDate,
      startTime: !formData.startTime,
      endTime: !formData.endTime,
      maxParticipants: formData.maxParticipants < 1,
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "錯誤",
        description: "請填寫所有必填欄位",
        variant: "destructive",
      });
      return;
    }
    
    try {
      if (!formData.eventDate || !formData.startTime || !formData.endTime) return;
      
      // 組合日期和時間
      const startDateTime = new Date(formData.eventDate);
      startDateTime.setHours(formData.startTime.getHours(), formData.startTime.getMinutes(), 0, 0);
      
      const endDateTime = new Date(formData.eventDate);
      endDateTime.setHours(formData.endTime.getHours(), formData.endTime.getMinutes(), 0, 0);
      
      if (endDateTime <= startDateTime) {
        toast({
          title: "錯誤",
          description: "結束時間必須晚於開始時間",
          variant: "destructive",
        });
        return;
      }
      
      createMutation.mutate({
        name: formData.name,
        startTime: startDateTime,
        endTime: endDateTime,
        status: "開放報名",
        maxParticipants: formData.maxParticipants,
      });
    } catch (error) {
      console.error("Error parsing date/time:", error, formData);
      toast({
        title: "錯誤",
        description: "日期或時間格式不正確",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="dialog-create-event" className="rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">建立新活動</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="eventName" className="text-base">
              活動名稱 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="eventName"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                setErrors({ ...errors, name: false });
              }}
              placeholder="例如：週五夜間歡樂場"
              className={cn(
                "h-12 rounded-xl transition-all",
                errors.name && "border-red-500 border-2 focus-visible:ring-red-500"
              )}
              data-testid="input-event-name"
            />
            {errors.name && (
              <p className="text-sm text-red-500">請輸入活動名稱</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-base">
              活動日期 <span className="text-red-500">*</span>
            </Label>
            <BootstrapDatePicker
              selected={formData.eventDate}
              onChange={(date) => {
                setFormData({ ...formData, eventDate: date });
                setErrors({ ...errors, eventDate: false });
              }}
              placeholder="選擇活動日期"
              error={errors.eventDate}
              minDate={new Date()}
            />
            {errors.eventDate && (
              <p className="text-sm text-red-500">請選擇活動日期</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-base">
                開始時間 <span className="text-red-500">*</span>
              </Label>
              <BootstrapTimePicker
                selected={formData.startTime}
                onChange={(time) => {
                  setFormData({ ...formData, startTime: time });
                  setErrors({ ...errors, startTime: false });
                }}
                placeholder="選擇開始時間"
                error={errors.startTime}
              />
              {errors.startTime && (
                <p className="text-sm text-red-500">請選擇開始時間</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-base">
                結束時間 <span className="text-red-500">*</span>
              </Label>
              <BootstrapTimePicker
                selected={formData.endTime}
                onChange={(time) => {
                  setFormData({ ...formData, endTime: time });
                  setErrors({ ...errors, endTime: false });
                }}
                placeholder="選擇結束時間"
                error={errors.endTime}
              />
              {errors.endTime && (
                <p className="text-sm text-red-500">請選擇結束時間</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxParticipants" className="text-base">
              人數上限 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="maxParticipants"
              type="number"
              min="1"
              value={formData.maxParticipants}
              onChange={(e) => {
                setFormData({ ...formData, maxParticipants: parseInt(e.target.value) || 0 });
                setErrors({ ...errors, maxParticipants: false });
              }}
              className={cn(
                "h-12 rounded-xl transition-all",
                errors.maxParticipants && "border-red-500 border-2 focus-visible:ring-red-500"
              )}
              data-testid="input-max-participants"
            />
            {errors.maxParticipants && (
              <p className="text-sm text-red-500">請輸入有效的人數上限</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 rounded-full h-12"
              data-testid="button-cancel-event"
            >
              取消
            </Button>
            <Button 
              type="submit" 
              className="flex-1 rounded-full h-12 font-medium" 
              data-testid="button-create-event"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "建立中..." : "建立活動"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
