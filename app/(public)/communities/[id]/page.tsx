import CommunityActionsPanel from "@/src/features/communities/components/CommunityActionsPanel"
import UpcomingCommunityMeetis from "@/src/features/communities/components/UpcomingCommunityMeetis"
import { communityService } from "@/src/features/communities/services/CommunityService"
import OrganizerCard from "@/src/features/meetis/components/OrganizerCard"
import { getServerSession } from "@/src/lib/auth-server"
import Heading from "@/src/shared/components/typography/Heading"
import { generatePageTitle } from "@/src/shared/utils/metadata"
import { pluralize } from "@/src/shared/utils/strings"
import { Metadata } from "next"
import Image from "next/image"
import { cache } from "react"



export const instant = false

const getCommunityDetailsCached = cache( async (id: string) => {
  const session = (await getServerSession())
  const community = await communityService.getComunityDetails(id, session?.user)
   return community
})

export async function generateMetadata({params} :
           PageProps<'/communities/[id]'>) : Promise<Metadata>  {
  const {id } = await params
  const community = await getCommunityDetailsCached(id)
    
  return {
    title: generatePageTitle(`comunidad ${community.data.name}`)
  }
}

export default async function CommunityPage(props: PageProps<'/communities/[id]'>) {

  const { id } = await props.params
  
  const community = await getCommunityDetailsCached(id,)
  return (
    <> 
      <main className="max-auto space-y-5 p-10">
         {community.permissions && (
          <CommunityActionsPanel 
            permissions={community.permissions}
            communityId={community.data.id}
           />

        )}
        
        <div className="grid grid-cols-3 items- mt-10">
            
          <div className="lg:col-span-2 space-y-5">
            <div className="relative size-64 mx-auto aspect-square overflow-hidden rounded-full">
              <Image
                loading="eager"
                src={community.data.image}
                alt={`Imagen de la comunidad ${community.data.name}`}
                width={600}
                height={600}
                className="object-cover size-64"
              />
            </div>
            
            <Heading className="text-center"  >{community.data.name}</Heading>
            <p className="text-gray-600 text-lg text-center">{community.data.description}</p>
            <p className="text-gray-600 text-sm text-center"> 
              {community.memberCount} {''}
              {pluralize('Miembro', community.memberCount)}
            </p>
          </div>
          <div className="bg-slate-100 p-5 rounded-2xl">
            <OrganizerCard 
              organizer={community.data.admin}
            
            />
            {/* Admin Aquí */}
          </div>
         
        </div>
      </main>
      <UpcomingCommunityMeetis  communityId={id}/>

    </>
  )
}