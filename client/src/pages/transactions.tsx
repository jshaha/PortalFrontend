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

export default function Transactions() {
  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

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
          <CardDescription>View all your USDC transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions?.map((tx) => (
              <Card key={tx.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <p className="font-medium">
                        {tx.amount} USDC
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
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
