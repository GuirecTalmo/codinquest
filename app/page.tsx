'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Trophy, Zap, Target, TrendingUp, ArrowRight, LogIn } from 'lucide-react';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Rediriger vers le dashboard si l'utilisateur est déjà connecté
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">CodeInQuest</span>
        </div>
        <Link
          href="/auth/signin"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
        >
          <LogIn className="w-4 h-4" />
          Se connecter
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Testez vos connaissances,
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                progressez en quiz !
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Relevez des défis, montez en divisions et devenez un maître du quiz.
              De Bronze à Challenger, chaque réussite compte !
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/auth/signup"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-xl"
            >
              Commencer
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/auth/signin"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold text-lg transition-colors border-2 border-gray-700"
            >
              J'ai déjà un compte
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-colors">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Trophy className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Système de Divisions</h3>
              <p className="text-gray-400">
                Montez de Bronze à Challenger en réussissant les quiz. 
                Chaque division ouvre de nouveaux défis !
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700 hover:border-purple-500 transition-colors">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Target className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Quiz Variés</h3>
              <p className="text-gray-400">
                Des quiz de difficulté progressive sur différents thèmes.
                Culture générale, sciences, histoire et plus encore !
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700 hover:border-green-500 transition-colors">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Suivi de Progression</h3>
              <p className="text-gray-400">
                Consultez votre historique, vos statistiques et votre classement.
                Visualisez vos progrès en temps réel !
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 pt-12 border-t border-gray-700">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-white mb-2">7</div>
                <div className="text-gray-400 text-sm">Divisions</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2">3</div>
                <div className="text-gray-400 text-sm">Niveaux</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2">6+</div>
                <div className="text-gray-400 text-sm">Quiz</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2">30+</div>
                <div className="text-gray-400 text-sm">Questions</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
