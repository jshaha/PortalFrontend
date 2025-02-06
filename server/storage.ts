import { transactions, type Transaction, type InsertTransaction } from "@shared/schema";

export interface IStorage {
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getTransactions(): Promise<Transaction[]>;
  getTransaction(id: number): Promise<Transaction | undefined>;
  updateTransactionStatus(id: number, status: string): Promise<Transaction | undefined>;
}

export class MemStorage implements IStorage {
  private transactions: Map<number, Transaction>;
  private currentId: number;

  constructor() {
    this.transactions = new Map();
    this.currentId = 1;
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.currentId++;
    const transaction: Transaction = {
      ...insertTransaction,
      id,
      createdAt: new Date(),
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async getTransactions(): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getTransaction(id: number): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async updateTransactionStatus(id: number, status: string): Promise<Transaction | undefined> {
    const transaction = this.transactions.get(id);
    if (transaction) {
      const updatedTransaction = { ...transaction, status };
      this.transactions.set(id, updatedTransaction);
      return updatedTransaction;
    }
    return undefined;
  }
}

export const storage = new MemStorage();
