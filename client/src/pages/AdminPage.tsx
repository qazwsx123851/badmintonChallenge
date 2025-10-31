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
    { title: "本月活動", value: 12, icon: Calendar, trend: { value: "+20%", isPositive: true } },
    { title: "總報名人數", value: 248, icon: Users, trend: { value: "+15%", isPositive: true } },
    { title: "可用場地", value: 4, icon: MapPin, description: "共 6 個場地" },
    { title: "進行中賽程", value: 3, icon: Trophy, description: "今日活動" },
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
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">管理後台</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            管理活動、場地與賽程，一站式控制整個系統
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Plus className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-2">建立新活動</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  設定活動時間、地點與人數限制，開放報名
                </p>
                <Button onClick={() => setCreateEventOpen(true)} data-testid="button-create-event-action">
                  建立活動
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-secondary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-2">自動分配賽程</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  根據報名情況與場地資源，智慧分配比賽時段
                </p>
                <Button 
                  variant="secondary" 
                  onClick={handleAllocateMatches}
                  data-testid="button-allocate-matches"
                >
                  開始分配
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">近期活動</h3>
          <div className="space-y-3">
            {[
              { name: "週五夜間歡樂場", date: "2025/11/07", registrations: 12 },
              { name: "週六早晨練習賽", date: "2025/12/08", registrations: 8 },
              { name: "週日下午友誼賽", date: "2025/12/09", registrations: 20 },
            ].map((event, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 bg-muted/50 rounded-md hover-elevate"
                data-testid={`recent-event-${i}`}
              >
                <div>
                  <p className="font-medium">{event.name}</p>
                  <p className="text-sm text-muted-foreground">{event.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{event.registrations} 人</p>
                  <p className="text-xs text-muted-foreground">已報名</p>
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
