/**
 * Configuration des Routes - CRM Pro.cc
 * Plateforme de Gestion Hospitalière et CRM
 */

import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

// Lazy loading des composants
const MainLayout = lazy(() => import('../layouts/MainLayout'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Patients = lazy(() => import('../pages/Patients'));
const PatientDetail = lazy(() => import('../pages/PatientDetail'));
const Schedule = lazy(() => import('../pages/Schedule'));
const Staff = lazy(() => import('../pages/Staff'));
const BedMap = lazy(() => import('../pages/BedMap'));
const Billing = lazy(() => import('../pages/Billing'));
const SecretaryView = lazy(() => import('../pages/SecretaryView'));
const Analytics = lazy(() => import('../pages/Analytics'));
const Login = lazy(() => import('../pages/Login'));
const Settings = lazy(() => import('../pages/Settings'));
const NotFound = lazy(() => import('../pages/NotFound'));

// Définition des routes
export const CRM_ROUTES: RouteObject[] = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'patients',
        element: <Patients />,
      },
      {
        path: 'patients/:id',
        element: <PatientDetail />,
      },
      {
        path: 'schedule',
        element: <Schedule />,
      },
      {
        path: 'staff',
        element: <Staff />,
      },
      {
        path: 'bed-map',
        element: <BedMap />,
      },
      {
        path: 'billing',
        element: <Billing />,
      },
      {
        path: 'secretary',
        element: <SecretaryView />,
      },
      {
        path: 'analytics',
        element: <Analytics />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

// Métadonnées des routes pour navigation
export const ROUTE_META = {
  dashboard: {
    path: '/dashboard',
    title: 'Tableau de bord',
    icon: 'LayoutDashboard',
    description: 'Vue d\'ensemble hospitalière',
    requiresAuth: true,
  },
  patients: {
    path: '/patients',
    title: 'Patients',
    icon: 'Users',
    description: 'Gestion des patients',
    requiresAuth: true,
  },
  schedule: {
    path: '/schedule',
    title: 'Agenda',
    icon: 'Calendar',
    description: 'Rendez-vous et planning',
    requiresAuth: true,
  },
  staff: {
    path: '/staff',
    title: 'Personnel',
    icon: 'UserCog',
    description: 'Gestion du personnel',
    requiresAuth: true,
  },
  bedMap: {
    path: '/bed-map',
    title: 'Carte des lits',
    icon: 'Bed',
    description: 'Occupation et disponibilité',
    requiresAuth: true,
  },
  billing: {
    path: '/billing',
    title: 'Facturation',
    icon: 'CreditCard',
    description: 'Gestion financière',
    requiresAuth: true,
  },
  secretary: {
    path: '/secretary',
    title: 'Vue Secrétaire',
    icon: 'ClipboardList',
    description: 'Interface secrétariat',
    requiresAuth: true,
  },
  analytics: {
    path: '/analytics',
    title: 'Analytics',
    icon: 'BarChart3',
    description: 'Rapports et statistiques',
    requiresAuth: true,
  },
  settings: {
    path: '/settings',
    title: 'Paramètres',
    icon: 'Settings',
    description: 'Configuration',
    requiresAuth: true,
  },
} as const;

// Navigation groupée pour la sidebar
export const NAVIGATION_GROUPS = [
  {
    title: 'Principal',
    routes: ['dashboard', 'patients'],
  },
  {
    title: 'Organisation',
    routes: ['schedule', 'staff', 'bedMap'],
  },
  {
    title: 'Gestion',
    routes: ['billing', 'secretary'],
  },
  {
    title: 'Rapports',
    routes: ['analytics'],
  },
] as const;

// Breadcrumb helper
export function getBreadcrumbs(pathname: string): Array<{ label: string; path?: string }> {
  const segments = pathname.split('/').filter(Boolean);
  
  if (segments.length === 0) {
    return [{ label: 'Tableau de bord', path: '/dashboard' }];
  }
  
  const breadcrumbs = [{ label: 'Tableau de bord', path: '/dashboard' }];
  
  // Route patients avec ID
  if (segments[0] === 'patients' && segments.length > 1) {
    breadcrumbs.push(
      { label: 'Patients', path: '/patients' },
      { label: `Patient #${segments[1]}` }
    );
    return breadcrumbs;
  }
  
  // Routes normales
  const routeKey = segments[0] as keyof typeof ROUTE_META;
  const meta = ROUTE_META[routeKey];
  
  if (meta && routeKey !== 'dashboard') {
    breadcrumbs.push({ label: meta.title });
  }
  
  return breadcrumbs;
}

// Permissions et rôles
export const USER_ROLES = {
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  NURSE: 'nurse',
  SECRETARY: 'secretary',
  BILLING: 'billing',
} as const;

export const ROUTE_PERMISSIONS = {
  dashboard: [USER_ROLES.ADMIN, USER_ROLES.DOCTOR, USER_ROLES.NURSE, USER_ROLES.SECRETARY],
  patients: [USER_ROLES.ADMIN, USER_ROLES.DOCTOR, USER_ROLES.NURSE, USER_ROLES.SECRETARY],
  schedule: [USER_ROLES.ADMIN, USER_ROLES.DOCTOR, USER_ROLES.NURSE, USER_ROLES.SECRETARY],
  staff: [USER_ROLES.ADMIN],
  bedMap: [USER_ROLES.ADMIN, USER_ROLES.DOCTOR, USER_ROLES.NURSE],
  billing: [USER_ROLES.ADMIN, USER_ROLES.BILLING],
  secretary: [USER_ROLES.ADMIN, USER_ROLES.SECRETARY],
  analytics: [USER_ROLES.ADMIN, USER_ROLES.DOCTOR],
  settings: [USER_ROLES.ADMIN],
} as const;

// Check permission helper
export function hasRoutePermission(route: keyof typeof ROUTE_PERMISSIONS, userRole: string): boolean {
  const allowedRoles = ROUTE_PERMISSIONS[route];
  return allowedRoles.includes(userRole as any);
}

// Get accessible routes for user
export function getAccessibleRoutes(userRole: string): Array<keyof typeof ROUTE_META> {
  return Object.entries(ROUTE_PERMISSIONS)
    .filter(([_, roles]) => roles.includes(userRole as any))
    .map(([route]) => route as keyof typeof ROUTE_META);
}

// Route guards
export function isProtectedRoute(pathname: string): boolean {
  const segments = pathname.split('/').filter(Boolean);
  
  if (segments.length === 0 || segments[0] === 'login') {
    return false;
  }
  
  const routeKey = segments[0] as keyof typeof ROUTE_META;
  const meta = ROUTE_META[routeKey];
  
  return meta?.requiresAuth ?? true;
}

// Export des types
export type RouteKey = keyof typeof ROUTE_META;
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
export type RouteMeta = typeof ROUTE_META[RouteKey];

// Constantes d'URLs
export const API_URLS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    REGISTER: '/api/auth/register',
  },
  PATIENTS: {
    LIST: '/api/patients',
    DETAIL: (id: string) => `/api/patients/${id}`,
    CREATE: '/api/patients',
    UPDATE: (id: string) => `/api/patients/${id}`,
    DELETE: (id: string) => `/api/patients/${id}`,
  },
  APPOINTMENTS: {
    LIST: '/api/appointments',
    CREATE: '/api/appointments',
    UPDATE: (id: string) => `/api/appointments/${id}`,
    DELETE: (id: string) => `/api/appointments/${id}`,
  },
  STAFF: {
    LIST: '/api/staff',
    CREATE: '/api/staff',
    UPDATE: (id: string) => `/api/staff/${id}`,
    DELETE: (id: string) => `/api/staff/${id}`,
  },
  BEDS: {
    LIST: '/api/beds',
    UPDATE: (id: string) => `/api/beds/${id}`,
  },
  BILLING: {
    LIST: '/api/billing',
    CREATE: '/api/billing',
    UPDATE: (id: string) => `/api/billing/${id}`,
  },
  ANALYTICS: {
    DASHBOARD: '/api/analytics/dashboard',
    REPORTS: '/api/analytics/reports',
  },
} as const;

export default CRM_ROUTES;
