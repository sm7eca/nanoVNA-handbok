export const dynamic = 'force-dynamic';

import { supabaseServer } from '@/lib/supabase-server';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatCurrency } from '@/lib/utils';

async function getPortfolioDeals() {
  const { data } = await supabaseServer
    .from('deals')
    .select('*, company:companies(*)')
    .eq('status', 'portfolio')
    .order('updated_at', { ascending: false });
  return data || [];
}

export default async function PortfolioPage() {
  const deals = await getPortfolioDeals();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Portfölj</h1>
        <p className="text-sm text-slate-500 mt-1">{deals.length} portföljbolag</p>
      </div>

      {deals.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-slate-400 text-sm">
            Inga portföljbolag ännu.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {deals.map((deal: any) => (
            <Link key={deal.id} href={`/deals/${deal.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-slate-900">{deal.company?.name}</h3>
                      {deal.company?.sector && (
                        <p className="text-xs text-slate-500 mt-0.5">{deal.company.sector}</p>
                      )}
                    </div>
                    <Badge variant="green">Portfölj</Badge>
                  </div>
                  {deal.proposed_investment && (
                    <p className="text-xs text-slate-500">
                      Investering: {formatCurrency(deal.proposed_investment)}
                    </p>
                  )}
                  <p className="text-xs text-slate-400 mt-2">Uppdaterad {formatDate(deal.updated_at)}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
