// ============================================================================
// MIDDLEWARE DE CONTRÔLE D'ACCÈS AUX FONCTIONNALITÉS
// ============================================================================
// Fichier : src/middleware/FeatureGuard.tsx
// ============================================================================

import { ReactNode, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { canAccessFeature, type PlanType } from '@/config/pricing';
import type { PlanFeatures } from '@/config/pricing';
import { Lock, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FeatureGuardProps {
  feature: keyof PlanFeatures;
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
}

/**
 * Composant de protection des fonctionnalités selon le plan
 * Bloque l'accès si l'utilisateur n'a pas le bon plan
 */
export const FeatureGuard = ({ 
  feature, 
  children, 
  fallback,
  redirectTo 
}: FeatureGuardProps) => {
  const { user } = useAuth();
  
  // Récupérer le plan de l'utilisateur depuis la base de données
  const [userPlan, setUserPlan] = useState<PlanType>('basic');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserPlan = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await window.supabase
        .from('users')
        .select('subscription_plan')
        .eq('id', user.id)
        .single();

      if (!error && data) {
        setUserPlan(data.subscription_plan || 'basic');
      }
      setLoading(false);
    };

    fetchUserPlan();
  }, [user]);

  if (loading) {
    return <div className="flex items-center justify-center p-4">Chargement...</div>;
  }

  // Vérifier si l'utilisateur peut accéder à la fonctionnalité
  const hasAccess = canAccessFeature(userPlan, feature);

  if (!hasAccess) {
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }

    if (fallback) {
      return <>{fallback}</>;
    }

    // Message par défaut
    return <FeatureLockedMessage feature={feature} userPlan={userPlan} />;
  }

  return <>{children}</>;
};

/**
 * Message affiché quand une fonctionnalité est verrouillée
 */
const FeatureLockedMessage = ({ 
  feature, 
  userPlan 
}: { 
  feature: string;
  userPlan: PlanType;
}) => {
  const getFeatureName = (feat: string): string => {
    const names: Record<string, string> = {
      messaging: 'Messagerie',
      calendar: 'Calendrier',
      appointments: 'Rendez-vous',
      finance: 'Module Finance',
      analytics: 'Analytics',
      apiAccess: 'Accès API',
      customDomain: 'Domaine personnalisé',
      whiteLabel: 'White Label',
    };
    return names[feat] || feat;
  };

  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-10 h-10 text-white" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Fonctionnalité Premium
        </h2>
        
        <p className="text-gray-600 mb-6">
          <strong>{getFeatureName(feature)}</strong> n'est pas disponible avec votre plan actuel{' '}
          <span className="font-semibold text-blue-600 capitalize">({userPlan})</span>
        </p>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
          <Crown className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
          <p className="text-sm text-gray-700">
            Passez à un plan supérieur pour débloquer cette fonctionnalité et bien plus encore !
          </p>
        </div>

        <Link
          to="/pricing"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
        >
          <Crown className="w-5 h-5" />
          Voir les plans
        </Link>
      </div>
    </div>
  );
};

/**
 * Hook pour vérifier l'accès à une fonctionnalité
 */
export const useFeatureAccess = (feature: keyof PlanFeatures) => {
  const { user } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);
  const [userPlan, setUserPlan] = useState<PlanType>('basic');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      if (!user) {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      const { data, error } = await window.supabase
        .from('users')
        .select('subscription_plan')
        .eq('id', user.id)
        .single();

      if (!error && data) {
        const plan = data.subscription_plan || 'basic';
        setUserPlan(plan);
        setHasAccess(canAccessFeature(plan, feature));
      }
      setLoading(false);
    };

    checkAccess();
  }, [user, feature]);

  return { hasAccess, userPlan, loading };
};

/**
 * Composant bouton avec vérification d'accès
 */
interface FeatureButtonProps {
  feature: keyof PlanFeatures;
  onClick: () => void;
  children: ReactNode;
  className?: string;
  lockedMessage?: string;
}

export const FeatureButton = ({
  feature,
  onClick,
  children,
  className = '',
  lockedMessage = 'Cette fonctionnalité nécessite un plan supérieur'
}: FeatureButtonProps) => {
  const { hasAccess, loading } = useFeatureAccess(feature);

  const handleClick = () => {
    if (hasAccess) {
      onClick();
    } else {
      alert(lockedMessage + '\n\nPassez à un plan supérieur pour débloquer cette fonctionnalité.');
      window.location.href = '/pricing';
    }
  };

  if (loading) {
    return (
      <button disabled className={className}>
        Chargement...
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`${className} ${!hasAccess ? 'opacity-75 cursor-not-allowed' : ''}`}
      title={!hasAccess ? lockedMessage : ''}
    >
      {!hasAccess && <Lock className="w-4 h-4 inline mr-2" />}
      {children}
    </button>
  );
};

/**
 * Composant de bannière d'upgrade
 */
export const UpgradeBanner = () => {
  const { user } = useAuth();
  const [userPlan, setUserPlan] = useState<PlanType>('basic');
  const [show, setShow] = useState(false);

  useEffect(() => {
    const checkPlan = async () => {
      if (!user) return;

      const { data } = await window.supabase
        .from('users')
        .select('subscription_plan')
        .eq('id', user.id)
        .single();

      if (data) {
        const plan = data.subscription_plan || 'basic';
        setUserPlan(plan);
        setShow(plan === 'basic'); // Afficher uniquement pour le plan basic
      }
    };

    checkPlan();
  }, [user]);

  if (!show) return null;

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 mb-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Crown className="w-6 h-6 text-yellow-300" />
          <div>
            <p className="font-semibold">Débloquez toutes les fonctionnalités</p>
            <p className="text-sm text-blue-100">
              Passez au plan Master pour accéder à la messagerie, au calendrier et bien plus !
            </p>
          </div>
        </div>
        <Link
          to="/pricing"
          className="px-6 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors whitespace-nowrap"
        >
          Voir les plans
        </Link>
      </div>
    </div>
  );
};

export default FeatureGuard;
