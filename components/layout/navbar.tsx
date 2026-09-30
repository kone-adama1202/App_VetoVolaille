'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment, useEffect, useRef, useState } from 'react';
import {
  Menu,
  X,
  ShoppingCart,
  Bird,
  User as UserIcon,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Facebook,
  Instagram,
  ShoppingBag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { useCart } from '@/lib/cart-context';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/poussins', label: 'Poussins' },
  { href: '/accessoires', label: 'Accessoires' },
  { href: '/conseils', label: 'Conseils' },
  { href: '/apropos', label: 'À propos' },
];

// ✏️ À modifier selon vos besoins (mettre null pour masquer)
const ANNOUNCEMENT: string | null = 'Livraison offerte dès 50 € d’achat';
const INFO_LINES: string[] | null = [
  'Commandes préparées sous 48 h.',
  'Conseils vétérinaires inclus avec chaque commande.',
];
const SOCIALS = [
  { href: 'https://facebook.com', label: 'Facebook', icon: Facebook },
  { href: 'https://instagram.com', label: 'Instagram', icon: Instagram },
];

function CartLink() {
  const { totalItems } = useCart();
  return (
    <Link
      href="/panier"
      className="relative flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
    >
      <span className="relative">
        <ShoppingCart className="h-6 w-6" />
        {totalItems > 0 && (
          <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
            {totalItems}
          </span>
        )}
      </span>
      <span className="hidden sm:inline">Mon panier</span>
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const { user, profile, isAdmin, signOut, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  // Nettoyage du timer au démontage
  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  // Ouvre le menu immédiatement au survol
  const handleMouseEnter = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setUserMenuOpen(true);
  };

  // Ferme le menu avec un léger délai pour laisser le temps d'y entrer
  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => {
      setUserMenuOpen(false);
    }, 150);
  };

  const displayName = profile?.full_name || user?.email?.split('@')[0];

  return (
    <>
      {/* 1. Bandeau d'annonce */}
      {ANNOUNCEMENT && (
        <div className="bg-primary px-4 py-3 text-center text-sm font-bold text-primary-foreground md:py-5 md:text-xl">
          {ANNOUNCEMENT}
        </div>
      )}

      {/* 2. Réseaux sociaux + encadré d'infos (desktop) */}
      <div className="hidden bg-secondary text-secondary-foreground md:block">
        <div className="container mx-auto flex items-center justify-between gap-8 px-6 py-3">
          <div className="flex flex-1 items-center justify-center gap-2">
            {SOCIALS.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-110"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
          {INFO_LINES && (
            <div className="flex-1 border border-current/70 px-5 py-3 text-center text-xs italic">
              {INFO_LINES.map((line) => (
                <p key={line} className="py-1">
                  {line}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3 + 4. Zone collante : logo / compte + menu */}
      <header
        className={cn(
          'sticky top-0 z-50 w-full bg-background transition-shadow duration-300',
          scrolled && 'shadow-md'
        )}
      >
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-4 md:h-24">
            {/* Gauche : burger (mobile) */}
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>

            {/* Centre : logo */}
            <Link href="/" className="group flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform group-hover:scale-110 md:h-12 md:w-12">
                <Bird className="h-5 w-5 md:h-7 md:w-7" />
              </div>
              <span
                className="text-xl font-bold tracking-tight md:text-3xl"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                Veto<span className="text-primary">Volaille</span>
              </span>
            </Link>

            {/* Droite : compte + panier */}
            <div className="flex items-center justify-end gap-3 md:gap-8">
              <div className="hidden md:block">
                {loading ? (
                  <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
                ) : user ? (
                  <div
                    className="relative"
                    ref={userMenuRef}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') setUserMenuOpen(false);
                    }}
                  >
                    <button
                      type="button"
                      aria-haspopup="menu"
                      aria-expanded={userMenuOpen}
                      onClick={() => setUserMenuOpen(true)}
                      className={cn(
                        'flex items-center gap-2 rounded-full border border-transparent py-1.5 pl-1.5 pr-3 text-sm transition-colors',
                        userMenuOpen
                          ? 'border-border bg-muted/60 text-primary'
                          : 'text-muted-foreground hover:text-primary'
                      )}
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold uppercase text-primary-foreground">
                        {displayName?.[0] ?? <UserIcon className="h-4 w-4" />}
                      </span>
                      <span className="max-w-28 truncate font-medium">{displayName}</span>
                      <ChevronDown
                        className={cn('h-4 w-4 transition-transform duration-200', userMenuOpen && 'rotate-180')}
                      />
                    </button>

                    {userMenuOpen && (
                      /* pt-3 = "pont" invisible : le survol n'est plus perdu entre le bouton et le menu */
                      <div className="absolute right-0 top-full z-[60] w-64 pt-3" role="menu">
                        <div className="relative animate-scale-in rounded-xl border border-border bg-popover p-1.5 shadow-xl">
                          {/* petite flèche */}
                          <span
                            aria-hidden="true"
                            className="absolute -top-1.5 right-6 h-3 w-3 rotate-45 border-l border-t border-border bg-popover"
                          />

                          {/* En-tête utilisateur */}
                          <div className="mb-1.5 flex items-center gap-3 rounded-lg bg-muted/40 px-3 py-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-base font-semibold uppercase text-primary-foreground">
                              {displayName?.[0] ?? <UserIcon className="h-5 w-5" />}
                            </span>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-foreground">{displayName}</p>
                              {user.email && (
                                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                              )}
                            </div>
                          </div>

                          <Link
                            href="/compte"
                            role="menuitem"
                            className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-primary/5 hover:text-primary"
                          >
                            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-muted/60 transition-colors group-hover:bg-primary/10">
                              <UserIcon className="h-4 w-4" />
                            </span>
                            Mon compte
                          </Link>

                          <Link
                            href="/compte/commandes"
                            role="menuitem"
                            className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-primary/5 hover:text-primary"
                          >
                            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-muted/60 transition-colors group-hover:bg-primary/10">
                              <ShoppingBag className="h-4 w-4" />
                            </span>
                            Mes commandes
                          </Link>

                          {isAdmin && (
                            <Link
                              href="/admin"
                              role="menuitem"
                              className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-primary/5 hover:text-primary"
                            >
                              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-muted/60 transition-colors group-hover:bg-primary/10">
                                <LayoutDashboard className="h-4 w-4" />
                              </span>
                              Administration
                            </Link>
                          )}

                          <div className="my-1.5 h-px bg-border" />

                          <button
                            type="button"
                            role="menuitem"
                            onClick={() => signOut()}
                            className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-muted-foreground transition-all hover:bg-destructive/5 hover:text-destructive"
                          >
                            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-muted/60 transition-colors group-hover:bg-destructive/10">
                              <LogOut className="h-4 w-4" />
                            </span>
                            Déconnexion
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/connexion"
                    className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    <UserIcon className="h-6 w-6" />
                    <span>Mon compte</span>
                  </Link>
                )}
              </div>
              <CartLink />
            </div>
          </div>
        </div>

        {/* Barre de menu (desktop) */}
        <nav className="hidden bg-primary text-primary-foreground md:block" aria-label="Navigation principale">
          <ul className="container mx-auto flex min-h-16 flex-wrap items-center justify-center px-6 lg:min-h-[4.5rem]">
            {navLinks.map((link, i) => {
              const active = pathname === link.href;
              return (
                <Fragment key={link.href}>
                  {i > 0 && (
                    <li aria-hidden="true" className="px-1.5">
                      <span className="block h-2 w-2 rounded-full border border-current opacity-70" />
                    </li>
                  )}
                  <li>
                    <Link
                      href={link.href}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'relative block px-5 py-5 text-sm font-semibold uppercase tracking-wide transition-opacity hover:opacity-80 lg:px-6 lg:text-[0.95rem]',
                        'after:absolute after:inset-x-5 after:bottom-3 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-current after:transition-transform hover:after:scale-x-100 lg:after:inset-x-6',
                        active && 'after:scale-x-100'
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                </Fragment>
              );
            })}
          </ul>
        </nav>

        {/* Menu mobile */}
        {mobileOpen && (
          <div className="animate-slide-up space-y-1 border-t border-border bg-background px-4 py-4 md:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'block rounded-md px-4 py-2.5 text-sm font-medium uppercase tracking-wide transition-colors hover:bg-accent',
                  pathname === link.href && 'bg-primary/10 text-primary'
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="space-y-1 border-t border-border pt-2">
              {user ? (
                <>
                  <Link
                    href="/compte"
                    className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/5 hover:text-primary"
                  >
                    <UserIcon className="h-4 w-4" />
                    Mon compte
                  </Link>
                  <Link
                    href="/compte/commandes"
                    className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/5 hover:text-primary"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Mes commandes
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/5 hover:text-primary"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Administration
                    </Link>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-left text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Déconnexion
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 px-4 pt-2">
                  <Link href="/connexion">
                    <Button variant="outline" className="w-full">
                      Connexion
                    </Button>
                  </Link>
                  <Link href="/inscription">
                    <Button className="w-full">S&apos;inscrire</Button>
                  </Link>
                </div>
              )}
            </div>
            <div className="flex justify-center gap-2 pt-4">
              {SOCIALS.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
}