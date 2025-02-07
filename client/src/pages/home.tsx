import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Coins, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto pt-12">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary/90 to-primary/40 bg-clip-text text-transparent">
          Crypto Payments
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Send and receive cryptocurrency payments securely and instantly
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Link href="/payment">
          <Card className="group hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Coins className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-semibold">Send Payment</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                Transfer crypto to any wallet address instantly
              </p>
              <div className="flex items-center text-primary group-hover:translate-x-1 transition-transform">
                Start Payment
                <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/transactions">
          <Card className="group hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Coins className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-semibold">View History</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                Track all your crypto transactions
              </p>
              <div className="flex items-center text-primary group-hover:translate-x-1 transition-transform">
                View Transactions
                <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}