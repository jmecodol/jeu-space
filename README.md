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

### Une histoire à suivre avec Pipo

Chaque niveau raconte une aventure complète du petit dragon **Pipo**, en dix étapes
liées. Le texte de la scène et la mission expliquent pourquoi le prochain mot est
nécessaire. Une réussite donne un objet ou accomplit une action utilisée dans la
suite : il faut résoudre l’étape actuelle pour débloquer la suivante.

Pipo est dessiné en SVG directement dans la page ; de petites vignettes accompagnent
chaque scène, sans images externes. Un mauvais choix affiche une mésaventure
personnalisée, une image de surprise et le contresens obtenu. Ce détour reste
temporaire : la bonne réponse répare l’accident et reprend l’histoire principale.
Il n’y a ni perte de vie, ni punition, ni scène effrayante.

Les cinq chapitres suivent Pipo du **gâteau à roulettes** (CP) au **bateau des
chaussettes** (CE1), puis au **jardin du phare** (CE2), à **la poste des nuages**
(CM1) et au **spectacle à virgules** (CM2). Lila la souris et Nino le hibou
l’accompagnent. Chaque chapitre peut aussi se jouer séparément.

Le parcours numéroté et le carnet conservent les dix réussites de l’aventure en cours.
Le dénouement apparaît après la dernière étape. Les niveaux restent accessibles
librement pour choisir la difficulté ; changer ou recommencer efface le carnet,
sans sauvegarde entre deux visites.

1. Lisez la **mission** : elle indique le sens à retrouver, car plusieurs choix
   peuvent être du français correct mais raconter une autre histoire.
2. Les trois **cartes-réponses illustrées sont immédiatement visibles sous la phrase** :
   touchez directement celle qui convient. Il n’y a plus de menu à ouvrir sur les pointillés.
   Le trou « quel mot ? » est un simple repère visuel, pas un bouton.
3. Une erreur devient rouge avec une croix et un son grave. La phrase obtenue
   est montrée avec une explication amusante du contresens ; réessayez.
4. Une bonne réponse complète la phrase en vert avec une coche et un son aigu.
   Une astuce explique la différence à retenir.
5. Passez à la phrase suivante, puis consultez le bilan des dix phrases.

Chaque réponse, correcte ou non, possède son propre pictogramme correspondant à
l’objet ou à l’action. Les objets sans emoji approprié (râteau, moule, corne, table,
banc, tapis, dé à coudre, flûte et vis) sont dessinés en SVG local. Les phrases et
notions abstraites combinent de petits symboles pour illustrer leur sens ; le texte
reste toujours affiché et fournit le nom accessible du bouton. Les images restent
attachées aux réponses après mélange et en cas d’erreur. Le rendu des emojis
peut varier selon l’appareil.

Sur ordinateur, Pipo apparaît à côté de l’exercice ; sur téléphone, les réponses
forment trois grandes cartes verticales. L’introduction et le carnet se déplient
seulement si souhaité pour laisser la place à la question.

Les phrases ne sont pas lues à haute voix : c’est une dictée à trous visuelle.
Les pièges mêlent orthographe et compréhension : « plan / plant »,
« petits pois / petits poids », « bientôt / bien tôt », les virgules d’appel
comme « Nino, apporte la corde ! » et les négations.
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
