import { supabase } from '@/lib/supabase/client';
import { Hero, Services, FeaturedChicks, FeaturedAccessories, LatestArticles} from '@/components/home/sections';

export const revalidate = 60;

export default async function Home() {
  const [chicksRes, accessoriesRes, articlesRes] = await Promise.all([
    supabase.from('chicks').select('*').eq('is_featured', true).limit(3),
    supabase.from('accessories').select('*').eq('is_featured', true).limit(4),
    supabase.from('articles').select('*').order('created_at', { ascending: false }).limit(3),
  ]);

  const chicks = chicksRes.data ?? [];
  const accessories = accessoriesRes.data ?? [];
  const articles = articlesRes.data ?? [];

  return (
    <>
      <Hero />
      <Services />
      <FeaturedChicks chicks={chicks} />
      <FeaturedAccessories accessories={accessories} />
      <LatestArticles articles={articles} />
      
    </>
  );
}
