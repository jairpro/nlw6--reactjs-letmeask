import toast, {Toaster} from "react-hot-toast"

export function notifyError(message: string) {
  toast.error(message)
}

export function notifySuccess(message: string) {
  toast.success(message)
}

export function Notification() {
  return (
    <Toaster />
  )
}