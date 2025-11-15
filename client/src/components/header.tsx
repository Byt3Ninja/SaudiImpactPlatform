import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { Input } from "@/components/ui/input";
import { Search, Globe, Send, FileText, LogIn, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const [location] = useLocation();
  const { t } = useTranslation();
  const { isAuthenticated, user, isLoading } = useAuth();

  const navItems = [
    { path: "/", label: t('nav.home') },
    { path: "/projects", label: t('nav.projects') },
    { path: "/organizations", label: t('nav.organizations') },
    { path: "/opportunities", label: t('nav.opportunities') },
    { path: "/dashboard", label: t('nav.dashboard') },
    { path: "/map", label: t('nav.map') },
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
                placeholder={t('nav.search')}
                className="pl-9"
                data-testid="input-search"
              />
            </div>

            {!isLoading && !isAuthenticated && (
              <Button
                variant="default"
                size="sm"
                onClick={() => (window.location.href = '/api/login')}
                data-testid="button-login"
              >
                <LogIn className="h-4 w-4 mr-2" />
                {t('auth.login', 'Login')}
              </Button>
            )}

            {isAuthenticated && (
              <>
                <Link href="/submit-organization">
                  <Button variant="ghost" size="sm" data-testid="link-submit-organization">
                    <Send className="h-4 w-4 mr-2" />
                    <span className="hidden lg:inline">{t('nav.submitOrganization', 'Submit Organization')}</span>
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" data-testid="button-user-menu">
                      <User className="h-4 w-4 mr-2" />
                      <span className="hidden lg:inline">{user?.firstName || t('auth.account', 'Account')}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="px-2 py-1.5 text-sm">
                      <div className="font-medium" data-testid="text-user-name">
                        {user?.firstName} {user?.lastName}
                      </div>
                      <div className="text-xs text-muted-foreground truncate" data-testid="text-user-email">
                        {user?.email}
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/my-submissions">
                        <div className="flex items-center w-full cursor-pointer" data-testid="link-my-submissions-dropdown">
                          <FileText className="h-4 w-4 mr-2" />
                          {t('nav.mySubmissions', 'My Submissions')}
                        </div>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => (window.location.href = '/api/logout')}
                      data-testid="button-logout"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      {t('auth.logout', 'Logout')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}

            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
