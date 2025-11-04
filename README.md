# 🎮 PixelQuest

**PixelQuest** est une application web interactive permettant aux utilisateurs de découvrir, rechercher et sauvegarder leurs jeux vidéo favoris à partir de l’API publique **RAWG.io**.  
Le projet met en pratique les bases du développement front-end moderne : intégration d’API, gestion asynchrone, interactivité, et design responsive.

---

## 🧩 Contexte du projet

Ce projet est réalisé dans le cadre du parcours **Développeur Web & Web Mobile [2023]**.  
L’objectif est de concevoir une interface web complète de découverte de jeux vidéo, inspirée du site [RAWG.io](https://rawg.io/).

---

## 🚀 Fonctionnalités principales

### 🕹️ 1. Exploration des jeux
- Récupération dynamique des jeux via l’API **RAWG.io**
- Affichage des informations principales :
  - Nom  
  - Image / jaquette  
  - Genre(s)  
  - Plateforme principale  
  - Note moyenne  
  - Date de sortie  
- Pagination : 12 jeux par page

### 🔍 2. Recherche et filtres dynamiques
- Champ de recherche par nom de jeu  
- Filtres par :
  - Genre (Action, RPG, Simulation, etc.)
  - Plateforme (PC, PlayStation, Xbox, Switch…)
  - Note (croissante / décroissante)
- Résultats mis à jour sans rechargement de la page

### ❤️ 3. Système de favoris (localStorage)
- Ajout / retrait d’un jeu des favoris via un bouton ❤️  
- Sauvegarde automatique dans le **localStorage**  
- Page ou section “Mes Favoris” affichant les jeux sauvegardés  
- Persistance des données après actualisation  

### 📄 4. Détails d’un jeu
- Au clic sur un jeu → ouverture d’une modale ou page dédiée  
- Affichage des détails :
  - Titre  
  - Description  
  - Studio / Éditeur  
  - Genres  
  - Note  
  - Date de sortie  
- Bouton “Ajouter aux favoris”  
- Fermeture possible par clic hors modale ou bouton “X”

### ⚡ 5. Gestion asynchrone et UX
- Utilisation de `async/await` et `try...catch`  
- Loader visible pendant le chargement des données  
- Messages d’erreur si :
  - Pas de connexion Internet  
  - Aucun résultat trouvé  
- Gestion des pages indisponibles et requêtes simultanées

### 🎨 6. UI / UX et design responsive
- Maquette réalisée sur **Figma**  
- Intégration du design final avec **Tailwind CSS**  
- Mise en page responsive (mobile, tablette, desktop)  
- Transitions et animations :
  - Survol des cartes  
  - Ouverture de modale  
  - Animation du loader  

---

## 🧱 Structure du projet

