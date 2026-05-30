import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { NewDealForm } from '@/components/deals/NewDealForm';

export default function NewDealPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <Link
          href="/deals"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Tillbaka till case
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Nytt investeringscase</h1>
        <p className="text-sm text-slate-500 mt-1">
          Fyll i bolagsinformation och ladda upp pitch deck för AI-screening
        </p>
      </div>
      <NewDealForm />
    </div>
  );
}
