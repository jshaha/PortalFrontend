import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { insertTransactionSchema, type InsertTransaction } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { useCryptoPriceStore } from "@/lib/crypto";

// Test addresses for different cryptocurrencies
const TEST_ADDRESSES = {
  USDC: {
    sender: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    recipient: "0x742d35Cc6634C0532925a3b844Bc454e4438f44f",
  },
  SOL: {
    sender: "DRpbCBMxVnDK4J9VKrDRCceDE1LNqhXfXZHk7kxVdPf",
    recipient: "DRpbCBMxVnDK4J9VKrDRCceDE1LNqhXfXZHk7kxVdPg",
  },
  ETH: {
    sender: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    recipient: "0x742d35Cc6634C0532925a3b844Bc454e4438f44f",
  },
  BTC: {
    sender: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    recipient: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wli",
  },
};

export default function Payment() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const prices = useCryptoPriceStore((state: { prices: Record<string, { price: number }> }) => state.prices);

  const form = useForm<InsertTransaction>({
    resolver: zodResolver(insertTransactionSchema),
    defaultValues: {
      amount: 0,
      cryptocurrency: "USDC",
      senderAddress: TEST_ADDRESSES.USDC.sender,
      recipientAddress: TEST_ADDRESSES.USDC.recipient,
      status: "pending",
      priceAtTransaction: 1,
    },
  });

  const selectedCrypto = form.watch("cryptocurrency");
  const currentPrice = prices[selectedCrypto]?.price || 1;

  const onCryptoChange = (value: string) => {
    form.setValue("cryptocurrency", value);
    form.setValue("senderAddress", TEST_ADDRESSES[value as keyof typeof TEST_ADDRESSES].sender);
    form.setValue("recipientAddress", TEST_ADDRESSES[value as keyof typeof TEST_ADDRESSES].recipient);
  };

  const mutation = useMutation({
    mutationFn: async (data: InsertTransaction) => {
      const res = await apiRequest("POST", "/api/transactions", {
        ...data,
        priceAtTransaction: currentPrice,
      });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Payment Initiated",
        description: `Your ${selectedCrypto} payment has been initiated successfully.`,
      });
      setLocation("/transactions");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to initiate payment. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="max-w-md mx-auto">
      <Card className="border-border/40">
        <CardHeader>
          <CardTitle>Send Payment</CardTitle>
          <CardDescription>Transfer crypto to any wallet address</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
              <FormField
                control={form.control}
                name="cryptocurrency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cryptocurrency</FormLabel>
                    <Select onValueChange={onCryptoChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a cryptocurrency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(prices).map(([symbol, { price }]) => (
                          <SelectItem key={symbol} value={symbol}>
                            {symbol} (${price.toFixed(2)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount ({selectedCrypto})</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          step="any"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          className="pr-20"
                        />
                        <div className="absolute right-3 top-2.5 text-sm text-muted-foreground">
                          ≈ ${(field.value * currentPrice).toFixed(2)}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="senderAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sender Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Using test {selectedCrypto} address
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="recipientAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipient Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Using test {selectedCrypto} address
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={mutation.isPending}>
                {mutation.isPending ? "Processing..." : `Send ${selectedCrypto}`}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}