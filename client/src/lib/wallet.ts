import { z } from "zod";

// Wallet Provider Interface
export interface WalletProvider {
  connect(): Promise<string>;
  disconnect(): Promise<void>;
  getAddress(): Promise<string>;
  signTransaction(transaction: TransactionRequest): Promise<string>;
}

// Transaction Request Schema
export const transactionRequestSchema = z.object({
  amount: z.number().positive(),
  cryptocurrency: z.enum(["SOL", "USDC", "ETH", "BTC"]),
  recipientAddress: z.string().min(1),
});

export type TransactionRequest = z.infer<typeof transactionRequestSchema>;

// Mock Wallet Implementation (Replace with your actual wallet implementation)
export class MockWalletProvider implements WalletProvider {
  private connected = false;
  private address = "";

  async connect(): Promise<string> {
    this.connected = true;
    this.address = `mock_${Math.random().toString(36).slice(2)}`;
    return this.address;
  }

  async disconnect(): Promise<void> {
    this.connected = false;
    this.address = "";
  }

  async getAddress(): Promise<string> {
    if (!this.connected) throw new Error("Wallet not connected");
    return this.address;
  }

  async signTransaction(transaction: TransactionRequest): Promise<string> {
    if (!this.connected) throw new Error("Wallet not connected");
    return `mock_signed_tx_${Math.random().toString(36).slice(2)}`;
  }
}

// Export a default wallet instance
export const wallet = new MockWalletProvider();
