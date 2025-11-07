-- Mettez à jour le rôle de l'utilisateur spécifié à 'super_admin' dans la table 'profiles'.
-- Assurez-vous de remplacer 'VOTRE_USER_ID_ICI' par l'ID réel de votre utilisateur.

UPDATE public.profiles
SET role = 'super_admin'
WHERE id = 'VOTRE_USER_ID_ICI';

-- Optionnel : Vérifiez que la mise à jour a été effectuée
SELECT id, full_name, email, role
FROM public.profiles
WHERE id = 'VOTRE_USER_ID_ICI';