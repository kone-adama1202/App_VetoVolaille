import './globals.css';
import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import { AuthProvider } from '@/lib/auth-context';
import { CartProvider } from '@/lib/cart-context';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-poppins' });

export const metadata: Metadata = {
  title: 'VetoVolaille — Services vétérinaires & vente de poussins',
  description: 'Cabinet vétérinaire familial. Vente de poussins, accessoires, conseils vétérinaires pour volailles, moutons, boeufs, chiens et chevaux. Commande simplifiée via WhatsApp.',
  openGraph: {
    title: 'VetoVolaille — Services vétérinaires & vente de poussins',
    description: 'Cabinet vétérinaire familial. Vente de poussins, accessoires et conseils vétérinaires.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans antialiased min-h-screen flex flex-col" style={{ fontFamily: 'var(--font-inter)' }}>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster richColors position="top-center" />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
