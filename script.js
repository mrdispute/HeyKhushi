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
  let editorOpen = false; // Gallery editor state (used by lightbox guard)

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
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
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

    // Set smooth transition for return-to-center
    [heroLeft, heroRight, orbF1, orbF2].forEach(el => {
      if (el) el.style.transition = 'transform .4s cubic-bezier(.4,0,.2,1)';
    });

    heroSection.addEventListener('mousemove', e => {
      const rect = heroSection.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width - 0.5;  // -0.5 to 0.5
      const cy = (e.clientY - rect.top) / rect.height - 0.5;

      // Remove transition during active movement for responsiveness
      [heroLeft, heroRight, orbF1, orbF2].forEach(el => {
        if (el) el.style.transition = 'none';
      });

      if (heroLeft) heroLeft.style.transform = `translate3d(${cx * -12}px, ${cy * -8}px, 0)`;
      if (heroRight) heroRight.style.transform = `translate3d(${cx * 16}px, ${cy * 12}px, 0)`;
      if (heroRing) heroRing.style.marginLeft = `${cx * 25}px`;
      if (orbF1) orbF1.style.transform = `translate3d(${cx * -30}px, ${cy * -20}px, 0)`;
      if (orbF2) orbF2.style.transform = `translate3d(${cx * 20}px, ${cy * 30}px, 0)`;
    });

    heroSection.addEventListener('mouseleave', () => {
      // Re-enable smooth transitions for the return
      [heroLeft, heroRight, orbF1, orbF2].forEach(el => {
        if (el) {
          el.style.transition = 'transform .6s cubic-bezier(.4,0,.2,1)';
          el.style.transform = '';
        }
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
      // Don't open lightbox when editor is active
      if (editorOpen) return;
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
  //  GALLERY EDITOR — Image Position & Upload
  // ════════════════════════════════════════════

  const STORAGE_KEY = 'heykhushi_gallery_positions';
  const galItems = document.querySelectorAll('.gal-item[data-id]');
  const editorPanel = document.getElementById('gal-editor-panel');
  const editorCards = document.getElementById('gal-editor-cards');
  const editFab = document.getElementById('gal-edit-fab');
  const editorClose = document.getElementById('gal-editor-close');
  const editorDone = document.getElementById('gal-editor-done');
  const editorReset = document.getElementById('gal-editor-reset');

  // Load saved positions from localStorage
  function loadGallerySettings() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch { return {}; }
  }

  // Save positions to localStorage
  function saveGallerySettings(settings) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }

  // Apply saved positions to gallery images on page load
  function applyGallerySettings() {
    const settings = loadGallerySettings();
    galItems.forEach(item => {
      const id = item.dataset.id;
      const img = item.querySelector('img');
      if (!img) return;
      const s = settings[id];
      if (s) {
        if (s.posX !== undefined && s.posY !== undefined) {
          img.style.objectPosition = `${s.posX}% ${s.posY}%`;
        }
        if (s.src) {
          img.src = s.src;
          if (s.alt) img.alt = s.alt;
        }
      }
    });
  }

  // Build the editor cards
  function buildEditorCards() {
    const settings = loadGallerySettings();
    editorCards.innerHTML = '';

    galItems.forEach((item, idx) => {
      const id = item.dataset.id;
      const img = item.querySelector('img');
      if (!img) return;

      const s = settings[id] || {};
      const posX = s.posX !== undefined ? s.posX : 50;
      const posY = s.posY !== undefined ? s.posY : 0; // default 'top'
      const slotType = item.classList.contains('gal-tall') ? 'Tall' :
                       item.classList.contains('gal-wide') ? 'Wide' : 'Standard';

      const card = document.createElement('div');
      card.className = 'gal-ecard';
      card.innerHTML = `
        <div class="gal-ecard-preview" data-target="${id}">
          <img src="${img.src}" alt="${img.alt}" style="object-position:${posX}% ${posY}%">
          <span class="drag-hint">↕ Drag to reposition</span>
        </div>
        <div class="gal-ecard-controls">
          <div class="gal-ecard-label">
            <span>${img.alt || 'Image ' + (idx + 1)}</span>
            <span class="gal-slot">${slotType} · Slot ${idx + 1}</span>
          </div>
          <div class="gal-slider-row">
            <label>X</label>
            <input type="range" min="0" max="100" value="${posX}" data-axis="x" data-id="${id}">
            <span class="gal-pos-val">${posX}%</span>
          </div>
          <div class="gal-slider-row">
            <label>Y</label>
            <input type="range" min="0" max="100" value="${posY}" data-axis="y" data-id="${id}">
            <span class="gal-pos-val">${posY}%</span>
          </div>
          <label class="gal-upload-btn">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Replace Image
            <input type="file" accept="image/*" data-id="${id}">
          </label>
        </div>
      `;
      editorCards.appendChild(card);
    });

    // Attach slider events
    editorCards.querySelectorAll('input[type="range"]').forEach(slider => {
      slider.addEventListener('input', handleSliderChange);
    });

    // Attach drag events to previews
    editorCards.querySelectorAll('.gal-ecard-preview').forEach(preview => {
      setupDragReposition(preview);
    });

    // Attach file upload events
    editorCards.querySelectorAll('input[type="file"]').forEach(input => {
      input.addEventListener('change', handleFileUpload);
    });
  }

  // Handle slider changes
  function handleSliderChange(e) {
    const slider = e.target;
    const id = slider.dataset.id;
    const axis = slider.dataset.axis;
    const val = parseInt(slider.value);

    // Update value display
    slider.nextElementSibling.textContent = val + '%';

    // Get both values
    const card = slider.closest('.gal-ecard');
    const xSlider = card.querySelector('[data-axis="x"]');
    const ySlider = card.querySelector('[data-axis="y"]');
    const posX = parseInt(xSlider.value);
    const posY = parseInt(ySlider.value);

    // Update preview image in editor
    const previewImg = card.querySelector('.gal-ecard-preview img');
    if (previewImg) previewImg.style.objectPosition = `${posX}% ${posY}%`;

    // Update actual gallery image
    const galItem = document.querySelector(`.gal-item[data-id="${id}"]`);
    if (galItem) {
      const galImg = galItem.querySelector('img');
      if (galImg) galImg.style.objectPosition = `${posX}% ${posY}%`;
    }

    // Save
    const settings = loadGallerySettings();
    if (!settings[id]) settings[id] = {};
    settings[id].posX = posX;
    settings[id].posY = posY;
    saveGallerySettings(settings);
  }

  // Drag to reposition in preview card
  function setupDragReposition(preview) {
    let dragging = false;
    let startY = 0, startX = 0;
    let startPosY = 0, startPosX = 0;

    const getTouch = (e) => e.touches ? e.touches[0] : e;

    const onStart = (e) => {
      dragging = true;
      const t = getTouch(e);
      startX = t.clientX;
      startY = t.clientY;
      const img = preview.querySelector('img');
      const pos = img.style.objectPosition || '50% 0%';
      const parts = pos.split(/\s+/);
      startPosX = parseFloat(parts[0]) || 50;
      startPosY = parseFloat(parts[1]) || 0;
      e.preventDefault();
    };

    const onMove = (e) => {
      if (!dragging) return;
      const t = getTouch(e);
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      const rect = preview.getBoundingClientRect();

      // Map pixel delta to percentage (invert for natural feel)
      const newX = Math.max(0, Math.min(100, startPosX - (dx / rect.width) * 100));
      const newY = Math.max(0, Math.min(100, startPosY - (dy / rect.height) * 100));

      const img = preview.querySelector('img');
      img.style.objectPosition = `${newX}% ${newY}%`;

      // Update sliders
      const id = preview.dataset.target;
      const card = preview.closest('.gal-ecard');
      const xSlider = card.querySelector('[data-axis="x"]');
      const ySlider = card.querySelector('[data-axis="y"]');
      xSlider.value = Math.round(newX);
      ySlider.value = Math.round(newY);
      xSlider.nextElementSibling.textContent = Math.round(newX) + '%';
      ySlider.nextElementSibling.textContent = Math.round(newY) + '%';

      // Live update gallery
      const galItem = document.querySelector(`.gal-item[data-id="${id}"]`);
      if (galItem) {
        const galImg = galItem.querySelector('img');
        if (galImg) galImg.style.objectPosition = `${newX}% ${newY}%`;
      }

      e.preventDefault();
    };

    const onEnd = () => {
      if (!dragging) return;
      dragging = false;

      // Save final position
      const id = preview.dataset.target;
      const img = preview.querySelector('img');
      const pos = img.style.objectPosition || '50% 0%';
      const parts = pos.split(/\s+/);
      const posX = Math.round(parseFloat(parts[0]) || 50);
      const posY = Math.round(parseFloat(parts[1]) || 0);

      const settings = loadGallerySettings();
      if (!settings[id]) settings[id] = {};
      settings[id].posX = posX;
      settings[id].posY = posY;
      saveGallerySettings(settings);
    };

    preview.addEventListener('mousedown', onStart);
    preview.addEventListener('touchstart', onStart, { passive: false });
    document.addEventListener('mousemove', onMove);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('mouseup', onEnd);
    document.addEventListener('touchend', onEnd);
  }

  // Handle file upload
  function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const id = e.target.dataset.id;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;

      // Update editor preview
      const card = e.target.closest('.gal-ecard');
      const previewImg = card.querySelector('.gal-ecard-preview img');
      if (previewImg) previewImg.src = dataUrl;

      // Update actual gallery
      const galItem = document.querySelector(`.gal-item[data-id="${id}"]`);
      if (galItem) {
        const galImg = galItem.querySelector('img');
        if (galImg) {
          galImg.src = dataUrl;
          // Reset position for new image
          galImg.style.objectPosition = '50% 50%';
        }
      }

      // Update sliders to center
      const xSlider = card.querySelector('[data-axis="x"]');
      const ySlider = card.querySelector('[data-axis="y"]');
      if (xSlider) { xSlider.value = 50; xSlider.nextElementSibling.textContent = '50%'; }
      if (ySlider) { ySlider.value = 50; ySlider.nextElementSibling.textContent = '50%'; }
      if (previewImg) previewImg.style.objectPosition = '50% 50%';

      // Save
      const settings = loadGallerySettings();
      if (!settings[id]) settings[id] = {};
      settings[id].src = dataUrl;
      settings[id].posX = 50;
      settings[id].posY = 50;
      saveGallerySettings(settings);
    };
    reader.readAsDataURL(file);
  }

  // Toggle editor
  function openEditor() {
    editorOpen = true;
    buildEditorCards();
    editorPanel.classList.add('open');
    editFab.classList.add('active');
    galItems.forEach(item => item.classList.add('editing'));
  }

  function closeEditor() {
    editorOpen = false;
    editorPanel.classList.remove('open');
    editFab.classList.remove('active');
    galItems.forEach(item => item.classList.remove('editing'));
  }

  // ── ADMIN ACCESS CONTROL ──
  // The edit button is hidden by default. To unlock:
  // 1. Add ?admin=true to the URL (e.g., yoursite.com/?admin=true#gallery)
  // 2. OR press Ctrl+Shift+E anywhere on the page
  // Both methods prompt for a password. Session is remembered.

  const ADMIN_PASS = 'khushi2026'; // Change this to your secret password
  const ADMIN_SESSION_KEY = 'heykhushi_admin_auth';
  let adminUnlocked = false;

  function hashSimple(str) {
    // Simple hash for basic obfuscation (not cryptographic security)
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }

  const ADMIN_HASH = hashSimple(ADMIN_PASS);

  function unlockAdmin() {
    adminUnlocked = true;
    editFab.classList.add('admin-unlocked');
    sessionStorage.setItem(ADMIN_SESSION_KEY, ADMIN_HASH);
  }

  function promptAdminPassword() {
    const pwd = prompt('🔐 Enter admin password to edit gallery:');
    if (pwd === null) return; // cancelled
    if (hashSimple(pwd) === ADMIN_HASH) {
      unlockAdmin();
    } else {
      alert('❌ Wrong password. Access denied.');
    }
  }

  // Check if already authenticated this session
  if (sessionStorage.getItem(ADMIN_SESSION_KEY) === ADMIN_HASH) {
    unlockAdmin();
  }

  // Check URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('admin') === 'true' && !adminUnlocked) {
    promptAdminPassword();
  }

  // Secret keyboard shortcut: Ctrl+Shift+E
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'E') {
      e.preventDefault();
      if (!adminUnlocked) {
        promptAdminPassword();
      } else {
        // Already unlocked — toggle editor
        if (editorOpen) closeEditor();
        else openEditor();
      }
    }
  });

  editFab.addEventListener('click', () => {
    if (editorOpen) closeEditor();
    else openEditor();
  });

  editorClose.addEventListener('click', closeEditor);
  editorDone.addEventListener('click', closeEditor);

  // Toast notification helper
  function showToast(msg, duration = 3000) {
    let toast = document.querySelector('.gal-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'gal-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), duration);
  }

  editorReset.addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);
    // Reset all images to default
    galItems.forEach(item => {
      const img = item.querySelector('img');
      if (img) img.style.objectPosition = 'center top';
    });
    // Rebuild cards
    buildEditorCards();
    showToast('✅ All positions reset to default');
  });

  // ── EXPORT IMAGES — Download uploaded images with correct filenames ──
  const editorExport = document.getElementById('gal-editor-export');
  editorExport.addEventListener('click', () => {
    const settings = loadGallerySettings();
    let downloadCount = 0;

    galItems.forEach(item => {
      const id = item.dataset.id;
      const s = settings[id];
      if (!s || !s.src) return; // Skip if no uploaded image

      const img = item.querySelector('img');
      // Get the original filename from the src attribute in HTML
      const originalSrc = item.querySelector('img').getAttribute('src');
      const filename = originalSrc.split('/').pop() || `gallery-${id}.jpg`;

      // Create download link
      const a = document.createElement('a');
      a.href = s.src;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      downloadCount++;
    });

    if (downloadCount === 0) {
      showToast('ℹ️ No uploaded images to export. Only custom-uploaded images need exporting.');
    } else {
      showToast(`⬇️ Downloading ${downloadCount} image${downloadCount > 1 ? 's' : ''}... Save to your assets/ folder`);
    }
  });

  // ── HARD APPLY — Generate updated HTML with baked-in positions & copy to clipboard ──
  const editorApply = document.getElementById('gal-editor-apply');
  editorApply.addEventListener('click', () => {
    // Build the gallery HTML with positions baked in
    let html = '        <div class="gallery-mosaic" id="gallery-grid">\n';

    galItems.forEach(item => {
      const id = item.dataset.id;
      const img = item.querySelector('img');
      if (!img) return;

      // Get current classes
      const classes = Array.from(item.classList)
        .filter(c => !['visible', 'editing'].includes(c))
        .join(' ');

      // Get current object-position
      const pos = img.style.objectPosition || 'center top';

      // Get the original src (not data URL) — use the HTML attribute
      const src = img.getAttribute('src');
      // If it's a data URL, use the original filename from HTML
      let finalSrc = src;
      if (src.startsWith('data:')) {
        // Try to find original filename
        const originalImg = item.querySelector('img');
        const attrSrc = originalImg.dataset.originalSrc || `assets/gallery-${id}.jpg`;
        finalSrc = attrSrc;
      }

      const alt = img.alt || '';

      html += `          <div class="${classes}" data-id="${id}">\n`;
      html += `            <img src="${finalSrc}" alt="${alt}" style="object-position:${pos}">\n`;
      html += `          </div>\n`;
    });

    html += '        </div>';

    // Copy to clipboard
    navigator.clipboard.writeText(html).then(() => {
      showToast('✅ Gallery HTML copied to clipboard! Paste it into your index.html to replace the gallery-mosaic div.', 5000);
    }).catch(() => {
      // Fallback: show in a prompt
      const ta = document.createElement('textarea');
      ta.value = html;
      ta.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast('✅ Gallery HTML copied! Paste into index.html to replace gallery-mosaic div.', 5000);
    });

    // Also log it to console for easy access
    console.log('=== GALLERY HTML — Copy & paste into index.html ===');
    console.log(html);
    console.log('=== END ===');
  });

  // Apply saved settings on load
  applyGallerySettings();

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
