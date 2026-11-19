'use strict';

(() => {
  const $ = id => document.getElementById(id);
  const levels = [
    { name: 'CP', description: 'Petits nombres jusqu’à 20. Multiplications de découverte par 2, sous forme de groupes.', add: [9, 10], sub: [19, 9], multiply: [5, 2] },
    { name: 'CE1', description: 'Nombres à deux chiffres, additions avec retenue, soustractions et premières tables.', add: [89, 89], sub: [99, 89], multiply: [10, 5] },
    { name: 'CE2', description: 'Nombres à trois chiffres, emprunts et multiplications par un chiffre.', add: [899, 899], sub: [999, 899], multiply: [99, 9] },
    { name: 'CM1', description: 'Nombres à quatre chiffres et multiplications posées par deux chiffres.', add: [8999, 8999], sub: [9999, 8999], multiply: [299, 29] },
    { name: 'CM2', description: 'Grands nombres, emprunts successifs et multiplications par deux chiffres.', add: [89999, 89999], sub: [99999, 89999], multiply: [999, 99] }
  ];
  const places = ['unités', 'dizaines', 'centaines', 'milliers', 'dizaines de milliers', 'centaines de milliers'];
  const headings = ['U', 'D', 'C', 'M', 'DM', 'CM'];
  let levelIndex = 0, operation = 'mixed', exercises = [], index = 0;
  let rows = [], notes = [], selected = null, solved = false, mistakes = 0, clean = 0, attemptErrors = 0;
  let sound = true, audio = null;
  const random = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
  const current = () => exercises[index];

  function tone(ok) {
    if (!sound) return;
    try {
      const Audio = window.AudioContext || window.webkitAudioContext;
      if (!Audio) return;
      audio ??= new Audio();
      const play = () => {
        const oscillator = audio.createOscillator(), gain = audio.createGain(), now = audio.currentTime;
        oscillator.frequency.setValueAtTime(ok ? 660 : 190, now);
        oscillator.frequency.setValueAtTime(ok ? 880 : 130, now + .12);
        gain.gain.setValueAtTime(.08, now);
        gain.gain.exponentialRampToValueAtTime(.001, now + .3);
        oscillator.connect(gain); gain.connect(audio.destination);
        oscillator.start(now); oscillator.stop(now + .32);
        oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
      };
      if (audio.state === 'suspended') audio.resume().then(play).catch(() => {});
      else if (audio.state === 'running') play();
    } catch { /* Les messages restent disponibles sans son. */ }
  }

  function generate() {
    const level = levels[levelIndex];
    return Array.from({ length: 10 }, (_, i) => {
      const kind = operation === 'mixed' ? ['+', '-', '×'][i % 3] : operation;
      const scale = .35 + i / 9 * .65;
      const range = kind === '+' ? level.add : kind === '-' ? level.sub : level.multiply;
      let a = random(1, Math.max(2, Math.floor(range[0] * scale)));
      let b = random(1, Math.max(2, Math.floor(range[1] * scale)));
      if (kind === '-' && b > a) [a, b] = [b, a];
      if (kind === '×' && levelIndex === 0) b = 2;
      return { a, b, kind, result: kind === '+' ? a + b : kind === '-' ? a - b : a * b };
    });
  }

  function select(cell) {
    selected = cell;
    document.querySelectorAll('.digit').forEach(button => button.setAttribute('aria-pressed', String(button === cell.button)));
    $('selection').textContent = `${cell.label} : choisis un chiffre.`;
  }

  function addText(text, className = '') {
    const span = document.createElement('span');
    span.className = `cell ${className}`;
    span.textContent = text;
    $('calculation').append(span);
  }

  function addNumber(value, columns, symbol = '') {
    addText(symbol);
    String(value).padStart(columns, ' ').split('').forEach(digit => addText(digit));
  }

  function line() {
    const bar = document.createElement('div'); bar.className = 'line'; bar.setAttribute('aria-hidden', 'true');
    $('calculation').append(bar);
  }

  function makeCells(columns, label, expected = null) {
    const cells = [];
    const caption = document.createElement('span');
    caption.className = 'row-label';
    caption.textContent = expected === null ? 'Retenues / emprunts · brouillon' : label;
    $('calculation').append(caption);
    addText(expected === null ? '✎' : '=');
    for (let column = 0; column < columns; column++) {
      const place = columns - column - 1, button = document.createElement('button');
      const cell = { button, value: '', label: `${label}, ${places[place]}` };
      button.className = `cell digit${expected === null ? ' note' : ''}`;
      button.textContent = expected === null ? '·' : '?';
      button.setAttribute('aria-label', `${cell.label}, vide`);
      button.setAttribute('aria-pressed', 'false');
      button.addEventListener('click', () => { if (!solved) select(cell); });
      cell.placeholder = button.textContent;
      $('calculation').append(button); cells.push(cell);
    }
    if (expected !== null) rows.push({ cells, expected, label });
    return cells;
  }

  function setEnabled(enabled) {
    $('check').disabled = !enabled;
    $('erase').disabled = !enabled;
    [...$('keypad').children].forEach(button => { button.disabled = !enabled; });
    document.querySelectorAll('.digit').forEach(button => { button.disabled = !enabled; });
  }

  function show() {
    const ex = current(), columns = Math.max(String(ex.a).length, String(ex.b).length, String(ex.result).length);
    rows = []; notes = []; selected = null; solved = false; attemptErrors = 0;
    $('exercise').hidden = false; $('complete').hidden = true; $('next').hidden = true;
    $('position').textContent = `${levels[levelIndex].name} · Calcul ${index + 1} sur 10`;
    $('score').textContent = `${index} / 10 réussis`;
    $('progress').value = index;
    $('question').textContent = `${ex.a} ${ex.kind} ${ex.b} = ?`;
    $('feedback').textContent = 'Touche une case, choisis son chiffre, puis vérifie ton calcul.';
    $('calculation').replaceChildren();
    $('calculation').style.setProperty('--columns', columns);
    addText('');
    for (let i = columns - 1; i >= 0; i--) {
      const label = document.createElement('abbr');
      label.className = 'cell heading'; label.title = places[i]; label.textContent = headings[i];
      $('calculation').append(label);
    }
    notes = makeCells(columns, 'Brouillon de retenue');
    addNumber(ex.a, columns);
    addNumber(ex.b, columns, ex.kind);
    line();
    if (ex.kind === '×' && ex.b >= 10) {
      makeCells(columns, 'Produit par les unités', ex.a * (ex.b % 10));
      makeCells(columns, 'Produit par les dizaines, zéro de décalage compris', ex.a * Math.floor(ex.b / 10) * 10);
      line();
    }
    makeCells(columns, 'Résultat', ex.result);
    $('method').textContent = ex.kind === '×'
      ? ex.b >= 10 ? 'Multiplie par les unités, puis par les dizaines (termine cette ligne par 0). Additionne les deux lignes.' : levelIndex === 0 ? `Imagine ${ex.b} groupes de ${ex.a} objets. Combien d’objets en tout ?` : 'Multiplie de droite à gauche. Les petites cases servent à noter tes retenues.'
      : ex.kind === '+' ? 'Additionne les unités, puis les dizaines et les autres colonnes. À partir de 10, reporte une retenue à gauche.' : 'Soustrais de droite à gauche. Si nécessaire, échange une dizaine de gauche contre 10 unités.';
    setEnabled(true);
    select(rows[0].cells[columns - 1]);
  }

  function start() {
    exercises = generate(); index = 0; mistakes = 0; clean = 0;
    [...$('levels').children].forEach((button, i) => button.setAttribute('aria-pressed', String(i === levelIndex)));
    document.querySelectorAll('[data-operation]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.operation === operation)));
    $('level-info').textContent = levels[levelIndex].description;
    show();
  }

  function write(value) {
    if (!selected || solved) return;
    selected.value = value;
    selected.button.textContent = value === '' ? selected.placeholder : value;
    selected.button.setAttribute('aria-label', `${selected.label}, ${value === '' ? 'vide' : value}`);
    selected.button.classList.remove('wrong');
    $('feedback').textContent = 'Continue, puis touche Vérifier quand tu as terminé.';
    // On garde la case active : l’enfant choisit lui-même sa prochaine colonne.
  }

  function check() {
    if (solved) return;
    const unfinished = rows.find(row => row.cells.every(cell => cell.value === ''));
    if (unfinished) {
      $('feedback').textContent = `Complète la ligne « ${unfinished.label} » avant de vérifier.`;
      select(unfinished.cells[unfinished.cells.length - 1]); return;
    }
    let incorrect = null;
    rows.forEach(row => {
      // Une case vide à gauche vaut zéro ; un trou au milieu n’est pas accepté.
      const text = row.cells.map(cell => cell.value === '' ? ' ' : cell.value).join('').trimStart();
      const ok = /^\d+$/.test(text) && Number(text) === row.expected;
      row.cells.forEach(cell => { cell.button.classList.toggle('wrong', !ok); cell.button.classList.toggle('correct', ok); });
      if (!ok && !incorrect) incorrect = row;
    });
    if (incorrect) {
      mistakes++; attemptErrors++; tone(false);
      $('feedback').textContent = `✗ Recommence ! Vérifie la ligne « ${incorrect.label} », en partant de la droite. Tes chiffres et tes retenues restent en place pour les corriger.`;
      select(incorrect.cells[incorrect.cells.length - 1]); return;
    }
    solved = true; if (!attemptErrors) clean++;
    tone(true); setEnabled(false);
    $('score').textContent = `${index + 1} / 10 réussis`; $('progress').value = index + 1;
    $('selection').textContent = '✓ Calcul réussi !';
    $('feedback').textContent = `✓ Bravo ! ${current().a} ${current().kind} ${current().b} = ${current().result}`;
    $('next').hidden = false; $('next').textContent = index === 9 ? 'Voir mon résultat ★' : 'Calcul suivant →';
    $('next').focus({ preventScroll: true });
  }

  levels.forEach((level, i) => {
    const button = document.createElement('button'); button.textContent = level.name;
    button.addEventListener('click', () => { levelIndex = i; start(); });
    $('levels').append(button);
  });
  document.querySelectorAll('[data-operation]').forEach(button => button.addEventListener('click', () => { operation = button.dataset.operation; start(); }));
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 0].forEach(digit => {
    const button = document.createElement('button'); button.textContent = digit;
    button.setAttribute('aria-label', `Chiffre ${digit}`);
    button.addEventListener('click', () => write(String(digit))); $('keypad').append(button);
  });
  $('erase').addEventListener('click', () => write(''));
  $('check').addEventListener('click', check);
  $('next').addEventListener('click', () => {
    if (!solved) return;
    if (index < 9) { index++; show(); return; }
    $('exercise').hidden = true; $('complete').hidden = false;
    $('summary').textContent = `10 calculs réussis, dont ${clean} sans erreur. ${mistakes} vérification(s) à corriger. Bien joué !`;
    $('next-level').hidden = levelIndex === levels.length - 1;
    $('complete-title').focus({ preventScroll: true });
  });
  $('again').addEventListener('click', start);
  $('restart').addEventListener('click', start);
  $('next-level').addEventListener('click', () => { if (levelIndex < levels.length - 1) { levelIndex++; start(); } });
  $('sound').addEventListener('click', () => {
    sound = !sound; $('sound').setAttribute('aria-pressed', String(sound));
    $('sound').textContent = `Son : ${sound ? 'activé' : 'coupé'}`;
  });
  document.addEventListener('keydown', event => {
    if ($('exercise').hidden || solved || event.altKey || event.ctrlKey || event.metaKey) return;
    if (/^\d$/.test(event.key)) { event.preventDefault(); write(event.key); }
    else if (event.key === 'Backspace' || event.key === 'Delete') { event.preventDefault(); write(''); }
    else if ((event.key === 'ArrowLeft' || event.key === 'ArrowRight') && selected) {
      const cells = [...notes, ...rows.flatMap(row => row.cells)], i = cells.indexOf(selected);
      const next = cells[i + (event.key === 'ArrowLeft' ? -1 : 1)];
      if (next) { event.preventDefault(); select(next); next.button.focus({ preventScroll: true }); }
    }
  });
  start();
})();
