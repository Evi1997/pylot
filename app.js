'use strict';
const app = document.getElementById('app');
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const md = s => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const norm = s => String(s).replace(/\r/g, '').split('\n').map(l => l.trimEnd()).join('\n').trim();
const day = (offset = 0) => { const d = new Date(); d.setDate(d.getDate() + offset); return d.toLocaleDateString('en-CA'); };

// ---------- state ----------
const KEY = 'pylot-v1';
const S = Object.assign({ xp: 0, done: {}, streak: 0, lastDay: null, day: null, dayXp: 0, goal: 30, review: {}, sound: true, play: '' },
  (() => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } })());
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { /* private mode: progress lives for this visit */ } };
if (S.day !== day()) { S.day = day(); S.dayXp = 0; }

// ---------- course index ----------
const LESSONS = [];
const ITEMS = {};
COURSE.forEach((u, ui) => u.lessons.forEach((l, li) => {
  l.id = `${ui + 1}.${li + 1}`; l.unit = ui; l.n = LESSONS.length;
  LESSONS.push(l);
  l.items.forEach((it, k) => { it.id = `${l.id}.${k + 1}`; ITEMS[it.id] = it; });
}));
const unlocked = l => l.n === 0 || S.done[LESSONS[l.n - 1].id] || S.done[l.id];
const current = () => LESSONS.find(l => !S.done[l.id]);

// ---------- Python runner ----------
const Py = {
  w: null, ready: false, jobs: new Map(), n: 0,
  boot() {
    if (this.w) return;
    this.w = new Worker('py-worker.js');
    this.w.onmessage = ({ data: d }) => {
      if (d.type === 'ready') { this.ready = true; document.querySelectorAll('.py-status').forEach(e => e.remove()); return; }
      const j = this.jobs.get(d.id);
      if (!j) return;
      if (d.type === 'started') { j.timer = setTimeout(() => this.kill(), 10000); return; }
      clearTimeout(j.timer); this.jobs.delete(d.id); j.resolve(d);
    };
  },
  kill() {
    this.w.terminate(); this.w = null; this.ready = false;
    this.jobs.forEach(j => { clearTimeout(j.timer); j.resolve({ ok: false, out: '', error: 'TimeoutError: ran for over 10 seconds' }); });
    this.jobs.clear(); this.boot();
  },
  run(code, test) {
    this.boot();
    const id = ++this.n;
    return new Promise(resolve => { this.jobs.set(id, { resolve }); this.w.postMessage({ id, code, test }); });
  },
};

const TIPS = [
  [/TimeoutError/, () => 'Your code ran too long. Is there a loop that never ends?'],
  [/NameError: name '(.+?)' is not defined/, m => `Python doesn't know \`${m[1]}\` yet. Check the spelling, define it first, and put text in quotes.`],
  [/IndentationError/, () => 'Indentation is off. Lines inside if/for/def need 4 spaces, and lines at the same level must line up.'],
  [/SyntaxError/, () => "Python couldn't read a line. Look for a missing colon, bracket or quote."],
  [/TypeError: (can only concatenate str|unsupported operand)/, () => "You're mixing text and numbers. Use `int()` or `float()` on text, or an f-string to put numbers in text."],
  [/KeyError: (.+)/, m => `There's no key ${m[1]} in that dict. Check spelling and case, or use \`.get()\`.`],
  [/IndexError/, () => 'That position is past the end of the list. Positions start at 0.'],
  [/ValueError: invalid literal for int/, () => "`int()` got text that isn't a whole number."],
  [/AttributeError: '(\w+)' object has no attribute '(\w+)'/, m => `A ${m[1]} has no \`.${m[2]}\`. Check the method name.`],
  [/FileNotFoundError/, () => 'No file with that name. Available: sales.csv, users.json, feedback.txt.'],
  [/ZeroDivisionError/, () => 'You divided by zero, maybe the length of an empty list.'],
  [/JSONDecodeError/, () => "That text isn't valid JSON."],
];
const explain = err => { for (const [re, f] of TIPS) { const m = err.match(re); if (m) return f(m); } return ''; };

function resultHtml(r) {
  if (!r.ok) {
    const tip = explain(r.error);
    return `${r.out ? `<pre class="out">${esc(r.out)}</pre>` : ''}<div class="err"><strong>${esc(r.error)}</strong>${r.line ? ` <span>(line ${r.line})</span>` : ''}${tip ? `<p>${md(tip)}</p>` : ''}</div>`;
  }
  return `<pre class="out">${r.out ? esc(r.out) : '<span class="muted">(no output)</span>'}</pre>`;
}

// ---------- syntax highlighting ----------
const HL = /(#[^\n]*)|('''[\s\S]*?'''|"""[\s\S]*?"""|[fr]?"(?:\\.|[^"\\\n])*"|[fr]?'(?:\\.|[^'\\\n])*')|\b(def|return|if|elif|else|for|while|in|not|and|or|import|from|as|with|try|except|is|lambda|pass|break|continue|True|False|None)\b|\b(\d+\.?\d*)\b|\b(print|len|sum|max|min|sorted|range|int|float|str|list|dict|round|open|enumerate)(?=\()/g;
function hl(src) {
  let out = '', last = 0;
  for (const m of src.matchAll(HL)) {
    const cls = m[1] ? 'c' : m[2] ? 's' : m[3] ? 'k' : m[4] ? 'n' : 'b';
    out += esc(src.slice(last, m.index)) + `<span class="t-${cls}">${esc(m[0])}</span>`;
    last = m.index + m[0].length;
  }
  return out + esc(src.slice(last));
}
const codeBlock = src => `<pre class="code">${hl(src)}</pre>`;
// Concept examples: move each end-of-line comment onto its own line above the code, so it fits a phone screen.
const stacked = src => src.split('\n').map(line => {
  const m = line.match(/^(\s*)(\S.*?)\s{2,}(#.*)$/);
  return m ? `${m[1]}${m[3]}\n${m[1]}${m[2]}` : line;
}).join('\n');

// ---------- sound ----------
let actx;
function beep(good) {
  if (!S.sound) return;
  try {
    actx = actx || new AudioContext();
    (good ? [523, 784] : [220, 175]).forEach((f, i) => {
      const o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime + i * 0.09;
      o.frequency.value = f; o.type = good ? 'sine' : 'triangle';
      g.gain.setValueAtTime(0.12, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      o.connect(g).connect(actx.destination); o.start(t); o.stop(t + 0.2);
    });
  } catch { /* no audio */ }
}

// ---------- editor ----------
function editor(el, onRun) {
  el.addEventListener('keydown', e => {
    const { selectionStart: a, selectionEnd: b, value: v } = el;
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); onRun(); return; }
    if (e.key === 'Tab') { e.preventDefault(); el.setRangeText('    ', a, b, 'end'); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      const line = v.slice(v.lastIndexOf('\n', a - 1) + 1, a);
      const indent = line.match(/^ */)[0] + (/:\s*$/.test(line) ? '    ' : '');
      el.setRangeText('\n' + indent, a, b, 'end');
    } else if (e.key === 'Backspace' && a === b && a >= 4 && v.slice(a - 4, a) === '    ' && /^ *$/.test(v.slice(v.lastIndexOf('\n', a - 1) + 1, a))) {
      e.preventDefault(); el.setRangeText('', a - 4, a, 'end');
    }
  });
}

// ---------- shell ----------
let tab = 'learn';
let L = null; // active lesson session

const ICONS = {
  learn: '<path d="M4 19V6a2 2 0 0 1 2-2h12v15H6a2 2 0 0 0-2 2zM8 8h6"/>',
  practice: '<path d="M4 12a8 8 0 1 0 2.3-5.7M4 4v4h4"/>',
  play: '<path d="M8 9l-4 3 4 3M16 9l4 3-4 3M13 6l-2 12"/>',
};
const icon = n => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[n]}</svg>`;

function topbar() {
  const pct = Math.min(1, S.dayXp / S.goal);
  return `<header class="top">
    <div class="brand"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M3 15 29 4l-7 24-6-9-8 6 3-9z" fill="var(--accent)"/><path d="M16 19 29 4 11 16" fill="none" stroke="var(--ink)" stroke-width="1.6" stroke-linejoin="round"/></svg>Pylot</div>
    <div class="stats">
      <span class="stat" title="Days in a row"><b>${S.streak}</b> day${S.streak === 1 ? '' : 's'}</span>
      <span class="stat" title="Total XP"><b>${S.xp}</b> XP</span>
      <span class="ring" title="Today: ${S.dayXp} of ${S.goal} XP" style="--p:${pct}"><span>${pct >= 1 ? '✓' : Math.round(pct * 100) + '%'}</span></span>
      <button class="icon-btn" data-act="sound" aria-label="Sound ${S.sound ? 'on' : 'off'}" aria-pressed="${S.sound}">${S.sound ? '🔊' : '🔈'}</button>
    </div>
  </header>`;
}

function tabbar() {
  const t = (id, label) => `<a href="#${id}" class="${tab === id ? 'on' : ''}" ${tab === id ? 'aria-current="page"' : ''}>${icon(id)}<span>${label}</span></a>`;
  return `<nav class="tabs">${t('learn', 'Learn')}${t('practice', 'Practice')}${t('play', 'Sandbox')}</nav>`;
}

function render() {
  if (L) return renderLesson();
  const body = { learn: homeView, practice: practiceView, play: playView }[tab]();
  app.innerHTML = `${topbar()}<main class="page">${body}</main>${tabbar()}`;
  app.className = '';
  if (tab === 'play') mountPlay();
  if (tab === 'learn') document.querySelector('.node.now')?.scrollIntoView({ block: 'center' });
}

// ---------- learn path ----------
const ZIG = [0, 46, 70, 46, 0, -46, -70, -46];
function homeView() {
  const cur = current();
  let k = 0;
  const units = COURSE.map((u, ui) => {
    const done = u.lessons.filter(l => S.done[l.id]).length;
    const nodes = u.lessons.map(l => {
      const st = S.done[l.id] ? 'done' : l === cur ? 'now' : unlocked(l) ? 'open' : 'locked';
      const x = ZIG[k++ % ZIG.length];
      return `<div class="node-wrap" style="--x:${x}px">
        ${st === 'now' ? '<span class="bubble">Start</span>' : ''}
        <button class="node ${st}" data-lesson="${l.id}" aria-label="${esc(l.title)}${st === 'locked' ? ', locked' : st === 'done' ? ', completed' : ''}">
          ${st === 'done' ? '✓' : st === 'locked' ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 11V8a5 5 0 0 1 10 0v3M5 11h14v9H5z"/></svg>' : l.id}
        </button>
        <span class="node-label">${esc(l.title)}</span>
      </div>`;
    }).join('');
    return `<section class="unit">
      <div class="unit-head"><span class="unit-n">Unit ${ui + 1} · ${done}/${u.lessons.length}</span><h2>${esc(u.title)}</h2><p>${esc(u.why)}</p></div>
      <div class="path">${nodes}</div>
    </section>`;
  }).join('');
  const all = !cur ? `<div class="card win"><h2>Course complete</h2><p>You can read, clean and analyse data with Python, and wire it to an AI model. Keep it fresh in Practice, or build something real in the Sandbox.</p></div>` : '';
  return all + units;
}

// ---------- practice ----------
const dueIds = () => Object.keys(S.review).filter(id => ITEMS[id] && S.review[id].due <= day());
function practiceView() {
  const due = dueIds().length;
  const doneLessons = LESSONS.filter(l => S.done[l.id]);
  const cards = doneLessons.flatMap(l => l.items.filter(i => i.t === 'learn').map(i => ({ i, l })));
  return `<section class="card">
      <h2>Review</h2>
      <p>${due ? `${due} exercise${due === 1 ? '' : 's'} you missed ${due === 1 ? 'is' : 'are'} due. Spaced repetition brings them back just before you forget.` : doneLessons.length ? 'Nothing due. Here\'s a quick mixed quiz from lessons you\'ve finished.' : 'Finish a lesson first, and your review queue builds up here.'}</p>
      <button class="btn primary" data-act="review" ${doneLessons.length ? '' : 'disabled'}>${due ? 'Start review' : 'Mixed quiz'}</button>
    </section>
    <section class="card">
      <h2>Cheat sheet</h2>
      <p class="muted">Every concept you've unlocked, in one place.</p>
      ${cards.length ? cards.map(({ i, l }) => `<details class="sheet"><summary>${esc(i.h)} <span class="muted">${COURSE[l.unit].title}</span></summary><p>${md(i.b)}</p>${codeBlock(stacked(i.code))}</details>`).join('') : '<p class="muted">Nothing yet.</p>'}
    </section>
    <section class="card">
      <h2>Daily goal</h2>
      <div class="goal">${[10, 30, 50].map(g => `<button class="chip ${S.goal === g ? 'on' : ''}" data-goal="${g}" aria-pressed="${S.goal === g}">${g} XP${g === 10 ? ' · light' : g === 30 ? ' · steady' : ' · intense'}</button>`).join('')}</div>
      <button class="btn ghost small" data-act="reset">Reset all progress</button>
    </section>`;
}

// ---------- sandbox ----------
const PLAY_START = py`import pandas as pd

df = pd.read_csv("sales.csv")
print(df.groupby("product")["units"].sum())
`;
function playView() {
  return `<section class="card">
    <h2>Sandbox</h2>
    <p class="muted">Free Python. Try anything with the sample files. <kbd>⌘/Ctrl + Enter</kbd> runs.</p>
    <div class="files">${Object.keys(FILES).map(f => `<button class="chip" data-file="${f}">${f}</button>`).join('')}</div>
    <div id="file-view"></div>
    <textarea class="editor" id="play" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" aria-label="Python code">${esc(S.play || PLAY_START)}</textarea>
    <div class="row"><button class="btn primary" data-act="play-run">Run</button><button class="btn ghost" data-act="play-reset">Reset</button></div>
    <div id="play-out" aria-live="polite"></div>
  </section>`;
}
function mountPlay() {
  const ed = document.getElementById('play');
  editor(ed, runPlay);
  ed.addEventListener('input', () => { S.play = ed.value; save(); });
  Py.boot();
}
async function runPlay() {
  const out = document.getElementById('play-out');
  out.innerHTML = `<p class="muted">${Py.ready ? 'Running…' : 'Starting Python (first time takes a few seconds)…'}</p>`;
  out.innerHTML = resultHtml(await Py.run(document.getElementById('play').value));
}

// ---------- lesson session ----------
function startLesson(lesson, items, isReview = false) {
  const list = items || lesson.items;
  L = {
    lesson, isReview, queue: list.map(ex => ({ ex })), pos: 0, total: list.length, cleared: 0,
    missed: new Set(), firstTry: 0, combo: 0, maxCombo: 0, t0: Date.now(), state: 'answer', sel: null,
  };
  if (list.some(i => i.t === 'code' || (i.t === 'learn' && !i.norun))) Py.boot();
  renderLesson();
}

function renderLesson() {
  const q = L.queue[L.pos];
  if (!q) return finish();
  const ex = q.ex;
  L.sel = null; L.state = 'answer'; L.view = {};
  const pct = (L.cleared / L.total) * 100;
  app.className = 'lesson-mode';
  app.innerHTML = `<header class="lbar">
      <button class="icon-btn" data-act="quit" aria-label="Quit lesson">✕</button>
      <div class="bar" role="progressbar" aria-valuenow="${Math.round(pct)}" aria-valuemin="0" aria-valuemax="100"><span style="width:${pct}%"></span></div>
      <span class="combo ${L.combo >= 3 ? 'hot' : ''}" aria-live="polite">${L.combo >= 3 ? `${L.combo} in a row` : ''}</span>
    </header>
    <main class="ex">${q.retry ? '<p class="tag">Let\'s try that again</p>' : ''}${exHtml(ex)}</main>
    <footer class="foot" id="foot">${footHtml(ex)}</footer>`;
  mountEx(ex);
}

function exHtml(ex) {
  switch (ex.t) {
    case 'learn':
      return `<p class="tag">New concept</p><h1>${esc(ex.h)}</h1><p class="lead">${md(ex.b)}</p>${codeBlock(stacked(ex.code))}
        ${ex.norun ? '<p class="muted small">Read-only example (needs internet or an API key).</p>' : '<button class="btn ghost small" data-act="try">Run it</button><div id="try-out" aria-live="polite"></div>'}`;
    case 'mc': {
      L.view.opts = shuffle(ex.o.map((text, i) => ({ text, right: i === 0 })));
      const multi = L.view.opts.some(o => o.text.includes('\n') || /[\[\]{}()]/.test(o.text));
      return `<h1>${md(ex.q)}</h1>${ex.code ? codeBlock(ex.code) : ''}
        <div class="opts" role="radiogroup">${L.view.opts.map((o, i) => `<button class="opt ${multi ? 'mono' : ''}" role="radio" aria-checked="false" data-opt="${i}"><kbd>${i + 1}</kbd><span>${multi ? esc(o.text) : md(o.text)}</span></button>`).join('')}</div>`;
    }
    case 'fill': {
      L.view.slots = ex.a.map(() => null);
      L.view.tiles = shuffle([...ex.a, ...ex.x]).map((text, i) => ({ text, i, used: false }));
      return `<h1>${md(ex.q)}</h1><pre class="code fill" id="fill-code"></pre><div class="tiles" id="tiles"></div>`;
    }
    case 'order': {
      const lines = ex.code.split('\n');
      L.view.picked = [];
      L.view.bank = shuffle(lines.map((text, i) => ({ text, i })));
      return `<h1>${md(ex.q)}</h1><p class="muted small">Tap the lines in the right order.</p><div class="built" id="built"></div><div class="bank" id="bank"></div>`;
    }
    case 'code':
      return `<p class="tag">Write code</p><h1 class="pre">${md(ex.q)}</h1>
        <textarea class="editor" id="ed" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" aria-label="Your code">${esc(ex.start)}</textarea>
        <div class="row"><button class="btn ghost small" data-act="run">Run</button><button class="btn ghost small" data-act="hint">Hint</button><button class="btn ghost small" data-act="solution">Show solution</button></div>
        <div id="hint"></div><div id="run-out" aria-live="polite"></div>`;
  }
}

function footHtml(ex) {
  const label = ex.t === 'learn' ? 'Got it' : 'Check';
  const ready = ex.t === 'learn' || ex.t === 'code';
  return `<button class="btn primary big" data-act="check" ${ready ? '' : 'disabled'}>${label}</button>`;
}

function mountEx(ex) {
  if (ex.t === 'fill') drawFill(ex);
  if (ex.t === 'order') drawOrder();
  if (ex.t === 'code') {
    const ed = document.getElementById('ed');
    editor(ed, () => check());
    if (!Py.ready) document.getElementById('run-out').innerHTML = '<p class="muted small py-status">Python is warming up in the background…</p>';
  }
}

function setReady(on) { const b = document.querySelector('[data-act=check]'); if (b) b.disabled = !on; }

function drawFill(ex) {
  const v = L.view;
  let k = 0;
  const parts = ex.code.split('___');
  document.getElementById('fill-code').innerHTML = parts.map((p, i) => {
    if (i === parts.length - 1) return hl(p);
    const s = v.slots[k], idx = k++;
    return hl(p) + `<button class="slot ${s ? 'full' : ''}" data-slot="${idx}" aria-label="${s ? 'Remove ' + esc(s.text) : 'Empty blank'}">${s ? esc(s.text) : '&nbsp;'}</button>`;
  }).join('');
  document.getElementById('tiles').innerHTML = v.tiles.map(t => `<button class="tile ${t.used ? 'used' : ''}" data-tile="${t.i}" ${t.used ? 'disabled aria-hidden="true"' : ''}>${esc(t.text)}</button>`).join('');
  setReady(v.slots.every(Boolean));
}

function drawOrder() {
  const v = L.view;
  document.getElementById('built').innerHTML = v.picked.length
    ? v.picked.map((l, i) => `<button class="line" data-unpick="${i}">${hl(l.text) || '&nbsp;'}</button>`).join('')
    : '<p class="muted small">Your code appears here</p>';
  document.getElementById('bank').innerHTML = v.bank.map((l, i) => `<button class="line" data-pick="${i}">${hl(l.text.trimStart()) || '&nbsp;'}</button>`).join('');
  setReady(v.bank.length === 0);
}

async function check() {
  const q = L.queue[L.pos], ex = q.ex;
  if (L.state === 'feedback') return next();
  if (ex.t === 'learn') { L.cleared++; L.pos++; return renderLesson(); }
  if (ex.t === 'code') return checkCode(ex, q);
  let ok, answer = '';
  if (ex.t === 'mc') {
    if (L.sel == null) return;
    ok = L.view.opts[L.sel].right;
    answer = ex.o[0];
    document.querySelectorAll('.opt').forEach((b, i) => { b.disabled = true; if (L.view.opts[i].right) b.classList.add('right'); else if (i === L.sel) b.classList.add('wrong'); });
  } else if (ex.t === 'fill') {
    ok = L.view.slots.every((s, i) => s.text === ex.a[i]);
    answer = ex.code.split('___').reduce((acc, p, i) => acc + ex.a[i - 1] + p);
  } else if (ex.t === 'order') {
    ok = L.view.picked.map(l => l.text).join('\n') === ex.code;
    answer = ex.code;
  }
  feedback(ok, q, answer, ex.why);
}

async function checkCode(ex, q) {
  const code = document.getElementById('ed').value;
  const out = document.getElementById('run-out');
  const btn = document.querySelector('[data-act=check]');
  btn.disabled = true; btn.textContent = 'Checking…';
  if (!Py.ready) out.innerHTML = '<p class="muted small">Starting Python…</p>';
  const r = await Py.run(code, ex.test);
  btn.disabled = false; btn.textContent = 'Check';
  out.innerHTML = resultHtml(r);
  let msg = '';
  if (!r.ok) msg = 'Your code hit an error. Read the message above, fix it, and check again.';
  else if (r.testErr) msg = r.testErr.replace(/^AssertionError:?\s*/, '') || "The result isn't right yet.";
  else if (ex.expect != null && norm(r.out) !== norm(ex.expect)) msg = `Expected the output to be \`${ex.expect}\`.`;
  if (!msg) return feedback(true, q, null, null);
  L.missed.add(ex.id); L.combo = 0; q.failed = (q.failed || 0) + 1;
  beep(false);
  if (q.failed >= 2 && !document.querySelector('#hint p')) showHint(ex);
  showFoot(false, msg, true);
}

function showHint(ex) { document.getElementById('hint').innerHTML = `<p class="hint">${md(ex.hint || 'Re-read the task, then run your code to see what it prints.')}</p>`; }

function feedback(ok, q, answer, why) {
  const ex = q.ex;
  L.state = 'feedback';
  if (ok) {
    if (!q.retry && !q.failed && !q.peeked) L.firstTry++;
    L.cleared++; L.combo++; L.maxCombo = Math.max(L.maxCombo, L.combo);
    if (L.isReview && !L.missed.has(ex.id)) promote(ex.id);
  } else {
    L.missed.add(ex.id); L.combo = 0;
    L.queue.push({ ex, retry: true });
  }
  beep(ok);
  const praise = ['Nice!', 'Correct!', 'Spot on!', 'You got it!', 'Great!'];
  const msg = ok
    ? `<strong>${L.combo >= 3 ? `${L.combo} in a row!` : praise[Math.floor(Math.random() * praise.length)]}</strong>${why ? `<p>${md(why)}</p>` : ''}`
    : `<strong>Not quite</strong>${answer != null ? `<p>Correct answer:</p><pre class="answer">${esc(answer)}</pre>` : ''}${why ? `<p>${md(why)}</p>` : ''}<p class="small">It comes back at the end of the lesson.</p>`;
  showFoot(ok, msg);
}

function showFoot(ok, html, retryable) {
  const foot = document.getElementById('foot');
  foot.className = `foot ${ok ? 'good' : 'bad'}`;
  foot.innerHTML = `<div class="fb" role="status">${retryable ? `<strong>Not yet</strong><p>${md(html)}</p>` : html}</div>
    <button class="btn big ${ok ? 'primary' : 'danger'}" data-act="${retryable ? 'retry' : 'next'}">${retryable ? 'Try again' : 'Continue'}</button>`;
  foot.querySelector('button').focus();
}

function next() { L.pos++; renderLesson(); }

// ---------- spaced review ----------
const GAPS = [1, 3, 7, 14];
function promote(id) {
  const r = S.review[id];
  if (!r) return;
  if (r.box >= GAPS.length) delete S.review[id];
  else { r.due = day(GAPS[r.box]); r.box++; }
}

function startReview() {
  let ids = dueIds();
  if (!ids.length) {
    ids = shuffle(LESSONS.filter(l => S.done[l.id]).flatMap(l => l.items.filter(i => i.t !== 'learn').map(i => i.id)));
  }
  const items = shuffle(ids).slice(0, 10).map(id => ITEMS[id]);
  startLesson({ id: 'review', title: 'Review' }, items, true);
}

// ---------- finish ----------
function finish() {
  const graded = L.queue.filter(q => q.ex.t !== 'learn' && !q.retry).length;
  const xp = 10 + L.firstTry;
  const acc = graded ? Math.round((L.firstTry / graded) * 100) : 100;
  const secs = Math.round((Date.now() - L.t0) / 1000);
  const t = secs >= 60 ? `${Math.floor(secs / 60)}m ${secs % 60}s` : `${secs}s`;
  const firstDone = !L.isReview && !S.done[L.lesson.id];

  S.xp += xp; S.dayXp += xp;
  if (S.lastDay !== day()) { S.streak = S.lastDay === day(-1) ? S.streak + 1 : 1; S.lastDay = day(); }
  if (!L.isReview) for (const l of LESSONS) { if (l.n <= L.lesson.n) S.done[l.id] = true; }
  L.missed.forEach(id => { S.review[id] = { box: 0, due: day() }; });
  save();

  const nextL = current();
  const goalHit = S.dayXp >= S.goal && S.dayXp - xp < S.goal;
  app.className = 'lesson-mode';
  app.innerHTML = `<main class="finish">
    <div class="burst" aria-hidden="true">${'<i></i>'.repeat(14)}</div>
    <p class="tag">${L.isReview ? 'Review done' : firstDone ? 'Lesson complete' : 'Practised again'}</p>
    <h1>${acc === 100 ? 'Flawless.' : acc >= 70 ? 'Well done.' : 'Done. That was the hard part.'}</h1>
    <div class="tiles-stats">
      <div><b>+${xp}</b><span>XP</span></div>
      <div><b>${acc}%</b><span>first try</span></div>
      <div><b>${t}</b><span>time</span></div>
    </div>
    ${goalHit ? '<p class="goal-hit">Daily goal reached 🎯</p>' : ''}
    ${L.missed.size ? `<p class="muted">${L.missed.size} exercise${L.missed.size === 1 ? '' : 's'} added to Review.</p>` : ''}
    <div class="col">
      ${!L.isReview && nextL && firstDone ? `<button class="btn primary big" data-act="go-next">Next: ${esc(nextL.title)}</button>` : ''}
      <button class="btn ${!L.isReview && nextL && firstDone ? 'ghost' : 'primary'} big" data-act="home">Back to path</button>
    </div>
  </main>`;
  beep(true);
  L = null;
}

// ---------- events ----------
let pendingJump = null;
app.addEventListener('click', async e => {
  const t = e.target.closest('button, [data-act]');
  if (!t) return;
  const d = t.dataset;

  if (d.lesson) {
    const l = LESSONS.find(x => x.id === d.lesson);
    if (unlocked(l)) return startLesson(l);
    pendingJump = l;
    return sheet(`<h2>Jump ahead?</h2><p>Pass <strong>${esc(l.title)}</strong> and every lesson before it unlocks. Good if you already know the basics.</p>
      <div class="col"><button class="btn primary big" data-act="jump">Start this lesson</button><button class="btn ghost big" data-act="close-sheet">Not now</button></div>`);
  }
  if (d.opt != null && L) {
    L.sel = +d.opt;
    document.querySelectorAll('.opt').forEach((b, i) => { b.classList.toggle('sel', i === L.sel); b.setAttribute('aria-checked', i === L.sel); });
    return setReady(true);
  }
  if (d.tile != null) {
    const tile = L.view.tiles.find(x => x.i === +d.tile);
    const k = L.view.slots.indexOf(null);
    if (k < 0) return;
    L.view.slots[k] = tile; tile.used = true;
    return drawFill(L.queue[L.pos].ex);
  }
  if (d.slot != null && L.state === 'answer') {
    const s = L.view.slots[+d.slot];
    if (!s) return;
    s.used = false; L.view.slots[+d.slot] = null;
    return drawFill(L.queue[L.pos].ex);
  }
  if (d.pick != null) { L.view.picked.push(L.view.bank.splice(+d.pick, 1)[0]); return drawOrder(); }
  if (d.unpick != null && L.state === 'answer') { L.view.bank.push(L.view.picked.splice(+d.unpick, 1)[0]); return drawOrder(); }
  if (d.file) {
    const v = document.getElementById('file-view');
    v.innerHTML = v.dataset.f === d.file ? '' : `<pre class="out file">${esc(FILES[d.file])}</pre>`;
    v.dataset.f = v.dataset.f === d.file ? '' : d.file;
    return;
  }
  if (d.goal) { S.goal = +d.goal; save(); return render(); }

  switch (d.act) {
    case 'check': return check();
    case 'next': return next();
    case 'retry': {
      const foot = document.getElementById('foot');
      foot.className = 'foot'; foot.innerHTML = footHtml(L.queue[L.pos].ex);
      return document.getElementById('ed').focus();
    }
    case 'try': {
      const o = document.getElementById('try-out');
      o.innerHTML = `<p class="muted small">${Py.ready ? 'Running…' : 'Starting Python…'}</p>`;
      o.innerHTML = resultHtml(await Py.run(L.queue[L.pos].ex.code));
      return;
    }
    case 'run': {
      const o = document.getElementById('run-out');
      o.innerHTML = `<p class="muted small">${Py.ready ? 'Running…' : 'Starting Python…'}</p>`;
      o.innerHTML = resultHtml(await Py.run(document.getElementById('ed').value));
      return;
    }
    case 'hint': return showHint(L.queue[L.pos].ex);
    case 'solution': {
      const q = L.queue[L.pos];
      q.peeked = true; L.missed.add(q.ex.id);
      document.getElementById('ed').value = q.ex.sol;
      document.getElementById('hint').innerHTML = '<p class="hint">Read it line by line, then press Check. This exercise goes into Review so you can write it yourself later.</p>';
      return;
    }
    case 'quit':
      if (L.cleared === 0 || confirm('Leave this lesson? Progress in it won\'t be saved.')) { L = null; render(); }
      return;
    case 'home': return render();
    case 'go-next': return startLesson(current());
    case 'review': return startReview();
    case 'jump': closeSheet(); return startLesson(pendingJump);
    case 'close-sheet': return closeSheet();
    case 'sound': S.sound = !S.sound; save(); return render();
    case 'play-run': return runPlay();
    case 'play-reset': S.play = ''; save(); return render();
    case 'reset':
      if (confirm('Erase all XP, streak and progress on this device?')) { localStorage.removeItem(KEY); location.reload(); }
      return;
  }
});

function sheet(html) {
  const el = document.createElement('div');
  el.className = 'scrim';
  el.innerHTML = `<div class="sheet-panel" role="dialog" aria-modal="true">${html}</div>`;
  el.addEventListener('click', e => { if (e.target === el) closeSheet(); });
  document.body.appendChild(el);
  el.querySelector('button').focus();
}
function closeSheet() { document.querySelector('.scrim')?.remove(); }
document.body.addEventListener('click', e => {
  const b = e.target.closest('.scrim [data-act]');
  if (!b) return;
  if (b.dataset.act === 'jump') { closeSheet(); startLesson(pendingJump); }
  else closeSheet();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeSheet();
  if (!L || e.target.tagName === 'TEXTAREA') return;
  const ex = L.queue[L.pos]?.ex;
  if (e.key === 'Enter') {
    const b = document.querySelector('#foot button:not([disabled])');
    if (b && document.activeElement?.tagName !== 'BUTTON') { e.preventDefault(); b.click(); }
  } else if (ex?.t === 'mc' && L.state === 'answer' && /^[1-4]$/.test(e.key)) {
    document.querySelector(`[data-opt="${+e.key - 1}"]`)?.click();
  }
});

window.addEventListener('hashchange', () => { tab = location.hash.slice(1) || 'learn'; if (!L) render(); });
tab = ['learn', 'practice', 'play'].includes(location.hash.slice(1)) ? location.hash.slice(1) : 'learn';
render();

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});

// Dev check: runs every solution and every "run" quiz through Python. Call verifyCourse() in the console.
window.verifyCourse = async () => {
  const fails = [];
  for (const it of Object.values(ITEMS)) {
    if (it.t === 'code') {
      const r = await Py.run(it.sol, it.test);
      if (!r.ok || r.testErr || (it.expect != null && norm(r.out) !== norm(it.expect))) fails.push([it.id, r.error || r.testErr || r.out]);
    } else if (it.t === 'mc' && it.run) {
      const r = await Py.run(it.code);
      if (!r.ok || norm(r.out) !== norm(it.o[0])) fails.push([it.id, r.error || r.out]);
    } else if (it.t === 'learn' && !it.norun) {
      const r = await Py.run(it.code);
      if (!r.ok) fails.push([it.id, r.error]);
    }
  }
  return fails.length ? fails : 'all good';
};
