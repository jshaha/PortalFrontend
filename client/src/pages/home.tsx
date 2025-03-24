import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Portal Wallet
        </h1>
        <p className="text-lg text-muted-foreground">
          Secure. Fast. Decentralized. Your gateway to crypto-powered finance.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-none shadow-lg bg-gradient-to-br from-background/95 to-background">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-6 w-6" />
              Send Payment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Send any supported cryptocurrency instantly and securely
            </p>
            <Link href="/payment">
              <Button className="w-full bg-gradient-to-r from-primary to-primary/70 hover:from-primary/90 hover:to-primary/60">
                Start Payment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg bg-gradient-to-br from-background/95 to-background">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-6 w-6" />
              View Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Track and monitor all your crypto transactions
            </p>
            <Link href="/transactions">
              <Button className="w-full" variant="outline">
                View History
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}