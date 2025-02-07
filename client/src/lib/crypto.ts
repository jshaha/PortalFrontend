import { create } from 'zustand'

interface CryptoPrice {
  price: number;
  change24h: number;
}

interface CryptoPriceStore {
  prices: Record<string, CryptoPrice>;
  setPrices: (prices: Record<string, CryptoPrice>) => void;
}

export const useCryptoPriceStore = create<CryptoPriceStore>((set) => ({
  prices: {},
  setPrices: (prices: Record<string, CryptoPrice>) => set({ prices }),
}));

// Mock price updates - In production, this would connect to a real price feed
export function initializePriceFeeds() {
  const updatePrices = () => {
    const mockPrices: Record<string, CryptoPrice> = {
      SOL: {
        price: 95 + Math.random() * 5,
        change24h: -2.5 + Math.random() * 5,
      },
      USDC: {
        price: 1,
        change24h: 0,
      },
      ETH: {
        price: 2500 + Math.random() * 100,
        change24h: 1.5 + Math.random() * 3,
      },
      BTC: {
        price: 43000 + Math.random() * 1000,
        change24h: 0.8 + Math.random() * 4,
      },
    };
    useCryptoPriceStore.getState().setPrices(mockPrices);
  };

  // Update prices immediately and then every 10 seconds
  updatePrices();
  setInterval(updatePrices, 10000);
}