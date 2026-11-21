import { headers } from "next/headers";
import { ProfileInput } from "../schemas/profileSchema";
import { IProfileRepository, profileRepository } from "./ProfileRepository";
import { auth } from "@/src/lib/auth";

class ProfileService {
    constructor(
        private profileRepository: IProfileRepository
    ){}

    async getProfileDetails(profileId : string) {
        return await this.profileRepository.findFullProfileById(profileId)
    }
    async updateProfile(data: ProfileInput) {
         const { name, image, bio } = data
        await auth.api.updateUser({
            body: {
                name,
                image,
                bio,
            },
            headers: await headers()
        })
    }
    }


export const profileService = new ProfileService(profileRepository)