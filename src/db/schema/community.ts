import { pgTable, uuid, varchar, text, timestamp } from  "drizzle-orm/pg-core";
import { users } from "./auth-schema";


export const community = pgTable('communities', {
    id: uuid('id').default("0").primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    createdBy: text('creted_by').notNull(),
    image: varchar('image', {length: 100}).notNull()
   
});

export const communityMembers = pgTable('community_members', {
    communityId: uuid('community_id').references(() => community.id, {onDelete: 'cascade'}).notNull(),
    userId: text('user_id').references(() => users.id, {onDelete: 'cascade'}).notNull(),
    joinedAt: timestamp('joined_at').defaultNow()
})
