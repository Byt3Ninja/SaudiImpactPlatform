import { useLocation, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Send, LogIn, Clock, CheckCircle, XCircle, Plus } from 'lucide-react';
import type { OrganizationSubmission } from '@shared/schema';
import { format } from 'date-fns';

export default function MySubmissions() {
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  const { data: submissions = [], isLoading } = useQuery<OrganizationSubmission[]>({
    queryKey: ['/api/submissions/my'],
    enabled: isAuthenticated,
  });

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 lg:px-8 py-16">
          <Card className="max-w-md mx-auto text-center">
            <CardHeader>
              <div className="mx-auto mb-4">
                <Building2 className="h-12 w-12 text-muted-foreground" />
              </div>
              <CardTitle>Authentication Required</CardTitle>
              <CardDescription>
                Please log in to view your submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/login">
                <Button
                  className="w-full"
                  data-testid="button-login"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Log In to Submit
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400 border-yellow-300 dark:border-yellow-800';
      case 'approved':
        return 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 border-green-300 dark:border-green-800';
      case 'rejected':
        return 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 border-red-300 dark:border-red-800';
      default:
        return '';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="font-serif text-4xl md:text-5xl font-semibold mb-4" data-testid="heading-submissions">
                My Submissions
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Track the status of your organization submissions
              </p>
            </div>
            <Button
              onClick={() => setLocation('/submit-organization')}
              data-testid="button-new-submission"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Submission
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
            <p className="mt-4 text-muted-foreground">Loading submissions...</p>
          </div>
        ) : submissions.length === 0 ? (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="text-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No submissions yet</h3>
              <p className="text-muted-foreground mb-6">
                You haven't submitted any organizations for review.
              </p>
              <Button
                onClick={() => setLocation('/submit-organization')}
                data-testid="button-submit-first"
              >
                <Send className="w-4 h-4 mr-2" />
                Submit Your Organization
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 max-w-4xl mx-auto">
            {submissions.map((submission) => (
              <Card key={submission.id} data-testid={`submission-card-${submission.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-xl mb-2">
                        {submission.name}
                      </CardTitle>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant="secondary">{submission.type}</Badge>
                        <Badge variant="secondary">{submission.region}</Badge>
                        {submission.subType && (
                          <Badge variant="outline">{submission.subType}</Badge>
                        )}
                      </div>
                    </div>
                    <Badge
                      className={getStatusColor(submission.status)}
                      data-testid={`badge-status-${submission.id}`}
                    >
                      <span className="flex items-center gap-1">
                        {getStatusIcon(submission.status)}
                        {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                      </span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {submission.description}
                  </p>

                  <div className="pt-3 border-t space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Submitted:</span>
                      <span data-testid={`date-submitted-${submission.id}`}>
                        {submission.submittedAt && format(new Date(submission.submittedAt), 'MMM d, yyyy')}
                      </span>
                    </div>

                    {submission.reviewedAt && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Reviewed:</span>
                        <span data-testid={`date-reviewed-${submission.id}`}>
                          {format(new Date(submission.reviewedAt), 'MMM d, yyyy')}
                        </span>
                      </div>
                    )}

                    {submission.status === 'rejected' && submission.rejectionReason && (
                      <div className="mt-4 p-3 rounded-md bg-destructive/10 border border-destructive/20">
                        <p className="text-sm font-medium text-destructive mb-1">
                          Rejection Reason:
                        </p>
                        <p className="text-sm text-muted-foreground" data-testid={`rejection-reason-${submission.id}`}>
                          {submission.rejectionReason}
                        </p>
                      </div>
                    )}

                    {submission.status === 'approved' && (
                      <div className="mt-4 p-3 rounded-md bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900">
                        <p className="text-sm text-green-700 dark:text-green-400">
                          Your organization has been approved and is now visible on the platform.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
