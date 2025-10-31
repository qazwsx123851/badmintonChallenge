import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Court } from "@shared/schema";
import { cn } from "@/lib/utils";

interface EditCourtDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  court: Court | null;
}

export default function EditCourtDialog({
  open,
  onOpenChange,
  court,
}: EditCourtDialogProps) {
  const [name, setName] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (court) {
      setName(court.name);
      setIsAvailable(court.isAvailable);
    }
  }, [court]);

  const updateMutation = useMutation({
    mutationFn: async (data: { name: string; isAvailable: boolean }) => {
      if (!court) throw new Error("No court selected");
      const res = await apiRequest("PUT", `/api/courts/${court.id}`, data);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "更新失敗");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/courts"] });
      onOpenChange(false);
      toast({
        title: "✅ 更新成功",
        description: "場地資訊已成功更新",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "❌ 更新失敗",
        description: error.message || "請稍後再試",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({
        title: "錯誤",
        description: "請輸入場地名稱",
        variant: "destructive",
      });
      return;
    }
    updateMutation.mutate({ name, isAvailable });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl sm:max-w-[520px]" data-testid="dialog-edit-court">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-2xl font-bold">編輯場地</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="courtName" className="text-base font-medium">
              場地名稱 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="courtName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：A 場"
              className="h-12 rounded-xl transition-all"
              data-testid="input-court-name"
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-xl hover-elevate">
            <div className="space-y-0.5">
              <Label htmlFor="isAvailable" className="text-base font-medium cursor-pointer">
                場地狀態
              </Label>
              <p className="text-sm text-muted-foreground">
                {isAvailable ? "場地可用" : "場地使用中"}
              </p>
            </div>
            <Switch
              id="isAvailable"
              checked={isAvailable}
              onCheckedChange={setIsAvailable}
              data-testid="switch-is-available"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)} 
              className="flex-1 rounded-full h-12 text-base font-medium" 
              data-testid="button-cancel"
            >
              取消
            </Button>
            <Button 
              type="submit" 
              className="flex-1 rounded-full h-12 text-base font-semibold shadow-md" 
              data-testid="button-submit-edit-court"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "更新中..." : "✓ 確認更新"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
