-- ============================================================================
-- MIGRATION : AJOUT DES CHAMPS D'ABONNEMENT
-- ============================================================================
-- À exécuter dans Supabase SQL Editor
-- ============================================================================

-- Ajouter les colonnes d'abonnement à la table users
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_plan TEXT DEFAULT 'basic' CHECK (subscription_plan IN ('basic', 'master', 'gold', 'enterprise'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'inactive', 'cancelled', 'past_due'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_start_date TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT UNIQUE;

-- Créer un index pour les recherches par plan
CREATE INDEX IF NOT EXISTS idx_users_subscription_plan ON users(subscription_plan);
CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON users(subscription_status);
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer_id ON users(stripe_customer_id);

-- Table pour l'historique des abonnements
CREATE TABLE IF NOT EXISTS subscription_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plan_type TEXT NOT NULL,
    status TEXT NOT NULL,
    amount DECIMAL(10,2),
    currency TEXT DEFAULT 'USD',
    stripe_payment_id TEXT,
    payment_date TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour l'historique
CREATE INDEX IF NOT EXISTS idx_subscription_history_user_id ON subscription_history(user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_history_payment_date ON subscription_history(payment_date);

-- Table pour les limites d'utilisation
CREATE TABLE IF NOT EXISTS usage_limits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    clients_count INTEGER DEFAULT 0,
    projects_count INTEGER DEFAULT 0,
    storage_used BIGINT DEFAULT 0, -- en bytes
    last_reset_date TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les limites
CREATE INDEX IF NOT EXISTS idx_usage_limits_user_id ON usage_limits(user_id);

-- Fonction pour vérifier les limites
CREATE OR REPLACE FUNCTION check_user_limit(
    p_user_id UUID,
    p_limit_type TEXT,
    p_current_count INTEGER
) RETURNS BOOLEAN AS $$
DECLARE
    v_plan TEXT;
    v_limit INTEGER;
BEGIN
    -- Récupérer le plan de l'utilisateur
    SELECT subscription_plan INTO v_plan
    FROM users
    WHERE id = p_user_id;

    -- Déterminer la limite selon le plan et le type
    CASE p_limit_type
        WHEN 'clients' THEN
            CASE v_plan
                WHEN 'basic' THEN v_limit := 50;
                WHEN 'master' THEN v_limit := 500;
                WHEN 'gold' THEN v_limit := 5000;
                WHEN 'enterprise' THEN v_limit := -1; -- illimité
            END CASE;
        WHEN 'projects' THEN
            CASE v_plan
                WHEN 'basic' THEN v_limit := 5;
                WHEN 'master' THEN v_limit := 50;
                WHEN 'gold' THEN v_limit := 500;
                WHEN 'enterprise' THEN v_limit := -1;
            END CASE;
        WHEN 'storage' THEN
            CASE v_plan
                WHEN 'basic' THEN v_limit := 1073741824; -- 1 GB in bytes
                WHEN 'master' THEN v_limit := 53687091200; -- 50 GB
                WHEN 'gold' THEN v_limit := 536870912000; -- 500 GB
                WHEN 'enterprise' THEN v_limit := -1;
            END CASE;
        ELSE
            v_limit := 0;
    END CASE;

    -- -1 signifie illimité
    IF v_limit = -1 THEN
        RETURN TRUE;
    END IF;

    -- Vérifier si la limite est atteinte
    RETURN p_current_count < v_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour incrémenter le compteur d'utilisation
CREATE OR REPLACE FUNCTION increment_usage(
    p_user_id UUID,
    p_type TEXT
) RETURNS VOID AS $$
BEGIN
    INSERT INTO usage_limits (user_id, clients_count, projects_count, storage_used)
    VALUES (p_user_id, 
            CASE WHEN p_type = 'clients' THEN 1 ELSE 0 END,
            CASE WHEN p_type = 'projects' THEN 1 ELSE 0 END,
            0)
    ON CONFLICT (user_id) 
    DO UPDATE SET
        clients_count = CASE WHEN p_type = 'clients' THEN usage_limits.clients_count + 1 ELSE usage_limits.clients_count END,
        projects_count = CASE WHEN p_type = 'projects' THEN usage_limits.projects_count + 1 ELSE usage_limits.projects_count END,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer automatiquement les limites d'utilisation
CREATE OR REPLACE FUNCTION create_usage_limits()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO usage_limits (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_usage_limits
    AFTER INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION create_usage_limits();

-- Mettre à jour les utilisateurs existants avec le plan basic par défaut
UPDATE users 
SET subscription_plan = 'basic', 
    subscription_status = 'active'
WHERE subscription_plan IS NULL;

-- Créer les enregistrements usage_limits pour les utilisateurs existants
INSERT INTO usage_limits (user_id)
SELECT id FROM users
ON CONFLICT (user_id) DO NOTHING;

-- Fonction pour obtenir le récapitulatif d'utilisation
CREATE OR REPLACE FUNCTION get_user_usage_summary(p_user_id UUID)
RETURNS TABLE (
    plan TEXT,
    clients_used INTEGER,
    clients_limit INTEGER,
    projects_used INTEGER,
    projects_limit INTEGER,
    storage_used BIGINT,
    storage_limit BIGINT
) AS $$
DECLARE
    v_plan TEXT;
BEGIN
    -- Récupérer le plan
    SELECT subscription_plan INTO v_plan FROM users WHERE id = p_user_id;

    RETURN QUERY
    SELECT
        v_plan,
        COALESCE(ul.clients_count, 0),
        CASE v_plan
            WHEN 'basic' THEN 50
            WHEN 'master' THEN 500
            WHEN 'gold' THEN 5000
            WHEN 'enterprise' THEN -1
        END,
        COALESCE(ul.projects_count, 0),
        CASE v_plan
            WHEN 'basic' THEN 5
            WHEN 'master' THEN 50
            WHEN 'gold' THEN 500
            WHEN 'enterprise' THEN -1
        END,
        COALESCE(ul.storage_used, 0),
        CASE v_plan
            WHEN 'basic' THEN 1073741824::BIGINT
            WHEN 'master' THEN 53687091200::BIGINT
            WHEN 'gold' THEN 536870912000::BIGINT
            WHEN 'enterprise' THEN -1::BIGINT
        END
    FROM usage_limits ul
    WHERE ul.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- POLITIQUES RLS POUR LES NOUVELLES TABLES
-- ============================================================================

-- Activer RLS
ALTER TABLE subscription_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_limits ENABLE ROW LEVEL SECURITY;

-- Politiques pour subscription_history
CREATE POLICY "Users can view own subscription history"
ON subscription_history FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all subscription history"
ON subscription_history FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Politiques pour usage_limits
CREATE POLICY "Users can view own usage limits"
ON usage_limits FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own usage limits"
ON usage_limits FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all usage limits"
ON usage_limits FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- ============================================================================
-- DONNÉES DE TEST (Optionnel)
-- ============================================================================

-- Mettre à jour un utilisateur de test avec le plan Master
-- UPDATE users 
-- SET subscription_plan = 'master',
--     subscription_status = 'active',
--     subscription_start_date = NOW()
-- WHERE email = 'test@crmpro2x.com';

-- ============================================================================
-- VÉRIFICATION
-- ============================================================================

-- Vérifier que les colonnes ont été ajoutées
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'users' 
AND column_name IN ('subscription_plan', 'subscription_status', 'stripe_customer_id');

-- Vérifier les nouvelles tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('subscription_history', 'usage_limits');

-- ============================================================================
-- FIN DE LA MIGRATION
-- ============================================================================
