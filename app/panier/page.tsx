'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Trash2, ShoppingCart, MessageCircle, Check, ArrowLeft, Bird } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

function formatPrice(price: number) {
  return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
}

const WHATSAPP_NUMBER = '22392397518';

export default function PanierPage() {
  const { items, removeItem, updateQuantity, clearCart, total } = useCart();
  const { user, profile } = useAuth();
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Veuillez vous connecter pour commander', {
        action: { label: 'Connexion', onClick: () => window.location.href = '/connexion' },
      });
      return;
    }
    if (items.length === 0) return;

    setLoading(true);
    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: total,
          status: 'en_attente',
          notes,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map((item) => ({
        order_id: orderData.id,
        item_type: item.type,
        item_id: item.item_id,
        item_name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      const message = buildWhatsAppMessage(orderData.id, items, total, profile?.full_name || '', notes);
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

      window.open(whatsappUrl, '_blank');

      await supabase
        .from('orders')
        .update({ whatsapp_sent: true })
        .eq('id', orderData.id);

      clearCart();
      setOrderComplete(true);
      toast.success('Commande passée ! WhatsApp ouvert pour confirmation.');
    } catch (err) {
      toast.error('Erreur lors de la commande. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="container mx-auto px-4 lg:px-6 py-16 max-w-lg text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent text-accent-foreground mx-auto mb-6 animate-scale-in">
          <Check className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-bold mb-3" style={{ fontFamily: 'var(--font-poppins)' }}>
          Commande envoyée !
        </h1>
        <p className="text-muted-foreground mb-8">
          Votre commande a été enregistrée et WhatsApp s'est ouvert pour confirmer
          avec notre équipe. Nous vous contacterons rapidement pour finaliser.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/poussins">
            <Button>
              <Bird className="h-4 w-4 mr-2" />
              Continuer mes achats
            </Button>
          </Link>
          <Link href="/compte/commandes">
            <Button variant="outline">
              Voir mes commandes
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 lg:px-6 py-20 text-center max-w-md">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary mx-auto mb-6">
          <ShoppingCart className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-poppins)' }}>
          Votre panier est vide
        </h1>
        <p className="text-muted-foreground mb-8">
          Parcourez nos poussins et accessoires pour commencer vos achats
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/poussins">
            <Button>
              <Bird className="h-4 w-4 mr-2" />
              Voir les poussins
            </Button>
          </Link>
          <Link href="/accessoires">
            <Button variant="outline">
              Voir les accessoires
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 lg:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-poppins)' }}>
          Mon panier
        </h1>
        <p className="text-muted-foreground">
          {items.length} article{items.length > 1 ? 's' : ''} dans votre panier
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="animate-slide-up">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="relative h-24 w-24 flex-shrink-0 rounded-lg overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge variant="outline" className="mb-1 capitalize">
                          {item.type === 'chick' ? 'Poussin' : 'Accessoire'}
                        </Badge>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{formatPrice(item.price)} / unité</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </Button>
                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                      <span className="font-bold text-primary">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <Link href="/poussins" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Continuer mes achats
          </Link>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle style={{ fontFamily: 'var(--font-poppins)' }}>Récapitulatif</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.name} x{item.quantity}
                    </span>
                    <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">{formatPrice(total)}</span>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Notes (optionnel)</label>
                <Textarea
                  placeholder="Précisions sur votre commande..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              {!user && (
                <div className="rounded-md bg-secondary p-3 text-sm text-muted-foreground">
                  <Link href="/connexion" className="text-primary font-medium hover:underline">
                    Connectez-vous
                  </Link>{' '}
                  pour finaliser votre commande
                </div>
              )}

              <Button
                className="w-full"
                size="lg"
                onClick={handleCheckout}
                disabled={loading || !user}
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                {loading ? 'Traitement...' : 'Commander via WhatsApp'}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Vous serez redirigé vers WhatsApp pour confirmer votre commande
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function buildWhatsAppMessage(
  orderId: string,
  items: { name: string; price: number; quantity: number; type: string }[],
  total: number,
  customerName: string,
  notes: string
): string {
  let msg = `🟢 *Nouvelle commande - VetoVolaille*\n`;
  msg += `Client: ${customerName}\n`;
  msg += `N° commande: ${orderId.slice(0, 8)}\n`;
  msg += `\n*Articles:*\n`;
  items.forEach((item) => {
    msg += `- ${item.name} (x${item.quantity}): ${formatPrice(item.price * item.quantity)}\n`;
  });
  msg += `\n*Total: ${formatPrice(total)}*\n`;
  if (notes) msg += `\nNotes: ${notes}\n`;
  return msg;
}
