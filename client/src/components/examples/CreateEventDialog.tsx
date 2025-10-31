import CreateEventDialog from '../CreateEventDialog'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function CreateEventDialogExample() {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <Button onClick={() => setOpen(true)}>建立新活動</Button>
      <CreateEventDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={(data) => console.log('Event created:', data)}
      />
    </div>
  )
}
