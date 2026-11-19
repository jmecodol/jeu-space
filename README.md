# Les petits champions du calcul

Jeu de mathématiques en français, du **CP au CM2**, qui remplace les dictées.
HTML, CSS et JavaScript natifs, sans dépendance, backend ni ressource externe.

## Jouer

Ouvrez `index.html` dans un navigateur récent sur ordinateur, téléphone ou tablette.
Choisissez votre niveau et **additions**, **soustractions**, **multiplications**
ou **mélange**. Chaque nouvelle série propose dix calculs aléatoires, avec des
plafonds de nombres qui augmentent au fil de la série. Changer de niveau ou de
type de calcul recommence une nouvelle série.
Le jeu s’ouvre sur le CE2, à titre de point de départ pour un enfant de huit ans ;
les cinq niveaux restent accessibles dans le volet « 🎒 … Changer », replié pour
laisser la place au jeu. Les tirages évitent les tout petits opérandes
dans les niveaux avancés. Les séries de multiplication et les mélanges proposent
aussi des produits par 10 (CE1/CE2) ou par des dizaines entières (CM1/CM2).

Un **grand calcul en ligne**, un renard-guide et trois consignes illustrées
indiquent les actions. Aucun clavier natif ni chronomètre :

1. Regardez le calcul. La première case de « Ma réponse » est déjà sélectionnée :
   une flèche et une bordure la signalent, pas seulement une couleur.
2. Touchez un chiffre **0 à 9** sur le pavé numérique toujours visible.
3. Écrivez le résultat **de gauche à droite**, comme un nombre habituel.
   La sélection avance automatiquement vers la prochaine case vide à droite.
4. Touchez une case pour la corriger ou l’effacer, puis **Vérifier ma réponse**.
   Un message invite à vérifier lorsque toutes les cases sont remplies.
5. Une erreur colore la ligne en rouge et affiche « Recommence ». La saisie
   reste disponible pour la corriger. Une réussite affiche « Bravo », joue un
   son aigu et débloque le calcul suivant.

Le volet facultatif **« Besoin d’aide ? Pose ton calcul ici »** montre une opération
alignée en colonnes, avec unités, dizaines et centaines. Les petites cases
au-dessus de l’opération servent de **brouillon de retenues
ou d’emprunts**, saisissable avec le même pavé. Elles ne sont pas évaluées et
ne constituent pas une démonstration automatique de la méthode. Pour les
multiplications par deux chiffres, les deux produits intermédiaires sont affichés
dans l’aide pour guider l’addition finale. Seul le résultat dans « Ma réponse »
est évalué ; toutes ses cases doivent être remplies.

### Difficultés

- **CP :** additions et soustractions jusqu’à 20, initiation facultative aux
  multiplications par 2 (groupes d’objets).
- **CE1 :** nombres à deux chiffres, retenues et premières tables.
- **CE2 :** nombres à trois chiffres et multiplication par un chiffre.
- **CM1 :** nombres à quatre chiffres et produits posés par deux chiffres.
- **CM2 :** nombres à cinq chiffres et produits jusqu’à trois chiffres par deux chiffres.

Les niveaux sont indicatifs, pas une certification du programme scolaire.
Les soustractions n’ont jamais de résultat négatif. Pas de décimales ni divisions.

Le pavé tactile évite de faire apparaître le clavier natif. Au clavier physique,
Tab et Entrée activent les boutons ; les chiffres remplissent la case sélectionnée,
les flèches gauche/droite changent de case et Retour arrière/Suppr efface.
Les sons sont synthétisés localement et désactivables ; sans audio, les messages
et symboles restent disponibles. Aucun chronomètre, inscription ou stockage personnel.
Le bilan indique les dix réussites, les réussites sans erreur et les corrections.

## Publication

`index.html`, `style.css` et `script.js` constituent le site. Les chemins relatifs
permettent une publication sous `/jeu-space/`. GitHub Pages peut publier la racine
de la branche configurée ; `.github/workflows/deploy.yml` publie également ces
trois fichiers sur push vers `main` ou sur lancement manuel.

Adresse prévue : <https://jmecodol.github.io/jeu-space/>.
Vérifiez Actions pour connaître l’état effectif du déploiement.
