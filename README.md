# Les dictées rigolotes

Jeu d’orthographe en français, sans dépendance, backend ni ressource externe.
Il remplace l’ancien jeu spatial. Les 50 phrases mettent en scène des dragons,
des lutins et des situations absurdes pour mémoriser les différences de sens.

## Jouer

Ouvrez `index.html` dans un navigateur récent, sur ordinateur, téléphone ou tablette.
Choisissez **CP, CE1, CE2, CM1 ou CM2** : chaque niveau propose **10 phrases**,
ordonnées des mots courants vers les homophones, les espaces, la ponctuation et
les négations qui changent le sens d’une phrase.
Les niveaux sont indicatifs et librement accessibles, sans évaluation scolaire officielle.

1. Lisez la **mission** : elle indique le sens à retrouver, car plusieurs choix
   peuvent être du français correct mais raconter une autre histoire.
2. Touchez les grands pointillés et choisissez parmi trois possibilités en ordre aléatoire.
3. Une erreur devient rouge avec une croix et un son grave. La phrase obtenue
   est montrée avec une explication amusante du contresens ; réessayez.
4. Une bonne réponse complète la phrase en vert avec une coche et un son aigu.
   Une astuce explique la différence à retenir.
5. Passez à la phrase suivante, puis consultez le bilan des dix phrases.

Les phrases ne sont pas lues à haute voix : c’est une dictée à trous visuelle.
Les pièges mêlent orthographe et compréhension : « pain / pin »,
« petits pois / petits poids », « chanter juste / juste chanter »,
« On mange, les amis ! / On mange les amis ! » et négations.
Tous les mauvais choix changent le sens ou produisent une image absurde ;
ils ne sont pas tous des contraires exacts, ni tous des fautes d’orthographe.
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
