import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: {
    name: string;
    date: string;
    startTime: string;
    endTime: string;
    maxParticipants: number;
  }) => void;
}

export default function CreateEventDialog({
  open,
  onOpenChange,
  onSubmit,
}: CreateEventDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    startTime: "",
    endTime: "",
    maxParticipants: 20,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
    onOpenChange(false);
    setFormData({
      name: "",
      date: "",
      startTime: "",
      endTime: "",
      maxParticipants: 20,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="dialog-create-event">
        <DialogHeader>
          <DialogTitle>建立新活動</DialogTitle>
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
              data-testid="input-max-participants"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              data-testid="button-cancel-event"
            >
              取消
            </Button>
            <Button type="submit" className="flex-1" data-testid="button-create-event">
              建立活動
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
