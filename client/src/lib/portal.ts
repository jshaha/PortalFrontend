import { Client } from '@portal-hq/client';

// Initialize Portal client with API key
const portalClient = new Client({
  apiKey: import.meta.env.VITE_PORTAL_API_KEY,
});

export async function initializePortalAPI() {
  try {
    // Initialize the client
    await portalClient.initialize();
    console.log("Portal API initialized successfully");
  } catch (error) {
    console.error("Failed to initialize Portal API:", error);
    throw error;
  }
}

export async function createUSDCTransaction(amount: number, recipient: string) {
  try {
    // Create a new transaction using Portal's MPC API
    const transaction = await portalClient.createTransaction({
      amount: amount.toString(),
      recipient,
      asset: "USDC",
      network: "solana",
    });

    return {
      id: transaction.id,
      status: transaction.status,
    };
  } catch (error) {
    console.error("Failed to create transaction:", error);
    throw error;
  }
}

export async function getTransactionStatus(txId: string) {
  try {
    // Get transaction status from Portal API
    const transaction = await portalClient.getTransaction(txId);

    return {
      status: transaction.status,
    };
  } catch (error) {
    console.error("Failed to get transaction status:", error);
    throw error;
  }
}