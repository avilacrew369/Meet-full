import Link from "next/link"
import { CommunityPermissions } from "../types/community.types"
import CommunityMemberShip from "./CommunityMemberShip"

type Props = {
    permissions: CommunityPermissions
    communityId: string
}


export default function CommunityActionsPanel({permissions, communityId }: Props) {
  return (
    <div className="flex w-full justify-end">

        {permissions.canEdit && (
            <Link
                href={`/dashboard/communities/${communityId}/edit`}
                className="font-bold text-lg bg-orange-600 px-5 py-2 text-white"
                target="_blanc"
            >Editar Comunidad
            
            </Link>
        )}
          { permissions.canJoin || permissions.canLeave ? (
            <CommunityMemberShip 
                permissions={permissions}
                communityId={communityId}
            />
        ): null}
    </div>
  )
}