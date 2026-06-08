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

    document.querySelectorAll('a, button, .btn, .bento-card, .game-tile, .gal-item, .conn-card, .metric, .hero-fcard').forEach(el => {
      el.addEventListener('mouseenter', () => { dot.classList.add('hover'); ring.classList.add('hover'); });
      el.addEventListener('mouseleave', () => { dot.classList.remove('hover'); ring.classList.remove('hover'); });
    });
  }

  // ── TYPEWRITER EFFECT ──
  const twEl = document.getElementById('tw-text');
  if (twEl) {
    const roles = ['Content Creator', 'Gamer', 'Streamer', 'Community Builder', 'Valorant Lover'];
    let roleIdx = 0, charIdx = 0, isDeleting = false;

    function typewriter() {
      const current = roles[roleIdx];
      if (!isDeleting) {
        twEl.textContent = current.substring(0, charIdx + 1);
        charIdx++;
        if (charIdx === current.length) {
          isDeleting = true;
          setTimeout(typewriter, 2000); // pause before deleting
          return;
        }
        setTimeout(typewriter, 80);
      } else {
        twEl.textContent = current.substring(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) {
          isDeleting = false;
          roleIdx = (roleIdx + 1) % roles.length;
          setTimeout(typewriter, 400); // pause before next role
          return;
        }
        setTimeout(typewriter, 40);
      }
    }
    setTimeout(typewriter, 1200); // initial delay
  }

  // ── HERO MOUSE PARALLAX ──
  const heroSection = document.getElementById('home');
  if (heroSection && !isTouchDevice) {
    const heroLeft = heroSection.querySelector('.hero-left');
    const heroRight = heroSection.querySelector('.hero-right');
    const heroRing = heroSection.querySelector('.hero-ring');
    const orbF1 = heroSection.querySelector('.orb-f1');
    const orbF2 = heroSection.querySelector('.orb-f2');

    heroSection.addEventListener('mousemove', e => {
      const rect = heroSection.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width - 0.5;  // -0.5 to 0.5
      const cy = (e.clientY - rect.top) / rect.height - 0.5;

      if (heroLeft) heroLeft.style.transform = `translate(${cx * -12}px, ${cy * -8}px)`;
      if (heroRight) heroRight.style.transform = `translate(${cx * 16}px, ${cy * 12}px)`;
      if (heroRing) heroRing.style.marginLeft = `${cx * 25}px`;
      if (orbF1) orbF1.style.transform = `translate(${cx * -30}px, ${cy * -20}px)`;
      if (orbF2) orbF2.style.transform = `translate(${cx * 20}px, ${cy * 30}px)`;
    });

    heroSection.addEventListener('mouseleave', () => {
      [heroLeft, heroRight, orbF1, orbF2].forEach(el => {
        if (el) el.style.transform = '';
      });
      if (heroRing) heroRing.style.marginLeft = '';
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

  // ── FEATURED STREAMS (hardcoded picks) ──
  const FEATURED_IDS = ['sL-7Y0xbyds', '2LRpFNfo4Ek', 'RyKZ3ampPHk', 'BILDclLrclI'];

  async function fetchFeaturedStreams() {
    try {
      const ids = FEATURED_IDS.join(',');
      const r = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${ids}&key=${YT_API_KEY}`);
      const d = await r.json();
      if (!d.items) return [];
      return d.items.map(v => ({
        id: v.id,
        title: v.snippet.title,
        thumb: v.snippet.thumbnails.maxres?.url || v.snippet.thumbnails.high?.url || v.snippet.thumbnails.medium?.url,
        date: v.snippet.publishedAt,
        views: v.statistics.viewCount || '0',
      }));
    } catch (e) { console.error('Featured fetch error:', e); return []; }
  }

  function renderFeaturedStreams(streams) {
    const grid = document.getElementById('videos-grid');
    if (!grid) return;
    grid.innerHTML = '';

    if (!streams.length) {
      grid.innerHTML = '<p style="color:var(--text3);text-align:center;grid-column:1/-1;padding:48px">Could not load streams. Visit the channel directly.</p>';
      return;
    }

    streams.forEach((v, i) => {
      const a = document.createElement('a');
      a.href = `https://www.youtube.com/watch?v=${v.id}`;
      a.target = '_blank'; a.rel = 'noopener';
      a.className = `content-card glass-card reveal delay-${i + 1}`;
      a.innerHTML = `
        <div class="cc-thumb">
          <img src="${v.thumb}" alt="${v.title}" loading="lazy">
          <span class="cc-views">👁 ${fmtCount(v.views)} views</span>
          <div class="cc-play"><svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg></div>
          <span class="cc-live-badge">STREAM</span>
        </div>
        <div class="cc-info">
          <h4>${v.title}</h4>
          <div class="cc-meta"><span>🔴 Live Stream</span><span>·</span><span>${timeAgo(v.date)}</span></div>
        </div>`;
      grid.appendChild(a);
    });

    grid.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));
  }

  async function initYT() {
    try {
      const id = await resolveChannel();
      if (!id) return;
      const [ch, featured] = await Promise.all([
        fetchChannel(id),
        fetchFeaturedStreams(),
      ]);
      updateChannelUI(ch);
      renderFeaturedStreams(featured);
    } catch (e) { console.error('YT init error:', e); }
  }

  initYT();
});
