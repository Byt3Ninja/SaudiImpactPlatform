import { useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Building2, 
  Users, 
  LogOut,
  Menu,
  MapPin,
  Tag,
  Tags,
  Wrench
} from 'lucide-react';
import { useState } from 'react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location, setLocation] = useLocation();
  const { isAuthenticated, isLoading, logout } = useAdminAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation('/admin/login');
    }
  }, [isAuthenticated, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    setLocation('/admin/login');
  };

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/projects', label: 'Projects', icon: FolderKanban },
    { path: '/admin/organizations', label: 'Organizations', icon: Building2 },
    { path: '/admin/users', label: 'Users', icon: Users },
    { path: '/admin/regions', label: 'Regions', icon: MapPin },
    { path: '/admin/organization-types', label: 'Organization Types', icon: Tag },
    { path: '/admin/organization-subtypes', label: 'Organization Subtypes', icon: Tags },
    { path: '/admin/services', label: 'Services', icon: Wrench },
  ];

  return (
    <div className="flex h-screen bg-background">
      <aside
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-card border-r transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 border-b flex items-center justify-between">
          {isSidebarOpen && (
            <h1 className="text-lg font-semibold">Admin Panel</h1>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            data-testid="button-toggle-sidebar"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;

            return (
              <Link key={item.path} href={item.path}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={`w-full justify-start ${!isSidebarOpen && 'justify-center'}`}
                  data-testid={`link-${item.label.toLowerCase()}`}
                >
                  <Icon className={`w-5 h-5 ${isSidebarOpen && 'mr-2'}`} />
                  {isSidebarOpen && <span>{item.label}</span>}
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className={`w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 ${
              !isSidebarOpen && 'justify-center'
            }`}
            onClick={handleLogout}
            data-testid="button-logout"
          >
            <LogOut className={`w-5 h-5 ${isSidebarOpen && 'mr-2'}`} />
            {isSidebarOpen && <span>Logout</span>}
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">{children}</div>
      </main>
    </div>
  );
}
