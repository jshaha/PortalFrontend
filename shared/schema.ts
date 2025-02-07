import { pgTable, text, serial, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  amount: decimal("amount", { precision: 18, scale: 8 }).notNull(),
  cryptocurrency: text("cryptocurrency").default("USDC").notNull(),
  senderAddress: text("sender_address").notNull(),
  recipientAddress: text("recipient_address").notNull(),
  status: text("status").notNull(),
  priceAtTransaction: decimal("price_at_transaction", { precision: 18, scale: 2 }).default("1").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTransactionSchema = createInsertSchema(transactions)
  .omit({ id: true, createdAt: true })
  .extend({
    amount: z.number().positive("Amount must be greater than 0"),
    cryptocurrency: z.enum(["SOL", "USDC", "ETH", "BTC"]),
    senderAddress: z.string().min(1, "Sender address is required"),
    recipientAddress: z.string().min(1, "Recipient address is required"),
    status: z.enum(["pending", "completed", "failed"]),
    priceAtTransaction: z.number().positive("Price must be greater than 0"),
  });

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;