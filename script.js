'use strict';

(() => {
  const $ = id => document.getElementById(id);
  // Les autres choix existent aussi : l’indice permet de choisir le sens attendu.
  const gap = (answer, clue, rule, ...wrong) => ({
    answer, clue, rule, options: [answer, ...wrong.map(([word]) => word)],
    jokes: Object.fromEntries(wrong)
  });
  const levels = [
    {
      name: 'CP',
      title: 'Pipo et le gâteau à roulettes',
      intro: 'Pipo, le petit dragon, veut porter un gâteau à Lila la souris. Ses ailes chatouillent la crème : il lui faut un chariot !',
      ending: 'Le gâteau arrive entier chez Lila ! Pipo reçoit une part et gare son chariot, avec une serviette comme drapeau.',
      phrases: [
        ['Pipo lit la recette du {0} pour Lila.', gap('gâteau', 'Il prépare une douceur pour le goûter.', 'Gâteau commence par g ; bateau commence par b ; râteau commence par r.', ['bateau', 'Pipo sort un moule en forme de barque, puis reprend la recette du goûter.'], ['râteau', 'Pipo met son tablier de jardinier, puis retrouve son tablier de cuisine.'])],
        ['Pipo met du {0} dans la pâte.', gap('lait', 'Il ajoute la boisson blanche de la vache.', 'Lait se termine par un t muet ; riz se termine par un z muet.', ['riz', 'Pipo prépare un gâteau à grains ; il garde le riz pour le dîner et reprend un bol.'], ['sel', 'Pipo imagine un goûter de soupe ; il repose la salière avant de verser.'])],
        ['Pipo verse la pâte dans un {0}.', gap('moule', 'Il choisit le plat qui donne sa forme au gâteau.', 'Moule contient ou ; bol contient o ; seau contient eau.', ['bol', 'Pipo prépare un gâteau tout rond ; il remet la pâte dans le plat prévu.'], ['seau', 'Pipo se voit pâtissier de plage ; il reprend son plat de cuisine.'])],
        ['Pipo pose le gâteau cuit sur un {0}.', gap('plat', 'Il choisit la grande assiette plate.', 'Plat finit par un t muet ; dans plate, on entend le t.', ['sac', 'Pipo sort son sac de promenade, puis le remplace par une assiette.'], ['lit', 'Pipo apporte un oreiller au gâteau, puis le remet dans la chambre.'])],
        ['Pipo fixe une {0} au chariot du gâteau.', gap('roue', 'Cette pièce ronde tourne pour faire rouler le chariot.', 'Roue finit par un e muet ; rose contient un s qui se prononce comme z.', ['cloche', 'Pipo obtient un chariot qui fait ding ; il retire la cloche et cherche la pièce ronde.'], ['rose', 'Pipo décore son chariot avant de le réparer ; il met la fleur dans un vase.'])],
        ['Pipo attache une {0} au chariot pour le tirer.', gap('corde', 'Il lui faut un gros fil solide à tenir dans sa patte.', 'Dans corde, on entend le d ; dans corne, on entend le n.', ['corne', 'Pipo essaie une poignée de déguisement, puis la range avec ses costumes.'], ['plume', 'Pipo chatouille le chariot avec sa poignée ; il rend la plume au coussin.'])],
        ['Pipo prend son {0} pour trouver la maison de Lila.', gap('plan', 'Il regarde le dessin des rues.', 'Plan finit par un n ; plant, la jeune plante, finit par nt.', ['plant', 'Pipo consulte une petite tomate qui ne montre aucune rue ; il la remet au soleil.'], ['pain', 'Pipo cherche la rue des tartines sur sa baguette, puis la range pour le goûter.'])],
        ['Pipo passe sur le {0} avec son chariot.', gap('pont', 'Il traverse le ruisseau par le passage construit au-dessus de l’eau.', 'Pont finit par un t muet ; rond finit par un d muet.', ['tapis', 'Pipo roule sur son tapis de pique-nique ; il le replie et rejoint le ruisseau.'], ['rond', 'Pipo suit un rond dessiné au sol et revient au départ ; un demi-tour suffit.'])],
        ['Pipo frappe à la {0} de Lila avec sa patte.', gap('porte', 'Il annonce son arrivée sur le panneau qui ferme l’entrée.', 'Porte contient le son t ; table contient les sons bl ; botte a deux t.', ['table', 'Pipo joue du tambour sur la table du jardin, puis rejoint l’entrée.'], ['botte', 'Pipo fait toc-toc sur une chaussure ; il la repose à côté du paillasson.'])],
        ['Pipo coupe une {0} du gâteau pour Lila.', gap('part', 'Il sert un morceau du gâteau arrivé chez son amie.', 'Part finit par un t muet ; on entend ce t dans partager.', ['rose', 'Pipo prépare un bouquet miniature ; il repose les ciseaux et reprend le couteau à gâteau.'], ['ficelle', 'Pipo prépare un ruban de fête ; il le garde pour le paquet et sert le goûter.'])]
      ],
      scenes: [
        { before: 'Pipo a promis un goûter à Lila ; il ouvre son livre de recettes.', after: 'La recette du gâteau est ouverte. Pipo peut préparer la pâte.', icon: '📖', souvenir: 'Recette trouvée' },
        { before: 'La recette est ouverte ; Pipo a déjà mis la farine dans un bol.', after: 'Le lait rejoint la farine. La pâte est prête à être versée.', icon: '🥛', souvenir: 'Pâte préparée' },
        { before: 'La pâte est prête ; Pipo cherche le bon plat pour la cuisson.', after: 'La pâte remplit le moule. Un adulte met le gâteau au four et le ressort cuit.', icon: '🥣', souvenir: 'Gâteau cuit' },
        { before: 'Le gâteau a refroidi dans son moule ; Pipo prépare son support de voyage.', after: 'Le gâteau repose sur un plat. Il manque une roue au petit chariot.', icon: '🍰', souvenir: 'Gâteau démoulé' },
        { before: 'Le plat attend ; Pipo répare le chariot avant de le charger.', after: 'La roue tourne et le plat est posé sur le chariot. Il faut une poignée pour tirer.', icon: '🛞', souvenir: 'Chariot réparé' },
        { before: 'Le gâteau est chargé sur le chariot réparé ; Pipo cherche de quoi le tirer.', after: 'La corde est nouée. Pipo peut partir dès qu’il connaît la route.', icon: '🪢', souvenir: 'Corde attachée' },
        { before: 'La corde est prête ; Pipo cherche le chemin de chez Lila.', after: 'Le plan montre un pont, puis la maison de Lila. Pipo rejoint le ruisseau.', icon: '🗺️', souvenir: 'Chemin repéré' },
        { before: 'Le plan a conduit Pipo au ruisseau ; le gâteau attend de traverser.', after: 'Pipo et le chariot traversent le pont. La maison de Lila est juste devant eux.', icon: '🌉', souvenir: 'Pont traversé' },
        { before: 'Le pont est derrière eux ; Pipo doit signaler son arrivée à Lila.', after: 'Lila ouvre la porte et aide Pipo à poser le gâteau sur la table.', icon: '🚪', souvenir: 'Livraison réussie' },
        { before: 'Lila a installé le gâteau sur la table ; Pipo prépare le partage.', after: 'Lila reçoit sa part, puis sert Pipo. Le chariot peut enfin se reposer !', icon: '🎂', souvenir: 'Goûter partagé' }
      ]
    },
    {
      name: 'CE1',
      title: 'Pipo et le bateau des chaussettes',
      intro: 'Après le goûter, Lila confie à Pipo, le petit dragon, les chaussettes propres du phare. Pour les livrer, ils doivent remettre un vieux bateau en état.',
      ending: 'Les chaussettes sèchent au phare comme de minuscules drapeaux. Pipo reçoit une paire à pois pour ses grandes pattes : mission douillette !',
      phrases: [
        ['Pipo cherche le {0} pour embarquer les chaussettes.', gap('port', 'Il cherche le lieu où les bateaux s’arrêtent.', 'Port, le lieu des bateaux, finit par t ; porc, le cochon, finit par c.', ['porc', 'Pipo demande un quai à un cochon ; il lui fait coucou puis reprend sa carte.'], ['pot', 'Pipo trouve un port pour une seule chaussette dans un pot de fleurs ; il repart vers l’eau.'])],
        ['Au port, Pipo prend un {0} pour nettoyer le bateau.', gap('balai', 'Il veut enlever la poussière avec une brosse à long manche.', 'Balai est l’outil ; ballet est une danse. Ces mots se prononcent pareil.', ['ballet', 'Pipo répète trois pas de danse sur le quai ; il salue puis reprend le ménage.'], ['ballon', 'Pipo lance un ballon dans sa corbeille de ménage ; il le range avant de brosser.'])],
        ['Pipo apporte du {0} pour remplacer la planche du bateau.', gap('bois', 'Il lui faut la matière des planches.', 'Bois désigne une matière ; poids, une masse ; pois, un légume.', ['poids', 'Pipo apporte du lest alors qu’il manque une planche ; il remet les poids sur le quai.'], ['riz', 'Pipo prévoit un bateau façon risotto ; il remet le riz dans son sac.'])],
        ['Pipo prend un {0} pour vider l’eau du bateau réparé.', gap('seau', 'Il utilise un récipient muni d’une anse.', 'Seau contient de l’eau ; sceau désigne une marque officielle ; saut vient de sauter.', ['sceau', 'Pipo tamponne un papier « bateau mouillé » ; il le met au sec et cherche le récipient.'], ['dé', 'Pipo commence un minuscule service de soupe à l’eau ; il repose le dé à coudre.'])],
        ['Pipo fixe une {0} au mât du bateau sec.', gap('voile', 'Le vent doit gonfler cette grande pièce de tissu.', 'Voile s’écrit avec oi ; poêle s’écrit avec oê et sert à cuisiner.', ['poêle', 'Pipo prépare un mât à crêpes ; il décroche la poêle et la rend à la cuisine.'], ['toile d’araignée', 'Pipo installe une voile miniature pour araignée ; il la remet entre deux branches.'])],
        ['Avant de partir, Pipo {0} les chaussettes dans une boîte.', gap('met', 'Il les place dans la boîte, sans les retirer ni les compter.', 'Met vient de mettre ; mets s’emploie avec je ou tu ; mais relie des idées.', ['compte', 'Pipo recompte les chaussettes comme des moutons ; il termine son inventaire puis les range.'], ['cherche', 'Pipo joue à cache-cache avec les chaussettes déjà devant lui ; il ouvre enfin la boîte.'])],
        ['Pipo pose la boîte {0} le banc du bateau.', gap('sous', 'La boîte doit être en dessous du siège pour rester à l’abri des gouttes.', 'Sous s’écrit avec ou et un s final muet ; sur s’écrit avec u et un r prononcé.', ['sur', 'Pipo offre aux chaussettes une place de capitaine ; il les redescend sous le siège.'], ['devant', 'Pipo doit contourner sa boîte à chaque pas ; il la glisse sous le banc.'])],
        ['Pipo {0} la carte pour naviguer jusqu’au phare.', gap('a', 'Il possède la carte : on pourrait dire « avait la carte ».', 'A sans accent vient du verbe avoir ; à avec accent indique souvent un lieu.', ['plie', 'Pipo fabrique un accordéon en papier ; il le déplie pour retrouver le phare.'], ['dessine', 'Pipo ajoute une moustache au soleil de sa nouvelle carte ; il reprend la carte du trajet.'])],
        ['Au phare, Pipo noue la {0} du bateau à un anneau.', gap('corde', 'Il attache le bateau avec un lien souple et solide.', 'Corde contient d ; corne contient n : une lettre change l’objet.', ['corne', 'Pipo essaie d’amarrer son bateau avec une corne de déguisement ; il la retire.'], ['cravate', 'Pipo donne une tenue de fête au bateau ; il récupère sa cravate et prend le bon lien.'])],
        ['Pipo {0} les chaussettes propres au gardien du phare.', gap('donne', 'Il les remet au gardien, comme promis au départ.', 'Donne s’écrit avec deux n ; avec Pipo, ce verbe se termine par e.', ['montre', 'Pipo organise une exposition de chaussettes ; il ferme le musée et remet la boîte.'], ['réclame', 'Pipo joue au client de la boutique des chaussettes ; il reprend son rôle de livreur.'])]
      ],
      scenes: [
        { before: 'Lila attend avec le linge propre ; Pipo cherche où trouver un bateau.', after: 'Le port est trouvé. Un bateau disponible attend un bon nettoyage.', icon: '⚓', souvenir: 'Port trouvé' },
        { before: 'Au port, Pipo découvre un bateau poussiéreux et une planche à remplacer.', after: 'Le balai enlève la poussière. La planche abîmée est maintenant bien visible.', icon: '🧹', souvenir: 'Pont nettoyé' },
        { before: 'Le pont est propre ; Pipo mesure la planche à remplacer.', after: 'Une planche de bois neuve ferme le trou. Il reste à vider l’eau entrée auparavant.', icon: '🪵', souvenir: 'Coque réparée' },
        { before: 'Le trou est bouché ; une flaque reste au fond du bateau.', after: 'Le seau vide la flaque. Le bateau sec attend sa voile.', icon: '🪣', souvenir: 'Bateau au sec' },
        { before: 'Le bateau est sec ; Lila tient le mât pendant que Pipo prépare le tissu.', after: 'La voile est fixée. Pipo peut charger les chaussettes.', icon: '⛵', souvenir: 'Voile hissée' },
        { before: 'La voile est prête ; les chaussettes propres attendent encore sur le quai.', after: 'Toutes les chaussettes sont dans la boîte. Pipo cherche une place à l’abri.', icon: '📦', souvenir: 'Linge emballé' },
        { before: 'La boîte est pleine ; Pipo veut la protéger pendant la traversée.', after: 'La boîte est calée sous le banc. Lila monte à bord ; il faut choisir la route.', icon: '🧦', souvenir: 'Cargaison protégée' },
        { before: 'Le linge est à l’abri ; Pipo vérifie qu’il possède de quoi trouver le phare.', after: 'Pipo a la carte et suit le trajet avec Lila. Ils arrivent au quai du phare.', icon: '🗺️', souvenir: 'Traversée réussie' },
        { before: 'Le phare est atteint ; Pipo doit amarrer le bateau avant de décharger.', after: 'La corde retient le bateau au quai. Pipo sort la boîte de dessous le banc.', icon: '🪢', souvenir: 'Bateau amarré' },
        { before: 'Le bateau est amarré ; le gardien attend la boîte de linge sur le quai.', after: 'Le gardien reçoit ses chaussettes et offre une paire à pois à Pipo.', icon: '🗼', souvenir: 'Chaussettes livrées' }
      ]
    },
    {
      name: 'CE2',
      title: 'Pipo et le jardin du phare',
      intro: 'Au pied du phare, Pipo, le petit dragon, et Lila découvrent un jardin oublié. Ils veulent y organiser un pique-nique pour remercier le gardien.',
      ending: 'Le jardin accueille son premier pique-nique. Pipo baptise son banc « Le Repos des Chaussettes » et le gardien lui confie une graine pour demain.',
      phrases: [
        ['Pipo dessine le {0} du jardin avant le pique-nique.', gap('plan', 'Il représente les allées et les emplacements sur du papier.', 'Plan est un dessin ; plant est une jeune plante. Le t de plant est muet.', ['plant', 'Pipo fait le portrait d’une pousse en lui ajoutant des lunettes ; il tourne la page.'], ['flan', 'Pipo dessine un dessert avec des allées en caramel ; il réserve cette idée au menu.'])],
        ['Sur son plan, Pipo réserve un {0} pour les salades.', gap('champ', 'Il prévoit un terrain cultivé, et non une chanson ni un siège.', 'Champ, le terrain, et chant, la chanson, sont homophones ; leurs lettres finales changent.', ['chant', 'Pipo prévoit un refrain pour chaque laitue ; il garde la chanson pour la fête.'], ['banc', 'Pipo dessine un salon de salades ; il déplace le siège près de la table.'])],
        ['Pipo prépare {0} outils pour semer dans le terrain choisi.', gap('ses', 'Ce sont les outils qui lui appartiennent ; le mot doit indiquer cette possession.', 'Ses marque la possession ; ces sert à désigner ; les ne précise pas le propriétaire.', ['ces', 'Pipo montre les outils de Lila comme un présentateur ; il reprend ensuite les siens.'], ['les', 'Pipo ouvre un magasin de tous les outils ; il referme la boutique et choisit son matériel.'])],
        ['Pipo {0} les graines dans la terre préparée.', gap('sème', 'Il dépose des graines pour les faire pousser.', 'Sème vient de semer et porte un accent grave ; crème commence par cr.', ['crème', 'Pipo offre un soin de beauté aux graines ; il range le pot de crème avant de semer.'], ['compte', 'Pipo fait l’appel des graines une par une ; il termine le calcul puis ouvre le sachet.'])],
        ['Après avoir semé, Pipo travaille {0} ses gants pour arroser.', gap('avec', 'Il garde ses gants sur les pattes pendant l’arrosage.', 'Avec indique la présence ; sans indique l’absence ; ne pas les confondre change le sens.', ['sans', 'Pipo met ses gants en vacances sur le banc ; il les renfile avant l’arrosage.'], ['devant', 'Pipo aligne ses gants comme deux spectateurs ; il les récupère pour travailler.'])],
        ['Pour laisser pousser les salades, Pipo {0} dans la terre humide.', gap('ne marche pas', 'Il évite complètement de poser les pattes sur la terre semée.', 'Ne… pas encadre le verbe et exprime une négation.', ['marche', 'Pipo imagine un défilé de bottes entre les graines ; il reste finalement dans l’allée.'], ['ne danse que', 'Pipo réserve la terre à son ballet de jardinier ; il déplace la scène dans l’allée.'])],
        ['Les salades ont poussé ; Pipo place le panier {0} la table.', gap('sur', 'Il pose le panier au-dessus du plateau, en contact avec lui.', 'Sur finit par r ; sous finit par s. Ces mots indiquent des positions différentes.', ['sous', 'Pipo prépare un pique-nique pour les chaussures ; il remonte le panier sur le plateau.'], ['derrière', 'Pipo organise un cache-cache du panier ; il le remet bien en vue.'])],
        ['Pipo apporte du {0} pour accompagner les salades du panier.', gap('pain', 'Il ajoute une baguette à partager au repas.', 'Pain se mange ; pin est un arbre ; bain désigne le fait de se baigner.', ['pin', 'Pipo propose un pique-nique sous un arbre de poche ; il remet le petit pin dans son pot.'], ['bain moussant', 'Pipo prépare une salle de bains pour les laitues ; il range le flacon loin du repas.'])],
        ['Près de la table prête, Pipo utilise sa {0} pour appeler le gardien.', gap('voix', 'Il appelle en parlant, sans emprunter une route ni jouer de musique.', 'Voix sert à parler ; voie est un passage. Ces deux noms sont homophones.', ['voie', 'Pipo aménage une allée d’invitation ; il y ajoute ensuite son appel de vive voix.'], ['flûte', 'Pipo joue trois notes de concert ; il range sa flûte et précise que le repas est prêt.'])],
        ['Pipo annonce au gardien : « {0} »', gap('C’est prêt !', 'Il annonce que le pique-nique est préparé, sans demander ni nier.', 'C’est signifie cela est ; le point d’exclamation marque ici une annonce enthousiaste, le point d’interrogation une question.', ['C’est prêt ?', 'Pipo demande la permission au panier ; il vérifie la table puis annonce le repas.'], ['Ce n’est pas prêt !', 'Pipo remet symboliquement le pique-nique en préparation ; il retourne la pancarte et invite le gardien.'])]
      ],
      scenes: [
        { before: 'Le gardien prête son jardin ; Pipo et Lila doivent organiser le futur pique-nique.', after: 'Le plan situe les allées et la table. Il reste à choisir où cultiver les salades.', icon: '🗺️', souvenir: 'Jardin dessiné' },
        { before: 'Le plan est tracé ; Pipo réserve un espace pour les futures salades.', after: 'Un petit champ est prévu. Pipo rassemble son matériel de jardinage.', icon: '🌱', souvenir: 'Terrain choisi' },
        { before: 'Le terrain est choisi ; Pipo distingue ses outils de ceux de Lila.', after: 'Pipo retrouve ses outils et ameublit la terre. Les graines attendent leur tour.', icon: '🧰', souvenir: 'Terre préparée' },
        { before: 'La terre est souple ; Pipo ouvre le sachet de graines de salade.', after: 'Les graines sont semées et recouvertes. Il faut maintenant les arroser.', icon: '🌾', souvenir: 'Graines semées' },
        { before: 'Les graines sont en terre ; Pipo prend son arrosoir en gardant ses gants.', after: 'Les semis sont arrosés. Une allée permet de revenir sans marcher dessus.', icon: '💧', souvenir: 'Semis arrosés' },
        { before: 'La terre arrosée attend ; Pipo doit la laisser tranquille pendant la croissance.', after: 'Pipo reste dans l’allée. Après plusieurs semaines de soins, Lila récolte de belles salades.', icon: '🥬', souvenir: 'Salades récoltées' },
        { before: 'Lila a lavé les salades récoltées ; Pipo apporte leur panier à la table.', after: 'Le panier repose sur la table. Il manque du pain pour compléter le repas.', icon: '🧺', souvenir: 'Table garnie' },
        { before: 'Les salades sont sur la table ; Pipo complète le menu du pique-nique.', after: 'Une baguette rejoint le panier. Le gardien peut maintenant être invité.', icon: '🥖', souvenir: 'Menu complété' },
        { before: 'Le repas est complet ; le gardien range encore ses outils près du phare.', after: 'La voix de Pipo attire son attention. Le gardien demande si tout est prêt.', icon: '📣', souvenir: 'Gardien appelé' },
        { before: 'Le gardien a entendu Pipo ; il attend sa réponse pour venir à table.', after: 'Pipo confirme que tout est prêt. Le gardien rejoint Lila et le pique-nique commence.', icon: '🍽️', souvenir: 'Pique-nique ouvert' }
      ]
    },
    {
      name: 'CM1',
      title: 'Pipo et la poste des nuages',
      intro: 'Pendant le pique-nique, le gardien confie à Pipo, le petit dragon, une invitation pour Nino le hibou. Nino habite le nuage voisin : il faut préparer un ballon postal.',
      ending: 'Nino reçoit son invitation et promet de venir au prochain pique-nique. Pipo obtient le premier timbre « Livraison en chaussettes », à coller dans son journal.',
      phrases: [
        ['Pipo {0} pour livrer l’invitation sur le nuage.', gap('a un plan', 'Il possède une idée de trajet et de transport, pas une jeune plante.', 'A vient d’avoir ; à porte un accent. Plan, le projet, se distingue de plant, la jeune plante.', ['a un plant', 'Pipo présente une tomate comme véhicule postal ; il la replante avant le départ.'], ['est à plat', 'Pipo s’allonge pour jouer l’enveloppe ; il se relève pour préparer son voyage.'])],
        ['Pipo demande {0} pour construire le panier du ballon.', gap('deux mètres de tissu', 'Il faut une longueur de deux mètres, pas des enseignants ni du ruban.', 'Mètre mesure une longueur ; maître désigne notamment un enseignant : ce sont des homophones.', ['deux maîtres de couture', 'Pipo ouvre une école volante ; il remercie ses professeurs et reprend ses mesures.'], ['deux mètres de ruban', 'Pipo prépare un panier tout en nœuds décoratifs ; il garde le ruban pour l’emballage.'])],
        ['Pour finir son panier, Pipo commande {0}.', gap('une vis', 'Il lui manque une petite pièce métallique à tourner pour fixer la poignée.', 'Vis s’écrit avec un s qui se prononce ; vie finit par un e muet et désigne une existence.', ['une vie', 'Pipo commande une carrière entière de facteur ; il reporte l’inscription après la livraison.'], ['une visière', 'Pipo habille le panier d’une casquette ; il retire la visière et termine la poignée.'])],
        ['Pipo prépare {0} pour lester le ballon.', gap('des petits poids', 'Il faut de petites masses lourdes, pas des légumes ni des oiseaux.', 'Poids finit par ds ; pois, le légume, finit par s. Ces noms sont homophones.', ['des petits pois', 'Pipo prépare une salade de lest ; il remet les légumes dans leur boîte à goûter.'], ['des petits roitelets', 'Pipo recrute des oiseaux facteurs ; il les laisse chanter et cherche son lest.'])],
        ['Pipo vérifie le message : « Nino, viens {0} au jardin du phare. »', gap('bientôt', 'L’invitation demande une visite dans peu de temps, sans demander une heure matinale ni des visites fréquentes.', 'Bientôt, en un mot, signifie dans peu de temps ; bien tôt, en deux mots, signifie très tôt.', ['bien tôt', 'Pipo prépare une table de petit déjeuner au lever du soleil ; il range le réveil et précise simplement que la visite approche.'], ['bien souvent', 'Pipo prépare un abonnement aux pique-niques ; il range le calendrier pour proposer une seule visite.'])],
        ['Pipo ajoute {0} au ballon pour atteindre le nuage.', gap('davantage de gaz', 'Il augmente la quantité du gaz de gonflage, sans ajouter de décoration.', 'Davantage, en un mot, signifie plus ; d’avantages désigne des bénéfices.', ['des avantages pour les passagers', 'Pipo promet des coussins gratuits au panier ; il range sa publicité et règle le gonflage.'], ['davantage de rubans', 'Pipo transforme le ballon en cadeau géant ; il défait quelques nœuds et reprend le gonflage.'])],
        ['Ballon gonflé et lettre chargée, Pipo annonce : « {0} »', gap('Je suis prêt à partir.', 'Il se dit préparé pour le départ, sans parler de distance ni de retard.', 'Prêt signifie préparé ; près indique la proximité. Ici, à introduit le verbe partir.', ['Je suis près du départ.', 'Pipo se place juste à côté de la pancarte « départ » ; il revient vérifier ses bagages.'], ['Je suis en retard.', 'Pipo consulte une montre dessinée sur sa patte ; il efface les aiguilles et annonce ses préparatifs terminés.'])],
        ['Après le décollage, Pipo veut {0} pour naviguer vers Nino.', gap('voir plus loin', 'Il cherche à distinguer un repère éloigné, sans boire ni se déplacer sur le côté.', 'Voir signifie regarder ; voire signifie et même. L’infinitif suit ici veut.', ['boire plus tard', 'Pipo programme une pause gourde ; il la remet après le repérage du nuage.'], ['virer à droite', 'Pipo prévoit un détour pour saluer un cerf-volant ; il reprend le cap du nuage.'])],
        ['Arrivé au nuage de Nino, Pipo annonce : « {0} »', gap('Je ne monte plus.', 'Son ascension s’arrête maintenant, sans supprimer tous ses déplacements.', 'Ne… plus marque l’arrêt ; ne… que exprime une restriction et non une négation totale.', ['Je monte davantage.', 'Pipo prévoit un étage de nuages de plus ; il corrige sa commande avant de dépasser Nino.'], ['Je ne monte que le matin.', 'Pipo établit un horaire d’ascenseur ; il range le planning et arrête son ascension.'])],
        ['Devant Nino, Pipo sort {0} du sac postal.', gap('l’invitation', 'Il remet la lettre qui propose au hibou de venir au pique-nique.', 'L’apostrophe remplace le a de la devant invitation ; il n’y a pas d’espace après cette apostrophe.', ['l’invention', 'Pipo présente un ouvre-lettres à plumes ; il le range pour chercher le vrai courrier.'], ['la facture', 'Pipo improvise une caisse de magasin ; il range le reçu et retrouve la lettre de fête.'])]
      ],
      scenes: [
        { before: 'Le gardien remet une invitation à Pipo ; le destinataire vit sur un nuage.', after: 'Pipo imagine un ballon postal. Lila l’aide à préparer le panier.', icon: '💡', souvenir: 'Projet postal' },
        { before: 'Le projet est décidé ; Pipo doit fabriquer un panier assez solide pour lui et la lettre.', after: 'Le tissu mesuré devient un panier renforcé. Il reste à fixer sa poignée.', icon: '🧵', souvenir: 'Panier cousu' },
        { before: 'Le panier est cousu ; une poignée attend sa fixation sur le bord.', after: 'La vis fixe la poignée. Le panier est attaché au ballon et attend son lest.', icon: '🔩', souvenir: 'Poignée fixée' },
        { before: 'Le ballon et le panier sont assemblés ; Pipo prépare de quoi régler leur équilibre.', after: 'Les petits poids sont répartis. Pipo vérifie maintenant le courrier avant le gonflage.', icon: '⚖️', souvenir: 'Lest préparé' },
        { before: 'Le lest est prêt ; Pipo relit l’adresse et le message de l’invitation.', after: 'Le message propose une visite prochaine au jardin du phare. Pipo ferme l’enveloppe et prépare le gaz.', icon: '✉️', souvenir: 'Message vérifié' },
        { before: 'L’enveloppe est fermée ; le ballon n’est pas encore assez gonflé pour monter.', after: 'Le gaz supplémentaire gonfle le ballon. Pipo charge la lettre dans le panier encore amarré.', icon: '🎈', souvenir: 'Ballon gonflé' },
        { before: 'La lettre est chargée ; Pipo termine ses vérifications avant de quitter le sol.', after: 'Pipo est prêt. Lila détache l’amarre et le ballon décolle doucement.', icon: '👋', souvenir: 'Départ réussi' },
        { before: 'Le ballon a décollé ; Pipo cherche un repère pour choisir le bon nuage.', after: 'Avec sa longue-vue, Pipo repère le perchoir de Nino et rejoint son nuage.', icon: '🔭', souvenir: 'Nuage repéré' },
        { before: 'Le perchoir est à la bonne hauteur ; Pipo doit cesser de monter.', after: 'Pipo règle le ballon pour rester à hauteur du perchoir. Nino ouvre son guichet postal.', icon: '☁️', souvenir: 'Arrivée stabilisée' },
        { before: 'Le ballon est stabilisé devant le guichet ; Pipo cherche la lettre dans son sac.', after: 'Nino reçoit l’invitation et promet sa visite. Il remet à Pipo un timbre souvenir.', icon: '🦉', souvenir: 'Invitation remise' }
      ]
    },
    {
      name: 'CM2',
      title: 'Pipo et le spectacle à virgules',
      intro: 'De retour au phare avec Nino, Pipo, le petit dragon, prépare un spectacle pour le prochain pique-nique. Lila dirige les répétitions : une virgule peut changer tout le programme !',
      ending: 'Le rideau tombe sur une pluie de confettis en papier. Pipo, Lila et Nino saluent : du gâteau au spectacle, chaque aventure a trouvé sa place dans le journal.',
      phrases: [
        ['Pour commencer les préparatifs, Pipo annonce à Lila : « {0} »', gap('On prépare le spectacle, Lila !', 'Il appelle Lila et propose de préparer un spectacle, pas de préparer Lila.', 'La virgule détache Lila, la personne à qui Pipo s’adresse ; elle ne fait pas partie du complément le spectacle.', ['On prépare le spectacle de Lila !', 'Pipo attribue tout le programme à Lila ; il partage ensuite l’affiche entre les trois amis.'], ['On prépare Lila pour le spectacle !', 'Pipo apporte une montagne de chapeaux à Lila ; il les range pour installer la scène.'])],
        ['Pour installer le rideau, Pipo précise : « {0} »', gap('Nino, apporte la corde !', 'Pipo s’adresse directement à Nino et lui donne une consigne, sans annoncer une action accomplie.', 'La virgule isole le destinataire ; apporte est ici un impératif. Nino apporte est une déclaration.', ['Nino apporte la corde.', 'Pipo commente comme un journaliste pendant que Nino attend la consigne ; il reprend son rôle de metteur en scène.'], ['Nino, emporte la corde !', 'Pipo voit sa corde repartir en tournée ; il rappelle Nino avant le montage.'])],
        ['Le rideau monté, Pipo lit la liste : « {0} »', gap('Il ne manque que les chapeaux.', 'Les chapeaux sont les seuls accessoires encore absents.', 'Ne… que signifie seulement ; ne… rien nie tout manque ; ne… pas nie le manque de l’objet cité.', ['Il ne manque rien.', 'Pipo ouvre une réserve imaginaire de chapeaux invisibles ; il revient vérifier la vraie étagère.'], ['Il ne manque pas les chapeaux.', 'Pipo désigne un portemanteau vide comme une collection ; il corrige la liste et part chercher les chapeaux.'])],
        ['Les chapeaux trouvés, Pipo précise à Lila : « {0} »', gap('Je n’en porte qu’un.', 'Il porte exactement un chapeau, ni zéro ni toute la collection.', 'Ne… que limite la quantité ; ne… aucun indique zéro.', ['Je n’en porte aucun.', 'Pipo salue tête nue alors que son chapeau attend ; il le remet pour la répétition.'], ['Je les porte tous.', 'Pipo prépare une tour de chapeaux sur sa tête ; il la démonte et n’en garde qu’un.'])],
        ['Coiffé pour son numéro, Pipo demande à Nino : « {0} »', gap('Tu peux ouvrir le rideau ?', 'Il pose une question pour demander l’ouverture, sans l’annoncer ni demander la fermeture.', 'Le point d’interrogation transforme ici la phrase déclarative en question.', ['Tu peux ouvrir le rideau.', 'Pipo donne un bulletin de capacités à Nino ; il le range et formule sa demande.'], ['Tu peux fermer le rideau ?', 'Pipo prévoit un spectacle derrière du tissu ; il rectifie sa demande avant le début.'])],
        ['Rideau ouvert, Pipo explique son numéro : « {0} »', gap('Je fais rire les chapeaux rouges.', 'Il amuse les personnages qui portent des chapeaux rouges, sans s’adresser aux chapeaux.', 'Sans virgule, les chapeaux rouges est le complément de fais rire ; avec une virgule, ce groupe devient un appel.', ['Je fais rire, les chapeaux rouges !', 'Pipo parle aux chapeaux comme à un public ; il les repose sur les têtes des comédiens.'], ['Je fais les chapeaux rouges.', 'Pipo ouvre un atelier de couture au milieu de la scène ; il range son fil et reprend son numéro comique.'])],
        ['Après le numéro comique, Pipo annonce : « {0} »', gap('Je ne chante plus.', 'Il cesse de chanter maintenant, sans annoncer une simple baisse du volume.', 'Ne… plus indique l’arrêt ; ne… que limite les conditions de l’action.', ['Je ne chante que doucement.', 'Pipo programme un rappel en chuchotant ; il remet ce couplet à une autre fête.'], ['Je chante encore.', 'Pipo prépare un refrain supplémentaire ; il referme son carnet pour laisser la place à Nino.'])],
        ['Pour le duo silencieux suivant, Pipo précise à Nino : « {0} »', gap('Personne ne parle.', 'Ni Pipo ni Nino ne doit parler pendant ce numéro.', 'Personne… ne nie toute personne ; seul réserve l’action à une personne ; tout le monde inclut chacun.', ['Seul Nino parle.', 'Pipo installe une interview de hibou au milieu du mime ; il range le micro pour reprendre le silence.'], ['Tout le monde parle.', 'Pipo imagine un chœur de conversations ; il referme les bulles de parole de son décor.'])],
        ['Le mime terminé, Pipo lit le programme : « {0} »', gap('Après le salut, nous lançons les confettis.', 'Le salut vient d’abord ; les confettis viennent ensuite.', 'Après et avant inversent l’ordre des actions ; la virgule sépare le complément placé en tête.', ['Avant le salut, nous lançons les confettis.', 'Pipo prépare son salut sous un parapluie de papier ; il repose le parapluie et remet les actions dans l’ordre.'], ['Après les confettis, nous saluons.', 'Pipo répète le final à l’envers ; il remet les papiers dans le panier pour recommencer.'])],
        ['Après le salut et les confettis, Pipo conclut : « {0} »', gap('Merci, Lila et Nino !', 'Il remercie directement ses deux compagnons, sans annoncer que ce sont eux qui remercient.', 'La virgule détache les destinataires du remerciement ; le verbe remercier change qui accomplit l’action.', ['Lila et Nino remercient Pipo !', 'Pipo se retrouve seul sous les applaudissements ; il rappelle ses amis pour partager le salut.'], ['Merci, le rideau !', 'Pipo remercie le tissu avec une révérence ; il se tourne ensuite vers ses deux compagnons.'])]
      ],
      scenes: [
        { before: 'Nino a rejoint le phare ; Pipo veut proposer un spectacle à ses deux amis.', after: 'Lila accepte et dessine la scène. Pour installer le rideau, il manque une corde.', icon: '🎭', souvenir: 'Troupe réunie' },
        { before: 'La scène est dessinée ; Nino attend de savoir quel matériel apporter.', after: 'Nino apporte la corde. Les trois amis montent le rideau et vérifient les accessoires.', icon: '🪢', souvenir: 'Rideau monté' },
        { before: 'Le rideau est fixé ; Pipo compare les accessoires à sa liste.', after: 'Seuls les chapeaux manquent. Lila les retrouve sur l’étagère et les apporte.', icon: '📋', souvenir: 'Accessoires réunis' },
        { before: 'Lila a retrouvé les chapeaux ; Pipo choisit combien en porter pour son numéro.', after: 'Pipo met un seul chapeau. Les amis se placent derrière le rideau pour la répétition.', icon: '🎩', souvenir: 'Costume choisi' },
        { before: 'Les costumes sont prêts ; Nino attend le signal de Pipo au bord du rideau.', after: 'Nino répond oui et ouvre le rideau. Les comédiens aux chapeaux rouges prennent place.', icon: '👐', souvenir: 'Répétition ouverte' },
        { before: 'Le rideau est ouvert ; Pipo présente son numéro aux comédiens coiffés de rouge.', after: 'Les comédiens rient des grimaces de Pipo. Il termine son numéro par une petite chanson.', icon: '😄', souvenir: 'Rires partagés' },
        { before: 'La chanson conclut le numéro comique ; Pipo doit s’arrêter pour passer au mime.', after: 'Pipo cesse de chanter. Nino le rejoint pour leur duo silencieux.', icon: '🎵', souvenir: 'Chanson terminée' },
        { before: 'Nino a rejoint Pipo ; leur duo de mime doit se dérouler sans aucune parole.', after: 'Les deux amis miment une chaussette qui danse. Le duo terminé, ils préparent le final.', icon: '🤫', souvenir: 'Mime réussi' },
        { before: 'Le mime est terminé ; Lila attend l’ordre exact du salut et des confettis.', after: 'La troupe répète le salut, puis lance les confettis. Tout est prêt pour jouer devant le gardien.', icon: '🎉', souvenir: 'Final réglé' },
        { before: 'Le spectacle a été joué devant le gardien ; le salut et les confettis ont clos le final.', after: 'Pipo remercie Lila et Nino. Les trois amis saluent encore ensemble, puis ramassent les confettis pour la prochaine fête.', icon: '👏', souvenir: 'Spectacle accompli' }
      ]
    }
  ];

  let levelIndex = 0, phraseIndex = 0, activeGap = null;
  let solved = new Set(), mistakes = 0, firstTry = 0, phraseMistakes = 0;
  let sound = true, audio = null;
  let history = [];
  const phrase = () => levels[levelIndex].phrases[phraseIndex];
  const scene = () => levels[levelIndex].scenes[phraseIndex];

  function illustrate(kind, caption) {
    $('scene').className = `scene ${kind}`;
    $('scene-icon').textContent = kind === 'mishap' ? '🫧' : kind === 'success' ? `✨ ${scene().icon}` : scene().icon;
    $('scene-caption').textContent = caption;
    $('hero-mouth').setAttribute('d', kind === 'mishap' ? 'M116 88Q124 78 132 88Q124 100 116 88' : 'M111 86Q123 99 138 88');
    $('hero-title').textContent = kind === 'mishap' ? 'Pipo est surpris par une mésaventure. Tu peux l’aider à la réparer.' : 'Pipo, le petit dragon, continue son aventure avec toi.';
  }

  function renderJourney() {
    $('story-path').replaceChildren();
    for (let i = 0; i < 10; i++) {
      const marker = document.createElement('li');
      marker.textContent = i < history.length ? '✓' : i + 1;
      marker.className = i < history.length ? 'done' : '';
      marker.setAttribute('aria-label', `Étape ${i + 1} : ${i < history.length ? 'réussie' : i === phraseIndex ? 'en cours' : 'à débloquer'}`);
      if (i === phraseIndex && history.length < 10) marker.setAttribute('aria-current', 'step');
      $('story-path').append(marker);
    }
    $('journal-count').textContent = `${history.length} / 10`;
    $('journal').replaceChildren();
    history.forEach(entry => {
      const item = document.createElement('li');
      item.textContent = `${entry.icon} ${entry.souvenir} — ${entry.after}`;
      $('journal').append(item);
    });
  }

  function tone(correct) {
    if (!sound) return;
    try {
      const Audio = window.AudioContext || window.webkitAudioContext;
      if (!Audio) return;
      audio ??= new Audio();
      const play = () => {
        const time = audio.currentTime;
        const oscillator = audio.createOscillator(), gain = audio.createGain();
        oscillator.type = correct ? 'sine' : 'triangle';
        oscillator.frequency.setValueAtTime(correct ? 660 : 190, time);
        oscillator.frequency.setValueAtTime(correct ? 880 : 130, time + .12);
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(.12, time + .015);
        gain.gain.exponentialRampToValueAtTime(.001, time + .3);
        oscillator.connect(gain); gain.connect(audio.destination);
        oscillator.start(time); oscillator.stop(time + .32);
        oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
      };
      if (audio.state === 'suspended') audio.resume().then(play).catch(() => {});
      else if (audio.state === 'running') play();
    } catch { /* Le retour écrit reste disponible sans audio. */ }
  }

  function shuffle(options) {
    const result = [...options];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  function renderSentence() {
    const [text, ...gaps] = phrase();
    $('sentence').replaceChildren();
    text.split(/(\{\d+\})/).forEach(part => {
      const match = part.match(/^\{(\d+)\}$/);
      if (!match) { $('sentence').append(document.createTextNode(part)); return; }
      const i = Number(match[1]), button = document.createElement('button');
      button.className = `gap${solved.has(i) ? ' solved' : ''}`;
      button.textContent = solved.has(i) ? `${gaps[i].answer} ✓` : '···';
      button.dataset.gap = i;
      button.disabled = solved.has(i);
      button.setAttribute('aria-label', solved.has(i) ? `${gaps[i].answer}, bonne réponse` : `Choisir le mot manquant ${i + 1}`);
      button.setAttribute('aria-expanded', String(activeGap === i && !solved.has(i)));
      button.setAttribute('aria-controls', 'choices-panel');
      button.addEventListener('click', () => openChoices(i));
      $('sentence').append(button);
    });
  }

  function openChoices(i) {
    activeGap = i;
    renderSentence();
    $('choices-panel').hidden = false;
    $('choices').replaceChildren();
    $('feedback').textContent = 'Choisis le sens demandé par la petite mission.';
    shuffle(phrase()[i + 1].options).forEach(option => {
      const button = document.createElement('button');
      button.className = 'choice';
      button.textContent = option;
      button.addEventListener('click', () => answer(i, option, button));
      $('choices').append(button);
    });
    $('choices').firstElementChild.focus({ preventScroll: true });
  }

  function answer(i, option, button) {
    if (solved.has(i)) return;
    const correct = option === phrase()[i + 1].answer;
    tone(correct);
    if (!correct) {
      mistakes++; phraseMistakes++;
      button.classList.add('wrong');
      button.textContent = `${option} ✗`;
      button.disabled = true;
      document.querySelector(`[data-gap="${i}"]`).classList.add('wrong');
      const preview = phrase()[0].replace(`{${i}}`, () => option);
      const mishap = phrase()[i + 1].jokes[option];
      illustrate('mishap', option);
      $('story-state').textContent = `Petit détour farfelu ! ${mishap} Rien de grave : aide Pipo à réparer ce tour de magie.`;
      $('feedback').textContent = `✗ Avec ce choix : « ${preview} »\n${mishap}\nRéessaie : le bon mot permettra à Pipo de continuer.`;
      const next = [...$('choices').children].find(choice => !choice.disabled);
      if (next) next.focus({ preventScroll: true });
      return;
    }
    solved.add(i);
    renderSentence();
    $('choices-panel').hidden = true;
    if (solved.size === phrase().length - 1) {
      history.push({ ...scene() });
      illustrate('success', scene().souvenir);
      $('story-state').textContent = `${phraseMistakes ? 'Le bon mot remet tout en ordre ! ' : ''}${scene().after}`;
      renderJourney();
      if (!phraseMistakes) firstTry++;
      $('progress').value = phraseIndex + 1;
      $('success-count').textContent = `${phraseIndex + 1} / 10 réussies`;
      $('feedback').textContent = `✓ Bravo ! C’est bien le sens de la mission.\nÀ retenir : ${phrase()[i + 1].rule}`;
      $('next').hidden = false;
      $('next').textContent = phraseIndex === 9 ? 'Découvrir la fin de l’histoire ★' : 'Continuer l’aventure →';
      $('next').focus({ preventScroll: true });
    } else {
      $('feedback').textContent = '✓ Bien joué ! Complète le mot suivant.';
      document.querySelector('.gap:not(:disabled)').focus({ preventScroll: true });
    }
  }

  function showPhrase() {
    solved = new Set(); activeGap = null; phraseMistakes = 0;
    $('complete').hidden = true;
    document.querySelector('.exercise').hidden = false;
    $('choices-panel').hidden = true; $('next').hidden = true;
    $('choices').replaceChildren();
    $('feedback').textContent = 'Touche les pointillés. Attention : les autres choix racontent une autre histoire !';
    $('clue').textContent = `Ta mission : ${phrase()[1].clue}`;
    $('story-title').textContent = `${levels[levelIndex].name} · ${levels[levelIndex].title}`;
    $('story-intro').textContent = levels[levelIndex].intro;
    $('story-state').textContent = scene().before;
    illustrate('', 'Pipo et toi · À vous de jouer !');
    $('previous-step').hidden = !history.length;
    $('previous-step').textContent = history.length ? `Grâce à ton dernier mot : ${history[history.length - 1].after}` : '';
    renderJourney();
    $('position').textContent = `${levels[levelIndex].name} · Phrase ${phraseIndex + 1} sur 10`;
    $('success-count').textContent = `${phraseIndex} / 10 réussies`;
    $('progress').value = phraseIndex;
    renderSentence();
  }

  function startLevel(index, focus = true) {
    levelIndex = index; phraseIndex = 0; mistakes = 0; firstTry = 0; history = [];
    [...$('levels').children].forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    showPhrase();
    if (focus) document.querySelector('.gap').focus({ preventScroll: true });
  }

  levels.forEach((level, i) => {
    const button = document.createElement('button');
    button.textContent = level.name;
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', () => startLevel(i));
    $('levels').append(button);
  });
  $('next').addEventListener('click', () => {
    if (solved.size !== phrase().length - 1 || history.length !== phraseIndex + 1) return;
    if (phraseIndex < 9) {
      phraseIndex++; showPhrase();
      document.querySelector('.gap').focus({ preventScroll: true });
      return;
    }
    document.querySelector('.exercise').hidden = true;
    $('complete').hidden = false;
    $('complete-title').textContent = `Bravo, niveau ${levels[levelIndex].name} terminé !`;
    $('story-ending').textContent = levels[levelIndex].ending;
    $('summary').textContent = `10 phrases complétées, dont ${firstTry} sans erreur. ${mistakes} essai(s) à corriger : tu as persévéré et trouvé tous les mots !`;
    $('next-level').textContent = levelIndex < levels.length - 1 ? `Découvrir le ${levels[levelIndex + 1].name} →` : 'Rejouer depuis le CP →';
    $('complete-title').focus({ preventScroll: true });
  });
  $('next-level').addEventListener('click', () => startLevel((levelIndex + 1) % levels.length));
  $('restart').addEventListener('click', () => startLevel(levelIndex));
  $('sound').addEventListener('click', () => {
    sound = !sound;
    $('sound').setAttribute('aria-pressed', String(sound));
    $('sound').textContent = `Son : ${sound ? 'activé' : 'coupé'}`;
    if (sound) tone(true);
  });
  startLevel(0, false);
})();
