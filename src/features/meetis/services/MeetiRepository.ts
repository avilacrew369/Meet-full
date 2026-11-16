
import { db } from "@/src/db"
import { meeti, meetiLocations } from "@/src/db/schema"
import { InsertMeeti, InsertMeetiLocation, SelectMeeti } from "../types/meeti.types"
import { User } from "better-auth"
import { format } from "date-fns"
import { eq } from "drizzle-orm"

export interface IMeetiRepository {
    insert(data: InsertMeeti) : Promise<void>
    findUpcomingByUserId(userId: string) : Promise<SelectMeeti[]>
    findById(id: string) : Promise<SelectMeeti | null>
    update(data: InsertMeeti, meetiId: string) : Promise<void>
    
    
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
   
   }



export const meetiRepository = new  MeetiRepository()