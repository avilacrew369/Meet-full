
import { db } from "@/src/db"
import { meeti, meetiLocations } from "@/src/db/schema"
import { FullMeeti, InsertMeeti, InsertMeetiLocation, SelectMeeti } from "../types/meeti.types"
import { User } from "better-auth"
import { format } from "date-fns"
import { eq } from "drizzle-orm"
import { io } from "next/cache"
import { connection } from "next/server"

export interface IMeetiRepository {
    insert(data: InsertMeeti) : Promise<void>
    findUpcomingByUserId(userId: string) : Promise<SelectMeeti[]>
    findUpcoming() : Promise<SelectMeeti[]>
    findById(id: string) : Promise<SelectMeeti | null>
    findFullById(id: string) : Promise<FullMeeti | null>
    update(data: InsertMeeti, meetiId: string) : Promise<void>
    findUpcomingByCommunity(communityId: string) : Promise<SelectMeeti[]>
    findByCategory(categoryId: string) : Promise<SelectMeeti[]>
     delete(meetiId: string) : Promise<void>
}

class MeetiRepository implements IMeetiRepository {
   async insert(data: InsertMeeti): Promise<void> {

       const [insertedMeeti] = await db
                .insert(meeti)
                .values(data)
                .returning()

        if(!insertedMeeti.virtual && data.location) {
           await this.insertLocation({
            meetiId: insertedMeeti.id,
            ...data.location
           })
        }

   }
    async insertLocation(data: InsertMeetiLocation) {
     await db.insert(meetiLocations)
            .values(data)
   }

   async findUpcomingByUserId(userId: string): Promise<SelectMeeti[]> {
        await io()
        const today = format(new Date(), 'yyyy-MM-dd')
        
        const result = await db.query.meeti.findMany({
            where: {
                AND : [
                    {createdBy: {eq: userId}},
                    {date: {gte: today}}
              
            ]

        },
        orderBy: {
            date: 'asc'

        }
       })
       return result
   }
   async findUpcoming(): Promise<SelectMeeti[]> {
        await io()
        const now = new Date()
        const nowDate = now.toISOString().slice(0, 10)
        const nowTime = now.toTimeString().slice(0, 5)
    
        const result = await db.query.meeti.findMany({
        where: {
            OR: [
                {date: {gt: nowDate}},
                {
                    AND: [
                        {date: {eq: nowDate}},
                        {time: {gte: nowTime}}
                    ]
                }
            ]
        },
        orderBy: {
            date: 'asc',
            time: 'asc'
        },
        limit: 3
       })
       return result
   }
   async findById(id: string) {
       const result = await db.query.meeti.findFirst({
        where: {
            id
        },
        with: {
            location: true
        }
       })
       return result ?? null
   }
    async findFullById(id: string) {
       const result = await db.query.meeti.findFirst({
            where: {
                id
            },
            with: {
                location: true,
                category: true,
                community: true,
                admin: true
            }
       })
       return result ?? null
   }
   async update(data: InsertMeeti, meetiId: string): Promise<void> {
        const [updateMeeti]  =  await db.update(meeti).set(data)
            .where(eq(meeti.id, meetiId))
            .returning()

    // Actualizar ubicacion si el evento es presencial
    if(!updateMeeti.virtual && data.location ) {

        const locationExists = await db.query.meetiLocations.findFirst({
            where: {
                meetiId: updateMeeti.id
            }
        })
        if(locationExists) {
            await db.update(meetiLocations).set(data.location)
            .where(eq(meetiLocations.meetiId, updateMeeti.id))

        } else {
            await this.insertLocation({ meetiId: updateMeeti.id,...data.location})
        }
    } 
   }
   async findUpcomingByCommunity(communityId: string): Promise<SelectMeeti[]> {
        await io()
        const today = format(new Date(), 'yyyy-MM-dd') 
       return db.query.meeti.findMany({
        where: {
            communityId,
            date: {
                gte: today
            }

        },
        limit: 3,
        orderBy: {
            date: 'asc'
        }

       })
   }
     async findByCategory(categoryId: string): Promise<SelectMeeti[]> {
        await connection()
       const today = format(new Date(), 'yyyy-MM-dd')
       const result = await db.query.meeti.findMany({
        where: {
            categoryId,
            date: {
                gte: today
            }
        },
        orderBy: {
            date: 'asc'
        },
        limit: 10
       })
       return result
   }
   async delete(meetiId: string): Promise<void> {
    await db.delete(meeti).where(eq(meeti.id, meetiId))
       
   }
   async searchByTopic(query: string): Promise<SelectMeeti[]> {
    const meetis = await db.query.meeti.findMany({
        where: {
            OR: [
                {title: {ilike: `%${query}%`} },
                {details: {ilike: `%${query}%`}},
            ]
        }
    })
    return meetis
       
   }
   
   }



export const meetiRepository = new  MeetiRepository()