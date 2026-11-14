import { notifications } from "@/src/db/schema/notifications"

export type SelectNotification = typeof notifications.$inferSelect
export type InsertNotification = typeof notifications.$inferInsert


