const RAS_STORAGE_KEY = 'ras_admin_content';

function ras_getDefaultContent() {
  return {
    profile: {
      name_line1: "Rhiziqo Adjie",
      name_line2: "Syahputra",
      cv_path: "assets/CV_RHIZIQO ADJIE SYAHPUTRA.pdf",
      hero_photo: "",
      about_photo: "",
      stats: { years: 3, projects: 12, certs: 8 },
      i18n: {
        id: { ...(typeof I18N !== 'undefined' ? I18N.id : {}) },
        en: { ...(typeof I18N !== 'undefined' ? I18N.en : {}) }
      }
    },
    contact: {
      email: "zikoadjie@gmail.com",
      phone: "+62 812-4666-5782",
      location: "Indonesia",
      social: {
        linkedin: "https://linkedin.com/in/rhiziqoadjies",
        instagram: "https://instagram.com/zikoadjie_",
        github: "https://github.com/rhiziqoadjie"
      }
    },
    experience: (typeof EXPERIENCE !== 'undefined') ? EXPERIENCE : [],
    projects: (typeof PROJECTS !== 'undefined') ? PROJECTS : [],
    certificates: (typeof CERTIFICATES !== 'undefined') ? CERTIFICATES : [],
    skills: (typeof SKILLS !== 'undefined') ? SKILLS : []
  };
}

function ras_loadContent() {
  const defaults = ras_getDefaultContent();
  let saved = null;
  try {
    saved = JSON.parse(localStorage.getItem(RAS_STORAGE_KEY) || 'null');
  } catch (e) {
    saved = null;
  }
  if (!saved) return defaults;

  return {
    profile: {
      name_line1: (saved.profile && saved.profile.name_line1) || defaults.profile.name_line1,
      name_line2: (saved.profile && saved.profile.name_line2) || defaults.profile.name_line2,
      cv_path: (saved.profile && saved.profile.cv_path) || defaults.profile.cv_path,
      hero_photo: (saved.profile && saved.profile.hero_photo) || defaults.profile.hero_photo,
      about_photo: (saved.profile && saved.profile.about_photo) || defaults.profile.about_photo,
      stats: Object.assign({}, defaults.profile.stats, (saved.profile && saved.profile.stats) || {}),
      i18n: {
        id: Object.assign({}, defaults.profile.i18n.id, (saved.profile && saved.profile.i18n && saved.profile.i18n.id) || {}),
        en: Object.assign({}, defaults.profile.i18n.en, (saved.profile && saved.profile.i18n && saved.profile.i18n.en) || {})
      }
    },
    contact: {
      email: (saved.contact && saved.contact.email) || defaults.contact.email,
      phone: (saved.contact && saved.contact.phone) || defaults.contact.phone,
      location: (saved.contact && saved.contact.location) || defaults.contact.location,
      social: Object.assign({}, defaults.contact.social, (saved.contact && saved.contact.social) || {})
    },
    experience: Array.isArray(saved.experience) ? saved.experience : defaults.experience,
    projects: Array.isArray(saved.projects) ? saved.projects : defaults.projects,
    certificates: Array.isArray(saved.certificates) ? saved.certificates : defaults.certificates,
    skills: Array.isArray(saved.skills) ? saved.skills : defaults.skills
  };
}

const CONTENT = ras_loadContent();

document.addEventListener('DOMContentLoaded', () => {

  AOS.init({ duration: 700, once: true, offset: 60 });

  /* ---------- Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  function applyProfileAndContact() {
    const line1 = document.querySelector('.line-1');
    const line2 = document.querySelector('.line-2');
    if (line1) line1.textContent = CONTENT.profile.name_line1;
    if (line2) line2.textContent = CONTENT.profile.name_line2;

    const cvBtn = document.querySelector('.about-frame-content a.btn[download]');
    if (cvBtn) cvBtn.setAttribute('href', CONTENT.profile.cv_path);

    if (CONTENT.profile.hero_photo) {
      const heroImg = document.querySelector('.hero-photo-zone .photo-ring img');
      if (heroImg) heroImg.src = CONTENT.profile.hero_photo;
    }
    if (CONTENT.profile.about_photo) {
      const aboutImg = document.querySelector('.about-frame-photo img');
      if (aboutImg) aboutImg.src = CONTENT.profile.about_photo;
    }

    const statNums = document.querySelectorAll('.stat-num');
    if (statNums.length >= 3) {
      statNums[0].setAttribute('data-count', CONTENT.profile.stats.years);
      statNums[1].setAttribute('data-count', CONTENT.profile.stats.projects);
      statNums[2].setAttribute('data-count', CONTENT.profile.stats.certs);
    }

    const contactSpans = document.querySelectorAll('.contact-item span');
    if (contactSpans.length >= 3) {
      contactSpans[0].textContent = CONTENT.contact.email;
      contactSpans[1].textContent = CONTENT.contact.phone;
      contactSpans[2].textContent = CONTENT.contact.location;
    }

    const socialOrder = ['linkedin', 'instagram', 'github'];
    document.querySelectorAll('.social-rail a').forEach((a, i) => {
      if (socialOrder[i] && CONTENT.contact.social[socialOrder[i]]) {
        a.setAttribute('href', CONTENT.contact.social[socialOrder[i]]);
      }
    });
    document.querySelectorAll('.contact-socials a').forEach((a, i) => {
      if (socialOrder[i] && CONTENT.contact.social[socialOrder[i]]) {
        a.setAttribute('href', CONTENT.contact.social[socialOrder[i]]);
      }
    });
  }
  applyProfileAndContact();

  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'dark') {
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

  function applyLang(lang) {
    const dict = CONTENT.profile.i18n[lang];
    if (!dict) return;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        if (el.querySelector('i')) {
          const icon = el.querySelector('i').outerHTML;
          el.innerHTML = `${icon} ${dict[key]}`;
        } else {
          el.textContent = dict[key];
        }
      }
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const key = el.getAttribute('data-i18n-ph');
      if (dict[key]) el.setAttribute('placeholder', dict[key]);
    });
    langToggle.textContent = lang.toUpperCase() === 'ID' ? 'EN' : 'ID';
    document.documentElement.lang = lang;
    renderTyped(lang);
    renderSkills(currentSkillFilter);
    renderCertificates(currentCertFilter);
  }

  langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'id' ? 'en' : 'id';
    localStorage.setItem('lang', currentLang);
    applyLang(currentLang);
  });

  langToggle.textContent = currentLang.toUpperCase();

  let typedTimeout;
  function renderTyped(lang) {
    clearTimeout(typedTimeout);
    const el = document.getElementById('typed');
    const dict = CONTENT.profile.i18n[lang];
    const roles = (dict && dict.typed_roles) || ['Web Development'];
    let roleIndex = 0, charIndex = 0, deleting = false;

    function tick() {
      const word = roles[roleIndex];
      if (!deleting) {
        charIndex++;
        el.textContent = word.slice(0, charIndex);
        if (charIndex === word.length) {
          deleting = true;
          typedTimeout = setTimeout(tick, 1400);
          return;
        }
      } else {
        charIndex--;
        el.textContent = word.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
        }
      }
      typedTimeout = setTimeout(tick, deleting ? 45 : 90);
    }
    tick();
  }

  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main .section');
  let manualLock = false; 

  function setActiveLink(id) {
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
  }

  function onScrollSpy() {
    if (manualLock) return;
    let current = sections[0]?.id;
    const offset = 160;
    sections.forEach(sec => {
      if (window.scrollY + offset >= sec.offsetTop) current = sec.id;
    });
    setActiveLink(current);
  }
  window.addEventListener('scroll', onScrollSpy);
  onScrollSpy();

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const targetId = link.getAttribute('href').replace('#', '');
      setActiveLink(targetId);
      manualLock = true;
      clearTimeout(window.__navLockTimeout);
      window.__navLockTimeout = setTimeout(() => { manualLock = false; }, 900);
    });
  });

  /* mobile burger */
  const burger = document.getElementById('burger');
  const navList = document.getElementById('navLinks');
  burger.addEventListener('click', () => {
    navList.classList.toggle('open');
    burger.classList.toggle('open');
  });
  navLinks.forEach(link => link.addEventListener('click', () => {
    navList.classList.remove('open');
    burger.classList.remove('open');
  }));

  const counters = document.querySelectorAll('.stat-num');
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach(c => counterObserver.observe(c));

  function animateCount(el) {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 40));
    const interval = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(interval); }
      el.textContent = current;
    }, 30);
  }

  const aboutFrame = document.getElementById('aboutFrame');
  if (aboutFrame) {
    const MAX_TILT = 6; // derajat

    aboutFrame.addEventListener('mousemove', (e) => {
      const rect = aboutFrame.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;   // 0..1
      const py = (e.clientY - rect.top) / rect.height;    // 0..1

      const rotateY = (px - 0.5) * (MAX_TILT * 2);
      const rotateX = (0.5 - py) * (MAX_TILT * 2);

      aboutFrame.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;
      aboutFrame.style.setProperty('--mx', `${px * 100}%`);
      aboutFrame.style.setProperty('--my', `${py * 100}%`);
    });

    aboutFrame.addEventListener('mouseleave', () => {
      aboutFrame.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
  }

  const timelineList = document.getElementById('timelineList');
  if (timelineList && Array.isArray(CONTENT.experience)) {
    timelineList.innerHTML = CONTENT.experience.map((item, i) => `
      <div class="timeline-item" data-aos="${i % 2 === 0 ? 'fade-right' : 'fade-left'}" data-aos-delay="${(i % 4) * 60}">
        <span class="timeline-dot"><i class="fa-solid fa-circle" style="font-size:6px;"></i></span>
        <div class="timeline-card">
          <div class="timeline-icon"><i class="${item.icon || 'fa-solid fa-briefcase'}"></i></div>
          <span class="timeline-year">${item.year}</span>
          <h3 class="timeline-title">${item.title}</h3>
          <span class="timeline-role">${item.role || ''}</span>
          <p class="timeline-desc">${item.desc}</p>
          <div class="timeline-tags">${(item.tags || []).map(t => `<span>${t}</span>`).join('')}</div>
        </div>
      </div>
    `).join('');
  }

  const projectsGrid = document.getElementById('projectsGrid');
  const projectFilters = document.getElementById('projectFilters');
  const projPrev = document.getElementById('projPrev');
  const projNext = document.getElementById('projNext');

  function renderProjects(filter = 'all') {
    if (!projectsGrid || !Array.isArray(CONTENT.projects)) return;
    const list = filter === 'all' ? CONTENT.projects : CONTENT.projects.filter(p => p.category === filter);
    projectsGrid.innerHTML = list.map((p) => {
      const images = p.images && p.images.length ? p.images : ['assets/img/projects/placeholder.jpg'];
      const fallback = `https://placehold.co/600x375/dfe9d5/3a4a2a?text=${encodeURIComponent(p.title)}`;
      return `
      <div class="project-card">
        <div class="project-thumb" data-images='${JSON.stringify(images)}' data-img-index="0">
          <img src="${images[0]}" alt="${p.title}" onerror="this.src='${fallback}'">
          ${images.length > 1 ? `
            <button class="thumb-arrow left" data-thumb-prev aria-label="Gambar sebelumnya"><i class="fa-solid fa-chevron-left"></i></button>
            <button class="thumb-arrow right" data-thumb-next aria-label="Gambar berikutnya"><i class="fa-solid fa-chevron-right"></i></button>
            <div class="thumb-dots">
              ${images.map((_, di) => `<span class="dot ${di === 0 ? 'active' : ''}" data-dot-index="${di}"></span>`).join('')}
            </div>
          ` : ''}
        </div>
        <div class="project-body">
          <h3 class="project-title">${p.title}</h3>
          <p class="project-desc">${p.desc}</p>
          <div class="project-tags">${(p.tags || []).map(t => `<span>${t}</span>`).join('')}</div>
          <div class="project-links">
            <a href="${p.demo}" target="_blank" rel="noopener"><i class="fa-solid fa-arrow-up-right-from-square"></i> Demo</a>
            <a href="${p.code}" target="_blank" rel="noopener"><i class="fa-brands fa-github"></i> Code</a>
          </div>
        </div>
      </div>
    `;
    }).join('');
    projectsGrid.scrollTo({ left: 0 });
  }

  if (projectFilters && Array.isArray(CONTENT.projects)) {
    const categories = ['all', ...new Set(CONTENT.projects.map(p => p.category))];
    projectFilters.innerHTML = categories.map((cat, i) => `
      <button class="filter-btn ${i === 0 ? 'active' : ''}" data-filter="${cat}">
        ${cat === 'all' ? 'Semua' : cat.charAt(0).toUpperCase() + cat.slice(1)}
      </button>
    `).join('');

    projectFilters.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        projectFilters.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderProjects(btn.getAttribute('data-filter'));
      });
    });
  }
  renderProjects();

  if (projPrev && projNext && projectsGrid) {
    const scrollByCard = () => {
      const card = projectsGrid.querySelector('.project-card');
      return card ? card.offsetWidth + 30 : 380;
    };
    projPrev.addEventListener('click', () => projectsGrid.scrollBy({ left: -scrollByCard(), behavior: 'smooth' }));
    projNext.addEventListener('click', () => projectsGrid.scrollBy({ left: scrollByCard(), behavior: 'smooth' }));
  }

  /* --- slider GAMBAR di dalam masing-masing project card (terpisah dari slide antar-project) --- */
  function setThumbImage(thumb, index) {
    const images = JSON.parse(thumb.getAttribute('data-images') || '[]');
    if (!images.length) return;
    const safeIndex = (index + images.length) % images.length;
    thumb.setAttribute('data-img-index', safeIndex);
    const img = thumb.querySelector('img');
    if (img) img.src = images[safeIndex];
    thumb.querySelectorAll('.thumb-dots .dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === safeIndex);
    });
  }

  document.addEventListener('click', (e) => {
    const prevBtn = e.target.closest('[data-thumb-prev]');
    const nextBtn = e.target.closest('[data-thumb-next]');
    const dot = e.target.closest('[data-dot-index]');

    if (prevBtn || nextBtn) {
      const thumb = (prevBtn || nextBtn).closest('.project-thumb');
      if (!thumb) return;
      const current = parseInt(thumb.getAttribute('data-img-index'), 10) || 0;
      setThumbImage(thumb, prevBtn ? current - 1 : current + 1);
    }

    if (dot) {
      const thumb = dot.closest('.project-thumb');
      if (!thumb) return;
      setThumbImage(thumb, parseInt(dot.getAttribute('data-dot-index'), 10) || 0);
    }
  });

  const skillsGrid = document.getElementById('skillsGrid');
  const skillFilters = document.getElementById('skillFilters');
  let currentSkillFilter = 'all';

  function levelLabel(level) {
    const dict = CONTENT.profile.i18n[currentLang] || CONTENT.profile.i18n.id;
    return dict['level_' + level] || level;
  }

  function renderSkills(filter = 'all') {
    currentSkillFilter = filter;
    if (!skillsGrid || !Array.isArray(CONTENT.skills)) return;
    const list = filter === 'all' ? CONTENT.skills : CONTENT.skills.filter(s => s.category === filter);
    skillsGrid.innerHTML = list.map((s, i) => `
      <div class="skill-card" data-aos="fade-up" data-aos-delay="${(i % 6) * 60}">
        <i class="${s.icon}" style="color:${s.color || 'var(--accent-dark)'}"></i>
        <span class="skill-name">${s.name}</span>
        <span class="skill-level ${s.level}">${levelLabel(s.level)}</span>
      </div>
    `).join('');
  }

  if (skillFilters && Array.isArray(CONTENT.skills)) {
    const dict = CONTENT.profile.i18n[currentLang] || CONTENT.profile.i18n.id;
    const filterDefs = [
      { key: 'all', label: dict.filter_all },
      { key: 'programming', label: dict.filter_programming },
      { key: 'software', label: dict.filter_software }
    ];
    skillFilters.innerHTML = filterDefs.map((f, i) => `
      <button class="filter-btn ${i === 0 ? 'active' : ''}" data-filter="${f.key}">${f.label}</button>
    `).join('');

    skillFilters.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        skillFilters.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderSkills(btn.getAttribute('data-filter'));
      });
    });
  }
  renderSkills();

  const certificateGrid = document.getElementById('certificateGrid');
  const certFilters = document.getElementById('certFilters');
  let currentCertFilter = 'all';

  function renderCertificates(filter = 'all') {
    currentCertFilter = filter;
    if (!certificateGrid || !Array.isArray(CONTENT.certificates)) return;
    const list = filter === 'all' ? CONTENT.certificates : CONTENT.certificates.filter(c => c.category === filter);
    certificateGrid.innerHTML = list.map((c, i) => {
      const images = (c.images && c.images.length) ? c.images : (c.image ? [c.image] : []);
      const fallback = `https://placehold.co/600x375/dfe9d5/3a4a2a?text=${encodeURIComponent(c.title)}`;
      return `
      <div class="cert-card" data-aos="fade-up" data-aos-delay="${(i % 4) * 80}" data-images='${JSON.stringify(images)}' data-title="${c.title}">
        <div class="cert-thumb">
          <span class="cert-badge">${c.category || ''}</span>
          <img src="${images[0] || fallback}" alt="${c.title}" onerror="this.src='${fallback}'">
        </div>
        <div class="cert-body">
          <h3 class="cert-title">${c.title}</h3>
          <span class="cert-meta">${c.issuer} &middot; ${c.date}</span>
          <p class="cert-desc">${c.desc || ''}</p>
        </div>
      </div>
    `;
    }).join('');
  }

  if (certFilters && Array.isArray(CONTENT.certificates)) {
    const dict = CONTENT.profile.i18n[currentLang] || CONTENT.profile.i18n.id;
    const cats = ['all', ...new Set(CONTENT.certificates.map(c => c.category))];
    const labelMap = {
      all: dict.cert_filter_all,
      internship: dict.cert_filter_internship,
      training: dict.cert_filter_training,
      certification: dict.cert_filter_certification
    };
    certFilters.innerHTML = cats.map((cat, i) => `
      <button class="filter-btn ${i === 0 ? 'active' : ''}" data-filter="${cat}">
        ${labelMap[cat] || (cat.charAt(0).toUpperCase() + cat.slice(1))}
      </button>
    `).join('');

    certFilters.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        certFilters.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderCertificates(btn.getAttribute('data-filter'));
      });
    });
  }
  renderCertificates();

  /* lightbox (mendukung beberapa gambar per sertifikat) */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  let lightboxImages = [];
  let lightboxIndex = 0;

  function setLightboxImage(i) {
    if (!lightboxImages.length) return;
    lightboxIndex = (i + lightboxImages.length) % lightboxImages.length;
    lightboxImg.src = lightboxImages[lightboxIndex];
    const multi = lightboxImages.length > 1;
    lightboxPrev.classList.toggle('hidden', !multi);
    lightboxNext.classList.toggle('hidden', !multi);
  }

  document.addEventListener('click', (e) => {
    const card = e.target.closest('.cert-card');
    if (card) {
      try {
        lightboxImages = JSON.parse(card.getAttribute('data-images') || '[]');
      } catch (err) {
        lightboxImages = [];
      }
      lightboxImg.alt = card.getAttribute('data-title') || '';
      setLightboxImage(0);
      lightbox.classList.add('open');
    }
    if (e.target.closest('#lightboxPrev')) setLightboxImage(lightboxIndex - 1);
    if (e.target.closest('#lightboxNext')) setLightboxImage(lightboxIndex + 1);
  });
  lightboxClose.addEventListener('click', () => lightbox.classList.remove('open'));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.remove('open'); });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') lightbox.classList.remove('open');
    if (e.key === 'ArrowLeft') setLightboxImage(lightboxIndex - 1);
    if (e.key === 'ArrowRight') setLightboxImage(lightboxIndex + 1);
  });

  /* set bahasa awal (memicu render ulang skills & certificate dengan label sesuai bahasa) */
  applyLang(currentLang);

  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const action = contactForm.getAttribute('action');

    if (!action || action.includes('REPLACE_WITH_YOUR_ID')) {
      formStatus.textContent = 'Form belum terhubung ke layanan email. Lihat README untuk setup Formspree/EmailJS.';
      formStatus.style.color = '#c0392b';
      return;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalLabel = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mengirim...';
    submitBtn.disabled = true;

    try {
      const res = await fetch(action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' }
      });
      if (res.ok) {
        formStatus.textContent = 'Pesan berhasil terkirim. Terima kasih!';
        formStatus.style.color = '#2e7d32';
        contactForm.reset();
      } else {
        throw new Error('Gagal mengirim');
      }
    } catch (err) {
      formStatus.textContent = 'Terjadi kesalahan, coba lagi nanti.';
      formStatus.style.color = '#c0392b';
    } finally {
      submitBtn.innerHTML = originalLabel;
      submitBtn.disabled = false;
    }
  });

  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.style.boxShadow = window.scrollY > 30
      ? '0 10px 30px rgba(0,0,0,0.12)'
      : '0 8px 30px rgba(0,0,0,0.06)';
  });

});