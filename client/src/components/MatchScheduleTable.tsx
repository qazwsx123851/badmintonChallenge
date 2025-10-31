import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, User } from "lucide-react";

interface Match {
  id: string;
  eventName: string;
  courtName: string;
  timeSlot: string;
  participants: string[];
  matchType: "singles" | "doubles";
  status: "scheduled" | "in_progress" | "completed" | "finished";
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
        return <Badge className="bg-orange-500 text-white rounded-full">進行中</Badge>;
      case "finished":
      case "completed":
        return <Badge variant="secondary" className="rounded-full">已結束</Badge>;
      default:
        return <Badge className="bg-green-500 text-white rounded-full">已排程</Badge>;
    }
  };

  return (
    <Card className="p-6 shadow-xl rounded-2xl border-0">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-primary/20">
              <th className="text-left p-4 font-bold bg-primary/5 rounded-tl-xl">時間 / 場地</th>
              {courts.map((court, idx) => (
                <th key={court} className={`text-center p-4 font-bold min-w-[200px] bg-primary/5 ${idx === courts.length - 1 ? 'rounded-tr-xl' : ''}`}>
                  {court}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((time, timeIdx) => (
              <tr key={time} className="border-b border-muted last:border-0 hover:bg-muted/30 transition-colors">
                <td className="p-4 font-bold text-sm whitespace-nowrap bg-muted/20">
                  {time}
                </td>
                {courts.map((court) => {
                  const match = getMatchForCourtAndTime(court, time);
                  return (
                    <td key={`${court}-${time}`} className="p-4">
                      {match ? (
                        <div 
                          className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl p-4 hover:shadow-lg transition-all duration-300 cursor-pointer border border-primary/20"
                          data-testid={`match-${match.id}`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs text-muted-foreground font-medium">{match.eventName}</span>
                            <Badge 
                              variant={match.matchType === "doubles" ? "default" : "secondary"}
                              className="rounded-full text-xs px-2 py-0.5"
                            >
                              {match.matchType === "doubles" ? (
                                <><Users className="w-3 h-3 mr-1 inline" />雙打</>
                              ) : (
                                <><User className="w-3 h-3 mr-1 inline" />單打</>
                              )}
                            </Badge>
                          </div>
                          <div className="text-sm font-bold mb-2 text-foreground">
                            {match.participants.join(" vs ")}
                          </div>
                          {getStatusBadge(match.status)}
                        </div>
                      ) : (
                        <div className="text-center text-sm text-muted-foreground py-4">
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
