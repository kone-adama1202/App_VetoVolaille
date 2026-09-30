'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bird, Package, BookOpen, ShoppingBag, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

function formatPrice(price: number) {
  return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

type Stats = {
  chicksCount: number;
  accessoriesCount: number;
  articlesCount: number;
  ordersCount: number;
  pendingOrders: number;
  totalRevenue: number;
  recentOrders: any[];
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const [chicks, accessories, articles, orders] = await Promise.all([
        supabase.from('chicks').select('id', { count: 'exact', head: true }),
        supabase.from('accessories').select('id', { count: 'exact', head: true }),
        supabase.from('articles').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false }).limit(10),
      ]);

      const allOrders = orders.data || [];
      const pending = allOrders.filter((o: any) => o.status === 'en_attente').length;
      const revenue = allOrders
        .filter((o: any) => o.status === 'confirmee' || o.status === 'livree')
        .reduce((sum: number, o: any) => sum + Number(o.total_amount), 0);

      setStats({
        chicksCount: chicks.count || 0,
        accessoriesCount: accessories.count || 0,
        articlesCount: articles.count || 0,
        ordersCount: allOrders.length,
        pendingOrders: pending,
        totalRevenue: revenue,
        recentOrders: allOrders.slice(0, 5),
      });
      setLoading(false);
    }
    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-poppins)' }}>Tableau de bord</h1>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Poussins', value: stats.chicksCount, icon: Bird, color: 'bg-primary/10 text-primary', href: '/admin/poussins' },
    { label: 'Accessoires', value: stats.accessoriesCount, icon: Package, color: 'bg-accent/10 text-accent', href: '/admin/accessoires' },
    { label: 'Articles', value: stats.articlesCount, icon: BookOpen, color: 'bg-chart-3/10 text-chart-3', href: '/admin/conseils' },
    { label: 'Commandes', value: stats.ordersCount, icon: ShoppingBag, color: 'bg-chart-5/10 text-chart-5', href: '/admin/commandes' },
  ];

  const statusLabels: Record<string, { label: string; color: string }> = {
    en_attente: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
    confirmee: { label: 'Confirmée', color: 'bg-blue-100 text-blue-800' },
    livree: { label: 'Livrée', color: 'bg-green-100 text-green-800' },
    annulee: { label: 'Annulée', color: 'bg-red-100 text-red-800' },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-poppins)' }}>
          Tableau de bord
        </h1>
        <p className="text-muted-foreground">Vue d'ensemble de votre activité</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base" style={{ fontFamily: 'var(--font-poppins)' }}>
              Aperçu financier
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-accent" />
                <span className="text-sm font-medium">Revenu total</span>
              </div>
              <span className="font-bold text-accent">{formatPrice(stats.totalRevenue)}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <span className="text-sm font-medium">En attente</span>
              </div>
              <span className="font-bold">{stats.pendingOrders}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium">Total commandes</span>
              </div>
              <span className="font-bold">{stats.ordersCount}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base" style={{ fontFamily: 'var(--font-poppins)' }}>
                Commandes récentes
              </CardTitle>
              <Link href="/admin/commandes" className="text-sm text-primary hover:underline">
                Voir tout
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {stats.recentOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Aucune commande pour le moment</p>
            ) : (
              <div className="space-y-3">
                {stats.recentOrders.map((order: any) => {
                  const status = statusLabels[order.status] || statusLabels.en_attente;
                  return (
                    <Link key={order.id} href="/admin/commandes" className="block">
                      <div className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-secondary transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                            {order.id.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium">N° {order.id.slice(0, 8)}</p>
                            <p className="text-xs text-muted-foreground">{formatDate(order.created_at)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold">{formatPrice(order.total_amount)}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                            {status.label}
                          </span>
                        </div>
                      </div>
                    </Link>
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
