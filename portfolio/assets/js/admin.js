   function saveSectionAndToast(key, value) {
    const ok = saveSection(key, value);
    if (ok) {
      showToast('Tersimpan & langsung terlihat di "Lihat Preview". Klik "Unduh data.js" di tab Publish agar permanen untuk semua pengunjung.');
    } else {
      showToast('Gagal menyimpan. Coba lagi.');
    }
  }
  
  let toastTimeout;
  function showToast(msg) {
    const el = document.getElementById('adminToast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => el.classList.remove('show'), 3600);
  }
  
  function fileToDataUrl(file, maxDim = 1600, quality = 0.82) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          let width = img.naturalWidth;
          let height = img.naturalHeight;
  
          if (width > maxDim || height > maxDim) {
            if (width >= height) {
              height = Math.round(height * (maxDim / width));
              width = maxDim;
            } else {
              width = Math.round(width * (maxDim / height));
              height = maxDim;
            }
          }
  
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
  
          const isPng = file.type === 'image/png';
          const mime = isPng ? 'image/png' : 'image/jpeg';
          const dataUrl = canvas.toDataURL(mime, quality);
          resolve(dataUrl);
        };
        img.onerror = () => reject(new Error('Gagal memuat gambar'));
        img.src = reader.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
  
  function estimateBase64SizeKb(str) {
  
    return Math.round((str.length * 0.75) / 1024);
  }
  
  function imageManagerHtml(fieldKey, initialList, maxCount) {
    const listJson = escapeHtml(JSON.stringify(initialList || []));
    return `
      <div class="image-manager" ${maxCount ? `data-max="${maxCount}"` : ''}>
        <div class="image-thumbs" data-thumbs></div>
        <div class="image-manager-controls">
          <label class="image-upload-btn">
            <i class="fa-solid fa-upload"></i> ${maxCount === 1 ? 'Upload Foto' : 'Upload Gambar'}
            <input type="file" accept="image/*" ${maxCount === 1 ? '' : 'multiple'} class="image-upload-input">
          </label>
          <input type="text" class="image-url-input" placeholder="atau tempel URL/path gambar lalu tekan Enter">
        </div>
        <textarea class="images-hidden" data-field="${fieldKey}" style="display:none">${listJson}</textarea>
      </div>
    `;
  }
  
  function initImageManagers(root) {
    root.querySelectorAll('.image-manager').forEach(manager => {
      if (manager.dataset.wired === 'true') return;
      manager.dataset.wired = 'true';
  
      const thumbsEl = manager.querySelector('[data-thumbs]');
      const hidden = manager.querySelector('.images-hidden');
      const fileInput = manager.querySelector('.image-upload-input');
      const urlInput = manager.querySelector('.image-url-input');
      const maxCount = parseInt(manager.getAttribute('data-max') || '0', 10) || null;
  
      if (maxCount !== 1) {
        fileInput.multiple = true;
      } else {
        fileInput.multiple = false;
      }
  
      function getList() {
        try { return JSON.parse(hidden.value || '[]'); } catch (e) { return []; }
      }
      function setList(list) {
        if (maxCount) list = list.slice(-maxCount);
        hidden.value = JSON.stringify(list);
        renderThumbs(list);
      }
      function renderThumbs(list) {
        thumbsEl.innerHTML = list.map((src, i) => `
          <div class="img-thumb-item">
            <img src="${src}" alt="gambar ${i + 1}">
            <button type="button" class="img-thumb-remove" data-idx="${i}" aria-label="Hapus gambar"><i class="fa-solid fa-xmark"></i></button>
          </div>
        `).join('') || `<p class="image-empty-hint">Belum ada gambar.</p>`;
      }
      renderThumbs(getList());
  
      fileInput.addEventListener('change', async () => {
        const files = Array.from(fileInput.files || []);
        if (!files.length) return;
        showToast(`Memproses ${files.length} foto...`);
        try {
          const dataUrls = await Promise.all(files.map(f => fileToDataUrl(f)));
          const totalKb = dataUrls.reduce((sum, d) => sum + estimateBase64SizeKb(d), 0);
          const list = maxCount === 1 ? dataUrls.slice(-1) : getList().concat(dataUrls);
          setList(list);
          showToast(`${files.length} foto siap (± ${totalKb} KB setelah dikompres). Jangan lupa klik Simpan.`);
        } catch (e) {
          showToast('Gagal membaca/mengompres file gambar.');
        }
        fileInput.value = '';
      });
  
      urlInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const val = urlInput.value.trim();
          if (val) {
            const list = maxCount === 1 ? [val] : getList().concat([val]);
            setList(list);
            urlInput.value = '';
          }
        }
      });
  
      thumbsEl.addEventListener('click', (e) => {
        const btn = e.target.closest('.img-thumb-remove');
        if (!btn) return;
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        const list = getList();
        list.splice(idx, 1);
        setList(list);
      });
    });
  }
  
  function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  
  function initLogin() {
    const loginWrap = document.getElementById('loginWrap');
    const shell = document.getElementById('adminShell');
    const loginForm = document.getElementById('loginForm');
    const loginInput = document.getElementById('loginPassword');
    const loginError = document.getElementById('loginError');
  
    function showDashboard() {
      loginWrap.style.display = 'none';
      shell.style.display = 'block';
      document.getElementById('adminShellGrid').classList.add('active');
      renderAll();
    }
  
    if (sessionStorage.getItem(SESSION_KEY) === 'true') {
      showDashboard();
    }
  
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const savedPass = localStorage.getItem(PASS_KEY) || DEFAULT_PASS;
      if (loginInput.value === savedPass) {
        sessionStorage.setItem(SESSION_KEY, 'true');
        loginError.textContent = '';
        showDashboard();
      } else {
        loginError.textContent = 'Password salah. Coba lagi.';
      }
    });
  
    document.getElementById('logoutBtn').addEventListener('click', () => {
      sessionStorage.removeItem(SESSION_KEY);
      location.reload();
    });
  }
  
  function initTabs() {
    const navBtns = document.querySelectorAll('.admin-nav-btn');
    const panels = document.querySelectorAll('.admin-panel');
    navBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        navBtns.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.getAttribute('data-panel')).classList.add('active');
      });
    });
  }
  
  function renderProfileTab() {
    const c = getMerged();
  
    document.getElementById('f_name1').value = c.profile.name_line1;
    document.getElementById('f_name2').value = c.profile.name_line2;
    document.getElementById('f_cv').value = c.profile.cv_path;
    document.getElementById('f_stat_years').value = c.profile.stats.years;
    document.getElementById('f_stat_projects').value = c.profile.stats.projects;
    document.getElementById('f_stat_certs').value = c.profile.stats.certs;
  
    const heroPhotoWrap = document.getElementById('heroPhotoManager');
    heroPhotoWrap.innerHTML = imageManagerHtml('hero_photo', c.profile.hero_photo ? [c.profile.hero_photo] : [], 1);
    initImageManagers(heroPhotoWrap);
  
    const aboutPhotoWrap = document.getElementById('aboutPhotoManager');
    aboutPhotoWrap.innerHTML = imageManagerHtml('about_photo', c.profile.about_photo ? [c.profile.about_photo] : [], 1);
    initImageManagers(aboutPhotoWrap);
  
    ['id', 'en'].forEach(lang => {
      const dict = c.profile.i18n[lang] || {};
      document.getElementById(`f_${lang}_greeting`).value = dict.hero_greeting || '';
      document.getElementById(`f_${lang}_we`).value = dict.hero_we || '';
      document.getElementById(`f_${lang}_desc`).value = dict.hero_desc || '';
      document.getElementById(`f_${lang}_p1`).value = dict.about_p1 || '';
      document.getElementById(`f_${lang}_p2`).value = dict.about_p2 || '';
      document.getElementById(`f_${lang}_footer`).value = dict.footer_rights || '';
      document.getElementById(`f_${lang}_roles`).value = (dict.typed_roles || []).join(', ');
    });
  
    document.getElementById('saveProfileBtn').onclick = () => {
      const base = getMerged().profile;
  
      function firstImage(wrapId) {
        const hidden = document.querySelector(`#${wrapId} .images-hidden`);
        try {
          const list = JSON.parse((hidden && hidden.value) || '[]');
          return list[0] || '';
        } catch (e) { return ''; }
      }
  
      const newProfile = {
        name_line1: document.getElementById('f_name1').value.trim() || base.name_line1,
        name_line2: document.getElementById('f_name2').value.trim() || base.name_line2,
        cv_path: document.getElementById('f_cv').value.trim() || base.cv_path,
        hero_photo: firstImage('heroPhotoManager'),
        about_photo: firstImage('aboutPhotoManager'),
        stats: {
          years: parseInt(document.getElementById('f_stat_years').value, 10) || 0,
          projects: parseInt(document.getElementById('f_stat_projects').value, 10) || 0,
          certs: parseInt(document.getElementById('f_stat_certs').value, 10) || 0
        },
        i18n: { id: {}, en: {} }
      };
      ['id', 'en'].forEach(lang => {
        newProfile.i18n[lang] = Object.assign({}, base.i18n[lang], {
          hero_greeting: document.getElementById(`f_${lang}_greeting`).value,
          hero_we: document.getElementById(`f_${lang}_we`).value,
          hero_desc: document.getElementById(`f_${lang}_desc`).value,
          about_p1: document.getElementById(`f_${lang}_p1`).value,
          about_p2: document.getElementById(`f_${lang}_p2`).value,
          footer_rights: document.getElementById(`f_${lang}_footer`).value,
          typed_roles: document.getElementById(`f_${lang}_roles`).value.split(',').map(s => s.trim()).filter(Boolean)
        });
      });
      saveSectionAndToast('profile', newProfile);
    };
  
    document.querySelectorAll('.tabs-lang button').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tabs-lang button').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.lang-block').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('lang_' + btn.getAttribute('data-lang')).classList.add('active');
      });
    });
  }
  
  function renderContactTab() {
    const c = getMerged();
    document.getElementById('f_email').value = c.contact.email;
    document.getElementById('f_phone').value = c.contact.phone;
    document.getElementById('f_location').value = c.contact.location;
    document.getElementById('f_linkedin').value = c.contact.social.linkedin;
    document.getElementById('f_instagram').value = c.contact.social.instagram;
    document.getElementById('f_github').value = c.contact.social.github;
  
    document.getElementById('saveContactBtn').onclick = () => {
      const newContact = {
        email: document.getElementById('f_email').value.trim(),
        phone: document.getElementById('f_phone').value.trim(),
        location: document.getElementById('f_location').value.trim(),
        social: {
          linkedin: document.getElementById('f_linkedin').value.trim(),
          instagram: document.getElementById('f_instagram').value.trim(),
          github: document.getElementById('f_github').value.trim()
        }
      };
      saveSectionAndToast('contact', newContact);
    };
  }
  
  /* fieldHtml sekarang juga mendukung type 'i18n_text' dan 'i18n_textarea'
     untuk field yang butuh versi Indonesia & Inggris (mis. deskripsi
     pengalaman/project/sertifikat). */
  function fieldHtml(sectionKey, idx, field, value) {
    const id = `${sectionKey}_${idx}_${field.key}`;
  
    if (field.type === 'i18n_text' || field.type === 'i18n_textarea') {
      const val = value && typeof value === 'object' ? value : { id: (value || ''), en: '' };
      const isArea = field.type === 'i18n_textarea';
      const idVal = escapeHtml(val.id || '');
      const enVal = escapeHtml(val.en || '');
      const build = (which, v) => isArea
        ? `<textarea id="${id}_${which}" data-field="${field.key}" data-lang="${which}" rows="3">${v}</textarea>`
        : `<input type="text" id="${id}_${which}" data-field="${field.key}" data-lang="${which}" value="${v}">`;
      return `<div class="field field-full i18n-field">
        <label>${field.label}</label>
        <div class="i18n-field-grid">
          <div><span class="i18n-tag">ID</span>${build('id', idVal)}</div>
          <div><span class="i18n-tag">EN</span>${build('en', enVal)}</div>
        </div>
      </div>`;
    }
    if (field.type === 'imagelist') {
      const list = Array.isArray(value) ? value : (value ? [value] : []);
      return `<div class="field field-full">
        <label>${field.label}</label>
        ${imageManagerHtml(field.key, list, field.max || null)}
        ${field.hint ? `<small>${field.hint}</small>` : ''}
      </div>`;
    }
    if (field.type === 'textarea') {
      return `<div class="field"><label for="${id}">${field.label}</label>
        <textarea id="${id}" data-field="${field.key}" rows="3">${escapeHtml(value || '')}</textarea></div>`;
    }
    if (field.type === 'select') {
      const opts = field.options.map(o => `<option value="${o}" ${o === value ? 'selected' : ''}>${o}</option>`).join('');
      return `<div class="field"><label for="${id}">${field.label}</label>
        <select id="${id}" data-field="${field.key}">${opts}</select>
        ${field.hint ? `<small>${field.hint}</small>` : ''}</div>`;
    }
    if (field.type === 'taglist') {
      const str = Array.isArray(value) ? value.join(', ') : (value || '');
      return `<div class="field"><label for="${id}">${field.label}</label>
        <input type="text" id="${id}" data-field="${field.key}" data-taglist="true" value="${escapeHtml(str)}" placeholder="${field.placeholder || ''}"></div>`;
    }
    return `<div class="field"><label for="${id}">${field.label}</label>
      <input type="text" id="${id}" data-field="${field.key}" value="${escapeHtml(value || '')}" placeholder="${field.placeholder || ''}"></div>`;
  }
  
  function renderItemCard(sectionKey, idx, item, schema, labelName) {
    const fieldsHtml = schema.map(f => fieldHtml(sectionKey, idx, f, item[f.key])).join('');
    return `
      <div class="item-card" data-section="${sectionKey}" data-index="${idx}">
        <div class="item-card-head">
          <span>${labelName} #${idx + 1}</span>
          <button type="button" class="item-delete-btn" data-remove aria-label="Hapus"><i class="fa-solid fa-trash"></i></button>
        </div>
        <div class="field-grid">${fieldsHtml}</div>
      </div>
    `;
  }
  
  function collectItemCards(sectionKey, schema) {
    const cards = document.querySelectorAll(`.item-card[data-section="${sectionKey}"]`);
    const list = [];
    cards.forEach(card => {
      const obj = {};
      schema.forEach(f => {
        if (f.type === 'i18n_text' || f.type === 'i18n_textarea') {
          const idInput = card.querySelector(`[data-field="${f.key}"][data-lang="id"]`);
          const enInput = card.querySelector(`[data-field="${f.key}"][data-lang="en"]`);
          obj[f.key] = { id: idInput ? idInput.value : '', en: enInput ? enInput.value : '' };
          return;
        }
        const input = card.querySelector(`[data-field="${f.key}"]`);
        if (!input) return;
        if (f.type === 'taglist') {
          obj[f.key] = input.value.split(',').map(s => s.trim()).filter(Boolean);
        } else if (f.type === 'imagelist') {
          try { obj[f.key] = JSON.parse(input.value || '[]'); } catch (e) { obj[f.key] = []; }
        } else {
          obj[f.key] = input.value;
        }
      });
      list.push(obj);
    });
    return list;
  }
  
  function wireListPanel(sectionKey, schema, labelName, listContainerId, addBtnId, saveBtnId) {
    const container = document.getElementById(listContainerId);
  
    function repaint() {
      const items = getMerged()[sectionKey] || [];
      container.innerHTML = items.map((item, i) => renderItemCard(sectionKey, i, item, schema, labelName)).join('');
      initImageManagers(container);
    }
    repaint();
  
    container.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-remove]');
      if (!btn) return;
      btn.closest('.item-card').remove();
      container.querySelectorAll('.item-card').forEach((card, i) => {
        card.querySelector('.item-card-head span').textContent = `${labelName} #${i + 1}`;
      });
    });
  
    document.getElementById(addBtnId).addEventListener('click', () => {
      const blank = {};
      schema.forEach(f => {
        if (f.type === 'taglist' || f.type === 'imagelist') blank[f.key] = [];
        else if (f.type === 'i18n_text' || f.type === 'i18n_textarea') blank[f.key] = { id: '', en: '' };
        else blank[f.key] = '';
      });
      const idx = container.querySelectorAll('.item-card').length;
      container.insertAdjacentHTML('beforeend', renderItemCard(sectionKey, idx, blank, schema, labelName));
      initImageManagers(container);
    });
  
    document.getElementById(saveBtnId).addEventListener('click', () => {
      const list = collectItemCards(sectionKey, schema);
      saveSectionAndToast(sectionKey, list);
      repaint();
    });
  }
  
  const EXPERIENCE_SCHEMA = [
    { key: 'year', label: 'Periode', type: 'text', placeholder: 'Aug 2023 - Des 2023' },
    { key: 'title', label: 'Perusahaan / Institusi / Gelar', type: 'text' },
    { key: 'role', label: 'Posisi / Peran', type: 'i18n_text' },
    { key: 'desc', label: 'Deskripsi', type: 'i18n_textarea' },
    { key: 'tags', label: 'Tags (pisahkan dengan koma)', type: 'taglist' },
    { key: 'icon', label: 'Ikon Font Awesome', type: 'text', placeholder: 'fa-solid fa-briefcase' }
  ];
  
  const PROJECTS_SCHEMA = [
    { key: 'title', label: 'Judul Project', type: 'text' },
    {
      key: 'category', label: 'Kategori', type: 'select', options: ['website', 'uiux'],
      hint: 'Menentukan filter & label (ID/EN) di halaman utama. Untuk kategori baru, tambahkan juga label di objek I18N pada data.js dengan key proj_cat_&lt;kategori&gt;.'
    },
    { key: 'desc', label: 'Deskripsi', type: 'i18n_textarea' },
    { key: 'images', label: 'Gambar Project', type: 'imagelist', hint: 'Bisa upload lebih dari satu foto sekaligus. Gambar pertama jadi thumbnail utama.' },
    { key: 'tags', label: 'Tags (pisahkan dengan koma)', type: 'taglist' },
    { key: 'demo', label: 'Link Demo', type: 'text' },
    { key: 'code', label: 'Link Kode (GitHub)', type: 'text' }
  ];
  
  const CERTIFICATES_SCHEMA = [
    { key: 'title', label: 'Judul Sertifikat', type: 'text' },
    { key: 'issuer', label: 'Penerbit', type: 'text' },
    { key: 'date', label: 'Tanggal', type: 'text' },
    { key: 'category', label: 'Kategori', type: 'select', options: ['internship', 'training', 'certification'] },
    { key: 'desc', label: 'Deskripsi', type: 'i18n_textarea' },
    { key: 'images', label: 'Gambar Sertifikat', type: 'imagelist', hint: 'Bisa upload lebih dari satu (misal halaman depan & belakang sertifikat).' }
  ];
  
  const SKILLS_SCHEMA = [
    { key: 'name', label: 'Nama Skill', type: 'text' },
    { key: 'icon', label: 'Ikon Font Awesome', type: 'text', placeholder: 'fa-brands fa-js' },
    { key: 'level', label: 'Level', type: 'select', options: ['beginner', 'intermediate', 'advanced', 'expert'] },
    { key: 'category', label: 'Kategori', type: 'select', options: ['programming', 'software'] },
    { key: 'color', label: 'Warna (hex)', type: 'text', placeholder: '#5fd17a' }
  ];
  
  function initPublishTab() {
    const statusEl = document.getElementById('publishStatusHint');
  
    function refreshStatus() {
      if (!statusEl) return;
      if (hasUnpublishedChanges()) {
        statusEl.textContent = 'Ada perubahan tersimpan di browser ini yang BELUM diunduh ke data.js. Klik "Unduh data.js" lalu replace file di project & git push agar terlihat oleh semua pengunjung.';
        statusEl.style.color = '#a85a10';
      } else {
        statusEl.textContent = 'Tidak ada perubahan tersimpan di browser ini (konten mengikuti data.js saat ini).';
        statusEl.style.color = '';
      }
    }
    refreshStatus();
  
    document.getElementById('previewBtn').addEventListener('click', () => {
      window.open('index.html', '_blank');
    });
  
    document.getElementById('downloadDataJsBtn').addEventListener('click', () => {
      const c = getMerged();
  
      /* Buat PROFILE object dari data admin */
      const profileExport = {
        name_line1: c.profile.name_line1,
        name_line2: c.profile.name_line2,
        cv_path: c.profile.cv_path,
        hero_photo: c.profile.hero_photo || '',
        about_photo: c.profile.about_photo || '',
        stats: c.profile.stats
      };
  
      const out = `/* ====================================================================
     DATA.JS — Di-generate otomatis dari Admin Dashboard.
     ==================================================================== */
  
  const PROFILE = ${JSON.stringify(profileExport, null, 2)};
  
  const CONTACT = ${JSON.stringify(c.contact, null, 2)};
  
  const EXPERIENCE = ${JSON.stringify(c.experience, null, 2)};
  
  const PROJECTS = ${JSON.stringify(c.projects, null, 2)};
  
  const CERTIFICATES = ${JSON.stringify(c.certificates, null, 2)};
  
  const SKILLS = ${JSON.stringify(c.skills, null, 2)};
  
  const I18N = ${JSON.stringify(c.profile.i18n, null, 2)};
  `;
      const blob = new Blob([out], { type: 'text/javascript' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'data.js'; a.click();
      URL.revokeObjectURL(url);
      showToast('data.js berhasil diunduh. Replace file lama di project kamu lalu git add, commit, dan push.');
    });
  
    document.getElementById('resetBtn').addEventListener('click', () => {
      if (confirm('Kembalikan semua konten ke data default (data.js)? Perubahan yang belum diunduh akan hilang.')) {
        localStorage.removeItem(STORAGE_KEY);
        showToast('Konten dikembalikan ke default.');
        renderAll();
        refreshStatus();
      }
    });
  
    /* refresh indikator setiap kali tab publish dibuka */
    document.querySelector('[data-panel="panel-publish"]').addEventListener('click', refreshStatus);
  }
  
  function initSettingsTab() {
    document.getElementById('changePassBtn').addEventListener('click', () => {
      const current = document.getElementById('f_current_pass').value;
      const next = document.getElementById('f_new_pass').value;
      const savedPass = localStorage.getItem(PASS_KEY) || DEFAULT_PASS;
      const msg = document.getElementById('passMsg');
      if (current !== savedPass) {
        msg.style.color = '#c0392b';
        msg.textContent = 'Password saat ini salah.';
        return;
      }
      if (!next || next.length < 4) {
        msg.style.color = '#c0392b';
        msg.textContent = 'Password baru minimal 4 karakter.';
        return;
      }
      localStorage.setItem(PASS_KEY, next);
      msg.style.color = '#2e7d32';
      msg.textContent = 'Password berhasil diganti.';
      document.getElementById('f_current_pass').value = '';
      document.getElementById('f_new_pass').value = '';
    });
  }
  
  function initTheme() {
    const root = document.documentElement;
    if (localStorage.getItem('theme') === 'dark') root.setAttribute('data-theme', 'dark');
  }
  
  function renderAll() {
    renderProfileTab();
    renderContactTab();
    wireListPanel('experience', EXPERIENCE_SCHEMA, 'Pengalaman', 'experienceList', 'addExperienceBtn', 'saveExperienceBtn');
    wireListPanel('projects', PROJECTS_SCHEMA, 'Project', 'projectsList', 'addProjectBtn', 'saveProjectsBtn');
    wireListPanel('certificates', CERTIFICATES_SCHEMA, 'Sertifikat', 'certificatesList', 'addCertificateBtn', 'saveCertificatesBtn');
    wireListPanel('skills', SKILLS_SCHEMA, 'Skill', 'skillsList', 'addSkillBtn', 'saveSkillsBtn');
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initLogin();
    initTabs();
    initPublishTab();
    initSettingsTab();
  });