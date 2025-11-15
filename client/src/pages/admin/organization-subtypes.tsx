import AdminLayout from './layout';
import ReferenceDataManager from '@/components/ReferenceDataManager';

export default function AdminOrganizationSubtypes() {
  return (
    <AdminLayout>
      <ReferenceDataManager
        title={{
          singular: 'Organization Subtype',
          plural: 'Organization Subtypes',
        }}
        apiEndpoint="/api/organization-subtypes"
        queryKey="/api/organization-subtypes"
      />
    </AdminLayout>
  );
}
