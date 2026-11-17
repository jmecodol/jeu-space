'use strict';

(() => {
  const $ = id => document.getElementById(id);
  // Les autres choix existent aussi : l’indice permet de choisir le sens attendu.
  const gap = (answer, clue, rule, ...wrong) => ({
    answer, clue, rule, options: [answer, ...wrong.map(([word]) => word)],
    jokes: Object.fromEntries(wrong)
  });
  const levels = [
    { name: 'CP', phrases: [
      ['Le pirate met du {0} sur sa tartine.', gap('pain', 'Il veut manger un morceau de baguette.', 'Le pain se mange ; le pin est un arbre.', ['pin', 'Une tartine au sapin ? Ça pique sous la dent !'], ['bain', 'Il verse toute sa baignoire sur sa tartine !'])],
      ['Le dragon met son {0} dans une chaussette géante.', gap('pied', 'Il cache le bout de sa jambe.', 'Le pied marche ; la pie est un oiseau.', ['pie', 'Une pie dans une chaussette ? Elle va réclamer des ailes !'], ['nez', 'Une chaussette sur le nez : bonjour l’odeur !'])],
      ['La sorcière porte un {0} sur la tête.', gap('chapeau', 'Elle veut couvrir ses cheveux, pas adopter un animal.', 'Un chapeau se porte ; un chameau a des bosses.', ['chameau', 'Un chameau sur la tête : quel chapeau à bosses !'], ['gâteau', 'Un gâteau comme chapeau ? Attention à la crème dans les cheveux !'])],
      ['Le robot boit dans un {0}.', gap('verre', 'Il utilise un petit récipient pour boire.', 'Un verre contient la boisson ; un ver se tortille.', ['ver', 'Un ver en guise de tasse ? Il se sauve avec la boisson !'], ['vers', 'Des lignes de poésie pour boire : quelle tasse bavarde !'])],
      ['Le roi offre une {0} à son dragon.', gap('fleur', 'Il cueille son cadeau dans le jardin.', 'Une fleur pousse ; une peur fait trembler.', ['peur', 'Offrir une peur ? Le cadeau fait BOUH au dragon !'], ['sœur', 'Sa sœur en cadeau ? Elle n’a pas demandé à être emballée !'])],
      ['Le lapin dessine un {0} sur son cahier.', gap('pont', 'Il dessine un passage au-dessus de la rivière.', 'Le pont traverse l’eau ; le rond tourne en boucle.', ['rond', 'Un rond pour traverser ? Le lapin va tourner en rond !'], ['poisson', 'Un poisson comme passage : ça glisse sous les pattes !'])],
      ['Le géant mange un {0} au chocolat.', gap('dessert', 'Il termine son repas par une douceur.', 'Le dessert a deux s ; le désert est un paysage de sable.', ['désert', 'Un désert au chocolat ? Il lui faut une cuillère de la taille du Sahara !'], ['départ', 'Manger un départ ? Le train n’arrivera jamais !'])],
      ['La licorne tire son {0} sur la neige.', gap('traîneau', 'Elle veut transporter ses cadeaux en glissant.', 'Le traîneau glisse ; le tonneau roule.', ['tonneau', 'Un tonneau sur la neige : les cadeaux font des roulades !'], ['traiteur', 'Elle tire le cuisinier ? Il va renverser toute la soupe !'])],
      ['Le clown accroche un {0} au mur.', gap('tableau', 'Il veut décorer avec une peinture.', 'Le tableau se regarde ; le taureau est un animal.', ['taureau', 'Un taureau au mur ? Le clou demande des vacances !'], ['bateau', 'Un bateau au mur : le salon devient un port !'])],
      ['La grenouille range ses {0} dans son cartable.', gap('cahiers', 'Elle prépare de quoi écrire à l’école.', 'On écrit dans les cahiers ; les cailloux sont des pierres.', ['cailloux', 'Un cartable de cailloux : les devoirs pèsent une tonne !'], ['canards', 'Des canards dans le cartable ? Coin-coin pendant la dictée !'])]
    ] },
    { name: 'CE1', phrases: [
      ['Le fantôme cache une {0} sous son drap.', gap('amande', 'Il cache un petit fruit à coque pour son goûter.', 'L’amande se mange ; l’amende se paie.', ['amende', 'Un goûter qui coûte une contravention : même le fantôme devient pâle !'], ['armoire', 'Une armoire sous le drap ? Ce fantôme a des épaules carrées !'])],
      ['Le dragon a mal au {0} après cent galipettes.', gap('cou', 'Il a mal entre la tête et les épaules.', 'Le cou porte la tête ; un coup est un choc ; le coût est un prix.', ['coup', 'Mal à un coup ? Le dragon mélange sa douleur et sa bosse !'], ['coût', 'Mal au prix ? Son porte-monnaie fait « aïe » !'])],
      ['Le lutin pêche près du {0}.', gap('port', 'Il pêche là où s’arrêtent les bateaux.', 'Le port accueille les bateaux ; le porc est un cochon.', ['porc', 'Il pêche près du cochon : gare au poisson en jambon !'], ['pot', 'Pêcher dans un pot ? Le poisson tourne en conserve !'])],
      ['Le géant cache un {0} dans sa poche.', gap('balai', 'Il veut pouvoir nettoyer les miettes.', 'Le balai nettoie ; le ballet est une danse.', ['ballet', 'Tout un spectacle de danse dans sa poche : ça gigote !'], ['palais', 'Un palais dans une poche ? Où dort le roi ?'])],
      ['Le hamster pose sa patte sur la {0}.', gap('touche', 'Il veut écrire une lettre sur le clavier.', 'La touche est sur le clavier ; la douche sert à se laver.', ['douche', 'Le hamster écrit avec la douche : le message dégouline !'], ['mouche', 'Une mouche comme clavier : le message s’envole !'])],
      ['Le robot a perdu la {0} de son goûter.', gap('moitié', 'Il lui reste une part sur deux.', 'La moitié, c’est une part sur deux ; la motte est un morceau de terre ou de beurre.', ['motte', 'Une motte de goûter : le robot mange-t-il du jardin ?'], ['montagne', 'Une montagne de goûter perdue : cherchez le sommet en chocolat !'])],
      ['Le mouton apporte du {0} pour construire sa cabane.', gap('bois', 'Il apporte des planches.', 'Le bois sert à fabriquer ; le poids dit combien c’est lourd.', ['poids', 'Il apporte juste de la lourdeur : une cabane invisible, mais fatigante !'], ['pois', 'Une cabane en petits pois : elle roule dans l’assiette !'])],
      ['Le pirate dépose un {0} sur la table.', gap('seau', 'Il apporte de l’eau dans un récipient à anse.', 'Le seau transporte ; le saut fait bondir ; le sceau marque un document.', ['saut', 'Un saut sur la table ? Le pirate rebondit dans la soupe !'], ['sceau', 'Un tampon officiel pour transporter l’eau : ça fuit !'])],
      ['Le chat tricote avec de la {0}.', gap('laine', 'Il utilise le fil du mouton.', 'La laine est un fil ; la haine est un sentiment hostile.', ['haine', 'Tricoter avec de la colère : voilà une écharpe de mauvaise humeur !'], ['lune', 'Une écharpe en lune : elle brille pendant la récré !'])],
      ['La souris fait un {0} à son fromage.', gap('conte', 'Elle lui raconte une histoire de princesse.', 'Un conte raconte ; un compte calcule ; un comte est un titre de noblesse.', ['compte', 'Elle calcule les trous du fromage au lieu de raconter une histoire !'], ['comte', 'Elle fabrique un noble pour son fromage : Sa Majesté Camembert !'])]
    ] },
    { name: 'CE2', phrases: [
      ['Le dragon a perdu sa {0} pendant le concert.', gap('voix', 'Il ne peut plus chanter.', 'La voix chante ; la voie est un chemin.', ['voie', 'Il a égaré sa route au milieu du concert !'], ['noix', 'Il cherche une noix sous les applaudissements : quel écureuil !'])],
      ['Le roi des escargots veut un {0} de salade.', gap('champ', 'Il veut un terrain où pousse la salade.', 'Le champ est un terrain ; le chant est une chanson.', ['chant', 'Une chanson de salade : la laitue chante faux !'], ['champion', 'Un champion de salade ? La laitue gagne une médaille !'])],
      ['Le dragon choisit une robe {0} pour le bal.', gap('verte', 'Il veut une robe couleur de petit pois.', 'Verte est une couleur ; ouverte décrit ce qui n’est pas fermé.', ['ouverte', 'Une robe ouverte : le dragon cherche le bouton manquant !'], ['en verre', 'Une robe en verre : attention aux galipettes !'])],
      ['La fée garde son dragon {0}.', gap('près', 'Elle veut qu’il reste à côté d’elle.', 'Près indique la distance ; prêt veut dire préparé.', ['prêt', 'Le dragon est prêt… mais on ne sait toujours pas où il est !'], ['au pré', 'Le dragon part brouter avec les vaches !'])],
      ['Le lapin offre une {0} à la lune.', gap('rose', 'Il veut lui offrir une fleur.', 'Une rose est une fleur ; une ruse est un tour malin.', ['ruse', 'Un piège en cadeau : la lune va se méfier !'], ['roue', 'Une roue pour la lune ? La voilà en vélo !'])],
      ['La sorcière travaille {0} sa baguette.', gap('sans', 'Elle a oublié sa baguette à la maison.', 'Sans marque l’absence ; avec dit le contraire.', ['avec', 'Elle a retrouvé sa baguette : c’est exactement l’inverse !'], ['sur', 'Debout sur une baguette : la sorcière joue les équilibristes !'])],
      ['Le lutin {0} les chaussettes qui parlent.', gap('n’aime pas', 'Les chaussettes bavardes l’agacent.', 'Ne… pas transforme une affirmation en négation.', ['aime', 'Il adore les chaussettes bavardes : c’est l’inverse !'], ['imite', 'Maintenant, c’est le lutin qui parle comme une chaussette !'])],
      ['{0} dessert du dragon est une chaussette en sucre.', gap('Son', 'On parle du dessert qui appartient au dragon.', 'Son peut accompagner un nom ; le son, c’est aussi ce qu’on entend.', ['Le son du', 'On entend le dessert : cette chaussette chante dans l’assiette !'], ['Le frère du', 'Un dessert avec un frère ? La famille des chaussettes s’agrandit !'])],
      ['Le pirate range ses trésors {0} le coffre.', gap('dans', 'Les pièces doivent être à l’intérieur.', 'Dans veut dire à l’intérieur ; sur et sous changent la place.', ['sur', 'Tout est sur le couvercle : impossible de fermer le trésor !'], ['sous', 'Le coffre est vide : les pièces lui chatouillent les pieds !'])],
      ['Le petit monstre {0} dans la mare.', gap('se baigne', 'Il veut se laver en nageant.', 'Se baigne vient de baigner ; se peigne vient de peigner : une lettre change l’action.', ['se peigne', 'Il coiffe ses poils dans la mare : le peigne fait de la plongée !'], ['se plaint', 'Au lieu de nager, il râle sur la température de l’eau !'])]
    ] },
    { name: 'CM1', phrases: [
      ['Le robot commande {0} au restaurant.', gap('des petits pois', 'Il veut manger de petits légumes verts.', 'Un espace change tout : petits pois se mange, petits poids se pèse.', ['des petits poids', 'On lui sert des haltères miniatures : un menu très lourd !'], ['des petits rois', 'Des mini-rois dans l’assiette : ils réclament une couronne !'])],
      ['Le magicien cherche {0} pour son spectacle.', gap('un bon tour', 'Il veut réussir une nouvelle magie.', 'Un bon tour fait de la magie ; un bonjour sert à saluer.', ['un bonjour', 'Il cherche juste à dire salut : le spectacle sera court !'], ['un vautour', 'Un gros oiseau entre en scène et vole le chapeau !'])],
      ['Le lutin attend {0} avant de dormir.', gap('la nuit', 'Il attend que le soleil soit couché.', 'La nuit est un moment ; l’ennui est le manque d’occupation.', ['l’ennui', 'Il attend de s’ennuyer : même son oreiller soupire !'], ['la nouille', 'Il guette une pâte au lit : bonne nuit, spaghetti !'])],
      ['La sorcière réclame {0} à son voisin.', gap('du sel', 'Sa soupe manque d’assaisonnement.', 'Du sel relève la soupe ; une selle se pose sur un cheval.', ['une selle', 'Une selle dans la soupe : voilà un bouillon au galop !'], ['des ailes', 'La soupe s’envole avant le dîner !'])],
      ['{0} : le dragon a caché les biscuits.', gap('On a faim', 'Tout le monde a le ventre qui gargouille.', 'Faim concerne le repas ; fin concerne ce qui se termine.', ['On a fini', 'Le repas est terminé alors qu’il n’a même pas commencé !'], ['On a froid', 'Ce n’est plus le ventre : même les chaussettes grelottent !'])],
      ['La fée dessine {0} au-dessus du château.', gap('des étoiles', 'Elle dessine le ciel de la nuit.', 'Étoiles et toiles ne racontent pas le même ciel.', ['des toiles', 'Des tableaux ou des toiles d’araignée dans le ciel : quel musée !'], ['des étoles', 'Des écharpes au-dessus du château : les nuages ont froid !'])],
      ['Le dragon annonce : « {0} »', gap('Je ne vole plus !', 'Il décide d’arrêter de se déplacer dans les airs.', 'Ne… plus marque l’arrêt ; plus sans négation peut indiquer davantage.', ['Je vole plus haut !', 'Il monte encore : c’est tout le contraire de son projet !'], ['Je ne vole que la nuit !', 'Il continue à voler, mais seulement quand les hiboux sortent !'])],
      ['Le pirate {0} pour protéger son trésor.', gap('a un plan', 'Il a trouvé une idée maligne.', 'Un plan est une idée ou un dessin ; à plat décrit une position.', ['est à plat', 'Le pirate est tout aplati ou sans énergie : le trésor attendra !'], ['a un plant', 'Il protège son trésor avec une jeune tomate !'])],
      ['Le roi veut {0} pour son jardin.', gap('davantage de fleurs', 'Il veut encore plus de fleurs.', 'Davantage en un mot veut dire plus ; des avantages sont des bénéfices.', ['des avantages', 'Il demande des privilèges : même les roses veulent des vacances !'], ['des avocats', 'Le jardin devient un cabinet juridique… ou un verger !'])],
      ['Le monstre promet : « {0} »', gap('Je garde ton gâteau.', 'Il veut surveiller le gâteau sans le manger.', 'Garder n’est pas dévorer : les mots choisis changent la promesse.', ['Je dévore ton gâteau.', 'Promesse inversée : il ne reste déjà que des miettes !'], ['Je regarde ton râteau.', 'Il admire le jardinage et oublie le goûter !'])]
    ] },
    { name: 'CM2', phrases: [
      ['Le dragon dit : « {0} »', gap('On mange, les amis !', 'Il appelle ses amis à table ; ils ne sont pas au menu.', 'La virgule sépare l’appel aux amis du reste de la phrase.', ['On mange les amis !', 'Sans virgule, les invités deviennent le repas ! Oups : rendons-les à leurs chaises.'], ['On mange les radis !', 'Les amis attendent encore leur invitation pendant que les radis disparaissent !'])],
      ['La reine crie : « {0} »', gap('Venez manger, les poulets !', 'Elle appelle ses petits poulets à venir picorer.', 'La virgule indique à qui elle parle.', ['Venez manger les poulets !', 'Ce ne sont plus les invités : les poulets sont au menu !'], ['Venez peigner les poulets !', 'Les cuisiniers arrivent avec des peignes : coiffure de plumes au menu !'])],
      ['Le robot annonce : « {0} »', gap('Je n’ai rien mangé.', 'Son ventre est vide : aucun boulon au petit déjeuner.', 'Ne… rien indique l’absence ; ne… que veut dire seulement.', ['Je n’ai mangé que des boulons.', 'Il a bien mangé : un petit déjeuner de quincaillerie !'], ['J’ai tout mangé.', 'C’est l’inverse : même la table cherche ses miettes !'])],
      ['Le lutin commande {0} pour construire son toboggan.', gap('une vis', 'Il lui faut une petite pièce de métal à tourner.', 'Une vis fixe des pièces ; une vie est une existence.', ['une vie', 'Une existence entière pour un toboggan : quel chantier !'], ['un vice', 'Il commande un défaut : le toboggan va faire des bêtises !'])],
      ['Le dragon murmure : « {0} »', gap('C’est chouette !', 'Il trouve son nouveau chapeau formidable.', 'C’est présente un commentaire ; ces désigne plusieurs choses.', ['Ces chouettes !', 'Il montre des oiseaux au lieu de donner son avis : hou hou !'], ['C’est chaussette !', 'Son compliment vient de tomber dans le panier à linge !'])],
      ['La sorcière veut {0} son dragon.', gap('le faire taire', 'Elle veut enfin ne plus entendre ses chansons.', 'Faire taire réduit au silence ; faire du thé prépare une boisson.', ['lui faire du thé', 'Le dragon continue à chanter, mais avec une tasse !'], ['le faire rire', 'Au lieu du silence, elle obtient un concert de HA HA HA !'])],
      ['Le roi commande {0} pour son repas.', gap('un steak haché', 'Il veut de la viande découpée en tout petits morceaux.', 'Haché décrit la préparation ; à cheval est une autre expression culinaire.', ['un steak à cheval', 'Voilà un autre plat : le roi guette un minuscule cavalier dans l’assiette !'], ['un steak caché', 'Le cuisinier le dissimule : le roi dîne à cache-cache !'])],
      ['Le fantôme veut {0} dans la chorale.', gap('chanter juste', 'Il veut respecter les notes.', 'Chanter juste, c’est chanter sans fausse note ; juste chanter signifie seulement chanter.', ['juste chanter', 'Il veut seulement chanter, même si les fenêtres tremblent !'], ['chanter faux', 'C’est l’inverse : les oreilles des autres fantômes prennent la fuite !'])],
      ['La fée demande {0} à ses lutins.', gap('de la patience', 'Elle veut qu’ils sachent attendre leur goûter.', 'La patience aide à attendre ; les patients sont notamment les personnes soignées.', ['des patients', 'La cuisine devient une salle d’attente médicale !'], ['des pâtisseries', 'Les lutins apportent le goûter avant même d’avoir attendu !'])],
      ['Le dragon lit la consigne : « {0} »', gap('Ne réveillez personne !', 'Tous les lutins doivent continuer à dormir.', 'Ne… personne exclut tout le monde ; tout le monde est le contraire.', ['Réveillez tout le monde !', 'C’est l’inverse : cinquante lutins en pyjama réclament leur petit déjeuner !'], ['Ne réveillez que le roi !', 'Une exception s’est glissée : le roi doit enfiler ses pantoufles !'])]
    ] }
  ];

  let levelIndex = 0, phraseIndex = 0, activeGap = null;
  let solved = new Set(), mistakes = 0, firstTry = 0, phraseMistakes = 0;
  let sound = true, audio = null;
  const phrase = () => levels[levelIndex].phrases[phraseIndex];

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
      $('feedback').textContent = `✗ Avec ce choix : « ${preview} »\n${phrase()[i + 1].jokes[option]}\nCe choix change l’histoire ! Relis la mission et réessaie.`;
      const next = [...$('choices').children].find(choice => !choice.disabled);
      if (next) next.focus({ preventScroll: true });
      return;
    }
    solved.add(i);
    renderSentence();
    $('choices-panel').hidden = true;
    if (solved.size === phrase().length - 1) {
      if (!phraseMistakes) firstTry++;
      $('progress').value = phraseIndex + 1;
      $('success-count').textContent = `${phraseIndex + 1} / 10 réussies`;
      $('feedback').textContent = `✓ Bravo ! C’est bien le sens de la mission.\nÀ retenir : ${phrase()[i + 1].rule}`;
      $('next').hidden = false;
      $('next').textContent = phraseIndex === 9 ? 'Voir mon résultat ★' : 'Phrase suivante →';
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
    $('position').textContent = `${levels[levelIndex].name} · Phrase ${phraseIndex + 1} sur 10`;
    $('success-count').textContent = `${phraseIndex} / 10 réussies`;
    $('progress').value = phraseIndex;
    renderSentence();
  }

  function startLevel(index, focus = true) {
    levelIndex = index; phraseIndex = 0; mistakes = 0; firstTry = 0;
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
    if (solved.size !== phrase().length - 1) return;
    if (phraseIndex < 9) {
      phraseIndex++; showPhrase();
      document.querySelector('.gap').focus({ preventScroll: true });
      return;
    }
    document.querySelector('.exercise').hidden = true;
    $('complete').hidden = false;
    $('complete-title').textContent = `Bravo, niveau ${levels[levelIndex].name} terminé !`;
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
