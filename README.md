# Les petites dictées

Jeu d’orthographe en français, sans dépendance, backend ni ressource externe.
Il remplace l’ancien jeu spatial.

## Jouer

Ouvrez `index.html` dans un navigateur récent, sur ordinateur, téléphone ou tablette.
Choisissez **CP, CE1, CE2, CM1 ou CM2** : chaque niveau propose **10 phrases**,
ordonnées des mots courants vers des accords et difficultés plus complexes.
Les niveaux sont indicatifs et librement accessibles, sans évaluation scolaire officielle.

1. Touchez les grands pointillés dans la phrase.
2. Choisissez parmi trois orthographes présentées dans un ordre aléatoire.
3. Une erreur devient rouge avec une croix et un son grave : choisissez une autre réponse.
4. Une bonne réponse complète la phrase en vert avec une coche et un son aigu.
5. Passez à la phrase suivante, puis consultez le bilan des dix phrases.

Les phrases ne sont pas lues à haute voix : c’est une dictée à trous visuelle.
Les sons sont synthétisés localement et peuvent être coupés. Si le navigateur
ne permet pas l’audio, tous les retours restent lisibles. Tab et Entrée permettent
de jouer au clavier. Aucun chronomètre, inscription ou stockage personnel.
Changer ou recommencer un niveau remet son bilan à zéro.

## Fichiers et publication

`index.html` contient l’interface, `style.css` la présentation responsive et
`script.js` les 50 phrases, la progression et les effets sonores.

La publication GitHub Pages depuis une branche utilise `index.html` à la racine.
Le workflow `.github/workflows/deploy.yml` publie les trois fichiers après un push
sur `main` ou un lancement manuel. Les chemins relatifs fonctionnent sous `/jeu-space/`.

Adresse prévue : <https://jmecodol.github.io/jeu-space/>.
Vérifiez le déploiement dans Actions avant de considérer la nouvelle version comme disponible.
