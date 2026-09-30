'use client';

import { useState, useMemo } from 'react';
import type { Article } from '@/lib/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { BookOpen, Search, Calendar, User } from 'lucide-react';
import Link from 'next/link';

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

const categoryLabels: Record<string, string> = {
  volaille: 'Volaille',
  moutons: 'Moutons',
  boeufs: 'Boeufs',
  chiens: 'Chiens',
  chevaux: 'Chevaux',
};

const categoryColors: Record<string, string> = {
  volaille: 'bg-primary/10 text-primary',
  moutons: 'bg-accent/10 text-accent',
  boeufs: 'bg-chart-3/10 text-chart-3',
  chiens: 'bg-chart-4/10 text-chart-4',
  chevaux: 'bg-chart-5/10 text-chart-5',
};

export function ArticlesList({ articles }: { articles: Article[] }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const categories = useMemo(() => {
    const cats = new Set(articles.map((a) => a.category));
    return ['all', ...Array.from(cats)];
  }, [articles]);

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const matchSearch =
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.excerpt.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === 'all' || a.category === category;
      return matchSearch && matchCategory;
    });
  }, [articles, search, category]);

  return (
    <div className="container mx-auto px-4 lg:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-poppins)' }}>
          Conseils vétérinaires
        </h1>
        <p className="text-muted-foreground text-lg">
          L'expertise de trois générations de vétérinaires, partagée pour vos animaux
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un conseil..."
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
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Aucun article trouvé</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((article, idx) => (
            <Link key={article.id} href={`/conseils/${article.id}`}>
              <Card
                className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-slide-up"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[article.category] || 'bg-primary/10 text-primary'}`}>
                      {categoryLabels[article.category] || article.category}
                    </span>
                  </div>
                </div>
                <CardContent className="p-5 space-y-3">
                  <h3 className="font-semibold text-lg leading-tight" style={{ fontFamily: 'var(--font-poppins)' }}>
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">{article.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
                    <div className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5" />
                      <span>{article.author}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{formatDate(article.created_at)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
