import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { insertTransactionSchema, type InsertTransaction } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { useCryptoPriceStore } from "@/lib/crypto";

export default function Payment() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const prices = useCryptoPriceStore((state: { prices: Record<string, { price: number }> }) => state.prices);

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
      <Card>
        <CardHeader>
          <CardTitle>Send Crypto Payment</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
              <FormField
                control={form.control}
                name="cryptocurrency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cryptocurrency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                name="senderAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sender Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>Recipient Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
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