import MatchScheduleTable from "@/components/MatchScheduleTable";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trophy, Download } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Event, Match, Court } from "@shared/schema";

export default function MatchesPage() {
  const [selectedEvent, setSelectedEvent] = useState("all");

  const { data: events, isLoading: eventsLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const { data: allMatches, isLoading: matchesLoading } = useQuery<Match[]>({
    queryKey: ["/api/matches"],
  });

  const { data: courts } = useQuery<Court[]>({
    queryKey: ["/api/courts"],
  });

  const matches = selectedEvent && selectedEvent !== "all"
    ? allMatches?.filter(m => m.eventId === selectedEvent) 
    : allMatches;

  const selectedEventData = events?.find(e => e.id === selectedEvent);

  const transformedMatches = matches?.map(match => {
    const court = courts?.find(c => c.id === match.courtId);
    const startTime = new Date(match.startTime);
    const endTime = new Date(startTime.getTime() + 30 * 60 * 1000);
    
    return {
      id: match.id,
      courtName: court?.name || "未知場地",
      timeSlot: `${startTime.toLocaleTimeString('zh-TW', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })} - ${endTime.toLocaleTimeString('zh-TW', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })}`,
      participants: match.participantIds.slice(0, 2),
      status: match.status as "scheduled" | "in_progress" | "completed",
    };
  }) || [];

  const allCourts = courts?.map(c => c.name) || [];
  const timeSlots = Array.from(new Set(transformedMatches.map(m => m.timeSlot)));

  return (
    <div className="min-h-screen pt-20 pb-12">
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
                  <SelectValue placeholder="顯示所有活動的賽程" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">所有活動</SelectItem>
                  {events?.map((event) => (
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

        {eventsLoading || matchesLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">載入中...</p>
          </div>
        ) : transformedMatches.length > 0 ? (
          <MatchScheduleTable
            matches={transformedMatches}
            courts={allCourts}
            timeSlots={timeSlots}
          />
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <Trophy className="w-12 h-12 text-muted-foreground" />
            </div>
            <p className="text-xl text-muted-foreground font-medium">
              {selectedEvent && selectedEvent !== "all" ? "此活動尚未安排賽程" : "尚未有任何賽程"}
            </p>
            <p className="text-muted-foreground mt-2">
              請在管理後台進行自動分配
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
