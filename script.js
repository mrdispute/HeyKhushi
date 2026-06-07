/* ============================================
   HEYKHUSHI — Premium Portfolio JS
   YouTube API + Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── CONFIG ──
  const YT_API_KEY = 'AIzaSyDCtRKWxiVyJJa1zXt7jlh162FKNRcxLnQ';
  const YT_CHANNEL_HANDLE = '@HeyKhushilive';
  let YT_CHANNEL_ID = null;

  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // ── CUSTOM CURSOR ──
  if (!isTouchDevice) {
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top = my + 'px';
    });

    (function followRing() {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(followRing);
    })();

    document.querySelectorAll('a, button, .btn, .bento-card, .game-tile, .gal-item, .conn-card, .metric').forEach(el => {
      el.addEventListener('mouseenter', () => { dot.classList.add('hover'); ring.classList.add('hover'); });
      el.addEventListener('mouseleave', () => { dot.classList.remove('hover'); ring.classList.remove('hover'); });
    });
  }

  // ── NAVBAR ──
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const allNavLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');

  window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 50), { passive: true });

  hamburger.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
    mobileOverlay.style.display = open ? 'block' : 'none';
    document.body.style.overflow = open ? 'hidden' : '';
  });

  function closeMobile() {
    hamburger.classList.remove('active');
    mobileNav.classList.remove('open');
    mobileOverlay.classList.remove('active');
    mobileOverlay.style.display = 'none';
    document.body.style.overflow = '';
  }
  mobileOverlay.addEventListener('click', closeMobile);

  allNavLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      closeMobile();
      const el = document.querySelector(link.getAttribute('href'));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Active link on scroll
  const sections = document.querySelectorAll('.section[id], .hero[id]');
  const deskLinks = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    const y = window.scrollY + 100;
    sections.forEach(s => {
      if (y >= s.offsetTop && y < s.offsetTop + s.offsetHeight) {
        const id = s.getAttribute('id');
        deskLinks.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { passive: true });

  // ── SCROLL REVEAL ──
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => revealObs.observe(el));

  // ── GAME TILE MOUSE GLOW ──
  if (!isTouchDevice) {
    document.querySelectorAll('.game-tile').forEach(tile => {
      tile.addEventListener('mousemove', e => {
        const r = tile.getBoundingClientRect();
        tile.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
        tile.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
      });
    });

    // Connect card glow
    document.querySelectorAll('.conn-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = e.clientX - r.left, y = e.clientY - r.top;
        card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,.06), transparent 50%)`;
      });
      card.addEventListener('mouseleave', () => { card.style.background = ''; });
    });
  }

  // ── GALLERY LIGHTBOX ──
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const lbClose = document.getElementById('lightbox-close');

  document.querySelectorAll('.gal-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      lbImg.src = img.src;
      lbImg.alt = item.dataset.caption || '';
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
  lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

  // ── STAT COUNTER ──
  let statDone = false;
  const metricEls = document.querySelectorAll('.metric-val');
  const statObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !statDone) {
        statDone = true;
        metricEls.forEach(el => {
          const txt = el.textContent;
          const m = txt.match(/(\d+)/);
          if (m) {
            const target = parseInt(m[1]);
            const suffix = txt.replace(m[1], '');
            let cur = 0;
            const step = Math.ceil(target / 40);
            const iv = setInterval(() => {
              cur += step;
              if (cur >= target) { cur = target; clearInterval(iv); }
              el.textContent = cur + suffix;
            }, 30);
          }
        });
      }
    });
  }, { threshold: 0.5 });
  const metricsWrap = document.querySelector('.about-metrics');
  if (metricsWrap) statObs.observe(metricsWrap);

  // ════════════════════════════════════════════
  //  YOUTUBE DATA API v3
  // ════════════════════════════════════════════

  function fmtCount(n) {
    n = parseInt(n); if (isNaN(n)) return '—';
    if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
    return n.toString();
  }

  function timeAgo(d) {
    const s = Math.floor((Date.now() - new Date(d)) / 1000);
    const iv = [['year',31536000],['month',2592000],['week',604800],['day',86400],['hour',3600],['minute',60]];
    for (const [l, sec] of iv) { const c = Math.floor(s / sec); if (c >= 1) return `${c} ${l}${c > 1 ? 's' : ''} ago`; }
    return 'just now';
  }

  function fmtDur(iso) {
    if (!iso) return '';
    const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!m) return '';
    const h = m[1] ? m[1] + ':' : '';
    return h + (m[2] || '0').padStart(h ? 2 : 1, '0') + ':' + (m[3] || '00').padStart(2, '0');
  }

  async function resolveChannel() {
    try {
      let r = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=HeyKhushilive&key=${YT_API_KEY}`);
      let d = await r.json();
      if (d.items?.length) { YT_CHANNEL_ID = d.items[0].id; return YT_CHANNEL_ID; }

      r = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(YT_CHANNEL_HANDLE)}&key=${YT_API_KEY}&maxResults=1`);
      d = await r.json();
      if (d.items?.length) { YT_CHANNEL_ID = d.items[0].snippet.channelId; return YT_CHANNEL_ID; }
      return null;
    } catch (e) { console.error('Channel resolve error:', e); return null; }
  }

  async function fetchChannel(id) {
    try {
      const r = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&id=${id}&key=${YT_API_KEY}`);
      const d = await r.json();
      if (!d.items?.length) return null;
      const c = d.items[0];
      return {
        title: c.snippet.title,
        description: c.snippet.description,
        avatar: c.snippet.thumbnails.high?.url || c.snippet.thumbnails.default?.url,
        subs: c.statistics.subscriberCount,
        vids: c.statistics.videoCount,
        views: c.statistics.viewCount,
        hidden: c.statistics.hiddenSubscriberCount,
      };
    } catch (e) { console.error(e); return null; }
  }

  async function fetchVideos(id, order = 'date', max = 6) {
    try {
      const r = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${id}&order=${order}&type=video&maxResults=${max}&key=${YT_API_KEY}`);
      const d = await r.json();
      if (!d.items) return [];
      const ids = d.items.map(v => v.id.videoId).join(',');
      const sr = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${ids}&key=${YT_API_KEY}`);
      const sd = await sr.json();
      return d.items.map(item => {
        const s = sd.items?.find(x => x.id === item.id.videoId);
        return {
          id: item.id.videoId,
          title: item.snippet.title,
          thumb: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
          date: item.snippet.publishedAt,
          channel: item.snippet.channelTitle,
          views: s?.statistics?.viewCount || '0',
          dur: s?.contentDetails?.duration || '',
        };
      });
    } catch (e) { console.error(e); return []; }
  }

  function updateChannelUI(ch) {
    if (!ch) return;
    const set = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
    const subTxt = ch.hidden ? '🔒' : fmtCount(ch.subs);
    set('yt-subscribers', subTxt);
    set('yt-video-count', fmtCount(ch.vids));
    set('yt-view-count', fmtCount(ch.views));
    set('stat-subscribers', subTxt);
    set('stat-videos', ch.vids);
    set('stat-views', fmtCount(ch.views));

    const avatar = document.getElementById('channel-avatar');
    if (avatar && ch.avatar) { avatar.src = ch.avatar; avatar.alt = ch.title; }

    const desc = document.getElementById('channel-description');
    if (desc && ch.description) {
      const first = ch.description.split('\n')[0];
      if (first?.length > 5) desc.textContent = first.length > 80 ? first.substring(0, 80) + '…' : first;
    }
    if (ch.title) document.title = `${ch.title} — Content Creator & Gamer`;
  }

  function renderVideos(latest, popular) {
    const grid = document.getElementById('videos-grid');
    if (!grid) return;
    grid.innerHTML = '';

    // Dedupe and merge, max 6
    const seen = new Set();
    const all = [];
    [...latest, ...popular].forEach(v => {
      if (!seen.has(v.id) && all.length < 6) { seen.add(v.id); all.push(v); }
    });

    if (!all.length) {
      grid.innerHTML = '<p style="color:var(--text3);text-align:center;grid-column:1/-1;padding:48px">Could not load videos. Visit the channel directly.</p>';
      return;
    }

    all.forEach((v, i) => {
      const a = document.createElement('a');
      a.href = `https://www.youtube.com/watch?v=${v.id}`;
      a.target = '_blank'; a.rel = 'noopener';
      a.className = `bento-card reveal${i === 0 ? ' bento-hero' : ''}`;
      const dur = fmtDur(v.dur);
      a.innerHTML = `
        <div class="b-thumb">
          <img src="${v.thumb}" alt="${v.title}" loading="lazy">
          ${dur ? `<span class="b-dur">${dur}</span>` : ''}
          <div class="b-play"><svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg></div>
        </div>
        <div class="b-info">
          <h4>${v.title}</h4>
          <div class="b-meta"><span>${fmtCount(v.views)} views</span><span>·</span><span>${timeAgo(v.date)}</span></div>
        </div>`;
      grid.appendChild(a);
    });

    grid.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));
  }

  async function initYT() {
    try {
      const id = await resolveChannel();
      if (!id) return;
      const [ch, latest, popular] = await Promise.all([
        fetchChannel(id),
        fetchVideos(id, 'date', 6),
        fetchVideos(id, 'viewCount', 6),
      ]);
      updateChannelUI(ch);
      renderVideos(latest, popular);
    } catch (e) { console.error('YT init error:', e); }
  }

  initYT();
});
