/* =====================================================================
   EVENTS — edit this list to post, change, or remove events.

   HOW TO ADD AN EVENT
   1. Put the poster image in the assets/ folder (a .jpg keeps it small).
   2. Copy one { ... } block below, paste it into the list, and fill it in.
   3. Commit. That's it: the event shows on the homepage and the Events
      page, sorted by date, and moves to "Past events" by itself once it ends.

   FIELDS
   title       Event name (required)
   type        Small label above the title, e.g. "Seminar", "Social", "Workshop"
   date        "YYYY-MM-DD" (required)
   start/end   24-hour time, "19:00" / "21:00" (end is optional)
   speaker     Guest speaker's name (optional)
   location    Where it is (optional)
   description One or two sentences (optional)
   note        Small print, e.g. "All are welcome · No registration required"
   image       Poster path, e.g. "assets/my_poster.jpg" (optional)
   imageAlt    Short description of the poster for screen readers
   link        Sign-up or info URL (optional) — linkLabel sets the button text
   ===================================================================== */

const EVENTS = [
  {
    title: "Once There Was an Arrow",
    type: "Student Branch Seminar",
    date: "2026-11-12",
    start: "19:00",
    end: "21:00",
    speaker: "Walter Gordan",
    location: "Azrieli Theatre 102, Carleton University",
    description: "",
    note: "All are welcome · No registration required",
    image: "assets/event_2026-11-12_arrow_seminar.jpg",
    imageAlt: "Poster for the seminar Once There Was an Arrow with guest speaker Walter Gordan, showing an Avro Arrow in flight",
    link: "",
    linkLabel: ""
  },
];

/* ---------- rendering (no need to edit below this line) ---------- */
(function () {
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function at(date, time) {
    const [y, m, d] = date.split('-').map(Number);
    const [hh, mm] = (time || '00:00').split(':').map(Number);
    return new Date(y, m - 1, d, hh, mm);
  }
  function clock(time) {
    const [h, m] = time.split(':').map(Number);
    return { h: ((h + 11) % 12) + 1, m, pm: h >= 12 };
  }
  function timeRange(ev) {
    if (!ev.start) return '';
    const a = clock(ev.start);
    const fmt = t => t.h + (t.m ? ':' + String(t.m).padStart(2, '0') : '');
    if (!ev.end) return fmt(a) + (a.pm ? ' PM' : ' AM');
    const b = clock(ev.end);
    return a.pm === b.pm
      ? fmt(a) + '–' + fmt(b) + (b.pm ? ' PM' : ' AM')
      : fmt(a) + (a.pm ? ' PM' : ' AM') + ' – ' + fmt(b) + (b.pm ? ' PM' : ' AM');
  }
  const endOf = ev => ev.end ? at(ev.date, ev.end)
    : ev.start ? new Date(at(ev.date, ev.start).getTime() + 2 * 3600e3)
    : at(ev.date, '23:59');

  function card(ev) {
    const d = at(ev.date, ev.start);
    const wk = d.toLocaleDateString('en-CA', { weekday: 'short' });
    const mo = d.toLocaleDateString('en-CA', { month: 'short' }).replace('.', '');
    const meta = [timeRange(ev), ev.location].filter(Boolean)
      .map(t => '<span>' + esc(t) + '</span>').join('');
    return '<article class="event-card">' +
      (ev.image
        ? '<a class="event-poster" href="' + esc(ev.image) + '" target="_blank" rel="noopener" aria-label="Open full poster for ' + esc(ev.title) + '">' +
          '<img src="' + esc(ev.image) + '" alt="' + esc(ev.imageAlt || ev.title) + '" loading="lazy"></a>'
        : '') +
      '<div class="event-body">' +
        '<div class="event-date mono"><span class="ed-wk">' + esc(wk) + '</span>' +
          '<span class="ed-day">' + d.getDate() + '</span><span class="ed-mo">' + esc(mo) + '</span></div>' +
        '<div class="event-info">' +
          (ev.type ? '<div class="event-type mono">' + esc(ev.type) + '</div>' : '') +
          '<h3>' + esc(ev.title) + '</h3>' +
          (ev.speaker ? '<p class="event-speaker">Guest speaker <strong>' + esc(ev.speaker) + '</strong></p>' : '') +
          (meta ? '<div class="event-meta">' + meta + '</div>' : '') +
          (ev.description ? '<p class="event-desc">' + esc(ev.description) + '</p>' : '') +
          (ev.note ? '<p class="event-note mono">' + esc(ev.note) + '</p>' : '') +
          (ev.link ? '<a class="btn btn-primary" href="' + esc(ev.link) + '" target="_blank" rel="noopener">' + esc(ev.linkLabel || 'Details') + '</a>' : '') +
        '</div>' +
      '</div>' +
    '</article>';
  }

  const now = new Date();
  const sorted = EVENTS.slice().sort((a, b) => at(a.date, a.start) - at(b.date, b.start));
  const upcoming = sorted.filter(ev => endOf(ev) >= now);
  const past = sorted.filter(ev => endOf(ev) < now).reverse();

  // Homepage teaser: next 2 events; the whole section hides when nothing is coming up.
  const home = document.getElementById('homeEvents');
  if (home) {
    if (upcoming.length) home.querySelector('.event-list').innerHTML = upcoming.slice(0, 2).map(card).join('');
    else home.hidden = true;
  }

  // Events page: all upcoming, plus a compact past-events list.
  const list = document.getElementById('upcomingEvents');
  if (list) {
    list.innerHTML = upcoming.length ? upcoming.map(card).join('')
      : '<div class="event-empty"><h3>Nothing scheduled just yet</h3><p>New seminars and socials are posted here first — and on <a href="https://www.instagram.com/aiaa.carleton" target="_blank" rel="noopener">@aiaa.carleton</a>.</p></div>';
  }
  const pastWrap = document.getElementById('pastEvents');
  if (pastWrap) {
    if (past.length) {
      pastWrap.querySelector('.timeline-list').innerHTML = past.map(ev => {
        const d = at(ev.date, ev.start);
        return '<div class="timeline-row"><div class="td">' +
          esc(d.toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })) +
          '</div><div class="te">' + esc(ev.title) + (ev.speaker ? ' <span class="past-speaker">with ' + esc(ev.speaker) + '</span>' : '') + '</div></div>';
      }).join('');
    } else pastWrap.hidden = true;
  }
})();
