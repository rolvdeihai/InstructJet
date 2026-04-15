// scr/app/create/page.tsx

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getUserFromSession } from '@/lib/auth';
import CreateGuideClient from '@/components/CreateGuideClient';

export default async function CreatePage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('instructjet_session')?.value;
  const user = await getUserFromSession(sessionToken);
  if (!user) redirect('/login');

  return <CreateGuideClient userId={user.id} />;
}