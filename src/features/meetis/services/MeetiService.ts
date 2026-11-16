import { User } from "better-auth"
import { MeetiInput } from "../schema/meetiSchema"
import { IMeetiRepository, meetiRepository } from "./MeetiRepository"
import { communityRepository, ICommunityRepository } from "../../communities/services/CommunityRepository"
import { CommunityPolicy } from "@/app/dashboard/policies/CommunityPolicies"
import { MeetiPolicy } from "../policies/MeetiPolicy"


class MeetiService {
    constructor(
        private meetiRepository: IMeetiRepository,
        private communityRepository: ICommunityRepository

    ) { }
    async createMeeti(data: MeetiInput, user: User) {
     const community = await this.communityRepository.findById(data.communityId)
     if(!community || !CommunityPolicy.isAdmin(user, community)) {
        throw new Error('No tienes  Permiso')
     }
     await this.meetiRepository.insert({...data, createdBy: user.id})
    }
    async getUpcomingMeetiByUser(user: User) {
        const upcomingMeetis = await this.meetiRepository.findUpcomingByUserId(user.id)
        
        const enriched = await Promise.all(upcomingMeetis.map(async (meeti) => {

            return {
                data: meeti,
                attendanceCount: 0,
                context: {
                     isAdmin: MeetiPolicy.isAdmin(user, meeti)
                },
                permisions: {
                    canViewAttendents: MeetiPolicy.canViewAttendes(user, meeti),
                    canEdit: MeetiPolicy.canEdit(user, meeti),
                    canDelet: MeetiPolicy.canEdit(user, meeti),

                }
            }
        }))
        return enriched
    }
    async getMeetiById(meetiId: string) {
        const meeti = await this.meetiRepository.findById(meetiId)
        if(!meeti) throw new Error('Meeti No Encontrado')
        return meeti
    }
    async getMeetiWithPermissions(meetiId: string, user: User) {
        const meeti = await this.getMeetiById(meetiId)

        return {
            data: meeti,
            context: {
                isAdmin: MeetiPolicy.isAdmin(user, meeti),
                canEdit: MeetiPolicy.canEdit(user, meeti),
                canDelet: MeetiPolicy.canDelete(user, meeti)

            },
            permissions: {
                canEdit: CommunityPolicy,
                canDelete: CommunityPolicy
            }
        }
    }
     async updateMeeti(meetiId: string, data: MeetiInput, user: User) {
        const community = await this.communityRepository.findById(data.communityId)
        if (!community || !CommunityPolicy.isAdmin(user, community)) {
            throw new Error('No tienes Permisos')
        }

        const meeti = await this.getMeetiWithPermissions(meetiId, user)
        if(!meeti.permissions.canEdit) {
            throw new Error('No Autorizado')
        }
        await this.meetiRepository
                    .update({...data, createdBy: user.id}, meeti.data.id)
                

        }
        

    }


export const meetiService = new MeetiService(
                meetiRepository ,
                communityRepository
              
                )