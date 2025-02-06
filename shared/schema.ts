import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  amount: integer("amount").notNull(),
  senderAddress: text("sender_address").notNull(),
  recipientAddress: text("recipient_address").notNull(),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTransactionSchema = createInsertSchema(transactions)
  .omit({ id: true, createdAt: true })
  .extend({
    amount: z.number().min(1, "Amount must be greater than 0"),
    senderAddress: z.string().min(1, "Sender address is required"),
    recipientAddress: z.string().min(1, "Recipient address is required"),
    status: z.enum(["pending", "completed", "failed"]),
  });

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;
