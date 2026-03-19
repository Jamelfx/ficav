# 📚 Guide Admin Panel - FICAV CMS

## Vue d'ensemble

Votre admin panel FICAV est maintenant **entièrement fonctionnel** pour gérer le contenu de votre site sans code supplémentaire nécessaire.

## 📊 Sections disponibles

### 1. **Actualités (News)**
- 📁 Route : `/admin/news`
- ✨ Fonctionnalités :
  - Créer une nouvelle actualité
  - Éditer les actualités existantes
  - Supprimer les actualités
  - Publier/dépublier en temps réel
- 📝 Champs : Titre, Résumé, Contenu (Markdown), Image

### 2. **Événements (Events)**
- 📁 Route : `/admin/events`
- ✨ Fonctionnalités :
  - Créer des événements (assemblées, formations, etc.)
  - Gérer les dates et lieux
  - Contrôler la capacité max
  - Publier automatiquement
- 📋 Types : FESTIVAL, ASSEMBLY, TRAINING, PROJECTION, CONFERENCE, WORKSHOP

### 3. **Films**
- 📁 Route : `/admin/films`
- ✨ Fonctionnalités :
  - Ajouter des films ivoiriens
  - Gérer synopsis, genre, année
  - Ajouter bande annonce
  - Gérer l'affiche (poster)
- 🎬 Métadonnées : Réalisateur, Cast, Crew

### 4. **Offres d'emploi (Jobs)**
- 📁 Route : `/admin/jobs`
- ✨ Fonctionnalités :
  - Poster des offres d'emploi/casting
  - Gérer les postes et formations
  - Définir des deadlines
  - Gérer les contacts

### 5. **Associations**
- 📁 Route : `/admin/associations`
- 🏢 Gérer les associations membres
- 📍 Détails : Contact, localisation, membres

### 6. **Utilisateurs**
- 📁 Route : `/admin/users`
- 👥 Gérer les rôles et permissions

## 🛠️ Stack technique

```
Next.js 16 + TypeScript
├── React Hook Form (validation)
├── Zod (schémas validation)
├── shadcn/ui (composants)
├── Prisma (ORM)
└── PostgreSQL (Neon)
```

## 🚀 Comment utiliser

### Créer un nouvel élément

1. Allez à la section correspondante (ex: `/admin/news`)
2. Cliquez sur **"+" Nouvel élément**
3. Remplissez le formulaire
4. Cochez **"Publier"** pour rendre visible
5. Cliquez sur **"Sauvegarder"**

### Modifier un élément

1. Allez à la section
2. Cliquez sur l'icône **✏️ Edit**
3. Modifiez les informations
4. Cliquez sur **"Sauvegarder"**

### Supprimer un élément

1. Allez à la section
2. Cliquez sur l'icône **🗑️ Delete**
3. Confirmez la suppression

### Voir l'élément publié

1. Cliquez sur l'icône **👁️ Voir**
2. Ouvre votre site en arrière-plan

## 📦 Hooks réutilisables

### `useApi<T>`
Hook pour gérer les appels API de manière simple.

```typescript
const { data, loading, fetch, create, update, delete } = useApi({
  url: "/api/news"
});

// Créer
const newItem = await create({ title: "...", content: "..." });

// Mettre à jour
await update(id, { title: "Nouveau titre" });

// Supprimer
await delete(id);
```

## 🔐 Schémas de validation (Zod)

Tous les formulaires utilisent des schémas Zod pour valider les données :

```typescript
import { NewsSchema, EventSchema, FilmSchema } from "@/lib/schemas";

// Validation automatique avec React Hook Form
const form = useForm({
  resolver: zodResolver(NewsSchema),
  defaultValues: { ... }
});
```

## 🎨 Composants UI disponibles

- `Button` - Boutons variés
- `Input` - Champs texte
- `Textarea` - Zones de texte
- `Card` - Conteneurs
- `Dialog` - Modales
- `Select` - Sélecteurs
- `DataTable` - Tableaux

## 📱 Responsive

L'admin panel est **100% responsive**. Adapté pour :
- 📱 Mobile (320px+)
- 💻 Tablet
- 🖥️ Desktop

## ⚡ Performance

- ✅ Server-side rendering
- ✅ Optimisations d'images
- ✅ Lazy loading
- ✅ Caching intelligent

## 🔄 API REST

Tous les endpoints suivent la même convention :

```
GET    /api/[resource]          - Lister
GET    /api/[resource]/[id]     - Détail
POST   /api/[resource]          - Créer
PATCH  /api/[resource]/[id]     - Mettre à jour
DELETE /api/[resource]/[id]     - Supprimer
```

## 📝 Style de données

### Actualités (News)
```json
{
  "title": "Titre de l'actualité",
  "excerpt": "Résumé court",
  "content": "Contenu principal (Markdown ok)",
  "image": "https://...",
  "isPublished": true
}
```

### Événements (Events)
```json
{
  "title": "Festival du cinéma",
  "description": "Description",
  "type": "FESTIVAL",
  "startDate": "2024-06-15T19:30:00",
  "venue": "Palais de la Culture",
  "isPublished": true
}
```

### Films
```json
{
  "title": "Titre du film",
  "year": 2024,
  "genre": "Drame",
  "synopsis": "Résumé",
  "duration": 120,
  "poster": "https://...",
  "isPublished": true
}
```

## 🐛 Troubleshooting

### Les données ne se chargent pas
- Vérifier la connexion DB (varialbles d'env dans Vercel)
- Vérifier les logs Vercel

### Les images ne s'affichent pas
- Vérifier l'URL absolue (https://...)
- S'assurer que le domaine est autorisé dans `next.config.ts`

### Les modifications ne se sauvegardent pas
- Vérifier les permissons utilisateur
- Vérifier les erreurs dans la console browser

## 📈 Prochaines améliorations possibles

- [ ] Multi-langue support
- [ ] Planification des publications
- [ ] Upload d'images directes
- [ ] Collaboration en temps réel
- [ ] Analytics intégrés
- [ ] Audit trail des modifications

## ✉️ Support

Besoin d'aide ? Contactez l'équipe FICAV !

---

**Dernière mise à jour** : Mars 2024
**Version** : 1.0.0
