import TeamCard from '../TeamCard'

export default function TeamCardExample() {
  return (
    <div className="max-w-md">
      <TeamCard
        id="1"
        name="快樂羽球隊"
        captainName="王大明"
        memberCount={6}
        isCaptain={true}
        onEdit={(id) => console.log('Edit team:', id)}
        onView={(id) => console.log('View team:', id)}
      />
    </div>
  )
}
