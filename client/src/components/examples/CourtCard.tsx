import CourtCard from '../CourtCard'

export default function CourtCardExample() {
  return (
    <div className="max-w-sm">
      <CourtCard
        id="a"
        name="A 場"
        isAvailable={false}
        currentMatch={{
          participants: ["快樂隊", "衝鋒隊"],
          time: "19:00 - 19:30"
        }}
        onEdit={(id) => console.log('Edit court:', id)}
      />
    </div>
  )
}
