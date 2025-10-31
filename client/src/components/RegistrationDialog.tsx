import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, User } from "lucide-react";
import { useState } from "react";

interface RegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventName: string;
  onSubmit?: (data: { type: string; teamId?: string; userName?: string }) => void;
}

export default function RegistrationDialog({
  open,
  onOpenChange,
  eventName,
  onSubmit,
}: RegistrationDialogProps) {
  const [type, setType] = useState<"individual" | "team">("individual");
  const [userName, setUserName] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({
      type,
      teamId: type === "team" ? selectedTeam : undefined,
      userName: type === "individual" ? userName : undefined,
    });
    onOpenChange(false);
  };

  // Mock teams data
  const mockTeams = [
    { id: "1", name: "快樂羽球隊" },
    { id: "2", name: "衝鋒隊" },
    { id: "3", name: "夢想隊" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="dialog-registration">
        <DialogHeader>
          <DialogTitle>報名 - {eventName}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Label>報名方式</Label>
            <RadioGroup value={type} onValueChange={(v) => setType(v as "individual" | "team")}>
              <div className="flex items-center space-x-2 p-4 border rounded-md hover-elevate">
                <RadioGroupItem value="individual" id="individual" data-testid="radio-individual" />
                <Label htmlFor="individual" className="flex items-center gap-2 cursor-pointer flex-1">
                  <User className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium">個人報名</div>
                    <div className="text-sm text-muted-foreground">以個人身份參加活動</div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-4 border rounded-md hover-elevate">
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
              <Label htmlFor="userName">您的姓名</Label>
              <Input
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="請輸入您的姓名"
                required
                data-testid="input-username"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="team">選擇團隊</Label>
              <Select value={selectedTeam} onValueChange={setSelectedTeam} required>
                <SelectTrigger data-testid="select-team">
                  <SelectValue placeholder="請選擇團隊" />
                </SelectTrigger>
                <SelectContent>
                  {mockTeams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1" data-testid="button-cancel">
              取消
            </Button>
            <Button type="submit" className="flex-1" data-testid="button-submit-registration">
              確認報名
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
