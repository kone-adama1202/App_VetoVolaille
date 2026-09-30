'use client';

import { useState, useMemo } from 'react';
import type { Accessory } from '@/lib/supabase/client';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Search, Package } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

function formatPrice(price: number) {
  return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
}

const categoryLabels: Record<string, string> = {
  alimentation: 'Alimentation',
  habitat: 'Habitat',
  sante: 'Santé',
  general: 'Général',
};

export function AccessoriesCatalog({ accessories }: { accessories: Accessory[] }) {
  const { addItem } = useCart();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');

  const categories = useMemo(() => {
    const cats = new Set(accessories.map((a) => a.category));
    return ['all', ...Array.from(cats)];
  }, [accessories]);

  const filtered = useMemo(() => {
    return accessories.filter((a) => {
      const matchSearch =
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.description.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === 'all' || a.category === category;
      return matchSearch && matchCategory;
    });
  }, [accessories, search, category]);

  const handleAddToCart = (acc: Accessory) => {
    if (!user) {
      toast.error('Veuillez vous connecter pour commander', {
        action: { label: 'Connexion', onClick: () => window.location.href = '/connexion' },
      });
      return;
    }
    addItem({
      id: `accessory-${acc.id}`,
      type: 'accessory',
      name: acc.name,
      price: acc.price,
      quantity: 1,
      image_url: acc.image_url,
      item_id: acc.id,
    });
    toast.success(`${acc.name} ajouté au panier`);
  };

  return (
    <div className="container mx-auto px-4 lg:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-poppins)' }}>
          Accessoires & équipements
        </h1>
        <p className="text-muted-foreground text-lg">
          Tout le nécessaire pour l'élevage de vos poussins et volailles
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un accessoire..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                category === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-accent'
              }`}
            >
              {cat === 'all' ? 'Tous' : categoryLabels[cat] || cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Aucun accessoire trouvé</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((acc, idx) => (
            <Card
              key={acc.id}
              className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-slide-up"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={acc.image_url}
                  alt={acc.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-primary text-primary-foreground capitalize">
                    {categoryLabels[acc.category] || acc.category}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4 space-y-2">
                <h3 className="font-semibold text-sm" style={{ fontFamily: 'var(--font-poppins)' }}>
                  {acc.name}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{acc.description}</p>
                <div className="flex items-center justify-between pt-2">
                  <span className="font-bold text-primary">{formatPrice(acc.price)}</span>
                  <Badge variant={acc.stock > 0 ? 'secondary' : 'destructive'}>
                    {acc.stock > 0 ? `${acc.stock} en stock` : 'Rupture'}
                  </Badge>
                </div>
                <Button
                  className="w-full"
                  size="sm"
                  onClick={() => handleAddToCart(acc)}
                  disabled={acc.stock <= 0}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Ajouter au panier
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
