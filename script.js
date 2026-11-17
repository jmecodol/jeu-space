'use strict';

(() => {
  const $ = id => document.getElementById(id);
  // Chaque paire contient le mot attendu, puis les orthographes à comparer.
  const gap = (answer, ...wrong) => ({ answer, options: [answer, ...wrong] });
  const levels = [
    { name: 'CP', phrases: [
      ['Le {0} dort.', gap('chat', 'cha', 'chas')],
      ['Je mange une {0}.', gap('pomme', 'pome', 'paume')],
      ['Le {0} brille.', gap('soleil', 'soleille', 'solèil')],
      ['La {0} est rouge.', gap('fleur', 'fleure', 'fler')],
      ['Le lapin mange une {0}.', gap('carotte', 'carote', 'quarotte')],
      ['Mon {0} joue dans la cour.', gap('frère', 'frére', 'fraire')],
      ['Le petit {0} nage.', gap('poisson', 'poison', 'poissons')],
      ['Les {0} sont dans le sac.', gap('livres', 'livre', 'livrent')],
      ['La petite fille {0} une chanson.', gap('chante', 'chantes', 'chantent')],
      ['Les enfants {0} dans la cour.', gap('jouent', 'joue', 'joues')]
    ] },
    { name: 'CE1', phrases: [
      ['Le {0} joue avec sa balle.', gap('chien', 'chein', 'chiens')],
      ['Je porte un {0} bleu.', gap('chapeau', 'chapo', 'chapeaux')],
      ['Nous marchons sur le {0}.', gap('chemin', 'chemain', 'chemint')],
      ['Le jardin est {0}.', gap('grand', 'grant', 'grands')],
      ['Elle achète des fleurs {0}.', gap('jaunes', 'jaune', 'jaunent')],
      ['Les oiseaux {0} dans le ciel.', gap('volent', 'vole', 'voles')],
      ['Nous {0} une histoire.', gap('écoutons', 'écoutont', 'écouton')],
      ['Tu {0} un beau dessin.', gap('dessines', 'dessine', 'dessinent')],
      ['Les petites filles sont {0}.', gap('contentes', 'contente', 'contents')],
      ['Ils {0} leurs cahiers dans le cartable.', gap('rangent', 'range', 'ranges')]
    ] },
    { name: 'CE2', phrases: [
      ['Le {0} butine les fleurs.', gap('papillon', 'papillion', 'papilon')],
      ['Je prépare mon {0} pour demain.', gap('cartable', 'cartabble', 'cartablle')],
      ['Elle regarde par la {0}.', gap('fenêtre', 'fenètre', 'fennêtre')],
      ['Ce {0} raconte une aventure.', gap('personnage', 'personage', 'perssonnage')],
      ['Nous {0} nos cahiers.', gap('choisissons', 'choisissont', 'choisison')],
      ['Tu {0} toujours ton travail.', gap('finis', 'finit', 'fini')],
      ['Les feuilles {0} recouvrent le chemin.', gap('mortes', 'morte', 'morts')],
      ['Les enfants {0} joué dehors.', gap('ont', 'on', 'ons')],
      ['Elle {0} levée très tôt.', gap("s’est", "c’est", "s’es")],
      ['Hier, nous {0} une lettre.', gap('avons écrit', 'avons écris', 'avont écrit')]
    ] },
    { name: 'CM1', phrases: [
      ['La {0} commence au printemps.', gap('cueillette', 'ceuillette', 'cueuillette')],
      ['Cet {0} nous a surpris.', gap('événement', 'évenement', 'événeument')],
      ['Nous avançons {0} dans le couloir.', gap('silencieusement', 'silensieusement', 'silencieusemant')],
      ['Les fleurs sont {0} par le jardinier.', gap('arrosées', 'arrosés', 'arrosée')],
      ['Tu {0} tes amis demain.', gap('rejoindras', 'rejoindra', 'rejoindrat')],
      ['Ils {0} partir avant la nuit.', gap('voulaient', 'voulait', 'voulais')],
      ['Les élèves {0} prêts à partir.', gap('sont', 'son', 'sons')],
      ['Nous avons oublié {0} écharpe à la maison.', gap('notre', 'nôtre', 'notres')],
      ['Les lettres que tu as {0} sont arrivées.', gap('envoyées', 'envoyés', 'envoyé')],
      ['{0} tu sois fatigué, termine cette phrase.', gap('Bien que', 'Bienque', 'Bien qu’')]
    ] },
    { name: 'CM2', phrases: [
      ['Un {0} surveille la forêt.', gap('garde forestier', 'garde forestié', 'garde forestiers')],
      ['Il faut {0} les nouveaux élèves.', gap('accueillir', 'acceuilir', 'accueuillir')],
      ['Son explication est {0}.', gap('convaincante', 'convainquante', 'convaincantes')],
      ['Ils avancent {0} malgré le vent.', gap('prudemment', 'prudamment', 'prudenment')],
      ['Les portes sont restées {0}.', gap('ouvertes', 'ouverts', 'ouverte')],
      ['Si nous avions le temps, nous {0} au musée.', gap('irions', 'irons', 'irion')],
      ['Il faut que tu {0} attentif.', gap('sois', 'soit', 'soies')],
      ['Les histoires qu’elle a {0} nous plaisent.', gap('racontées', 'racontés', 'raconté')],
      ['Elles se sont {0} devant la bibliothèque.', gap('rencontrées', 'rencontrés', 'rencontré')],
      ['{0} leurs efforts, ils ont dû recommencer.', gap('Quels que soient', 'Quelque soient', 'Quels que soit')]
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
    $('feedback').textContent = 'Choisis le mot qui complète la phrase.';
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
      $('feedback').textContent = '✗ Pas tout à fait. Regarde bien les lettres et réessaie !';
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
      $('feedback').textContent = '✓ Bravo ! Ta phrase est complète.';
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
    $('feedback').textContent = 'Touche les pointillés pour choisir le mot manquant.';
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
