import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export default function Navigation() {
  const [location] = useLocation();

  const links = [
    { href: "/", label: "Home" },
    { href: "/payment", label: "Payment" },
    { href: "/transactions", label: "History" },
  ];

  return (
    <nav className="border-b border-border/40 backdrop-blur-sm bg-background/95 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/">
            <div className="font-bold text-lg bg-gradient-to-r from-primary/90 via-primary to-primary/70 bg-clip-text text-transparent cursor-pointer flex items-center gap-2">
              Portal Pay Demo
            </div>
          </Link>
          <div className="flex gap-8">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary relative py-1",
                  location === href
                    ? "text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary"
                    : "text-muted-foreground"
                )}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}