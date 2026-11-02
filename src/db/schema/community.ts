import { pgTable, uuid, varchar, text, timestamp } from  "drizzle-orm/pg-core";


export const community = pgTable('communities', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    createdBy: text('creted_by').notNull(),
    image: varchar('image', {length: 100}).notNull()
   
})
