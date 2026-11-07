'use strict';

(() => {
  const $ = id => document.getElementById(id);
  const canvas = $('space');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const COST = 30, MAX_WAVES = 6;
  const keys = new Set(), touches = new Map();
  const aim = { x: W / 2, y: 0 };
  let firing = false, state = 'welcome', game, last = 0, uiClock = 0, confirmationPlanet = null;
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
      ship: { x: W / 2, y: H / 2, radius: 13, hp: 100, invincible: 0, cooldown: 0 },
      planets: [
        { name: 'Aurore', x: 240, y: 380, radius: 44, color: '#74d6ba' },
        { name: 'Céleste', x: 510, y: 470, radius: 49, color: '#79baff' },
        { name: 'Saphir', x: 780, y: 345, radius: 40, color: '#e7b976' }
      ].map(p => ({ ...p, hp: 100, houses: 1, population: 2, growth: 0, shield: 0 })),
      selected: 0, score: 0, credits: 60, wave: 1, remaining: 7, spawn: 2,
      breakTime: 0, enemies: [], bullets: [], lasers: [], effects: [],
      lost: 0, sacrifices: 0, kills: 0
    };
    aim.x = W / 2; aim.y = 0;
    clearInput();
    state = 'playing';
    $('overlay').hidden = true;
    $('pause').disabled = false;
    $('pause').textContent = 'Pause (P)';
    makePlanetButtons();
    tell('Mission lancée ! Sélectionnez une colonie pour la développer ou la protéger.');
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
    $('wave').textContent = `${game.wave} / ${MAX_WAVES}`;
    $('health').textContent = `${Math.ceil(game.ship.hp)} %`;
    $('credits').textContent = game.credits;
    $('best').textContent = best;
    [...$('planets').children].forEach((b, i) => {
      const p = game.planets[i];
      b.firstChild.textContent = `${p.name}${p.hp <= 0 ? ' — détruite' : ''}`;
      b.lastChild.textContent = `Santé ${Math.ceil(p.hp)} % · ${p.houses} maison(s) · ${p.population} hab.${p.shield > 0 ? ' · Bouclier actif' : ''}`;
      b.setAttribute('aria-pressed', String(game.selected === i));
    });
    const p = selected(), available = state === 'playing' && p.hp > 0;
    $('selected-name').textContent = p.name;
    $('selected-info').textContent = p.hp > 0
      ? `${p.houses} / 8 maisons · ${p.population} / ${p.houses * 5} habitants · Santé ${Math.ceil(p.hp)} %`
      : 'Ce monde a disparu. Sélectionnez une autre colonie.';
    $('build').disabled = !available || p.houses >= 8;
    $('protect').disabled = !available || p.shield > 0;
    $('sacrifice').disabled = !available;
    $('losses').textContent = `Planètes perdues : ${game.lost} · Sacrifices : ${game.sacrifices} · Menaces neutralisées : ${game.kills}`;
  }

  function clearInput() { keys.clear(); touches.clear(); firing = false; }

  function pause() {
    if ($('confirm').open || !['playing', 'paused'].includes(state)) return;
    clearInput();
    state = state === 'playing' ? 'paused' : 'playing';
    $('overlay').hidden = state === 'playing';
    $('overlay-title').textContent = 'Mission en pause';
    $('overlay-text').textContent = 'La galaxie vous attend. Aucune attaque ni croissance pendant la pause.';
    $('start').textContent = 'Reprendre';
    $('pause').textContent = state === 'paused' ? 'Reprendre (P)' : 'Pause (P)';
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
    p.hp = 0; p.houses = 0; p.population = 0; p.shield = 0;
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
    p.houses = Math.max(0, p.houses - 1);
    p.population = Math.min(p.houses * 5, Math.max(0, p.population - 3));
    effect(p.x, p.y, '#ff8e9f', 55);
    tell(`${p.name} attaquée : −${amount} santé, une maison perdue et population réduite. Reconstruisez !`);
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
    const s = game.ship, angle = Math.atan2(aim.y - s.y, aim.x - s.x);
    game.bullets.push({ x: s.x, y: s.y, vx: Math.cos(angle) * 470, vy: Math.sin(angle) * 470, life: 1.7 });
    s.cooldown = .16;
  }

  function update(dt) {
    const s = game.ship;
    s.invincible = Math.max(0, s.invincible - dt);
    s.cooldown = Math.max(0, s.cooldown - dt);
    const moves = new Set(touches.values());
    let dx = Number(keys.has('arrowright') || keys.has('d') || moves.has('right')) - Number(keys.has('arrowleft') || keys.has('a') || keys.has('q') || moves.has('left'));
    let dy = Number(keys.has('arrowdown') || keys.has('s') || moves.has('down')) - Number(keys.has('arrowup') || keys.has('w') || keys.has('z') || moves.has('up'));
    const norm = Math.hypot(dx, dy) || 1;
    s.x = Math.max(16, Math.min(W - 16, s.x + dx / norm * 225 * dt));
    s.y = Math.max(16, Math.min(H - 16, s.y + dy / norm * 225 * dt));
    if ((firing || keys.has(' ') || moves.has('fire')) && s.cooldown <= 0) shoot();
    for (const p of living()) {
      p.shield = Math.max(0, p.shield - dt);
      p.growth += dt;
      if (p.growth >= 4) { p.growth -= 4; p.population = Math.min(p.population + 1, p.houses * 5); }
    }
    if (game.remaining > 0) {
      game.spawn -= dt;
      if (game.spawn <= 0) { spawn(); game.remaining--; game.spawn = Math.max(.8, 2.8 - game.wave * .22); }
    }
    for (const b of game.bullets) {
      b.x += b.vx * dt; b.y += b.vy * dt; b.life -= dt;
      for (const e of game.enemies) {
        if (e.hp <= 0 || b.life <= 0 || distance(b, e) > e.radius + 4) continue;
        e.hp--; b.life = 0; effect(e.x, e.y, e.color, 18);
        if (e.hp <= 0) {
          game.kills++; game.score += e.reward * 10; game.credits += e.reward;
          effect(e.x, e.y, e.color, 40); record();
        }
      }
    }
    game.bullets = game.bullets.filter(b => b.life > 0 && b.x > -10 && b.x < W + 10 && b.y > -10 && b.y < H + 10);
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
      if (distance(e, s) < e.radius + s.radius) { damageShip(e.damage); e.hp = 0; }
      else {
        const p = living().find(p => distance(e, p) < e.radius + p.radius);
        if (p) { damagePlanet(p, e.damage); e.hp = 0; }
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
    if (!game.remaining && !game.enemies.length && !game.lasers.length) {
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
    ctx.fillStyle = '#9cb8d0';
    for (const star of stars) { ctx.beginPath(); ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2); ctx.fill(); }
    if (!game) return;
    for (const p of living()) {
      if (p === selected() || p.shield > 0) {
        ctx.strokeStyle = p.shield > 0 ? '#a0ffed' : '#ffffff';
        ctx.lineWidth = p.shield > 0 ? 4 : 1;
        ctx.setLineDash(p.shield > 0 ? [] : [5, 6]);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.radius + 9, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
      }
      ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#060c1c38'; ctx.beginPath(); ctx.ellipse(p.x + 12, p.y, p.radius * .65, p.radius, 0, -Math.PI / 2, Math.PI / 2); ctx.fill();
      for (let i = 0; i < p.houses; i++) {
        const a = -Math.PI + i * Math.PI * 2 / 8, x = p.x + Math.cos(a) * (p.radius - 8), y = p.y + Math.sin(a) * (p.radius - 8);
        ctx.fillStyle = '#f5f2dd'; ctx.fillRect(x - 5, y - 5, 10, 9);
        ctx.fillStyle = '#263456'; ctx.beginPath(); ctx.moveTo(x - 7, y - 5); ctx.lineTo(x, y - 12); ctx.lineTo(x + 7, y - 5); ctx.fill();
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
        if (e.kind === 'monster') {
          for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.moveTo(-12, i * 12); ctx.quadraticCurveTo(-35, i * 20 + 9, -27, i * 20 - 8); ctx.stroke(); }
          ctx.fillStyle = '#16102a'; ctx.fillRect(4, -10, 6, 6); ctx.fillRect(4, 4, 6, 6);
        } else { ctx.fillStyle = '#060c1c66'; ctx.beginPath(); ctx.arc(3, -4, 4, 0, Math.PI * 2); ctx.fill(); }
      }
      ctx.restore();
    }
    ctx.strokeStyle = '#a4ffed'; ctx.lineWidth = 3;
    for (const b of game.bullets) { ctx.beginPath(); ctx.moveTo(b.x, b.y); ctx.lineTo(b.x - b.vx * .02, b.y - b.vy * .02); ctx.stroke(); }
    const s = game.ship;
    if (s.hp > 0) {
      ctx.save(); ctx.translate(s.x, s.y); ctx.rotate(Math.atan2(aim.y - s.y, aim.x - s.x));
      ctx.fillStyle = s.invincible > 0 ? '#ffbdcc' : '#ecf6ff';
      ctx.beginPath(); ctx.moveTo(21, 0); ctx.lineTo(-13, -13); ctx.lineTo(-7, 0); ctx.lineTo(-13, 13); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#79baff'; ctx.fillRect(-2, -4, 8, 8); ctx.restore();
      ctx.strokeStyle = '#86ddff'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(aim.x, aim.y, 8, 0, Math.PI * 2); ctx.stroke();
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
  $('build').addEventListener('click', () => {
    const p = selected();
    if (state !== 'playing' || p.hp <= 0 || p.houses >= 8) return;
    if (game.credits < COST) { tell(`Crédits insuffisants : ${COST} nécessaires, ${game.credits} disponibles.`); return; }
    game.credits -= COST; p.houses++; effect(p.x, p.y, '#a0e9d5', 60);
    tell(`Maison construite sur ${p.name} ! Capacité : ${p.houses * 5} habitants.`); updateUI();
  });
  $('protect').addEventListener('click', () => {
    const p = selected();
    if (state !== 'playing' || p.hp <= 0 || p.shield > 0) return;
    if (game.credits < 20) { tell('Bouclier impossible : 20 crédits nécessaires.'); return; }
    game.credits -= 20; p.shield = 8; tell(`${p.name} protégée pendant 8 secondes.`); updateUI();
  });
  $('sacrifice').addEventListener('click', () => {
    if (state !== 'playing' || selected().hp <= 0) return;
    confirmationPlanet = selected(); state = 'confirming'; clearInput(); updateUI();
    $('confirm-text').textContent = `${confirmationPlanet.name} : ${confirmationPlanet.houses} maison(s) et ${confirmationPlanet.population} habitant(s) seront perdus. Pénalité : 100 points (minimum 0).${living().length === 1 ? ' C’est votre dernière planète : sa destruction termine la partie par une défaite.' : ''}`;
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
    aim.x = (event.clientX - rect.left) / rect.width * W;
    aim.y = (event.clientY - rect.top) / rect.height * H;
  }
  canvas.addEventListener('pointermove', point);
  canvas.addEventListener('pointerdown', event => {
    if (state !== 'playing') return;
    event.preventDefault(); point(event); canvas.focus({ preventScroll: true }); canvas.setPointerCapture(event.pointerId);
    if (event.pointerType === 'mouse' && event.button === 0) firing = true;
  });
  canvas.addEventListener('pointerup', () => { firing = false; });
  canvas.addEventListener('pointercancel', () => { firing = false; });
  canvas.addEventListener('lostpointercapture', () => { firing = false; });
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
    if (state === 'playing' && ['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd', 'z', 'q', ' '].includes(key)) { event.preventDefault(); keys.add(key); }
  });
  document.addEventListener('keyup', event => keys.delete(event.key.toLowerCase()));
  window.addEventListener('blur', () => { clearInput(); if (state === 'playing') pause(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) { clearInput(); if (state === 'playing') pause(); } });
  reset();
  state = 'welcome'; clearInput(); $('overlay').hidden = false; $('pause').disabled = true; updateUI();
  tell('Prêt pour le décollage.');
  $('start').focus({ preventScroll: true });
  requestAnimationFrame(frame);
})();
