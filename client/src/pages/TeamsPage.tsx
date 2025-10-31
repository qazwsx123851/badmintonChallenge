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
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold">我的團隊</h1>
            </div>
            <Button onClick={() => setCreateDialogOpen(true)} data-testid="button-create-team">
              <Plus className="w-4 h-4 mr-2" />
              建立團隊
            </Button>
          </div>
          <p className="text-lg text-muted-foreground">
            管理您的羽球團隊，邀請成員一起參加活動
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <DialogContent data-testid="dialog-create-team">
          <DialogHeader>
            <DialogTitle>建立新團隊</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateTeam} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="teamName">團隊名稱</Label>
              <Input
                id="teamName"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="輸入團隊名稱"
                required
                data-testid="input-team-name"
              />
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateDialogOpen(false)}
                className="flex-1"
                data-testid="button-cancel-team"
              >
                取消
              </Button>
              <Button type="submit" className="flex-1" data-testid="button-submit-team">
                建立
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
