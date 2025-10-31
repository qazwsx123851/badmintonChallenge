import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import StatCard from "@/components/StatCard";
import CreateEventDialog from "@/components/CreateEventDialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Settings, Calendar, Users, MapPin, Trophy, Plus, Zap } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { Event, Court, Registration, Match } from "@shared/schema";

export default function AdminPage() {
  const [createEventOpen, setCreateEventOpen] = useState(false);
  const [selectedEventForAllocation, setSelectedEventForAllocation] = useState("");
  const { toast } = useToast();

  const { data: events } = useQuery<Event[]>({ queryKey: ["/api/events"] });
  const { data: courts } = useQuery<Court[]>({ queryKey: ["/api/courts"] });
  const { data: registrations } = useQuery<Registration[]>({ queryKey: ["/api/registrations"] });
  const { data: matches } = useQuery<Match[]>({ queryKey: ["/api/matches"] });

  const availableCourts = courts?.filter(c => c.isAvailable).length || 0;
  const inProgressMatches = matches?.filter(m => m.status === "in_progress").length || 0;

  const allocateMutation = useMutation({
    mutationFn: async (eventId: string) => {
      const res = await apiRequest("POST", `/api/events/${eventId}/allocate`);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "分配失敗");
      }
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/matches"] });
      setSelectedEventForAllocation("");
      toast({
        title: "✅ 分配成功",
        description: data.message || `成功分配 ${data.count} 場比賽`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "❌ 分配失敗",
        description: error.message || "請確認有足夠的場地和報名人數",
        variant: "destructive",
      });
    },
  });

  const handleAllocateMatches = () => {
    if (!selectedEventForAllocation) {
      toast({
        title: "請選擇活動",
        description: "請先選擇要分配賽程的活動",
      });
      return;
    }
    allocateMutation.mutate(selectedEventForAllocation);
  };

  const stats = [
    { title: "本月活動", value: events?.length || 0, icon: Calendar, colorScheme: "primary" as const },
    { title: "總報名人數", value: registrations?.length || 0, icon: Users, colorScheme: "secondary" as const },
    { title: "可用場地", value: availableCourts, icon: MapPin, description: `共 ${courts?.length || 0} 個場地`, colorScheme: "accent" as const },
    { title: "進行中賽程", value: inProgressMatches, icon: Trophy, description: "今日活動", colorScheme: "primary" as const },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-xl">
              <Settings className="w-9 h-9 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">管理後台</h1>
              <p className="text-lg text-muted-foreground mt-2">
                管理活動、場地與賽程，一站式控制整個系統
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-8 shadow-xl rounded-2xl border-0 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-3">建立新活動</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  設定活動時間、地點與人數限制，開放報名
                </p>
                <Button 
                  onClick={() => setCreateEventOpen(true)} 
                  className="rounded-full shadow-md font-medium"
                  data-testid="button-create-event-action"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  建立活動
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-8 shadow-xl rounded-2xl border-0 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-orange-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-3">自動分配賽程</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  根據報名情況與場地資源，智慧分配比賽時段
                </p>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="event-select">選擇活動</Label>
                    <Select value={selectedEventForAllocation} onValueChange={setSelectedEventForAllocation}>
                      <SelectTrigger className="h-12 rounded-xl" id="event-select" data-testid="select-allocation-event">
                        <SelectValue placeholder="請選擇要分配的活動" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {events?.map((event) => (
                          <SelectItem key={event.id} value={event.id}>
                            {event.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    variant="secondary" 
                    onClick={handleAllocateMatches}
                    className="rounded-full shadow-md font-medium w-full"
                    data-testid="button-allocate-matches"
                    disabled={allocateMutation.isPending}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    {allocateMutation.isPending ? "分配中..." : "開始分配"}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-8 shadow-xl rounded-2xl border-0">
          <h3 className="text-2xl font-bold mb-6">近期活動</h3>
          <div className="space-y-4">
            {events?.slice(0, 3).map((event, i) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-5 bg-gradient-to-r from-muted/30 to-muted/10 rounded-xl hover:shadow-md transition-all duration-300 border border-muted"
                data-testid={`recent-event-${i}`}
              >
                <div>
                  <p className="font-bold text-lg">{event.name}</p>
                  <p className="text-sm text-muted-foreground font-medium">
                    {new Date(event.startTime).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">
                    {registrations?.filter(r => r.eventId === event.id).length || 0}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium">已報名</p>
                </div>
              </div>
            ))}
            {events?.length === 0 && (
              <p className="text-center text-muted-foreground py-8">還沒有活動</p>
            )}
          </div>
        </Card>
      </div>

      <CreateEventDialog
        open={createEventOpen}
        onOpenChange={setCreateEventOpen}
      />
    </div>
  );
}
