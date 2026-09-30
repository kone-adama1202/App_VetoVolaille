'use client';

import { useAuth } from '@/lib/auth-context';
import { AdminSidebar } from '@/components/admin/sidebar';
import { Button } from '@/components/ui/button';
import { Bird, Lock, ShieldX } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-md text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary mx-auto mb-6">
          <Lock className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-poppins)' }}>
          Accès réservé
        </h1>
        <p className="text-muted-foreground mb-6">
          Vous devez être connecté pour accéder au tableau de bord administrateur.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/connexion">
            <Button size="lg">
              <Lock className="h-4 w-4 mr-2" />
              Se connecter
            </Button>
          </Link>
          <Link href="/inscription">
            <Button variant="outline" size="lg">
              <Bird className="h-4 w-4 mr-2" />
              Créer un compte
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-md text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mx-auto mb-6">
          <ShieldX className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-poppins)' }}>
          Accès refusé
        </h1>
        <p className="text-muted-foreground mb-6">
          Votre compte n'a pas les droits administrateur. Seuls les administrateurs
          peuvent accéder à cette section.
        </p>
        <Link href="/">
          <Button variant="outline">
            Retour à l'accueil
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <AdminSidebar />
      <div className="md:ml-64 p-4 lg:p-8">
        {children}
      </div>
    </div>
  );
}
