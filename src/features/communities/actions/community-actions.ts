"use server"
import { success } from "zod"
import { CommunityInput, CommunitySchema } from "../schema/communitySchema"
import { requireAuth } from "@/src/lib/auth-server"
import { communityService } from "../services/CommunityService"
import { error } from "console"

export async function createCommunityAction(input: CommunityInput) {
   
    const data = CommunitySchema.safeParse(input)
    if(!data.success) {
        return {
            error: 'Hubo un error',
            success: '',
        }
    }
    const { session } = await requireAuth()
     if(!session) {
        return {
            error: 'Hubo un error',
            success: '',
        }
    }
    await communityService.createCommunity(data.data, session.user.id)
    return {
        error: '',
        success: 'Comunidad crteada correctamente'
    }
    
}