'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { Article } from '@/lib/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Search, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

const emptyArticle = {
  title: '',
  excerpt: '',
  content: '',
  category: 'volaille',
  image_url: '',
  author: '',
};

const categories = [
  { value: 'volaille', label: 'Volaille' },
  { value: 'moutons', label: 'Moutons' },
  { value: 'boeufs', label: 'Boeufs' },
  { value: 'chiens', label: 'Chiens' },
  { value: 'chevaux', label: 'Chevaux' },
];

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Article | null>(null);
  const [form, setForm] = useState(emptyArticle);

  useEffect(() => {
    fetchArticles();
  }, []);

  async function fetchArticles() {
    setLoading(true);
    const { data } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
    setArticles(data || []);
    setLoading(false);
  }

  function openNew() {
    setEditing(null);
    setForm(emptyArticle);
    setDialogOpen(true);
  }

  function openEdit(article: Article) {
    setEditing(article);
    setForm({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      image_url: article.image_url,
      author: article.author,
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!form.title || !form.content) {
      toast.error('Veuillez remplir le titre et le contenu');
      return;
    }

    if (editing) {
      const { error } = await supabase.from('articles').update(form).eq('id', editing.id);
      if (error) { toast.error('Erreur lors de la modification'); return; }
      toast.success('Article modifié');
    } else {
      const { error } = await supabase.from('articles').insert(form);
      if (error) { toast.error('Erreur lors de l\'ajout'); return; }
      toast.success('Article ajouté');
    }
    setDialogOpen(false);
    fetchArticles();
  }

  async function handleDelete(id: string) {
    if (!confirm('Supprimer cet article ?')) return;
    const { error } = await supabase.from('articles').delete().eq('id', id);
    if (error) { toast.error('Erreur lors de la suppression'); return; }
    toast.success('Article supprimé');
    fetchArticles();
  }

  const filtered = articles.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-poppins)' }}>
            Gestion des conseils
          </h1>
          <p className="text-muted-foreground">{articles.length} article(s) publié(s)</p>
        </div>
        <Button onClick={openNew}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un article..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Aucun article trouvé</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((article) => (
            <Card key={article.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden">
                    <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold truncate">{article.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">{article.excerpt}</p>
                      </div>
                      <Badge variant="outline" className="capitalize whitespace-nowrap">{article.category}</Badge>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>Par {article.author || 'N/A'}</span>
                        <span>•</span>
                        <span>{formatDate(article.created_at)}</span>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" className="h-8" onClick={() => openEdit(article)}>
                          <Pencil className="h-3.5 w-3.5 mr-1" />
                          Modifier
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 text-destructive" onClick={() => handleDelete(article.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'var(--font-poppins)' }}>
              {editing ? 'Modifier l\'article' : 'Ajouter un article'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Titre *</label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Résumé (extrait)</label>
              <Textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Contenu *</label>
              <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={10} placeholder="Utilisez ## pour les sous-titres, - pour les listes" />
            </div>
            <div className="grid grid-cols-2 gap-4">
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
                <label className="text-sm font-medium">Auteur</label>
                <Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} placeholder="Dr. Vétérinaire" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">URL de l'image</label>
              <Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
            </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={handleSave} className="flex-1">
                {editing ? 'Enregistrer' : 'Publier'}
              </Button>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
