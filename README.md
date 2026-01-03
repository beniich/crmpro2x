# Cloud Industrie CRM

Application CRM et Solutions Cloud pour entreprises.

## 🚀 Fonctionnalités

- **Dashboard** - Tableau de bord personnalisable avec statistiques en temps réel
- **CRM** - Gestion des clients, contacts et entreprises
- **Deals Pipeline** - Suivi des opportunités commerciales
- **Analytics** - Analyses et rapports détaillés
- **Tâches** - Gestion des tâches et workflows
- **Produits** - Catalogue de produits cloud
- **AI Assistant** - Assistant IA pour recommandations

## 🛠 Technologies

- **Frontend**: React 18, TypeScript, Vite
- **UI**: Tailwind CSS, Shadcn/ui, Radix UI
- **State**: Zustand, React Query
- **Charts**: Recharts
- **Animations**: Framer Motion

## 📦 Installation

```bash
# Cloner le repo
git clone [url-du-repo]

# Installer les dépendances
npm install

# Lancer en développement
npm run dev
```

## 🔧 Mode Local

Cette application fonctionne en mode **100% local** avec stockage localStorage.
Aucune connexion à un backend externe n'est requise.

### Compte démo

Pour tester l'application, utilisez n'importe quel email/mot de passe.
L'application accepte toutes les connexions en mode démo.

## 📂 Structure du projet

```
src/
├── components/     # Composants React réutilisables
├── pages/          # Pages de l'application
├── providers/      # Context providers (Auth)
├── store/          # État global (Zustand)
├── lib/            # Utilitaires et données mock
├── hooks/          # Custom React hooks
└── integrations/   # Client mock (remplace Supabase)
```

## 🌐 Routes

### Publiques
- `/` - Page d'accueil
- `/services` - Nos services
- `/about` - À propos
- `/contact` - Contact
- `/pricing` - Tarifs
- `/products` - Catalogue produits
- `/auth` - Connexion/Inscription

### Protégées (nécessitent connexion)
- `/dashboard` - Tableau de bord
- `/crm` - CRM principal
- `/clients` - Liste des clients
- `/deals` - Pipeline des deals
- `/analytics` - Analytics
- `/tasks` - Gestion des tâches
- `/settings` - Paramètres
- `/ai-assistant` - Assistant IA

## 🎨 Personnalisation

L'application utilise un système de thème personnalisable via Tailwind CSS.
Les variables de couleur sont définies dans `tailwind.config.ts`.

## 📝 Licence

© 2024 Cloud Industrie. Tous droits réservés.
