import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, MapPin } from "lucide-react";
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
    <Card className="p-6 hover-elevate">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2" data-testid={`text-event-name-${id}`}>{name}</h3>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{format(startTime, "yyyy/MM/dd")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{format(startTime, "HH:mm")} - {format(endTime, "HH:mm")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{currentRegistrations}{maxParticipants ? ` / ${maxParticipants}` : ""} 人報名</span>
              </div>
            </div>
          </div>
          <Badge 
            variant={isOpen ? "default" : "secondary"}
            data-testid={`badge-status-${id}`}
          >
            {status}
          </Badge>
        </div>

        <div className="flex gap-2">
          <Button
            variant="default"
            className="flex-1"
            disabled={!isOpen || isFull}
            onClick={() => onRegister?.(id)}
            data-testid={`button-register-${id}`}
          >
            {isFull ? "已額滿" : "立即報名"}
          </Button>
          <Button variant="outline" data-testid={`button-details-${id}`}>
            查看詳情
          </Button>
        </div>
      </div>
    </Card>
  );
}
