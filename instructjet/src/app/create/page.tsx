// src/app/create/page.tsx

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getUserFromSession } from '@/lib/auth';
import CreateGuideClient from '@/components/CreateGuideClient';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default async function CreatePage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('instructjet_session')?.value;
  const user = await getUserFromSession(sessionToken);
  if (!user) redirect('/login');

  return (
    <>
      <Navbar />
      <CreateGuideClient userId={user.id} />
    </>
  );
}