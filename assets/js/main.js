/* ============================================
   COGNITESTE — Main JS
   Lightweight, no dependencies
   ============================================ */

/* ── Neural Network Canvas ── */
(function() {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, nodes = [], animId;

  const COLORS = {
    nodePurple: 'rgba(167, 127, 219, ',
    nodeGold: 'rgba(199, 156, 61, ',
    line: 'rgba(167, 127, 219, '
  };

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function createNodes(n) {
    nodes = [];
    for (let i = 0; i < n; i++) {
      nodes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 2.5 + 1,
        gold: Math.random() < 0.15
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const maxDist = 140;

    // Lines
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.3;
          ctx.beginPath();
          ctx.strokeStyle = COLORS.line + alpha + ')';
          ctx.lineWidth = 0.6;
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Nodes
    nodes.forEach(n => {
      const color = n.gold ? COLORS.nodeGold : COLORS.nodePurple;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = color + '0.8)';
      ctx.fill();
      // Glow
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = color + '0.1)';
      ctx.fill();
    });
  }

  function update() {
    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    });
  }

  function loop() {
    update(); draw();
    animId = requestAnimationFrame(loop);
  }

  function init() {
    resize();
    const count = Math.floor((W * H) / 14000);
    createNodes(Math.min(count, 60));
    if (animId) cancelAnimationFrame(animId);
    loop();
  }

  window.addEventListener('resize', debounce(init, 200));
  init();
})();

/* ── Header scroll ── */
(function() {
  const header = document.getElementById('header');
  if (!header) return;
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ── Mobile menu ── */
(function() {
  const btn = document.querySelector('.hamburger');
  const nav = document.querySelector('.nav-links');
  if (!btn || !nav) return;
  btn.addEventListener('click', () => {
    nav.classList.toggle('open');
    btn.classList.toggle('active');
    document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
  });
  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      nav.classList.remove('open');
      btn.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
})();

/* ── Scroll Reveal ── */
(function() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elements.forEach(el => observer.observe(el));
})();

/* ── FAQ Accordion ── */
(function() {
  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-question').addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
})();

/* ── Cookie Consent ── */
(function() {
  const banner = document.querySelector('.cookie-banner');
  if (!banner) return;
  if (!localStorage.getItem('cog_cookie_consent')) {
    setTimeout(() => banner.classList.add('visible'), 1500);
  }
  document.querySelector('.btn-cookie-accept')?.addEventListener('click', () => {
    localStorage.setItem('cog_cookie_consent', 'accepted');
    banner.classList.remove('visible');
    // Push consent to dataLayer
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'cookie_consent', consent: 'accepted' });
  });
  document.querySelector('.btn-cookie-decline')?.addEventListener('click', () => {
    localStorage.setItem('cog_cookie_consent', 'declined');
    banner.classList.remove('visible');
  });
})();

/* ── WhatsApp click tracking ── */
document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
  link.addEventListener('click', () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'whatsapp_click',
      event_category: 'cta',
      event_label: link.dataset.label || 'whatsapp'
    });
  });
});

/* ── Utility ── */
function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}
