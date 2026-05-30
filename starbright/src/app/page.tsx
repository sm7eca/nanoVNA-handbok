export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PipelineOverview } from '@/components/dashboard/PipelineOverview';
import { RecentDeals } from '@/components/dashboard/RecentDeals';
import { supabaseServer } from '@/lib/supabase-server';
import type { Deal } from '@/types';

async function getDeals(): Promise<Deal[]> {
  const { data, error } = await supabaseServer
    .from('deals')
    .select('*, company:companies(*)')
    .order('updated_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Error fetching deals:', error);
    return [];
  }
  return data as Deal[];
}

export default async function DashboardPage() {
  const deals = await getDeals();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Översikt av investeringspipelinen</p>
        </div>
        <Button asChild>
          <Link href="/deals/new">
            <Plus className="h-4 w-4" />
            Nytt case
          </Link>
        </Button>
      </div>

      <PipelineOverview deals={deals} />

      <RecentDeals deals={deals.slice(0, 10)} />
    </div>
  );
}
