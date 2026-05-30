export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DealCard } from '@/components/deals/DealCard';
import { supabaseServer } from '@/lib/supabase-server';
import type { Deal, DealStatus } from '@/types';
import { DEAL_STATUS_LABELS } from '@/types';

async function getDeals(): Promise<Deal[]> {
  const { data, error } = await supabaseServer
    .from('deals')
    .select('*, company:companies(*)')
    .order('updated_at', { ascending: false });

  if (error) return [];
  return data as Deal[];
}

const pipelineGroups: { label: string; statuses: DealStatus[] }[] = [
  { label: 'Aktiva case', statuses: ['new', 'first_meeting', 'screening'] },
  { label: 'Due Diligence', statuses: ['dd', 'ik_prep', 'ik_decision'] },
  { label: 'Term Sheet & Closing', statuses: ['term_sheet', 'closing'] },
  { label: 'Portfölj', statuses: ['portfolio'] },
  { label: 'Parkerade', statuses: ['parked'] },
  { label: 'Avböjda / Arkiverade', statuses: ['declined', 'archive'] },
];

export default async function DealsPage() {
  const deals = await getDeals();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Case</h1>
          <p className="text-sm text-slate-500 mt-1">{deals.length} case totalt</p>
        </div>
        <Button asChild>
          <Link href="/deals/new">
            <Plus className="h-4 w-4" />
            Nytt case
          </Link>
        </Button>
      </div>

      {pipelineGroups.map(group => {
        const groupDeals = deals.filter(d => group.statuses.includes(d.status));
        if (groupDeals.length === 0) return null;
        return (
          <div key={group.label}>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-sm font-semibold text-slate-700">{group.label}</h2>
              <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                {groupDeals.length}
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {groupDeals.map(deal => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          </div>
        );
      })}

      {deals.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <p className="text-lg font-medium mb-2">Inga case ännu</p>
          <p className="text-sm mb-4">Skapa ditt första investeringscase</p>
          <Button asChild>
            <Link href="/deals/new">
              <Plus className="h-4 w-4" />
              Nytt case
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
