import { MeetiPolicy } from "@/src/features/meetis/policies/MeetiPolicy"
import { meetiService } from "@/src/features/meetis/services/MeetiService"
import { requireAuth } from "@/src/lib/auth-server"
import Heading from "@/src/shared/components/typography/Heading"
import { generatePageTitle } from "@/src/shared/utils/metadata"
import { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { cache } from "react"

const getMeeti = cache(meetiService.findMeeti.bind(meetiService))

export async function generateMetadata({params} : PageProps<'/dashboard/meetis/[id]/attendees'>) : Promise<Metadata> {
    const { id } = await params
    const meeti = await getMeeti(id)
    if(!meeti) notFound()
    return {
        title: generatePageTitle(`Asistentes confirmados al Meeti: ${meeti.title}`)
    }
}

export default async function MeetiAttendeesPage( { params } : PageProps<'/dashboard/meetis/[id]/attendees'>) {

    const { session } = await requireAuth()
    if (!session) redirect('/auth/login')

  const { id } = await params
  const meeti = await getMeeti(id)
  if(!meeti) notFound()
  // Don't throw: production hides thrown messages (React error #441).
  if(!MeetiPolicy.canViewAttendes(session.user, meeti)) redirect('/dashboard/meetis')

  const attendees = await meetiService.getMeetiAttendees(meeti.id)

  return (
       <>
        <Heading>Asistentes al Meeti: {meeti.title}</Heading>
              <div className="mx-auto max-w-2xl mt-10">
        {attendees.length ? (
            <ul role="list" className="divide-y divide-gray-100 dark:divide-white/5 mt-10 shadow-lg p-10">
              {attendees.map(({user}) => (
                <li className="p-5" key={user.id}>
                  <p className="font-bold text-lg">{user.name}</p>
                  <p className="text-gray-600 text-sm">{user.email}</p>
                </li>
              ))}
            </ul>
        ) : <p className="text-center mt-10 text-lg">No hay asistentes confirmados</p>}
      </div>
    </>

  )
}
