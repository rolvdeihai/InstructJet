// app/api/certificates/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Unwrap params (Next.js 15)
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Invalid certificate ID' }, { status: 400 });
    }

    // 1. Fetch the submission
    const { data: submission, error } = await supabaseAdmin
      .from('challenge_submissions')
      .select('id, submitted_at, guide_url, user_id')
      .eq('id', id)
      .single();

    if (error || !submission) {
      console.error('Error fetching submission:', error);
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
    }

    // 2. Fetch the user separately using the user_id
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('full_name')
      .eq('id', submission.user_id)
      .single();

    if (userError) {
      console.error('Error fetching user:', userError);
    }

    const userName = user?.full_name || 'Participant';

    // 3. Fetch the guide title
    let guideTitle = 'Your Guide';
    const url = submission.guide_url;
    if (url) {
      const match = url.match(/\/guides\/([^\/\?]+)/);
      if (match) {
        const slug = match[1];
        const { data: guide } = await supabaseAdmin
          .from('guides')
          .select('title')
          .eq('slug', slug)
          .single();
        if (guide) {
          guideTitle = guide.title;
        }
      }
    }

    return NextResponse.json({
      id: submission.id,
      userName,
      guideTitle,
      submittedDate: submission.submitted_at,
      guideUrl: submission.guide_url,
    });
  } catch (error) {
    console.error('Error fetching certificate:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}