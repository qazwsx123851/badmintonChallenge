import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, Plus, ShieldAlert } from "lucide-react";
import type {
  Court,
  InsertCourt,
  Match,
  Registration,
  Team,
} from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import CourtCard from "@/components/CourtCard";
import EditCourtDialog from "@/components/EditCourtDialog";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function CourtsPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [courtName, setCourtName] = useState("");
  const { toast } = useToast();

  const { data: courts, isLoading } = useQuery<Court[]>({
    queryKey: ["/api/courts"],
  });

  const { data: matches } = useQuery<Match[]>({
    queryKey: ["/api/matches"],
  });

  const { data: teams } = useQuery<Team[]>({
    queryKey: ["/api/teams"],
  });

  const { data: registrations } = useQuery<Registration[]>({
    queryKey: ["/api/registrations"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertCourt) => {
      const res = await apiRequest("POST", "/api/courts", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/courts"] });
      setCreateDialogOpen(false);
      setCourtName("");
      toast({
        title: "新增場地成功",
        description: "球場資料已建立。",
      });
    },
    onError: () => {
      toast({
        title: "新增場地失敗",
        description: "請稍後再試一次。",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/courts/${id}`);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "刪除失敗");
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/courts"] });
      toast({
        title: "刪除場地成功",
        description: "球場已移除。",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "刪除場地失敗",
        description: error.message || "系統暫時無法刪除該場地。",
        variant: "destructive",
      });
    },
  });

  const handleCreateCourt = (event: React.FormEvent) => {
    event.preventDefault();
    if (!courtName.trim()) {
      toast({
        title: "請輸入場地名稱",
        description: "場地名稱為必填欄位。",
        variant: "destructive",
      });
      return;
    }
    createMutation.mutate({ name: courtName.trim(), isAvailable: true });
  };

  const handleEditCourt = (id: string) => {
    const court = courts?.find((item) => item.id === id);
    if (court) {
      setSelectedCourt(court);
      setEditDialogOpen(true);
    }
  };

  const handleDeleteCourt = (id: string) => {
    deleteMutation.mutate(id);
  };

  const getParticipantNames = (participantIds: string[]) => {
    return participantIds.map((id) => {
      const team = teams?.find((item) => item.id === id);
      if (team) return team.name;

      const registration = registrations?.find(
        (item) => item.userId === id || item.teamId === id,
      );

      if (registration?.participantName) {
        return registration.participantName;
      }

      return `${id.substring(0, 8)}…`;
    });
  };

  const enrichedCourts = useMemo(() => {
    if (!courts) return [];

    const now = new Date();
    return courts.map((court) => {
      const inProgressMatches =
        matches?.filter(
          (match) =>
            match.courtId === court.id && match.status === "in_progress",
        ) ?? [];

      const upcomingMatches =
        matches
          ?.filter(
            (match) =>
              match.courtId === court.id &&
              match.status === "scheduled" &&
              new Date(match.startTime) > now,
          )
          .sort(
            (a, b) =>
              new Date(a.startTime).getTime() -
              new Date(b.startTime).getTime(),
          ) ?? [];

      const currentMatch =
        inProgressMatches.length > 0
          ? {
              time: new Date(inProgressMatches[0].startTime).toLocaleTimeString(
                "zh-TW",
                { hour: "2-digit", minute: "2-digit" },
              ),
              participants: getParticipantNames(
                inProgressMatches[0].participantIds,
              ),
            }
          : undefined;

      const nextMatch =
        upcomingMatches.length > 0
          ? {
              time: new Date(upcomingMatches[0].startTime).toLocaleTimeString(
                "zh-TW",
                { hour: "2-digit", minute: "2-digit" },
              ),
              participants: getParticipantNames(
                upcomingMatches[0].participantIds,
              ),
            }
          : undefined;

      return { court, currentMatch, nextMatch };
    });
  }, [courts, matches, registrations, teams]);

  return (
    <PageLayout
      title="場地管理"
      subtitle="即時掌握球場使用率、即將進行的賽事與設備安排，確保營運排程順暢。"
      heroIcon={<MapPin className="w-9 h-9 text-white" />}
      actionSlot={
        <Button
          onClick={() => setCreateDialogOpen(true)}
          variant="secondary"
          className="rounded-full h-14 px-8 font-medium text-base bg-primary text-white hover:bg-primary/90 shadow-[0_16px_34px_-16px_rgba(37,99,235,0.4)]"
          data-testid="button-add-court"
        >
          <Plus className="w-5 h-5 mr-2" />
          新增場地
        </Button>
      }
    >
      <div className="space-y-10">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-80 rounded-3xl bg-slate-100 border border-slate-200"
              />
            ))}
          </div>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {enrichedCourts.map(({ court, currentMatch, nextMatch }) => (
                <motion.div
                  key={court.id}
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.32, ease: "easeOut" }}
                >
                  <CourtCard
                    {...court}
                    currentMatch={currentMatch}
                    nextMatch={nextMatch}
                    onEdit={handleEditCourt}
                    onDelete={handleDeleteCourt}
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {!isLoading && enrichedCourts.length === 0 && (
          <div className="rounded-3xl bg-white border border-slate-200 px-10 py-16 text-center space-y-4 text-slate-600 shadow-[0_24px_55px_-32px_rgba(15,23,42,0.25)]">
            <div className="flex items中心 justify-center">
              <ShieldAlert className="w-12 h-12 text-slate-400" />
            </div>
            <p className="text-lg">
              尚未建立任何場地，點擊右上角「新增場地」即可開始設定。
            </p>
          </div>
        )}
      </div>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent
          className="rounded-3xl border border-slate-200 bg-white shadow-[0_24px_60px_-28px_rgba(15,23,42,0.28)]"
          data-testid="dialog-create-court"
        >
          <DialogHeader>
            <DialogTitle className="text-2xl text-slate-900">
              新增場地
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateCourt} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="courtName" className="text-base font-medium text-slate-700">
                場地名稱
              </Label>
              <Input
                id="courtName"
                value={courtName}
                onChange={(event) => setCourtName(event.target.value)}
                placeholder="例如：E 號場"
                required
                className="h-12 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400"
                data-testid="input-court-name"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateDialogOpen(false)}
                className="flex-1 rounded-full h-12 border-slate-200 text-slate-700 hover:bg-slate-100"
                data-testid="button-cancel-court"
              >
                取消
              </Button>
              <Button
                variant="secondary"
                type="submit"
                className="flex-1 rounded-full h-12 font-medium bg-primary text-white hover:bg-primary/90"
                data-testid="button-submit-court"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? "建立中..." : "建立"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <EditCourtDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        court={selectedCourt}
      />
    </PageLayout>
  );
}
