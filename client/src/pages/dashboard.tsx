import { useQuery } from "@tanstack/react-query";
import type { Project } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Target, DollarSign, Users, Activity } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const { data: stats } = useQuery<{
    totalProjects: number;
    activeProjects: number;
    totalFunding: number;
    organizations: number;
  }>({
    queryKey: ["/api/stats"],
  });

  const categoryData = projects.reduce((acc, project) => {
    acc[project.category] = (acc[project.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryChartData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value,
  }));

  const regionData = projects.reduce((acc, project) => {
    acc[project.region] = (acc[project.region] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const regionChartData = Object.entries(regionData)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const statusData = projects.reduce((acc, project) => {
    acc[project.status] = (acc[project.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusChartData = Object.entries(statusData).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <h1 className="font-serif text-4xl md:text-5xl font-semibold mb-4" data-testid="text-page-title">
            Impact Dashboard
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Real-time insights into sustainable development across Saudi Arabia
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-8 space-y-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { 
              label: "Total Projects", 
              value: stats?.totalProjects || 0, 
              icon: Target, 
              color: "text-chart-1",
              bgColor: "bg-chart-1/10"
            },
            { 
              label: "Active Initiatives", 
              value: stats?.activeProjects || 0, 
              icon: Activity, 
              color: "text-chart-2",
              bgColor: "bg-chart-2/10"
            },
            { 
              label: "Organizations", 
              value: stats?.organizations || 0, 
              icon: Users, 
              color: "text-chart-3",
              bgColor: "bg-chart-3/10"
            },
            { 
              label: "Total Funding", 
              value: `${((stats?.totalFunding || 0) / 1000000).toFixed(1)}M SAR`, 
              icon: DollarSign, 
              color: "text-chart-4",
              bgColor: "bg-chart-4/10"
            },
          ].map((stat, idx) => (
            <Card key={idx} className="hover-elevate" data-testid={`card-stat-${stat.label.toLowerCase().replace(' ', '-')}`}>
              <CardContent className="pt-6">
                <div className={`w-12 h-12 rounded-md ${stat.bgColor} flex items-center justify-center mb-4`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold mb-1" data-testid={`text-stat-value-${idx}`}>{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Projects by Category</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Projects by Status</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={statusChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px'
                      }}
                    />
                    <Bar dataKey="value" fill="hsl(var(--chart-1))" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Regional Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-80 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={regionChartData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                  <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" width={120} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--chart-3))" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.slice(0, 5).map((project, idx) => (
                <div key={project.id} className="flex items-center justify-between py-3 border-b last:border-0" data-testid={`activity-item-${idx}`}>
                  <div className="flex-1">
                    <div className="font-medium">{project.title}</div>
                    <div className="text-sm text-muted-foreground">{project.region}</div>
                  </div>
                  <Badge variant="outline">{project.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
