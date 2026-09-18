'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { DivisionBadge } from '@/components/quiz/DivisionBadge';
import { PixelIcon } from '@/components/PixelIcon';
import { Division } from '@prisma/client';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [division, setDivision] = useState<Division | null>(null);

  // La division de la session NextAuth n'est fixée qu'à la connexion (voir
  // lib/auth.ts) et ne reflète plus une promotion survenue en cours de
  // session. On relit la division à jour depuis l'API à chaque changement de
  // page, pour que ce badge reste synchronisé avec le reste du dashboard.
  useEffect(() => {
    if (!session?.user) return;

    fetch('/api/user/profile')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.stats?.division) {
          setDivision(data.stats.division);
        }
      })
      .catch(() => {});
  }, [session?.user, pathname]);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/auth/signin');
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' as const },
    { href: '/dashboard/history', label: 'Historique', icon: 'History' as const },
    { href: '/dashboard/leaderboard', label: 'Classement', icon: 'Trophy' as const },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname?.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-bg">
      {/* Navbar -- fond ink fixe, comme l'app-bar de la source (la seule
          surface qui ne "theme-swap" jamais). */}
      <nav className="sticky top-0 z-50 bg-ink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo / Titre -- ramène à la landing page, pas au dashboard */}
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/icons/chest-closed-48.png"
                alt=""
                aria-hidden="true"
                width={48}
                height={48}
                unoptimized
                className="w-10 h-10 [image-rendering:pixelated]"
              />
              <span className="text-xl font-display font-bold text-on-ink hidden sm:block">
                CodeInQuest
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium uppercase tracking-wide transition-colors ${
                      active
                        ? 'bg-accent text-on-accent'
                        : 'text-on-ink/70 hover:bg-white/10 hover:text-on-ink'
                    }`}
                  >
                    <PixelIcon name={item.icon} className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Profil utilisateur + Déconnexion */}
            <div className="flex items-center gap-4">
              {session?.user && (
                <div className="hidden sm:flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-surface border-[3px] border-border">
                    <PixelIcon name="User" className="w-4 h-4 text-text-secondary" />
                    <span className="text-sm font-medium text-text-primary">
                      {session.user.name || session.user.email}
                    </span>
                  </div>
                  {division && (
                    <DivisionBadge division={division} size="sm" />
                  )}
                </div>
              )}
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 bg-error border-[3px] border-error text-on-state text-sm font-medium uppercase tracking-wide shadow-hard hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
              >
                <PixelIcon name="LogOut" className="w-4 h-4" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t-[3px] border-border/40 px-4 py-2">
          <div className="flex items-center justify-around gap-1">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium uppercase tracking-wide transition-colors ${
                    active
                      ? 'bg-accent text-on-accent'
                      : 'text-on-ink/60 hover:bg-white/10 hover:text-on-ink'
                  }`}
                >
                  <PixelIcon name={item.icon} className="w-5 h-5" />
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
