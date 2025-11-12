-- Activer l'extension uuid-ossp pour la génération d'UUID si non existante
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Activer l'extension pgcrypto pour les fonctions de hachage si non existante
CREATE EXTENSION IF NOT EXISTS pgcrypto;