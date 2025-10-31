import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import TeamCard from "@/components/TeamCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Team, InsertTeam } from "@shared/schema";

export default function TeamsPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [teamName, setTeamName] = useState("");
  const { toast } = useToast();

  const { data: teams, isLoading } = useQuery<Team[]>({
    queryKey: ["/api/teams"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertTeam) => {
      const res = await apiRequest("POST", "/api/teams", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
      setCreateDialogOpen(false);
      setTeamName("");
      toast({
        title: "成功",
        description: "團隊已成功建立",
      });
    },
    onError: () => {
      toast({
        title: "錯誤",
        description: "建立團隊失敗",
        variant: "destructive",
      });
    },
  });

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ 
      name: teamName, 
      captainId: "current-user-id", // todo: replace with real user ID
      memberIds: []
    });
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

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">載入中...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teams?.map((team) => (
              <TeamCard
                key={team.id}
                id={team.id}
                name={team.name}
                captainName="隊長" // todo: fetch captain name
                memberCount={team.memberIds.length}
                isCaptain={true} // todo: check if current user is captain
                onEdit={(id) => console.log("Edit team:", id)}
                onView={(id) => console.log("View team:", id)}
              />
            ))}
          </div>
        )}

        {!isLoading && teams?.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <Users className="w-12 h-12 text-muted-foreground" />
            </div>
            <p className="text-xl text-muted-foreground font-medium">還沒有團隊</p>
            <p className="text-muted-foreground mt-2">建立您的第一個團隊</p>
          </div>
        )}
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
              <Button 
                type="submit" 
                className="flex-1 rounded-full h-12 font-medium" 
                data-testid="button-submit-team"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? "建立中..." : "建立"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
