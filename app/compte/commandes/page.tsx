'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase/client';
import type { Order, OrderItem } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, ArrowLeft, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

function formatPrice(price: number) {
  return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

const statusLabels: Record<string, { label: string; color: string }> = {
  en_attente: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
  confirmee: { label: 'Confirmée', color: 'bg-blue-100 text-blue-800' },
  livree: { label: 'Livrée', color: 'bg-green-100 text-green-800' },
  annulee: { label: 'Annulée', color: 'bg-red-100 text-red-800' },
};

export default function CommandesPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<(Order & { order_items: OrderItem[] })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .then(({ data }) => {
          if (data) setOrders(data as (Order & { order_items: OrderItem[] })[]);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 lg:px-6 py-20 text-center max-w-md">
        <h1 className="text-2xl font-bold mb-4">Connexion requise</h1>
        <p className="text-muted-foreground mb-6">Connectez-vous pour voir vos commandes</p>
        <Link href="/connexion">
          <Button>Se connecter</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 lg:px-6 py-8 max-w-3xl">
      <Link href="/compte" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Retour au compte
      </Link>
      <h1 className="text-3xl lg:text-4xl font-bold mb-8" style={{ fontFamily: 'var(--font-poppins)' }}>
        Mes commandes
      </h1>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg text-muted-foreground mb-6">Aucune commande pour le moment</p>
          <Link href="/poussins">
            <Button>
              <ShoppingBag className="h-4 w-4 mr-2" />
              Passer une commande
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const status = statusLabels[order.status] || statusLabels.en_attente;
            return (
              <Card key={order.id} className="animate-slide-up">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base" style={{ fontFamily: 'var(--font-poppins)' }}>
                        Commande N° {order.id.slice(0, 8)}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{formatDate(order.created_at)}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    {order.order_items?.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <div>
                          <span className="font-medium">{item.item_name}</span>
                          <Badge variant="outline" className="ml-2 text-xs capitalize">
                            {item.item_type === 'chick' ? 'Poussin' : 'Accessoire'}
                          </Badge>
                          <span className="text-muted-foreground ml-2">x{item.quantity}</span>
                        </div>
                        <span className="text-muted-foreground">{formatPrice(item.unit_price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  {order.notes && (
                    <div className="rounded-md bg-secondary p-3 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Notes: </span>
                      {order.notes}
                    </div>
                  )}
                  <div className="flex justify-between font-bold pt-3 border-t border-border">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(order.total_amount)}</span>
                  </div>
                  {order.whatsapp_sent && (
                    <Badge variant="secondary" className="text-xs">
                      Notifié via WhatsApp
                    </Badge>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
