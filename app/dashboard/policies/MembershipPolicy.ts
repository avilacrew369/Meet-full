import { SelectCommunity } from "@/src/features/communities/types/community.types";
import { User } from "better-auth";

export class MembershipPolicy {
    static canJoin(user: User, community: SelectCommunity, isMember: boolean) : boolean {
        if(isMember) return false

        // el admin no se puede unir
        if(community.createdBy === user.id) return false

        return true
    }
    static canLeave(user: User, community: SelectCommunity, isMember: boolean) : boolean {
        // el ouner no puede salir
        if(community.createdBy === user.id) return false

        return isMember
    }
}