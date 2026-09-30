'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { Chick } from '@/lib/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Star, Search, Bird } from 'lucide-react';
import { toast } from 'sonner';

function formatPrice(price: number) {
  return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
}

function formatDate(date: string | null) {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

const emptyChick = {
  name: '',
  description: '',
  price: 0,
  sortie_date: '',
  quantity_available: 0,
  image_url: '',
  is_featured: false,
};

export default function AdminChicksPage() {
  const [chicks, setChicks] = useState<Chick[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Chick | null>(null);
  const [form, setForm] = useState(emptyChick);

  useEffect(() => {
    fetchChicks();
  }, []);

  async function fetchChicks() {
    setLoading(true);
    const { data } = await supabase.from('chicks').select('*').order('created_at', { ascending: false });
    setChicks(data || []);
    setLoading(false);
  }

  function openNew() {
    setEditing(null);
    setForm(emptyChick);
    setDialogOpen(true);
  }

  function openEdit(chick: Chick) {
    setEditing(chick);
    setForm({
      name: chick.name,
      description: chick.description,
      price: chick.price,
      sortie_date: chick.sortie_date || '',
      quantity_available: chick.quantity_available,
      image_url: chick.image_url,
      is_featured: chick.is_featured,
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
      quantity_available: Number(form.quantity_available),
      sortie_date: form.sortie_date || null,
    };

    if (editing) {
      const { error } = await supabase.from('chicks').update(payload).eq('id', editing.id);
      if (error) {
        toast.error('Erreur lors de la modification');
        return;
      }
      toast.success('Poussin modifié');
    } else {
      const { error } = await supabase.from('chicks').insert(payload);
      if (error) {
        toast.error('Erreur lors de l\'ajout');
        return;
      }
      toast.success('Poussin ajouté');
    }
    setDialogOpen(false);
    fetchChicks();
  }

  async function handleDelete(id: string) {
    if (!confirm('Supprimer ce poussin ?')) return;
    const { error } = await supabase.from('chicks').delete().eq('id', id);
    if (error) {
      toast.error('Erreur lors de la suppression');
      return;
    }
    toast.success('Poussin supprimé');
    fetchChicks();
  }

  async function toggleFeatured(chick: Chick) {
    const { error } = await supabase
      .from('chicks')
      .update({ is_featured: !chick.is_featured })
      .eq('id', chick.id);
    if (error) {
      toast.error('Erreur');
      return;
    }
    fetchChicks();
  }

  const filtered = chicks.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-poppins)' }}>
            Gestion des poussins
          </h1>
          <p className="text-muted-foreground">{chicks.length} produit(s) au catalogue</p>
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Bird className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Aucun poussin trouvé</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((chick) => (
            <Card key={chick.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-36 overflow-hidden">
                <img src={chick.image_url} alt={chick.name} className="w-full h-full object-cover" />
                {chick.is_featured && (
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-primary text-primary-foreground">
                      <Star className="h-3 w-3 mr-1" />
                      Vedette
                    </Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold">{chick.name}</h3>
                  <span className="font-bold text-primary text-sm">{formatPrice(chick.price)}</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{chick.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Sortie: {formatDate(chick.sortie_date)}</span>
                  <Badge variant={chick.quantity_available > 0 ? 'secondary' : 'destructive'}>
                    {chick.quantity_available > 0 ? `${chick.quantity_available} dispo.` : 'Rupture'}
                  </Badge>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => openEdit(chick)}>
                    <Pencil className="h-3.5 w-3.5 mr-1" />
                    Modifier
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => toggleFeatured(chick)}>
                    <Star className={`h-4 w-4 ${chick.is_featured ? 'fill-primary text-primary' : ''}`} />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(chick.id)}>
                    <Trash2 className="h-4 w-4" />
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
              {editing ? 'Modifier le poussin' : 'Ajouter un poussin'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Nom *</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Cobb 500" />
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
                <label className="text-sm font-medium">Quantité dispo.</label>
                <Input type="number" value={form.quantity_available} onChange={(e) => setForm({ ...form, quantity_available: Number(e.target.value) })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Date de sortie</label>
              <Input type="date" value={form.sortie_date} onChange={(e) => setForm({ ...form, sortie_date: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">URL de l'image</label>
              <Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={form.is_featured}
                onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                className="h-4 w-4 rounded"
              />
              <label htmlFor="featured" className="text-sm font-medium">Mettre en vedette</label>
            </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={handleSave} className="flex-1">
                {editing ? 'Enregistrer' : 'Ajouter'}
              </Button>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Annuler
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
