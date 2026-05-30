export const dynamic = 'force-dynamic';

import { supabaseServer } from '@/lib/supabase-server';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

async function getCompanies() {
  const { data } = await supabaseServer
    .from('companies')
    .select('*')
    .order('created_at', { ascending: false });
  return data || [];
}

const statusVariant: Record<string, any> = {
  lead: 'secondary',
  active: 'blue',
  portfolio: 'green',
  rejected: 'red',
  archived: 'secondary',
};

const statusLabel: Record<string, string> = {
  lead: 'Lead',
  active: 'Aktiv',
  portfolio: 'Portfölj',
  rejected: 'Avböjd',
  archived: 'Arkiverad',
};

export default async function CompaniesPage() {
  const companies = await getCompanies();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Bolag</h1>
        <p className="text-sm text-slate-500 mt-1">{companies.length} bolag registrerade</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {companies.map((company: any) => (
          <Card key={company.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-md bg-blue-100 flex items-center justify-center shrink-0">
                    <Building2 className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{company.name}</p>
                    {company.sector && <p className="text-xs text-slate-400">{company.sector}</p>}
                  </div>
                </div>
                <Badge variant={statusVariant[company.status] || 'secondary'}>
                  {statusLabel[company.status] || company.status}
                </Badge>
              </div>
              <p className="text-xs text-slate-400">{formatDate(company.created_at)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      {companies.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-slate-400 text-sm">
            Inga bolag ännu.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
