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
        return <Badge className="bg-secondary rounded-full">進行中</Badge>;
      case "finished":
        return <Badge variant="secondary" className="rounded-full">已結束</Badge>;
      default:
        return <Badge className="rounded-full">已排程</Badge>;
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
