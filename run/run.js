'use strict';

const KM_PER_MILE = 1.609344;
const DEFAULT_UNIT_KEY = 'carelesslabs.run.defaultUnit';
let defaultUnit = 'km';
try {
  if (localStorage.getItem(DEFAULT_UNIT_KEY) === 'mile') defaultUnit = 'mile';
} catch {
  // Storage may be unavailable; the calculator still works with KM defaults.
}
const races = { '5K': 5, '10K': 10, 'Half marathon': 21.0975, 'Marathon': 42.195 };
const byId = id => document.getElementById(id);
const clean = value => String(Number(value.toFixed(5)));
const tabs = ['Pace', 'Speed', 'Time', 'Distance', 'Ultra', 'BYU', 'Settings'];
const numberField = (id, label, value, max) => `<div><label class="form-label" for="${id}">${label}</label><input class="form-control" id="${id}" type="number" min="0" ${max ? `max="${max}"` : ''} step="1" value="${value}"></div>`;
const calculatorKeys = ['pace', 'speed', 'time', 'distance', 'ultra', 'byu'];
const switchId = (key, unit) => key === 'pace' ? `units-${unit}` : `${key}-units-${unit}`;
const unitSwitcher = key => `<div class="field"><p class="field-title">Units</p><div class="btn-group" role="group" aria-label="Units">${['km', 'mile'].map(unit => `<button class="btn preset" id="${switchId(key, unit)}" type="button" aria-pressed="${unit === defaultUnit}">${unit === 'km' ? 'KM' : 'Miles'}</button>`).join('')}</div></div>`;
const distanceField = key => `<div class="field"><p class="field-title">Choose a distance</p><div class="presets" role="group" aria-label="Race distance">${Object.entries(key === 'ultra' ? { '50K': 50, '50 miles': 50 * KM_PER_MILE, '100K': 100, '100 miles': 100 * KM_PER_MILE } : races).map(([name, km]) => `<button class="btn preset" type="button" data-key="${key}" data-km="${km}" aria-pressed="false">${name}</button>`).join('')}</div><label class="form-label" for="${key}-distance">Distance</label><div class="input-group"><input class="form-control" id="${key}-distance" type="number" min="0" step="any" value="0"><span class="input-group-text" id="${key}-distance-unit">KM</span></div></div>`;
const durationFields = key => `<div class="field"><p class="field-title">Duration</p><div class="time-fields">${numberField(`${key}-hours`, 'Hours', 0)}${numberField(`${key}-minutes`, 'Minutes', 0, 59)}${numberField(`${key}-seconds`, 'Seconds', 0, 59)}</div></div>`;
const speedField = key => `<div class="field"><label class="form-label" for="${key}-speed">Average speed</label><div class="input-group"><input class="form-control" type="number" min="0" step="any" value="0" id="${key}-speed"><span class="input-group-text" id="${key}-speed-unit">km/h</span></div></div>`;
const result = (key, title) => `<aside class="result-card" aria-live="polite" aria-atomic="true"><div class="eyebrow">${title}</div><div class="result-value" id="${key}-result">00:00:00</div><div class="result-note" id="${key}-note"></div><div class="metrics" id="${key}-metrics"></div></aside>`;
const descriptions = { pace: ['Plan your finish.', 'Choose your distance and set a comfortable pace.'], speed: ['How did you run?', 'Turn your distance and finish time into speed and pace.'], time: ['Know your finish time.', 'Set a distance and speed to see how long it will take.'], distance: ['See how far you’ll go.', 'Enter your time and speed to calculate your distance.'] };

tabs.forEach((label, index) => {
  const key = label.toLowerCase();
  byId('calculator-tabs').insertAdjacentHTML('beforeend', `<button class="nav-link ${index === 0 ? 'active' : ''}" id="${key}-tab" data-bs-toggle="pill" data-bs-target="#${key}-panel" type="button" role="tab" aria-controls="${key}-panel" aria-selected="${index === 0}" ${index ? 'tabindex="-1"' : ''}>${label}</button>`);
  let content;
  if (key === 'settings') {
    content = `<div class="settings-panel"><h2 class="h4">Make it yours.</h2><p class="subtext">Adjust the detail shown in your results.</p><div class="field"><label for="default-unit" class="form-label">Default units</label><select class="form-select" id="default-unit" aria-describedby="default-unit-note"><option value="km">KM (km/h)</option><option value="mile">Miles (mph)</option></select><p class="subtext mt-2" id="default-unit-note" role="status">Applies to every calculator and is remembered for your next visit.</p></div><div class="field"><label for="precision" class="form-label">Decimal places (0–5)</label><input class="form-control" type="number" id="precision" min="0" max="5" step="1" value="2"></div><div class="form-check form-switch mt-4"><input class="form-check-input" type="checkbox" id="split-seconds"><label class="form-check-label" for="split-seconds">Show fractional seconds</label></div></div>`;

  } else if (key === 'byu') {
    content = byuMarkup();
  } else if (key === 'ultra') {
    content = ultraMarkup();
  } else {
    let fields = unitSwitcher(key) + (key !== 'distance' ? distanceField(key) : durationFields(key));
    if (key === 'pace') fields += `<div class="field"><p class="field-title" id="pace-label">Pace / km</p><div class="time-fields">${numberField('pace-minutes', 'Minutes', 7)}${numberField('pace-seconds', 'Seconds', 0, 59)}</div></div>`;
    if (key === 'speed') fields += durationFields(key);
    if (key === 'time' || key === 'distance') fields += speedField(key);
    content = `<div class="workspace"><div class="input-panel"><h2>${descriptions[key][0]}</h2><p class="subtext">${descriptions[key][1]}</p>${fields}</div>${result(key, key === 'speed' ? 'AVERAGE SPEED' : key === 'distance' ? 'DISTANCE COVERED' : 'ESTIMATED FINISH TIME')}</div>`;
    if (key === 'pace') content += `<section class="splits"><div class="split-heading"><h3>Your splits</h3><span id="split-label">Cumulative time · per mile</span></div><div class="table-wrap"><table class="table"><thead><tr><th scope="col" id="split-unit">Mile</th><th scope="col">Elapsed time</th></tr></thead><tbody id="split-rows"></tbody></table></div><button class="btn preset mt-3" id="toggle-splits" type="button" aria-controls="split-rows" aria-expanded="false" hidden>Show all splits</button></section>`;
  }
  byId('calculator-panels').insertAdjacentHTML('beforeend', `<div class="tab-pane fade ${index === 0 ? 'show active' : ''}" id="${key}-panel" role="tabpanel" aria-labelledby="${key}-tab" tabindex="0">${content}</div>`);
});

let allSplits = false;
byId('toggle-splits').addEventListener('click', () => {
  allSplits = !allSplits;
  refresh();
});
const unitSelectors = ['default-unit'];
for (const id of unitSelectors) byId(id).value = defaultUnit;
const factor = () => defaultUnit === 'mile' ? KM_PER_MILE : 1;
// Canonical quantities prevent rounding drift when switching the shared setting.
const distances = { pace: 0, speed: 0, time: 0, ultra: 0 };
const speeds = { time: 0, distance: 0 };
let paceSecondsPerKm = 420 / factor();
for (const key of Object.keys(distances)) {
  const input = byId(`${key}-distance`);
  input.addEventListener('input', () => { distances[key] = value(`${key}-distance`) * factor(); });
}
for (const key of Object.keys(speeds)) {
  byId(`${key}-speed`).addEventListener('input', () => { speeds[key] = value(`${key}-speed`) * factor(); });
}
for (const id of ['pace-minutes', 'pace-seconds']) {
  byId(id).addEventListener('input', () => {
    paceSecondsPerKm = (value('pace-minutes') * 60 + value('pace-seconds')) / factor();
  });
}
function setUnits(unit) {
  if (unit !== 'km' && unit !== 'mile') return;
  defaultUnit = unit;
  for (const id of unitSelectors) byId(id).value = unit;
  for (const key of Object.keys(distances)) {
    if (Number.isFinite(distances[key])) byId(`${key}-distance`).value = clean(distances[key] / factor());
  }
  for (const key of Object.keys(speeds)) {
    if (Number.isFinite(speeds[key])) byId(`${key}-speed`).value = clean(speeds[key] / factor());
  }
  if (Number.isFinite(paceSecondsPerKm)) {
    const seconds = Math.round(paceSecondsPerKm * factor());
    byId('pace-minutes').value = String(Math.floor(seconds / 60));
    byId('pace-seconds').value = String(seconds % 60);
  }
  renderUltraInputs();
  renderByuInputs();
  try {
    localStorage.setItem(DEFAULT_UNIT_KEY, unit);
    byId('default-unit-note').textContent = 'Saved. Units apply to every calculator and your next visit.';
  } catch {
    byId('default-unit-note').textContent = 'Units updated for this visit. Your browser could not save this preference.';
  }
  refresh();
}
for (const id of unitSelectors) byId(id).addEventListener('change', () => setUnits(byId(id).value));
for (const key of calculatorKeys) {
  for (const unit of ['km', 'mile']) byId(switchId(key, unit)).addEventListener('click', () => setUnits(unit));
}

document.querySelectorAll('[data-km]').forEach(button => button.addEventListener('click', () => {
  const key = button.dataset.key;
  distances[key] = Number(button.dataset.km);
  byId(`${key}-distance`).value = clean(distances[key] / factor());
  refresh();
}));
const value = id => { const input = byId(id); return input.value !== '' && input.validity.valid ? Number(input.value) : NaN; };
const duration = key => value(`${key}-hours`) * 3600 + value(`${key}-minutes`) * 60 + value(`${key}-seconds`);
const speedKmh = key => speeds[key];
const precision = () => Math.min(5, Math.max(0, Math.trunc(Number(byId('precision').value) || 0)));
const decimal = n => Number.isFinite(n) && n >= 0 ? n.toFixed(precision()) : '—';
function time(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '—';
  const places = byId('split-seconds').checked ? precision() : 0;
  const scale = 10 ** places;
  const ticks = Math.round(seconds * scale);
  const hours = Math.floor(ticks / (3600 * scale));
  const minutes = Math.floor(ticks / (60 * scale)) % 60;
  const secs = ((ticks % (60 * scale)) / scale).toFixed(places).padStart(places ? places + 3 : 2, '0');
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${secs}`;
}
function show(key, main, note, metrics) {
  byId(`${key}-result`).textContent = main;
  byId(`${key}-note`).textContent = note;
  byId(`${key}-metrics`).innerHTML = metrics.map(([n, label]) => `<div class="metric"><strong>${n}</strong><span>${label}</span></div>`).join('');
}
function refresh() {
  document.querySelectorAll('[data-km]').forEach(button => {
    const active = Math.abs(distances[button.dataset.key] - Number(button.dataset.km)) < 1e-8;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  const speedLabel = defaultUnit === 'mile' ? 'mph' : 'km/h';
  const distanceLabel = defaultUnit === 'mile' ? 'miles' : 'km';
  const paceLabel = defaultUnit === 'mile' ? 'mile' : 'km';
  for (const key of Object.keys(distances)) byId(`${key}-distance-unit`).textContent = defaultUnit === 'mile' ? 'Miles' : 'KM';
  for (const key of Object.keys(speeds)) byId(`${key}-speed-unit`).textContent = speedLabel;
  byId('pace-label').textContent = `Pace / ${paceLabel}`;
  for (const key of calculatorKeys) {
    for (const unit of ['km', 'mile']) {
      byId(switchId(key, unit)).classList.toggle('active', unit === defaultUnit);
      byId(switchId(key, unit)).setAttribute('aria-pressed', String(unit === defaultUnit));
    }
  }
  const secondsPerKm = paceSecondsPerKm;
  const paceSpeed = secondsPerKm > 0 ? 3600 / secondsPerKm : NaN;
  show('pace', time(secondsPerKm > 0 ? distances.pace * secondsPerKm : NaN), 'Hours : minutes : seconds', [[decimal(paceSpeed / factor()), speedLabel]]);
  const unit = defaultUnit;
  const distance = distances.pace / (unit === 'mile' ? KM_PER_MILE : 1);
  const perUnit = secondsPerKm * (unit === 'mile' ? KM_PER_MILE : 1);
  byId('split-unit').textContent = unit === 'mile' ? 'Mile' : 'KM';
  byId('split-label').textContent = `Cumulative time · per ${unit === 'mile' ? 'mile' : 'km'}`;
  const rows = [];
  // Bound rendering for unusually large distances, always including the finish.
  if (Number.isFinite(distance) && distance > 0 && perUnit > 0) {
    for (let i = 1; i < distance && i <= 500; i++) rows.push(`<tr><td>${i}</td><td>${time(i * perUnit)}</td></tr>`);
    if (distance > 501) rows.push('<tr><td colspan="2">Intermediate splits omitted after 500</td></tr>');
    rows.push(`<tr class="finish-row"><td>${clean(distance)} <span class="ms-2">Finish</span></td><td>${time(distance * perUnit)}</td></tr>`);
  }
  const toggle = byId('toggle-splits');
  toggle.hidden = rows.length <= 10;
  toggle.textContent = allSplits ? 'Show fewer splits' : 'Show all splits';
  toggle.setAttribute('aria-expanded', String(allSplits));
  byId('split-rows').innerHTML = (allSplits ? rows : rows.slice(0, 10)).join('') || '<tr><td colspan="2">Enter a distance and pace to see your splits.</td></tr>';
  const elapsed = duration('speed');
  const kmh = elapsed > 0 ? distances.speed / elapsed * 3600 : NaN;
  show('speed', `${decimal(kmh / factor())} ${speedLabel}`, 'Average speed', [[time(kmh > 0 ? 3600 / kmh * factor() : NaN), `pace / ${paceLabel}`]]);
  const speed = speedKmh('time');
  show('time', time(speed > 0 ? distances.time / speed * 3600 : NaN), 'Hours : minutes : seconds', [[decimal(distances.time / factor()), distanceLabel]]);
  refreshUltra();
  refreshByu();
  const covered = speedKmh('distance') * duration('distance') / 3600;
  show('distance', `${decimal(covered / factor())} ${distanceLabel}`, 'Distance covered', [[decimal(speedKmh('distance') / factor()), speedLabel], [time(duration('distance')), 'duration']]);
}
setupUltra();
setupByu();
byId('calculator-panels').addEventListener('input', refresh);
byId('calculator-panels').addEventListener('change', refresh);
refresh();

function byuMarkup() {
  const pace = leg => `<fieldset class="field"><legend class="field-title" id="byu-${leg}-label">${leg} pace</legend><div class="time-fields">${numberField(`byu-${leg}-minutes`, 'Minutes', leg === 'run' ? 7 : 12)}${numberField(`byu-${leg}-seconds`, 'Seconds', 0, 59)}</div></fieldset>`;
  return `<div class="workspace"><div class="input-panel"><h2>One yard. Every hour.</h2><p class="subtext" id="byu-yard-label"></p>${unitSwitcher('byu')}
    <div class="field"><label class="form-label" for="byu-mode">Plan by</label><select class="form-select" id="byu-mode"><option value="break">Target break</option><option value="strategy">Run / walk plan</option></select></div>
    <div class="field" id="byu-break-fields"><label class="form-label" for="byu-break">Desired break per yard (minutes)</label><input class="form-control" id="byu-break" type="number" min="0" max="59" step="any" value="10"></div>
    <div id="byu-strategy-fields" hidden><div class="field"><label class="form-label" for="byu-strategy">Run / walk strategy</label><select class="form-select" id="byu-strategy"><option value="time">Repeating time intervals</option><option value="distance">Repeating distance intervals</option><option value="terrain">Total walking distance per yard</option></select></div>
    <div class="time-fields field" id="byu-interval-fields"><div><label class="form-label" id="byu-run-length-label" for="byu-run-length">Run (minutes)</label><input class="form-control" id="byu-run-length" type="number" min="0" step="any" value="25"></div><div><label class="form-label" id="byu-walk-length-label" for="byu-walk-length">Walk (minutes)</label><input class="form-control" id="byu-walk-length" type="number" min="0" step="any" value="5"></div></div>
    <div class="field" id="byu-terrain-fields" hidden><label class="form-label" id="byu-terrain-label" for="byu-terrain">Walking distance per yard</label><input class="form-control" id="byu-terrain" type="number" min="0" step="any" value="1"><p class="subtext mt-2">Walk this much of each yard; run the remainder. Choose the walking sections on the course.</p></div>${pace('run')}${pace('walk')}<p class="subtext mt-2">Repeating plans start with a run each yard and stop at the finish. Estimates assume constant paces and no on-course stops.</p></div>
    <div class="field"><label class="form-label" for="byu-prep">Preparation allowance (minutes)</label><input class="form-control" id="byu-prep" type="number" min="0" max="59" step="any" value="2"><p class="subtext mt-2">Reserved within your break for getting ready at the start.</p></div>
    <div class="field"><label class="form-label" for="byu-yards">Target yards (1–200)</label><div class="presets" role="group" aria-label="Target yards"><button class="btn preset" type="button" id="byu-6">6 yards</button><button class="btn preset" type="button" id="byu-12">12 yards</button><button class="btn preset" type="button" id="byu-24">24 yards</button></div><input class="form-control" id="byu-yards" type="number" min="1" max="200" step="1" value="12"></div>
    <div class="field"><label class="form-label" for="byu-start">First yard start (local time)</label><input class="form-control" id="byu-start" type="time" value="09:00"></div></div>
    <div>${result('byu', 'TARGET LOOP TIME')}<p class="subtext mt-3" id="byu-status" role="status"></p><p class="subtext" id="byu-total"></p><p class="subtext">Each yard starts exactly one hour after the last. Breaks cannot be carried into the next yard. Target yards are a planning goal, not a race finish limit.</p></div></div>
    <section class="splits"><div class="split-heading"><h3>Your yard schedule</h3></div><div class="byu-schedule"><table class="table"><thead><tr><th scope="col">Yard</th><th scope="col">Start</th><th scope="col">Finish</th><th scope="col">Next start</th></tr></thead><tbody id="byu-rows"></tbody></table></div><button class="btn preset mt-3" type="button" id="byu-expand" aria-controls="byu-rows" aria-expanded="false" hidden>Show all yards</button></section>`;
}
var byu;
function setupByu() {
  byu = { mode: 'time', time: { run: 1500, walk: 300 }, distance: { run: 5, walk: 1 }, terrain: 1, pace: { run: 420, walk: 720 }, expanded: false };
  byId('byu-mode').value = 'break';
  byId('byu-strategy').value = 'time';
  for (const leg of ['run', 'walk']) {
    byId(`byu-${leg}-length`).addEventListener('input', () => { byu[byu.mode][leg] = value(`byu-${leg}-length`) * (byu.mode === 'time' ? 60 : factor()); });
    for (const part of ['minutes', 'seconds']) byId(`byu-${leg}-${part}`).addEventListener('input', () => { byu.pace[leg] = (value(`byu-${leg}-minutes`) * 60 + value(`byu-${leg}-seconds`)) / factor(); });
  }
  byId('byu-terrain').addEventListener('input', () => { byu.terrain = value('byu-terrain') * factor(); });
  byId('byu-strategy').addEventListener('change', () => { byu.mode = byId('byu-strategy').value; renderByuInputs(); refresh(); });
  for (const yards of [6, 12, 24]) byId(`byu-${yards}`).addEventListener('click', () => { byId('byu-yards').value = String(yards); refresh(); });
  byId('byu-expand').addEventListener('click', () => { byu.expanded = !byu.expanded; refresh(); });
  renderByuInputs();
}
function renderByuInputs() {
  if (!byu) return;
  for (const leg of ['run', 'walk']) {
    if (byu.mode !== 'terrain') byId(`byu-${leg}-length`).value = Number.isFinite(byu[byu.mode][leg]) ? clean(byu[byu.mode][leg] / (byu.mode === 'time' ? 60 : factor())) : '';
    if (Number.isFinite(byu.pace[leg])) {
      const seconds = Math.round(byu.pace[leg] * factor());
      byId(`byu-${leg}-minutes`).value = String(Math.floor(seconds / 60));
      byId(`byu-${leg}-seconds`).value = String(seconds % 60);
    }
  }
  byId('byu-terrain').value = Number.isFinite(byu.terrain) ? clean(byu.terrain / factor()) : '';
}
function refreshByu() {
  if (!byu) return;
  const yardKm = 6.7056;
  const unit = defaultUnit === 'mile' ? 'mile' : 'km';
  const strategy = byId('byu-mode').value === 'strategy';
  byId('byu-break-fields').hidden = strategy;
  byId('byu-strategy-fields').hidden = !strategy;
  byId('byu-interval-fields').hidden = byu.mode === 'terrain';
  byId('byu-terrain-fields').hidden = byu.mode !== 'terrain';
  byId('byu-yard-label').textContent = `${clean(yardKm / factor())} ${unit === 'mile' ? 'miles' : 'km'} per yard. One new start every hour.`;
  byId('byu-terrain-label').textContent = `Walking distance per yard (${unit})`;
  for (const leg of ['run', 'walk']) {
    byId(`byu-${leg}-label`).textContent = `${leg === 'run' ? 'Running' : 'Walking'} pace / ${unit}`;
    byId(`byu-${leg}-length-label`).textContent = `${leg === 'run' ? 'Run' : 'Walk'} (${byu.mode === 'time' ? 'minutes' : unit})`;
  }
  const yards = value('byu-yards'), prep = value('byu-prep') * 60;
  let loop = (60 - value('byu-break')) * 60;
  if (strategy) {
    const rp = byu.pace.run, wp = byu.pace.walk;
    loop = NaN;
    if (rp > 0 && wp > 0 && Number.isFinite(rp) && Number.isFinite(wp)) {
      if (byu.mode === 'terrain') {
        if (byu.terrain >= 0 && byu.terrain <= yardKm) loop = (yardKm - byu.terrain) * rp + byu.terrain * wp;
      } else {
        const r = byu[byu.mode].run, w = byu[byu.mode].walk;
        if (r > 0 && w > 0 && Number.isFinite(r) && Number.isFinite(w)) {
          const rd = byu.mode === 'time' ? r / rp : r, wd = byu.mode === 'time' ? w / wp : w;
          const cycles = Math.floor(yardKm / (rd + wd));
          const remainder = Math.max(0, yardKm - cycles * (rd + wd));
          loop = (cycles * rd + Math.min(remainder, rd)) * rp + (cycles * wd + Math.max(0, remainder - rd)) * wp;
        }
      }
    }
  }
  byId('byu-expand').hidden = true;
  if (!Number.isFinite(loop) || loop <= 0 || !Number.isFinite(prep) || !Number.isInteger(yards) || yards < 1 || yards > 200) {
    show('byu', '\u2014', 'Enter valid positive paces and intervals, or a target break.', []);
    byId('byu-status').textContent = 'Check your inputs. Walking distance must fit within one yard.';
    byId('byu-total').textContent = '';
    byId('byu-rows').innerHTML = '';
    return;
  }
  const rest = 3600 - loop;
  show('byu', time(loop), strategy ? 'Estimated loop time' : 'Required loop time', [[time(loop / yardKm * factor()), `average pace / ${unit}`], [time(Math.max(0, rest)), 'break per yard'], [time(Math.max(0, rest - prep)), 'break after preparation']]);
  byId('byu-status').textContent = rest <= 0 ? (rest < 0 ? `Over the hourly limit by ${time(-rest)}. This plan misses the next start.` : 'No time to spare. This plan leaves no margin before the next start.') : rest < prep ? 'Your break is shorter than the preparation allowance.' : `Fits the hour with ${time(rest - prep)} available after preparation.`;
  byId('byu-total').textContent = `${yards} yards = ${decimal(yards * yardKm / factor())} ${unit === 'mile' ? 'miles' : 'km'}. Total moving time: ${time(yards * loop)}. Breaks between yards: ${time((yards - 1) * Math.max(0, rest))}.`;
  const start = byId('byu-start').value;
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(start)) {
    byId('byu-rows').innerHTML = '<tr><td colspan="4">Enter a start time to see the schedule.</td></tr>';
    return;
  }
  const [hours, minutes] = start.split(':').map(Number);
  const startSeconds = hours * 3600 + minutes * 60;
  const clockTime = seconds => {
    const rounded = Math.round(seconds);
    const day = Math.floor(rounded / 86400);
    const h = Math.floor(rounded / 3600) % 24, m = Math.floor(rounded / 60) % 60, sec = rounded % 60;
    return `${day ? `Day ${day + 1} ` : ''}${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };
  const rows = [];
  for (let i = 0; i < Math.min(yards, byu.expanded ? 200 : 10); i++) {
    const begin = startSeconds + i * 3600;
    rows.push(`<tr><td>${i + 1}</td><td>${clockTime(begin)}</td><td>${clockTime(begin + loop)}</td><td>${i + 1 === yards ? 'Goal reached' : clockTime(begin + 3600)}</td></tr>`);
  }
  byId('byu-rows').innerHTML = rows.join('');
  byId('byu-expand').hidden = yards <= 10;
  byId('byu-expand').textContent = byu.expanded ? 'Show fewer yards' : 'Show all yards';
  byId('byu-expand').setAttribute('aria-expanded', String(byu.expanded));
}

function ultraMarkup() {
  const leg = (name, minutes) => `<fieldset class="field"><legend class="field-title" id="ultra-${name}-label">${name} pace</legend><div class="time-fields">${numberField(`ultra-${name}-minutes`, 'Minutes', minutes)}${numberField(`ultra-${name}-seconds`, 'Seconds', 0, 59)}</div></fieldset>`;
  return `<div class="workspace"><div class="input-panel"><h2>Plan the long run.</h2><p class="subtext">Repeat a run, then a walk, until the finish.</p>${unitSwitcher('ultra')}${distanceField('ultra')}
    <div class="field"><label class="form-label" for="ultra-mode">Repeat by</label><select class="form-select" id="ultra-mode"><option value="distance">Distance</option><option value="time">Time</option></select><p class="subtext mt-2">Distance suits route markers; time suits a repeating watch timer.</p></div>
    <div class="presets" role="group" aria-label="Strategy examples"><button class="btn preset" type="button" id="ultra-example-distance">Run 5 km / walk 1 km</button><button class="btn preset" type="button" id="ultra-example-time">Run 25 min / walk 5 min</button></div>
    <div class="time-fields"><div><label class="form-label" id="ultra-run-length-label" for="ultra-run-length">Run (km)</label><input class="form-control" id="ultra-run-length" type="number" min="0" step="any" value="1"></div><div><label class="form-label" id="ultra-walk-length-label" for="ultra-walk-length">Walk (km)</label><input class="form-control" id="ultra-walk-length" type="number" min="0" step="any" value="0.5"></div></div>
    ${leg('run', 6)}${leg('walk', 12)}
    <div class="field"><label class="form-label" for="ultra-stops">Total stopped time (minutes)</label><input class="form-control" id="ultra-stops" type="number" min="0" step="any" value="0"><p class="subtext mt-2">Add aid stations and other breaks. Example strategies are editable starting points.</p></div></div>
    <div>${result('ultra', 'ESTIMATED FINISH TIME')}<div class="field"><h3 class="h6">Your repeating plan</h3><p id="ultra-summary" class="subtext" aria-live="polite"></p><p class="subtext">Starts with a run. The last interval stops at the finish. Assumes constant running and walking paces; terrain and fatigue may change your actual time.</p></div></div></div>`;
}

// Preserve kilometres and seconds internally to avoid unit conversion drift.
var ultra;
function setupUltra() {
  ultra = { mode: 'distance', distance: { run: 5, walk: 1 }, time: { run: 1500, walk: 300 }, pace: { run: 360, walk: 720 } };
  byId('ultra-mode').value = 'distance';
  for (const leg of ['run', 'walk']) {
    byId(`ultra-${leg}-length`).addEventListener('input', () => {
      ultra[ultra.mode][leg] = value(`ultra-${leg}-length`) * (ultra.mode === 'distance' ? factor() : 60);
    });
    for (const part of ['minutes', 'seconds']) byId(`ultra-${leg}-${part}`).addEventListener('input', () => {
      ultra.pace[leg] = (value(`ultra-${leg}-minutes`) * 60 + value(`ultra-${leg}-seconds`)) / factor();
    });
  }
  byId('ultra-mode').addEventListener('change', () => {
    ultra.mode = byId('ultra-mode').value;
    renderUltraInputs();
    refresh();
  });
  for (const mode of ['distance', 'time']) byId(`ultra-example-${mode}`).addEventListener('click', () => {
    ultra.mode = mode;
    ultra[mode] = mode === 'distance' ? { run: 5, walk: 1 } : { run: 1500, walk: 300 };
    byId('ultra-mode').value = mode;
    renderUltraInputs();
    refresh();
  });
  renderUltraInputs();
}
function renderUltraInputs() {
  if (!ultra) return;
  for (const leg of ['run', 'walk']) {
    byId(`ultra-${leg}-length`).value = Number.isFinite(ultra[ultra.mode][leg]) ? clean(ultra[ultra.mode][leg] / (ultra.mode === 'distance' ? factor() : 60)) : '';
    if (Number.isFinite(ultra.pace[leg])) {
      const seconds = Math.round(ultra.pace[leg] * factor());
      byId(`ultra-${leg}-minutes`).value = String(Math.floor(seconds / 60));
      byId(`ultra-${leg}-seconds`).value = String(seconds % 60);
    }
  }
}
function refreshUltra() {
  if (!ultra) return;
  const unit = defaultUnit === 'mile' ? 'mile' : 'km';
  const intervalUnit = ultra.mode === 'distance' ? (defaultUnit === 'mile' ? 'miles' : 'km') : 'min';
  for (const leg of ['run', 'walk']) {
    byId(`ultra-${leg}-length-label`).textContent = `${leg === 'run' ? 'Run' : 'Walk'} (${intervalUnit})`;
    byId(`ultra-${leg}-label`).textContent = `${leg === 'run' ? 'Running' : 'Walking'} pace / ${unit}`;
  }
  byId('ultra-example-distance').textContent = defaultUnit === 'mile' ? 'Run 3.11 mi / walk 0.62 mi' : 'Run 5 km / walk 1 km';
  const runPace = ultra.pace.run, walkPace = ultra.pace.walk;
  const runLength = ultra[ultra.mode].run, walkLength = ultra[ultra.mode].walk;
  const stops = value('ultra-stops') * 60, distance = distances.ultra;
  if (![distance, runPace, walkPace, runLength, walkLength, stops].every(Number.isFinite) || distance <= 0 || runPace <= 0 || walkPace <= 0 || runLength <= 0 || walkLength <= 0 || stops < 0) {
    show('ultra', '\u2014', 'Enter a distance, positive run/walk intervals and paces.', []);
    byId('ultra-summary').textContent = 'Choose a race distance and enter both parts of your repeating plan.';
    return;
  }
  const runDistance = ultra.mode === 'distance' ? runLength : runLength / runPace;
  const walkDistance = ultra.mode === 'distance' ? walkLength : walkLength / walkPace;
  const cycle = runDistance + walkDistance;
  const cycles = Math.floor(distance / cycle);
  const remaining = Math.max(0, distance - cycles * cycle);
  const running = (cycles * runDistance + Math.min(remaining, runDistance)) * runPace;
  const walking = (cycles * walkDistance + Math.max(0, remaining - runDistance)) * walkPace;
  const moving = running + walking, total = moving + stops;
  if (!Number.isFinite(total)) {
    show('ultra', '\u2014', 'These values are too large to calculate.', []);
    byId('ultra-summary').textContent = '';
    return;
  }
  show('ultra', time(total), 'Includes your stopped time', [[time(running), 'running'], [time(walking), 'walking'], [time(stops), 'stopped'], [time(total / distance * factor()), `overall pace / ${unit}`], [decimal(distance / factor() / (total / 3600)), defaultUnit === 'mile' ? 'mph overall' : 'km/h overall']]);
  const divisor = ultra.mode === 'distance' ? factor() : 60;
  byId('ultra-summary').textContent = `Run ${clean(runLength / divisor)} ${intervalUnit}, then walk ${clean(walkLength / divisor)} ${intervalUnit}. ${cycles} full run/walk cycles${remaining > 1e-9 ? `, then a partial cycle ending during the ${remaining <= runDistance ? 'run' : 'walk'}` : ''}. Moving time: ${time(moving)}.`;
}
