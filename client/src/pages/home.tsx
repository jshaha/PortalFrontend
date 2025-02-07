import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Coins, ArrowRight, Shield, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto pt-12">
      <div className="text-center mb-16">
        <div className="inline-block mb-4 px-4 py-1 rounded-full bg-primary/10 text-primary text-sm">
          Powered by Portal API
        </div>
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary/90 to-primary/40 bg-clip-text text-transparent">
          Secure Crypto Payments
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Experience secure, fast, and reliable cryptocurrency transactions powered by Portal's MPC technology
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
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
                Transfer crypto securely using Portal's MPC infrastructure
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
                  <Zap className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-semibold">Track Transactions</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                Monitor your crypto transactions in real-time
              </p>
              <div className="flex items-center text-primary group-hover:translate-x-1 transition-transform">
                View History
                <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-primary/5 border-primary/10">
          <CardContent className="pt-6">
            <Shield className="h-8 w-8 text-primary mb-4" />
            <h3 className="font-semibold mb-2">Secure MPC</h3>
            <p className="text-sm text-muted-foreground">
              Advanced multi-party computation for enhanced security
            </p>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/10">
          <CardContent className="pt-6">
            <Zap className="h-8 w-8 text-primary mb-4" />
            <h3 className="font-semibold mb-2">Real-time Updates</h3>
            <p className="text-sm text-muted-foreground">
              Instant transaction status and price updates
            </p>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/10">
          <CardContent className="pt-6">
            <Coins className="h-8 w-8 text-primary mb-4" />
            <h3 className="font-semibold mb-2">Multi-Currency</h3>
            <p className="text-sm text-muted-foreground">
              Support for USDC, SOL, ETH, and BTC
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}