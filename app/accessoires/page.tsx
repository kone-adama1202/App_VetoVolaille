import { supabase } from '@/lib/supabase/client';
import { AccessoriesCatalog } from '@/components/catalog/accessories-catalog';

export const revalidate = 60;

export default async function AccessoiresPage() {
  const { data: accessories } = await supabase
    .from('accessories')
    .select('*')
    .order('is_featured', { ascending: false });

  return <AccessoriesCatalog accessories={accessories ?? []} />;
}
