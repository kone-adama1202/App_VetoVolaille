import { supabase } from '@/lib/supabase/client';
import { ChicksCatalog } from '@/components/catalog/chicks-catalog';

export const revalidate = 60;

export default async function PoussinsPage() {
  const { data: chicks } = await supabase
    .from('chicks')
    .select('*')
    .order('is_featured', { ascending: false });

  return <ChicksCatalog chicks={chicks ?? []} />;
}
