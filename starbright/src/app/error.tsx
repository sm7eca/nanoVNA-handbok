'use client';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Något gick fel</h2>
      <p className="text-slate-500 mb-6 text-sm">{error.message}</p>
      <Button onClick={() => reset()} variant="outline">Försök igen</Button>
    </div>
  );
}
