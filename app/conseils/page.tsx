import { supabase } from '@/lib/supabase/client';
import { ArticlesList } from '@/components/articles/articles-list';

export const revalidate = 60;

export default async function ConseilsPage() {
  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false });

  return <ArticlesList articles={articles ?? []} />;
}
