// ============================================================================
// PAGE PRICING AMÉLIORÉE - CRMPro2x
// ============================================================================
// Fichier : src/pages/Pricing.tsx
// Remplace votre page pricing existante
// ============================================================================

import { useState } from 'react';
import { Check, X, Star, Zap, Crown, Building2, ArrowRight } from 'lucide-react';
import { PRICING_PLANS, type PlanType } from '@/config/pricing';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const Pricing = () => {
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSelectPlan = (planType: PlanType) => {
    if (!user) {
      // Rediriger vers la page de connexion avec le plan sélectionné
      navigate('/login', { state: { selectedPlan: planType } });
    } else {
      // Rediriger vers le checkout Stripe
      navigate('/checkout', { state: { plan: planType } });
    }
  };

  const getPlanIcon = (planType: PlanType) => {
    switch (planType) {
      case 'basic':
        return <Star className="w-8 h-8" />;
      case 'master':
        return <Zap className="w-8 h-8" />;
      case 'gold':
        return <Crown className="w-8 h-8" />;
      case 'enterprise':
        return <Building2 className="w-8 h-8" />;
    }
  };

  const getPlanColor = (planType: PlanType) => {
    switch (planType) {
      case 'basic':
        return 'from-blue-500 to-blue-600';
      case 'master':
        return 'from-purple-500 to-purple-600';
      case 'gold':
        return 'from-yellow-500 to-yellow-600';
      case 'enterprise':
        return 'from-gray-700 to-gray-900';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      {/* En-tête */}
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Choisissez votre plan
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Des solutions adaptées à chaque besoin, du freelance à l'entreprise
        </p>

        {/* Toggle Mensuel/Annuel */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <span className={`text-lg ${billingInterval === 'month' ? 'font-bold text-gray-900' : 'text-gray-500'}`}>
            Mensuel
          </span>
          <button
            onClick={() => setBillingInterval(billingInterval === 'month' ? 'year' : 'month')}
            className="relative inline-flex h-8 w-14 items-center rounded-full bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                billingInterval === 'year' ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-lg ${billingInterval === 'year' ? 'font-bold text-gray-900' : 'text-gray-500'}`}>
            Annuel
            <span className="ml-2 text-sm text-green-600 font-semibold">(-20%)</span>
          </span>
        </div>
      </div>

      {/* Grille des plans */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {(Object.keys(PRICING_PLANS) as PlanType[]).map((planKey) => {
          const plan = PRICING_PLANS[planKey];
          const price = billingInterval === 'year' ? plan.price * 12 * 0.8 : plan.price;
          const displayPrice = billingInterval === 'year' ? (price / 12).toFixed(0) : price;

          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 ${
                plan.popular ? 'ring-4 ring-purple-500 ring-opacity-50' : ''
              }`}
            >
              {/* Badge "Populaire" */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                    ⭐ POPULAIRE
                  </span>
                </div>
              )}

              <div className="bg-white rounded-2xl overflow-hidden h-full flex flex-col">
                {/* En-tête du plan */}
                <div className={`bg-gradient-to-r ${getPlanColor(plan.id)} text-white p-6`}>
                  <div className="flex items-center justify-center mb-4">
                    {getPlanIcon(plan.id)}
                  </div>
                  <h3 className="text-2xl font-bold text-center mb-2">{plan.name}</h3>
                  <p className="text-center text-white/90 text-sm">{plan.description}</p>
                </div>

                {/* Prix */}
                <div className="p-6 text-center border-b">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-bold text-gray-900">${displayPrice}</span>
                    <span className="text-gray-600">/mois</span>
                  </div>
                  {billingInterval === 'year' && (
                    <p className="text-sm text-green-600 mt-2 font-semibold">
                      Économisez ${(plan.price * 12 * 0.2).toFixed(0)} par an
                    </p>
                  )}
                </div>

                {/* Fonctionnalités principales */}
                <div className="p-6 flex-grow">
                  <ul className="space-y-3">
                    {plan.benefits.slice(0, 8).map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Restrictions */}
                  {plan.restrictions.length > 0 && (
                    <div className="mt-6 pt-6 border-t">
                      <p className="text-xs font-semibold text-gray-500 mb-2">Limitations :</p>
                      <ul className="space-y-2">
                        {plan.restrictions.map((restriction, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                            <span className="text-xs text-gray-600">{restriction}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Bouton d'action */}
                <div className="p-6 pt-0">
                  <button
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                  >
                    Choisir {plan.name}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tableau de comparaison détaillé */}
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl p-8 mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Comparaison détaillée</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Fonctionnalité</th>
                {(Object.keys(PRICING_PLANS) as PlanType[]).map((planKey) => (
                  <th key={planKey} className="text-center py-4 px-6 font-semibold text-gray-900">
                    {PRICING_PLANS[planKey].name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Utilisateurs */}
              <tr className="border-b border-gray-100">
                <td className="py-4 px-6 font-medium text-gray-700">Utilisateurs</td>
                {(Object.keys(PRICING_PLANS) as PlanType[]).map((planKey) => {
                  const maxUsers = PRICING_PLANS[planKey].features.maxUsers;
                  return (
                    <td key={planKey} className="text-center py-4 px-6 text-gray-900">
                      {maxUsers === -1 ? '∞ Illimité' : maxUsers}
                    </td>
                  );
                })}
              </tr>

              {/* Clients */}
              <tr className="border-b border-gray-100">
                <td className="py-4 px-6 font-medium text-gray-700">Clients</td>
                {(Object.keys(PRICING_PLANS) as PlanType[]).map((planKey) => {
                  const maxClients = PRICING_PLANS[planKey].features.maxClients;
                  return (
                    <td key={planKey} className="text-center py-4 px-6 text-gray-900">
                      {maxClients === -1 ? '∞ Illimité' : maxClients}
                    </td>
                  );
                })}
              </tr>

              {/* Stockage */}
              <tr className="border-b border-gray-100">
                <td className="py-4 px-6 font-medium text-gray-700">Stockage</td>
                {(Object.keys(PRICING_PLANS) as PlanType[]).map((planKey) => {
                  const storage = PRICING_PLANS[planKey].features.maxStorage;
                  return (
                    <td key={planKey} className="text-center py-4 px-6 text-gray-900">
                      {storage === 'illimité' ? '∞ Illimité' : `${storage} GB`}
                    </td>
                  );
                })}
              </tr>

              {/* Messagerie */}
              <tr className="border-b border-gray-100 bg-gray-50">
                <td className="py-4 px-6 font-medium text-gray-700">💬 Messagerie</td>
                {(Object.keys(PRICING_PLANS) as PlanType[]).map((planKey) => {
                  const hasMessaging = PRICING_PLANS[planKey].features.messaging;
                  return (
                    <td key={planKey} className="text-center py-4 px-6">
                      {hasMessaging ? (
                        <Check className="w-6 h-6 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-6 h-6 text-red-400 mx-auto" />
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Calendrier */}
              <tr className="border-b border-gray-100">
                <td className="py-4 px-6 font-medium text-gray-700">📅 Calendrier</td>
                {(Object.keys(PRICING_PLANS) as PlanType[]).map((planKey) => {
                  const hasCalendar = PRICING_PLANS[planKey].features.calendar;
                  return (
                    <td key={planKey} className="text-center py-4 px-6">
                      {hasCalendar ? (
                        <Check className="w-6 h-6 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-6 h-6 text-red-400 mx-auto" />
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Rendez-vous */}
              <tr className="border-b border-gray-100 bg-gray-50">
                <td className="py-4 px-6 font-medium text-gray-700">🗓️ Rendez-vous</td>
                {(Object.keys(PRICING_PLANS) as PlanType[]).map((planKey) => {
                  const hasAppointments = PRICING_PLANS[planKey].features.appointments;
                  return (
                    <td key={planKey} className="text-center py-4 px-6">
                      {hasAppointments ? (
                        <Check className="w-6 h-6 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-6 h-6 text-red-400 mx-auto" />
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* API */}
              <tr className="border-b border-gray-100">
                <td className="py-4 px-6 font-medium text-gray-700">🔌 Accès API</td>
                {(Object.keys(PRICING_PLANS) as PlanType[]).map((planKey) => {
                  const hasAPI = PRICING_PLANS[planKey].features.apiAccess;
                  return (
                    <td key={planKey} className="text-center py-4 px-6">
                      {hasAPI ? (
                        <Check className="w-6 h-6 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-6 h-6 text-red-400 mx-auto" />
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Domaine personnalisé */}
              <tr className="border-b border-gray-100 bg-gray-50">
                <td className="py-4 px-6 font-medium text-gray-700">🌐 Domaine personnalisé</td>
                {(Object.keys(PRICING_PLANS) as PlanType[]).map((planKey) => {
                  const hasCustomDomain = PRICING_PLANS[planKey].features.customDomain;
                  return (
                    <td key={planKey} className="text-center py-4 px-6">
                      {hasCustomDomain ? (
                        <Check className="w-6 h-6 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-6 h-6 text-red-400 mx-auto" />
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Serveur dédié */}
              <tr className="border-b border-gray-100">
                <td className="py-4 px-6 font-medium text-gray-700">🖥️ Serveur dédié</td>
                {(Object.keys(PRICING_PLANS) as PlanType[]).map((planKey) => {
                  const hasDedicated = PRICING_PLANS[planKey].features.dedicatedServer;
                  return (
                    <td key={planKey} className="text-center py-4 px-6">
                      {hasDedicated ? (
                        <Check className="w-6 h-6 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-6 h-6 text-red-400 mx-auto" />
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Support */}
              <tr className="border-b border-gray-100 bg-gray-50">
                <td className="py-4 px-6 font-medium text-gray-700">💁 Support</td>
                {(Object.keys(PRICING_PLANS) as PlanType[]).map((planKey) => {
                  const support = PRICING_PLANS[planKey].features.support;
                  return (
                    <td key={planKey} className="text-center py-4 px-6 text-gray-900 font-medium">
                      {support === 'email' && 'Email'}
                      {support === 'priority' && '⚡ Prioritaire'}
                      {support === '24/7' && '🌟 24/7'}
                      {support === 'dedicated' && '👨‍💼 Dédié'}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-8">Questions fréquentes</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Puis-je changer de plan plus tard ?</h3>
            <p className="text-gray-600">Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Les changements prennent effet immédiatement.</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Que comprend le plan Enterprise ?</h3>
            <p className="text-gray-600">Le plan Enterprise inclut un serveur dédié, un nom de domaine personnalisé, l'installation complète sur votre infrastructure, un support dédié 24/7 et une architecture sur mesure.</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Y a-t-il un engagement ?</h3>
            <p className="text-gray-600">Non, tous nos plans sont sans engagement. Vous pouvez annuler à tout moment.</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Quels moyens de paiement acceptez-vous ?</h3>
            <p className="text-gray-600">Nous acceptons toutes les cartes bancaires majeures via Stripe. Les paiements sont sécurisés et cryptés.</p>
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="max-w-4xl mx-auto text-center mt-16">
        <h2 className="text-3xl font-bold mb-4">Prêt à commencer ?</h2>
        <p className="text-xl text-gray-600 mb-8">
          Essayez CRMPro2x dès aujourd'hui et transformez votre gestion d'entreprise
        </p>
        <button
          onClick={() => navigate('/signup')}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Commencer gratuitement
        </button>
      </div>
    </div>
  );
};

export default Pricing;
