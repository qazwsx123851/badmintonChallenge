import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Flame,
  Rocket,
  Search,
  Sparkles,
} from "lucide-react";
import type { Event, Registration } from "@shared/schema";
import EventCard from "@/components/EventCard";
import RegistrationDialog from "@/components/RegistrationDialog";
import PageLayout from "@/components/layout/PageLayout";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { FilterChip } from "@/components/ui/chip";

type FilterKey = "all" | "upcoming" | "opened" | "closed";

const FILTER_CONFIG: Record<
  FilterKey,
  { label: string; icon: React.ReactNode; predicate: (event: Event) => boolean }
> = {
  all: {
    label: "\u5168\u90e8",
    icon: <Sparkles className="w-4 h-4" />,
    predicate: () => true,
  },
  upcoming: {
    label: "\u5373\u5c07\u958b\u59cb",
    icon: <Rocket className="w-4 h-4" />,
    predicate: (event) => new Date(event.startTime) > new Date(),
  },
  opened: {
    label: "\u958b\u653e\u5831\u540d",
    icon: <Flame className="w-4 h-4" />,
    predicate: (event) => event.status === "\u958b\u653e\u5831\u540d",
  },
  closed: {
    label: "\u5df2\u7d50\u675f",
    icon: <Clock className="w-4 h-4" />,
    predicate: (event) => event.status !== "\u958b\u653e\u5831\u540d",
  },
};

export default function EventsPage() {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");

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

  const selectedEvent = events?.find((event) => event.id === selectedEventId);

  const counts = useMemo(() => {
    return (Object.keys(FILTER_CONFIG) as FilterKey[]).reduce<
      Record<FilterKey, number>
    >(
      (acc, key) => ({
        ...acc,
        [key]:
          events?.filter((event) => FILTER_CONFIG[key].predicate(event))
            .length ?? 0,
      }),
      { all: events?.length ?? 0, upcoming: 0, opened: 0, closed: 0 },
    );
  }, [events]);

  const filteredEvents = useMemo(() => {
    if (!events) return [];
    const normalizedQuery = searchQuery.trim().toLowerCase();
    return events.filter((event) => {
      const textMatch = event.name.toLowerCase().includes(normalizedQuery);
      return textMatch && FILTER_CONFIG[filter].predicate(event);
    });
  }, [events, filter, searchQuery]);

  const placeholderCards = Array.from({ length: 6 });

  return (
    <PageLayout
      title="\u6d3b\u52d5\u5217\u8868"
      subtitle="\u5373\u6642\u638c\u63e1\u7fbd\u7403\u6d3b\u52d5\u3001\u5831\u540d\u72c0\u614b\u8207\u8cfd\u4e8b\u71b1\u5ea6\uff0c\u6311\u9078\u6700\u9069\u5408\u4f60\u7684\u6311\u6230\u3002"
      heroIcon={<Calendar className="w-9 h-9 text-white" />}
      actionSlot={
        <div className="flex items-center gap-3 flex-wrap justify-end">
          {(Object.keys(FILTER_CONFIG) as FilterKey[]).map((key) => {
            const { icon, label } = FILTER_CONFIG[key];
            return (
              <FilterChip
                key={key}
                active={filter === key}
                icon={icon}
                label={label}
                count={counts[key]}
                onClick={() => setFilter(key)}
              />
            );
          })}
        </div>
      }
    >
      <div className="space-y-8">
        <div className="sticky top-20 z-30">
          <div className="rounded-[28px] bg-white shadow-[0_24px_60px_-30px_rgba(15,23,42,0.25)] border border-slate-200 px-4 py-4 sm:py-5 sm:px-8 flex flex-col gap-4">
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="\u641c\u5c0b\u6d3b\u52d5..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="pl-12 h-14 rounded-full border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus-visible:ring-primary/60"
                data-testid="input-search-events"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              {(Object.keys(FILTER_CONFIG) as FilterKey[]).map((key) => {
                const { icon, label } = FILTER_CONFIG[key];
                return (
                  <FilterChip
                    key={key}
                    active={filter === key}
                    icon={icon}
                    label={label}
                    count={counts[key]}
                    onClick={() => setFilter(key)}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {placeholderCards.map((_, index) => (
              <Skeleton
                key={index}
                className="h-72 rounded-3xl bg-slate-100 border border-slate-200"
              />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${filter}-${searchQuery}`}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { staggerChildren: 0.05, delayChildren: 0.05 },
                },
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredEvents.map((event) => {
                const registrationsForEvent =
                  allRegistrations?.filter(
                    (registration) => registration.eventId === event.id,
                  ) ?? [];
                const participantCount = registrationsForEvent.reduce(
                  (acc, registration) =>
                    acc + (registration.type === "team" ? 2 : 1),
                  0,
                );
                return (
                  <motion.div
                    key={event.id}
                    variants={{
                      hidden: { opacity: 0, y: 24, scale: 0.98 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: { duration: 0.34, ease: "easeOut" },
                      },
                    }}
                  >
                    <EventCard
                      id={event.id}
                      name={event.name}
                      startTime={new Date(event.startTime)}
                      endTime={new Date(event.endTime)}
                      status={event.status}
                      currentRegistrations={participantCount}
                      maxParticipants={event.maxParticipants || undefined}
                      onRegister={handleRegister}
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        )}

        {!isLoading && filteredEvents.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 rounded-3xl bg-white border border-slate-200 shadow-[0_24px_50px_-28px_rgba(15,23,42,0.25)]"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
              <Calendar className="w-12 h-12 text-slate-400" />
            </div>
            <p className="text-xl text-slate-600 font-medium">
              {events?.length === 0 ? "\u76ee\u524d\u6c92\u6709\u6d3b\u52d5" : "\u6c92\u6709\u627e\u5230\u7b26\u5408\u7684\u6d3b\u52d5"}
            </p>
          </motion.div>
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
    </PageLayout>
  );
}
