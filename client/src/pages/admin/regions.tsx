import AdminLayout from './layout';
import ReferenceDataManager from '@/components/ReferenceDataManager';

export default function AdminRegions() {
  return (
    <AdminLayout>
      <ReferenceDataManager
        title={{
          singular: 'Region',
          plural: 'Regions',
        }}
        apiEndpoint="/api/regions"
        queryKey="/api/regions"
      />
    </AdminLayout>
  );
}
