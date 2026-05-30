import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Globe, Mail, Building2 } from 'lucide-react';
import { supabaseServer } from '@/lib/supabase-server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DealStatusBadge } from '@/components/deals/DealStatusBadge';
import { formatDate } from '@/lib/utils';
import type { Company, Deal } from '@/types';

interface PageProps {
  params: { id: string };
}

async function getCompanyData(id: string) {
  const [companyRes, dealsRes] = await Promise.all([
    supabaseServer.from('companies').select('*').eq('id', id).single(),
    supabaseServer
      .from('deals')
      .select('*')
      .eq('company_id', id)
      .order('created_at', { ascending: false }),
  ]);

  return {
    company: companyRes.data as Company | null,
    deals: (dealsRes.data || []) as Deal[],
  };
}

function InfoRow({ label, value }: { label: string; value: string | undefined | null }) {
  if (!value) return null;
  return (
    <div className="py-2.5 border-b border-slate-100 last:border-0 flex gap-4">
      <dt className="text-xs font-medium text-slate-500 uppercase tracking-wide w-32 shrink-0 pt-0.5">{label}</dt>
      <dd className="text-sm text-slate-800">{value}</dd>
    </div>
  );
}

const companyStatusColors: Record<string, string> = {
  lead: 'bg-blue-100 text-blue-800',
  active: 'bg-green-100 text-green-800',
  portfolio: 'bg-green-600 text-white',
  rejected: 'bg-red-100 text-red-800',
  archived: 'bg-slate-100 text-slate-600',
};

const companyStatusLabels: Record<string, string> = {
  lead: 'Lead',
  active: 'Aktiv',
  portfolio: 'Portfölj',
  rejected: 'Avböjd',
  archived: 'Arkiverad',
};

export default async function CompanyProfilePage({ params }: PageProps) {
  const { company, deals } = await getCompanyData(params.id);
  if (!company) notFound();

  return (
    <div className="space-y-6 max-w-3xl">
      <Link
        href="/deals"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Tillbaka
      </Link>

      {/* Company Header */}
      <div className="flex items-start gap-4">
        <div className="h-14 w-14 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
          <Building2 className="h-7 w-7 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-slate-900">{company.name}</h1>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${companyStatusColors[company.status] ?? 'bg-slate-100 text-slate-600'}`}>
              {companyStatusLabels[company.status] ?? company.status}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-1 flex-wrap">
            {company.sector && <span className="text-sm text-slate-500">{company.sector}</span>}
            {company.city && <span className="text-sm text-slate-500">{company.city}, {company.country}</span>}
            {company.website && (
              <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
                <Globe className="h-3.5 w-3.5" />
                {company.website.replace(/^https?:\/\//, '')}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      {company.description && (
        <Card>
          <CardHeader><CardTitle>Om bolaget</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-slate-700">{company.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Details */}
      <Card>
        <CardHeader><CardTitle>Bolagsinformation</CardTitle></CardHeader>
        <CardContent>
          <dl>
            <InfoRow label="Org.nummer" value={company.org_number} />
            <InfoRow label="Affärsmodell" value={company.business_model} />
            <InfoRow label="Ansvarig IM" value={company.responsible_im} />
            <InfoRow label="VD" value={company.ceo_name} />
            <InfoRow label="Grundare" value={company.founder_names?.join(', ')} />
            <InfoRow label="Kontakt" value={company.contact_name} />
            {company.contact_email && (
              <div className="py-2.5 border-b border-slate-100 last:border-0 flex gap-4">
                <dt className="text-xs font-medium text-slate-500 uppercase tracking-wide w-32 shrink-0 pt-0.5">E-post</dt>
                <dd>
                  <a href={`mailto:${company.contact_email}`} className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
                    <Mail className="h-3.5 w-3.5" />
                    {company.contact_email}
                  </a>
                </dd>
              </div>
            )}
            <InfoRow label="Skapad" value={formatDate(company.created_at)} />
          </dl>
        </CardContent>
      </Card>

      {/* Deals */}
      {deals.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Case ({deals.length})</CardTitle></CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {deals.map(deal => (
                <Link
                  key={deal.id}
                  href={`/deals/${deal.id}`}
                  className="flex items-center justify-between px-6 py-3 hover:bg-slate-50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {deal.round ?? 'Deal'} – {formatDate(deal.created_at)}
                    </p>
                    {deal.responsible_im && (
                      <p className="text-xs text-slate-500">{deal.responsible_im}</p>
                    )}
                  </div>
                  <DealStatusBadge status={deal.status} />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
