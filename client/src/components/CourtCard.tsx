import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Edit } from "lucide-react";

interface CourtCardProps {
  id: string;
  name: string;
  isAvailable: boolean;
  currentMatch?: {
    participants: string[];
    time: string;
  };
  onEdit?: (id: string) => void;
}

export default function CourtCard({
  id,
  name,
  isAvailable,
  currentMatch,
  onEdit,
}: CourtCardProps) {
  return (
    <Card className="p-6 hover-elevate">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              isAvailable ? 'bg-accent/20' : 'bg-secondary/20'
            }`}>
              <MapPin className={`w-6 h-6 ${isAvailable ? 'text-accent' : 'text-secondary'}`} />
            </div>
            <div>
              <h3 className="text-lg font-bold" data-testid={`text-court-name-${id}`}>{name}</h3>
              <p className="text-sm text-muted-foreground">羽球場地</p>
            </div>
          </div>
          <Badge 
            variant={isAvailable ? "default" : "secondary"}
            className={isAvailable ? "bg-accent" : ""}
            data-testid={`badge-court-status-${id}`}
          >
            {isAvailable ? "可用" : "使用中"}
          </Badge>
        </div>

        {currentMatch && !isAvailable && (
          <div className="bg-muted/50 rounded-md p-3 text-sm">
            <p className="font-medium mb-1">當前賽程</p>
            <p className="text-muted-foreground">{currentMatch.participants.join(" vs ")}</p>
            <p className="text-xs text-muted-foreground mt-1">{currentMatch.time}</p>
          </div>
        )}

        {isAvailable && (
          <div className="bg-accent/10 rounded-md p-3 text-sm text-center">
            <p className="text-accent font-medium">場地空閒中</p>
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit?.(id)}
          data-testid={`button-edit-court-${id}`}
        >
          <Edit className="w-4 h-4 mr-1" />
          編輯場地
        </Button>
      </div>
    </Card>
  );
}
