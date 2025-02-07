import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type Transaction } from "@shared/schema";
import { format } from "date-fns";
import { useCryptoPriceStore } from "@/lib/crypto";

export default function Transactions() {
  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });
  const prices = useCryptoPriceStore((state: { prices: Record<string, { price: number }> }) => state.prices);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-8 bg-muted rounded w-1/3" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-muted rounded" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>View all your crypto transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions?.map((tx) => {
              const currentPrice = prices[tx.cryptocurrency]?.price || 1;
              const priceAtTransaction = Number(tx.priceAtTransaction);
              const amount = Number(tx.amount);
              const priceChange = ((currentPrice - priceAtTransaction) / priceAtTransaction) * 100;

              return (
                <Card key={tx.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">
                            {amount} {tx.cryptocurrency}
                          </p>
                          <Badge variant="outline">
                            ${(amount * priceAtTransaction).toFixed(2)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Current value: ${(amount * currentPrice).toFixed(2)}
                          <span className={priceChange >= 0 ? "text-green-500" : "text-red-500"}>
                            {" "}
                            ({priceChange >= 0 ? "+" : ""}
                            {priceChange.toFixed(2)}%)
                          </span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          To: {tx.recipientAddress}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          From: {tx.senderAddress}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            tx.status === "completed"
                              ? "default"
                              : tx.status === "pending"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {tx.status}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">
                          {format(new Date(tx.createdAt), "MMM d, yyyy HH:mm")}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}