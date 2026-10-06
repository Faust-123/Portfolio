# Portfolio — ABI Gnim-gong Faustin

Portfolio personnel : **développeur web** (HTML, CSS, JavaScript), **dessinateur** et ancien
**chef de chantier**. Site statique, sans dépendance ni étape de build.

## Structure du projet

```
.
├── index.html              # Page unique (7 sections)
├── css/
│   └── style.css           # Thème sombre, responsive, styles d'impression
├── js/
│   └── main.js             # Navigation, animations, galerie, formulaire
└── img/
    ├── portrait.jpg        # Photo de profil
    ├── code.jpg            # Illustration « développement web »
    ├── dessins/            # Œuvres au crayon (portrait, manga, nature morte, collection)
    └── artisanat/          # Marionnettes et boucles d'oreilles
```

## Sections

| Ancre | Contenu |
| --- | --- |
| `#accueil` | Présentation, photo, accroches et boutons d'action |
| `#apropos` | Informations personnelles, qualités, compétences techniques |
| `#formation` | Parcours scolaire et ateliers créatifs (frise chronologique) |
| `#experience` | Chef de chantier / contrôleur de chantier à Kara |
| `#galerie` | Dessins au crayon, visionneuse plein écran |
| `#artisanat` | Créations faites main (marionnettes, bijoux en papier recyclé) |
| `#contact` | Coordonnées et formulaire ouvrant le logiciel de messagerie |

## Fonctionnalités

- **Navigation collante** avec suivi de la section active, barre de progression de lecture
  et menu hamburger sur mobile.
- **Apparitions au défilement** et barres de compétences animées
  (désactivées automatiquement si `prefers-reduced-motion` est actif).
- **Visionneuse d'images** : navigation au clavier (←/→/Échap), piège de focus, préchargement.
- **Formulaire de contact** validé côté client, qui prépare un `mailto:` pré-rempli.
- **Accessibilité** : lien d'évitement, textes alternatifs, `aria-*`, focus visible, contrastes.
- **Dégradation progressive** : animations et visionneuse activées seulement si JavaScript
  est disponible (`<html class="js">`), sinon le contenu reste lisible et les liens de la
  galerie ouvrent directement l'image.
- **Feuille d'impression** pour obtenir un rendu type CV en PDF (`Ctrl/Cmd + P`).

## Lancer le site en local

Aucune installation nécessaire — servez simplement le dossier :

```bash
python3 -m http.server 8080
# puis ouvrir http://localhost:8080
```

## Personnalisation rapide

- **Couleurs, rayons, polices** : variables CSS en haut de `css/style.css` (`:root`).
- **Compétences** : modifier `style="--level: XX%"` et le pourcentage affiché dans `index.html`.
- **Images** : remplacer les fichiers du dossier `img/` en conservant les mêmes noms.
- **Coordonnées** : mises à jour à la fois dans `index.html` et dans `js/main.js`
  (adresse `mailto:` du formulaire).

## Compatibilité

Navigateurs modernes (Chrome, Edge, Firefox, Safari). Les visuels utilisent `aspect-ratio`,
`IntersectionObserver`, les variables CSS et `clamp()` ; les navigateurs plus anciens affichent
toujours l'intégralité du contenu.
