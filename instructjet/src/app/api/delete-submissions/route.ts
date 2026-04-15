import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: NextRequest) {
  try {
    const { ids } = await req.json();
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'No IDs provided' }, { status: 400 });
    }

    // First, get the file URLs to delete from storage
    const { data: submissions, error: fetchError } = await supabaseAdmin
      .from('media_uploads')
      .select('id, file_url')
      .in('id', ids);

    if (fetchError) throw fetchError;

    // Delete each file from storage
    for (const sub of submissions) {
      // Extract bucket and path from public URL
      // Example: https://.../storage/v1/object/public/worker-uploads/worker-uploads/guideId/file.png
      const urlParts = sub.file_url.split('/storage/v1/object/public/');
      if (urlParts.length > 1) {
        const bucketAndPath = urlParts[1];
        const [bucket, ...pathParts] = bucketAndPath.split('/');
        const filePath = pathParts.join('/');
        await supabaseAdmin.storage.from(bucket).remove([filePath]);
      }
    }

    // Delete database records
    const { error: deleteError } = await supabaseAdmin
      .from('media_uploads')
      .delete()
      .in('id', ids);

    if (deleteError) throw deleteError;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Deletion error:', error);
    return NextResponse.json({ error: 'Failed to delete submissions' }, { status: 500 });
  }
}