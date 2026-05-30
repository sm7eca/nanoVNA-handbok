'use client';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function NewDealForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    company_name: '',
    deal_source: 'Inbound',
    responsible_im: '',
    notes: '',
    website: '',
    sector: '',
  });

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) setFile(accepted[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company_name) return;
    setLoading(true);

    try {
      let pitchDeckUrl = '';
      let pitchDeckText = '';

      if (file) {
        const fd = new FormData();
        fd.append('file', file);
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: fd });
        if (uploadRes.ok) {
          const data = await uploadRes.json();
          pitchDeckUrl = data.url;
          pitchDeckText = data.text;
        }
      }

      const res = await fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, pitch_deck_url: pitchDeckUrl, pitch_deck_text: pitchDeckText }),
      });

      if (res.ok) {
        const { deal } = await res.json();
        router.push(`/deals/${deal.id}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Bolagsinformation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="company_name">Bolagsnamn *</Label>
            <Input
              id="company_name"
              required
              placeholder="t.ex. Acme AB"
              value={form.company_name}
              onChange={e => setForm(f => ({ ...f, company_name: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="sector">Sektor</Label>
              <Input
                id="sector"
                placeholder="t.ex. SaaS, Fintech, Healthtech"
                value={form.sector}
                onChange={e => setForm(f => ({ ...f, sector: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="website">Hemsida</Label>
              <Input
                id="website"
                placeholder="https://..."
                value={form.website}
                onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Caseinformation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="deal_source">Källa</Label>
              <select
                id="deal_source"
                className="flex h-9 w-full rounded-md border border-slate-300 bg-white px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
                value={form.deal_source}
                onChange={e => setForm(f => ({ ...f, deal_source: e.target.value }))}
              >
                <option value="Inbound">Inbound</option>
                <option value="Network">Nätverk</option>
                <option value="Proactive">Proaktiv</option>
                <option value="Referral">Referens</option>
                <option value="Event">Event</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="responsible_im">Ansvarig IM</Label>
              <Input
                id="responsible_im"
                placeholder="Namn"
                value={form.responsible_im}
                onChange={e => setForm(f => ({ ...f, responsible_im: e.target.value }))}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="notes">Introduktionstext / Kommentar</Label>
            <Textarea
              id="notes"
              rows={3}
              placeholder="Bakgrund, kontext, anledning till intresse..."
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pitch Deck</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={cn(
              'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
              isDragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
            )}
          >
            <input {...getInputProps()} />
            {file ? (
              <div className="flex items-center justify-center gap-3 text-slate-700">
                <FileText className="h-6 w-6 text-blue-600" />
                <span className="font-medium">{file.name}</span>
                <span className="text-sm text-slate-400">({(file.size / 1024 / 1024).toFixed(1)} MB)</span>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="h-8 w-8 text-slate-400 mx-auto" />
                <p className="text-sm font-medium text-slate-600">
                  {isDragActive ? 'Släpp PDF här' : 'Dra och släpp pitch deck (PDF)'}
                </p>
                <p className="text-xs text-slate-400">eller klicka för att bläddra</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading || !form.company_name}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? 'Skapar case...' : 'Skapa case'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Avbryt
        </Button>
      </div>
    </form>
  );
}
