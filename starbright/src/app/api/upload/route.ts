import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
import pdfParse from 'pdf-parse';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());

    // Extract text
    let text = '';
    try {
      const parsed = await pdfParse(buffer);
      text = parsed.text || '';
    } catch {
      text = '';
    }

    // Upload to Supabase Storage
    const filename = `pitch-decks/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const { data: uploadData, error: uploadError } = await supabaseServer.storage
      .from('documents')
      .upload(filename, buffer, { contentType: 'application/pdf', upsert: false });

    if (uploadError) {
      // Storage might not be configured yet — return text without URL
      return NextResponse.json({ url: '', text });
    }

    const { data: { publicUrl } } = supabaseServer.storage
      .from('documents')
      .getPublicUrl(uploadData.path);

    return NextResponse.json({ url: publicUrl, text });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
