   const STORAGE_KEY = 'ras_admin_content';
   const PASS_KEY = 'ras_admin_pass';
   const SESSION_KEY = 'ras_admin_session';
   const DEFAULT_PASS = 'admin123';
   
   function getDefaults() {
     const p = (typeof PROFILE !== 'undefined') ? PROFILE : {};
     const c = (typeof CONTACT !== 'undefined') ? CONTACT : {};
     return {
       profile: {
         name_line1: p.name_line1 || "Rhiziqo Adjie",
         name_line2: p.name_line2 || "Syahputra",
         cv_path: p.cv_path || "assets/CV_RHIZIQO ADJIE SYAHPUTRA.pdf",
         hero_photo: p.hero_photo || "",
         about_photo: p.about_photo || "",
         stats: p.stats || { years: 3, projects: 12, certs: 8 },
         i18n: {
           id: { ...(typeof I18N !== 'undefined' ? I18N.id : {}) },
           en: { ...(typeof I18N !== 'undefined' ? I18N.en : {}) }
         }
       },
       contact: {
         email: c.email || "zikoadjie@gmail.com",
         phone: c.phone || "+62 812-4666-5782",
         location: c.location || "Indonesia",
         social: {
           linkedin: (c.social && c.social.linkedin) || "https://linkedin.com/in/rhiziqoadjies",
           instagram: (c.social && c.social.instagram) || "https://instagram.com/zikoadjie_",
           github: (c.social && c.social.github) || "https://github.com/rhiziqoadjie"
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
   
   /* Menggabungkan default (data.js) dengan override tersimpan (localStorage).
      Dipakai oleh admin.js (untuk mengisi form) DAN main.js (untuk render
      halaman utama), sehingga keduanya selalu konsisten. */
   function getMerged() {
     const d = getDefaults();
     const s = getRawOverride();
     return {
       profile: {
         name_line1: (s.profile && s.profile.name_line1) || d.profile.name_line1,
         name_line2: (s.profile && s.profile.name_line2) || d.profile.name_line2,
         cv_path: (s.profile && s.profile.cv_path) || d.profile.cv_path,
         hero_photo: (s.profile && s.profile.hero_photo) || d.profile.hero_photo,
         about_photo: (s.profile && s.profile.about_photo) || d.profile.about_photo,
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
     try {
       const raw = getRawOverride();
       raw[key] = value;
       localStorage.setItem(STORAGE_KEY, JSON.stringify(raw));
       return true;
     } catch (e) {
       return false;
     }
   }
   
   /* Dipakai di tab Publish untuk mengingatkan admin kalau masih ada
      perubahan yang belum diunduh ke data.js */
   function hasUnpublishedChanges() {
     return Object.keys(getRawOverride()).length > 0;
   }