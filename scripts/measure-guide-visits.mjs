// Use the existing site property on the public canonical host only.
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const places = [...require('../config/seo-locations.js'), ...require('../config/seo-locations-expansion.js')];
const init = `<script id="aurora-analytics">
if (location.hostname === 'chrisizworski.com' && typeof window.gtag !== 'function') {
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(){window.dataLayer.push(arguments);};
  window.gtag('js', new Date());
  window.gtag('config', 'G-Y5D2V2W7HN');
  const tag = document.createElement('script');
  tag.async = true;
  tag.src = 'https://www.googletagmanager.com/gtag/js?id=G-Y5D2V2W7HN';
  document.head.appendChild(tag);
}
</script>`;
for (const page of ['public/index.html', ...places.map(place => 'public/' + place.slug + '/index.html')]) {
  const html = readFileSync(page, 'utf8');
  if (!html.includes('id="aurora-analytics"') && !html.includes("gtag('config', 'G-Y5D2V2W7HN')")) {
    writeFileSync(page, html.replace('</head>', init + '\n</head>'));
  }
}
