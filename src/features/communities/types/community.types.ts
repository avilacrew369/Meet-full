import { community, communityMembers } from '@/src/db/schema/'
import { User } from '../../auth/types/auth.types'

export type InserCommunity = typeof community.$inferInsert
export type SelectCommunity = typeof community.$inferSelect
export type SelectCommunityMembers = typeof communityMembers.$inferSelect

export type JoinedCommunity = SelectCommunityMembers & {
    community:SelectCommunity
    user: User
}

export type CommunityPermissions = {
    canEdit: boolean
    canDelete: boolean
    canJoin: boolean
    canLeave: boolean
    canViewMembers: boolean

}
export type CommunityContext = {
    isAdmin: boolean
    isMember: boolean
}
export type CommunityWithPermissions = {
    data: SelectCommunity
    memberCount: number
    context: CommunityContext
    permissions: CommunityPermissions
}
// Alias for backward compatibility if needed
export type CommunityWithPermissios = CommunityWithPermissions

export type CommunityWithMembersCount = Omit<SelectCommunity, 'creteBy' | 'createdAt'> & {
     membersCount: string
}