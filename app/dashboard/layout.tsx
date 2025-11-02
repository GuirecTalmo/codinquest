'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { DivisionBadge } from '@/components/quiz/DivisionBadge';
import { LayoutDashboard, History, Trophy, LogOut, User } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/auth/signin');
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/history', label: 'Historique', icon: History },
    { href: '/dashboard/leaderboard', label: 'Classement', icon: Trophy },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname?.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-gray-900 border-b border-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo / Titre */}
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white hidden sm:block">
                CodeInQuest
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Profil utilisateur + Déconnexion */}
            <div className="flex items-center gap-4">
              {session?.user && (
                <div className="hidden sm:flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg border border-gray-700">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-white">
                      {session.user.name || session.user.email}
                    </span>
                  </div>
                  {(session.user as { division?: string }).division && (
                    <DivisionBadge
                      division={(session.user as { division?: string }).division as any}
                      size="sm"
                    />
                  )}
                </div>
              )}
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-800 px-4 py-2">
          <div className="flex items-center justify-around gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    active
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

