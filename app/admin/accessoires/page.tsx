'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { Accessory } from '@/lib/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Star, Search, Package } from 'lucide-react';
import { toast } from 'sonner';

function formatPrice(price: number) {
  return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
}

const emptyAccessory = {
  name: '',
  description: '',
  price: 0,
  stock: 0,
  category: 'alimentation',
  image_url: '',
  is_featured: false,
};

const categories = [
  { value: 'alimentation', label: 'Alimentation' },
  { value: 'habitat', label: 'Habitat' },
  { value: 'sante', label: 'Santé' },
  { value: 'general', label: 'Général' },
];

export default function AdminAccessoriesPage() {
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Accessory | null>(null);
  const [form, setForm] = useState(emptyAccessory);

  useEffect(() => {
    fetchAccessories();
  }, []);

  async function fetchAccessories() {
    setLoading(true);
    const { data } = await supabase.from('accessories').select('*').order('created_at', { ascending: false });
    setAccessories(data || []);
    setLoading(false);
  }

  function openNew() {
    setEditing(null);
    setForm(emptyAccessory);
    setDialogOpen(true);
  }

  function openEdit(acc: Accessory) {
    setEditing(acc);
    setForm({
      name: acc.name,
      description: acc.description,
      price: acc.price,
      stock: acc.stock,
      category: acc.category,
      image_url: acc.image_url,
      is_featured: acc.is_featured,
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!form.name || form.price <= 0) {
      toast.error('Veuillez remplir le nom et le prix');
      return;
    }
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    };

    if (editing) {
      const { error } = await supabase.from('accessories').update(payload).eq('id', editing.id);
      if (error) { toast.error('Erreur lors de la modification'); return; }
      toast.success('Accessoire modifié');
    } else {
      const { error } = await supabase.from('accessories').insert(payload);
      if (error) { toast.error('Erreur lors de l\'ajout'); return; }
      toast.success('Accessoire ajouté');
    }
    setDialogOpen(false);
    fetchAccessories();
  }

  async function handleDelete(id: string) {
    if (!confirm('Supprimer cet accessoire ?')) return;
    const { error } = await supabase.from('accessories').delete().eq('id', id);
    if (error) { toast.error('Erreur lors de la suppression'); return; }
    toast.success('Accessoire supprimé');
    fetchAccessories();
  }

  async function toggleFeatured(acc: Accessory) {
    const { error } = await supabase.from('accessories').update({ is_featured: !acc.is_featured }).eq('id', acc.id);
    if (error) { toast.error('Erreur'); return; }
    fetchAccessories();
  }

  const filtered = accessories.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-poppins)' }}>
            Gestion des accessoires
          </h1>
          <p className="text-muted-foreground">{accessories.length} produit(s) au catalogue</p>
        </div>
        <Button onClick={openNew}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Aucun accessoire trouvé</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((acc) => (
            <Card key={acc.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-32 overflow-hidden">
                <img src={acc.image_url} alt={acc.name} className="w-full h-full object-cover" />
                {acc.is_featured && (
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-primary text-primary-foreground">
                      <Star className="h-3 w-3 mr-1" />
                      Vedette
                    </Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-3 space-y-2">
                <Badge variant="outline" className="text-xs capitalize">{acc.category}</Badge>
                <h3 className="font-semibold text-sm">{acc.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary text-sm">{formatPrice(acc.price)}</span>
                  <Badge variant={acc.stock > 0 ? 'secondary' : 'destructive'} className="text-xs">
                    {acc.stock > 0 ? `${acc.stock} stock` : 'Rupture'}
                  </Badge>
                </div>
                <div className="flex gap-1 pt-1">
                  <Button size="sm" variant="outline" className="flex-1 h-8" onClick={() => openEdit(acc)}>
                    <Pencil className="h-3 w-3 mr-1" />
                    Modifier
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 px-2" onClick={() => toggleFeatured(acc)}>
                    <Star className={`h-3.5 w-3.5 ${acc.is_featured ? 'fill-primary text-primary' : ''}`} />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 px-2 text-destructive" onClick={() => handleDelete(acc.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'var(--font-poppins)' }}>
              {editing ? 'Modifier l\'accessoire' : 'Ajouter un accessoire'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Nom *</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Description</label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Prix (FCFA) *</label>
                <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Stock</label>
                <Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Catégorie</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">URL de l'image</label>
              <Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="acc-featured"
                checked={form.is_featured}
                onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                className="h-4 w-4 rounded"
              />
              <label htmlFor="acc-featured" className="text-sm font-medium">Mettre en vedette</label>
            </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={handleSave} className="flex-1">
                {editing ? 'Enregistrer' : 'Ajouter'}
              </Button>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
