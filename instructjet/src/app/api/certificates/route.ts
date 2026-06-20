// app/api/certificates/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserFromSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('instructjet_session')?.value;
  if (!sessionToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const user = await getUserFromSession(sessionToken);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch all challenge submissions for this user, ordered by newest first
  const { data: submissions, error } = await supabaseAdmin
    .from('challenge_submissions')
    .select('id, guide_url, submitted_at, week_start')
    .eq('user_id', user.id)
    .order('submitted_at', { ascending: false });

  if (error) {
    console.error('Error fetching certificates:', error);
    return NextResponse.json({ error: 'Failed to fetch certificates' }, { status: 500 });
  }

  // For each submission, extract guide slug and fetch title
  const certificates = await Promise.all(
    submissions.map(async (sub) => {
      let guideTitle = 'Your Guide';
      const url = sub.guide_url;
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

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      return {
        id: sub.id,
        guideTitle,
        guideUrl: sub.guide_url,
        submittedAt: sub.submitted_at,
        certificateUrl: `${baseUrl}/certificates/${sub.id}`,
        weekStart: sub.week_start,
      };
    })
  );

  return NextResponse.json({ certificates });
}