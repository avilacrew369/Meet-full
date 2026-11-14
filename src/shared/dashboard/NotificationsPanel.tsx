import { useEffect, useState } from 'react'
import { BellIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Pusher from 'pusher-js'
import { useSession } from '@/src/lib/auth-client'

function NotificationCount() {
  const [totalNotifications, setTotalNotifications] = useState(0)
  const { data } = useSession()
  const pathname = usePathname()
  const userId = data?.user.id
  const badgeCount =
    userId && pathname !== '/dashboard/notifications' ? totalNotifications : 0

  useEffect(() => {
    if (!userId || pathname === '/dashboard/notifications') return

    const controller = new AbortController()
    void fetch('/api/user/notifications', { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Failed to load notifications: ${response.status}`)
        }

        const count: unknown = await response.json()
        if (typeof count !== 'number' || !Number.isSafeInteger(count) || count < 0) {
          throw new Error('Invalid unread notification count')
        }

        if (!controller.signal.aborted) {
          setTotalNotifications(count)
        }
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          console.error('Failed to load unread notifications', error)
        }
      })

    return () => controller.abort()
  }, [pathname, userId])

  useEffect(() => {
    if (!userId) return

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!
    })
    const id = `notifications-chanel-${userId}`
    const channel = pusher.subscribe(id)
    channel.bind('new-notification', () => {
      setTotalNotifications((prev) => prev + 1)
    })
    return () => {
      channel.unbind_all()
      channel.unsubscribe()
    }
  }, [userId])

  return (
    <Link
      href={'/dashboard/notifications'}
      className="relative rounded-full p-1 text-gray-400 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500 dark:hover:text-white"
    >
      <span className="sr-only">View notifications</span>
      <BellIcon aria-hidden="true" className="size-6" />
      {badgeCount > 0 && (
        <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white p-2">
          {badgeCount}
        </span>
      )}
    </Link>
  )
}

export default function NotificationsPanel() {
  return <NotificationCount />
}