import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertTransactionSchema } from "@shared/schema";

export function registerRoutes(app: Express) {
  app.post("/api/transactions", async (req, res) => {
    try {
      const transaction = insertTransactionSchema.parse(req.body);
      const created = await storage.createTransaction(transaction);
      res.json(created);
    } catch (error) {
      res.status(400).json({ error: "Invalid transaction data" });
    }
  });

  app.get("/api/transactions", async (_req, res) => {
    const transactions = await storage.getTransactions();
    res.json(transactions);
  });

  app.get("/api/transactions/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const transaction = await storage.getTransaction(id);
    if (transaction) {
      res.json(transaction);
    } else {
      res.status(404).json({ error: "Transaction not found" });
    }
  });

  app.patch("/api/transactions/:id/status", async (req, res) => {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    const transaction = await storage.updateTransactionStatus(id, status);
    if (transaction) {
      res.json(transaction);
    } else {
      res.status(404).json({ error: "Transaction not found" });
    }
  });

  return createServer(app);
}
