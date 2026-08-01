
   const EMAILJS_CONFIG = {
    publicKey: 'ISI_PUBLIC_KEY_EMAILJS',
    serviceId: 'ISI_SERVICE_ID_EMAILJS',
    templateId: 'ISI_TEMPLATE_ID_EMAILJS'
  };
  
  const RESET_EMAIL = 'zikoadjie@gmail.com';
  const RESET_CODE_KEY = 'ras_reset_code';
  const RESET_CODE_TTL_MS = 10 * 60 * 1000; // 10 menit
  
  function generateResetCode() {
    return String(Math.floor(100000 + Math.random() * 900000));
  }
  
  function isEmailjsConfigured() {
    return typeof emailjs !== 'undefined'
      && EMAILJS_CONFIG.publicKey && EMAILJS_CONFIG.publicKey.indexOf('ISI_') !== 0
      && EMAILJS_CONFIG.serviceId && EMAILJS_CONFIG.serviceId.indexOf('ISI_') !== 0
      && EMAILJS_CONFIG.templateId && EMAILJS_CONFIG.templateId.indexOf('ISI_') !== 0;
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  
    if (isEmailjsConfigured()) {
      emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
    }
  
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const sendCodeBtn = document.getElementById('sendCodeBtn');
    const resendBtn = document.getElementById('resendBtn');
    const resetForm = document.getElementById('resetForm');
    const errorEl = document.getElementById('resetError');
    const successEl = document.getElementById('resetSuccess');
  
    function showError(msg) { errorEl.textContent = msg; successEl.textContent = ''; }
    function showSuccess(msg) { successEl.textContent = msg; errorEl.textContent = ''; }
  
    async function sendCode() {
      showError('');
      if (!isEmailjsConfigured()) {
        showError('Fitur kirim email belum dikonfigurasi. Isi EMAILJS_CONFIG di assets/js/lupa-password.js terlebih dahulu (lihat komentar di bagian atas file).');
        return;
      }
  
      const code = generateResetCode();
      sessionStorage.setItem(RESET_CODE_KEY, JSON.stringify({ code, expires: Date.now() + RESET_CODE_TTL_MS }));
  
      sendCodeBtn.disabled = true;
      const origHtml = sendCodeBtn.innerHTML;
      sendCodeBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mengirim...';
  
      try {
        await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, {
          to_email: RESET_EMAIL,
          code: code
        });
        step1.classList.remove('active');
        step2.classList.add('active');
        showSuccess('Kode berhasil dikirim ke ' + RESET_EMAIL + '. Cek inbox / folder spam.');
      } catch (e) {
        showError('Gagal mengirim email. Periksa kembali konfigurasi EmailJS dan koneksi internet.');
      } finally {
        sendCodeBtn.disabled = false;
        sendCodeBtn.innerHTML = origHtml;
      }
    }
  
    sendCodeBtn.addEventListener('click', sendCode);
    resendBtn.addEventListener('click', sendCode);
  
    resetForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showError('');
  
      const raw = sessionStorage.getItem(RESET_CODE_KEY);
      if (!raw) { showError('Kode tidak ditemukan. Kirim ulang kode terlebih dahulu.'); return; }
  
      let stored;
      try { stored = JSON.parse(raw); } catch (err) { stored = null; }
      if (!stored) { showError('Kode tidak valid. Kirim ulang kode.'); return; }
      if (Date.now() > stored.expires) { showError('Kode sudah kedaluwarsa. Kirim ulang kode.'); return; }
  
      const inputCode = document.getElementById('codeInput').value.trim();
      if (inputCode !== stored.code) { showError('Kode salah.'); return; }
  
      const newPass = document.getElementById('newPassInput').value;
      const confirmPass = document.getElementById('confirmPassInput').value;
      if (!newPass || newPass.length < 4) { showError('Password baru minimal 4 karakter.'); return; }
      if (newPass !== confirmPass) { showError('Konfirmasi password tidak cocok.'); return; }
  
      localStorage.setItem(PASS_KEY, newPass);
      sessionStorage.removeItem(RESET_CODE_KEY);
      showSuccess('Password berhasil direset. Mengalihkan ke halaman login...');
      setTimeout(() => { window.location.href = 'admin.html'; }, 1800);
    });
  });