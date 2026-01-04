// ============================================================================
// CONFIGURATION DES PLANS D'ABONNEMENT - CRMPro2x
// ============================================================================
// Fichier : src/config/pricing.ts
// ============================================================================

export type PlanType = 'basic' | 'master' | 'gold' | 'enterprise';

export interface PlanFeatures {
  // Fonctionnalités générales
  maxUsers: number;
  maxClients: number;
  maxProjects: number;
  maxStorage: string; // en GB
  
  // Fonctionnalités principales
  crm: boolean;
  projects: boolean;
  finance: boolean;
  analytics: boolean;
  
  // Fonctionnalités avancées
  messaging: boolean;
  calendar: boolean;
  appointments: boolean;
  personalManagement: boolean;
  emailIntegration: boolean;
  apiAccess: boolean;
  customDomain: boolean;
  whiteLabel: boolean;
  
  // Support & Infrastructure
  support: 'email' | 'priority' | '24/7' | 'dedicated';
  backupFrequency: string;
  uptime: string;
  
  // Entreprise uniquement
  dedicatedServer?: boolean;
  customDomain?: boolean;
  fullArchitecture?: boolean;
  onPremiseOption?: boolean;
  customBranding?: boolean;
  advancedSecurity?: boolean;
  sla?: boolean;
}

export interface PricingPlan {
  id: PlanType;
  name: string;
  price: number; // en dollars
  priceId: string; // Stripe Price ID
  currency: string;
  interval: 'month' | 'year';
  description: string;
  popular?: boolean;
  features: PlanFeatures;
  restrictions: string[];
  benefits: string[];
}

// ============================================================================
// DÉFINITION DES PLANS
// ============================================================================

export const PRICING_PLANS: Record<PlanType, PricingPlan> = {
  // --------------------------------------------------------------------------
  // PLAN BASIQUE - 2$/mois
  // --------------------------------------------------------------------------
  basic: {
    id: 'basic',
    name: 'Basique',
    price: 2,
    priceId: 'price_basic_monthly', // À remplacer par votre Stripe Price ID
    currency: 'USD',
    interval: 'month',
    description: 'Navigation essentielle dans l\'application',
    popular: false,
    features: {
      maxUsers: 1,
      maxClients: 50,
      maxProjects: 5,
      maxStorage: '1',
      
      // Fonctionnalités principales
      crm: true,
      projects: true,
      finance: false,
      analytics: false,
      
      // Fonctionnalités avancées
      messaging: false,
      calendar: false,
      appointments: false,
      personalManagement: true,
      emailIntegration: false,
      apiAccess: false,
      customDomain: false,
      whiteLabel: false,
      
      // Support
      support: 'email',
      backupFrequency: 'hebdomadaire',
      uptime: '99%',
    },
    restrictions: [
      'Messagerie désactivée',
      'Calendrier désactivé',
      'Rendez-vous désactivés',
      'Pas d\'intégration email',
      'Support par email uniquement',
      'Stockage limité à 1 GB'
    ],
    benefits: [
      'Accès à l\'application complète',
      'CRM basique',
      'Gestion de projets (max 5)',
      'Gestion personnelle',
      'Tableaux de bord',
      'Support par email'
    ]
  },

  // --------------------------------------------------------------------------
  // PLAN MASTER - 15$/mois
  // --------------------------------------------------------------------------
  master: {
    id: 'master',
    name: 'Master',
    price: 15,
    priceId: 'price_master_monthly',
    currency: 'USD',
    interval: 'month',
    description: 'Toutes les fonctionnalités débloquées',
    popular: true,
    features: {
      maxUsers: 5,
      maxClients: 500,
      maxProjects: 50,
      maxStorage: '50',
      
      // Fonctionnalités principales
      crm: true,
      projects: true,
      finance: true,
      analytics: true,
      
      // Fonctionnalités avancées
      messaging: true,
      calendar: true,
      appointments: true,
      personalManagement: true,
      emailIntegration: true,
      apiAccess: false,
      customDomain: false,
      whiteLabel: false,
      
      // Support
      support: 'priority',
      backupFrequency: 'quotidien',
      uptime: '99.5%',
    },
    restrictions: [
      'Pas d\'accès API',
      'Pas de domaine personnalisé',
      'Limité à 5 utilisateurs'
    ],
    benefits: [
      '✅ Messagerie interne',
      '✅ Calendrier complet',
      '✅ Système de rendez-vous',
      '✅ Gestion financière',
      '✅ Analytics avancés',
      '✅ Intégration email',
      '✅ 50 GB de stockage',
      '✅ Support prioritaire',
      '✅ Sauvegardes quotidiennes',
      'Projets illimités'
    ]
  },

  // --------------------------------------------------------------------------
  // PLAN GOLD - 49$/mois
  // --------------------------------------------------------------------------
  gold: {
    id: 'gold',
    name: 'Gold',
    price: 49,
    priceId: 'price_gold_monthly',
    currency: 'USD',
    interval: 'month',
    description: 'Pour les équipes professionnelles',
    popular: false,
    features: {
      maxUsers: 25,
      maxClients: 5000,
      maxProjects: 500,
      maxStorage: '500',
      
      // Fonctionnalités principales
      crm: true,
      projects: true,
      finance: true,
      analytics: true,
      
      // Fonctionnalités avancées
      messaging: true,
      calendar: true,
      appointments: true,
      personalManagement: true,
      emailIntegration: true,
      apiAccess: true,
      customDomain: true,
      whiteLabel: true,
      
      // Support
      support: '24/7',
      backupFrequency: 'temps réel',
      uptime: '99.9%',
    },
    restrictions: [
      'Infrastructure partagée',
    ],
    benefits: [
      '🌟 Tout du plan Master',
      '✅ Accès API complet',
      '✅ Domaine personnalisé',
      '✅ White-label (sans marque)',
      '✅ 25 utilisateurs',
      '✅ 500 GB de stockage',
      '✅ Support 24/7',
      '✅ Sauvegardes en temps réel',
      '✅ SLA 99.9%',
      'Clients et projets illimités'
    ]
  },

  // --------------------------------------------------------------------------
  // PLAN ENTERPRISE - 299$/mois
  // --------------------------------------------------------------------------
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 299,
    priceId: 'price_enterprise_monthly',
    currency: 'USD',
    interval: 'month',
    description: 'Solution complète clé en main',
    popular: false,
    features: {
      maxUsers: -1, // illimité
      maxClients: -1,
      maxProjects: -1,
      maxStorage: 'illimité',
      
      // Fonctionnalités principales
      crm: true,
      projects: true,
      finance: true,
      analytics: true,
      
      // Fonctionnalités avancées
      messaging: true,
      calendar: true,
      appointments: true,
      personalManagement: true,
      emailIntegration: true,
      apiAccess: true,
      customDomain: true,
      whiteLabel: true,
      
      // Support
      support: 'dedicated',
      backupFrequency: 'temps réel + géo-redondant',
      uptime: '99.99%',
      
      // Entreprise exclusif
      dedicatedServer: true,
      fullArchitecture: true,
      onPremiseOption: true,
      customBranding: true,
      advancedSecurity: true,
      sla: true,
    },
    restrictions: [],
    benefits: [
      '🏆 Tout du plan Gold',
      '🔥 Serveur dédié',
      '🔥 Nom de domaine inclus',
      '🔥 Architecture complète personnalisée',
      '🔥 Installation sur serveur',
      '🔥 Branding personnalisé',
      '🔥 Sécurité avancée',
      '🔥 Option on-premise',
      '🔥 Gestionnaire de compte dédié',
      '🔥 Formation équipe incluse',
      '🔥 Migration de données',
      '🔥 SLA 99.99%',
      'Utilisateurs illimités',
      'Stockage illimité',
      'Support dédié 24/7'
    ]
  }
};

// ============================================================================
// FONCTIONS UTILITAIRES
// ============================================================================

/**
 * Vérifie si une fonctionnalité est disponible pour un plan
 */
export const hasFeature = (
  planType: PlanType,
  feature: keyof PlanFeatures
): boolean => {
  return PRICING_PLANS[planType].features[feature] as boolean;
};

/**
 * Récupère le plan d'un utilisateur
 */
export const getUserPlan = (userPlanType?: PlanType): PricingPlan => {
  return PRICING_PLANS[userPlanType || 'basic'];
};

/**
 * Vérifie si l'utilisateur peut accéder à une fonctionnalité
 */
export const canAccessFeature = (
  userPlanType: PlanType,
  feature: keyof PlanFeatures
): boolean => {
  const plan = PRICING_PLANS[userPlanType];
  const featureValue = plan.features[feature];
  
  // Si c'est un booléen, retourner directement
  if (typeof featureValue === 'boolean') {
    return featureValue;
  }
  
  // Si c'est un nombre, vérifier s'il n'est pas 0
  if (typeof featureValue === 'number') {
    return featureValue !== 0;
  }
  
  return true;
};

/**
 * Obtient la limite pour une fonctionnalité
 */
export const getFeatureLimit = (
  userPlanType: PlanType,
  feature: 'maxUsers' | 'maxClients' | 'maxProjects'
): number => {
  const limit = PRICING_PLANS[userPlanType].features[feature];
  return limit === -1 ? Infinity : limit;
};

/**
 * Vérifie si l'utilisateur a atteint la limite
 */
export const hasReachedLimit = (
  userPlanType: PlanType,
  feature: 'maxUsers' | 'maxClients' | 'maxProjects',
  currentCount: number
): boolean => {
  const limit = getFeatureLimit(userPlanType, feature);
  return currentCount >= limit;
};

// ============================================================================
// COMPARAISON DES PLANS
// ============================================================================

export const PLAN_COMPARISON_FEATURES = [
  {
    category: 'Fonctionnalités de base',
    features: [
      { key: 'maxUsers', label: 'Utilisateurs', format: (val: number) => val === -1 ? 'Illimité' : val },
      { key: 'maxClients', label: 'Clients', format: (val: number) => val === -1 ? 'Illimité' : val },
      { key: 'maxProjects', label: 'Projets', format: (val: number) => val === -1 ? 'Illimité' : val },
      { key: 'maxStorage', label: 'Stockage', format: (val: string) => val === 'illimité' ? 'Illimité' : `${val} GB` },
    ]
  },
  {
    category: 'Modules',
    features: [
      { key: 'crm', label: 'CRM', format: (val: boolean) => val ? '✓' : '✗' },
      { key: 'projects', label: 'Projets', format: (val: boolean) => val ? '✓' : '✗' },
      { key: 'finance', label: 'Finance', format: (val: boolean) => val ? '✓' : '✗' },
      { key: 'analytics', label: 'Analytics', format: (val: boolean) => val ? '✓' : '✗' },
    ]
  },
  {
    category: 'Fonctionnalités avancées',
    features: [
      { key: 'messaging', label: 'Messagerie', format: (val: boolean) => val ? '✓' : '✗' },
      { key: 'calendar', label: 'Calendrier', format: (val: boolean) => val ? '✓' : '✗' },
      { key: 'appointments', label: 'Rendez-vous', format: (val: boolean) => val ? '✓' : '✗' },
      { key: 'emailIntegration', label: 'Intégration email', format: (val: boolean) => val ? '✓' : '✗' },
      { key: 'apiAccess', label: 'Accès API', format: (val: boolean) => val ? '✓' : '✗' },
      { key: 'customDomain', label: 'Domaine personnalisé', format: (val: boolean) => val ? '✓' : '✗' },
    ]
  },
  {
    category: 'Support & Infrastructure',
    features: [
      { key: 'support', label: 'Support', format: (val: string) => val },
      { key: 'uptime', label: 'Uptime', format: (val: string) => val },
      { key: 'backupFrequency', label: 'Sauvegardes', format: (val: string) => val },
    ]
  }
];

export default PRICING_PLANS;
