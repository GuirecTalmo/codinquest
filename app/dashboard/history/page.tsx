import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getUserHistory } from '@/lib/data/history';
import { HistoryList } from '@/components/quiz/HistoryList';

export default async function HistoryPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  const attempts = await getUserHistory(session.user.id as string, { limit: 100 });

  return <HistoryList attempts={attempts} />;
}
