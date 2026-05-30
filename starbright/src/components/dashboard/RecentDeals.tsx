import Link from 'next/link';
import { Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DealStatusBadge } from '@/components/deals/DealStatusBadge';
import { formatDate } from '@/lib/utils';
import type { Deal } from '@/types';

interface RecentDealsProps {
  deals: Deal[];
}

export function RecentDeals({ deals }: RecentDealsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Senaste case</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {deals.length === 0 ? (
          <p className="text-sm text-slate-500 px-6 py-4">Inga case ännu. Skapa ditt första case!</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {deals.map(deal => (
              <Link
                key={deal.id}
                href={`/deals/${deal.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-8 w-8 rounded-md bg-blue-100 flex items-center justify-center shrink-0">
                    <Building2 className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900 text-sm truncate">
                      {deal.company?.name || 'Okänt bolag'}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {deal.company?.sector ?? deal.deal_source ?? ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0 ml-4">
                  <DealStatusBadge status={deal.status} />
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-slate-500">{deal.responsible_im || '–'}</p>
                    <p className="text-xs text-slate-400">{formatDate(deal.updated_at)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
