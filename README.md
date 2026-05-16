# 🔗 KeepLink

Gestionnaire de liens personnels pour sauvegarder rapidement des URLs YouTube et sites web.

## Fonctionnalités

- Ajouter un lien avec une URL, un nom et une catégorie (YouTube / Site web)
- Filtrer les liens par catégorie
- Supprimer un lien ou effacer toute la liste
- Exporter les liens dans un fichier `.txt`
- Sauvegarde automatique dans le navigateur (localStorage)

## Technologies

- HTML / CSS / JavaScript vanilla
- localStorage (aucune base de données ni serveur requis)

## Alternative cloud

Une intégration **Firebase Firestore** (Google) a été explorée pour synchroniser les liens entre appareils. Cette option nécessite un projet Firebase et un serveur local (ex. Live Server). Elle peut être activée en remplacement du localStorage si une persistance cloud est souhaitée.

## Utilisation

1. Ouvre `index.html` dans ton navigateur (ou via Live Server dans VS Code)
2. Colle une URL, ajoute un nom optionnel, choisis une catégorie
3. Clique sur **Conserver**

Les liens sont sauvegardés automatiquement dans le navigateur.

## Export

Le bouton **Exporter .txt** télécharge un fichier texte de tous les liens visibles (selon le filtre actif).

## Hébergement

Le projet est compatible avec **GitHub Pages** — aucun serveur nécessaire.
