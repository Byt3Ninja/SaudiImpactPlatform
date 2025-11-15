import AdminLayout from './layout';
import ReferenceDataManager from '@/components/ReferenceDataManager';

export default function AdminOrganizationTypes() {
  return (
    <AdminLayout>
      <ReferenceDataManager
        title={{
          singular: 'Organization Type',
          plural: 'Organization Types',
        }}
        apiEndpoint="/api/organization-types"
        queryKey="/api/organization-types"
      />
    </AdminLayout>
  );
}
