-- Table pour lier les utilisateurs WhatsApp à leurs profils Miabesite
CREATE TABLE IF NOT EXISTS whatsapp_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE, -- Un utilisateur Miabesite peut avoir un seul compte WhatsApp lié
    whatsapp_number TEXT UNIQUE NOT NULL, -- Le numéro de téléphone WhatsApp de l'utilisateur
    is_verified BOOLEAN DEFAULT FALSE NOT NULL, -- Si le numéro WhatsApp a été vérifié
    verification_code TEXT, -- Code OTP pour la vérification
    code_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Trigger pour la table 'whatsapp_users'
DROP TRIGGER IF EXISTS update_whatsapp_users_updated_at ON whatsapp_users;
CREATE TRIGGER update_whatsapp_users_updated_at
BEFORE UPDATE ON whatsapp_users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();