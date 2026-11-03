document.addEventListener('DOMContentLoaded', () => {

  AOS.init({ duration: 700, once: true, offset: 60 });
  document.getElementById('year').textContent = new Date().getFullYear();

  const merged = (typeof getMerged === 'function') ? getMerged() : null;

  const EXP  = merged ? merged.experience   : ((typeof EXPERIENCE   !== 'undefined') ? EXPERIENCE   : []);
  const PROJ = merged ? merged.projects     : ((typeof PROJECTS     !== 'undefined') ? PROJECTS     : []);
  const CERT = merged ? merged.certificates : ((typeof CERTIFICATES !== 'undefined') ? CERTIFICATES : []);
  const SKL  = merged ? merged.skills       : ((typeof SKILLS       !== 'undefined') ? SKILLS       : []);
  const LANG = merged ? merged.profile.i18n : ((typeof I18N !== 'undefined') ? I18N : { id: {}, en: {} });

  const CTX = merged ? merged.contact : ((typeof CONTACT !== 'undefined') ? CONTACT : {
    email: 'zikoadjie@gmail.com', phone: '+62 812-4666-5782', location: 'Indonesia',
    social: { linkedin: 'https://linkedin.com/in/rhiziqoadjies', instagram: 'https://instagram.com/zikoadjie_', github: 'https://github.com/rhiziqoadjie' }
  });

  const PRF = merged ? {
    name_line1: merged.profile.name_line1,
    name_line2: merged.profile.name_line2,
    cv_path: merged.profile.cv_path,
    hero_photo: merged.profile.hero_photo,
    about_photo: merged.profile.about_photo,
    stats: merged.profile.stats
  } : ((typeof PROFILE !== 'undefined') ? PROFILE : {
    name_line1: 'Rhiziqo Adjie', name_line2: 'Syahputra',
    cv_path: 'assets/CV_RHIZIQO ADJIE SYAHPUTRA.pdf',
    hero_photo: '', about_photo: '', stats: { years: 3, projects: 12, certs: 8 }
  });

  /* Helper: ambil teks sesuai bahasa aktif dari field bilingual
     { id: "...", en: "..." }. Tetap kompatibel jika field masih
     berupa string biasa (data lama). */
  function loc(field, lang) {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field[lang] || field.id || field.en || '';
  }

  function applyProfile() {
    const l1 = document.querySelector('.line-1');
    const l2 = document.querySelector('.line-2');
    if (l1) l1.textContent = PRF.name_line1;
    if (l2) l2.textContent = PRF.name_line2;

    const cvBtn = document.querySelector('.about-frame-content a.btn[download]');
    if (cvBtn) cvBtn.setAttribute('href', PRF.cv_path);

    if (PRF.hero_photo) {
      const hImg = document.querySelector('.hero-photo-zone .photo-ring img');
      if (hImg) hImg.src = PRF.hero_photo;
    }
    if (PRF.about_photo) {
      const aImg = document.querySelector('.about-frame-photo img');
      if (aImg) aImg.src = PRF.about_photo;
    }

    const nums = document.querySelectorAll('.stat-num');
    if (nums[0]) nums[0].setAttribute('data-count', PRF.stats.years);
    if (nums[1]) nums[1].setAttribute('data-count', PRF.stats.projects);
    if (nums[2]) nums[2].setAttribute('data-count', PRF.stats.certs);
  }

  function applyContact() {
    const eEl = document.getElementById('contactEmail');
    const pEl = document.getElementById('contactPhone');
    const lEl = document.getElementById('contactLocation');
    if (eEl) eEl.textContent = CTX.email;
    if (pEl) pEl.textContent = CTX.phone;
    if (lEl) lEl.textContent = CTX.location;

    ['linkedin', 'instagram', 'github'].forEach((key, i) => {
      const href = CTX.social && CTX.social[key];
      if (!href) return;
      const rail = document.querySelectorAll('.social-rail a');
      const social = document.querySelectorAll('.contact-socials a');
      if (rail[i]) rail[i].setAttribute('href', href);
      if (social[i]) social[i].setAttribute('href', href);
    });
  }

  applyProfile();
  applyContact();

  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;

  if (localStorage.getItem('theme') === 'dark') {
    root.setAttribute('data-theme', 'dark');
    themeToggle.innerHTML = '<i class="fa-regular fa-sun"></i>';
  }

  themeToggle.addEventListener('click', () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    if (isDark) {
      root.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
      themeToggle.innerHTML = '<i class="fa-regular fa-moon"></i>';
    } else {
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      themeToggle.innerHTML = '<i class="fa-regular fa-sun"></i>';
    }
  });

  const langToggle = document.getElementById('langToggle');
  let currentLang = localStorage.getItem('lang') || 'id';

  /* Helper: ambil terjemahan dari lang aktif */
  function t(key) {
    return (LANG[currentLang] && LANG[currentLang][key]) ||
           (LANG.id && LANG.id[key]) || key;
  }

  function applyLang(lang) {
    currentLang = lang;
    const dict = LANG[lang] || LANG.id || {};

    /* Elemen statis dengan data-i18n (termasuk semua menu navbar) */
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] === undefined) return;
      const icon = el.querySelector('i');
      if (icon) {
        el.innerHTML = icon.outerHTML + ' ' + dict[key];
      } else {
        el.textContent = dict[key];
      }
    });

    /* Placeholder form */
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const key = el.getAttribute('data-i18n-ph');
      if (dict[key]) el.setAttribute('placeholder', dict[key]);
    });

    /* Update tombol bahasa */
    langToggle.textContent = lang === 'id' ? 'EN' : 'ID';
    document.documentElement.lang = lang;

    /* Re-render semua bagian dinamis dengan bahasa baru */
    renderTyped(lang);
    renderTimeline();
    buildSkillFilters();
    renderSkills(currentSkillFilter);
    buildProjectFilters();
    renderProjects(currentProjectFilter);
    buildCertFilters();
    renderCertificates(currentCertFilter);
  }

  langToggle.addEventListener('click', () => {
    const next = currentLang === 'id' ? 'en' : 'id';
    localStorage.setItem('lang', next);
    applyLang(next);
  });

  let typedTimeout;
  function renderTyped(lang) {
    clearTimeout(typedTimeout);
    const el = document.getElementById('typed');
    if (!el) return;
    const roles = (LANG[lang] && LANG[lang].typed_roles) || ['Web Development'];
    let ri = 0, ci = 0, del = false;

    function tick() {
      const w = roles[ri];
      if (!del) {
        ci++; el.textContent = w.slice(0, ci);
        if (ci === w.length) { del = true; typedTimeout = setTimeout(tick, 1400); return; }
      } else {
        ci--; el.textContent = w.slice(0, ci);
        if (ci === 0) { del = false; ri = (ri + 1) % roles.length; }
      }
      typedTimeout = setTimeout(tick, del ? 45 : 90);
    }
    tick();
  }

  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main .section');
  let manualLock = false;

  function setActive(id) {
    navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
  }

  window.addEventListener('scroll', () => {
    if (manualLock) return;
    let cur = sections[0]?.id;
    sections.forEach(s => { if (window.scrollY + 160 >= s.offsetTop) cur = s.id; });
    setActive(cur);
  });
  setActive(sections[0]?.id);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      setActive(link.getAttribute('href').replace('#', ''));
      manualLock = true;
      clearTimeout(window.__nl);
      window.__nl = setTimeout(() => { manualLock = false; }, 900);
    });
  });

  const burger = document.getElementById('burger');
  const navList = document.getElementById('navLinks');
  burger.addEventListener('click', () => {
    navList.classList.toggle('open');
    burger.classList.toggle('open');
  });
  navLinks.forEach(l => l.addEventListener('click', () => {
    navList.classList.remove('open');
    burger.classList.remove('open');
  }));

  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.style.boxShadow = window.scrollY > 30
      ? '0 10px 30px rgba(0,0,0,0.12)'
      : '0 8px 30px rgba(0,0,0,0.06)';
  });

  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { animCount(e.target); counterObs.unobserve(e.target); }
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('.stat-num').forEach(el => counterObs.observe(el));

  function animCount(el) {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    let c = 0;
    const step = Math.max(1, Math.ceil(target / 40));
    const iv = setInterval(() => {
      c += step;
      if (c >= target) { c = target; clearInterval(iv); }
      el.textContent = c;
    }, 30);
  }

  const aboutFrame = document.getElementById('aboutFrame');
  if (aboutFrame) {
    aboutFrame.addEventListener('mousemove', e => {
      const r = aboutFrame.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      aboutFrame.style.transform = `perspective(1200px) rotateX(${(0.5 - py) * 12}deg) rotateY(${(px - 0.5) * 12}deg) scale(1.01)`;
      aboutFrame.style.setProperty('--mx', `${px * 100}%`);
      aboutFrame.style.setProperty('--my', `${py * 100}%`);
    });
    aboutFrame.addEventListener('mouseleave', () => {
      aboutFrame.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
  }

  /* ================= EXPERIENCE / TIMELINE (bilingual) ================= */
  const timelineList = document.getElementById('timelineList');
  function renderTimeline() {
    if (!timelineList) return;
    timelineList.innerHTML = EXP.map((item, i) => `
      <div class="timeline-item" data-aos="${i % 2 === 0 ? 'fade-right' : 'fade-left'}" data-aos-delay="${(i % 4) * 60}">
        <span class="timeline-dot"><i class="fa-solid fa-circle" style="font-size:6px"></i></span>
        <div class="timeline-card">
          <div class="timeline-icon"><i class="${item.icon || 'fa-solid fa-briefcase'}"></i></div>
          <span class="timeline-year">${item.year}</span>
          <h3 class="timeline-title">${item.title}</h3>
          <span class="timeline-role">${loc(item.role, currentLang)}</span>
          <p class="timeline-desc">${loc(item.desc, currentLang)}</p>
          <div class="timeline-tags">${(item.tags || []).map(tg => `<span>${tg}</span>`).join('')}</div>
        </div>
      </div>`).join('');
  }
  renderTimeline();

  const skillsGrid = document.getElementById('skillsGrid');
  const skillFilters = document.getElementById('skillFilters');
  let currentSkillFilter = 'all';

  function buildSkillFilters() {
    if (!skillFilters) return;
    const defs = [
      { key: 'all',          label: t('filter_all') },
      { key: 'programming',  label: t('filter_programming') },
      { key: 'software',     label: t('filter_software') }
    ];
    skillFilters.innerHTML = defs.map(f => `
      <button class="filter-btn ${f.key === currentSkillFilter ? 'active' : ''}" data-filter="${f.key}">${f.label}</button>`
    ).join('');
    skillFilters.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        skillFilters.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentSkillFilter = btn.getAttribute('data-filter');
        renderSkills(currentSkillFilter);
      });
    });
  }

  function renderSkills(filter = 'all') {
    if (!skillsGrid) return;
    const list = filter === 'all' ? SKL : SKL.filter(s => s.category === filter);
    skillsGrid.innerHTML = list.map((s, i) => `
      <div class="skill-card" data-aos="fade-up" data-aos-delay="${(i % 6) * 60}">
        <i class="${s.icon}" style="color:${s.color || 'var(--accent-dark)'}"></i>
        <span class="skill-name">${s.name}</span>
        <span class="skill-level ${s.level}">${t('level_' + s.level)}</span>
      </div>`).join('');
  }

  buildSkillFilters();
  renderSkills();

  /* ================= PROJECTS (bilingual desc + category label) ================= */
  const projectsGrid = document.getElementById('projectsGrid');
  const projectFilters = document.getElementById('projectFilters');
  let currentProjectFilter = 'all';

  function projCatLabel(catKey) {
    if (catKey === 'all') return t('proj_filter_all');
    return t('proj_cat_' + catKey) || catKey;
  }

  function buildProjectFilters() {
    if (!projectFilters) return;
    const cats = ['all', ...new Set(PROJ.map(p => p.category).filter(Boolean))];
    projectFilters.innerHTML = cats.map(cat => `
      <button class="filter-btn ${cat === currentProjectFilter ? 'active' : ''}" data-filter="${cat}">
        ${projCatLabel(cat)}
      </button>`).join('');
    projectFilters.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        projectFilters.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentProjectFilter = btn.getAttribute('data-filter');
        renderProjects(currentProjectFilter);
      });
    });
  }

  function renderProjects(filter = 'all') {
    if (!projectsGrid) return;
    const list = filter === 'all' ? PROJ : PROJ.filter(p => p.category === filter);
    projectsGrid.innerHTML = list.map(p => {
      const images = (p.images && p.images.length) ? p.images : (p.image ? [p.image] : []);
      const fb = `https://placehold.co/600x375/dfe9d5/3a4a2a?text=${encodeURIComponent(p.title)}`;
      const imgFirst = images[0] || fb;
      return `
        <div class="project-card">
          <div class="project-thumb" data-images='${JSON.stringify(images)}' data-img-index="0">
            <img src="${imgFirst}" alt="${p.title}" onerror="this.src='${fb}'">
            ${images.length > 1 ? `
              <button class="thumb-arrow left" data-thumb-prev aria-label="Sebelumnya"><i class="fa-solid fa-chevron-left"></i></button>
              <button class="thumb-arrow right" data-thumb-next aria-label="Berikutnya"><i class="fa-solid fa-chevron-right"></i></button>
              <div class="thumb-dots">
                ${images.map((_, di) => `<span class="dot ${di === 0 ? 'active' : ''}" data-dot-index="${di}"></span>`).join('')}
              </div>` : ''}
          </div>
          <div class="project-body">
            <h3 class="project-title">${p.title}</h3>
            <p class="project-desc">${loc(p.desc, currentLang)}</p>
            <div class="project-tags">${(p.tags || []).map(tg => `<span>${tg}</span>`).join('')}</div>
            <div class="project-links">
              <a href="${p.demo}" target="_blank" rel="noopener"><i class="fa-solid fa-arrow-up-right-from-square"></i> ${t('proj_link_demo')}</a>
              <a href="${p.code}" target="_blank" rel="noopener"><i class="fa-brands fa-github"></i> ${t('proj_link_code')}</a>
            </div>
          </div>
        </div>`;
    }).join('');
    projectsGrid.scrollTo({ left: 0 });
  }

  buildProjectFilters();
  renderProjects();

  /* Carousel arrows (slide antar-project) */
  const projPrev = document.getElementById('projPrev');
  const projNext = document.getElementById('projNext');
  if (projPrev && projNext && projectsGrid) {
    const cardW = () => {
      const c = projectsGrid.querySelector('.project-card');
      return c ? c.offsetWidth + 30 : 380;
    };
    projPrev.addEventListener('click', () => projectsGrid.scrollBy({ left: -cardW(), behavior: 'smooth' }));
    projNext.addEventListener('click', () => projectsGrid.scrollBy({ left:  cardW(), behavior: 'smooth' }));
  }

  /* Thumb slider (slide gambar di dalam satu project card) */
  function setThumbImg(thumb, idx) {
    let images;
    try { images = JSON.parse(thumb.getAttribute('data-images') || '[]'); } catch { images = []; }
    if (!images.length) return;
    const safe = (idx + images.length) % images.length;
    thumb.setAttribute('data-img-index', safe);
    const img = thumb.querySelector('img');
    if (img) img.src = images[safe];
    thumb.querySelectorAll('.dot').forEach((dot, i) => dot.classList.toggle('active', i === safe));
  }

  document.addEventListener('click', e => {
    const prev = e.target.closest('[data-thumb-prev]');
    const next = e.target.closest('[data-thumb-next]');
    const dot  = e.target.closest('[data-dot-index]');

    if (prev || next) {
      e.stopPropagation();
      const th = (prev || next).closest('.project-thumb');
      if (!th) return;
      const cur = parseInt(th.getAttribute('data-img-index'), 10) || 0;
      setThumbImg(th, cur + (prev ? -1 : 1));
    }
    if (dot) {
      e.stopPropagation();
      const th = dot.closest('.project-thumb');
      if (!th) return;
      setThumbImg(th, parseInt(dot.getAttribute('data-dot-index'), 10) || 0);
    }
  });

  /* ================= CERTIFICATE (bilingual desc) ================= */
  const certGrid    = document.getElementById('certificateGrid');
  const certFilters = document.getElementById('certFilters');
  let currentCertFilter = 'all';

  function certLabel(cat) {
    const k = (cat || '').toLowerCase();
    const map = {
      all: t('cert_filter_all'),
      internship:   t('cert_filter_internship'),
      training:     t('cert_filter_training'),
      certification: t('cert_filter_certification')
    };
    return map[k] || (cat.charAt(0).toUpperCase() + cat.slice(1));
  }

  function buildCertFilters() {
    if (!certFilters) return;
    /* kumpulkan kategori unik, simpan huruf aslinya tapi bandingkan lowercase */
    const seen = new Set();
    const cats = ['all'];
    CERT.forEach(c => {
      const k = (c.category || '').toLowerCase();
      if (k && !seen.has(k)) { seen.add(k); cats.push(c.category); }
    });
    certFilters.innerHTML = cats.map(cat => `
      <button class="filter-btn ${(cat === currentCertFilter || (currentCertFilter === 'all' && cat === 'all')) ? 'active' : ''}"
              data-filter="${cat}">
        ${certLabel(cat === 'all' ? 'all' : cat)}
      </button>`).join('');
    certFilters.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        certFilters.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCertFilter = btn.getAttribute('data-filter');
        renderCertificates(currentCertFilter);
      });
    });
  }

  function renderCertificates(filter = 'all') {
    if (!certGrid) return;
    const list = filter === 'all'
      ? CERT
      : CERT.filter(c => (c.category || '').toLowerCase() === filter.toLowerCase());
    const fb = (title) => `https://placehold.co/600x375/dfe9d5/3a4a2a?text=${encodeURIComponent(title)}`;
    certGrid.innerHTML = list.map((c, i) => {
      const imgs = (c.images && c.images.length) ? c.images : (c.image ? [c.image] : []);
      const src = imgs[0] || fb(c.title);
      return `
        <div class="cert-card" data-aos="fade-up" data-aos-delay="${(i % 4) * 80}"
             data-images='${JSON.stringify(imgs)}' data-title="${c.title}">
          <div class="cert-thumb">
            <span class="cert-badge">${certLabel(c.category)}</span>
            <img src="${src}" alt="${c.title}" onerror="this.src='${fb(c.title)}'">
          </div>
          <div class="cert-body">
            <h3 class="cert-title">${c.title}</h3>
            <span class="cert-meta">${c.issuer} &middot; ${c.date}</span>
            <p class="cert-desc">${loc(c.desc, currentLang)}</p>
          </div>
        </div>`;
    }).join('');
  }

  buildCertFilters();
  renderCertificates();

  const lightbox     = document.getElementById('lightbox');
  const lightboxImg  = document.getElementById('lightboxImg');
  const lightboxClose= document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  let lbImgs = [], lbIdx = 0;

  function setLb(i) {
    if (!lbImgs.length) return;
    lbIdx = (i + lbImgs.length) % lbImgs.length;
    lightboxImg.src = lbImgs[lbIdx];
    lightboxPrev?.classList.toggle('hidden', lbImgs.length <= 1);
    lightboxNext?.classList.toggle('hidden', lbImgs.length <= 1);
  }

  document.addEventListener('click', e => {
    /* Jangan buka lightbox kalau klik thumb-arrow di dalam project card */
    if (e.target.closest('[data-thumb-prev]') || e.target.closest('[data-thumb-next]') || e.target.closest('[data-dot-index]')) return;

    const card = e.target.closest('.cert-card');
    if (card) {
      try { lbImgs = JSON.parse(card.getAttribute('data-images') || '[]'); } catch { lbImgs = []; }
      lightboxImg.alt = card.getAttribute('data-title') || '';
      setLb(0);
      lightbox.classList.add('open');
    }
    if (e.target.closest('#lightboxPrev')) setLb(lbIdx - 1);
    if (e.target.closest('#lightboxNext')) setLb(lbIdx + 1);
  });

  lightboxClose?.addEventListener('click', () => lightbox.classList.remove('open'));
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) lightbox.classList.remove('open'); });
  document.addEventListener('keydown', e => {
    if (!lightbox?.classList.contains('open')) return;
    if (e.key === 'Escape')      lightbox.classList.remove('open');
    if (e.key === 'ArrowLeft')  setLb(lbIdx - 1);
    if (e.key === 'ArrowRight') setLb(lbIdx + 1);
  });

  const contactForm = document.getElementById('contactForm');
  const formStatus  = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', async e => {
      e.preventDefault();
      const action = contactForm.getAttribute('action');
      if (!action || action.includes('REPLACE_WITH_YOUR_ID')) {
        formStatus.textContent = t('form_not_connected');
        formStatus.style.color = '#c0392b';
        return;
      }
      const btn = contactForm.querySelector('button[type="submit"]');
      const orig = btn.innerHTML;
      btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${t('form_sending')}`;
      btn.disabled = true;
      try {
        const res = await fetch(action, { method: 'POST', body: new FormData(contactForm), headers: { Accept: 'application/json' } });
        if (res.ok) {
          formStatus.textContent = t('form_success');
          formStatus.style.color = '#2e7d32';
          contactForm.reset();
        } else throw new Error();
      } catch {
        formStatus.textContent = t('form_error');
        formStatus.style.color = '#c0392b';
      } finally {
        btn.innerHTML = orig;
        btn.disabled = false;
      }
    });
  }

  applyLang(currentLang);

  /* ================= PRELOADER SCRIPT ================= */
  const preloader = document.getElementById('sitePreloader');
  const preloaderNum = document.getElementById('preloaderNum');
  const preloaderBar = document.getElementById('preloaderBar');
  const preloaderStatus = document.getElementById('preloaderStatus');

  if (preloader) {
    let progress = 0;
    const phrases = [
      'Loading assets & shaders...',
      'Compiling 3D scene...',
      'Binding interactive physics...',
      'Ready!'
    ];

    const timer = setInterval(() => {
      progress += Math.floor(Math.random() * 8) + 4;
      if (progress >= 100) {
        progress = 100;
        clearInterval(timer);
        if (preloaderNum) preloaderNum.textContent = '100';
        if (preloaderBar) preloaderBar.style.width = '100%';
        if (preloaderStatus) preloaderStatus.textContent = phrases[3];

        setTimeout(() => {
          preloader.classList.add('fade-out');
          setTimeout(() => preloader.remove(), 700);
        }, 400);
      } else {
        if (preloaderNum) preloaderNum.textContent = String(progress);
        if (preloaderBar) preloaderBar.style.width = `${progress}%`;
        const phraseIdx = Math.min(Math.floor((progress / 100) * (phrases.length - 1)), phrases.length - 2);
        if (preloaderStatus) preloaderStatus.textContent = phrases[phraseIdx];
      }
    }, 45);
  }

  /* ================= 3D INTERACTIVE LANYARD SPRING PHYSICS (ALFARI STYLE) ================= */
  const idCard = document.getElementById('idCardWrapper');
  const lanyardRig = document.getElementById('lanyardRig');
  const ropePath = document.getElementById('lanyardRopePath');
  const ropeHighlight = document.getElementById('lanyardRopePathHighlight');
  const clipEl = document.getElementById('lanyardClip');

  if (idCard) {
    let cardX = 0, cardY = 0;
    let targetX = 0, targetY = 0;
    let vx = 0, vy = 0;
    let rotZ = 0, rotX = 0, rotY = 0;
    let isDragging = false;
    let dragStartX = 0, dragStartY = 0;
    let hasDragged = false;
    let idleAngle = 0;
    let hoverOffsetX = 0, hoverOffsetY = 0;
    let hoverRotX = 0, hoverRotY = 0;

    // Anchor point tali di paling atas menuju navbar / viewport
    // Koordinat SVG viewBox 0 0 1000 800 (SVG height 310px, top -150px, hook di top 100px + 16px = 116px)
    function updateRope() {
      const scaleX = 1000 / 360;
      const scaleY = 800 / 310;
      
      const anchorSvgX = 500;
      const anchorSvgY = 0; // puncak atas viewport
      
      const hookSvgX = 500 + (cardX * scaleX);
      const hookSvgY = (116 + 150 + cardY) * scaleY;

      // Kurva Bézier alami fleksibel
      const ctrlSvgX = 500 + (cardX * scaleX * 0.25);
      const ctrlSvgY = hookSvgY * 0.45;
      const d = `M ${anchorSvgX} ${anchorSvgY} Q ${ctrlSvgX} ${ctrlSvgY} ${hookSvgX} ${hookSvgY}`;

      if (ropePath) ropePath.setAttribute('d', d);
      if (ropeHighlight) ropeHighlight.setAttribute('d', d);

      // Posisi simpul tali pengait: menempel tepat di lubang plong kartu
      if (clipEl) {
        clipEl.style.transform = `translate3d(${cardX}px, ${cardY}px, 0) rotate(${rotZ * 0.85}deg)`;
      }
    }

    // Gerakan kursor di sekitar kartu: kartu sensitif merespons kursor + cahaya glare
    const heroZone = document.querySelector('.hero-photo-zone');
    const glareFront = document.getElementById('cardGlareFront');
    const glareBack = document.getElementById('cardGlareBack');

    if (heroZone) {
      heroZone.addEventListener('mousemove', (e) => {
        if (isDragging) return;
        const rect = idCard.getBoundingClientRect();
        const mouseX = e.clientX - (rect.left + rect.width / 2);
        const mouseY = e.clientY - (rect.top + rect.height / 2);

        // Sensitif kursor: bergeser dan berotasi halus mengikuti arah kursor
        hoverOffsetX = (mouseX / (rect.width / 2)) * 14;
        hoverOffsetY = (mouseY / (rect.height / 2)) * 10;
        hoverRotY = (mouseX / (rect.width / 2)) * 12;
        hoverRotX = -(mouseY / (rect.height / 2)) * 10;

        // Posisi pantulan cahaya lampu (glare) mengikuti kursor
        const gx = ((e.clientX - rect.left) / rect.width) * 100;
        const gy = ((e.clientY - rect.top) / rect.height) * 100;
        if (glareFront) {
          glareFront.style.setProperty('--gx', `${gx}%`);
          glareFront.style.setProperty('--gy', `${gy}%`);
        }
        if (glareBack) {
          glareBack.style.setProperty('--gx', `${gx}%`);
          glareBack.style.setProperty('--gy', `${gy}%`);
        }
      });

      heroZone.addEventListener('mouseleave', () => {
        hoverOffsetX = 0;
        hoverOffsetY = 0;
        hoverRotX = 0;
        hoverRotY = 0;
      });
    }

    // Spring physics loop
    function physicsLoop() {
      if (!isDragging) {
        // Idle gentle float (goyangan halus saat diam)
        idleAngle += 0.025;
        const idleFloatX = Math.sin(idleAngle) * 3 + hoverOffsetX;
        const idleFloatY = Math.cos(idleAngle * 0.8) * 2.5 + hoverOffsetY;

        // Damped harmonic spring physics menuju equilibrium
        const k = 0.05; // Spring tension
        const damping = 0.82; // Drag resistance

        const ax = (idleFloatX - cardX) * k;
        const ay = (idleFloatY - cardY) * k;

        vx = (vx + ax) * damping;
        vy = (vy + ay) * damping;

        cardX += vx;
        cardY += vy;

        // Natural pendular swing rotations + hover tilt
        rotZ += (-cardX * 0.22 - rotZ) * 0.1;
        rotX += ((-cardY * 0.08 + hoverRotX) - rotX) * 0.12;
        rotY += ((vx * 0.6 + hoverRotY) - rotY) * 0.12;
      } else {
        // Saat ditarik kursor: rotasi dinamis mengikuti tarikan
        cardX += (targetX - cardX) * 0.45;
        cardY += (targetY - cardY) * 0.45;

        rotZ = -cardX * 0.26;
        rotX = -cardY * 0.12;
        rotY = (cardX * 0.15);
      }

      // Update transform kartu
      idCard.style.transform = `translate3d(${cardX}px, ${cardY}px, 0px) rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg)`;

      // Update kurva tali SVG
      updateRope();

      requestAnimationFrame(physicsLoop);
    }

    // Pointer events untuk interaksi drag & pull
    function onPointerDown(e) {
      if (e.target.closest('.card-direct-link')) return; // biarkan link QR diklik
      isDragging = true;
      hasDragged = false;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      dragStartX = clientX - cardX;
      dragStartY = clientY - cardY;

      window.addEventListener('pointermove', onPointerMove, { passive: false });
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('touchmove', onPointerMove, { passive: false });
      window.addEventListener('touchend', onPointerUp);
    }

    function onPointerMove(e) {
      if (!isDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const nextX = clientX - dragStartX;
      const nextY = clientY - dragStartY;

      // Batasi jarak tarikan maksimum agar tali tetap elastis
      const dist = Math.hypot(nextX, nextY);
      if (dist > 10) hasDragged = true;

      const maxDist = 260;
      if (dist > maxDist) {
        const ratio = maxDist / dist;
        targetX = nextX * ratio;
        targetY = nextY * ratio;
      } else {
        targetX = nextX;
        targetY = nextY;
      }

      if (e.cancelable) e.preventDefault();
    }

    function onPointerUp() {
      if (!isDragging) return;
      isDragging = false;
      // Berikan impuls kecepatan balik (snap back effect)
      vx = (targetX - cardX) * 0.2;
      vy = (targetY - cardY) * 0.2;

      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
    }

    idCard.addEventListener('pointerdown', onPointerDown);
    idCard.addEventListener('touchstart', onPointerDown, { passive: true });

    // Klik kartu untuk flip balik sisi (kecuali jika sedang drag)
    idCard.addEventListener('click', (e) => {
      if (hasDragged) return;
      if (e.target.closest('.card-direct-link')) return;
      idCard.classList.toggle('flipped');
    });

    // Inisialisasi awal
    updateRope();
    requestAnimationFrame(physicsLoop);
  }
});