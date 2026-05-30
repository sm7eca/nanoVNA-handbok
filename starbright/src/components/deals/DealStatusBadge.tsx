import { Badge } from '@/components/ui/badge';
import type { DealStatus } from '@/types';
import { DEAL_STATUS_LABELS } from '@/types';

const statusVariants: Record<DealStatus, 'default' | 'secondary' | 'green' | 'yellow' | 'red' | 'blue' | 'purple' | 'outline'> = {
  new: 'blue',
  first_meeting: 'blue',
  screening: 'purple',
  parked: 'secondary',
  declined: 'red',
  dd: 'yellow',
  ik_prep: 'yellow',
  ik_decision: 'yellow',
  term_sheet: 'green',
  closing: 'green',
  portfolio: 'green',
  archive: 'secondary',
};

export function DealStatusBadge({ status }: { status: DealStatus }) {
  return (
    <Badge variant={statusVariants[status]}>
      {DEAL_STATUS_LABELS[status]}
    </Badge>
  );
}
