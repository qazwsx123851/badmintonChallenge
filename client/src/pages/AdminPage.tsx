import { useState } from "react";
import StatCard from "@/components/StatCard";
import CreateEventDialog from "@/components/CreateEventDialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Settings, Calendar, Users, MapPin, Trophy, Plus, Zap } from "lucide-react";

export default function AdminPage() {
  const [createEventOpen, setCreateEventOpen] = useState(false);

  // Mock data - todo: remove mock functionality
  const stats = [
    { title: "本月活動", value: 12, icon: Calendar, trend: { value: "+20%", isPositive: true }, colorScheme: "primary" as const },
    { title: "總報名人數", value: 248, icon: Users, trend: { value: "+15%", isPositive: true }, colorScheme: "secondary" as const },
    { title: "可用場地", value: 4, icon: MapPin, description: "共 6 個場地", colorScheme: "accent" as const },
    { title: "進行中賽程", value: 3, icon: Trophy, description: "今日活動", colorScheme: "primary" as const },
  ];

  const handleCreateEvent = (data: any) => {
    console.log("Creating event:", data);
  };

  const handleAllocateMatches = () => {
    console.log("Allocating matches...");
  };

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
                <p className="text-sm text-muted-foreground mb-6">
                  根據報名情況與場地資源，智慧分配比賽時段
                </p>
                <Button 
                  variant="secondary" 
                  onClick={handleAllocateMatches}
                  className="rounded-full shadow-md font-medium"
                  data-testid="button-allocate-matches"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  開始分配
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-8 shadow-xl rounded-2xl border-0">
          <h3 className="text-2xl font-bold mb-6">近期活動</h3>
          <div className="space-y-4">
            {[
              { name: "週五夜間歡樂場", date: "2025/11/07", registrations: 12 },
              { name: "週六早晨練習賽", date: "2025/12/08", registrations: 8 },
              { name: "週日下午友誼賽", date: "2025/12/09", registrations: 20 },
            ].map((event, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-5 bg-gradient-to-r from-muted/30 to-muted/10 rounded-xl hover:shadow-md transition-all duration-300 border border-muted"
                data-testid={`recent-event-${i}`}
              >
                <div>
                  <p className="font-bold text-lg">{event.name}</p>
                  <p className="text-sm text-muted-foreground font-medium">{event.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{event.registrations}</p>
                  <p className="text-xs text-muted-foreground font-medium">已報名</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <CreateEventDialog
        open={createEventOpen}
        onOpenChange={setCreateEventOpen}
        onSubmit={handleCreateEvent}
      />
    </div>
  );
}
