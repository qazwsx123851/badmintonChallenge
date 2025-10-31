import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users } from "lucide-react";
import { format } from "date-fns";

interface EventCardProps {
  id: string;
  name: string;
  startTime: Date;
  endTime: Date;
  status: string;
  currentRegistrations: number;
  maxParticipants?: number;
  onRegister?: (id: string) => void;
}

export default function EventCard({
  id,
  name,
  startTime,
  endTime,
  status,
  currentRegistrations,
  maxParticipants,
  onRegister,
}: EventCardProps) {
  const isOpen = status === "開放報名";
  const isFull = maxParticipants ? currentRegistrations >= maxParticipants : false;

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl border-0">
      <div className="h-2 bg-gradient-to-r from-primary via-secondary to-accent"></div>
      <div className="p-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-3" data-testid={`text-event-name-${id}`}>{name}</h3>
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-medium">{format(startTime, "yyyy/MM/dd")}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-secondary" />
                  </div>
                  <span className="font-medium">{format(startTime, "HH:mm")} - {format(endTime, "HH:mm")}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-accent" />
                  </div>
                  <span className="font-medium" data-testid={`text-registration-count-${id}`}>{currentRegistrations}{maxParticipants ? ` / ${maxParticipants}` : ""} 人報名</span>
                </div>
              </div>
            </div>
            <Badge 
              variant={isOpen ? "default" : "secondary"}
              className="rounded-full px-4 py-1"
              data-testid={`badge-status-${id}`}
            >
              {status}
            </Badge>
          </div>

          <div className="flex gap-3 mt-2">
            <Button
              className="flex-1 rounded-full shadow-md font-medium"
              disabled={!isOpen || isFull}
              onClick={() => onRegister?.(id)}
              data-testid={`button-register-${id}`}
            >
              {isFull ? "已額滿" : "立即報名"}
            </Button>
            <Button variant="outline" className="rounded-full" data-testid={`button-details-${id}`}>
              查看詳情
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
