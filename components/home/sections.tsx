'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Bird, Stethoscope, BookOpen, ShoppingCart, Shield, Truck, Heart, Star } from 'lucide-react';
import type { Chick, Accessory, Article } from '@/lib/supabase/client';

function formatPrice(price: number) {
  return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
}

function formatDate(date: string | null) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[560px] items-center overflow-hidden lg:min-h-[680px]">
      <img
        src="https://images.pexels.com/photos/37341692/pexels-photo-37341692.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/75 via-black/50 to-black/20" />

      <div className="container relative mx-auto px-4 py-16 lg:px-6 lg:py-24">
        <div className="max-w-2xl space-y-6 animate-slide-up text-white">
          <Badge variant="secondary" className="px-4 py-1.5 text-sm">
            <Stethoscope className="mr-1.5 h-3.5 w-3.5" />
            Cabinet vétérinaire familial depuis 3 générations
          </Badge>

          <h1
            className="text-balance text-4xl font-bold tracking-tight lg:text-6xl"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            Votre élevage, <span className="text-primary">notre expertise</span> vétérinaire
          </h1>

          <p className="max-w-xl text-lg leading-relaxed text-white/85">
            Vente de poussins de qualité, accessoires d'élevage, et conseils vétérinaires
            pour vos volailles, moutons, boeufs, chiens et chevaux. Commandez en un clic,
            recevez vos notifications directement sur WhatsApp.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="/poussins">
              <Button size="lg" className="text-base">
                <Bird className="mr-2 h-5 w-5" />
                Voir les poussins
              </Button>
            </Link>
            <Link href="/conseils">
              <Button
                variant="outline"
                size="lg"
                className="border-white/40 bg-white/10 text-base text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Nos conseils
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap gap-6 pt-4">
            <div className="flex items-center gap-2 text-sm text-white/85">
              <Shield className="h-5 w-5 text-accent" />
              <span>Vaccinés et suivis</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/85">
              <Truck className="h-5 w-5 text-accent" />
              <span>Livraison rapide</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/85">
              <Heart className="h-5 w-5 text-accent" />
              <span>Conseils experts</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Remplace la fonction `Services` de votre fichier. Imports inchangés
// (Bird, Stethoscope, BookOpen, ShoppingCart, ArrowRight, Link sont déjà importés).

export function Services() {
  const services = [
    {
      icon: Bird,
      title: 'Vente de poussins',
      description: 'Différentes races vaccinées et suivies vétérinairement. Dates de sortie garanties.',
      href: '/poussins',
      soft: 'bg-primary/10 text-primary',
      solid: 'group-hover:bg-primary group-hover:text-primary-foreground',
      blob: 'bg-primary/10',
      bar: 'bg-primary',
      cta: 'text-primary group-hover:bg-primary group-hover:text-primary-foreground border-primary/30',
    },
    {
      icon: ShoppingCart,
      title: 'Accessoires',
      description: 'Mangeoires, abreuvoirs, lampes chauffantes, vaccins, aliments et plus encore.',
      href: '/accessoires',
      soft: 'bg-primary/10 text-primary',
      solid: 'group-hover:bg-primary group-hover:text-primary-foreground',
      blob: 'bg-primary/10',
      bar: 'bg-primary',
      cta: 'text-primary group-hover:bg-primary group-hover:text-primary-foreground border-primary/30',
    },
    {
      icon: BookOpen,
      title: 'Conseils vétérinaires',
      description: 'Articles experts sur la santé animale: volaille, moutons, boeufs, chiens, chevaux.',
      href: '/conseils',
      soft: 'bg-primary/10 text-primary',
      solid: 'group-hover:bg-primary group-hover:text-primary-foreground',
      blob: 'bg-primary/10',
      bar: 'bg-primary',
      cta: 'text-primary group-hover:bg-primary group-hover:text-primary-foreground border-primary/30',
    },
    {
      icon: Stethoscope,
      title: 'Suivi vétérinaire',
      description: 'Trois générations de vétérinaires au service de la santé de vos animaux.',
      href: '/apropos',
      soft: 'bg-primary/10 text-primary',
      solid: 'group-hover:bg-primary group-hover:text-primary-foreground',
      blob: 'bg-primary/10',
      bar: 'bg-primary',
      cta: 'text-primary group-hover:bg-primary group-hover:text-primary-foreground border-primary/30',
    },
  ];

  return (
    <section className="relative overflow-hidden bg-secondary/20 py-20 lg:py-24">
      {/* Formes décoratives de fond */}
      <div aria-hidden="true" className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/5 blur-2xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-accent/10 blur-2xl" />

      <div className="container relative mx-auto px-4 lg:px-6">
        {/* En-tête */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Ce que nous faisons
          </span>
          <h2 className="mb-4 text-3xl font-bold lg:text-5xl" style={{ fontFamily: 'var(--font-poppins)' }}>
            Nos <span className="text-primary">services</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Une expertise complète au service de votre élevage et de vos animaux
          </p>
        </div>

        {/* Cartes */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {services.map((service, index) => (
            <Link
              key={service.title}
              href={service.href}
              className="group block h-full animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <article className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-border/60 bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                {/* Cercle décoratif qui grandit au survol */}
                <div
                  aria-hidden="true"
                  className={`absolute -right-12 -top-12 h-36 w-36 rounded-full transition-transform duration-500 group-hover:scale-[1.8] ${service.blob}`}
                />

                {/* Numéro */}
                <span
                  aria-hidden="true"
                  className="absolute right-6 top-5 text-5xl font-bold tabular-nums text-foreground/10"
                  style={{ fontFamily: 'var(--font-poppins)' }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>

                {/* Icône */}
                <div
                  className={`relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl shadow-sm transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 ${service.soft} ${service.solid}`}
                >
                  <service.icon className="h-8 w-8" />
                </div>

                {/* Texte */}
                <h3 className="relative mb-3 text-xl font-bold leading-tight" style={{ fontFamily: 'var(--font-poppins)' }}>
                  {service.title}
                </h3>
                <p className="relative flex-1 text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>

                {/* Lien */}
                <div className="relative mt-6 flex items-center justify-between border-t border-border/60 pt-5">
                  <span className="text-sm font-semibold text-foreground">Découvrir</span>
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 group-hover:translate-x-1 ${service.cta}`}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>

                {/* Barre de couleur qui s'étire au survol */}
                <span
                  aria-hidden="true"
                  className={`absolute bottom-0 left-0 h-1 w-0 transition-all duration-500 group-hover:w-full ${service.bar}`}
                />
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeaturedChicks({ chicks }: { chicks: Chick[] }) {
  if (chicks.length === 0) return null;
  return (
    <section className="container mx-auto px-4 lg:px-6 py-16">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-poppins)' }}>
            Poussins en vedette
          </h2>
          <p className="text-muted-foreground text-lg">Nos races les plus populaires</p>
        </div>
        <Link href="/poussins" className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all">
          Voir tout
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {chicks.map((chick, idx) => (
          <Card
            key={chick.id}
            className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-slide-up"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <div className="relative h-52 overflow-hidden">
              <img
                src={chick.image_url}
                alt={chick.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
              {chick.is_featured && (
                <div className="absolute top-3 left-3">
                  <Badge className="bg-primary text-primary-foreground">
                    <Star className="h-3 w-3 mr-1" />
                    En vedette
                  </Badge>
                </div>
              )}
            </div>
            <CardContent className="p-5 space-y-3">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-poppins)' }}>
                  {chick.name}
                </h3>
                <span className="text-lg font-bold text-primary">{formatPrice(chick.price)}</span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{chick.description}</p>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="text-xs text-muted-foreground">
                  Sortie: <span className="font-medium text-foreground">{formatDate(chick.sortie_date)}</span>
                </div>
                <Badge variant={chick.quantity_available > 0 ? 'secondary' : 'destructive'}>
                  {chick.quantity_available > 0 ? `${chick.quantity_available} dispo.` : 'Rupture'}
                </Badge>
              </div>
              <Link href="/poussins">
                <Button className="w-full" variant="outline">
                  Voir les détails
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function FeaturedAccessories({ accessories }: { accessories: Accessory[] }) {
  if (accessories.length === 0) return null;
  return (
    <section className="bg-secondary/20 py-16">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-poppins)' }}>
              Accessoires populaires
            </h2>
            <p className="text-muted-foreground text-lg">Tout pour bien démarrer votre élevage</p>
          </div>
          <Link href="/accessoires" className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all">
            Voir tout
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {accessories.map((acc, idx) => (
            <Card
              key={acc.id}
              className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-slide-up"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={acc.image_url}
                  alt={acc.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              <CardContent className="p-4 space-y-2">
                <Badge variant="outline" className="text-xs capitalize">{acc.category}</Badge>
                <h3 className="font-semibold text-sm" style={{ fontFamily: 'var(--font-poppins)' }}>
                  {acc.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 text-xs">{acc.description}</p>
                <div className="flex items-center justify-between pt-2">
                  <span className="font-bold text-primary">{formatPrice(acc.price)}</span>
                  <Badge variant={acc.stock > 0 ? 'secondary' : 'destructive'}>
                    {acc.stock > 0 ? `${acc.stock} en stock` : 'Rupture'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LatestArticles({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null;
  return (
    <section className="container mx-auto px-4 lg:px-6 py-16">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-poppins)' }}>
            Conseils vétérinaires
          </h2>
          <p className="text-muted-foreground text-lg">L'expertise de notre famille à votre service</p>
        </div>
        <Link href="/conseils" className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all">
          Tous les articles
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {articles.map((article, idx) => (
          <Link key={article.id} href={`/conseils/${article.id}`}>
            <Card
              className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-slide-up"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={article.image_url}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-primary text-primary-foreground capitalize">{article.category}</Badge>
                </div>
              </div>
              <CardContent className="p-5 space-y-2">
                <h3 className="font-semibold text-lg leading-tight" style={{ fontFamily: 'var(--font-poppins)' }}>
                  {article.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{article.excerpt}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                  <span>Par {article.author}</span>
                  <span>•</span>
                  <span>{formatDate(article.created_at)}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}