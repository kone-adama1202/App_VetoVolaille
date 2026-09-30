'use client';

import { useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { Chick } from '@/lib/supabase/client';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Bird, Calendar, Package, ShoppingCart, Search, Star } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

function formatPrice(price: number) {
  return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
}

function formatDate(date: string | null) {
  if (!date) return 'Date à confirmer';
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function ChicksCatalog({ chicks }: { chicks: Chick[] }) {
  const { addItem } = useCart();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price-asc' | 'price-desc' | 'date'>('date');

  const filtered = useMemo(() => {
    let result = chicks.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
    );
    switch (sortBy) {
      case 'name':
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-asc':
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case 'date':
        result = [...result].sort((a, b) => {
          if (!a.sortie_date) return 1;
          if (!b.sortie_date) return -1;
          return new Date(a.sortie_date).getTime() - new Date(b.sortie_date).getTime();
        });
        break;
    }
    return result;
  }, [chicks, search, sortBy]);

  const handleAddToCart = (chick: Chick) => {
    if (!user) {
      toast.error('Veuillez vous connecter pour commander', {
        action: { label: 'Connexion', onClick: () => window.location.href = '/connexion' },
      });
      return;
    }
    addItem({
      id: `chick-${chick.id}`,
      type: 'chick',
      name: chick.name,
      price: chick.price,
      quantity: 1,
      image_url: chick.image_url,
      item_id: chick.id,
    });
    toast.success(`${chick.name} ajouté au panier`);
  };

  return (
    <div className="container mx-auto px-4 lg:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-poppins)' }}>
          Nos poussins
        </h1>
        <p className="text-muted-foreground text-lg">
          Races vaccinées et suivies vétérinairement. Choisissez et commandez en toute confiance.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une race..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="h-10 rounded-md border border-input bg-background px-4 text-sm"
        >
          <option value="date">Trier par date de sortie</option>
          <option value="name">Trier par nom</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix décroissant</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <Bird className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Aucun poussin trouvé</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((chick, idx) => (
            <Card
              key={chick.id}
              className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-slide-up"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div className="relative h-56 overflow-hidden">
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
                <div className="absolute top-3 right-3">
                  <Badge variant={chick.quantity_available > 0 ? 'secondary' : 'destructive'}>
                    {chick.quantity_available > 0 ? `${chick.quantity_available} dispo.` : 'Rupture'}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-poppins)' }}>
                    {chick.name}
                  </h3>
                  <span className="text-lg font-bold text-primary whitespace-nowrap">
                    {formatPrice(chick.price)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{chick.description}</p>
                <div className="space-y-2 pt-3 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>Sortie: <span className="font-medium text-foreground">{formatDate(chick.sortie_date)}</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Package className="h-4 w-4 text-primary" />
                    <span>Disponibilité: <span className="font-medium text-foreground">{chick.quantity_available} unités</span></span>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    className="flex-1"
                    onClick={() => handleAddToCart(chick)}
                    disabled={chick.quantity_available <= 0}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Commander
                  </Button>
                  <Link href="/panier">
                    <Button variant="outline" size="icon">
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
