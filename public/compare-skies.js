// Compare forecast hours on their UTC timestamps, including both occurrences of a fall-back hour.
(() => {
  'use strict';
  const home = document.getElementById('region');
  const other = document.getElementById('otherRegion');
  const hour = document.getElementById('compareHour');
  const result = document.getElementById('pairedSky');
  const guide = document.getElementById('pairedGuide');
  const details = document.getElementById('compareSkies');
  const hourField = document.getElementById('hourField');
  const clock = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Denver', weekday: 'short', hour: 'numeric', timeZoneName: 'short'
  });
  let homeData = null;
  let otherData = null;
  let request = 0;
  let pending = false;
  let lastMeasured = '';

  function fresh(data, region) {
    const age = Date.now() - Date.parse(data?.fetched_at);
    return data?.selected_region?.id === region && Number.isFinite(age) && age >= -60000 && age <= 20 * 60000;
  }

  function hours(data) {
    return (data?.night_hours || []).filter(row => Date.parse(row.time) + 3600000 > Date.now());
  }

  function analytics(name) {
    if (typeof window.gtag === 'function') window.gtag('event', name, {
      home_region: home.value, comparison_region: other.value
    });
  }

  function render() {
    const homeOption = home.selectedOptions[0];
    const otherOption = other.selectedOptions[0];
    const slug = otherOption?.dataset.guide;
    guide.hidden = !slug;
    if (slug) {
      guide.href = '/national-tools/aurora/montana/' + slug + '/';
      guide.textContent = 'Open the ' + otherOption.text + ' viewing guide';
    } else guide.removeAttribute('href');
    const rows = fresh(homeData, home.value) ? hours(homeData) : [];
    const selected = hour.value;
    hour.replaceChildren(...rows.map(row => new Option(clock.format(Date.parse(row.time)), row.time)));
    const preferred = homeData?.conditions?.best_dark_window?.start;
    if (rows.some(row => row.time === selected)) hour.value = selected;
    else if (rows.some(row => row.time === preferred)) hour.value = preferred;
    hourField.hidden = !other.value || !rows.length;
    if (!other.value) { result.textContent = ''; return; }
    if (!rows.length) { result.textContent = 'A current nighttime forecast for ' + homeOption.text + ' is needed to compare skies.'; return; }
    if (pending) { result.textContent = 'Checking the forecast for ' + otherOption.text + '…'; return; }
    if (!fresh(otherData, other.value)) { result.textContent = 'The second forecast is unavailable. Use Refresh to check again.'; return; }

    const at = Date.parse(hour.value);
    const first = rows.find(row => Date.parse(row.time) === at);
    const second = hours(otherData).find(row => Date.parse(row.time) === at);
    if (!second) { result.textContent = 'There is no matching nighttime forecast for both places at ' + clock.format(at) + '. Try another hour.'; return; }
    function cloud(data, row) {
      return data.source_freshness?.nws_sky_fresh && Number.isFinite(row.cloud_percent) ? row.cloud_percent : null;
    }
    const a = cloud(homeData, first);
    const b = cloud(otherData, second);
    const describe = value => value === null ? 'cloud cover unknown' : value + '% cloud cover';
    const interpretation = a === null || b === null ? 'One cloud forecast is missing, so there is no clear comparison.'
      : a === b ? 'The forecasts give both places the same cloud cover.'
      : (a < b ? homeOption.text : otherOption.text) + ' has the clearer forecast sky.';
    result.textContent = clock.format(at) + ' · ' + homeOption.text + ': ' + describe(a) + '. ' +
      otherOption.text + ': ' + describe(b) + '. ' + interpretation + ' Check NOAA’s short-term aurora map before setting out.';
    const key = home.value + '/' + other.value;
    if (a !== null && b !== null && key !== lastMeasured) {
      analytics('aurora_region_comparison');
      lastMeasured = key;
    }
  }

  async function compare() {
    const seq = ++request;
    const id = other.value;
    otherData = null;
    pending = Boolean(id);
    render();
    if (!id) return;
    try {
      const response = await fetch('https://montana-aurora-live.vercel.app/api/aurora?region=' + encodeURIComponent(id),
        {signal: AbortSignal.timeout(20000)});
      if (!response.ok) throw Error('Forecast unavailable');
      const data = await response.json();
      if (seq === request) otherData = data;
    } catch { /* render() explains a missing second forecast. */ }
    if (seq === request) { pending = false; render(); }
  }

  for (const option of home.options) {
    const copy = new Option(option.text, option.value);
    if (option.dataset.guide) copy.dataset.guide = option.dataset.guide;
    other.add(copy);
  }
  document.addEventListener('forecast-loading', () => {
    homeData = null;
    hour.replaceChildren();
    if (other.value === home.value) other.value = '';
    for (const option of other.options) option.disabled = option.value === home.value;
    ++request;
    pending = false;
    otherData = null;
    render();
  });
  document.addEventListener('state-aurora-data', event => {
    homeData = event.detail;
    if (other.value && details.open && !fresh(otherData, other.value) && !pending) compare();
    else render();
  });
  details.addEventListener('toggle', () => {
    if (details.open && other.value && !fresh(otherData, other.value) && !pending) compare();
  });
  other.addEventListener('change', () => { lastMeasured = ''; compare(); });
  hour.addEventListener('change', render);
  guide.addEventListener('click', () => analytics('aurora_comparison_guide_open'));
  setInterval(() => { if (details.open && other.value) render(); }, 60000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden && details.open) render(); });
  details.hidden = false;
})();
