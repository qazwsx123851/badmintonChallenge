import { useState } from "react";
import TeamCard from "@/components/TeamCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Plus } from "lucide-react";

export default function TeamsPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [teamName, setTeamName] = useState("");

  // Mock data - todo: remove mock functionality
  const mockTeams = [
    { id: "1", name: "快樂羽球隊", captainName: "王大明", memberCount: 6, isCaptain: true },
    { id: "2", name: "衝鋒隊", captainName: "李小華", memberCount: 4, isCaptain: false },
    { id: "3", name: "夢想隊", captainName: "張三", memberCount: 5, isCaptain: false },
    { id: "4", name: "閃電隊", captainName: "陳小美", memberCount: 8, isCaptain: false },
  ];

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating team:", teamName);
    setCreateDialogOpen(false);
    setTeamName("");
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl">
                <Users className="w-9 h-9 text-white" />
              </div>
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">我的團隊</h1>
                <p className="text-lg text-muted-foreground mt-2">
                  管理您的羽球團隊，邀請成員一起參加活動
                </p>
              </div>
            </div>
            <Button 
              onClick={() => setCreateDialogOpen(true)} 
              className="rounded-full shadow-lg h-14 px-8 font-medium text-base"
              data-testid="button-create-team"
            >
              <Plus className="w-5 h-5 mr-2" />
              建立團隊
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockTeams.map((team) => (
            <TeamCard
              key={team.id}
              {...team}
              onEdit={(id) => console.log("Edit team:", id)}
              onView={(id) => console.log("View team:", id)}
            />
          ))}
        </div>
      </div>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="rounded-2xl" data-testid="dialog-create-team">
          <DialogHeader>
            <DialogTitle className="text-2xl">建立新團隊</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateTeam} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="teamName" className="text-base font-medium">團隊名稱</Label>
              <Input
                id="teamName"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="輸入團隊名稱"
                required
                className="h-12 rounded-xl"
                data-testid="input-team-name"
              />
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateDialogOpen(false)}
                className="flex-1 rounded-full h-12"
                data-testid="button-cancel-team"
              >
                取消
              </Button>
              <Button type="submit" className="flex-1 rounded-full h-12 font-medium" data-testid="button-submit-team">
                建立
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
