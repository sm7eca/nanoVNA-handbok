import Link from 'next/link';
import { Building2, Calendar, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { DealStatusBadge } from './DealStatusBadge';
import { formatDate } from '@/lib/utils';
import type { Deal } from '@/types';

interface DealCardProps {
  deal: Deal;
}

export function DealCard({ deal }: DealCardProps) {
  return (
    <Link href={`/deals/${deal.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-blue-100 flex items-center justify-center">
                <Building2 className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">
                  {deal.company?.name || 'Okänt bolag'}
                </h3>
                {deal.company?.sector && (
                  <p className="text-xs text-slate-500">{deal.company.sector}</p>
                )}
              </div>
            </div>
            <DealStatusBadge status={deal.status} />
          </div>
          <div className="space-y-1.5">
            {deal.responsible_im && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <User className="h-3 w-3" />
                <span>{deal.responsible_im}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(deal.updated_at)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
