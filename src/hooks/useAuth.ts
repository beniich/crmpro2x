// ============================================================================
// HOOK D'AUTHENTIFICATION - useAuth
// ============================================================================
// Fichier : src/hooks/useAuth.ts
// ============================================================================

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session, AuthError } from '@supabase/supabase-js';

// ============================================================================
// TYPES
// ============================================================================

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{
    data: { user: User | null; session: Session | null } | null;
    error: AuthError | null;
  }>;
  signUp: (email: string, password: string) => Promise<{
    data: { user: User | null; session: Session | null } | null;
    error: AuthError | null;
  }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: AuthError | null }>;
}

// ============================================================================
// CONTEXTE D'AUTHENTIFICATION
// ============================================================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================================================
// PROVIDER D'AUTHENTIFICATION
// ============================================================================

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupérer la session au chargement
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event);
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);

        // Gérer les événements spécifiques
        switch (event) {
          case 'SIGNED_IN':
            console.log('User signed in:', currentSession?.user?.email);
            break;
          case 'SIGNED_OUT':
            console.log('User signed out');
            break;
          case 'TOKEN_REFRESHED':
            console.log('Token refreshed');
            break;
          case 'USER_UPDATED':
            console.log('User updated');
            break;
          case 'PASSWORD_RECOVERY':
            console.log('Password recovery initiated');
            break;
        }
      }
    );

    // Cleanup
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Connexion avec email/mot de passe
  const signIn = async (email: string, password: string) => {
    try {
      const result = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (result.error) {
        console.error('Sign in error:', result.error);
      }
      
      return result;
    } catch (error) {
      console.error('Sign in exception:', error);
      return {
        data: { user: null, session: null },
        error: error as AuthError,
      };
    }
  };

  // Inscription avec email/mot de passe
  const signUp = async (email: string, password: string) => {
    try {
      const result = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });
      
      if (result.error) {
        console.error('Sign up error:', result.error);
      }
      
      return result;
    } catch (error) {
      console.error('Sign up exception:', error);
      return {
        data: { user: null, session: null },
        error: error as AuthError,
      };
    }
  };

  // Déconnexion
  const signOut = async () => {
    try {
      const result = await supabase.auth.signOut();
      
      if (result.error) {
        console.error('Sign out error:', result.error);
      }
      
      return result;
    } catch (error) {
      console.error('Sign out exception:', error);
      return {
        error: error as AuthError,
      };
    }
  };

  // Réinitialisation du mot de passe
  const resetPassword = async (email: string) => {
    try {
      const result = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (result.error) {
        console.error('Reset password error:', result.error);
      }
      
      return result;
    } catch (error) {
      console.error('Reset password exception:', error);
      return {
        error: error as AuthError,
      };
    }
  };

  // Mise à jour du mot de passe
  const updatePassword = async (newPassword: string) => {
    try {
      const result = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (result.error) {
        console.error('Update password error:', result.error);
      }
      
      return { error: result.error };
    } catch (error) {
      console.error('Update password exception:', error);
      return {
        error: error as AuthError,
      };
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ============================================================================
// HOOK useAuth
// ============================================================================

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// ============================================================================
// HOOKS UTILITAIRES
// ============================================================================

/**
 * Hook pour vérifier si l'utilisateur est authentifié
 */
export const useIsAuthenticated = (): boolean => {
  const { user, loading } = useAuth();
  return !loading && user !== null;
};

/**
 * Hook pour obtenir l'utilisateur courant
 */
export const useCurrentUser = () => {
  const { user, loading } = useAuth();
  return { user, loading };
};

/**
 * Hook pour gérer la redirection après authentification
 */
export const useRequireAuth = (redirectTo: string = '/login') => {
  const { user, loading } = useAuth();
  const navigate = typeof window !== 'undefined' ? window.location : null;

  useEffect(() => {
    if (!loading && !user && navigate) {
      navigate.href = redirectTo;
    }
  }, [user, loading, redirectTo, navigate]);

  return { user, loading };
};

// ============================================================================
// FONCTIONS UTILITAIRES D'AUTHENTIFICATION
// ============================================================================

/**
 * Connexion avec Google OAuth
 */
export const signInWithGoogle = async () => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    
    if (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Google sign in exception:', error);
    throw error;
  }
};

/**
 * Connexion avec GitHub OAuth
 */
export const signInWithGithub = async () => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    
    if (error) {
      console.error('GitHub sign in error:', error);
      throw error;
    }
  } catch (error) {
    console.error('GitHub sign in exception:', error);
    throw error;
  }
};

/**
 * Vérifier si l'email est confirmé
 */
export const isEmailConfirmed = (user: User | null): boolean => {
  return user?.email_confirmed_at !== undefined && user?.email_confirmed_at !== null;
};

/**
 * Obtenir le rôle de l'utilisateur depuis la base de données
 */
export const getUserRole = async (userId: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user role:', error);
      return null;
    }
    
    return data?.role || 'user';
  } catch (error) {
    console.error('Exception fetching user role:', error);
    return null;
  }
};

/**
 * Obtenir le plan d'abonnement de l'utilisateur
 */
export const getUserSubscriptionPlan = async (userId: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('subscription_plan')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching subscription plan:', error);
      return null;
    }
    
    return data?.subscription_plan || 'basic';
  } catch (error) {
    console.error('Exception fetching subscription plan:', error);
    return null;
  }
};

/**
 * Mettre à jour le profil utilisateur
 */
export const updateUserProfile = async (
  userId: string,
  updates: {
    full_name?: string;
    avatar_url?: string;
    phone?: string;
    department?: string;
  }
) => {
  try {
    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId);
    
    if (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Exception updating user profile:', error);
    throw error;
  }
};

// ============================================================================
// EXPORT PAR DÉFAUT
// ============================================================================

export default useAuth;