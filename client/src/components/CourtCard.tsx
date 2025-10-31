import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Edit, Trash2 } from "lucide-react";

interface CourtCardProps {
  id: string;
  name: string;
  isAvailable: boolean;
  currentMatch?: {
    time: string;
    participants: string[];
  };
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function CourtCard({
  id,
  name,
  isAvailable,
  currentMatch,
  onEdit,
  onDelete,
}: CourtCardProps) {
  return (
    <Card className={`p-6 shadow-lg rounded-2xl border-0 card-hover fade-in ${
      isAvailable ? 'border-t-4 border-t-accent' : 'border-t-4 border-t-secondary'
    }`}>
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-md ${
              isAvailable 
                ? 'bg-gradient-to-br from-accent to-green-400' 
                : 'bg-gradient-to-br from-secondary to-orange-400'
            }`}>
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold" data-testid={`text-court-name-${id}`}>{name}</h3>
              <p className="text-sm text-muted-foreground font-medium">羽球場地</p>
            </div>
          </div>
          <Badge 
            className={`rounded-full px-4 ${
              isAvailable ? "bg-accent" : "bg-secondary"
            }`}
            data-testid={`badge-court-status-${id}`}
          >
            {isAvailable ? "可用" : "使用中"}
          </Badge>
        </div>

        {currentMatch && !isAvailable && (
          <div className="bg-muted/50 rounded-xl p-4 text-sm">
            <p className="font-bold mb-1 text-secondary">當前賽程</p>
            <p className="text-foreground font-medium">
              {currentMatch.participants.join(" vs ")}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {currentMatch.time}
            </p>
          </div>
        )}

        {isAvailable && (
          <div className="bg-accent/10 rounded-xl p-4 text-sm text-center">
            <p className="text-accent font-bold text-base">場地空閒中</p>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 rounded-full"
            onClick={() => onEdit?.(id)}
            data-testid={`button-edit-court-${id}`}
          >
            <Edit className="w-4 h-4 mr-1" />
            編輯
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 rounded-full text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
            onClick={() => onDelete?.(id)}
            data-testid={`button-delete-court-${id}`}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            刪除
          </Button>
        </div>
      </div>
    </Card>
  );
}
