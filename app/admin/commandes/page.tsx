'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { Order, OrderItem, Profile } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, ShoppingBag, Eye, MessageCircle, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import { toast } from 'sonner';

function formatPrice(price: number) {
  return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

const statusOptions = [
  { value: 'en_attente', label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'confirmee', label: 'Confirmée', color: 'bg-blue-100 text-blue-800' },
  { value: 'livree', label: 'Livrée', color: 'bg-green-100 text-green-800' },
  { value: 'annulee', label: 'Annulée', color: 'bg-red-100 text-red-800' },
];

type OrderWithItems = Order & { order_items: OrderItem[] };

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewOrder, setViewOrder] = useState<OrderWithItems | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    const { data } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });
    if (data) {
      setOrders(data as OrderWithItems[]);
      const userIds = Array.from(new Set(data.map((o: any) => o.user_id)));
      if (userIds.length > 0) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .in('id', userIds);
        const profileMap: Record<string, Profile> = {};
        (profileData || []).forEach((p: Profile) => {
          profileMap[p.id] = p;
        });
        setProfiles(profileMap);
      }
    }
    setLoading(false);
  }

  async function updateStatus(orderId: string, status: string) {
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
    if (error) { toast.error('Erreur'); return; }
    toast.success('Statut mis à jour');
    fetchOrders();
    if (viewOrder?.id === orderId) {
      setViewOrder({ ...viewOrder, status });
    }
  }

  function getStatusColor(status: string) {
    return statusOptions.find((s) => s.value === status)?.color || statusOptions[0].color;
  }

  function getStatusLabel(status: string) {
    return statusOptions.find((s) => s.value === status)?.label || status;
  }

  const filtered = orders.filter((o) => {
    const matchSearch = o.id.slice(0, 8).toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'en_attente').length,
    confirmed: orders.filter((o) => o.status === 'confirmee').length,
    delivered: orders.filter((o) => o.status === 'livree').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-poppins)' }}>
          Gestion des commandes
        </h1>
        <p className="text-muted-foreground">{orders.length} commande(s) au total</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
              <ShoppingBag className="h-5 w-5 text-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-xl font-bold">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
              <Clock className="h-5 w-5 text-yellow-700" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">En attente</p>
              <p className="text-xl font-bold">{stats.pending}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <CheckCircle className="h-5 w-5 text-blue-700" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Confirmées</p>
              <p className="text-xl font-bold">{stats.confirmed}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
              <Truck className="h-5 w-5 text-green-700" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Livrées</p>
              <p className="text-xl font-bold">{stats.delivered}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par numéro..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${statusFilter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-accent'}`}
          >
            Toutes
          </button>
          {statusOptions.map((s) => (
            <button
              key={s.value}
              onClick={() => setStatusFilter(s.value)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${statusFilter === s.value ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-accent'}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Aucune commande trouvée</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => {
            const profile = profiles[order.user_id];
            return (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                        {order.id.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-sm">N° {order.id.slice(0, 8)}</p>
                        <p className="text-xs text-muted-foreground">
                          {profile?.full_name || 'Client'} • {formatDate(order.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-sm">{formatPrice(order.total_amount)}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                      {order.whatsapp_sent && (
                        <Badge variant="secondary" className="text-xs">
                          <MessageCircle className="h-3 w-3 mr-1" />
                          WhatsApp
                        </Badge>
                      )}
                      <Button size="sm" variant="outline" onClick={() => setViewOrder(order)}>
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        Détails
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={!!viewOrder} onOpenChange={(open) => !open && setViewOrder(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'var(--font-poppins)' }}>
              Commande N° {viewOrder?.id.slice(0, 8)}
            </DialogTitle>
          </DialogHeader>
          {viewOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Client</p>
                  <p className="font-medium">{profiles[viewOrder.user_id]?.full_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p className="font-medium">{formatDate(viewOrder.created_at)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Téléphone</p>
                  <p className="font-medium">{profiles[viewOrder.user_id]?.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">WhatsApp</p>
                  <p className="font-medium">{profiles[viewOrder.user_id]?.whatsapp_number || 'N/A'}</p>
                </div>
              </div>

              {viewOrder.notes && (
                <div className="rounded-md bg-secondary p-3 text-sm">
                  <p className="text-muted-foreground text-xs mb-1">Notes du client</p>
                  <p>{viewOrder.notes}</p>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-sm font-medium">Articles</p>
                {viewOrder.order_items?.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-3 rounded-md border border-border">
                    <div>
                      <p className="text-sm font-medium">{item.item_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.item_type === 'chick' ? 'Poussin' : 'Accessoire'} • x{item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-medium">{formatPrice(item.unit_price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between font-bold pt-3 border-t border-border">
                <span>Total</span>
                <span className="text-primary">{formatPrice(viewOrder.total_amount)}</span>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Statut de la commande</p>
                <div className="flex gap-2 flex-wrap">
                  {statusOptions.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => updateStatus(viewOrder.id, s.value)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                        viewOrder.status === s.value
                          ? s.color + ' ring-2 ring-primary'
                          : 'bg-secondary hover:bg-accent'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {profiles[viewOrder.user_id]?.whatsapp_number && (
                <a
                  href={`https://wa.me/${profiles[viewOrder.user_id].whatsapp_number.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button className="w-full" variant="outline">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contacter le client sur WhatsApp
                  </Button>
                </a>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
