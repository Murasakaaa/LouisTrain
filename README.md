# 🚂 LouisTrain

Une plateforme moderne de réservation de trains construite avec **Next.js 16**, **React 19** et **TypeScript**. LouisTrain offre une expérience utilisateur fluide pour rechercher, réserver et payer des billets de train en ligne.

## 📋 Fonctionnalités

### Pour les Utilisateurs
- 🔐 **Authentification sécurisée** - Inscription, connexion et gestion des sessions
- 🚆 **Recherche de trajets** - Consulter les départs disponibles et calendrier
- 🛒 **Panier intelligent** - Ajouter/modifier/supprimer des réservations
- 💳 **Paiement Stripe** - Traitement sécurisé des paiements en ligne
- 📧 **Confirmation par email** - Confirmations de réservation et billets
- 📄 **Génération de billets** - PDF avec code QR unique
- 📊 **Historique** - Suivi complet des réservations passées
- 🎟️ **Abonnements** - Programme d'abonnement pour clients réguliers
- 🔄 **Récupération de réservations** - Retrouver une réservation existante

### Pour les Administrateurs
- 👨‍💼 **Tableau de bord admin** - Gestion globale de la plateforme
- 📈 **Gestion des trajets** - Créer et modifier les départs disponibles
- 👥 **Gestion des utilisateurs** - Suivi des clients et abonnements

## 🛠️ Stack Technologique

### Frontend
- **Next.js 16** - Framework React moderne avec routing et API routes
- **React 19** - Dernière version avec React Compiler
- **TypeScript** - Pour plus de sécurité et meilleure DX
- **CSS** - Styles personnalisés

### Backend
- **Node.js** - Serveur d'exécution
- **MongoDB** - Base de données avec Mongoose ODM

### Services Externes
- **Stripe** - Traitement des paiements sécurisé
- **Nodemailer** - Envoi d'emails automatisés

### Outils
- **jsPDF** - Génération de PDF pour les billets
- **QRCode** - Génération de codes QR
- **Bcrypt** - Hashage sécurisé des mots de passe
- **José** - Tokens JWT
- **Lucide React** - Icônes SVG

## 🚀 Installation & Lancement

### Prérequis
- Node.js 18+ 
- npm/yarn/pnpm
- MongoDB local ou distant
- Clés Stripe (développement et production)
- Configuration email (Nodemailer)

### Installation

```bash
# Cloner le projet
git clone [votre-repo]
cd LouisTrain

# Installer les dépendances
npm install
```

### Configuration

Créer un fichier `.env.local` à la racine du projet:

```env
# Base de données
MONGODB_URI=mongodb+srv://[user]:[password]@[cluster].mongodb.net/[database]

# Authentification personnalisée
SESSION_SECRET=[votre-clé-session-secrète]
ADMIN_CLIENT_ID=[votre-id-client-admin]
NEXT_PUBLIC_ADMIN_CLIENT_ID=[votre-id-client-admin-public]

# Stripe
STRIPE_SECRET_KEY=[votre-clé-secrète]
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=[votre-clé-publique]
```

### Développement

```bash
npm run dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000)

### Production

```bash
npm run build
npm run start
```

## 📁 Structure du Projet

```
LouisTrain/
├── src/
│   ├── app/                    # Pages et layouts Next.js
│   │   ├── api/               # Routes API backend
│   │   ├── login/             # Page connexion
│   │   ├── register/          # Page inscription
│   │   ├── paiement/          # Page paiement
│   │   ├── panier/            # Page panier
│   │   ├── calendrier/        # Calendrier des trajets
│   │   ├── historique/        # Historique réservations
│   │   └── admin/             # Tableau de bord admin
│   ├── components/            # Composants React réutilisables
│   ├── models/                # Modèles Mongoose (Auth, Client, Depart)
│   ├── lib/                   # Utilitaires (DB, mailer, session)
│   └── style/                 # Feuilles de style CSS
├── public/                    # Ressources statiques (fonts, images)
└── package.json
```

## 🔑 Points Clés

- **Sécurité** - Authentification JWT, hashage Bcrypt, validation Zod
- **Performance** - React Compiler activé, optimisation des fonts
- **Email** - Nodemailer pour confirmations et notifications
- **Paiement** - Intégration complète Stripe avec webhooks
- **Documents** -Hashage Bcrypt, tokens JWT, validation Zod
- **Performance** - React Compiler activé, optimisation des fonts
- **Email** - Nodemailer pour confirmations et notifications
- **Paiement** - Intégration complète Stripe
```bash
npm run dev      # Lancer le serveur de développement
npm run build    # Construire pour la production
npm run start    # Lancer le serveur de production
npm run lint     # Vérifier la qualité du code
```

## 📄 Licence

Propriétaire - Tous droits réservés

---

**LouisTrain** - Simplifier la réservation de trains 🚆
