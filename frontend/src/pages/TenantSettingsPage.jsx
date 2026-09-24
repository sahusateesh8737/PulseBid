import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Building2, Globe, Shield, Save } from 'lucide-react';

export const TenantSettingsPage = () => {
  const { activeTenant } = useAuth();
  const [tenantName, setTenantName] = useState(activeTenant?.name || '');
  const [code, setCode] = useState(activeTenant?.code || '');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 w-full">
      <div className="border-b border-dark-border pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">Tenant Namespace Settings</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          Configure organization branding, subdomain partition routing, and WebSocket headers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
        <Card className="lg:col-span-8 p-6 sm:p-8 space-y-6 w-full">
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Organization Tenant Name"
                icon={Building2}
                value={tenantName}
                onChange={(e) => setTenantName(e.target.value)}
              />

              <Input
                label="Tenant Subdomain Code"
                icon={Globe}
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>

            <div className="p-4 bg-dark-surface rounded-2xl border border-dark-border space-y-2 text-xs font-mono">
              <div className="text-slate-400 font-bold uppercase">Multi-Tenant Header Routing</div>
              <div className="text-slate-200">
                Header Key: <strong className="text-brand">X-Tenant-ID</strong>
              </div>
              <div className="text-slate-200">
                Assigned Namespace: <strong className="text-emerald-400">{activeTenant?.id}</strong>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              {saved && <span className="text-xs text-emerald-400 font-mono font-bold">Settings saved!</span>}
              <Button type="submit" variant="primary" icon={Save} className="ml-auto">
                Save Configuration
              </Button>
            </div>
          </form>
        </Card>

        <Card className="lg:col-span-4 p-6 space-y-3 w-full">
          <h3 className="text-xs font-mono font-bold uppercase text-slate-400">Partition Info</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Tenant namespaces isolate Redis Pub/Sub channels and PostgreSQL row-level locks to ensure zero cross-tenant data leakage.
          </p>
        </Card>
      </div>
    </div>
  );
};
