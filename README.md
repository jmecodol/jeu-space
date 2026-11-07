# Gardiens des planètes

Jeu spatial 2D en français, autonome, sans framework, compilation, backend ni ressources externes. Pilotez un vaisseau pour défendre Aurore, Céleste et Saphir, développer leurs colonies et survivre à **six vagues**.

## Jouer

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