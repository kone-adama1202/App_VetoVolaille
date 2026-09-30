'use client';

import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react';
import {
  Bird,
  Phone,
  Mail,
  MapPin,
  Facebook,
  MessageCircle,
  HeartHandshake,
  BadgeCheck,
  Truck,
  ChevronUp,
  CreditCard,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ✏️ Contenu modifiable
const reassurance: {
  icon: LucideIcon;
  lines: [string, string];
  outer: string;
  inner: string;
}[] = [
  {
    icon: HeartHandshake,
    lines: ['Cabinet', 'familial'],
    outer: 'bg-primary/15',
    inner: 'bg-primary text-primary-foreground',
  },
  {
    icon: BadgeCheck,
    lines: ['La garantie', 'de la qualité'],
    outer: 'bg-accent/40',
    inner: 'bg-accent text-accent-foreground',
  },
  {
    icon: Truck,
    lines: ['Livraison', 'à votre porte'],
    outer: 'bg-secondary',
    inner: 'bg-secondary-foreground text-secondary',
  },
];

const socials = [
  { href: 'https://wa.me/22500000000', label: 'WhatsApp', icon: MessageCircle },
  { href: '#', label: 'Facebook', icon: Facebook },
];

const paymentMethods = ['Carte bancaire', 'Mobile Money', 'Espèces'];

const legalLinks = [
  { href: '/livraison', label: 'Livraison / Paiement' },
  { href: '/conditions', label: 'Conditions' },
  { href: '/mentions-legales', label: 'Mentions légales' },
  { href: '/confidentialite', label: 'Politique de confidentialité' },
  { href: '/plan-du-site', label: 'Plan du site' },
];

/** Flèche dessinée à la main entre deux pastilles */
function CurvedArrow({ flip = false, className }: { flip?: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 120 70"
      fill="none"
      stroke="currentColor"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn('h-16 w-28 shrink-0', flip && '-scale-y-100', className)}
    >
      <path d="M8 22 C 38 2, 92 6, 106 50" />
      <path d="M92 44 L106 54 L112 38" />
    </svg>
  );
}

export function Footer() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <footer className="mt-16 border-t-2 border-border bg-secondary/30">
      {/* 1. Réassurance */}
      <section className="container mx-auto px-4 py-14 lg:px-6 lg:py-20">
        <div className="flex flex-col items-center justify-center gap-10 md:flex-row md:items-start md:gap-4">
          {reassurance.map(({ icon: Icon, lines, outer, inner }, i) => (
            <Fragment key={lines.join(' ')}>
              {i > 0 && (
                <CurvedArrow
                  flip={i % 2 === 0}
                  className={cn(
                    'mt-10 hidden md:block',
                    i % 2 === 0 ? 'text-muted-foreground' : 'text-primary'
                  )}
                />
              )}
              <div className="flex w-56 flex-col items-center gap-5 text-center">
                <div className={cn('flex h-28 w-28 items-center justify-center rounded-full', outer)}>
                  <div className={cn('flex h-20 w-20 items-center justify-center rounded-full', inner)}>
                    <Icon className="h-9 w-9" strokeWidth={1.5} />
                  </div>
                </div>
                <p className="text-xl italic leading-snug text-foreground">
                  {lines[0]}
                  <br />
                  {lines[1]}
                </p>
              </div>
            </Fragment>
          ))}
        </div>
      </section>

      {/* 2. Marque / Livraison / Paiement */}
      <section className="container mx-auto px-4 pb-14 lg:px-6 lg:pb-16">
        <div className="grid grid-cols-1 items-center gap-10 border-t border-border pt-14 md:grid-cols-3">
          {/* Marque + réseaux + contact */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Bird className="h-6 w-6" />
              </div>
              <span className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-poppins)' }}>
                Veto<span className="text-primary">Volaille</span>
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-lg italic text-foreground">Suivez-nous</span>
              <div className="flex gap-2">
                {socials.map(({ href, label, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-110"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>+223 92 39 75 18</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>contact@vetovolaille.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Cabinet vétérinaire familial depuis 3 générations</span>
              </li>
            </ul>
          </div>

          {/* Carte livraison */}
          <div className="rounded-3xl border border-border bg-background p-7 shadow-sm">
            <h3 className="mb-5 flex items-center gap-2 text-lg italic text-primary">
              <Truck className="h-5 w-5" />
              Livraison
            </h3>
            <p className="text-sm leading-7 text-muted-foreground">
              Vos poussins sont préparés avec soin avant chaque départ.
              <br />
              Les commandes se retirent ou se livrent selon les points de vente disponibles.
              <br />
              Commandez aussi directement via WhatsApp !
            </p>
          </div>

          {/* Paiement */}
          <div className="text-center md:text-right">
            <h3 className="mb-5 text-xl italic text-foreground">Paiement sécurisé</h3>
            <ul className="flex flex-wrap justify-center gap-3 md:justify-end">
              {paymentMethods.map((method) => (
                <li
                  key={method}
                  className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground"
                >
                  <CreditCard className="h-4 w-4 text-primary" />
                  {method}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 3. Barre de liens */}
      <div className="bg-primary text-primary-foreground">
        <nav aria-label="Informations légales" className="container mx-auto px-4 py-5 lg:px-6">
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium">
            {legalLinks.map((link, i) => (
              <Fragment key={link.href}>
                {i > 0 && (
                  <li aria-hidden="true" className="hidden opacity-70 sm:block">
                    -
                  </li>
                )}
                <li>
                  <Link href={link.href} className="transition-opacity hover:opacity-80">
                    {link.label}
                  </Link>
                </li>
              </Fragment>
            ))}
          </ul>
          <p className="mt-3 text-center text-xs opacity-80">
            &copy; {new Date().getFullYear()} VetoVolaille. Tous droits réservés.
          </p>
        </nav>
      </div>

      {/* Retour en haut */}
      <button
        type="button"
        aria-label="Retour en haut de page"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={cn(
          'fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:scale-110',
          showTop ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
        )}
      >
        <ChevronUp className="h-6 w-6" />
      </button>
    </footer>
  );
}