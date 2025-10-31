import { useState } from "react";
import EventCard from "@/components/EventCard";
import RegistrationDialog from "@/components/RegistrationDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar } from "lucide-react";

export default function EventsPage() {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - todo: remove mock functionality
  const mockEvents = [
    {
      id: "1",
      name: "週五夜間歡樂場",
      startTime: new Date(2025, 10, 7, 19, 0),
      endTime: new Date(2025, 10, 7, 21, 0),
      status: "開放報名",
      currentRegistrations: 12,
      maxParticipants: 20,
    },
    {
      id: "2",
      name: "週六早晨練習賽",
      startTime: new Date(2025, 11, 8, 8, 0),
      endTime: new Date(2025, 11, 8, 10, 0),
      status: "開放報名",
      currentRegistrations: 8,
      maxParticipants: 16,
    },
    {
      id: "3",
      name: "週日下午友誼賽",
      startTime: new Date(2025, 11, 9, 14, 0),
      endTime: new Date(2025, 11, 9, 17, 0),
      status: "報名截止",
      currentRegistrations: 20,
      maxParticipants: 20,
    },
  ];

  const handleRegister = (eventId: string) => {
    setSelectedEventId(eventId);
    setDialogOpen(true);
  };

  const handleRegistrationSubmit = (data: any) => {
    console.log("Registration data:", data);
  };

  const selectedEvent = mockEvents.find((e) => e.id === selectedEventId);

  const filteredEvents = mockEvents.filter((event) =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">活動列表</h1>
          </div>
          <p className="text-lg text-muted-foreground mb-6">
            瀏覽所有可報名的羽球活動，選擇您喜歡的時段立即報名
          </p>

          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="搜尋活動..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-events"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              {...event}
              onRegister={handleRegister}
            />
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">沒有找到符合的活動</p>
          </div>
        )}
      </div>

      {selectedEvent && (
        <RegistrationDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          eventName={selectedEvent.name}
          onSubmit={handleRegistrationSubmit}
        />
      )}
    </div>
  );
}
