import { Briefcase, Search, FlaskConical, BarChart3, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { Deal } from '@/types';

interface PipelineOverviewProps {
  deals: Deal[];
}

export function PipelineOverview({ deals }: PipelineOverviewProps) {
  const stages = [
    {
      label: 'Nya case',
      icon: Briefcase,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      count: deals.filter(d => d.status === 'new' || d.status === 'first_meeting').length,
    },
    {
      label: 'Screening',
      icon: Search,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      count: deals.filter(d => d.status === 'screening').length,
    },
    {
      label: 'DD pågår',
      icon: FlaskConical,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
      count: deals.filter(d => d.status === 'dd').length,
    },
    {
      label: 'Inför IK',
      icon: BarChart3,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      count: deals.filter(d => d.status === 'ik_prep' || d.status === 'ik_decision').length,
    },
    {
      label: 'Portfölj',
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-50',
      count: deals.filter(d => d.status === 'portfolio').length,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {stages.map(({ label, icon: Icon, color, bg, count }) => (
        <Card key={label}>
          <CardContent className="p-5">
            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${bg} mb-3`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <p className="text-2xl font-bold text-slate-900">{count}</p>
            <p className="text-sm text-slate-500 mt-0.5">{label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
