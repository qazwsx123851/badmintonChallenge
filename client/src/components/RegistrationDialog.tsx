import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, User } from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Team, InsertRegistration, Registration } from "@shared/schema";
import { cn } from "@/lib/utils";

interface RegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
  eventName: string;
}

export default function RegistrationDialog({
  open,
  onOpenChange,
  eventId,
  eventName,
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

  const registerMutation = useMutation({
    mutationFn: async (data: InsertRegistration) => {
      const res = await apiRequest("POST", "/api/registrations", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/registrations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      onOpenChange(false);
      setUserName("");
      setSelectedTeam("");
      setErrors({ userName: false, team: false });
      toast({
        title: "報名成功",
        description: "您已成功報名此活動",
      });
    },
    onError: () => {
      toast({
        title: "報名失敗",
        description: "請稍後再試",
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
      <DialogContent data-testid="dialog-registration" className="rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">報名 - {eventName}</DialogTitle>
        </DialogHeader>

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

          <div className="flex gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)} 
              className="flex-1 rounded-full h-12" 
              data-testid="button-cancel"
            >
              取消
            </Button>
            <Button 
              type="submit" 
              className="flex-1 rounded-full h-12 font-medium" 
              data-testid="button-submit-registration"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? "報名中..." : "確認報名"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
