# 🔗 KeepLink

Gestionnaire de liens personnels pour sauvegarder rapidement des URLs YouTube et sites web, synchronisés entre tous tes appareils.

## Fonctionnalités

- Connexion sécurisée via compte Google
- Ajouter un lien avec une URL, un nom et une catégorie (YouTube / Site web)
- Filtrer les liens par catégorie
- Supprimer un lien ou effacer toute la liste
- Exporter les liens dans un fichier `.txt`
- Synchronisation cloud en temps réel via Firebase Firestore
- Thème clair / sombre

## Technologies

- HTML / CSS / JavaScript vanilla
- **Firebase Firestore** — stockage cloud, synchronisation entre appareils
- **Firebase Authentication** — connexion Google, accès restreint au propriétaire

## Utilisation

1. Ouvre l'application sur [GitHub Pages](https://gt-steeve.github.io/keepLink/)
2. Connecte-toi avec ton compte Google
3. Colle une URL, ajoute un nom optionnel, choisis une catégorie
4. Clique sur **Conserver**

Les liens sont sauvegardés automatiquement dans Firebase et accessibles depuis n'importe quel appareil connecté.

## Export

Le bouton **Exporter .txt** télécharge un fichier texte de tous les liens visibles (selon le filtre actif).

## Hébergement

Le projet est hébergé sur **GitHub Pages**. Les données sont stockées dans **Firebase Firestore** (plan gratuit Spark).
