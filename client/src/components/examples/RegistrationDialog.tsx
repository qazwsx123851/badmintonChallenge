import RegistrationDialog from '../RegistrationDialog'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function RegistrationDialogExample() {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <Button onClick={() => setOpen(true)}>開啟報名對話框</Button>
      <RegistrationDialog
        open={open}
        onOpenChange={setOpen}
        eventName="週五夜間歡樂場"
        onSubmit={(data) => console.log('Registration submitted:', data)}
      />
    </div>
  )
}
