/* =====================================================
   ADMIN DASHBOARD LOGIC
   Menyimpan semua perubahan ke localStorage dengan key
   yang SAMA dengan yang dibaca main.js ('ras_admin_content'),
   sehingga perubahan langsung terlihat saat website
   dibuka di browser yang sama.
===================================================== */

const STORAGE_KEY = 'ras_admin_content';
const PASS_KEY = 'ras_admin_pass';
const SESSION_KEY = 'ras_admin_session';
const DEFAULT_PASS = 'admin123';

/* ---------- default content (dari data.js) ---------- */
function getDefaults() {
  return {
    profile: {
      name_line1: "Rhiziqo Adjie",
      name_line2: "Syahputra",
      cv_path: "assets/CV - RHIZIQO ADJIE SYAHPUTRA.pdf",
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

function getRawOverride() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') || {};
  } catch (e) {
    return {};
  }
}

function getMerged() {
  const d = getDefaults();
  const s = getRawOverride();
  return {
    profile: {
      name_line1: (s.profile && s.profile.name_line1) || d.profile.name_line1,
      name_line2: (s.profile && s.profile.name_line2) || d.profile.name_line2,
      cv_path: (s.profile && s.profile.cv_path) || d.profile.cv_path,
      stats: Object.assign({}, d.profile.stats, (s.profile && s.profile.stats) || {}),
      i18n: {
        id: Object.assign({}, d.profile.i18n.id, (s.profile && s.profile.i18n && s.profile.i18n.id) || {}),
        en: Object.assign({}, d.profile.i18n.en, (s.profile && s.profile.i18n && s.profile.i18n.en) || {})
      }
    },
    contact: {
      email: (s.contact && s.contact.email) || d.contact.email,
      phone: (s.contact && s.contact.phone) || d.contact.phone,
      location: (s.contact && s.contact.location) || d.contact.location,
      social: Object.assign({}, d.contact.social, (s.contact && s.contact.social) || {})
    },
    experience: Array.isArray(s.experience) ? s.experience : d.experience,
    projects: Array.isArray(s.projects) ? s.projects : d.projects,
    certificates: Array.isArray(s.certificates) ? s.certificates : d.certificates,
    skills: Array.isArray(s.skills) ? s.skills : d.skills
  };
}

function saveSection(key, value) {
  const raw = getRawOverride();
  raw[key] = value;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(raw));
  showToast('Perubahan tersimpan di browser ini.');
}

/* ---------- toast ---------- */
let toastTimeout;
function showToast(msg) {
  const el = document.getElementById('adminToast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => el.classList.remove('show'), 2600);
}

/* =====================================================
   LOGIN
===================================================== */
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

/* =====================================================
   SIDEBAR TAB NAVIGATION
===================================================== */
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

/* =====================================================
   PROFILE & ABOUT TAB
===================================================== */
function renderProfileTab() {
  const c = getMerged();

  document.getElementById('f_name1').value = c.profile.name_line1;
  document.getElementById('f_name2').value = c.profile.name_line2;
  document.getElementById('f_cv').value = c.profile.cv_path;
  document.getElementById('f_stat_years').value = c.profile.stats.years;
  document.getElementById('f_stat_projects').value = c.profile.stats.projects;
  document.getElementById('f_stat_certs').value = c.profile.stats.certs;

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
    const raw = getRawOverride();
    const base = getMerged().profile;
    const newProfile = {
      name_line1: document.getElementById('f_name1').value.trim() || base.name_line1,
      name_line2: document.getElementById('f_name2').value.trim() || base.name_line2,
      cv_path: document.getElementById('f_cv').value.trim() || base.cv_path,
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
    saveSection('profile', newProfile);
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

/* =====================================================
   CONTACT TAB
===================================================== */
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
    saveSection('contact', newContact);
  };
}

/* =====================================================
   GENERIC REPEATABLE LIST (experience/projects/certificates/skills)
===================================================== */
function fieldHtml(sectionKey, idx, field, value) {
  const id = `${sectionKey}_${idx}_${field.key}`;
  if (field.type === 'textarea') {
    return `<div class="field"><label for="${id}">${field.label}</label>
      <textarea id="${id}" data-field="${field.key}" rows="3">${escapeHtml(value || '')}</textarea></div>`;
  }
  if (field.type === 'select') {
    const opts = field.options.map(o => `<option value="${o}" ${o === value ? 'selected' : ''}>${o}</option>`).join('');
    return `<div class="field"><label for="${id}">${field.label}</label>
      <select id="${id}" data-field="${field.key}">${opts}</select></div>`;
  }
  if (field.type === 'taglist') {
    const str = Array.isArray(value) ? value.join(', ') : (value || '');
    return `<div class="field"><label for="${id}">${field.label}</label>
      <input type="text" id="${id}" data-field="${field.key}" data-taglist="true" value="${escapeHtml(str)}" placeholder="${field.placeholder || ''}"></div>`;
  }
  return `<div class="field"><label for="${id}">${field.label}</label>
    <input type="text" id="${id}" data-field="${field.key}" value="${escapeHtml(value || '')}" placeholder="${field.placeholder || ''}"></div>`;
}

function escapeHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
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
      const input = card.querySelector(`[data-field="${f.key}"]`);
      if (!input) return;
      if (f.type === 'taglist') {
        obj[f.key] = input.value.split(',').map(s => s.trim()).filter(Boolean);
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
  }
  repaint();

  container.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-remove]');
    if (!btn) return;
    btn.closest('.item-card').remove();
    // relabel numbering only (visual), index attr no longer matters after collect
    container.querySelectorAll('.item-card').forEach((card, i) => {
      card.querySelector('.item-card-head span').textContent = `${labelName} #${i + 1}`;
    });
  });

  document.getElementById(addBtnId).addEventListener('click', () => {
    const blank = {};
    schema.forEach(f => { blank[f.key] = f.type === 'taglist' ? [] : ''; });
    const idx = container.querySelectorAll('.item-card').length;
    container.insertAdjacentHTML('beforeend', renderItemCard(sectionKey, idx, blank, schema, labelName));
  });

  document.getElementById(saveBtnId).addEventListener('click', () => {
    const list = collectItemCards(sectionKey, schema);
    saveSection(sectionKey, list);
    repaint();
  });
}

const EXPERIENCE_SCHEMA = [
  { key: 'year', label: 'Periode', type: 'text', placeholder: 'Aug 2023 - Des 2023' },
  { key: 'title', label: 'Perusahaan / Institusi', type: 'text' },
  { key: 'role', label: 'Posisi / Peran', type: 'text' },
  { key: 'desc', label: 'Deskripsi', type: 'textarea' },
  { key: 'tags', label: 'Tags (pisahkan dengan koma)', type: 'taglist' },
  { key: 'icon', label: 'Ikon Font Awesome', type: 'text', placeholder: 'fa-solid fa-briefcase' }
];

const PROJECTS_SCHEMA = [
  { key: 'title', label: 'Judul Project', type: 'text' },
  { key: 'category', label: 'Kategori', type: 'text', placeholder: 'web / design / dll' },
  { key: 'desc', label: 'Deskripsi', type: 'textarea' },
  { key: 'images', label: 'URL Gambar (pisahkan dengan koma)', type: 'taglist' },
  { key: 'tags', label: 'Tags (pisahkan dengan koma)', type: 'taglist' },
  { key: 'demo', label: 'Link Demo', type: 'text' },
  { key: 'code', label: 'Link Kode (GitHub)', type: 'text' }
];

const CERTIFICATES_SCHEMA = [
  { key: 'title', label: 'Judul Sertifikat', type: 'text' },
  { key: 'issuer', label: 'Penerbit', type: 'text' },
  { key: 'date', label: 'Tanggal', type: 'text' },
  { key: 'category', label: 'Kategori', type: 'text', placeholder: 'internship / training / certification' },
  { key: 'desc', label: 'Deskripsi', type: 'textarea' },
  { key: 'image', label: 'Path Gambar', type: 'text', placeholder: 'assets/img/certificates/nama.png' }
];

const SKILLS_SCHEMA = [
  { key: 'name', label: 'Nama Skill', type: 'text' },
  { key: 'icon', label: 'Ikon Font Awesome', type: 'text', placeholder: 'fa-brands fa-js' },
  { key: 'level', label: 'Level', type: 'select', options: ['beginner', 'intermediate', 'advanced', 'expert'] },
  { key: 'category', label: 'Kategori', type: 'select', options: ['programming', 'software'] },
  { key: 'color', label: 'Warna (hex)', type: 'text', placeholder: '#5fd17a' }
];

/* =====================================================
   PUBLISH TAB
===================================================== */
function initPublishTab() {
  document.getElementById('previewBtn').addEventListener('click', () => {
    window.open('index.html', '_blank');
  });

  document.getElementById('downloadDataJsBtn').addEventListener('click', () => {
    const c = getMerged();
    const out = `const EXPERIENCE = ${JSON.stringify(c.experience, null, 2)};

const PROJECTS = ${JSON.stringify(c.projects, null, 2)};

const CERTIFICATES = ${JSON.stringify(c.certificates, null, 2)};

const SKILLS = ${JSON.stringify(c.skills, null, 2)};

const I18N = ${JSON.stringify(c.profile.i18n, null, 2)};
`;
    const blob = new Blob([out], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.js';
    a.click();
    URL.revokeObjectURL(url);
    showToast('data.js berhasil diunduh.');
  });

  document.getElementById('resetBtn').addEventListener('click', () => {
    if (confirm('Kembalikan semua konten ke data default (data.js)? Perubahan yang belum diunduh akan hilang.')) {
      localStorage.removeItem(STORAGE_KEY);
      showToast('Konten dikembalikan ke default.');
      renderAll();
    }
  });
}

/* =====================================================
   SETTINGS TAB — ganti password
===================================================== */
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

/* =====================================================
   THEME (samakan dengan tema di halaman utama)
===================================================== */
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