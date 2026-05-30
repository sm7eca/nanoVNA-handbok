import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">404 – Sidan hittades inte</h2>
      <p className="text-slate-500 mb-6">Sidan du letar efter existerar inte.</p>
      <Button asChild variant="outline">
        <Link href="/">Till dashboard</Link>
      </Button>
    </div>
  );
}
