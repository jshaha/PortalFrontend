import { z } from "zod";

// Wallet Provider Interface - This is the main interface you need to implement
export interface WalletProvider {
  connect(): Promise<string>;  // Should return the wallet address
  disconnect(): Promise<void>;
  getAddress(): Promise<string>;
  signTransaction(transaction: TransactionRequest): Promise<string>;
}

// Transaction Request Schema - Modify this according to your needs
export const transactionRequestSchema = z.object({
  amount: z.number().positive(),
  cryptocurrency: z.enum(["SOL", "USDC", "ETH", "BTC"]),
  recipientAddress: z.string().min(1),
});

export type TransactionRequest = z.infer<typeof transactionRequestSchema>;

// Example implementation - Replace this with your actual wallet implementation
export class YourCustomWalletProvider implements WalletProvider {
  private connected = false;
  private address = "";

  async connect(): Promise<string> {
    try {
      // Implement your wallet connection logic here
      // For example:
      // - Connect to browser extension (like MetaMask)
      // - Connect to mobile wallet
      // - Connect to hardware wallet
      this.connected = true;
      this.address = "your_connected_address";
      return this.address;
    } catch (error) {
      throw new Error("Failed to connect wallet: " + error);
    }
  }

  async disconnect(): Promise<void> {
    try {
      // Implement your wallet disconnection logic
      this.connected = false;
      this.address = "";
    } catch (error) {
      throw new Error("Failed to disconnect wallet: " + error);
    }
  }

  async getAddress(): Promise<string> {
    if (!this.connected) throw new Error("Wallet not connected");
    return this.address;
  }

  async signTransaction(transaction: TransactionRequest): Promise<string> {
    if (!this.connected) throw new Error("Wallet not connected");

    try {
      // Implement your transaction signing logic here
      // For example:
      // - Create a transaction object
      // - Sign it with the private key
      // - Return the signed transaction

      // This is where you'd implement the actual blockchain interaction
      console.log("Signing transaction:", transaction);
      return "signed_transaction_hash";
    } catch (error) {
      throw new Error("Failed to sign transaction: " + error);
    }
  }
}

// Export your wallet instance
export const wallet = new YourCustomWalletProvider();