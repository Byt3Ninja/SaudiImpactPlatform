import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import AdminLayout from './layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Search, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/adminApi';
import { queryClient } from '@/lib/queryClient';
import type { OrganizationSubmission } from '@shared/schema';
import { format } from 'date-fns';

export default function AdminSubmissions() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedSubmission, setSelectedSubmission] = useState<OrganizationSubmission | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const { toast } = useToast();

  const { data: submissions = [], isLoading } = useQuery<OrganizationSubmission[]>({
    queryKey: ['/api/submissions'],
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/api/submissions/${id}/approve`, {
        method: 'POST',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/submissions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/organizations'] });
      setIsDetailDialogOpen(false);
      setSelectedSubmission(null);
      toast({ title: 'Submission approved successfully' });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to approve submission',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      apiRequest(`/api/submissions/${id}/reject`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/submissions'] });
      setIsRejectDialogOpen(false);
      setIsDetailDialogOpen(false);
      setSelectedSubmission(null);
      setRejectionReason('');
      toast({ title: 'Submission rejected' });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to reject submission',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const filteredSubmissions = submissions.filter((submission) => {
    const matchesSearch =
      submission.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'pending' && submission.status === 'pending') ||
      (activeTab === 'approved' && submission.status === 'approved') ||
      (activeTab === 'rejected' && submission.status === 'rejected');

    return matchesSearch && matchesTab;
  });

  const pendingCount = submissions.filter((s) => s.status === 'pending').length;
  const approvedCount = submissions.filter((s) => s.status === 'approved').length;
  const rejectedCount = submissions.filter((s) => s.status === 'rejected').length;

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

  const handleApprove = (id: string) => {
    approveMutation.mutate(id);
  };

  const handleReject = () => {
    if (!selectedSubmission || !rejectionReason.trim()) {
      toast({
        title: 'Validation error',
        description: 'Please provide a rejection reason',
        variant: 'destructive',
      });
      return;
    }

    rejectMutation.mutate({
      id: selectedSubmission.id,
      reason: rejectionReason,
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold" data-testid="heading-submissions">
              Organization Submissions
            </h1>
            <p className="text-muted-foreground">
              Review and manage organization submissions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search submissions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              data-testid="input-search"
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList data-testid="tabs-status">
            <TabsTrigger value="pending" data-testid="tab-pending">
              <Clock className="w-4 h-4 mr-2" />
              Pending ({pendingCount})
            </TabsTrigger>
            <TabsTrigger value="approved" data-testid="tab-approved">
              <CheckCircle className="w-4 h-4 mr-2" />
              Approved ({approvedCount})
            </TabsTrigger>
            <TabsTrigger value="rejected" data-testid="tab-rejected">
              <XCircle className="w-4 h-4 mr-2" />
              Rejected ({rejectedCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {isLoading ? (
              <div className="text-center py-12">Loading submissions...</div>
            ) : filteredSubmissions.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-muted-foreground">No submissions found</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {filteredSubmissions.map((submission) => (
                  <Card key={submission.id} data-testid={`submission-card-${submission.id}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-xl mb-2">
                            {submission.name}
                          </CardTitle>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary">{submission.type}</Badge>
                            <Badge variant="secondary">{submission.region}</Badge>
                            {submission.subType && (
                              <Badge variant="outline">{submission.subType}</Badge>
                            )}
                            <Badge className={getStatusColor(submission.status)}>
                              {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              setSelectedSubmission(submission);
                              setIsDetailDialogOpen(true);
                            }}
                            data-testid={`button-view-${submission.id}`}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {submission.status === 'pending' && (
                            <>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleApprove(submission.id)}
                                disabled={approveMutation.isPending}
                                data-testid={`button-approve-${submission.id}`}
                              >
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                  setSelectedSubmission(submission);
                                  setIsRejectDialogOpen(true);
                                }}
                                disabled={rejectMutation.isPending}
                                data-testid={`button-reject-${submission.id}`}
                              >
                                <XCircle className="w-4 h-4 text-destructive" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {submission.description}
                      </p>
                      <div className="flex items-center justify-between text-sm pt-3 border-t">
                        <span className="text-muted-foreground">
                          Submitted: {submission.submittedAt && format(new Date(submission.submittedAt), 'MMM d, yyyy')}
                        </span>
                        {submission.reviewedAt && (
                          <span className="text-muted-foreground">
                            Reviewed: {format(new Date(submission.reviewedAt), 'MMM d, yyyy')}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Submission Details</DialogTitle>
              <DialogDescription>
                Review all information submitted by the organization
              </DialogDescription>
            </DialogHeader>

            {selectedSubmission && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Organization Name</Label>
                    <p className="font-medium" data-testid="detail-name">{selectedSubmission.name}</p>
                  </div>
                  {selectedSubmission.nameAr && (
                    <div>
                      <Label className="text-muted-foreground">Arabic Name</Label>
                      <p className="font-medium" data-testid="detail-name-ar">{selectedSubmission.nameAr}</p>
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Type</Label>
                    <p className="font-medium" data-testid="detail-type">{selectedSubmission.type}</p>
                  </div>
                  {selectedSubmission.subType && (
                    <div>
                      <Label className="text-muted-foreground">Subtype</Label>
                      <p className="font-medium" data-testid="detail-subtype">{selectedSubmission.subType}</p>
                    </div>
                  )}
                </div>

                <div>
                  <Label className="text-muted-foreground">Description</Label>
                  <p className="text-sm" data-testid="detail-description">{selectedSubmission.description}</p>
                </div>

                {selectedSubmission.descriptionAr && (
                  <div>
                    <Label className="text-muted-foreground">Arabic Description</Label>
                    <p className="text-sm" data-testid="detail-description-ar">{selectedSubmission.descriptionAr}</p>
                  </div>
                )}

                <div>
                  <Label className="text-muted-foreground">Region</Label>
                  <p className="font-medium" data-testid="detail-region">{selectedSubmission.region}</p>
                </div>

                {selectedSubmission.website && (
                  <div>
                    <Label className="text-muted-foreground">Website</Label>
                    <a
                      href={selectedSubmission.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                      data-testid="detail-website"
                    >
                      {selectedSubmission.website}
                    </a>
                  </div>
                )}

                {selectedSubmission.linkedinUrl && (
                  <div>
                    <Label className="text-muted-foreground">LinkedIn</Label>
                    <a
                      href={selectedSubmission.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                      data-testid="detail-linkedin"
                    >
                      {selectedSubmission.linkedinUrl}
                    </a>
                  </div>
                )}

                {selectedSubmission.contactEmail && (
                  <div>
                    <Label className="text-muted-foreground">Contact Email</Label>
                    <p className="text-sm" data-testid="detail-email">{selectedSubmission.contactEmail}</p>
                  </div>
                )}

                {selectedSubmission.sectorFocus && selectedSubmission.sectorFocus.length > 0 && (
                  <div>
                    <Label className="text-muted-foreground">Sector Focus</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedSubmission.sectorFocus.map((sector) => (
                        <Badge key={sector} variant="secondary">
                          {sector}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedSubmission.sdgFocus && selectedSubmission.sdgFocus.length > 0 && (
                  <div>
                    <Label className="text-muted-foreground">SDG Focus</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedSubmission.sdgFocus.map((sdg) => (
                        <Badge key={sdg} variant="secondary">
                          SDG {sdg}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedSubmission.services && selectedSubmission.services.length > 0 && (
                  <div>
                    <Label className="text-muted-foreground">Services</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedSubmission.services.map((service) => (
                        <Badge key={service} variant="secondary">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedSubmission.rejectionReason && (
                  <div>
                    <Label className="text-muted-foreground">Rejection Reason</Label>
                    <p className="text-sm text-destructive" data-testid="detail-rejection">
                      {selectedSubmission.rejectionReason}
                    </p>
                  </div>
                )}
              </div>
            )}

            <DialogFooter>
              {selectedSubmission?.status === 'pending' && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsDetailDialogOpen(false);
                      setIsRejectDialogOpen(true);
                    }}
                    data-testid="button-reject-dialog"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => selectedSubmission && handleApprove(selectedSubmission.id)}
                    disabled={approveMutation.isPending}
                    data-testid="button-approve-dialog"
                  >
                    {approveMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Approving...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </>
                    )}
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reject Submission</AlertDialogTitle>
              <AlertDialogDescription>
                Please provide a reason for rejecting this submission. This will be visible to the submitter.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4">
              <Label htmlFor="rejection-reason">Rejection Reason</Label>
              <Textarea
                id="rejection-reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Explain why this submission is being rejected..."
                rows={4}
                className="mt-2"
                data-testid="textarea-rejection-reason"
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setRejectionReason('')}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleReject}
                disabled={!rejectionReason.trim() || rejectMutation.isPending}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                data-testid="button-confirm-reject"
              >
                {rejectMutation.isPending ? 'Rejecting...' : 'Reject Submission'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}
