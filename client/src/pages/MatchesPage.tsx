import MatchScheduleTable from "@/components/MatchScheduleTable";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trophy, Download } from "lucide-react";
import { useState } from "react";

export default function MatchesPage() {
  const [selectedEvent, setSelectedEvent] = useState("1");

  // Mock data - todo: remove mock functionality
  const mockEvents = [
    { id: "1", name: "週五夜間歡樂場" },
    { id: "2", name: "週六早晨練習賽" },
  ];

  const mockMatches = [
    {
      id: "1",
      courtName: "A 場",
      timeSlot: "19:00 - 19:30",
      participants: ["快樂隊", "衝鋒隊"],
      status: "in_progress" as const,
    },
    {
      id: "2",
      courtName: "B 場",
      timeSlot: "19:00 - 19:30",
      participants: ["王大明", "李小華"],
      status: "scheduled" as const,
    },
    {
      id: "3",
      courtName: "C 場",
      timeSlot: "19:00 - 19:30",
      participants: ["夢想隊", "閃電隊"],
      status: "scheduled" as const,
    },
    {
      id: "4",
      courtName: "A 場",
      timeSlot: "19:30 - 20:00",
      participants: ["張三", "李四"],
      status: "scheduled" as const,
    },
    {
      id: "5",
      courtName: "B 場",
      timeSlot: "19:30 - 20:00",
      participants: ["王五", "趙六"],
      status: "scheduled" as const,
    },
    {
      id: "6",
      courtName: "A 場",
      timeSlot: "20:00 - 20:30",
      participants: ["快樂隊", "夢想隊"],
      status: "scheduled" as const,
    },
  ];

  const courts = ["A 場", "B 場", "C 場", "D 場"];
  const timeSlots = ["19:00 - 19:30", "19:30 - 20:00", "20:00 - 20:30", "20:30 - 21:00"];

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-green-600 flex items-center justify-center shadow-xl">
              <Trophy className="w-9 h-9 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-accent to-green-600 bg-clip-text text-transparent">賽程表</h1>
              <p className="text-lg text-muted-foreground mt-2">
                查看活動的詳細賽程安排，所有場地與時段一目了然
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-card p-6 rounded-2xl shadow-lg">
            <div className="flex items-center gap-4">
              <label className="text-base font-bold">選擇活動：</label>
              <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                <SelectTrigger className="w-[280px] h-12 rounded-xl" data-testid="select-event">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {mockEvents.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button className="rounded-full shadow-md font-medium h-12" data-testid="button-export">
              <Download className="w-4 h-4 mr-2" />
              匯出賽程
            </Button>
          </div>
        </div>

        <MatchScheduleTable
          matches={mockMatches}
          courts={courts}
          timeSlots={timeSlots}
        />
      </div>
    </div>
  );
}
