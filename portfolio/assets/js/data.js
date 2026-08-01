const PROFILE = {
  name_line1: "Rhiziqo Adjie",
  name_line2: "Syahputra",
  cv_path: "assets/CV_RHIZIQO ADJIE SYAHPUTRA.pdf",
  hero_photo: "",
  about_photo: "",
  stats: { years: 1, projects: 6, certs: 6 }
};

/* -------- CONTACT -------- */
const CONTACT = {
  email: "zikoadjie@gmail.com",
  phone: "+62 812-4666-5782",
  location: "Indonesia",
  social: {
    linkedin: "https://linkedin.com/in/rhiziqoadjies",
    instagram: "https://instagram.com/zikoadjie_",
    github: "https://github.com/rhiziqoadjie"
  }
};

/* ---------------------- EXPERIENCE / EDUCATION ----------------------*/
const EXPERIENCE = [
  {
    year: "Aug 2023 - Des 2023",
    title: "PT. Sinergi Transformasi Digital",
    role: { id: "Secure Programming with DevSecOps", en: "Secure Programming with DevSecOps" },
    desc: {
      id: "Mengembangkan aplikasi microservices dengan Spring Boot, mengelola pipeline CI/CD, serta melakukan pengujian keamanan sistem dan kualitas kode.",
      en: "Developed microservices applications with Spring Boot, managed CI/CD pipelines, and performed system security and code quality testing."
    },
    tags: ["Microservices", "CI/CD Pipeline", "Kubernetes", "Docker"],
    icon: "fa-solid fa-shield-halved"
  },
  {
    year: "Feb 2024 - June 2024",
    title: "PT. Stechoq Robotika Indonesia",
    role: { id: "UI/UX Specialist Industry", en: "UI/UX Specialist Industry" },
    desc: {
      id: "Merancang UI/UX untuk aplikasi web, membuat wireframe dan prototipe, berkolaborasi dengan pengembang, dan memperbaiki desain berdasarkan umpan balik pengguna.",
      en: "Designed UI/UX for web applications, created wireframes and prototypes, collaborated with developers, and refined designs based on user feedback."
    },
    tags: ["Figma", "UI Design", "UX Design"],
    icon: "fa-solid fa-pen-ruler"
  },
  {
    year: "Maret 2025 - June 2025",
    title: "Business Intelligence Intern",
    role: { id: "PT Serasi Autoraya", en: "PT Serasi Autoraya" },
    desc: {
      id: "Menganalisis data menggunakan SQL, Excel, atau Power BI untuk membuat laporan yang mendukung pengambilan keputusan bisnis.",
      en: "Analyzed data using SQL, Excel, and Power BI to create reports that support business decision-making."
    },
    tags: ["Power BI", "SQL", "Excel"],
    icon: "fa-solid fa-chart-bar"
  },
  {
    year: "2024 - Sekarang",
    title: "Freelance Web Developer",
    role: { id: "Full-Stack Developer", en: "Full-Stack Developer" },
    desc: {
      id: "Membangun website company profile, landing page, dan aplikasi web untuk klien lokal maupun internasional menggunakan HTML, CSS, JavaScript, dan PHP.",
      en: "Built company profile websites, landing pages, and web applications for local and international clients using HTML, CSS, JavaScript, and PHP."
    },
    tags: ["PHP", "JavaScript", "MySQL"],
    icon: "fa-solid fa-laptop-code"
  },
  {
    year: "2021 - 2026",
    title: "Sarjana Informatika",
    role: "Universitas Pembangunan Nasional Veteran Jawa Timur",
    desc: {
      id: "Lulus dengan fokus pada pengembangan perangkat lunak, struktur data, dan rekayasa web. Aktif dalam organisasi dan beberapa proyek kompetisi.",
      en: "Graduated with a focus on software development, data structures, and web engineering. Actively involved in organizations and several competition projects."
    },
    tags: ["Software Engineering", "Data Structure"],
    icon: "fa-solid fa-graduation-cap"
  }
];

/* ------------------------------ PROJECTS -----------------------------*/
const PROJECTS = [
  {
    title: "Personal Website Rhiziqo Adjie Syahputra",
    category: "website",
    desc: {
      id: "Sebuah Personal Website Portfolio Rhiziqo Adjie Syahputra.",
      en: "A personal portfolio website for Rhiziqo Adjie Syahputra."
    },
    images: ["assets/img/projects/portfolio-rhiziqo/portfolio-rhiziqo (1).png","assets/img/projects/portfolio-rhiziqo/portfolio-rhiziqo (2).png","assets/img/projects/portfolio-rhiziqo/portfolio-rhiziqo (3).png"],
    tags: ["PHP", "HTML", "CSS", "Tailwind CSS", "Javascript"],
    demo: "https://rhiziqoadjies.vercel.app",
    code: "https://github.com/RhiziqoAdjie/portofolio-rhiziqoadjies"
  },
  {
    title: "Website SNBP SMAN 8 Surabaya",
    category: "website",
    desc: {
      id: "Platform Website untuk monitoring secara realtime Eligible SNBP pada SMAN 8 Surabaya.",
      en: "A website platform for real-time monitoring of SNBP eligibility at SMAN 8 Surabaya."
    },
    images: ["assets/img/projects/sman8/sman1 (1).png","assets/img/projects/sman8/sman1 (2).png","assets/img/projects/sman8/sman1 (3).png"],
    tags: ["PHP", "HTML", "MySQL", "JavaScript", "Codeigniter"],
    demo: "#",
    code: "#"
  },
  {
    title: "Portfolio Civil Engineer",
    category: "website",
    desc: {
      id: "Sebuah Personal Website Portfolio Civil Engineer.",
      en: "A personal portfolio website for a Civil Engineer."
    },
    images: ["assets/img/projects/portfolio-faiz/portfolio-faiz (1).png","assets/img/projects/portfolio-faiz/portfolio-faiz (2).png"],
    tags: ["PHP", "HTML", "CSS", "Tailwind CSS", "React", "Next Js"],
    demo: "https://faizardysyahputra.vercel.app",
    code: "https://github.com/RhiziqoAdjie/portfolio-faizardysyahputra"
  },
  {
    title: "U Music",
    category: "uiux",
    desc: {
      id: "Platform Musik dengan berbagai macam fitur yang modern untuk memudahkan pengguna.",
      en: "A music platform with a variety of modern features to make things easier for users."
    },
    images: ["assets/img/projects/umusic/umusic (1).png","assets/img/projects/umusic/umusic (2).png","assets/img/projects/umusic/umusic (3).png"],
    tags: ["Figma", "UI Design", "UX Experience"],
    demo: "#",
    code: "https://www.figma.com/design/RnDrGe3WP1lHwUYBjT4u0Y/UMusic?node-id=430-65"
  },
  {
    title: "Landing Page FAS Kontraktor",
    category: "website",
    desc: {
      id: "Desain dan implementasi landing page modern dengan animasi smooth scroll.",
      en: "Design and implementation of a modern landing page with smooth scroll animation."
    },
    images: ["assets/img/projects/project-3.jpg"],
    tags: ["HTML", "CSS", "JS"],
    demo: "#",
    code: "#"
  },
  {
    title: "Dashboard Analytics",
    category: "website",
    desc: {
      id: "Dashboard interaktif untuk visualisasi data penjualan secara real-time menggunakan grafik dinamis.",
      en: "An interactive dashboard for real-time sales data visualization using dynamic charts."
    },
    images: ["assets/img/projects/project-4.jpg"],
    tags: ["JavaScript", "Chart.js", "API"],
    demo: "#",
    code: "#"
  }
];

/* ---------------------------- CERTIFICATES ---------------------------*/
const CERTIFICATES = [
  {
    title: "Secure Programming With Devsecops",
    issuer: "PT Sinergi Transformasi Digital",
    date: "August 2023 - Des 2023",
    category: "internship",
    desc: {
      id: "Program magang mengembangkan aplikasi microservices dengan praktik keamanan dan pipeline CI/CD.",
      en: "Internship program developing microservices applications with security practices and CI/CD pipelines."
    },
    images: ["assets/img/certificates/metrodata.png"]
  },
  {
    title: "UI/UX Designer",
    issuer: "PT Stechoq Robotika Indonesia",
    date: "Feb 2024 - June 2024",
    category: "internship",
    desc: {
      id: "Program magang merancang UI/UX aplikasi web, mulai dari wireframe hingga prototipe interaktif.",
      en: "Internship program designing UI/UX for web applications, from wireframes to interactive prototypes."
    },
    images: ["assets/img/certificates/stechoq.png"]
  },
  {
    title: "Junior Web Programming",
    issuer: "Lembaga Sertifikasi Profesi (BNSP)",
    date: "2025",
    category: "certification",
    desc: {
      id: "Sertifikasi kompetensi Junior Web Programming dari BNSP.",
      en: "Junior Web Programming competency certification from BNSP."
    },
    images: ["assets/img/certificates/bnsp.png"]
  },
  {
    title: "Toefl ITP",
    issuer: "English Vit",
    date: "2026",
    category: "training",
    desc: {
      id: "Pelatihan dan sertifikasi TOEFL ITP untuk kompetensi bahasa Inggris.",
      en: "TOEFL ITP training and certification for English language proficiency."
    },
    images: ["assets/img/certificates/toefl.png"]
  },
  {
    title: "Business Intelligence",
    issuer: "PT. Serasi Autoraya",
    date: "3 Maret 2025 - 30 Juni 2025",
    category: "internship",
    desc: {
      id: "Program magang mengembangkan Data menggunakan Ms Power BI, Ms Excel, dan Spreadsheets.",
      en: "Internship program working with data using Ms Power BI, Ms Excel, and Spreadsheets."
    },
    images: ["assets/img/certificates/sera.png"]
  },
  {
    title: "Fundamental For Data Analysis",
    issuer: "Growth Hub",
    date: "13 Juli 2026",
    category: "certification",
    desc: {
      id: "Program pelatihan data analysis menggunakan Ms Excel, Ms Power BI, Tableau, Python, serta SQL.",
      en: "Data analysis training program using Ms Excel, Ms Power BI, Tableau, Python, and SQL."
    },
    images: ["assets/img/certificates/growthub.png"]
  }
];

/* ------------------------------- SKILLS ------------------------------- */
const SKILLS = [
  { name: "HTML5",        icon: "fa-brands fa-html5",      level: "expert",       category: "programming", color: "#E34F26" },
  { name: "CSS3",         icon: "fa-brands fa-css3-alt",    level: "expert",       category: "programming", color: "#1572B6" },
  { name: "JavaScript",   icon: "fa-brands fa-js",          level: "advanced",     category: "programming", color: "#F0DB4F" },
  { name: "PHP",          icon: "fa-brands fa-php",         level: "advanced",     category: "programming", color: "#777BB4" },
  { name: "React Js",     icon: "fa-brands fa-react",       level: "intermediate", category: "programming", color: "#61DAFB" },
  { name: "Laravel",      icon: "fa-solid fa-layer-group",  level: "intermediate", category: "programming", color: "#FF2D20" },
  { name: "MySQL",        icon: "fa-solid fa-database",     level: "advanced",     category: "programming", color: "#4479A1" },
  { name: "Python",       icon: "fa-brands fa-python",      level: "beginner",     category: "programming", color: "#3776AB" },
  { name: "TypeScript",   icon: "fa-solid fa-code",         level: "intermediate", category: "programming", color: "#3178C6" },
  { name: "Figma",        icon: "fa-brands fa-figma",       level: "advanced",     category: "software",    color: "#F24E1E" },
  { name: "VS Code",      icon: "fa-solid fa-laptop-code",  level: "expert",       category: "software",    color: "#007ACC" },
  { name: "Git & GitHub", icon: "fa-brands fa-git-alt",     level: "advanced",     category: "software",    color: "#F05032" },
  { name: "Adobe XD",     icon: "fa-brands fa-adobe",       level: "intermediate", category: "software",    color: "#FF61F6" },
  { name: "Docker",       icon: "fa-brands fa-docker",      level: "intermediate", category: "software",    color: "#2496ED" }
];

const I18N = {
  id: {
    /* --- navbar --- */
    nav_home: "Home", nav_about: "About", nav_experience: "Experience",
    nav_projects: "Projects", nav_certificate: "Certificate", nav_contact: "Contact",
    /* --- hero --- */
    hero_greeting: "Halo, saya",
    hero_we: "Saya adalah seorang",
    hero_desc: "Lulusan S1 Informatika UPN Veteran Jawa Timur dengan predikat sangat memuaskan, memiliki ketertarikan pada Analisis Data & Pengembangan Web.",
    hero_btn_project: "Lihat Project",
    hero_btn_contact: "Hubungi Saya",
    /* --- about --- */
    about_eyebrow: "Kenali Saya",
    about_title: "Tentang Saya",
    about_stat1: "Tahun Belajar",
    about_stat2: "Project Selesai",
    about_stat3: "Sertifikat",
    about_p1: "Seorang individu yang energik di bidang Informatika, Pengembangan Web, Pengembangan Frontend, Pengembangan Backend, Desain UI/UX, Analisis Data, dan Analisis Sistem dengan kemampuan yang baik dalam menggunakan berbagai bahasa pemrograman dan alat seperti Python, Java, JavaScript, PHP, SQL, MySQL, PostgreSQL, React, Laravel, Tableau, Power BI, Figma, dan GitHub. Selama studi akademis dan pengalaman kerja, saya telah mengembangkan keterampilan dalam pengembangan web, analisis dan visualisasi data, manajemen basis data, dan pembuatan antarmuka yang responsif dan ramah pengguna. Memiliki kemampuan komunikasi yang baik, manajemen tugas dan proyek, serta mampu bekerja dalam tim. Menantikan setiap tantangan dan peluang untuk terus belajar dan berkembang.",
    about_btn_cv: "Unduh CV",
    /* --- skills --- */
    skills_eyebrow: "Kemampuan",
    skills_title: "Tech Stack & Software",
    filter_all: "Semua",
    filter_programming: "Programming",
    filter_software: "Software",
    level_beginner: "Beginner",
    level_intermediate: "Intermediate",
    level_advanced: "Advanced",
    level_expert: "Expert",
    /* --- experience --- */
    exp_eyebrow: "Perjalanan",
    exp_title: "Experience & Education",
    /* --- projects --- */
    proj_eyebrow: "Karya Saya",
    proj_title: "Projects",
    proj_filter_all: "Semua",
    proj_link_demo: "Demo",
    proj_link_code: "Kode",
    proj_cat_website: "Website",
    proj_cat_uiux: "Desain UI/UX",
    /* --- certificate --- */
    cert_eyebrow: "Pencapaian",
    cert_title: "Certificate",
    cert_filter_all: "Semua Sertifikat",
    cert_filter_internship: "Internship",
    cert_filter_training: "Training",
    cert_filter_certification: "Sertifikasi",
    /* --- contact --- */
    contact_eyebrow: "Mari Terhubung",
    contact_title: "Hubungi Saya",
    contact_desc: "Punya project atau ide menarik? Jangan ragu untuk menghubungi saya, saya selalu terbuka untuk diskusi maupun peluang kolaborasi baru.",
    contact_label_email: "Email",
    contact_label_phone: "No. Telepon",
    contact_label_location: "Lokasi",
    /* --- form --- */
    form_name: "Nama Anda",
    form_email: "Email Anda",
    form_subject: "Subjek",
    form_message: "Pesan Anda",
    form_submit: "Kirim Pesan",
    form_sending: "Mengirim...",
    form_success: "Pesan berhasil terkirim. Terima kasih!",
    form_error: "Terjadi kesalahan, coba lagi nanti.",
    form_not_connected: "Form belum terhubung ke layanan email.",
    /* --- footer --- */
    footer_rights: "Seluruh hak cipta dilindungi.",
    /* --- typed roles --- */
    typed_roles: ["Web Development", "Data Analyst", "UI/UX Designer"]
  },
  en: {
    /* --- navbar --- */
    nav_home: "Home", nav_about: "About", nav_experience: "Experience",
    nav_projects: "Projects", nav_certificate: "Certificate", nav_contact: "Contact",
    /* --- hero --- */
    hero_greeting: "Hello, I'm",
    hero_we: "I am a",
    hero_desc: "A Bachelor of Informatics graduate from UPN Veteran East Java with a very good grade, with an interest in Data Analysis and Web Development.",
    hero_btn_project: "View Projects",
    hero_btn_contact: "Contact Me",
    /* --- about --- */
    about_eyebrow: "Get To Know Me",
    about_title: "About Me",
    about_stat1: "Years Learning",
    about_stat2: "Projects Done",
    about_stat3: "Certificates",
    about_p1: "An energetic individual in the field of Informatics, Web Development, Frontend Development, Backend Development, UI/UX Design, Data Analytics, and System Analysis with good ability to utilize various programming languages and tools such as Python, Java, JavaScript, PHP, SQL, MySQL, PostgreSQL, React, Laravel, Tableau, Power BI, Figma and GitHub. During academic studies and work experiences, I have developed skills in web development, data analysis and visualization, database management, and creating responsive and user-friendly interfaces. Great communication, task and project management, and also a team-player. Looking forward to any challenges and opportunities to constantly learn and grow.",
    about_btn_cv: "Download CV",
    /* --- skills --- */
    skills_eyebrow: "Capabilities",
    skills_title: "Tech Stack & Software",
    filter_all: "All",
    filter_programming: "Programming",
    filter_software: "Software",
    level_beginner: "Beginner",
    level_intermediate: "Intermediate",
    level_advanced: "Advanced",
    level_expert: "Expert",
    /* --- experience --- */
    exp_eyebrow: "My Journey",
    exp_title: "Experience & Education",
    /* --- projects --- */
    proj_eyebrow: "My Work",
    proj_title: "Projects",
    proj_filter_all: "All",
    proj_link_demo: "Demo",
    proj_link_code: "Code",
    proj_cat_website: "Website",
    proj_cat_uiux: "UI/UX Design",
    /* --- certificate --- */
    cert_eyebrow: "Achievements",
    cert_title: "Certificate",
    cert_filter_all: "All Certificates",
    cert_filter_internship: "Internship",
    cert_filter_training: "Training",
    cert_filter_certification: "Certification",
    /* --- contact --- */
    contact_eyebrow: "Let's Connect",
    contact_title: "Contact Me",
    contact_desc: "Have a project or an interesting idea? Feel free to reach out — I'm always open to discussion and new collaboration opportunities.",
    contact_label_email: "Email",
    contact_label_phone: "Phone Number",
    contact_label_location: "Location",
    /* --- form --- */
    form_name: "Your Name",
    form_email: "Your Email",
    form_subject: "Subject",
    form_message: "Your Message",
    form_submit: "Send Message",
    form_sending: "Sending...",
    form_success: "Message sent successfully. Thank you!",
    form_error: "An error occurred, please try again later.",
    form_not_connected: "Form is not connected to email service.",
    /* --- footer --- */
    footer_rights: "All rights reserved.",
    /* --- typed roles --- */
    typed_roles: ["Web Development", "Data Analyst", "UI/UX Designer"]
  }
};