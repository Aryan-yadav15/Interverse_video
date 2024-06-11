import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const InterVerseDB = pgTable("mockInterview", {
  id: serial('id').primaryKey(),
  jsonMockResp: text('jsonMockResp').notNull(),
  jobPosition: varchar('jobPosition').notNull(), // Consider using text if job positions can be lengthy
  jobDesc: varchar('jobDesc').notNull(), // Use text for potentially long job descriptions
  jobExperience: varchar('jobExperience').notNull(), // Use text for potentially long experience descriptions
  createdBy: varchar('createdBy').notNull(),
  createdAt: varchar('createdAt'),
  mockId: varchar('mockId').notNull(),
});
