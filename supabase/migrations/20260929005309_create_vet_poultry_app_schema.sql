/*
# Schema pour l'application vétérinaire / volaille

## Description
Crée le schéma complet pour une application de valorisation des services vétérinaires familiaux,
avec vente de poussins, accessoires, conseils vétérinaires, et gestion de commandes via WhatsApp.

## Tables créées

1. **profiles** — Profils utilisateurs liés à auth.users
   - id (uuid, PK, FK vers auth.users)
   - full_name (text) — nom complet
   - phone (text) — numéro de téléphone
   - whatsapp_number (text) — numéro WhatsApp pour notifications
   - created_at (timestamptz)

2. **chicks** — Catalogue de poussins à vendre
   - id (uuid, PK)
   - name (text) — race/type de poussin
   - description (text)
   - price (numeric) — prix unitaire
   - sortie_date (date) — date de sortie prévue
   - quantity_available (int) — quantité disponible
   - image_url (text) — URL de l'image
   - is_featured (boolean) — mis en avant sur la page d'accueil
   - created_at (timestamptz)

3. **accessories** — Catalogue d'accessoires pour poussins
   - id (uuid, PK)
   - name (text)
   - description (text)
   - price (numeric)
   - stock (int)
   - category (text) — catégorie (alimentation, habitat, santé, etc.)
   - image_url (text)
   - is_featured (boolean)
   - created_at (timestamptz)

4. **articles** — Conseils vétérinaires
   - id (uuid, PK)
   - title (text)
   - excerpt (text) — court résumé
   - content (text) — contenu complet
   - category (text) — catégorie (volaille, moutons, boeufs, chiens, chevaux)
   - image_url (text)
   - author (text) — nom du vétérinaire auteur
   - created_at (timestamptz)

5. **orders** — Commandes clients
   - id (uuid, PK)
   - user_id (uuid, FK vers auth.users)
   - total_amount (numeric)
   - status (text) — statut (en_attente, confirmee, livree, annulee)
   - whatsapp_sent (boolean) — notification WhatsApp envoyée
   - notes (text) — notes du client
   - created_at (timestamptz)

6. **order_items** — Articles d'une commande
   - id (uuid, PK)
   - order_id (uuid, FK vers orders)
   - item_type (text) — 'chick' ou 'accessory'
   - item_id (uuid) — référence vers chicks ou accessories
   - item_name (text) — nom au moment de la commande
   - quantity (int)
   - unit_price (numeric) — prix unitaire au moment de la commande

## Sécurité (RLS)
- Toutes les tables ont RLS activé.
- profiles: chaque utilisateur voit et modifie uniquement son profil.
- chicks, accessories, articles: lecture publique (anon + authenticated), écriture authenticated uniquement (admin).
- orders: chaque utilisateur voit uniquement ses commandes, crée ses propres commandes.
- order_items: accès via la commande parente (ownership check).

## Notes importantes
1. Les politiques pour chicks/accessories/articles permettent la lecture publique (catalogue visible sans connexion)
2. L'écriture (INSERT/UPDATE/DELETE) sur les tables catalogue est réservée aux utilisateurs authentifiés (admin)
3. Les commandes sont privées: seul le propriétaire peut voir ses commandes
4. Les order_items héritent de la visibilité de la commande parente
*/

-- ==================== PROFILES ====================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  phone text DEFAULT '',
  whatsapp_number text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ==================== CHICKS ====================
CREATE TABLE IF NOT EXISTS chicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  price numeric(10,2) NOT NULL DEFAULT 0,
  sortie_date date,
  quantity_available integer NOT NULL DEFAULT 0,
  image_url text DEFAULT '',
  is_featured boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chicks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_chicks" ON chicks;
CREATE POLICY "anon_select_chicks" ON chicks FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_chicks" ON chicks;
CREATE POLICY "auth_insert_chicks" ON chicks FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_chicks" ON chicks;
CREATE POLICY "auth_update_chicks" ON chicks FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_chicks" ON chicks;
CREATE POLICY "auth_delete_chicks" ON chicks FOR DELETE
  TO authenticated USING (true);

-- ==================== ACCESSORIES ====================
CREATE TABLE IF NOT EXISTS accessories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  price numeric(10,2) NOT NULL DEFAULT 0,
  stock integer NOT NULL DEFAULT 0,
  category text NOT NULL DEFAULT 'general',
  image_url text DEFAULT '',
  is_featured boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE accessories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_accessories" ON accessories;
CREATE POLICY "anon_select_accessories" ON accessories FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_accessories" ON accessories;
CREATE POLICY "auth_insert_accessories" ON accessories FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_accessories" ON accessories;
CREATE POLICY "auth_update_accessories" ON accessories FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_accessories" ON accessories;
CREATE POLICY "auth_delete_accessories" ON accessories FOR DELETE
  TO authenticated USING (true);

-- ==================== ARTICLES ====================
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  excerpt text DEFAULT '',
  content text DEFAULT '',
  category text NOT NULL DEFAULT 'volaille',
  image_url text DEFAULT '',
  author text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_articles" ON articles;
CREATE POLICY "anon_select_articles" ON articles FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_articles" ON articles;
CREATE POLICY "auth_insert_articles" ON articles FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_articles" ON articles;
CREATE POLICY "auth_update_articles" ON articles FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_articles" ON articles;
CREATE POLICY "auth_delete_articles" ON articles FOR DELETE
  TO authenticated USING (true);

-- ==================== ORDERS ====================
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  total_amount numeric(10,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'en_attente',
  whatsapp_sent boolean NOT NULL DEFAULT false,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_orders" ON orders;
CREATE POLICY "select_own_orders" ON orders FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_orders" ON orders;
CREATE POLICY "insert_own_orders" ON orders FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_orders" ON orders;
CREATE POLICY "update_own_orders" ON orders FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_orders" ON orders;
CREATE POLICY "delete_own_orders" ON orders FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ==================== ORDER_ITEMS ====================
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  item_type text NOT NULL,
  item_id uuid,
  item_name text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  unit_price numeric(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_order_items" ON order_items;
CREATE POLICY "select_own_order_items" ON order_items FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "insert_own_order_items" ON order_items;
CREATE POLICY "insert_own_order_items" ON order_items FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "update_own_order_items" ON order_items;
CREATE POLICY "update_own_order_items" ON order_items FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "delete_own_order_items" ON order_items;
CREATE POLICY "delete_own_order_items" ON order_items FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

-- ==================== INDEXES ====================
CREATE INDEX IF NOT EXISTS idx_chicks_featured ON chicks(is_featured);
CREATE INDEX IF NOT EXISTS idx_accessories_category ON accessories(category);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
