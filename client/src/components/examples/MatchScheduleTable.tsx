import MatchScheduleTable from '../MatchScheduleTable'

export default function MatchScheduleTableExample() {
  const matches = [
    {
      id: "1",
      courtName: "A 場",
      timeSlot: "19:00 - 19:30",
      participants: ["快樂隊", "衝鋒隊"],
      status: "in_progress" as const,
    },
    {
      id: "2",
      courtName: "B 場",
      timeSlot: "19:00 - 19:30",
      participants: ["王大明", "李小華"],
      status: "scheduled" as const,
    },
    {
      id: "3",
      courtName: "A 場",
      timeSlot: "19:30 - 20:00",
      participants: ["夢想隊", "閃電隊"],
      status: "scheduled" as const,
    },
  ];

  const courts = ["A 場", "B 場", "C 場"];
  const timeSlots = ["19:00 - 19:30", "19:30 - 20:00", "20:00 - 20:30", "20:30 - 21:00"];

  return (
    <MatchScheduleTable 
      matches={matches} 
      courts={courts} 
      timeSlots={timeSlots}
    />
  )
}
