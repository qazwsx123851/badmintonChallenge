import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import EventCard from "@/components/EventCard";
import RegistrationDialog from "@/components/RegistrationDialog";
import { Input } from "@/components/ui/input";
import { Search, Calendar } from "lucide-react";
import type { Event, Registration } from "@shared/schema";

export default function EventsPage() {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const { data: allRegistrations } = useQuery<Registration[]>({
    queryKey: ["/api/registrations"],
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  const handleRegister = (eventId: string) => {
    setSelectedEventId(eventId);
    setDialogOpen(true);
  };

  const selectedEvent = events?.find((e) => e.id === selectedEventId);

  const filteredEvents = events?.filter((event) =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl">
              <Calendar className="w-9 h-9 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">活動列表</h1>
              <p className="text-lg text-muted-foreground mt-2">
                瀏覽所有可報名的羽球活動，選擇您喜歡的時段立即報名
              </p>
            </div>
          </div>

          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="搜尋活動..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 rounded-full shadow-md border-0 text-lg"
              data-testid="input-search-events"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">載入中...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => {
                const eventRegistrations = allRegistrations?.filter(r => r.eventId === event.id) || [];
                const participantCount = eventRegistrations.reduce((acc, reg) => {
                  return acc + (reg.type === "team" ? 2 : 1);
                }, 0);
                return (
                  <EventCard
                    key={event.id}
                    id={event.id}
                    name={event.name}
                    startTime={new Date(event.startTime)}
                    endTime={new Date(event.endTime)}
                    status={event.status}
                    currentRegistrations={participantCount}
                    maxParticipants={event.maxParticipants || undefined}
                    onRegister={handleRegister}
                  />
                );
              })}
            </div>

            {filteredEvents.length === 0 && (
              <div className="text-center py-20">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                  <Calendar className="w-12 h-12 text-muted-foreground" />
                </div>
                <p className="text-xl text-muted-foreground font-medium">
                  {events?.length === 0 ? "目前沒有活動" : "沒有找到符合的活動"}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {selectedEvent && (
        <RegistrationDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          eventId={selectedEvent.id}
          eventName={selectedEvent.name}
          maxParticipants={selectedEvent.maxParticipants || undefined}
        />
      )}
    </div>
  );
}
