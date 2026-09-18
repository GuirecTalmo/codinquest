import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { getQuizForUser } from '@/lib/data/quiz';
import { QuizRunner } from '@/components/quiz/QuizRunner';
import { AlertCircle } from 'lucide-react';

export default async function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  const { id } = await params;
  const result = await getQuizForUser(id, session.user.id as string);

  if (result.status !== 'ok') {
    const message =
      result.status === 'not_found'
        ? 'Quiz non trouvé'
        : `Division ${result.requiredDivision} requise pour accéder à ce quiz`;

    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-error mx-auto mb-4" />
          <p className="text-error mb-4">{message}</p>
          <Link
            href="/dashboard"
            className="inline-block px-4 py-2 bg-accent border-[3px] border-accent-border text-on-accent shadow-hard hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
          >
            Retour au dashboard
          </Link>
        </div>
      </div>
    );
  }

  return <QuizRunner quiz={result.quiz} />;
}
