
   document.addEventListener('DOMContentLoaded', () => {

    AOS.init({ duration: 700, once: true, offset: 60 });
  
    /* ---------- Footer year ---------- */
    document.getElementById('year').textContent = new Date().getFullYear();
  
    
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
  
    /* =====================================================
       2. LANGUAGE TOGGLE (ID / EN)
    ===================================================== */
    const langToggle = document.getElementById('langToggle');
    let currentLang = localStorage.getItem('lang') || 'id';
  
    function applyLang(lang) {
      const dict = I18N[lang];
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
  
    /* =====================================================
       3. TYPING EFFECT (hero role line)
    ===================================================== */
    let typedTimeout;
    function renderTyped(lang) {
      clearTimeout(typedTimeout);
      const el = document.getElementById('typed');
      const roles = (I18N[lang] && I18N[lang].typed_roles) || ['Web Development'];
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
  
    /* =====================================================
       4. NAVBAR — active link otomatis saat scroll & klik langsung
    ===================================================== */
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('main .section');
    let manualLock = false; // saat user klik menu, kunci sebentar agar tidak "direbut" scrollspy di tengah animasi scroll
  
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
        // pindah aktif SEKETIKA saat diklik, tidak menunggu scroll selesai
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
  
    /* =====================================================
       5. ANIMATED COUNTER (about stats)
    ===================================================== */
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
  
    /* =====================================================
       6. ABOUT FRAME — tilt 3D mengikuti posisi cursor + glow
    ===================================================== */
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
  
    /* =====================================================
       7. RENDER: EXPERIENCE TIMELINE (zig-zag)
    ===================================================== */
    const timelineList = document.getElementById('timelineList');
    if (timelineList && typeof EXPERIENCE !== 'undefined') {
      timelineList.innerHTML = EXPERIENCE.map((item, i) => `
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
  
    /* =====================================================
       8. RENDER: PROJECTS (carousel) + FILTER
    ===================================================== */
    const projectsGrid = document.getElementById('projectsGrid');
    const projectFilters = document.getElementById('projectFilters');
    const projPrev = document.getElementById('projPrev');
    const projNext = document.getElementById('projNext');
  
    function renderProjects(filter = 'all') {
      if (!projectsGrid || typeof PROJECTS === 'undefined') return;
      const list = filter === 'all' ? PROJECTS : PROJECTS.filter(p => p.category === filter);
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
            <div class="project-tags">${p.tags.map(t => `<span>${t}</span>`).join('')}</div>
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
  
    if (projectFilters && typeof PROJECTS !== 'undefined') {
      const categories = ['all', ...new Set(PROJECTS.map(p => p.category))];
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
  
    /* =====================================================
       9. RENDER: SKILLS (Tech Stack & Software) + FILTER
    ===================================================== */
    const skillsGrid = document.getElementById('skillsGrid');
    const skillFilters = document.getElementById('skillFilters');
    let currentSkillFilter = 'all';
  
    function levelLabel(level) {
      const dict = I18N[currentLang] || I18N.id;
      return dict['level_' + level] || level;
    }
  
    function renderSkills(filter = 'all') {
      currentSkillFilter = filter;
      if (!skillsGrid || typeof SKILLS === 'undefined') return;
      const list = filter === 'all' ? SKILLS : SKILLS.filter(s => s.category === filter);
      skillsGrid.innerHTML = list.map((s, i) => `
        <div class="skill-card" data-aos="fade-up" data-aos-delay="${(i % 6) * 60}">
          <i class="${s.icon}" style="color:${s.color || 'var(--accent-dark)'}"></i>
          <span class="skill-name">${s.name}</span>
          <span class="skill-level ${s.level}">${levelLabel(s.level)}</span>
        </div>
      `).join('');
    }
  
    if (skillFilters && typeof SKILLS !== 'undefined') {
      const dict = I18N[currentLang] || I18N.id;
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
  
    /* =====================================================
       10. RENDER: CERTIFICATES + FILTER + LIGHTBOX
    ===================================================== */
    const certificateGrid = document.getElementById('certificateGrid');
    const certFilters = document.getElementById('certFilters');
    let currentCertFilter = 'all';
  
    function renderCertificates(filter = 'all') {
      currentCertFilter = filter;
      if (!certificateGrid || typeof CERTIFICATES === 'undefined') return;
      const list = filter === 'all' ? CERTIFICATES : CERTIFICATES.filter(c => c.category === filter);
      certificateGrid.innerHTML = list.map((c, i) => `
        <div class="cert-card" data-aos="fade-up" data-aos-delay="${(i % 4) * 80}" data-img="${c.image}" data-title="${c.title}">
          <div class="cert-thumb">
            <span class="cert-badge">${c.category || ''}</span>
            <img src="${c.image}" alt="${c.title}" onerror="this.src='https://placehold.co/600x375/dfe9d5/3a4a2a?text=${encodeURIComponent(c.title)}'">
          </div>
          <div class="cert-body">
            <h3 class="cert-title">${c.title}</h3>
            <span class="cert-meta">${c.issuer} &middot; ${c.date}</span>
            <p class="cert-desc">${c.desc || ''}</p>
          </div>
        </div>
      `).join('');
    }
  
    if (certFilters && typeof CERTIFICATES !== 'undefined') {
      const dict = I18N[currentLang] || I18N.id;
      const cats = ['all', ...new Set(CERTIFICATES.map(c => c.category))];
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
  
    /* lightbox */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
  
    document.addEventListener('click', (e) => {
      const card = e.target.closest('.cert-card');
      if (card) {
        lightboxImg.src = card.querySelector('img').src;
        lightboxImg.alt = card.getAttribute('data-title') || '';
        lightbox.classList.add('open');
      }
    });
    lightboxClose.addEventListener('click', () => lightbox.classList.remove('open'));
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.remove('open'); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') lightbox.classList.remove('open'); });
  
    /* set bahasa awal (memicu render ulang skills & certificate dengan label sesuai bahasa) */
    applyLang(currentLang);
  
    /* =====================================================
       11. CONTACT FORM — async submit (Formspree-compatible)
    ===================================================== */
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