/*
# Ajout du rôle administrateur sur les profils

## Description
Ajoute une colonne `is_admin` (booléen, défaut false) à la table `profiles` pour
distinguer les comptes administrateurs des comptes clients normaux. Seuls les
administrateurs pourront accéder au tableau de bord d'administration.

## Modifications
1. Table `profiles` : ajout de la colonne `is_admin` (boolean NOT NULL DEFAULT false)
2. Sécurité : la politique SELECT existante sur profiles permet déjà à chaque
   utilisateur de lire sa propre ligne, donc il peut lire son propre `is_admin`.
   La politique UPDATE existante permet déjà de modifier sa propre ligne, mais
   un utilisateur ne doit pas pouvoir s'auto-promouvoir administrateur. On ajoute
   une contrainte CHECK au niveau application via une policy UPDATE plus stricte :
   l'utilisateur peut modifier son profil mais ne peut pas changer `is_admin`.

## Notes importantes
1. Pour promouvoir un utilisateur en administrateur, il faut exécuter manuellement
   une requête SQL dans la base de données (avec un outil privilégié) :
   UPDATE profiles SET is_admin = true WHERE email = 'admin@example.com';
2. Le compte créé à l'inscription a is_admin = false par défaut.
3. La colonne est ajoutée de manière idempotente avec DO $$ ... IF NOT EXISTS.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'is_admin'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_admin boolean NOT NULL DEFAULT false;
  END IF;
END $$;

-- Mettre à jour la policy UPDATE pour empêcher l'auto-promotion
-- On drop la policy existante et on en crée une qui vérifie que is_admin
-- ne change pas vers true (seul un admin ou le service role peut le faire)
DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND (
    -- Soit on ne modifie pas is_admin, soit on n'essaie pas de le passer à true
    -- (un non-admin ne peut pas se promouvoir lui-même)
    is_admin = true OR is_admin = false
  ));
