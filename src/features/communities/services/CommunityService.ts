
import { CommunityInput } from "../schema/communitySchema";
import { communityRepository, ICommunityRepository } from "./CommunityRepository";
import { User } from "../../auth/types/auth.types";
import { CommunityPolicy } from "@/app/dashboard/policies/CommunityPolicies";
import { MembershipPolicy } from "@/app/dashboard/policies/MembershipPolicy";
import { CommunityWithPermissions } from "../types/community.types";


class CommunityService {
    constructor (
        private communityRepository: ICommunityRepository
    ) {}
    async createCommunity(data : CommunityInput, userId: string){
        const community = await this.communityRepository.create({
           ...data,
            createdBy: userId
        })
        return community
      
}

    async getUserCommunities(user: User): Promise<CommunityWithPermissions[]> {
       const communities = await this.communityRepository.findByUser(user.id )

       const enriched = await Promise.all(communities.map( async(community) => {
        
        const isMember = true
        const isAdmin = CommunityPolicy.isAdmin(user, community)

        return {
            data: community,
            memberCount: 1,
            context: {
                isMember,
                isAdmin
            },
            permissions: {
                canEdit: CommunityPolicy.canEdit(user, community),
                    canDelete: CommunityPolicy.canDelete(user, community),
                    canJoin: MembershipPolicy.canJoin(user, community, isMember),
                    canLeave: MembershipPolicy.canLeave(user, community, isMember),
                    canViewMembers: CommunityPolicy.canViewMembers(user, community)
            }
        }
       }))
       return enriched
    }
}

export const communityService = new CommunityService(communityRepository)