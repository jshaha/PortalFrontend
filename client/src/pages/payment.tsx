import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { insertTransactionSchema, type InsertTransaction } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { useCryptoPriceStore } from "@/lib/crypto";
import { wallet, transactionRequestSchema } from "@/lib/wallet";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function Payment() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const prices = useCryptoPriceStore(
    (state: { prices: Record<string, { price: number }> }) => state.prices
  );
  const [walletAddress, setWalletAddress] = useState<string>("");

  const form = useForm<InsertTransaction>({
    resolver: zodResolver(insertTransactionSchema),
    defaultValues: {
      amount: 0,
      cryptocurrency: "USDC",
      senderAddress: "",
      recipientAddress: "",
      status: "pending",
      priceAtTransaction: 1,
    },
  });

  const selectedCrypto = form.watch("cryptocurrency");
  const currentPrice = prices[selectedCrypto]?.price || 1;

  const connectWallet = async () => {
    try {
      const address = await wallet.connect();
      setWalletAddress(address);
      form.setValue("senderAddress", address);
      toast({
        title: "Wallet Connected",
        description: `Connected to address: ${address.slice(0, 6)}...${address.slice(
          -4
        )}`,
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  const mutation = useMutation({
    mutationFn: async (data: InsertTransaction) => {
      const txRequest = transactionRequestSchema.parse({
        amount: data.amount,
        cryptocurrency: data.cryptocurrency,
        recipientAddress: data.recipientAddress,
      });

      await wallet.signTransaction(txRequest);

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
      <Card className="border-none shadow-lg bg-black/40 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Send Payment
          </CardTitle>
          <CardDescription>
            Send crypto payments securely and instantly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Button
              onClick={connectWallet}
              variant="outline"
              className="w-full border-primary/20 bg-black/20 backdrop-blur-sm hover:bg-primary/10"
              disabled={!!walletAddress}
            >
              {walletAddress ? (
                <span className="font-mono">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </span>
              ) : (
                "Connect Wallet"
              )}
            </Button>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="cryptocurrency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary/90">Cryptocurrency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-primary/20 bg-black/20">
                          <SelectValue placeholder="Select a cryptocurrency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-black/90 backdrop-blur-sm border-primary/20">
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
                    <FormLabel className="text-primary/90">
                      Amount ({selectedCrypto})
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          step="any"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          className="pr-24 border-primary/20 bg-black/20"
                        />
                        <div className="absolute right-3 top-2 text-sm text-muted-foreground">
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
                name="recipientAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary/90">Recipient Address</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="font-mono border-primary/20 bg-black/20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-primary/70 hover:from-primary/90 hover:to-primary/60"
                disabled={mutation.isPending || !walletAddress}
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Send ${selectedCrypto}`
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}