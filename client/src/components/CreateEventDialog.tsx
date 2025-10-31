import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Event, InsertEvent } from "@shared/schema";

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
    date: "",
    startTime: "",
    endTime: "",
    maxParticipants: 20,
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
        date: "",
        startTime: "",
        endTime: "",
        maxParticipants: 20,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.date || !formData.startTime || !formData.endTime) {
      toast({
        title: "錯誤",
        description: "請填寫所有必填欄位",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const [year, month, day] = formData.date.split("-").map(Number);
      const [startHour, startMinute] = formData.startTime.split(":").map(Number);
      const [endHour, endMinute] = formData.endTime.split(":").map(Number);
      
      if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(startHour) || isNaN(startMinute) || isNaN(endHour) || isNaN(endMinute)) {
        throw new Error("Invalid date or time format");
      }
      
      const startTime = new Date(year, month - 1, day, startHour, startMinute);
      const endTime = new Date(year, month - 1, day, endHour, endMinute);
      
      if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
        throw new Error("Invalid date");
      }
      
      if (endTime <= startTime) {
        toast({
          title: "錯誤",
          description: "結束時間必須晚於開始時間",
          variant: "destructive",
        });
        return;
      }
      
      createMutation.mutate({
        name: formData.name,
        startTime,
        endTime,
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
      <DialogContent data-testid="dialog-create-event" className="rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">建立新活動</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="eventName">活動名稱</Label>
            <Input
              id="eventName"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="例如：週五夜間歡樂場"
              required
              className="h-12 rounded-xl"
              data-testid="input-event-name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="eventDate">活動日期</Label>
            <Input
              id="eventDate"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              className="h-12 rounded-xl"
              data-testid="input-event-date"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">開始時間</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
                className="h-12 rounded-xl"
                data-testid="input-start-time"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">結束時間</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                required
                className="h-12 rounded-xl"
                data-testid="input-end-time"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxParticipants">人數上限</Label>
            <Input
              id="maxParticipants"
              type="number"
              min="1"
              value={formData.maxParticipants}
              onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
              required
              className="h-12 rounded-xl"
              data-testid="input-max-participants"
            />
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
