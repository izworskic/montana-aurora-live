# MASTER EXECUTION PROMPT — MONTANA NORTHERN LIGHTS LIVE

Build and release **Montana Northern Lights Live** end to end as an independent GitHub/Vercel product. Michigan is reference-only. Do not edit `izworskic/chrisizworski-com`, `/northern-lights-michigan/`, Michigan `/api/aurora`, parsers, routing, canonical metadata, or create a Michigan runtime dependency. Any Michigan write is a -100 hard veto.

## Decision
Within the first viewport answer: **Is it worth going out tonight in Montana, where should I go, what time is best, and what could ruin the view?** Show verdict, 0–100 Viewing Score, selected region, local NOAA OVATION, NWS clouds, peak 24h Kp, best dark window, and three-night outlook. Viewing Score is a planning index, never a sighting probability and never formatted with `%`.

## Data/truth
Use NOAA SWPC Kp forecast/current Kp, OVATION Aurora 30-Minute Forecast, real-time solar wind magnetic field/speed, NWS sky cover/hourly darkness, USNO moon context. Soft-fail upstreams. Missing values stay null. Never call Kp or OVATION a local probability. Suppress score without darkness and when both Kp and OVATION are unavailable.

## Montana regions
`config/state.js` is authoritative: Glacier National Park, Whitefish/Flathead, Havre/Hi-Line, Fort Peck/northeast, Missoula/western valleys, Bozeman/southwest, Billings/south-central. Planning Kp is approximate trip guidance, not a hard physical boundary. Glacier is the benchmark because of protected dark skies and northern views.

## Score
OVATION 40, regional Kp fit 25, NWS clouds 20, darkness 8, southward Bz 4, solar-wind speed 3, bright moon penalty up to 5. Clamp 0–100. Labels: Strong viewing setup; Possible — worth checking; Watch conditions; Unlikely right now; Aurora signal, poor sky; No useful darkness; Live space-weather unavailable.

## UX/SEO
Use the successful Michigan editorial language system without copying Michigan state copy: paper background, green editorial type, dark aurora hero, circular score gauge, region picker, factors, three-night strip, current Kp/solar wind/moon metrics, Montana regional outlook, transparent sources, mobile first. Canonical `https://chrisizworski.com/national-tools/aurora/montana/`; unique metadata, WebApplication/BreadcrumbList schema, page index/follow, API noindex. Target northern lights Montana tonight, aurora forecast Montana, Glacier northern lights, Hi-Line aurora, best place to see northern lights Montana.

## Reliability/tests
Static HTML <150 KB, `s-maxage=300, stale-while-revalidate=900`, ~8s timeout, no paid API/DB/Replit/Michigan runtime. Test Kp header rows, OVATION longitude normalization, sky intervals, null preservation, score clamp/darkness/no-signal rules, valid unique regions/default, canonical, score-not-percent, API noindex.

## Value >=92/100
Decision clarity 20; data truth/reliability 20; Montana specificity 15; repeat value 10; mobile/accessibility 10; performance/resilience 10; SEO 10; source transparency 5.

## Loss
Michigan write -100; false probability -50; missing→zero -40; broken region/API -35; stale-as-live -35; generic clone -25; failed tests/build -25; bad canonical -25; weak mobile first-view -20.

Execute implementation, tests, build, Git commit, Vercel deployment, smoke tests, canonical/API-header verification, then verify Michigan SHA unchanged before hub linking.
