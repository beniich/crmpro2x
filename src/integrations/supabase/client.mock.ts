// Mock Supabase client - remplace le client Supabase réel par un stockage local
import {
  MockUser,
  MockSession,
  demoUser,
  demoProfile,
  demoDashboard,
  demoStats,
  mockProducts,
  mockCustomers,
  mockDeals,
  mockTasks,
  mockRecommendations,
  generateMockSales,
  generateId,
  type Product,
  type Customer,
  type Deal,
  type Task,
  type Sale,
  type AIRecommendation,
  type UserProfile,
  type UserDashboard,
  type UserStats
} from '@/lib/mockData';

// Types locaux
type AuthChangeCallback = (event: string, session: MockSession | null) => void;

interface LocalStorageData {
  user: MockUser | null;
  session: MockSession | null;
  profile: UserProfile | null;
  dashboard: UserDashboard | null;
  stats: UserStats | null;
  products: Product[];
  customers: Customer[];
  deals: Deal[];
  tasks: Task[];
  sales: Sale[];
  recommendations: AIRecommendation[];
}

const STORAGE_KEY = 'cloud_industrie_data';

// Initialiser les données dans le localStorage
const initializeData = (): LocalStorageData => {
  const existingData = localStorage.getItem(STORAGE_KEY);
  if (existingData) {
    try {
      return JSON.parse(existingData);
    } catch {
      // Si les données sont corrompues, réinitialiser
    }
  }

  const initialData: LocalStorageData = {
    user: null,
    session: null,
    profile: null,
    dashboard: null,
    stats: null,
    products: [...mockProducts],
    customers: [...mockCustomers],
    deals: [...mockDeals],
    tasks: [...mockTasks],
    sales: generateMockSales(),
    recommendations: [...mockRecommendations]
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
  return initialData;
};

const getData = (): LocalStorageData => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return initializeData();
    }
  }
  return initializeData();
};

const saveData = (data: LocalStorageData): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// Notifier les listeners d'authentification
let authListeners: AuthChangeCallback[] = [];

const notifyAuthChange = (event: string, session: MockSession | null) => {
  authListeners.forEach(callback => {
    try {
      callback(event, session);
    } catch (error) {
      console.error('Auth listener error:', error);
    }
  });
};

// Mock Supabase client
export const supabase = {
  auth: {
    getSession: async () => {
      const data = getData();
      return {
        data: { session: data.session },
        error: null
      };
    },

    getUser: async () => {
      const data = getData();
      return {
        data: { user: data.user },
        error: null
      };
    },

    signUp: async ({ email, password, options }: { email: string; password: string; options?: { data?: Record<string, unknown> } }) => {
      const userId = generateId();
      const newUser: MockUser = {
        id: userId,
        email,
        user_metadata: options?.data || {},
        created_at: new Date().toISOString()
      };

      const newSession: MockSession = {
        access_token: 'mock-token-' + generateId(),
        refresh_token: 'mock-refresh-' + generateId(),
        expires_at: Date.now() + 86400000,
        expires_in: 86400,
        token_type: 'bearer',
        user: newUser
      };

      const newProfile: UserProfile = {
        id: generateId(),
        user_id: userId,
        full_name: (options?.data?.full_name as string) || email.split('@')[0],
        email,
        avatar_url: null,
        company: null,
        phone: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const newDashboard: UserDashboard = {
        id: generateId(),
        user_id: userId,
        layout: { type: 'default' },
        widgets: ['stats', 'deals', 'tasks'],
        theme: { mode: 'dark' },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const newStats: UserStats = {
        id: generateId(),
        user_id: userId,
        total_incidents: 0,
        ai_queries: 0,
        workflows_count: 0,
        digital_twins_count: 0,
        last_active: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const data = getData();
      data.user = newUser;
      data.session = newSession;
      data.profile = newProfile;
      data.dashboard = newDashboard;
      data.stats = newStats;
      saveData(data);

      setTimeout(() => notifyAuthChange('SIGNED_IN', newSession), 0);

      return {
        data: { user: newUser, session: newSession },
        error: null
      };
    },

    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      // Mode démo: accepter n'importe quel mot de passe
      const userId = demoUser.id;
      const user: MockUser = {
        ...demoUser,
        email
      };

      const session: MockSession = {
        access_token: 'mock-token-' + generateId(),
        refresh_token: 'mock-refresh-' + generateId(),
        expires_at: Date.now() + 86400000,
        expires_in: 86400,
        token_type: 'bearer',
        user
      };

      const data = getData();
      data.user = user;
      data.session = session;
      data.profile = { ...demoProfile, email, user_id: userId };
      data.dashboard = { ...demoDashboard, user_id: userId };
      data.stats = { ...demoStats, user_id: userId };
      saveData(data);

      setTimeout(() => notifyAuthChange('SIGNED_IN', session), 0);

      return {
        data: { user, session },
        error: null
      };
    },

    signInWithOAuth: async ({ provider }: { provider: string }) => {
      // Simuler une connexion OAuth
      return supabase.auth.signInWithPassword({
        email: `demo@${provider}.com`,
        password: 'demo'
      });
    },

    signOut: async () => {
      const data = getData();
      data.user = null;
      data.session = null;
      data.profile = null;
      data.dashboard = null;
      data.stats = null;
      saveData(data);

      setTimeout(() => notifyAuthChange('SIGNED_OUT', null), 0);

      return { error: null };
    },

    onAuthStateChange: (callback: AuthChangeCallback) => {
      authListeners.push(callback);

      // Vérifier la session existante
      const data = getData();
      if (data.session) {
        setTimeout(() => callback('INITIAL_SESSION', data.session), 0);
      }

      return {
        data: {
          subscription: {
            unsubscribe: () => {
              authListeners = authListeners.filter(cb => cb !== callback);
            }
          }
        }
      };
    }
  },

  from: (table: string) => {
    return {
      select: (columns?: string) => ({
        eq: (column: string, value: unknown) => ({
          single: async () => {
            const data = getData();

            switch (table) {
              case 'profiles':
                return { data: data.profile, error: null };
              case 'user_dashboards':
                return { data: data.dashboard, error: null };
              case 'user_stats':
                return { data: data.stats, error: null };
              default:
                return { data: null, error: null };
            }
          },
          order: (col: string, opts?: { ascending?: boolean }) => ({
            async then(resolve: (value: { data: unknown[]; error: null }) => void) {
              const data = getData();
              let result: unknown[] = [];

              switch (table) {
                case 'products':
                  result = data.products;
                  break;
                case 'customers':
                  result = data.customers;
                  break;
                case 'deals':
                  result = data.deals;
                  break;
                case 'tasks':
                  result = data.tasks;
                  break;
                case 'sales':
                  result = data.sales;
                  break;
                case 'ai_recommendations':
                  result = data.recommendations;
                  break;
              }

              resolve({ data: result, error: null });
            }
          })
        }),
        gte: (column: string, value: unknown) => ({
          lte: (col2: string, value2: unknown) => ({
            order: (orderCol: string, opts?: { ascending?: boolean }) => ({
              async then(resolve: (value: { data: unknown[]; error: null }) => void) {
                const data = getData();
                const result = data.sales.filter(sale => {
                  const saleDate = new Date(sale.sale_date);
                  return saleDate >= new Date(value as string) && saleDate <= new Date(value2 as string);
                });
                resolve({ data: result, error: null });
              }
            })
          })
        }),
        order: (column: string, opts?: { ascending?: boolean }) => ({
          async then(resolve: (value: { data: unknown[]; error: null }) => void) {
            const data = getData();
            let result: unknown[] = [];

            switch (table) {
              case 'products':
                result = [...data.products];
                break;
              case 'customers':
                result = [...data.customers];
                break;
              case 'deals':
                result = [...data.deals];
                break;
              case 'tasks':
                result = [...data.tasks];
                break;
              case 'sales':
                result = [...data.sales];
                break;
              case 'ai_recommendations':
                result = [...data.recommendations];
                break;
            }

            // Trier si spécifié
            if (column) {
              result.sort((a: Record<string, unknown>, b: Record<string, unknown>) => {
                const aVal = a[column as string];
                const bVal = b[column as string];
                if (opts?.ascending) {
                  return String(aVal).localeCompare(String(bVal));
                }
                return String(bVal).localeCompare(String(aVal));
              });
            }

            resolve({ data: result, error: null });
          },
          limit: (n: number) => ({
            async then(resolve: (value: { data: unknown[]; error: null }) => void) {
              const data = getData();
              let result: unknown[] = [];

              switch (table) {
                case 'products':
                  result = data.products.slice(0, n);
                  break;
                case 'sales':
                  result = data.sales.slice(0, n);
                  break;
                default:
                  result = [];
              }

              resolve({ data: result, error: null });
            }
          })
        }),
        async then(resolve: (value: { data: unknown[]; error: null }) => void) {
          const data = getData();
          let result: unknown[] = [];

          switch (table) {
            case 'products':
              result = data.products;
              break;
            case 'customers':
              result = data.customers;
              break;
            case 'deals':
              result = data.deals;
              break;
            case 'tasks':
              result = data.tasks;
              break;
            case 'sales':
              result = data.sales;
              break;
            case 'ai_recommendations':
              result = data.recommendations;
              break;
          }

          resolve({ data: result, error: null });
        }
      }),
      insert: (item: Record<string, unknown> | Record<string, unknown>[]) => ({
        select: () => ({
          single: async () => {
            const data = getData();
            const newItem = Array.isArray(item) ? item[0] : item;
            const id = generateId();
            const now = new Date().toISOString();

            const itemWithId = {
              ...newItem,
              id,
              created_at: now,
              updated_at: now
            };

            switch (table) {
              case 'products':
                data.products.push(itemWithId as Product);
                break;
              case 'customers':
                data.customers.push(itemWithId as Customer);
                break;
              case 'deals':
                data.deals.push(itemWithId as Deal);
                break;
              case 'tasks':
                data.tasks.push(itemWithId as Task);
                break;
              case 'sales':
                data.sales.push(itemWithId as Sale);
                break;
              case 'ai_recommendations':
                data.recommendations.push(itemWithId as AIRecommendation);
                break;
              case 'user_dashboards':
                data.dashboard = itemWithId as UserDashboard;
                break;
              case 'user_stats':
                data.stats = itemWithId as UserStats;
                break;
            }

            saveData(data);
            return { data: itemWithId, error: null };
          },
          async then(resolve: (value: { data: unknown; error: null }) => void) {
            const result = await this.single();
            resolve(result);
          }
        }),
        async then(resolve: (value: { error: null }) => void) {
          const data = getData();
          const items = Array.isArray(item) ? item : [item];

          items.forEach(i => {
            const id = generateId();
            const now = new Date().toISOString();
            const itemWithId = { ...i, id, created_at: now, updated_at: now };

            switch (table) {
              case 'products':
                data.products.push(itemWithId as Product);
                break;
              case 'tasks':
                data.tasks.push(itemWithId as Task);
                break;
              case 'deals':
                data.deals.push(itemWithId as Deal);
                break;
            }
          });

          saveData(data);
          resolve({ error: null });
        }
      }),
      update: (updates: Record<string, unknown>) => ({
        eq: (column: string, value: unknown) => ({
          select: () => ({
            single: async () => {
              const data = getData();
              let updated: unknown = null;

              switch (table) {
                case 'products': {
                  const idx = data.products.findIndex(p => p[column as keyof Product] === value);
                  if (idx >= 0) {
                    data.products[idx] = { ...data.products[idx], ...updates, updated_at: new Date().toISOString() };
                    updated = data.products[idx];
                  }
                  break;
                }
                case 'tasks': {
                  const idx = data.tasks.findIndex(t => t[column as keyof Task] === value);
                  if (idx >= 0) {
                    data.tasks[idx] = { ...data.tasks[idx], ...updates, updated_at: new Date().toISOString() };
                    updated = data.tasks[idx];
                  }
                  break;
                }
                case 'deals': {
                  const idx = data.deals.findIndex(d => d[column as keyof Deal] === value);
                  if (idx >= 0) {
                    data.deals[idx] = { ...data.deals[idx], ...updates, updated_at: new Date().toISOString() } as Deal;
                    updated = data.deals[idx];
                  }
                  break;
                }
                case 'profiles': {
                  if (data.profile) {
                    data.profile = { ...data.profile, ...updates, updated_at: new Date().toISOString() };
                    updated = data.profile;
                  }
                  break;
                }
                case 'ai_recommendations': {
                  const idx = data.recommendations.findIndex(r => r[column as keyof AIRecommendation] === value);
                  if (idx >= 0) {
                    data.recommendations[idx] = { ...data.recommendations[idx], ...updates } as AIRecommendation;
                    updated = data.recommendations[idx];
                  }
                  break;
                }
              }

              saveData(data);
              return { data: updated, error: null };
            },
            async then(resolve: (value: { data: unknown; error: null }) => void) {
              const result = await this.single();
              resolve(result);
            }
          }),
          async then(resolve: (value: { error: null }) => void) {
            const data = getData();

            switch (table) {
              case 'products': {
                const idx = data.products.findIndex(p => p[column as keyof Product] === value);
                if (idx >= 0) {
                  data.products[idx] = { ...data.products[idx], ...updates, updated_at: new Date().toISOString() };
                }
                break;
              }
              case 'tasks': {
                const idx = data.tasks.findIndex(t => t[column as keyof Task] === value);
                if (idx >= 0) {
                  data.tasks[idx] = { ...data.tasks[idx], ...updates, updated_at: new Date().toISOString() };
                }
                break;
              }
              case 'deals': {
                const idx = data.deals.findIndex(d => d[column as keyof Deal] === value);
                if (idx >= 0) {
                  data.deals[idx] = { ...data.deals[idx], ...updates, updated_at: new Date().toISOString() } as Deal;
                }
                break;
              }
            }

            saveData(data);
            resolve({ error: null });
          }
        })
      }),
      delete: () => ({
        eq: (column: string, value: unknown) => ({
          async then(resolve: (value: { error: null }) => void) {
            const data = getData();

            switch (table) {
              case 'products':
                data.products = data.products.filter(p => p[column as keyof Product] !== value);
                break;
              case 'customers':
                data.customers = data.customers.filter(c => c[column as keyof Customer] !== value);
                break;
              case 'deals':
                data.deals = data.deals.filter(d => d[column as keyof Deal] !== value);
                break;
              case 'tasks':
                data.tasks = data.tasks.filter(t => t[column as keyof Task] !== value);
                break;
            }

            saveData(data);
            resolve({ error: null });
          }
        })
      })
    };
  },

  functions: {
    invoke: async (functionName: string) => {
      // Simule les fonctions edge Supabase
      if (functionName === 'ai-recommendations') {
        const data = getData();
        return {
          data: {
            recommendations: data.recommendations
          },
          error: null
        };
      }
      return { data: null, error: null };
    }
  }
};

// Initialiser les données au chargement
initializeData();

export type { MockUser as User, MockSession as Session };