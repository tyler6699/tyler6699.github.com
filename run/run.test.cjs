// Run with: node --test run.test.cjs

// Exercise the app's event handlers using a small DOM fixture, without a browser.

const { test } = require('node:test');

const assert = require('node:assert/strict');

const fs = require('node:fs');

const vm = require('node:vm');



function app(storage = new Map()) {

  const localStorage = {

    getItem: key => storage.get(key),

    setItem: (key, value) => storage.set(key, value)

  };

  const elements = new Map();

  const presets = [];

  const element = (id, value = '', attrs = {}) => {

    const listeners = {};

    const node = {

      value, checked: false, textContent: '', innerHTML: '', dataset: {},

      attributes: {}, classList: { toggle() {} }, setAttribute(name, value) { this.attributes[name] = value; },

      get validity() {

        const n = Number(this.value);

        return { valid: Number.isFinite(n) && n >= 0 && (!attrs.max || n <= Number(attrs.max)) && (attrs.step !== '1' || Number.isInteger(n)) };

      },

      addEventListener(type, fn) { (listeners[type] ||= []).push(fn); },

      fire(type) {

        for (const fn of listeners[type] || []) fn();

        if (id !== 'calculator-panels' && type !== 'click') elements.get('calculator-panels').fire(type);

      },

      insertAdjacentHTML(position, html) {

        for (const match of html.matchAll(/<([a-z]+)\b([^>]*\bid="([^"]+)"[^>]*)>/g)) {

          const attributes = Object.fromEntries([...match[2].matchAll(/([\w-]+)="([^"]*)"/g)].map(m => [m[1], m[2]]));

          element(match[3], attributes.value || (match[1] === 'select' ? 'mile' : ''), attributes);

        }

        for (const match of html.matchAll(/data-key="([^"]+)" data-km="([^"]+)"/g)) {

          const button = element(`preset-${presets.length}`);

          button.dataset = { key: match[1], km: match[2] };

          presets.push(button);

        }

      }

    };

    elements.set(id, node);

    return node;

  };

  element('calculator-tabs'); element('calculator-panels');

  const context = vm.createContext({ localStorage, document: { getElementById: id => elements.get(id), querySelectorAll: () => presets } });

  vm.runInContext(fs.readFileSync(`${__dirname}/run.js`, 'utf8'), context);

  return {

    get: id => elements.get(id),

    input(id, value) { const node = elements.get(id); node.value = String(value); node.fire('input'); },

    select(id, value) { const node = elements.get(id); node.value = value; node.fire('change'); },

    preset(key, km) { presets.find(p => p.dataset.key === key && Number(p.dataset.km) === km).fire('click'); }

  };

}





const unitFields = ['default-unit'];

test('KM defaults, no independent pace selector, and only metric results', () => {

  const a = app();

  for (const id of unitFields) assert.equal(a.get(id).value, 'km');

  assert.equal(a.get('pace-per'), undefined);

  a.preset('pace', 5);

  assert.equal(a.get('pace-result').textContent, '00:35:00');

  assert.match(a.get('pace-metrics').innerHTML, /km\/h/);

  assert.doesNotMatch(a.get('pace-metrics').innerHTML, /mph|miles/);

});

test('Pace switch updates settings, converts live inputs and persists', () => {

  const storage = new Map(); const a = app(storage);

  a.preset('pace', 5); a.input('pace-minutes', 5);

  a.input('time-speed', 10); a.preset('time', 5);

  a.get('units-mile').fire('click');

  for (const id of unitFields) assert.equal(a.get(id).value, 'mile');

  assert.equal(a.get('pace-distance').value, '3.10686');

  assert.equal(a.get('time-speed').value, '6.21371');

  assert.equal(a.get('pace-minutes').value, '8');

  assert.equal(a.get('pace-seconds').value, '3');

  assert.equal(a.get('pace-result').textContent, '00:25:00');

  assert.equal(a.get('time-result').textContent, '00:30:00');

  assert.match(a.get('pace-metrics').innerHTML, /mph/);

  assert.doesNotMatch(a.get('pace-metrics').innerHTML, /km\/h/);

  const reopened = app(storage);

  for (const id of unitFields) assert.equal(reopened.get(id).value, 'mile');

  a.select('default-unit', 'km');

  assert.equal(a.get('pace-distance').value, '5');

  assert.equal(a.get('pace-minutes').value, '5');

  assert.equal(a.get('pace-seconds').value, '0');

  assert.equal(app(storage).get('default-unit').value, 'km');

});

for (const key of ['pace', 'speed', 'time']) {

  test(`${key}: preset round trips remain exact`, () => {

    const a = app();

    for (const km of [5, 10, 21.0975, 42.195]) {

      a.preset(key, km);

      for (let i = 0; i < 20; i++) {

        a.select('default-unit', 'mile');

        assert.ok(Math.abs(Number(a.get(`${key}-distance`).value) - km / 1.609344) < .00001);

        a.select('default-unit', 'km');

        assert.equal(a.get(`${key}-distance`).value, String(km));

      }

    }

  });

}

test('manual distance edits, empty inputs, zero and invalid pace', () => {

  const a = app(); a.input('pace-distance', 5);

  a.get('units-mile').fire('click'); a.input('pace-distance', 1);

  a.get('units-km').fire('click');

  assert.equal(a.get('pace-distance').value, '1.60934');

  a.input('pace-distance', ''); a.select('default-unit', 'mile');

  assert.equal(a.get('pace-distance').value, '');

  assert.equal(a.get('pace-result').textContent, '\u2014');

  a.input('pace-distance', 0);

  assert.equal(a.get('pace-result').textContent, '00:00:00');

  a.input('pace-minutes', -1);

  assert.equal(a.get('pace-result').textContent, '\u2014');

});

test('all calculators display only the selected units with correct results', () => {

  const a = app(); a.preset('speed', 5); a.input('speed-minutes', 30);

  a.preset('time', 5); a.input('time-speed', 10);

  a.input('distance-minutes', 30); a.input('distance-speed', 10);

  assert.equal(a.get('speed-result').textContent, '10.00 km/h');

  assert.equal(a.get('time-result').textContent, '00:30:00');

  assert.equal(a.get('distance-result').textContent, '5.00 km');

  a.select('default-unit', 'mile');

  assert.equal(a.get('speed-result').textContent, '6.21 mph');

  assert.equal(a.get('time-result').textContent, '00:30:00');

  assert.equal(a.get('distance-result').textContent, '3.11 miles');

  for (const key of ['pace', 'speed', 'time', 'distance']) {

    assert.doesNotMatch(a.get(`${key}-metrics`).innerHTML, /km/);

    assert.doesNotMatch(a.get(`${key}-note`).textContent, /km/);

  }

  a.get('time-units-km').fire('click');

  assert.equal(a.get('default-unit').value, 'km');

  assert.equal(a.get('time-speed').value, '10');

});

test('fractional seconds and precision still work', () => {

  const a = app(); a.input('time-distance', 1); a.input('time-speed', 60.000001);

  a.get('split-seconds').checked = true; a.get('split-seconds').fire('change');

  assert.equal(a.get('time-result').textContent, '00:01:00.00');

  a.input('precision', 100);

  assert.equal(a.get('time-result').textContent, '00:01:00.00000');

});

test('blocked storage still updates units for the current visit', () => {

  const a = app({ get() { throw Error('blocked'); }, set() { throw Error('blocked'); } });

  a.get('units-mile').fire('click');

  assert.equal(a.get('default-unit').value, 'mile');

  assert.match(a.get('default-unit-note').textContent, /could not save/);

});


for (const tab of ['speed', 'time', 'distance']) {
  test(`${tab} switch synchronizes every tab and saves the units`, () => {
    const storage = new Map(); const a = app(storage);
    a.preset('speed', 5); a.preset('time', 5); a.input('time-speed', 10);
    a.get(`${tab}-units-mile`).fire('click');
    assert.equal(a.get('default-unit').value, 'mile');
    assert.equal(a.get('speed-distance').value, '3.10686');
    assert.equal(a.get('time-result').textContent, '00:30:00');
    for (const key of ['pace', 'speed', 'time']) assert.equal(a.get(`${key}-distance-unit`).textContent, 'Miles');
    for (const key of ['time', 'distance']) assert.equal(a.get(`${key}-speed-unit`).textContent, 'mph');
    for (const prefix of ['', 'speed-', 'time-', 'distance-']) {
      assert.equal(a.get(`${prefix}units-mile`).attributes['aria-pressed'], 'true');
      assert.equal(a.get(`${prefix}units-km`).attributes['aria-pressed'], 'false');
    }
    assert.equal(app(storage).get('default-unit').value, 'mile');
    a.get(`${tab}-units-km`).fire('click');
    assert.equal(a.get('speed-distance').value, '5');
    assert.equal(a.get('time-speed').value, '10');
    assert.equal(a.get('time-speed-unit').textContent, 'km/h');
  });
}


test('splits show ten rows initially and expand into the page', () => {
  const a = app(); a.preset('pace', 42.195);
  const count = () => (a.get('split-rows').innerHTML.match(/<tr[ >]/g) || []).length;
  assert.equal(count(), 10);
  assert.equal(a.get('toggle-splits').hidden, false);
  assert.doesNotMatch(a.get('split-rows').innerHTML, /Finish/);
  a.get('toggle-splits').fire('click');
  assert.equal(count(), 43);
  assert.match(a.get('split-rows').innerHTML, /42.195.*Finish/);
  assert.equal(a.get('toggle-splits').attributes['aria-expanded'], 'true');
  a.get('toggle-splits').fire('click');
  assert.equal(count(), 10);
  a.preset('pace', 5);
  assert.equal(count(), 5);
  assert.equal(a.get('toggle-splits').hidden, true);
});

test('Ultra restores distance and timed plans, partial legs and stops', () => {
  const a = app();
  for (const [distance, expected] of [[6, '00:42:00'], [6.5, '00:45:00'], [5.5, '00:36:00']]) {
    a.input('ultra-distance', distance);
    assert.equal(a.get('ultra-result').textContent, expected);
  }
  a.input('ultra-stops', 10);
  assert.equal(a.get('ultra-result').textContent, '00:46:00');
  a.input('ultra-stops', 0); a.select('ultra-mode', 'time');
  a.input('ultra-distance', 4.5);
  assert.equal(a.get('ultra-result').textContent, '00:29:00');
});
test('Ultra keeps finish time and strategy through shared unit changes', () => {
  const a = app(); a.preset('ultra', 50);
  const expected = a.get('ultra-result').textContent;
  a.get('ultra-units-mile').fire('click');
  assert.equal(a.get('default-unit').value, 'mile');
  assert.equal(a.get('ultra-run-length').value, '3.10686');
  assert.equal(a.get('ultra-result').textContent, expected);
  a.get('ultra-units-km').fire('click');
  assert.equal(a.get('ultra-run-length').value, '5');
  assert.equal(a.get('ultra-result').textContent, expected);
  a.input('ultra-run-length', 0);
  assert.equal(a.get('ultra-result').textContent, '\u2014');
});

test('Ultra 25/5 button selects time mode and fills both intervals', () => {
  const a = app();
  a.input('ultra-run-length', 2);
  a.get('ultra-example-time').fire('click');
  assert.equal(a.get('ultra-mode').value, 'time');
  assert.equal(a.get('ultra-run-length').value, '25');
  assert.equal(a.get('ultra-walk-length').value, '5');
  a.input('ultra-distance', 55 / 12);
  assert.equal(a.get('ultra-result').textContent, '00:30:00');
});

test('Ultra distance button sets 5 km running and 1 km walking', () => {
  const a = app(); a.get('ultra-example-time').fire('click');
  a.get('ultra-example-distance').fire('click');
  assert.equal(a.get('ultra-mode').value, 'distance');
  assert.equal(a.get('ultra-run-length').value, '5');
  assert.equal(a.get('ultra-walk-length').value, '1');
  assert.equal(a.get('ultra-example-distance').textContent, 'Run 5 km / walk 1 km');
});

test('BYU target break, preparation and schedule defaults', () => {
  const a = app();
  assert.equal(a.get('byu-result').textContent, '00:50:00');
  assert.match(a.get('byu-metrics').innerHTML, /00:07:27/);
  assert.match(a.get('byu-metrics').innerHTML, /00:08:00/);
  assert.match(a.get('byu-rows').innerHTML, /09:50:00/);
  assert.equal((a.get('byu-rows').innerHTML.match(/<tr>/g) || []).length, 10);
  a.get('byu-expand').fire('click');
  assert.equal((a.get('byu-rows').innerHTML.match(/<tr>/g) || []).length, 12);
  a.get('byu-units-mile').fire('click');
  assert.equal(a.get('byu-result').textContent, '00:50:00');
  assert.match(a.get('byu-metrics').innerHTML, /00:12:00/);
});
test('BYU terrain and timed intervals use partial final legs', () => {
  const a = app(); a.select('byu-mode', 'strategy');
  a.select('byu-strategy', 'terrain');
  a.input('byu-terrain', 1);
  // 5.7056km running at 7 min/km and 1km walking at 12 min/km.
  assert.equal(a.get('byu-result').textContent, '00:51:56');
  a.select('byu-strategy', 'time');
  a.input('byu-run-minutes', 6);
  // One 25/5 cycle = 55/12 km, remainder is running.
  assert.equal(a.get('byu-result').textContent, '00:42:44');
  const finish = a.get('byu-result').textContent;
  a.get('byu-units-mile').fire('click');
  assert.equal(a.get('byu-result').textContent, finish);
  assert.equal(a.get('byu-run-length').value, '25');
  a.select('byu-strategy', 'distance');
  a.get('byu-units-km').fire('click');
  assert.equal(a.get('byu-run-length').value, '5');
  assert.equal(a.get('byu-result').textContent, '00:46:14');
});
test('BYU schedule rolls over midnight and counts 24 yards as 100 miles', () => {
  const a = app(); a.input('byu-start', '23:00');
  a.get('byu-24').fire('click');
  a.get('byu-units-mile').fire('click');
  assert.match(a.get('byu-rows').innerHTML, /Day 2 00:00:00/);
  assert.match(a.get('byu-total').textContent, /100.00 miles/);
  a.input('byu-yards', 1);
  assert.match(a.get('byu-total').textContent, /Breaks between yards: 00:00:00/);
});
test('BYU warns for missed starts and short breaks and rejects invalid inputs', () => {
  const a = app(); a.input('byu-break', 1);
  assert.match(a.get('byu-status').textContent, /shorter/);
  a.select('byu-mode', 'strategy'); a.select('byu-strategy', 'terrain');
  a.input('byu-terrain', 6.7056);
  assert.match(a.get('byu-status').textContent, /misses the next start/);
  a.input('byu-terrain', 7);
  assert.equal(a.get('byu-result').textContent, '\u2014');
  assert.equal(a.get('byu-rows').innerHTML, '');
  a.select('byu-mode', 'break'); a.input('byu-yards', 0);
  assert.equal(a.get('byu-result').textContent, '\u2014');
});
