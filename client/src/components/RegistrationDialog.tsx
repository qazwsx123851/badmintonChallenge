import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, User, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Team, InsertRegistration, Registration, Event } from "@shared/schema";
import { cn } from "@/lib/utils";

interface RegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
  eventName: string;
  maxParticipants?: number;
}

export default function RegistrationDialog({
  open,
  onOpenChange,
  eventId,
  eventName,
  maxParticipants,
}: RegistrationDialogProps) {
  const [type, setType] = useState<"individual" | "team">("individual");
  const [userName, setUserName] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [errors, setErrors] = useState({
    userName: false,
    team: false,
  });
  const { toast } = useToast();

  const { data: teams } = useQuery<Team[]>({
    queryKey: ["/api/teams"],
    enabled: open && type === "team",
  });

  const { data: registrations = [] } = useQuery<Registration[]>({
    queryKey: ["/api/registrations", { eventId }],
    enabled: open,
  });

  useEffect(() => {
    if (open) {
      queryClient.refetchQueries({ queryKey: ["/api/registrations", { eventId }] });
      queryClient.refetchQueries({ queryKey: ["/api/events"] });
    }
  }, [open, eventId]);

  const currentCount = registrations.reduce((acc, reg) => {
    return acc + (reg.type === "team" ? 2 : 1);
  }, 0);

  const newParticipants = type === "team" ? 2 : 1;
  const wouldExceed = maxParticipants ? (currentCount + newParticipants) > maxParticipants : false;
  const progress = maxParticipants ? (currentCount / maxParticipants) * 100 : 0;

  const registerMutation = useMutation({
    mutationFn: async (data: InsertRegistration) => {
      const res = await apiRequest("POST", "/api/registrations", data);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "報名失敗");
      }
      return res.json();
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["/api/registrations"] }),
        queryClient.invalidateQueries({ queryKey: ["/api/registrations", { eventId }] }),
        queryClient.invalidateQueries({ queryKey: ["/api/events"] }),
      ]);
      await queryClient.refetchQueries({ queryKey: ["/api/registrations"] });
      onOpenChange(false);
      setUserName("");
      setSelectedTeam("");
      setErrors({ userName: false, team: false });
      toast({
        title: "✅ 報名成功",
        description: `您已成功報名「${eventName}」`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "❌ 報名失敗",
        description: error.message || "請稍後再試",
        variant: "destructive",
      });
    },
  });

  const validateForm = () => {
    const newErrors = {
      userName: type === "individual" && !userName.trim(),
      team: type === "team" && !selectedTeam,
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
    
    const registrationData: InsertRegistration = {
      eventId,
      type,
      userId: type === "individual" ? `user-${Date.now()}` : null,
      teamId: type === "team" ? selectedTeam : null,
      participantName: type === "individual" ? userName : null,
    };

    registerMutation.mutate(registrationData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="dialog-registration" className="rounded-2xl sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-2xl font-bold">報名 - {eventName}</DialogTitle>
          {maxParticipants && (
            <div className="space-y-2 pt-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  目前報名：<span className="font-semibold text-foreground">{currentCount}</span> / {maxParticipants} 人
                </span>
                <span className={cn(
                  "font-semibold",
                  progress >= 90 ? "text-red-500" : progress >= 70 ? "text-orange-500" : "text-green-500"
                )}>
                  {progress.toFixed(0)}%
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </DialogHeader>

        {wouldExceed && (
          <Alert variant="destructive" className="border-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="font-medium">
              此報名方式需要 {newParticipants} 個名額，但活動僅剩 {maxParticipants! - currentCount} 個名額。請選擇個人報名或聯繫活動主辦方。
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Label>報名方式</Label>
            <RadioGroup value={type} onValueChange={(v) => setType(v as "individual" | "team")}>
              <div className="flex items-center space-x-2 p-4 border rounded-xl hover-elevate">
                <RadioGroupItem value="individual" id="individual" data-testid="radio-individual" />
                <Label htmlFor="individual" className="flex items-center gap-2 cursor-pointer flex-1">
                  <User className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium">個人報名</div>
                    <div className="text-sm text-muted-foreground">以個人身份參加活動</div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-4 border rounded-xl hover-elevate">
                <RadioGroupItem value="team" id="team" data-testid="radio-team" />
                <Label htmlFor="team" className="flex items-center gap-2 cursor-pointer flex-1">
                  <Users className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium">團隊報名</div>
                    <div className="text-sm text-muted-foreground">代表團隊參加活動</div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {type === "individual" ? (
            <div className="space-y-2">
              <Label htmlFor="userName" className="text-base">
                您的姓名 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="userName"
                value={userName}
                onChange={(e) => {
                  setUserName(e.target.value);
                  setErrors({ ...errors, userName: false });
                }}
                placeholder="請輸入您的姓名"
                className={cn(
                  "h-12 rounded-xl transition-all",
                  errors.userName && "border-red-500 border-2 focus-visible:ring-red-500"
                )}
                data-testid="input-username"
              />
              {errors.userName && (
                <p className="text-sm text-red-500">請輸入您的姓名</p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="team" className="text-base">
                選擇團隊 <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={selectedTeam} 
                onValueChange={(value) => {
                  setSelectedTeam(value);
                  setErrors({ ...errors, team: false });
                }}
              >
                <SelectTrigger 
                  className={cn(
                    "h-12 rounded-xl transition-all",
                    errors.team && "border-red-500 border-2 focus-visible:ring-red-500"
                  )}
                  data-testid="select-team"
                >
                  <SelectValue placeholder="請選擇團隊" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {teams?.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.team && (
                <p className="text-sm text-red-500">請選擇一個團隊</p>
              )}
            </div>
          )}

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
              data-testid="button-submit-registration"
              disabled={registerMutation.isPending || wouldExceed}
            >
              {registerMutation.isPending ? "報名中..." : wouldExceed ? "名額不足" : "✓ 確認報名"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
