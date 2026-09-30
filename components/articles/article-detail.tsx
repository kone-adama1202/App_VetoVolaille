'use client';

import type { Article } from '@/lib/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ArrowLeft, Share2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

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

export function ArticleDetail({ article }: { article: Article }) {
  const contentParagraphs = article.content.split('\n');

  return (
    <article className="container mx-auto px-4 lg:px-6 py-8 max-w-4xl">
      <Link href="/conseils" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Retour aux conseils
      </Link>

      <div className="relative h-72 lg:h-96 rounded-2xl overflow-hidden mb-8 shadow-lg">
        <img
          src={article.image_url}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <Badge className="mb-3 bg-primary text-primary-foreground">
            {categoryLabels[article.category] || article.category}
          </Badge>
          <h1 className="text-2xl lg:text-4xl font-bold text-white" style={{ fontFamily: 'var(--font-poppins)' }}>
            {article.title}
          </h1>
        </div>
      </div>

      <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <User className="h-4 w-4" />
            </div>
            <span className="font-medium">{article.author}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(article.created_at)}</span>
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: article.title, url: window.location.href });
            } else {
              navigator.clipboard.writeText(window.location.href);
            }
          }}
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="prose prose-lg max-w-none space-y-4">
        {contentParagraphs.map((para, idx) => {
          const trimmed = para.trim();
          if (!trimmed) return null;
          if (trimmed.startsWith('## ')) {
            return (
              <h2 key={idx} className="text-xl font-bold mt-6 mb-3 text-primary" style={{ fontFamily: 'var(--font-poppins)' }}>
                {trimmed.replace('## ', '')}
              </h2>
            );
          }
          if (trimmed.startsWith('- ')) {
            return (
              <li key={idx} className="text-muted-foreground leading-relaxed ml-4">
                {trimmed.replace('- ', '')}
              </li>
            );
          }
          if (/^\d+\.\s/.test(trimmed)) {
            return (
              <li key={idx} className="text-muted-foreground leading-relaxed ml-4 list-decimal">
                {trimmed.replace(/^\d+\.\s/, '')}
              </li>
            );
          }
          return (
            <p key={idx} className="text-muted-foreground leading-relaxed">
              {trimmed}
            </p>
          );
        })}
      </div>
    </article>
  );
}
