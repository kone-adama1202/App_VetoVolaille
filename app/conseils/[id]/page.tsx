import { supabase } from '@/lib/supabase/client';
import { ArticleDetail } from '@/components/articles/article-detail';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const revalidate = 60;

export default async function ArticlePage({ params }: { params: { id: string } }) {
  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('id', params.id)
    .maybeSingle();

  if (!article) {
    return (
      <div className="container mx-auto px-4 lg:px-6 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Article introuvable</h1>
        <p className="text-muted-foreground mb-6">Cet article n'existe pas ou a été supprimé.</p>
        <Link href="/conseils">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux conseils
          </Button>
        </Link>
      </div>
    );
  }

  return <ArticleDetail article={article} />;
}
