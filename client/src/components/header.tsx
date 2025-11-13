import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Input } from "@/components/ui/input";
import { Search, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/projects", label: "Projects" },
    { path: "/organizations", label: "Organizations" },
    { path: "/opportunities", label: "Opportunities" },
    { path: "/dashboard", label: "Impact Dashboard" },
    { path: "/map", label: "Map" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" data-testid="link-home">
            <div className="flex items-center gap-3 hover-elevate active-elevate-2 rounded-md px-3 py-2 -ml-3">
              <Globe className="h-6 w-6 text-primary" />
              <div className="flex flex-col">
                <span className="font-serif text-lg font-semibold leading-none">Saudi Impact</span>
                <span className="text-xs text-muted-foreground">Development Platform</span>
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path} data-testid={`link-nav-${item.label.toLowerCase().replace(' ', '-')}`}>
                <Button
                  variant="ghost"
                  className={cn(
                    "text-sm font-medium",
                    location === item.path && "bg-accent"
                  )}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden md:block relative w-48 lg:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search projects..."
                className="pl-9"
                data-testid="input-search"
              />
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
