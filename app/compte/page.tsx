'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase/client';
import type { Order, OrderItem } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, MessageCircle, Package, LogOut, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

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

export default function ComptePage() {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [saving, setSaving] = useState(false);
  const [orders, setOrders] = useState<(Order & { order_items: OrderItem[] })[]>([]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
      setWhatsapp(profile.whatsapp_number || '');
    }
  }, [profile]);

  useEffect(() => {
    if (user) {
      supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)
        .then(({ data }) => {
          if (data) setOrders(data as (Order & { order_items: OrderItem[] })[]);
        });
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName, phone, whatsapp_number: whatsapp })
      .eq('id', user?.id);
    if (error) {
      toast.error('Erreur lors de la sauvegarde');
    } else {
      toast.success('Profil mis à jour');
      refreshProfile();
    }
    setSaving(false);
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 lg:px-6 py-20 text-center max-w-md">
        <h1 className="text-2xl font-bold mb-4">Connexion requise</h1>
        <p className="text-muted-foreground mb-6">Connectez-vous pour accéder à votre compte</p>
        <Link href="/connexion">
          <Button>Se connecter</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 lg:px-6 py-8 max-w-4xl">
      <h1 className="text-3xl lg:text-4xl font-bold mb-8" style={{ fontFamily: 'var(--font-poppins)' }}>
        Mon compte
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg" style={{ fontFamily: 'var(--font-poppins)' }}>
              Mon profil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-border">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <User className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium">{profile?.full_name || 'Utilisateur'}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Nom complet</label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Téléphone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-10" placeholder="+225 00 00 00 00" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">WhatsApp</label>
                <div className="relative">
                  <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="pl-10" placeholder="+225 00 00 00 00" />
                </div>
              </div>
            </div>
            <Button onClick={handleSave} disabled={saving} className="w-full">
              {saving ? 'Sauvegarde...' : 'Enregistrer'}
            </Button>
            <Button variant="outline" className="w-full" onClick={() => signOut()}>
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg" style={{ fontFamily: 'var(--font-poppins)' }}>
                Commandes récentes
              </CardTitle>
              <Link href="/compte/commandes" className="text-sm text-primary hover:underline">
                Voir tout
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground mb-4">Aucune commande pour le moment</p>
                <Link href="/poussins">
                  <Button variant="outline">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Passer une commande
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const status = statusLabels[order.status] || statusLabels.en_attente;
                  return (
                    <div key={order.id} className="rounded-lg border border-border p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">N° {order.id.slice(0, 8)}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{formatDate(order.created_at)}</p>
                      <div className="space-y-1">
                        {order.order_items?.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span>{item.item_name} x{item.quantity}</span>
                            <span className="text-muted-foreground">{formatPrice(item.unit_price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between font-bold pt-2 border-t border-border">
                        <span>Total</span>
                        <span className="text-primary">{formatPrice(order.total_amount)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
