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
        title: "\u65b0\u589e\u5834\u5730\u6210\u529f",
        description: "\u7403\u5834\u8cc7\u6599\u5df2\u5efa\u7acb\u3002",
      });
    },
    onError: () => {
      toast({
        title: "\u65b0\u589e\u5834\u5730\u5931\u6557",
        description: "\u8acb\u7a0d\u5f8c\u518d\u8a66\u4e00\u6b21\u3002",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/courts/${id}`);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "\u522a\u9664\u5931\u6557");
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/courts"] });
      toast({
        title: "\u522a\u9664\u5834\u5730\u6210\u529f",
        description: "\u7403\u5834\u5df2\u79fb\u9664\u3002",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "\u522a\u9664\u5834\u5730\u5931\u6557",
        description: error.message || "\u7cfb\u7d71\u66ab\u6642\u7121\u6cd5\u522a\u9664\u8a72\u5834\u5730\u3002",
        variant: "destructive",
      });
    },
  });

  const handleCreateCourt = (event: React.FormEvent) => {
    event.preventDefault();
    if (!courtName.trim()) {
      toast({
        title: "\u8acb\u8f38\u5165\u5834\u5730\u540d\u7a31",
        description: "\u5834\u5730\u540d\u7a31\u70ba\u5fc5\u586b\u6b04\u4f4d\u3002",
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

      return `${id.substring(0, 8)}\u2026`;
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
      title="\u5834\u5730\u7ba1\u7406"
      subtitle="\u5373\u6642\u638c\u63e1\u7403\u5834\u4f7f\u7528\u7387\u3001\u5373\u5c07\u9032\u884c\u7684\u8cfd\u4e8b\u8207\u8a2d\u5099\u5b89\u6392\uff0c\u78ba\u4fdd\u71df\u904b\u6392\u7a0b\u9806\u66a2\u3002"
      heroIcon={<MapPin className="w-9 h-9 text-white" />}
      actionSlot={
        <Button
          onClick={() => setCreateDialogOpen(true)}
          variant="secondary"
          className="rounded-full h-14 px-8 font-medium text-base bg-primary text-white hover:bg-primary/90 shadow-[0_16px_34px_-16px_rgba(37,99,235,0.4)]"
          data-testid="button-add-court"
        >
          <Plus className="w-5 h-5 mr-2" />
          \u65b0\u589e\u5834\u5730
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
            <div className="flex items-center justify-center">
              <ShieldAlert className="w-12 h-12 text-slate-400" />
            </div>
            <p className="text-lg">
              \u5c1a\u672a\u5efa\u7acb\u4efb\u4f55\u5834\u5730\uff0c\u9ede\u64ca\u53f3\u4e0a\u89d2\u300c\u65b0\u589e\u5834\u5730\u300d\u5373\u53ef\u958b\u59cb\u8a2d\u5b9a\u3002
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
              \u65b0\u589e\u5834\u5730
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateCourt} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="courtName" className="text-base font-medium text-slate-700">
                \u5834\u5730\u540d\u7a31
              </Label>
              <Input
                id="courtName"
                value={courtName}
                onChange={(event) => setCourtName(event.target.value)}
                placeholder="\u4f8b\u5982\uff1aE \u865f\u5834"
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
                \u53d6\u6d88
              </Button>
              <Button
                variant="secondary"
                type="submit"
                className="flex-1 rounded-full h-12 font-medium bg-primary text-white hover:bg-primary/90"
                data-testid="button-submit-court"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? "\u5efa\u7acb\u4e2d..." : "\u5efa\u7acb"}
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
