import EditMeeti from "@/src/features/meetis/components/EditMeeti";
import { MeetiPolicy } from "@/src/features/meetis/policies/MeetiPolicy";
import { meetiService } from "@/src/features/meetis/services/MeetiService";
import { requireAuth } from "@/src/lib/auth-server";
import Heading from "@/src/shared/components/typography/Heading";
import { generatePageTitle } from "@/src/shared/utils/metadata";
import { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";

const getMeeti = cache(meetiService.findMeeti.bind(meetiService))

export async function generateMetadata({params} : PageProps<'/dashboard/meetis/[id]/edit'>) : Promise<Metadata> {
    const { id } = await params
    const meeti = await getMeeti(id)
    if(!meeti) notFound()
    return {
        title: generatePageTitle(`Editar Meeti: ${meeti.title}`)
    }
}


export default async function EditMeetiPage(props: PageProps<'/dashboard/meetis/[id]/edit'>) {

        const { session } = await requireAuth()
        if(!session) redirect('/auth/login')

        const { id } = await props.params

        const meeti = await getMeeti(id)
        if(!meeti) notFound()
        // Don't throw: production hides thrown messages (React error #441).
        if(!MeetiPolicy.canEdit(session.user, meeti)) redirect('/dashboard/meetis')
    return (
        <>
        <Heading>Editar Meeti :{'  '} {meeti.title} </Heading>

          <Link
                href="/dashboard/meetis"
                className="mt-5 block lg:inline-block text-center bg-orange-500 hover:bg-orange-600 transition-colors text-xs lg:text-xl text-white py-3 px-10  font-bold"
            >Volver a mis Meetis</Link>

            <EditMeeti
                meeti={meeti}
            />

        </>
    )
}
