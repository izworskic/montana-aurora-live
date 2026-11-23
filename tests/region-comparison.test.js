const test = require('node:test');
const assert = require('node:assert/strict');
const {bestCloudWindow} = require('../lib/aurora');
const {regions} = require('../config/state');
const locations = require('../config/seo-locations-expansion');

test('Flathead Lake guide uses a distinct weather point from Whitefish', () => {
  const lake = locations.find(place => place.slug === 'flathead-lake');
  const point = regions.find(region => region.id === lake.region_id);
  const town = regions.find(region => region.id === 'whitefish');
  assert.match(point.label, /West Shore/);
  assert.ok(Math.abs(point.latitude - town.latitude) > 0.3);
});

test('a preferred night window cannot bridge daylight or a missing hour', () => {
  const rows = ['01','02','20','21','22'].map((hour, index) => ({
    time: '2026-11-23T' + hour + ':00:00Z', cloud_percent: index < 3 ? 0 : 60
  }));
  assert.equal(bestCloudWindow(rows).start, rows[2].time);
  assert.equal(bestCloudWindow(rows.slice(0, 3)), null);
});
