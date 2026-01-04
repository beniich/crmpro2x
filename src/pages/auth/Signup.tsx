// ============================================================================
// PAGE D'INSCRIPTION AVEC SÉLECTION DE PLAN
// ============================================================================
// Fichier : src/pages/Signup.tsx
// ============================================================================

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { PRICING_PLANS, type PlanType } from '@/config/pricing';

export const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Récupérer le plan sélectionné depuis la page pricing
  const selectedPlan: PlanType = location.state?.selectedPlan || 'basic';
  const plan = PRICING_PLANS[selectedPlan];

  // Calculer la force du mot de passe
  const calculatePasswordStrength = (pwd: string): number => {
    let strength = 0;
    if (pwd.length >= 8) strength += 25;
    if (pwd.length >= 12) strength += 25;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength += 25;
    if (/\d/.test(pwd)) strength += 12.5;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength += 12.5;
    return Math.min(strength, 100);
  };

  const handlePasswordChange = (pwd: string) => {
    setFormData({ ...formData, password: pwd });
    setPasswordStrength(calculatePasswordStrength(pwd));
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 30) return 'bg-red-500';
    if (passwordStrength < 60) return 'bg-yellow-500';
    if (passwordStrength < 80) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 30) return 'Faible';
    if (passwordStrength < 60) return 'Moyen';
    if (passwordStrength < 80) return 'Bon';
    return 'Excellent';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validations
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setLoading(true);

    try {
      const { data, error: signUpError } = await signUp(
        formData.email,
        formData.password
      );

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
      } else if (data.user) {
        // Créer l'enregistrement utilisateur dans la table users
        const { error: userError } = await window.supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: formData.email,
            full_name: formData.fullName,
            role: 'user',
          });

        if (userError) {
          console.error('Erreur création profil:', userError);
        }

        // Rediriger vers le checkout avec le plan sélectionné
        navigate('/checkout', { 
          state: { 
            plan: selectedPlan,
            newUser: true 
          } 
        });
      }
    } catch (err) {
      setError('Une erreur inattendue s\'est produite');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Partie gauche - Formulaire */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-md w-full space-y-8">
          {/* Logo et titre */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl font-bold text-white">CP</span>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Créer votre compte
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Commencez à utiliser CRMPro2x dès aujourd'hui
            </p>
          </div>

          {/* Plan sélectionné */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">Plan sélectionné</p>
                <p className="text-2xl font-bold text-blue-600">{plan.name}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900">${plan.price}</p>
                <p className="text-sm text-gray-600">par mois</p>
              </div>
            </div>
            <Link
              to="/pricing"
              className="text-sm text-blue-600 hover:text-blue-700 mt-2 inline-block"
            >
              Changer de plan →
            </Link>
          </div>

          {/* Formulaire */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Nom complet */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Jean Dupont"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="vous@exemple.com"
                  />
                </div>
              </div>

              {/* Mot de passe */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {/* Indicateur de force du mot de passe */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                          style={{ width: `${passwordStrength}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium text-gray-600">
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Min. 8 caractères, avec majuscules, chiffres et symboles
                    </p>
                  </div>
                )}
              </div>

              {/* Confirmation mot de passe */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <div className="flex items-center gap-2 mt-2 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-xs">Les mots de passe correspondent</span>
                  </div>
                )}
              </div>
            </div>

            {/* Conditions d'utilisation */}
            <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                J'accepte les{' '}
                <Link to="/terms" className="text-blue-600 hover:text-blue-500">
                  conditions d'utilisation
                </Link>{' '}
                et la{' '}
                <Link to="/privacy" className="text-blue-600 hover:text-blue-500">
                  politique de confidentialité
                </Link>
              </label>
            </div>

            {/* Message d'erreur */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800">Erreur</p>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            )}

            {/* Bouton d'inscription */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Création du compte...
                </>
              ) : (
                `Créer mon compte ${plan.name}`
              )}
            </button>

            {/* Lien vers connexion */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Vous avez déjà un compte ?{' '}
                <Link
                  to="/login"
                  state={{ selectedPlan }}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Se connecter
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Partie droite - Avantages du plan */}
      <div className="hidden lg:block relative flex-1 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-white max-w-lg">
            <h1 className="text-4xl font-bold mb-6">
              Plan {plan.name}
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              {plan.description}
            </p>
            <div className="space-y-4">
              {plan.benefits.slice(0, 6).map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    ✓
                  </div>
                  <span className="text-blue-50">{benefit}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-6 bg-white/10 rounded-lg backdrop-blur">
              <p className="text-sm text-blue-100 mb-2">Ce que vous obtenez :</p>
              <ul className="text-white space-y-2">
                <li>• {plan.features.maxUsers === -1 ? 'Utilisateurs illimités' : `${plan.features.maxUsers} utilisateur(s)`}</li>
                <li>• {plan.features.maxStorage === 'illimité' ? 'Stockage illimité' : `${plan.features.maxStorage} GB de stockage`}</li>
                <li>• Support {plan.features.support}</li>
                <li>• SLA {plan.features.uptime}</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Pattern décoratif */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
