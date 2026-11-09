'use strict';

(() => {
  const $ = id => document.getElementById(id);
  const canvas = $('space');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const COST = 30, MAX_WAVES = 6;
  const keys = new Set(), touches = new Map();
  const fingers = new Map();
  const capacity = p => p.houses * 5 + p.bases * 15;
  const creative = () => game.mode === 'creative';
  const spend = cost => {
    if (creative()) return true;
    if (game.credits < cost) { tell(`Crédits insuffisants : ${cost} nécessaires.`); return false; }
    game.credits -= cost; return true;
  };
  const aim = { x: W / 2, y: 0 };
  let firing = false, state = 'welcome', game, last = 0, uiClock = 0, confirmationPlanet = null;
  let bank = 0;
  let cannon = 0, autoFire = false;
  const turns = new Map();
  const cannonPositions = [{ x: 55, y: 55 }, { x: W - 55, y: 55 }, { x: 55, y: H - 55 }, { x: W - 55, y: H - 55 }];
  function toWorld(position) {
    const dx = position.x - W / 2, dy = position.y - H / 2, angle = cockpit() ? bank : 0;
    return { x: W / 2 + dx * Math.cos(angle) + dy * Math.sin(angle), y: H / 2 - dx * Math.sin(angle) + dy * Math.cos(angle) };
  }
  const cockpit = () => $('view').value === 'cockpit';
  function closeConsole() {
    $('console').hidden = true; $('menu').setAttribute('aria-expanded', 'false');
  }
  function pilot() {
    clearInput(); $('tool').value = 'pilot'; closeConsole();
    $('action-hint').textContent = 'Clic / glisser : fixer la cible · Canons aux 4 coins · ↶ ↷ ou Q / E : tourner';
    canvas.focus({ preventScroll: true });
  }
  let best = 0;
  try { best = Number(localStorage.getItem('gardiens-record')) || 0; } catch { /* Le stockage est facultatif. */ }
  $('best').textContent = best;
  const stars = Array.from({ length: 110 }, () => ({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.5 + .3 }));
  const kinds = {
    meteor: { label: 'Météorite', speed: 43, hp: 2, damage: 12, radius: 13, reward: 10, color: '#c5af91' },
    comet: { label: 'Comète', speed: 95, hp: 2, damage: 18, radius: 12, reward: 15, color: '#8de9ff' },
    monster: { label: 'Monstre', speed: 32, hp: 5, damage: 20, radius: 20, reward: 25, color: '#c5a0ff' },
    missile: { label: 'Missile', speed: 115, hp: 1, damage: 10, radius: 8, reward: 8, color: '#ffad75' }
  };
  kinds.heavy = { ...kinds.meteor, label: 'Astéroïde géant', hp: 8, damage: 45, radius: 25, speed: 30, reward: 30 };
  kinds.swarm = { ...kinds.monster, label: 'Monstre à carapace', hp: 4, damage: 25, speed: 65, color: '#ffb8d2' };
  const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const living = () => game.planets.filter(p => p.hp > 0);
  const selected = () => game.planets[game.selected];
  const tell = text => { $('notice').textContent = text; };

  function record() {
    if (game.score <= best) return;
    best = game.score;
    try { localStorage.setItem('gardiens-record', String(best)); } catch { /* Mode privé ou stockage indisponible. */ }
  }

  function reset() {
    game = {
      mode: $('mode').value,
      ship: { x: W / 2, y: H / 2, radius: 13, hp: 100, invincible: 0, cooldown: 0 },
      planets: [
        { name: 'Aurore', x: 240, y: 380, radius: 44, color: '#74d6ba' },
        { name: 'Céleste', x: 510, y: 470, radius: 49, color: '#79baff' },
        { name: 'Saphir', x: 780, y: 345, radius: 40, color: '#e7b976' }
      ].map(p => ({ ...p, hp: 100, houses: 1, bases: 0, species: 'dancers', population: 2, growth: 0, shield: 0 })),
      selected: 0, score: 0, credits: 60, wave: 1, remaining: 7, spawn: 2,
      breakTime: 0, enemies: [], bullets: [], lasers: [], effects: [],
      lost: 0, sacrifices: 0, kills: 0
    };
    aim.x = W / 2; aim.y = 0;
    clearInput();
    bank = 0; cannon = 0; closeConsole(); syncCannons();
    $('tool').value = 'pilot';
    state = 'playing';
    $('overlay').hidden = true;
    $('pause').disabled = false;
    $('pause').textContent = 'Pause (P)';
    makePlanetButtons();
    tell(creative() ? 'Création libre : créez des mondes et choisissez les attaques dans l’atelier.' : 'Mission lancée ! Sélectionnez une colonie pour la développer ou la protéger.');
    updateUI();
    canvas.focus({ preventScroll: true });
  }

  function makePlanetButtons() {
    $('planets').replaceChildren();
    game.planets.forEach((p, i) => {
      const button = document.createElement('button');
      button.className = 'planet-card';
      button.append(document.createElement('strong'), document.createElement('span'));
      button.addEventListener('click', () => { game.selected = i; updateUI(); });
      $('planets').append(button);
    });
  }

  function updateUI() {
    if (!game) return;
    $('score').textContent = game.score;
    $('wave').textContent = creative() ? 'Libre' : `${game.wave} / ${MAX_WAVES}`;
    $('health').textContent = `${Math.ceil(game.ship.hp)} %`;
    $('credits').textContent = creative() ? 'Illimités' : game.credits;
    $('best').textContent = best;
    [...$('planets').children].forEach((b, i) => {
      const p = game.planets[i];
      b.firstChild.textContent = `${p.name}${p.hp <= 0 ? ' — détruite' : ''}`;
      b.lastChild.textContent = `Santé ${Math.ceil(p.hp)} % · ${p.houses} maison(s) · ${p.bases} base(s) · ${p.population} hab.${p.shield > 0 ? ' · Bouclier actif' : ''}`;
      b.setAttribute('aria-pressed', String(game.selected === i));
    });
    const p = selected(), available = state === 'playing' && p.hp > 0;
    $('selected-name').textContent = p.name;
    $('selected-info').textContent = p.hp > 0
      ? `${p.houses} / 8 maisons · ${p.bases} / 3 bases · ${p.population} / ${capacity(p)} habitants · Santé ${Math.ceil(p.hp)} %`
      : 'Ce monde a disparu. Sélectionnez une autre colonie.';
    $('build').disabled = !available || p.houses >= 8;
    $('protect').disabled = !available || p.shield > 0;
    $('sacrifice').disabled = !available;
    $('base').disabled = !available || p.bases >= 3;
    $('settle').disabled = !available || p.population >= capacity(p);
    $('target-attack').disabled = !available || !creative();
    $('build').textContent = `Construire une maison · ${creative() ? 'gratuit' : '30 crédits'}`;
    $('base').textContent = `Construire une base · ${creative() ? 'gratuit' : '60 crédits'}`;
    $('settle').textContent = `Accueillir 5 habitants · ${creative() ? 'gratuit' : '10 crédits'}`;
    $('mode').hidden = state !== 'welcome' && state !== 'lost' && state !== 'won';
    $('losses').textContent = `Planètes perdues : ${game.lost} · Sacrifices : ${game.sacrifices} · Menaces neutralisées : ${game.kills}`;
  }

  function clearInput() {
    keys.clear(); touches.clear(); fingers.clear(); turns.clear(); firing = false; autoFire = false;
    $('auto-fire').setAttribute('aria-pressed', 'false'); $('auto-fire').textContent = 'Tir continu : arrêt';
  }

  function pause() {
    if ($('confirm').open || !['playing', 'paused'].includes(state)) return;
    clearInput();
    state = state === 'playing' ? 'paused' : 'playing';
    $('overlay').hidden = state === 'playing';
    $('overlay-title').textContent = 'Mission en pause';
    $('overlay-text').textContent = 'La galaxie vous attend. Aucune attaque ni croissance pendant la pause.';
    $('start').textContent = 'Reprendre';
    $('pause').textContent = state === 'paused' ? 'Reprendre (P)' : 'Pause (P)';
    if (state === 'playing') pilot();
    updateUI();
  }

  function finish(won) {
    state = won ? 'won' : 'lost';
    clearInput(); record(); updateUI();
    $('pause').disabled = true;
    $('overlay').hidden = false;
    $('overlay-title').textContent = won ? 'Les colonies sont sauvées !' : 'La mission est terminée';
    $('overlay-text').textContent = `${won ? 'Six vagues repoussées.' : game.ship.hp <= 0 ? 'Votre vaisseau a été détruit.' : 'Il ne reste aucune planète colonisée.'} Score : ${game.score}. Habitants sauvés : ${living().reduce((sum, p) => sum + p.population, 0)}. Sacrifices : ${game.sacrifices}.`;
    $('start').textContent = 'Recommencer';
    tell($('overlay-text').textContent);
    $('start').focus({ preventScroll: true });
  }

  function effect(x, y, color, size = 30) {
    game.effects.push({ x, y, color, size, life: reducedMotion ? .4 : .9, max: reducedMotion ? .4 : .9 });
    if (game.effects.length > 60) game.effects.shift();
  }

  function destroyPlanet(p, voluntary) {
    if (p.hp <= 0) return;
    p.hp = 0; p.houses = 0; p.bases = 0; p.population = 0; p.shield = 0;
    game.lost++;
    if (voluntary) { game.sacrifices++; game.score = Math.max(0, game.score - 100); }
    effect(p.x, p.y, '#ffe0aa', 145);
    tell(`${p.name} a été détruite${voluntary ? ' volontairement (−100 points, minimum 0)' : ' par les menaces'}. Maisons et habitants perdus.`);
    if (!living().length) finish(false);
    updateUI();
  }

  function damagePlanet(p, amount) {
    if (p.hp <= 0) return;
    if (p.shield > 0) { effect(p.x, p.y, '#a0e9d5', 60); return; }
    if (p.hp <= amount) { destroyPlanet(p, false); return; }
    p.hp -= amount;
    if (p.houses > 0) p.houses--;
    else p.bases = Math.max(0, p.bases - 1);
    p.population = Math.min(capacity(p), Math.max(0, p.population - 3));
    effect(p.x, p.y, '#ff8e9f', 55);
    tell(`${p.name} attaquée : −${amount} santé, bâtiments et habitants menacés. Survivants : ${p.population}.`);
    updateUI();
  }

  function damageShip(amount) {
    const s = game.ship;
    if (s.invincible > 0) return;
    s.hp = Math.max(0, s.hp - amount); s.invincible = 1.2;
    effect(s.x, s.y, '#ff8e9f');
    tell(`Vaisseau touché : −${amount} coque. Éloignez-vous de la menace !`);
    if (!s.hp) finish(false);
  }

  function spawn() {
    const pool = game.wave === 1 ? ['meteor', 'comet'] : ['meteor', 'comet', 'monster', 'missile'];
    const kind = pool[Math.floor(Math.random() * pool.length)];
    const side = Math.floor(Math.random() * 3);
    const planets = living();
    const target = kind === 'missile' || Math.random() < .25 ? game.ship : planets[Math.floor(Math.random() * planets.length)];
    if (!target) return;
    game.enemies.push({
      ...kinds[kind], kind, x: side === 0 ? -25 : side === 1 ? W + 25 : Math.random() * W,
      y: side === 2 ? -25 : Math.random() * H * .35, target,
      speed: kinds[kind].speed * (1 + (game.wave - 1) * .09), attack: 4, angle: 0
    });
  }

  function shoot() {
    const s = game.ship, origin = cockpit() ? toWorld(cannonPositions[cannon]) : s;
    const angle = Math.atan2(aim.y - origin.y, aim.x - origin.x);
    const missile = $('weapon').value === 'missile', speed = missile ? 300 : 470;
    game.bullets.push({ x: origin.x, y: origin.y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 4, missile });
    s.cooldown = missile ? .55 : .16;
  }

  function update(dt) {
    const s = game.ship;
    s.invincible = Math.max(0, s.invincible - dt);
    s.cooldown = Math.max(0, s.cooldown - dt);
    const moves = new Set(touches.values());
    let dx = Number(keys.has('arrowright') || keys.has('d') || moves.has('right')) - Number(keys.has('arrowleft') || keys.has('a') || (!cockpit() && keys.has('q')) || moves.has('left'));
    let dy = Number(keys.has('arrowdown') || keys.has('s') || moves.has('down')) - Number(keys.has('arrowup') || keys.has('w') || keys.has('z') || moves.has('up'));
    const norm = Math.hypot(dx, dy) || 1;
    s.x = Math.max(16, Math.min(W - 16, s.x + dx / norm * 225 * dt));
    s.y = Math.max(16, Math.min(H - 16, s.y + dy / norm * 225 * dt));
    if (cockpit() && $('tool').value === 'pilot') {
      const turn = Math.max(-1, Math.min(1, [...turns.values()].reduce((sum, value) => sum + value, 0) + Number(keys.has('e')) - Number(keys.has('q'))));
      bank = ((bank + turn * dt * (reducedMotion ? .45 : .9)) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
    }
    $('heading').textContent = `${Math.round(bank * 180 / Math.PI) % 360}°`;
    if ($('tool').value === 'pilot' && (autoFire || firing || [...fingers.values()].includes('aim') || keys.has(' ') || moves.has('fire')) && s.cooldown <= 0) shoot();
    for (const p of living()) {
      p.shield = Math.max(0, p.shield - dt);
      p.growth += dt;
      if (p.growth >= 4) { p.growth -= 4; p.population = Math.min(p.population + 1, capacity(p)); }
    }
    if (!creative() && game.remaining > 0) {
      game.spawn -= dt;
      if (game.spawn <= 0) { spawn(); game.remaining--; game.spawn = Math.max(.8, 2.8 - game.wave * .22); }
    }
    for (const b of game.bullets) {
      b.x += b.vx * dt; b.y += b.vy * dt; b.life -= dt;
      for (const e of game.enemies) {
        if (e.hp <= 0 || b.life <= 0 || distance(b, e) > e.radius + 4) continue;
        e.hp -= b.missile ? 4 : 1; b.life = 0; effect(e.x, e.y, e.color, b.missile ? 65 : 18);
        if (e.hp <= 0) {
          game.kills++; game.score += e.reward * 10; game.credits += e.reward;
          effect(e.x, e.y, e.color, 40); record();
        }
      }
    }
    game.bullets = game.bullets.filter(b => b.life > 0);
    for (const e of game.enemies) {
      if (e.hp <= 0) continue;
      if (e.target !== s && e.target.hp <= 0) e.target = living()[0] || s;
      e.angle = Math.atan2(e.target.y - e.y, e.target.x - e.x);
      e.x += Math.cos(e.angle) * e.speed * dt; e.y += Math.sin(e.angle) * e.speed * dt;
      if (e.kind === 'monster') {
        e.attack -= dt;
        if (e.attack <= 0) {
          const angle = Math.atan2(s.y - e.y, s.x - e.x);
          game.lasers.push({ x: e.x, y: e.y, dx: Math.cos(angle), dy: Math.sin(angle), age: 0, hit: false });
          e.attack = 5;
        }
      }
      if (distance(e, s) < e.radius + s.radius) { damageShip(e.damage); effect(e.x, e.y, e.color, 50); e.hp = 0; }
      else {
        const p = living().find(p => distance(e, p) < e.radius + p.radius);
        if (p) { damagePlanet(p, e.damage); effect(e.x, e.y, e.color, 70); e.hp = 0; }
        else if (e.fixed && distance(e, e.target) < Math.max(5, e.speed * dt)) { effect(e.x, e.y, e.color, 60); e.hp = 0; }
      }
      if (state !== 'playing') return;
    }
    game.enemies = game.enemies.filter(e => e.hp > 0);
    for (const beam of game.lasers) {
      beam.age += dt;
      if (beam.age < 1.25 || beam.hit) continue;
      const along = (s.x - beam.x) * beam.dx + (s.y - beam.y) * beam.dy;
      const across = Math.abs((s.x - beam.x) * beam.dy - (s.y - beam.y) * beam.dx);
      if (along >= 0 && across < s.radius + 5) { damageShip(15); beam.hit = true; }
      for (const p of living()) {
        const forward = (p.x - beam.x) * beam.dx + (p.y - beam.y) * beam.dy;
        const perpendicular = Math.abs((p.x - beam.x) * beam.dy - (p.y - beam.y) * beam.dx);
        if (forward >= 0 && perpendicular < p.radius + 5 && !beam.hit) { damagePlanet(p, 10); beam.hit = true; }
      }
      if (state !== 'playing') return;
    }
    game.lasers = game.lasers.filter(b => b.age < 1.65);
    if (!creative() && !game.remaining && !game.enemies.length && !game.lasers.length) {
      game.breakTime += dt;
      if (game.breakTime > 4) {
        game.score += 250; game.credits += 25; s.hp = Math.min(100, s.hp + 15); record();
        if (game.wave === MAX_WAVES) { finish(true); return; }
        game.wave++; game.remaining = 5 + game.wave * 2; game.spawn = 2; game.breakTime = 0;
        tell(`Vague ${game.wave} : +25 crédits, +15 coque. Préparez vos boucliers !`);
      }
    }
    uiClock += dt;
    if (uiClock > .2) { updateUI(); uiClock = 0; }
  }

  function draw() {
    ctx.fillStyle = '#060c1c'; ctx.fillRect(0, 0, W, H);
    ctx.save();
    if (cockpit()) { ctx.translate(W / 2, H / 2); ctx.rotate(bank); ctx.translate(-W / 2, -H / 2); }
    ctx.fillStyle = '#9cb8d0';
    for (const star of stars) { ctx.beginPath(); ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2); ctx.fill(); }
    ctx.font = '15px system-ui'; ctx.textAlign = 'center';
    for (let i = 0; i < 8; i++) {
      const angle = i * Math.PI / 4;
      const x = W / 2 + Math.cos(angle) * 255, y = H / 2 + Math.sin(angle) * 255;
      ctx.fillStyle = ['#ffe18a', '#9ddeff', '#ffb8d2', '#a0e9d5'][i % 4];
      ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillText(`Étoile ${i + 1} · ${i * 45}°`, x, y - 12);
    }
    if (!game) { ctx.restore(); return; }
    for (const p of living()) {
      const atmosphere = ctx.createRadialGradient(p.x, p.y, p.radius * .85, p.x, p.y, p.radius + 22);
      atmosphere.addColorStop(0, p.color + '88'); atmosphere.addColorStop(1, p.color + '00');
      ctx.fillStyle = atmosphere; ctx.beginPath(); ctx.arc(p.x, p.y, p.radius + 22, 0, Math.PI * 2); ctx.fill();
      if (p === selected() || p.shield > 0) {
        ctx.strokeStyle = p.shield > 0 ? '#a0ffed' : '#ffffff';
        ctx.lineWidth = p.shield > 0 ? 4 : 1;
        ctx.setLineDash(p.shield > 0 ? [] : [5, 6]);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.radius + 9, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
      }
      const surface = ctx.createRadialGradient(p.x - 18, p.y - 18, 2, p.x, p.y, p.radius);
      surface.addColorStop(0, '#e0ffff'); surface.addColorStop(.4, p.color); surface.addColorStop(1, '#183147');
      ctx.fillStyle = surface; ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#254c5366';
      for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.ellipse(p.x - 14 + i * 12, p.y - 18 + i * 13, 14, 7, i, 0, Math.PI * 2); ctx.fill(); }
      ctx.fillStyle = '#060c1c38'; ctx.beginPath(); ctx.ellipse(p.x + 12, p.y, p.radius * .65, p.radius, 0, -Math.PI / 2, Math.PI / 2); ctx.fill();
      for (let i = 0; i < p.houses; i++) {
        const a = -Math.PI + i * Math.PI * 2 / 8, x = p.x + Math.cos(a) * (p.radius - 8), y = p.y + Math.sin(a) * (p.radius - 8);
        ctx.fillStyle = '#f5f2dd'; ctx.fillRect(x - 5, y - 5, 10, 9);
        ctx.fillStyle = '#263456'; ctx.beginPath(); ctx.moveTo(x - 7, y - 5); ctx.lineTo(x, y - 12); ctx.lineTo(x + 7, y - 5); ctx.fill();
      }
      for (let i = 0; i < p.bases; i++) {
        const x = p.x - 24 + i * 24;
        ctx.fillStyle = '#a9d8e8'; ctx.beginPath(); ctx.arc(x, p.y + 10, 11, Math.PI, 0); ctx.fill();
        ctx.fillStyle = '#c0d5e4'; ctx.fillRect(x - 11, p.y + 10, 22, 9);
        ctx.fillStyle = '#163854'; ctx.fillRect(x - 3, p.y + 9, 6, 10);
      }
      for (let i = 0; i < Math.min(p.population, 12); i++) {
        const x = p.x - 22 + (i % 6) * 9, y = p.y - 14 + Math.floor(i / 6) * 13;
        const step = reducedMotion ? 0 : Math.sin(last / 300 + i) * 2;
        ctx.fillStyle = p.species === 'glow' ? '#fff7a6' : p.species === 'hats' ? '#f6b1ed' : '#b2ffd2';
        ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill(); ctx.fillRect(x - 2, y + 3, 4, 4);
        ctx.strokeStyle = '#e8ffff'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x, y + 6); ctx.lineTo(x - 3, y + 10 + step); ctx.moveTo(x, y + 6); ctx.lineTo(x + 3, y + 10 - step); ctx.stroke();
        if (p.species === 'hats') { ctx.fillStyle = '#ffe292'; ctx.beginPath(); ctx.moveTo(x - 4, y - 2); ctx.lineTo(x, y - 9); ctx.lineTo(x + 4, y - 2); ctx.fill(); }
      }
      ctx.fillStyle = '#eef5ff'; ctx.font = '15px system-ui'; ctx.textAlign = 'center';
      ctx.fillText(`${p.name} · ${p.population} hab.`, p.x, p.y + p.radius + 29);
      ctx.fillStyle = '#3f283c'; ctx.fillRect(p.x - 32, p.y + p.radius + 36, 64, 5);
      ctx.fillStyle = '#a0e9d5'; ctx.fillRect(p.x - 32, p.y + p.radius + 36, 64 * p.hp / 100, 5);
    }
    for (const beam of game.lasers) {
      ctx.strokeStyle = beam.age < 1.25 ? '#ffc2dd' : '#ff72b6';
      ctx.lineWidth = beam.age < 1.25 ? 2 : 7; ctx.setLineDash(beam.age < 1.25 ? [10, 12] : []);
      ctx.beginPath(); ctx.moveTo(beam.x, beam.y); ctx.lineTo(beam.x + beam.dx * 1300, beam.y + beam.dy * 1300); ctx.stroke(); ctx.setLineDash([]);
      if (beam.age < 1.25) { ctx.fillStyle = '#ffe4ee'; ctx.font = '13px system-ui'; ctx.fillText('⚠ LASER', beam.x, beam.y - 28); }
    }
    for (const e of game.enemies) {
      ctx.save(); ctx.translate(e.x, e.y); ctx.rotate(e.angle); ctx.fillStyle = e.color; ctx.strokeStyle = e.color; ctx.lineWidth = 3;
      if (e.kind === 'comet') {
        ctx.beginPath(); ctx.moveTo(-e.radius, -7); ctx.lineTo(-55, 0); ctx.lineTo(-e.radius, 7); ctx.fill();
      }
      if (e.kind === 'missile') {
        ctx.beginPath(); ctx.moveTo(13, 0); ctx.lineTo(-10, -7); ctx.lineTo(-5, 0); ctx.lineTo(-10, 7); ctx.closePath(); ctx.fill();
      } else {
        ctx.beginPath(); ctx.arc(0, 0, e.radius, 0, Math.PI * 2); ctx.fill();
        if (e.kind === 'monster' || e.kind === 'swarm') {
          for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.moveTo(-12, i * 12); ctx.quadraticCurveTo(-35, i * 20 + 9, -27, i * 20 - 8); ctx.stroke(); }
          ctx.fillStyle = '#16102a'; ctx.fillRect(4, -10, 6, 6); ctx.fillRect(4, 4, 6, 6);
        } else { ctx.fillStyle = '#060c1c66'; ctx.beginPath(); ctx.arc(3, -4, 4, 0, Math.PI * 2); ctx.fill(); }
      }
      ctx.restore();
    }
    ctx.strokeStyle = '#a4ffed'; ctx.lineWidth = 3;
    for (const b of game.bullets) {
      ctx.strokeStyle = b.missile ? '#ffc084' : '#a4ffed'; ctx.lineWidth = b.missile ? 6 : 3;
      ctx.beginPath(); ctx.moveTo(b.x, b.y); ctx.lineTo(b.x - b.vx * .03, b.y - b.vy * .03); ctx.stroke();
    }
    const s = game.ship;
    if (s.hp > 0) {
      if (!cockpit()) {
      ctx.save(); ctx.translate(s.x, s.y); ctx.rotate(Math.atan2(aim.y - s.y, aim.x - s.x));
      ctx.fillStyle = '#7b9fb8';
      ctx.beginPath(); ctx.moveTo(12, 0); ctx.lineTo(-17, -24); ctx.lineTo(-23, -23); ctx.lineTo(-13, 0); ctx.lineTo(-23, 23); ctx.lineTo(-17, 24); ctx.closePath(); ctx.fill();
      ctx.fillStyle = s.invincible > 0 ? '#ffbdcc' : '#ecf6ff';
      ctx.beginPath(); ctx.moveTo(29, 0); ctx.lineTo(6, -8); ctx.lineTo(-20, -7); ctx.lineTo(-20, 7); ctx.lineTo(6, 8); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#25475f'; ctx.fillRect(-19, -21, 13, 5); ctx.fillRect(-19, 16, 13, 5);
      ctx.fillStyle = '#75e7ff'; ctx.beginPath(); ctx.ellipse(8, 0, 8, 4, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffbd78'; ctx.beginPath(); ctx.moveTo(-20, -5); ctx.lineTo(-32, 0); ctx.lineTo(-20, 5); ctx.fill(); ctx.restore();
      } else {
        ctx.strokeStyle = '#89dce3'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(s.x, s.y, 10, 0, Math.PI * 2); ctx.stroke();
        ctx.font = '12px system-ui'; ctx.fillStyle = '#c1f7ff'; ctx.textAlign = 'center'; ctx.fillText('NAV', s.x, s.y + 24);
      }
      ctx.strokeStyle = '#ffe18a'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(aim.x, aim.y, 12, 0, Math.PI * 2);
      ctx.moveTo(aim.x - 20, aim.y); ctx.lineTo(aim.x - 7, aim.y);
      ctx.moveTo(aim.x + 7, aim.y); ctx.lineTo(aim.x + 20, aim.y);
      ctx.moveTo(aim.x, aim.y - 20); ctx.lineTo(aim.x, aim.y - 7);
      ctx.moveTo(aim.x, aim.y + 7); ctx.lineTo(aim.x, aim.y + 20); ctx.stroke();
    }
    for (const fx of game.effects) {
      const progress = 1 - fx.life / fx.max;
      ctx.globalAlpha = fx.life / fx.max; ctx.strokeStyle = fx.color; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(fx.x, fx.y, reducedMotion ? fx.size * .5 : 5 + progress * fx.size, 0, Math.PI * 2); ctx.stroke();
      if (!reducedMotion) {
        for (let i = 0; i < 12; i++) {
          const a = i * Math.PI / 6, r = progress * fx.size;
          ctx.fillStyle = fx.color; ctx.fillRect(fx.x + Math.cos(a) * r, fx.y + Math.sin(a) * r, 4, 4);
        }
      }
      ctx.globalAlpha = 1;
    }
    if (game.breakTime > 0 && state === 'playing') {
      ctx.fillStyle = '#eef5ff'; ctx.font = '22px system-ui'; ctx.textAlign = 'center';
      ctx.fillText('Vague repoussée · Préparez vos colonies', W / 2, 55);
    }
    ctx.restore();
    if (cockpit()) {
      const targetX = W / 2 + (aim.x - W / 2) * Math.cos(bank) - (aim.y - H / 2) * Math.sin(bank);
      const targetY = H / 2 + (aim.x - W / 2) * Math.sin(bank) + (aim.y - H / 2) * Math.cos(bank);
      cannonPositions.forEach((origin, index) => {
        ctx.save(); ctx.translate(origin.x, origin.y); ctx.rotate(Math.atan2(targetY - origin.y, targetX - origin.x));
        ctx.fillStyle = index === cannon ? '#ffe18a' : '#93afc4';
        ctx.fillRect(-12, -8, 24, 16); ctx.fillRect(0, -4, 28, 8);
        ctx.fillStyle = '#122639'; ctx.fillRect(20, -3, 8, 6); ctx.restore();
      });
    }
  }

  function frame(time) {
    const dt = Math.min((time - last) / 1000 || 0, .04); last = time;
    if (state === 'playing') update(dt);
    if (game && !['paused', 'confirming'].includes(state)) {
      game.effects.forEach(fx => { fx.life -= dt; });
      game.effects = game.effects.filter(fx => fx.life > 0);
    }
    draw(); requestAnimationFrame(frame);
  }

  $('start').addEventListener('click', () => { if (state === 'paused') pause(); else reset(); });
  $('pause').addEventListener('click', pause);
  function syncCannons() {
    document.querySelectorAll('[data-cannon]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.cannon) === cannon)));
  }
  document.querySelectorAll('[data-cannon]').forEach(button => {
    button.addEventListener('click', () => {
      cannon = Number(button.dataset.cannon); syncCannons();
      tell(`Canon ${cannon + 1} sélectionné. Fixez la cible puis activez le tir.`);
    });
  });
  $('auto-fire').addEventListener('click', () => {
    if (state !== 'playing' || $('tool').value !== 'pilot') return;
    autoFire = !autoFire;
    $('auto-fire').setAttribute('aria-pressed', String(autoFire));
    $('auto-fire').textContent = `Tir continu : ${autoFire ? 'actif' : 'arrêt'}`;
  });
  document.querySelectorAll('[data-turn]').forEach(button => {
    button.addEventListener('pointerdown', event => {
      if (state !== 'playing') return;
      event.preventDefault(); button.setPointerCapture(event.pointerId);
      turns.set(event.pointerId, Number(button.dataset.turn));
    });
    for (const name of ['pointerup', 'pointercancel', 'lostpointercapture']) button.addEventListener(name, event => turns.delete(event.pointerId));
    button.addEventListener('click', event => {
      if (event.detail === 0 && state === 'playing') bank = (bank + Number(button.dataset.turn) * Math.PI / 12 + Math.PI * 2) % (Math.PI * 2);
    });
  });
  $('center-view').addEventListener('click', () => { bank = 0; turns.clear(); });
  $('pilot').addEventListener('click', () => { if (state === 'paused') pause(); else pilot(); });
  $('menu').addEventListener('click', () => {
    const open = $('console').hidden;
    clearInput(); $('console').hidden = !open; $('menu').setAttribute('aria-expanded', String(open));
    if (open) $('close-menu').focus({ preventScroll: true });
    else canvas.focus({ preventScroll: true });
  });
  $('close-menu').addEventListener('click', () => { closeConsole(); canvas.focus({ preventScroll: true }); });
  $('view').addEventListener('change', () => {
    bank = 0; document.querySelector('.arena').classList.toggle('external-view', !cockpit());
  });
  $('fullscreen').addEventListener('click', async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
      else { tell('Plein écran natif indisponible : le jeu occupe déjà la fenêtre.'); return; }
    } catch { tell('Le navigateur a refusé le plein écran. Le jeu reste utilisable dans la fenêtre.'); }
  });
  document.addEventListener('fullscreenchange', () => {
    $('fullscreen').textContent = document.fullscreenElement ? 'Quitter plein écran' : 'Plein écran';
    clearInput();
  });
  $('build').addEventListener('click', () => {
    const p = selected();
    if (state !== 'playing' || p.hp <= 0 || p.houses >= 8) return;
    if (!spend(COST)) return;
    p.houses++; effect(p.x, p.y, '#a0e9d5', 60);
    tell(`Maison construite sur ${p.name} ! Capacité : ${capacity(p)} habitants.`); updateUI();
  });
  $('base').addEventListener('click', () => {
    const p = selected();
    if (state !== 'playing' || p.hp <= 0 || p.bases >= 3 || !spend(60)) return;
    p.bases++; effect(p.x, p.y, '#86ddff', 60); tell(`Base construite : ${capacity(p)} places sur ${p.name}.`); updateUI();
  });
  $('settle').addEventListener('click', () => {
    const p = selected();
    if (state !== 'playing' || p.hp <= 0 || p.population >= capacity(p) || !spend(10)) return;
    p.species = $('species').value; p.population = Math.min(capacity(p), p.population + 5);
    tell(`${p.name} : ${p.population} habitants. Apparence : ${$('species').selectedOptions[0].textContent}.`); updateUI();
  });
  $('protect').addEventListener('click', () => {
    const p = selected();
    if (state !== 'playing' || p.hp <= 0 || p.shield > 0) return;
    if (!spend(20)) return;
    p.shield = 8; tell(`${p.name} protégée pendant 8 secondes.`); updateUI();
  });
  $('sacrifice').addEventListener('click', () => {
    if (state !== 'playing' || selected().hp <= 0) return;
    confirmationPlanet = selected(); state = 'confirming'; clearInput(); updateUI();
    $('confirm-text').textContent = `${confirmationPlanet.name} : ${confirmationPlanet.houses} maison(s), ${confirmationPlanet.bases} base(s) et ${confirmationPlanet.population} habitant(s) seront perdus. Pénalité : 100 points (minimum 0).${living().length === 1 ? ' C’est votre dernière planète : sa destruction termine la partie par une défaite.' : ''}`;
    $('confirm').showModal();
  });
  $('confirm').addEventListener('close', () => {
    if (state !== 'confirming') return;
    state = 'playing';
    if ($('confirm').returnValue === 'destroy') destroyPlanet(confirmationPlanet, true);
    else tell('Destruction annulée. La colonie est intacte.');
    confirmationPlanet = null; updateUI();
  });
  function point(event) {
    const rect = canvas.getBoundingClientRect();
    return toWorld({ x: Math.max(0, Math.min(W, (event.clientX - rect.left) / rect.width * W)), y: Math.max(0, Math.min(H, (event.clientY - rect.top) / rect.height * H)) });
  }
  function launch(target) {
    if (!creative() || state !== 'playing') { tell('Les menaces personnalisées sont disponibles en mode Création libre.'); return; }
    if (game.enemies.length >= 60) { tell('Limite de 60 menaces atteinte.'); return; }
    const kind = $('threat').value;
    const creature = kind === 'monster' || kind === 'swarm';
    const destination = creature ? living().reduce((nearest, p) => distance(p, target) < distance(nearest, target) ? p : nearest, game.ship) : { x: target.x, y: target.y };
    game.enemies.push({ ...kinds[kind], kind, x: creature ? target.x : Math.max(20, Math.min(W - 20, target.x - 180)), y: creature ? target.y : -30, target: destination, fixed: !creature, attack: 4, angle: 0 });
    effect(target.x, target.y, '#ffb785', 20);
    tell(creature ? `${kinds[kind].label} apparu au point choisi !` : `${kinds[kind].label} en route vers la cible !`);
    return true;
  }
  $('target-attack').addEventListener('click', () => { if (selected().hp > 0) launch(selected()); });
  function chooseTool() {
    clearInput(); closeConsole();
    $('action-hint').textContent = $('tool').value === 'pilot' ? 'Pilotage • 1 doigt : position · 2e doigt : visée et tir' : `${$('tool').selectedOptions[0].textContent} • Touchez la carte · Piloter pour annuler`;
    canvas.focus({ preventScroll: true });
  }
  $('tool').addEventListener('change', chooseTool);
  const drawings = {
    meteor: '<circle cx="35" cy="24" r="17" fill="#c5af91"/><circle cx="30" cy="18" r="5" fill="#796857"/><circle cx="42" cy="30" r="4" fill="#796857"/>',
    heavy: '<path d="M15 12L42 4 61 19 52 40 24 44 8 29Z" fill="#ad9379"/><circle cx="32" cy="24" r="8" fill="#6a594c"/>',
    comet: '<path d="M42 10L2 24 42 38Z" fill="#75dfff"/><circle cx="48" cy="24" r="13" fill="#dbf9ff"/>',
    monster: '<path d="M25 12Q3 2 13 26T8 42M28 32Q10 48 7 33" stroke="#c5a0ff" stroke-width="5" fill="none"/><ellipse cx="42" cy="24" rx="21" ry="17" fill="#c5a0ff"/><circle cx="45" cy="19" r="4" fill="#15102b"/><circle cx="55" cy="24" r="4" fill="#15102b"/>',
    swarm: '<path d="M17 12L8 5M17 35L7 43M55 12L65 5M55 35L65 43" stroke="#ffb8d2" stroke-width="4"/><ellipse cx="36" cy="24" rx="24" ry="17" fill="#ffb8d2"/><path d="M36 7V41" stroke="#7b4965" stroke-width="3"/><circle cx="46" cy="20" r="3" fill="#101c32"/>',
    missile: '<path d="M5 17L20 24 5 31Z" fill="#ffba6b"/><path d="M20 17H49L67 24 49 31H20Z" fill="#dbeaf7"/><path d="M26 17L19 8H36L42 17M26 31L19 40H36L42 31" fill="#7bb6d2"/>'
  };
  for (const [kind, drawing] of Object.entries(drawings)) {
    const button = document.createElement('button');
    button.innerHTML = `<svg viewBox="0 0 72 48" aria-hidden="true">${drawing}</svg>`;
    button.append(document.createTextNode(kinds[kind].label));
    button.setAttribute('aria-pressed', String($('threat').value === kind));
    button.dataset.kind = kind;
    button.addEventListener('click', () => {
      if (state !== 'playing') { tell('Démarrez ou reprenez la partie pour placer une menace.'); return; }
      if (!creative()) { tell('Les menaces personnalisées nécessitent le mode Création libre.'); return; }
      $('threat').value = kind; $('tool').value = 'attack'; syncGallery(); chooseTool();
    });
    $('threat-gallery').append(button);
  }
  function syncGallery() {
    for (const button of $('threat-gallery').children) button.setAttribute('aria-pressed', String(button.dataset.kind === $('threat').value));
  }
  $('threat').addEventListener('change', syncGallery);
  function spaceAction(position) {
    const tool = $('tool').value;
    if (tool === 'attack') { if (launch(position)) pilot(); return; }
    if (tool === 'select') {
      const i = game.planets.findIndex(p => p.hp > 0 && distance(p, position) < p.radius + 22);
      if (i >= 0) { game.selected = i; updateUI(); pilot(); } else tell('Touchez une planète pour la sélectionner.');
      return;
    }
    if (tool !== 'planet') return;
    if (!creative()) { tell('Créez des planètes dans le mode Création libre.'); return; }
    if (living().length >= 10) { tell('Maximum : 10 planètes vivantes.'); return; }
    const location = { x: Math.max(70, Math.min(W - 70, position.x)), y: Math.max(80, Math.min(H - 90, position.y)) };
    if (living().some(p => distance(p, location) < p.radius + 85)) { tell('Laissez plus d’espace entre les planètes.'); return; }
    const colors = ['#74d6ba', '#79baff', '#e7b976', '#c5a0ff'];
    const p = { ...location, name: `Nova ${game.planets.length + 1}`, radius: 42, color: colors[game.planets.length % colors.length], hp: 100, houses: 0, bases: 0, species: $('species').value, population: 0, growth: 0, shield: 0 };
    const reuse = game.planets.findIndex(p => p.hp <= 0);
    if (reuse >= 0) { game.planets[reuse] = p; game.selected = reuse; }
    else { game.planets.push(p); game.selected = game.planets.length - 1; }
    makePlanetButtons(); updateUI(); effect(p.x, p.y, p.color, 80); tell(`${p.name} créée ! Construisez des maisons ou une base, puis accueillez des habitants.`);
    pilot();
  }
  function moveFinger(event) {
    const position = point(event), role = fingers.get(event.pointerId);
    if (role === 'ship') {
      game.ship.x = Math.max(20, Math.min(W - 20, position.x));
      game.ship.y = Math.max(20, Math.min(H - 20, position.y - 28));
    } else if (role === 'aim' || (event.pointerType === 'mouse' && firing)) Object.assign(aim, position);
  }
  canvas.addEventListener('pointermove', event => { if (state === 'playing' && $('tool').value === 'pilot') moveFinger(event); });
  canvas.addEventListener('pointerdown', event => {
    if (state !== 'playing') return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    event.preventDefault(); canvas.focus({ preventScroll: true }); canvas.setPointerCapture(event.pointerId);
    if ($('tool').value !== 'pilot') { spaceAction(point(event)); return; }
    if (event.pointerType === 'mouse') { Object.assign(aim, point(event)); firing = true; }
    else {
      const roles = [...fingers.values()];
      if (!roles.includes('ship')) fingers.set(event.pointerId, 'ship');
      else if (!roles.includes('aim')) fingers.set(event.pointerId, 'aim');
      moveFinger(event);
    }
  });
  function releasePointer(event) {
    if (event.pointerType === 'mouse') firing = false;
    if (fingers.get(event.pointerId) === 'ship') fingers.clear();
    else fingers.delete(event.pointerId);
  }
  for (const name of ['pointerup', 'pointercancel', 'lostpointercapture']) canvas.addEventListener(name, releasePointer);
  canvas.addEventListener('contextmenu', event => event.preventDefault());
  document.querySelectorAll('[data-move], #fire').forEach(button => {
    button.addEventListener('pointerdown', event => {
      if (state !== 'playing') return;
      event.preventDefault(); button.setPointerCapture(event.pointerId);
      touches.set(event.pointerId, button.dataset.move || 'fire');
    });
    for (const name of ['pointerup', 'pointercancel', 'lostpointercapture']) button.addEventListener(name, event => touches.delete(event.pointerId));
  });
  document.addEventListener('keydown', event => {
    if ($('confirm').open) return;
    const key = event.key.toLowerCase();
    if (key === 'p' || key === 'escape') { event.preventDefault(); if (!event.repeat) pause(); return; }
    if (event.target.closest('input, select, textarea') || (key === ' ' && event.target.closest('button, summary'))) return;
    if (state === 'playing' && event.target === canvas && $('tool').value !== 'pilot') {
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'enter'].includes(key)) {
        event.preventDefault();
        if (key === 'enter') { if (!event.repeat) spaceAction(aim); }
        else {
          aim.x = Math.max(0, Math.min(W, aim.x + (key === 'arrowright' ? 20 : key === 'arrowleft' ? -20 : 0)));
          aim.y = Math.max(0, Math.min(H, aim.y + (key === 'arrowdown' ? 20 : key === 'arrowup' ? -20 : 0)));
        }
      }
      return;
    }
    if (state === 'playing' && ['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd', 'z', 'q', 'e', ' '].includes(key)) { event.preventDefault(); keys.add(key); }
  });
  document.addEventListener('keyup', event => keys.delete(event.key.toLowerCase()));
  window.addEventListener('blur', clearInput);
  document.addEventListener('visibilitychange', () => { if (document.hidden) { clearInput(); if (state === 'playing') pause(); } });
  reset();
  state = 'welcome'; clearInput(); $('overlay').hidden = false; $('pause').disabled = true; updateUI();
  tell('Prêt pour le décollage.');
  $('start').focus({ preventScroll: true });
  requestAnimationFrame(frame);
})();
