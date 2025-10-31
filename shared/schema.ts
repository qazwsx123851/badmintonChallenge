import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email"),
});

export const teams = pgTable("teams", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  captainId: varchar("captain_id").notNull(),
  memberIds: text("member_ids").array().notNull().default(sql`ARRAY[]::text[]`),
});

export const courts = pgTable("courts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  isAvailable: boolean("is_available").notNull().default(true),
});

export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  status: text("status").notNull().default("開放報名"),
  maxParticipants: integer("max_participants"),
});

export const registrations = pgTable("registrations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventId: varchar("event_id").notNull(),
  type: text("type").notNull(),
  userId: varchar("user_id"),
  teamId: varchar("team_id"),
  participantName: text("participant_name"),
  registeredAt: timestamp("registered_at").notNull().default(sql`now()`),
});

export const matches = pgTable("matches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventId: varchar("event_id").notNull(),
  courtId: varchar("court_id").notNull(),
  startTime: timestamp("start_time").notNull(),
  participantIds: text("participant_ids").array().notNull(),
  status: text("status").notNull().default("scheduled"),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });

export const insertTeamSchema = createInsertSchema(teams)
  .omit({ id: true })
  .extend({
    memberIds: z
      .array(z.string())
      .max(1, "隊伍成員上限為 1 位隊長加 1 位隊員（共 2 人）"),
  });

export const insertCourtSchema = createInsertSchema(courts).omit({ id: true });

export const insertEventSchema = createInsertSchema(events)
  .omit({ id: true })
  .extend({
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
    maxParticipants: z
      .number()
      .min(1, "人數上限至少需 1 人")
      .max(100, "人數上限不可超過 100 人"),
  });

export const insertRegistrationSchema = createInsertSchema(registrations)
  .omit({ id: true, registeredAt: true })
  .extend({
    type: z.enum(["individual", "team"], {
      errorMap: () => ({ message: "報名類型必須是 individual 或 team" }),
    }),
  })
  .refine(
    (data) => {
      if (data.type === "individual") {
        return !!data.userId || !!data.participantName;
      }
      return !!data.teamId;
    },
    {
      message: "個人報名需提供 userId 或 participantName，隊伍報名需提供 teamId",
    },
  );

export const insertMatchSchema = createInsertSchema(matches)
  .omit({ id: true })
  .extend({
    startTime: z.coerce.date(),
    participantIds: z
      .array(z.string())
      .min(2, "比賽至少需要 2 位參與者")
      .max(10, "單一場地最多容納 10 位參與者"),
  });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type Team = typeof teams.$inferSelect;
export type InsertCourt = z.infer<typeof insertCourtSchema>;
export type Court = typeof courts.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;
export type InsertRegistration = z.infer<typeof insertRegistrationSchema>;
export type Registration = typeof registrations.$inferSelect;
export type InsertMatch = z.infer<typeof insertMatchSchema>;
export type Match = typeof matches.$inferSelect;
