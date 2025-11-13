import { useQuery } from '@tanstack/react-query';
import AdminLayout from './layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, FolderKanban, DollarSign, TrendingUp } from 'lucide-react';
import type { Organization, Project } from '@shared/schema';

export default function AdminDashboard() {
  const { data: organizations } = useQuery<Organization[]>({
    queryKey: ['/api/organizations'],
  });

  const { data: projects } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  const stats = [
    {
      title: 'Total Organizations',
      value: organizations?.length || 0,
      icon: Building2,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-950',
    },
    {
      title: 'Total Projects',
      value: projects?.length || 0,
      icon: FolderKanban,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-950',
    },
    {
      title: 'Active Projects',
      value: projects?.filter((p) => p.status === 'Active').length || 0,
      icon: TrendingUp,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-950',
    },
    {
      title: 'Seeking Investment',
      value: projects?.filter((p) => p.seekingInvestment).length || 0,
      icon: DollarSign,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-950',
    },
  ];

  const recentProjects = projects?.slice(0, 5) || [];
  const recentOrganizations = organizations?.slice(0, 5) || [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold" data-testid="heading-dashboard">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your organizations, projects, and platform analytics
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-full ${stat.bgColor}`}>
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div
                    className="text-2xl font-bold"
                    data-testid={`stat-${stat.title.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {stat.value}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentProjects.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No projects yet
                  </p>
                ) : (
                  recentProjects.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover-elevate"
                      data-testid={`project-${project.id}`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{project.title}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {project.region} • {project.category}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          project.status === 'Active'
                            ? 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Organizations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentOrganizations.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No organizations yet
                  </p>
                ) : (
                  recentOrganizations.map((org) => (
                    <div
                      key={org.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover-elevate"
                      data-testid={`org-${org.id}`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{org.name}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {org.type} • {org.region}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
