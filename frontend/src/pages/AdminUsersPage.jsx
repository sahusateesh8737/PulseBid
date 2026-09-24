import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Table } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { MOCK_USERS } from '../api/mockData';
import { Users, UserPlus } from 'lucide-react';

export const AdminUsersPage = () => {
  const { activeTenant } = useAuth();

  const columns = [
    { header: 'User ID', key: 'id', render: (r) => <span className="font-mono text-brand font-semibold">{r.id}</span> },
    { header: 'Full Name', key: 'name', render: (r) => <strong className="text-slate-100">{r.name}</strong> },
    { header: 'Email Address', key: 'email' },
    { header: 'Role', key: 'role', render: (r) => <Badge variant={r.role === 'ADMIN' ? 'admin' : 'bidder'}>{r.role}</Badge> },
    { header: 'Action', key: 'id', render: () => <Button variant="outline" size="sm">Manage Permissions</Button> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dark-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="admin">Admin Console</Badge>
            <span className="text-xs font-mono text-slate-400">{activeTenant?.name}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 mt-1">Tenant User Management</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Registered accounts under current tenant namespace partition.
          </p>
        </div>

        <Button variant="primary" icon={UserPlus}>
          Add User to Tenant
        </Button>
      </div>

      <Table columns={columns} data={MOCK_USERS} pageSize={10} />
    </div>
  );
};
