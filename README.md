# Gardiens des planètes

Jeu spatial 2D en français, autonome, sans framework, compilation, backend ni ressources externes. Pilotez un vaisseau pour défendre Aurore, Céleste et Saphir, développer leurs colonies et survivre à **six vagues**.

## Jouer

### Canons de hublot et rotation complète

En vue cockpit, choisissez l’un des **quatre canons aux coins du hublot**. Les projectiles partent du coin sélectionné, pas du repère NAV. Cliquez ou glissez dans l’espace pour fixer l’objectif ; celui-ci reste attaché au monde après relâchement, même lorsque vous tournez. Activez **Tir continu** pour maintenir les tirs vers cet objectif, ou maintenez clic, Espace ou TIR. Pause et changement d’outil désactivent le tir continu.

Maintenez **↶ / ↷** ou **Q / E** pour tourner sans butée à 360 degrés dans les deux sens. Au clavier, Tab puis Entrée sur les boutons de rotation effectue un pas de 15 degrés. Le compteur indique l’angle ; huit étoiles nommées, espacées de 45 degrés, permettent de reconnaître le retour au même horizon après un tour complet. **Recentrer** revient à zéro. Les flèches/WASD et les commandes à deux doigts conservent le déplacement et la visée ; en cockpit Q sert désormais à tourner, A à aller à gauche.

Il s’agit d’une rotation dans le plan du jeu 2D (roulis du hublot), pas d’une navigation sphérique 3D avec lacet et tangage indépendants. Les canons et le cadre restent fixes tandis que la carte, les étoiles et les cibles tournent. La réduction des animations ralentit la rotation volontaire. Certains objets peuvent sortir du hublot lors d’un virage ; recentrez ou poursuivez le tour pour les retrouver.

### Cockpit, console intégrée et retour au pilotage

- La zone de jeu occupe la fenêtre sans menus placés sous la carte. **Console** ouvre un panneau superposé défilant ; **Fermer** le referme. Les commandes restent dans l’écran, sur ordinateur, téléphone et tablette.
- **Plein écran** utilise le mode natif si le navigateur l’autorise ; sinon le jeu reste dans sa fenêtre. Le bouton permet aussi d’en sortir. Échap peut quitter le plein écran avant d’agir sur la pause, selon le navigateur.
- La caméra **Depuis le cockpit** ajoute une vitre, un tableau de bord et une légère inclinaison du paysage lors des mouvements latéraux. Le repère **NAV** indique votre position sur la carte et les collisions y sont calculées. C’est une vue cockpit stylisée sur une carte 2D, pas un monde 3D en perspective. La **Vue extérieure** reste disponible dans la console. La réduction des animations désactive les inclinaisons.
- Les six menaces ont des vignettes dessinées localement : choisissez l’image, puis touchez la carte. Les monstres apparaissent au point choisi et attaquent la cible la plus proche ; météorites, comètes et missiles arrivent depuis le bord supérieur vers le point. Le panneau se ferme pour libérer la visée.
- Une création de planète, une sélection ou un lancement réussi revient automatiquement au pilotage. **Piloter** permet d’annuler un outil en attente et de reprendre une partie en pause. **Reprendre** rend aussi le focus à la carte et rétablit le pilotage.
- L’ouverture d’un sélecteur natif n’entraîne plus une pause sur simple perte de focus ; les touches et doigts actifs sont effacés pour éviter les commandes bloquées. Passer réellement à un autre onglet ou masquer la page continue à mettre en pause.

### Nouveau : atelier et pilotage à deux doigts

Le mode **Création libre**, sélectionné à l’accueil par défaut, n’impose aucune vague automatique : vous contrôlez la galaxie. Le mode **Défense** conserve les six vagues et les coûts décrits plus bas.

- **Téléphone / tablette :** dans l’espace, le premier doigt place et déplace le vaisseau (légèrement au-dessus du doigt pour rester visible). Le second doigt indique la direction et déclenche les tirs continus. Relever le second arrête le tir ; relever le premier réinitialise les deux rôles. Reposez les doigts pour reprendre. Les boutons de déplacement et TIR restent utilisables.
- **Armes :** choisissez balles rapides ou missiles plus lents et plus puissants (quatre points de dégâts, contre un pour une balle), avec un effet d’explosion. Les armes du vaisseau ne blessent jamais les planètes.
- **Planètes :** dans l’atelier, choisissez « Créer une planète », puis touchez un endroit libre. Maximum dix mondes vivants, avec un espacement minimum. Les nouveaux mondes possèdent une atmosphère visuelle, mais aucun bâtiment ni habitant au départ.
- **Colonies :** sélectionnez un monde avec sa fiche ou l’action de sélection. Une base accueille quinze habitants (maximum trois bases) en plus des cinq places par maison. Accueillez jusqu’à cinq habitants par action, dans la limite des places disponibles. Choisissez leur apparence : danseurs à deux pieds, chapeaux pointus ou peuple lumineux. Le choix s’applique à la colonie entière. Les silhouettes visibles sont limitées à douze pour la lisibilité ; le compteur affiche toute la population.
- **Attaques :** choisissez une météorite, un astéroïde géant, une comète, un monstre à tentacules, un monstre à carapace ou un missile. Avec « Lancer une menace », touchez la cible : la menace voyage depuis le bord supérieur jusqu’au point fixé. Le bouton « Envoyer vers la planète sélectionnée » évite de devoir toucher le terrain. Maximum soixante menaces simultanées.
- **Construction et installation gratuites en création** ; en défense : base 60 crédits et installation de cinq habitants 10 crédits. Les boucliers sont également gratuits en création.
- **Destruction :** les menaces endommagent les mondes et peuvent supprimer bâtiments et habitants, avec des explosions sans gore. La destruction volontaire conserve sa confirmation explicite, sa pénalité et la défaite si le dernier monde disparaît. Le mode libre n’a pas de victoire imposée.
- **Menus mobiles :** tous les outils restent accessibles par défilement volontaire en portrait ; sur une tablette en paysage, le panneau latéral défile indépendamment. L’espace et les commandes ne déclenchent pas de défilement tactile.
- **Clavier de l’atelier :** focalisez l’espace avec Tab, utilisez les flèches pour déplacer le viseur et Entrée pour exécuter l’action choisie. Revenez à « Piloter » pour contrôler le vaisseau.

Les atmosphères sont un effet visuel : il n’y a pas de simulation physique de l’air ni de vue à pied. Le rendu reste un jeu 2D stylisé, avec un vaisseau détaillé, pas une simulation photoréaliste.

Ouvrez `index.html` dans un navigateur récent, ou lancez depuis la racine du dépôt :

```sh
python3 -m http.server 8000
```

Puis ouvrez <http://localhost:8000>. Aucun paquet à installer. JavaScript doit être activé.

### Commandes

| Action | Ordinateur | Mobile / tactile |
| --- | --- | --- |
| Piloter | Flèches, WASD ou ZQSD | Maintenir les flèches tactiles |
| Viser | Déplacer la souris | Toucher la zone spatiale |
| Tirer | Clic gauche maintenu ou Espace | Maintenir TIR |
| Sélectionner une colonie | Boutons des trois planètes | Mêmes boutons |
| Construire / protéger | Boutons de la colonie | Mêmes boutons |
| Pause / reprise | P, Échap ou bouton | Bouton Pause / Reprendre |

Les boutons sont utilisables au clavier avec Tab et Entrée. La perte de focus met automatiquement la partie en pause. Le jeu reste jouable sans audio ; aucun son n’est utilisé. Le réglage système de réduction des animations limite les effets de particules.

### Défense et progression

- Les météorites sont lentes et résistantes ; les comètes plus rapides ; les monstres résistants lancent des lasers ; les missiles rapides suivent le vaisseau.
- Les lasers sont annoncés en pointillés pendant 1,25 seconde avant de devenir dangereux pendant 0,4 seconde. Esquivez les lignes ; les autres menaces peuvent être détruites par vos tirs.
- Vos tirs ne blessent jamais les planètes. Une collision menace la coque ou la colonie. Après un impact, la coque bénéficie de 1,2 seconde d’invulnérabilité.
- Chaque menace neutralisée rapporte 8 à 25 crédits et 80 à 250 points. Les vagues deviennent progressivement plus nombreuses et rapides.
- Après une vague, vous disposez de quatre secondes pour développer les colonies, puis recevez 25 crédits, 250 points et 15 points de réparation de coque.
- **Victoire :** terminer six vagues avec une colonie survivante. **Défaite :** coque à zéro ou aucune planète survivante, même après un sacrifice. Un bouton permet de recommencer.
- Le meilleur score est sauvegardé avec `localStorage`, si disponible. Le blocage du stockage ne bloque pas le jeu. Une nouvelle partie réinitialise la mission, pas le record.

### Maisons, habitants et choix stratégiques

Chaque planète commence avec 100 points de santé, une maison et deux habitants. Les 60 crédits initiaux sont communs aux colonies.

- Une maison coûte **30 crédits**, pour une capacité de cinq habitants, avec un maximum de huit maisons par planète.
- Une colonie accueille un habitant toutes les quatre secondes, jusqu’à sa capacité. La croissance s’arrête pendant une pause ou une confirmation.
- Une attaque enlève de la santé, détruit une maison et retire jusqu’à trois habitants ; la population restante ne peut dépasser la capacité des maisons survivantes. Vous pouvez reconstruire une colonie sans maisons.
- Un bouclier coûte **20 crédits** et absorbe les attaques pendant huit secondes.
- Le bouton **Détruire volontairement cette planète** ouvre une confirmation indiquant précisément les maisons et habitants perdus. Annuler ou Échap préserve la colonie. Confirmer supprime définitivement la planète, toutes ses maisons et tous ses habitants, avec un effet de destruction sans gore.
- Un sacrifice retire 100 points (sans passer sous zéro), ne rapporte aucune ressource et incrémente les statistiques. Détruire la dernière planète entraîne immédiatement une défaite. **Aucun sacrifice n’est requis pour gagner.**

## Publication GitHub Pages

Adresse attendue après activation et déploiement réussi : <https://jmecodol.github.io/jeu-space/>.
Cette adresse n’est pas une garantie de publication : vérifiez le workflow et l’URL publique.

1. Le dépôt doit être public (sinon : **Settings → General → Danger Zone → Change repository visibility** ; cette action nécessite les droits administrateur).
2. Dans **Settings → Pages → Build and deployment → Source**, choisissez **GitHub Actions**.
3. Fusionnez les fichiers de ce jeu sur la branche par défaut `main`. Le workflow `.github/workflows/deploy.yml` se lance à chaque push sur `main`. Il peut également être lancé depuis **Actions → Publier sur GitHub Pages → Run workflow**.
4. Dans **Settings → Environments → github-pages**, autorisez la branche à déployer et approuvez le déploiement si une protection l’exige. Pour un lancement manuel depuis une autre branche, celle-ci doit être autorisée explicitement.
5. Vérifiez que le job de déploiement est vert et consultez son URL d’environnement. Ouvrez ensuite l’adresse dans une fenêtre sans connexion GitHub et vérifiez le chargement du CSS, du JavaScript et le démarrage du jeu.

Le workflow utilise les actions officielles Pages, épinglées par commit, et les permissions `contents: read`, `pages: write`, `id-token: write`. Seuls les trois fichiers du site sont publiés. Tous les chemins du site sont relatifs, compatibles avec `/jeu-space/`.

## Vérifications manuelles

Il n’existe pas d’infrastructure de tests ni de compilation dans ce dépôt. Pour vérifier une modification :

- Démarrer, déplacer le vaisseau, viser et tirer ; neutraliser les différents ennemis et vérifier les crédits et points.
- Subir un impact sur le vaisseau et sur une planète ; vérifier la santé, les maisons et la population.
- Construire avec et sans crédits suffisants ; attendre la croissance ; activer un bouclier.
- Mettre en pause et reprendre au bouton et au clavier ; vérifier que simulation et population restent figées.
- Ouvrir une destruction, annuler (aussi avec Échap), puis confirmer ; vérifier les pertes, le score et les statistiques.
- Perdre toutes les planètes ou la coque, terminer les six vagues, puis recommencer.
- Recharger pour vérifier le record ; tester avec stockage indisponible.
- Tester à petite largeur et sur un écran tactile : déplacement et tir simultanés, visée, boutons de colonies, absence de défilement involontaire sur les commandes.
- Consulter la console du navigateur et vérifier l’URL publique après un déploiement.