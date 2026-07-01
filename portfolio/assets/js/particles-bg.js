
   (function () {
    const canvas = document.getElementById('starCanvas');
    if (!canvas) return;
  
    const ctx = canvas.getContext('2d');
  
    let width, height, dpr;
    let stars = [];
    const mouse = { x: null, y: null, active: false };
  
    const LINK_DIST = 130;
    const MOUSE_DIST = 240;
  
    /* ---------- warna + intensitas glow mengikuti tema aktif ---------- */
    function getColors() {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const isMobile = window.innerWidth <= 700;
      if (isDark) {
        return isMobile
          ? {
              star: '150,235,175',   // hijau tetap ada tapi lebih redup di mobile
              line: '95,200,125',
              cursor: '130,235,160',
              starGlow: 10,
              lineGlowBoost: 1.05,
              baseAlpha: 0.4
            }
          : {
              star: '180,255,200',   // hijau cerah menyala (desktop)
              line: '120,235,150',
              cursor: '150,255,180',
              starGlow: 14,
              lineGlowBoost: 1.3,
              baseAlpha: 0.55
            };
      }
      return {
        star: '46,90,38',      // hijau tua pekat, tetap kontras di bg terang
        line: '58,110,46',
        cursor: '46,90,38',
        starGlow: 9,
        lineGlowBoost: 1,
        baseAlpha: 0.55
      };
    }
  
    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = window.devicePixelRatio || 1;
  
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  
      const density = 8500;
      const count = Math.min(220, Math.max(60, Math.floor((width * height) / density)));
  
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.5 + 0.7,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        tw: Math.random() * Math.PI * 2
      }));
    }
  
    function draw() {
      ctx.clearRect(0, 0, width, height);
      const c = getColors();
  
      /* --- bintang dengan glow (shadowBlur) agar tampak menyala --- */
      stars.forEach(s => {
        s.x += s.vx;
        s.y += s.vy;
        s.tw += 0.018;
  
        if (s.x <= 0 || s.x >= width) s.vx *= -1;
        if (s.y <= 0 || s.y >= height) s.vy *= -1;
  
        const alpha = c.baseAlpha + Math.sin(s.tw) * 0.35;
  
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c.star},${Math.max(0.15, alpha).toFixed(2)})`;
        ctx.shadowColor = `rgba(${c.star},0.9)`;
        ctx.shadowBlur = c.starGlow;
        ctx.fill();
      });
      ctx.shadowBlur = 0; // reset agar garis tidak ikut blur berat
  
      /* --- garis tipis antar-bintang berdekatan --- */
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            const op = (1 - dist / LINK_DIST) * 0.22 * c.lineGlowBoost;
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            ctx.strokeStyle = `rgba(${c.line},${Math.min(op, 0.9).toFixed(2)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
  
      /* --- jaring dari kursor ke bintang sekitarnya --- */
      if (mouse.active) {
        stars.forEach(s => {
          const dx = s.x - mouse.x;
          const dy = s.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_DIST) {
            const op = (1 - dist / MOUSE_DIST) * 0.65 * c.lineGlowBoost;
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(s.x, s.y);
            ctx.strokeStyle = `rgba(${c.cursor},${Math.min(op, 0.9).toFixed(2)})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        });
  
        ctx.shadowColor = `rgba(${c.cursor},1)`;
        ctx.shadowBlur = c.starGlow + 6;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c.cursor},0.95)`;
        ctx.fill();
        ctx.shadowBlur = 0;
  
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 11, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${c.cursor},0.5)`;
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }
  
      if (!reduceMotion) requestAnimationFrame(draw);
    }
  
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    });
  
    document.addEventListener('mouseout', (e) => {
      if (!e.relatedTarget) mouse.active = false;
    });
  
    window.addEventListener('touchmove', (e) => {
      const t = e.touches[0];
      if (!t) return;
      mouse.x = t.clientX;
      mouse.y = t.clientY;
      mouse.active = true;
    }, { passive: true });
    window.addEventListener('touchend', () => { mouse.active = false; });
  
    window.addEventListener('resize', resize);
  
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
    resize();
    if (!reduceMotion) {
      requestAnimationFrame(draw);
    } else {
      draw();
    }
  })();