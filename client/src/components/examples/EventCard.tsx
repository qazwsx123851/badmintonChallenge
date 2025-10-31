import EventCard from '../EventCard'

export default function EventCardExample() {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(19, 0, 0, 0)

  const endTime = new Date(tomorrow)
  endTime.setHours(21, 0, 0, 0)

  return (
    <div className="max-w-md">
      <EventCard
        id="1"
        name="週五夜間歡樂場"
        startTime={tomorrow}
        endTime={endTime}
        status="開放報名"
        currentRegistrations={12}
        maxParticipants={20}
        onRegister={(id) => console.log('Register for event:', id)}
      />
    </div>
  )
}
