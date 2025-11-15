-- Activer le Row Level Security (RLS) pour la table profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Supprimer toutes les politiques existantes pour éviter les conflits
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Super admins and community admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Super admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Super admins can insert all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Super admins can delete all profiles" ON public.profiles;

-- 1. Politique pour permettre aux utilisateurs de voir leur propre profil
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- 2. Politique pour permettre aux utilisateurs de mettre à jour leur propre profil
CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 3. Politique pour permettre aux utilisateurs d'insérer leur propre profil (nécessaire pour le trigger handle_new_user)
CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- 4. Politique pour permettre aux Super Admins et aux Admins de Communauté de voir tous les profils
CREATE POLICY "Super admins and community admins can view all profiles"
ON public.profiles
FOR SELECT
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role = 'super_admin' OR role = 'community_admin')));

-- 5. Politique pour permettre aux Super Admins de mettre à jour tous les profils
CREATE POLICY "Super admins can update all profiles"
ON public.profiles
FOR UPDATE
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin'));

-- 6. Politique pour permettre aux Super Admins d'insérer des profils
CREATE POLICY "Super admins can insert all profiles"
ON public.profiles
FOR INSERT
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin'));

-- 7. Politique pour permettre aux Super Admins de supprimer des profils
CREATE POLICY "Super admins can delete all profiles"
ON public.profiles
FOR DELETE
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin'));