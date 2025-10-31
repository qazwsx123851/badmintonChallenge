import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Match {
  id: string;
  courtName: string;
  timeSlot: string;
  participants: string[];
  status: "scheduled" | "in_progress" | "finished";
}

interface MatchScheduleTableProps {
  matches: Match[];
  courts: string[];
  timeSlots: string[];
}

export default function MatchScheduleTable({
  matches,
  courts,
  timeSlots,
}: MatchScheduleTableProps) {
  const getMatchForCourtAndTime = (court: string, time: string) => {
    return matches.find(
      (m) => m.courtName === court && m.timeSlot === time
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in_progress":
        return <Badge className="bg-secondary">進行中</Badge>;
      case "finished":
        return <Badge variant="secondary">已結束</Badge>;
      default:
        return <Badge>已排程</Badge>;
    }
  };

  return (
    <Card className="p-6">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4 font-bold">時間 / 場地</th>
              {courts.map((court) => (
                <th key={court} className="text-center p-4 font-bold min-w-[200px]">
                  {court}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((time) => (
              <tr key={time} className="border-b last:border-0">
                <td className="p-4 font-medium text-sm whitespace-nowrap">
                  {time}
                </td>
                {courts.map((court) => {
                  const match = getMatchForCourtAndTime(court, time);
                  return (
                    <td key={`${court}-${time}`} className="p-4">
                      {match ? (
                        <div 
                          className="bg-muted/50 rounded-md p-3 hover-elevate cursor-pointer"
                          data-testid={`match-${match.id}`}
                        >
                          <div className="text-sm font-medium mb-2">
                            {match.participants.join(" vs ")}
                          </div>
                          {getStatusBadge(match.status)}
                        </div>
                      ) : (
                        <div className="text-center text-sm text-muted-foreground">
                          -
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
