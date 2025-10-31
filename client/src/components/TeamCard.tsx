import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Crown, Edit } from "lucide-react";

interface TeamCardProps {
  id: string;
  name: string;
  captainName: string;
  memberCount: number;
  isCaptain?: boolean;
  onEdit?: (id: string) => void;
  onView?: (id: string) => void;
}

export default function TeamCard({
  id,
  name,
  captainName,
  memberCount,
  isCaptain = false,
  onEdit,
  onView,
}: TeamCardProps) {
  return (
    <Card className="p-6 hover-elevate">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Users className="w-8 h-8 text-primary" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-lg font-bold truncate" data-testid={`text-team-name-${id}`}>{name}</h3>
            {isCaptain && (
              <Badge variant="secondary" className="flex-shrink-0">
                <Crown className="w-3 h-3 mr-1" />
                隊長
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Users className="w-4 h-4" />
            <span>{memberCount} 位成員</span>
            <span>•</span>
            <span>隊長: {captainName}</span>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView?.(id)}
              data-testid={`button-view-team-${id}`}
            >
              查看詳情
            </Button>
            {isCaptain && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit?.(id)}
                data-testid={`button-edit-team-${id}`}
              >
                <Edit className="w-4 h-4 mr-1" />
                編輯
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
