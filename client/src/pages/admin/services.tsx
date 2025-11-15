import AdminLayout from './layout';
import ReferenceDataManager from '@/components/ReferenceDataManager';

export default function AdminServices() {
  return (
    <AdminLayout>
      <ReferenceDataManager
        title={{
          singular: 'Service',
          plural: 'Services',
        }}
        apiEndpoint="/api/services"
        queryKey="/api/services"
      />
    </AdminLayout>
  );
}
