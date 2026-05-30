import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navbar() {
  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 shrink-0">
      <div />
      <div className="flex items-center gap-3">
        <Button asChild size="sm">
          <Link href="/deals/new">
            <Plus className="h-4 w-4" />
            Nytt case
          </Link>
        </Button>
        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
          IM
        </div>
      </div>
    </header>
  );
}
