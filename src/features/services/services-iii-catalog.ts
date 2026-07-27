export type ServicesThreeCatalogLevel = {
  code: "ESSENTIAL" | "ADVANCED" | "PREMIUM";
  title: string;
  summary: string;
  indicators: string[];
  escalationSignals: string[];
  startingPrice: string | null;
  sortOrder: number;
};

export type ServicesThreeCatalogService = {
  sourceCategory: string;
  typeSlug: string;
  category: string;
  title: string;
  slug: string;
  matchSlugs: string[];
  summary: string;
  description: string;
  startingPrice: string | null;
  deliveryEstimate: string | null;
  revisionGuidance: string | null;
  deliverables: string[];
  technologies: string[];
  searchAliases: string[];
  levels: ServicesThreeCatalogLevel[];
};

// Draft-only authoring preset derived from RRS_TOP_3_SERVICES_COMPLEXITY_COPY.md.
// It must be imported explicitly by an Owner and never publishes services or levels.
export const servicesThreeCatalog: ServicesThreeCatalogService[] = [
  {
    "sourceCategory": "Backend & API Development",
    "typeSlug": "backend-system-services",
    "category": "Backend & System Services",
    "title": "REST API Development",
    "slug": "rest-api-development",
    "matchSlugs": [
      "api-development"
    ],
    "summary": "API terstruktur untuk menghubungkan aplikasi, dashboard, atau layanan eksternal.",
    "description": "API terstruktur untuk menghubungkan aplikasi, dashboard, atau layanan eksternal. Detail scope, deliverables, timeline, revisi, provider cost, dan harga final dikonfirmasi melalui discovery dan quotation Owner.",
    "startingPrice": "1500000",
    "deliveryEstimate": null,
    "revisionGuidance": "Ditetapkan melalui quotation",
    "deliverables": [
      "Scope yang disepakati melalui quotation",
      "Handoff sesuai kebutuhan project"
    ],
    "technologies": [
      "Discovery",
      "Implementation",
      "Technical handoff"
    ],
    "searchAliases": [
      "REST API Development",
      "Backend & API Development"
    ],
    "levels": [
      {
        "code": "ESSENTIAL",
        "title": "Essential",
        "summary": "Untuk kebutuhan awal rest api development dengan satu tujuan utama, alur terbatas, dan dependensi teknis yang masih sederhana.",
        "indicators": [
          "Satu workflow atau outcome utama",
          "Jumlah halaman, screen, endpoint, atau modul terbatas",
          "Data dan aturan bisnis masih sederhana",
          "Sedikit atau tanpa integrasi eksternal"
        ],
        "escalationSignals": [
          "Membutuhkan beberapa role atau approval",
          "Data harus tersinkron dengan sistem lain",
          "Scope mulai mencakup dashboard, laporan, atau automation",
          "Requirement belum cukup jelas untuk langsung dieksekusi"
        ],
        "startingPrice": "1500000",
        "sortOrder": 10
      },
      {
        "code": "ADVANCED",
        "title": "Advanced",
        "summary": "Untuk rest api development yang sudah melibatkan beberapa workflow, data online, role dasar, atau integrasi terpilih.",
        "indicators": [
          "Beberapa halaman, screen, endpoint, atau modul saling terhubung",
          "Menggunakan database dan pengelolaan data aktif",
          "Memerlukan autentikasi, dashboard, atau role dasar",
          "Ada integrasi eksternal dengan alur yang terdefinisi"
        ],
        "escalationSignals": [
          "Role, approval, dan permission semakin kompleks",
          "Membutuhkan real-time, payment, maps, hardware, atau multi-branch",
          "Ada migrasi data besar atau dependency sistem lama",
          "Target performa, security, atau availability lebih tinggi"
        ],
        "startingPrice": "3500000",
        "sortOrder": 20
      },
      {
        "code": "PREMIUM",
        "title": "Premium",
        "summary": "Untuk rest api development dengan workflow lintas peran, integrasi lanjutan, kebutuhan arsitektur khusus, atau risiko delivery yang lebih tinggi.",
        "indicators": [
          "Banyak modul dan workflow saling bergantung",
          "Multi-role dengan permission dan approval berlapis",
          "Integrasi lanjutan atau data lintas sistem",
          "Ada kebutuhan performa, keamanan, audit, atau skalabilitas"
        ],
        "escalationSignals": [
          "Scope perlu dibagi ke beberapa phase delivery",
          "Membutuhkan discovery atau technical assessment khusus",
          "Ada kewajiban compliance, data sensitif, atau provider dependency",
          "Estimasi tidak aman ditentukan sebelum validasi arsitektur"
        ],
        "startingPrice": "7500000",
        "sortOrder": 30
      }
    ]
  },
  {
    "sourceCategory": "Backend & API Development",
    "typeSlug": "backend-system-services",
    "category": "Backend & System Services",
    "title": "Third-Party API Integration",
    "slug": "third-party-api-integration",
    "matchSlugs": [
      "third-party-api-integration"
    ],
    "summary": "Integrasi layanan eksternal seperti payment, maps, messaging, shipping, atau analytics.",
    "description": "Integrasi layanan eksternal seperti payment, maps, messaging, shipping, atau analytics. Detail scope, deliverables, timeline, revisi, provider cost, dan harga final dikonfirmasi melalui discovery dan quotation Owner.",
    "startingPrice": "1000000",
    "deliveryEstimate": null,
    "revisionGuidance": "Ditetapkan melalui quotation",
    "deliverables": [
      "Scope yang disepakati melalui quotation",
      "Handoff sesuai kebutuhan project"
    ],
    "technologies": [
      "Discovery",
      "Implementation",
      "Technical handoff"
    ],
    "searchAliases": [
      "Third-Party API Integration",
      "Backend & API Development"
    ],
    "levels": [
      {
        "code": "ESSENTIAL",
        "title": "Essential",
        "summary": "Untuk kebutuhan awal third-party api integration dengan satu tujuan utama, alur terbatas, dan dependensi teknis yang masih sederhana.",
        "indicators": [
          "Satu workflow atau outcome utama",
          "Jumlah halaman, screen, endpoint, atau modul terbatas",
          "Data dan aturan bisnis masih sederhana",
          "Sedikit atau tanpa integrasi eksternal"
        ],
        "escalationSignals": [
          "Membutuhkan beberapa role atau approval",
          "Data harus tersinkron dengan sistem lain",
          "Scope mulai mencakup dashboard, laporan, atau automation",
          "Requirement belum cukup jelas untuk langsung dieksekusi"
        ],
        "startingPrice": "1000000",
        "sortOrder": 10
      },
      {
        "code": "ADVANCED",
        "title": "Advanced",
        "summary": "Untuk third-party api integration yang sudah melibatkan beberapa workflow, data online, role dasar, atau integrasi terpilih.",
        "indicators": [
          "Beberapa halaman, screen, endpoint, atau modul saling terhubung",
          "Menggunakan database dan pengelolaan data aktif",
          "Memerlukan autentikasi, dashboard, atau role dasar",
          "Ada integrasi eksternal dengan alur yang terdefinisi"
        ],
        "escalationSignals": [
          "Role, approval, dan permission semakin kompleks",
          "Membutuhkan real-time, payment, maps, hardware, atau multi-branch",
          "Ada migrasi data besar atau dependency sistem lama",
          "Target performa, security, atau availability lebih tinggi"
        ],
        "startingPrice": "3000000",
        "sortOrder": 20
      },
      {
        "code": "PREMIUM",
        "title": "Premium",
        "summary": "Untuk third-party api integration dengan workflow lintas peran, integrasi lanjutan, kebutuhan arsitektur khusus, atau risiko delivery yang lebih tinggi.",
        "indicators": [
          "Banyak modul dan workflow saling bergantung",
          "Multi-role dengan permission dan approval berlapis",
          "Integrasi lanjutan atau data lintas sistem",
          "Ada kebutuhan performa, keamanan, audit, atau skalabilitas"
        ],
        "escalationSignals": [
          "Scope perlu dibagi ke beberapa phase delivery",
          "Membutuhkan discovery atau technical assessment khusus",
          "Ada kewajiban compliance, data sensitif, atau provider dependency",
          "Estimasi tidak aman ditentukan sebelum validasi arsitektur"
        ],
        "startingPrice": "7000000",
        "sortOrder": 30
      }
    ]
  },
  {
    "sourceCategory": "Backend & API Development",
    "typeSlug": "backend-system-services",
    "category": "Backend & System Services",
    "title": "Authentication & Authorization API",
    "slug": "authentication-and-authorization-api",
    "matchSlugs": [
      "authentication-system"
    ],
    "summary": "Sistem login, session, token, role, dan kontrol akses untuk aplikasi.",
    "description": "Sistem login, session, token, role, dan kontrol akses untuk aplikasi. Detail scope, deliverables, timeline, revisi, provider cost, dan harga final dikonfirmasi melalui discovery dan quotation Owner.",
    "startingPrice": "1500000",
    "deliveryEstimate": null,
    "revisionGuidance": "Ditetapkan melalui quotation",
    "deliverables": [
      "Scope yang disepakati melalui quotation",
      "Handoff sesuai kebutuhan project"
    ],
    "technologies": [
      "Discovery",
      "Implementation",
      "Technical handoff"
    ],
    "searchAliases": [
      "Authentication & Authorization API",
      "Backend & API Development"
    ],
    "levels": [
      {
        "code": "ESSENTIAL",
        "title": "Essential",
        "summary": "Untuk kebutuhan awal authentication & authorization api dengan satu tujuan utama, alur terbatas, dan dependensi teknis yang masih sederhana.",
        "indicators": [
          "Satu workflow atau outcome utama",
          "Jumlah halaman, screen, endpoint, atau modul terbatas",
          "Data dan aturan bisnis masih sederhana",
          "Sedikit atau tanpa integrasi eksternal"
        ],
        "escalationSignals": [
          "Membutuhkan beberapa role atau approval",
          "Data harus tersinkron dengan sistem lain",
          "Scope mulai mencakup dashboard, laporan, atau automation",
          "Requirement belum cukup jelas untuk langsung dieksekusi"
        ],
        "startingPrice": "1500000",
        "sortOrder": 10
      },
      {
        "code": "ADVANCED",
        "title": "Advanced",
        "summary": "Untuk authentication & authorization api yang sudah melibatkan beberapa workflow, data online, role dasar, atau integrasi terpilih.",
        "indicators": [
          "Beberapa halaman, screen, endpoint, atau modul saling terhubung",
          "Menggunakan database dan pengelolaan data aktif",
          "Memerlukan autentikasi, dashboard, atau role dasar",
          "Ada integrasi eksternal dengan alur yang terdefinisi"
        ],
        "escalationSignals": [
          "Role, approval, dan permission semakin kompleks",
          "Membutuhkan real-time, payment, maps, hardware, atau multi-branch",
          "Ada migrasi data besar atau dependency sistem lama",
          "Target performa, security, atau availability lebih tinggi"
        ],
        "startingPrice": "4000000",
        "sortOrder": 20
      },
      {
        "code": "PREMIUM",
        "title": "Premium",
        "summary": "Untuk authentication & authorization api dengan workflow lintas peran, integrasi lanjutan, kebutuhan arsitektur khusus, atau risiko delivery yang lebih tinggi.",
        "indicators": [
          "Banyak modul dan workflow saling bergantung",
          "Multi-role dengan permission dan approval berlapis",
          "Integrasi lanjutan atau data lintas sistem",
          "Ada kebutuhan performa, keamanan, audit, atau skalabilitas"
        ],
        "escalationSignals": [
          "Scope perlu dibagi ke beberapa phase delivery",
          "Membutuhkan discovery atau technical assessment khusus",
          "Ada kewajiban compliance, data sensitif, atau provider dependency",
          "Estimasi tidak aman ditentukan sebelum validasi arsitektur"
        ],
        "startingPrice": "8500000",
        "sortOrder": 30
      }
    ]
  },
  {
    "sourceCategory": "Custom Web Application",
    "typeSlug": "web-application-business-systems",
    "category": "Web Application & Business Systems",
    "title": "Internal Operations Web App",
    "slug": "internal-operations-web-app",
    "matchSlugs": [
      "web-application"
    ],
    "summary": "Aplikasi internal untuk menggantikan proses manual, spreadsheet, atau workflow terpisah.",
    "description": "Aplikasi internal untuk menggantikan proses manual, spreadsheet, atau workflow terpisah. Detail scope, deliverables, timeline, revisi, provider cost, dan harga final dikonfirmasi melalui discovery dan quotation Owner.",
    "startingPrice": "3500000",
    "deliveryEstimate": null,
    "revisionGuidance": "Ditetapkan melalui quotation",
    "deliverables": [
      "Scope yang disepakati melalui quotation",
      "Handoff sesuai kebutuhan project"
    ],
    "technologies": [
      "Discovery",
      "Implementation",
      "Technical handoff"
    ],
    "searchAliases": [
      "Internal Operations Web App",
      "Custom Web Application"
    ],
    "levels": [
      {
        "code": "ESSENTIAL",
        "title": "Essential",
        "summary": "Untuk kebutuhan awal internal operations web app dengan satu tujuan utama, alur terbatas, dan dependensi teknis yang masih sederhana.",
        "indicators": [
          "Satu workflow atau outcome utama",
          "Jumlah halaman, screen, endpoint, atau modul terbatas",
          "Data dan aturan bisnis masih sederhana",
          "Sedikit atau tanpa integrasi eksternal"
        ],
        "escalationSignals": [
          "Membutuhkan beberapa role atau approval",
          "Data harus tersinkron dengan sistem lain",
          "Scope mulai mencakup dashboard, laporan, atau automation",
          "Requirement belum cukup jelas untuk langsung dieksekusi"
        ],
        "startingPrice": "3500000",
        "sortOrder": 10
      },
      {
        "code": "ADVANCED",
        "title": "Advanced",
        "summary": "Untuk internal operations web app yang sudah melibatkan beberapa workflow, data online, role dasar, atau integrasi terpilih.",
        "indicators": [
          "Beberapa halaman, screen, endpoint, atau modul saling terhubung",
          "Menggunakan database dan pengelolaan data aktif",
          "Memerlukan autentikasi, dashboard, atau role dasar",
          "Ada integrasi eksternal dengan alur yang terdefinisi"
        ],
        "escalationSignals": [
          "Role, approval, dan permission semakin kompleks",
          "Membutuhkan real-time, payment, maps, hardware, atau multi-branch",
          "Ada migrasi data besar atau dependency sistem lama",
          "Target performa, security, atau availability lebih tinggi"
        ],
        "startingPrice": "8000000",
        "sortOrder": 20
      },
      {
        "code": "PREMIUM",
        "title": "Premium",
        "summary": "Untuk internal operations web app dengan workflow lintas peran, integrasi lanjutan, kebutuhan arsitektur khusus, atau risiko delivery yang lebih tinggi.",
        "indicators": [
          "Banyak modul dan workflow saling bergantung",
          "Multi-role dengan permission dan approval berlapis",
          "Integrasi lanjutan atau data lintas sistem",
          "Ada kebutuhan performa, keamanan, audit, atau skalabilitas"
        ],
        "escalationSignals": [
          "Scope perlu dibagi ke beberapa phase delivery",
          "Membutuhkan discovery atau technical assessment khusus",
          "Ada kewajiban compliance, data sensitif, atau provider dependency",
          "Estimasi tidak aman ditentukan sebelum validasi arsitektur"
        ],
        "startingPrice": "18000000",
        "sortOrder": 30
      }
    ]
  },
  {
    "sourceCategory": "Custom Web Application",
    "typeSlug": "web-application-business-systems",
    "category": "Web Application & Business Systems",
    "title": "Client & Member Portal",
    "slug": "client-and-member-portal",
    "matchSlugs": [],
    "summary": "Portal khusus untuk akses data, dokumen, status, layanan, atau aktivitas pengguna.",
    "description": "Portal khusus untuk akses data, dokumen, status, layanan, atau aktivitas pengguna. Detail scope, deliverables, timeline, revisi, provider cost, dan harga final dikonfirmasi melalui discovery dan quotation Owner.",
    "startingPrice": "4000000",
    "deliveryEstimate": null,
    "revisionGuidance": "Ditetapkan melalui quotation",
    "deliverables": [
      "Scope yang disepakati melalui quotation",
      "Handoff sesuai kebutuhan project"
    ],
    "technologies": [
      "Discovery",
      "Implementation",
      "Technical handoff"
    ],
    "searchAliases": [
      "Client & Member Portal",
      "Custom Web Application"
    ],
    "levels": [
      {
        "code": "ESSENTIAL",
        "title": "Essential",
        "summary": "Untuk kebutuhan awal client & member portal dengan satu tujuan utama, alur terbatas, dan dependensi teknis yang masih sederhana.",
        "indicators": [
          "Satu workflow atau outcome utama",
          "Jumlah halaman, screen, endpoint, atau modul terbatas",
          "Data dan aturan bisnis masih sederhana",
          "Sedikit atau tanpa integrasi eksternal"
        ],
        "escalationSignals": [
          "Membutuhkan beberapa role atau approval",
          "Data harus tersinkron dengan sistem lain",
          "Scope mulai mencakup dashboard, laporan, atau automation",
          "Requirement belum cukup jelas untuk langsung dieksekusi"
        ],
        "startingPrice": "4000000",
        "sortOrder": 10
      },
      {
        "code": "ADVANCED",
        "title": "Advanced",
        "summary": "Untuk client & member portal yang sudah melibatkan beberapa workflow, data online, role dasar, atau integrasi terpilih.",
        "indicators": [
          "Beberapa halaman, screen, endpoint, atau modul saling terhubung",
          "Menggunakan database dan pengelolaan data aktif",
          "Memerlukan autentikasi, dashboard, atau role dasar",
          "Ada integrasi eksternal dengan alur yang terdefinisi"
        ],
        "escalationSignals": [
          "Role, approval, dan permission semakin kompleks",
          "Membutuhkan real-time, payment, maps, hardware, atau multi-branch",
          "Ada migrasi data besar atau dependency sistem lama",
          "Target performa, security, atau availability lebih tinggi"
        ],
        "startingPrice": "9000000",
        "sortOrder": 20
      },
      {
        "code": "PREMIUM",
        "title": "Premium",
        "summary": "Untuk client & member portal dengan workflow lintas peran, integrasi lanjutan, kebutuhan arsitektur khusus, atau risiko delivery yang lebih tinggi.",
        "indicators": [
          "Banyak modul dan workflow saling bergantung",
          "Multi-role dengan permission dan approval berlapis",
          "Integrasi lanjutan atau data lintas sistem",
          "Ada kebutuhan performa, keamanan, audit, atau skalabilitas"
        ],
        "escalationSignals": [
          "Scope perlu dibagi ke beberapa phase delivery",
          "Membutuhkan discovery atau technical assessment khusus",
          "Ada kewajiban compliance, data sensitif, atau provider dependency",
          "Estimasi tidak aman ditentukan sebelum validasi arsitektur"
        ],
        "startingPrice": "20000000",
        "sortOrder": 30
      }
    ]
  },
  {
    "sourceCategory": "Custom Web Application",
    "typeSlug": "web-application-business-systems",
    "category": "Web Application & Business Systems",
    "title": "SaaS MVP Development",
    "slug": "saas-mvp-development",
    "matchSlugs": [],
    "summary": "Versi awal produk SaaS untuk menguji workflow inti, pengguna, dan model bisnis.",
    "description": "Versi awal produk SaaS untuk menguji workflow inti, pengguna, dan model bisnis. Detail scope, deliverables, timeline, revisi, provider cost, dan harga final dikonfirmasi melalui discovery dan quotation Owner.",
    "startingPrice": "6000000",
    "deliveryEstimate": null,
    "revisionGuidance": "Ditetapkan melalui quotation",
    "deliverables": [
      "Scope yang disepakati melalui quotation",
      "Handoff sesuai kebutuhan project"
    ],
    "technologies": [
      "Discovery",
      "Implementation",
      "Technical handoff"
    ],
    "searchAliases": [
      "SaaS MVP Development",
      "Custom Web Application"
    ],
    "levels": [
      {
        "code": "ESSENTIAL",
        "title": "Essential",
        "summary": "Untuk kebutuhan awal saas mvp development dengan satu tujuan utama, alur terbatas, dan dependensi teknis yang masih sederhana.",
        "indicators": [
          "Satu workflow atau outcome utama",
          "Jumlah halaman, screen, endpoint, atau modul terbatas",
          "Data dan aturan bisnis masih sederhana",
          "Sedikit atau tanpa integrasi eksternal"
        ],
        "escalationSignals": [
          "Membutuhkan beberapa role atau approval",
          "Data harus tersinkron dengan sistem lain",
          "Scope mulai mencakup dashboard, laporan, atau automation",
          "Requirement belum cukup jelas untuk langsung dieksekusi"
        ],
        "startingPrice": "6000000",
        "sortOrder": 10
      },
      {
        "code": "ADVANCED",
        "title": "Advanced",
        "summary": "Untuk saas mvp development yang sudah melibatkan beberapa workflow, data online, role dasar, atau integrasi terpilih.",
        "indicators": [
          "Beberapa halaman, screen, endpoint, atau modul saling terhubung",
          "Menggunakan database dan pengelolaan data aktif",
          "Memerlukan autentikasi, dashboard, atau role dasar",
          "Ada integrasi eksternal dengan alur yang terdefinisi"
        ],
        "escalationSignals": [
          "Role, approval, dan permission semakin kompleks",
          "Membutuhkan real-time, payment, maps, hardware, atau multi-branch",
          "Ada migrasi data besar atau dependency sistem lama",
          "Target performa, security, atau availability lebih tinggi"
        ],
        "startingPrice": "15000000",
        "sortOrder": 20
      },
      {
        "code": "PREMIUM",
        "title": "Premium",
        "summary": "Untuk saas mvp development dengan workflow lintas peran, integrasi lanjutan, kebutuhan arsitektur khusus, atau risiko delivery yang lebih tinggi.",
        "indicators": [
          "Banyak modul dan workflow saling bergantung",
          "Multi-role dengan permission dan approval berlapis",
          "Integrasi lanjutan atau data lintas sistem",
          "Ada kebutuhan performa, keamanan, audit, atau skalabilitas"
        ],
        "escalationSignals": [
          "Scope perlu dibagi ke beberapa phase delivery",
          "Membutuhkan discovery atau technical assessment khusus",
          "Ada kewajiban compliance, data sensitif, atau provider dependency",
          "Estimasi tidak aman ditentukan sebelum validasi arsitektur"
        ],
        "startingPrice": "30000000",
        "sortOrder": 30
      }
    ]
  },
  {
    "sourceCategory": "Deployment & DevOps Setup",
    "typeSlug": "additional-technical-services",
    "category": "Additional Technical Services",
    "title": "Application Deployment Setup",
    "slug": "application-deployment-setup",
    "matchSlugs": [
      "hosting-deployment"
    ],
    "summary": "Menyiapkan aplikasi agar dapat dijalankan pada server atau platform hosting yang dipilih.",
    "description": "Menyiapkan aplikasi agar dapat dijalankan pada server atau platform hosting yang dipilih. Detail scope, deliverables, timeline, revisi, provider cost, dan harga final dikonfirmasi melalui discovery dan quotation Owner.",
    "startingPrice": "750000",
    "deliveryEstimate": null,
    "revisionGuidance": "Ditetapkan melalui quotation",
    "deliverables": [
      "Scope yang disepakati melalui quotation",
      "Handoff sesuai kebutuhan project"
    ],
    "technologies": [
      "Discovery",
      "Implementation",
      "Technical handoff"
    ],
    "searchAliases": [
      "Application Deployment Setup",
      "Deployment & DevOps Setup"
    ],
    "levels": [
      {
        "code": "ESSENTIAL",
        "title": "Essential",
        "summary": "Untuk kebutuhan awal application deployment setup dengan satu tujuan utama, alur terbatas, dan dependensi teknis yang masih sederhana.",
        "indicators": [
          "Satu workflow atau outcome utama",
          "Jumlah halaman, screen, endpoint, atau modul terbatas",
          "Data dan aturan bisnis masih sederhana",
          "Sedikit atau tanpa integrasi eksternal"
        ],
        "escalationSignals": [
          "Membutuhkan beberapa role atau approval",
          "Data harus tersinkron dengan sistem lain",
          "Scope mulai mencakup dashboard, laporan, atau automation",
          "Requirement belum cukup jelas untuk langsung dieksekusi"
        ],
        "startingPrice": "750000",
        "sortOrder": 10
      },
      {
        "code": "ADVANCED",
        "title": "Advanced",
        "summary": "Untuk application deployment setup yang sudah melibatkan beberapa workflow, data online, role dasar, atau integrasi terpilih.",
        "indicators": [
          "Beberapa halaman, screen, endpoint, atau modul saling terhubung",
          "Menggunakan database dan pengelolaan data aktif",
          "Memerlukan autentikasi, dashboard, atau role dasar",
          "Ada integrasi eksternal dengan alur yang terdefinisi"
        ],
        "escalationSignals": [
          "Role, approval, dan permission semakin kompleks",
          "Membutuhkan real-time, payment, maps, hardware, atau multi-branch",
          "Ada migrasi data besar atau dependency sistem lama",
          "Target performa, security, atau availability lebih tinggi"
        ],
        "startingPrice": "2000000",
        "sortOrder": 20
      },
      {
        "code": "PREMIUM",
        "title": "Premium",
        "summary": "Untuk application deployment setup dengan workflow lintas peran, integrasi lanjutan, kebutuhan arsitektur khusus, atau risiko delivery yang lebih tinggi.",
        "indicators": [
          "Banyak modul dan workflow saling bergantung",
          "Multi-role dengan permission dan approval berlapis",
          "Integrasi lanjutan atau data lintas sistem",
          "Ada kebutuhan performa, keamanan, audit, atau skalabilitas"
        ],
        "escalationSignals": [
          "Scope perlu dibagi ke beberapa phase delivery",
          "Membutuhkan discovery atau technical assessment khusus",
          "Ada kewajiban compliance, data sensitif, atau provider dependency",
          "Estimasi tidak aman ditentukan sebelum validasi arsitektur"
        ],
        "startingPrice": "5000000",
        "sortOrder": 30
      }
    ]
  },
  {
    "sourceCategory": "Deployment & DevOps Setup",
    "typeSlug": "additional-technical-services",
    "category": "Additional Technical Services",
    "title": "CI/CD Pipeline Setup",
    "slug": "ci-cd-pipeline-setup",
    "matchSlugs": [],
    "summary": "Otomasi build, test, dan deployment agar proses rilis lebih konsisten.",
    "description": "Otomasi build, test, dan deployment agar proses rilis lebih konsisten. Detail scope, deliverables, timeline, revisi, provider cost, dan harga final dikonfirmasi melalui discovery dan quotation Owner.",
    "startingPrice": "1500000",
    "deliveryEstimate": null,
    "revisionGuidance": "Ditetapkan melalui quotation",
    "deliverables": [
      "Scope yang disepakati melalui quotation",
      "Handoff sesuai kebutuhan project"
    ],
    "technologies": [
      "Discovery",
      "Implementation",
      "Technical handoff"
    ],
    "searchAliases": [
      "CI/CD Pipeline Setup",
      "Deployment & DevOps Setup"
    ],
    "levels": [
      {
        "code": "ESSENTIAL",
        "title": "Essential",
        "summary": "Untuk kebutuhan awal ci/cd pipeline setup dengan satu tujuan utama, alur terbatas, dan dependensi teknis yang masih sederhana.",
        "indicators": [
          "Satu workflow atau outcome utama",
          "Jumlah halaman, screen, endpoint, atau modul terbatas",
          "Data dan aturan bisnis masih sederhana",
          "Sedikit atau tanpa integrasi eksternal"
        ],
        "escalationSignals": [
          "Membutuhkan beberapa role atau approval",
          "Data harus tersinkron dengan sistem lain",
          "Scope mulai mencakup dashboard, laporan, atau automation",
          "Requirement belum cukup jelas untuk langsung dieksekusi"
        ],
        "startingPrice": "1500000",
        "sortOrder": 10
      },
      {
        "code": "ADVANCED",
        "title": "Advanced",
        "summary": "Untuk ci/cd pipeline setup yang sudah melibatkan beberapa workflow, data online, role dasar, atau integrasi terpilih.",
        "indicators": [
          "Beberapa halaman, screen, endpoint, atau modul saling terhubung",
          "Menggunakan database dan pengelolaan data aktif",
          "Memerlukan autentikasi, dashboard, atau role dasar",
          "Ada integrasi eksternal dengan alur yang terdefinisi"
        ],
        "escalationSignals": [
          "Role, approval, dan permission semakin kompleks",
          "Membutuhkan real-time, payment, maps, hardware, atau multi-branch",
          "Ada migrasi data besar atau dependency sistem lama",
          "Target performa, security, atau availability lebih tinggi"
        ],
        "startingPrice": "3500000",
        "sortOrder": 20
      },
      {
        "code": "PREMIUM",
        "title": "Premium",
        "summary": "Untuk ci/cd pipeline setup dengan workflow lintas peran, integrasi lanjutan, kebutuhan arsitektur khusus, atau risiko delivery yang lebih tinggi.",
        "indicators": [
          "Banyak modul dan workflow saling bergantung",
          "Multi-role dengan permission dan approval berlapis",
          "Integrasi lanjutan atau data lintas sistem",
          "Ada kebutuhan performa, keamanan, audit, atau skalabilitas"
        ],
        "escalationSignals": [
          "Scope perlu dibagi ke beberapa phase delivery",
          "Membutuhkan discovery atau technical assessment khusus",
          "Ada kewajiban compliance, data sensitif, atau provider dependency",
          "Estimasi tidak aman ditentukan sebelum validasi arsitektur"
        ],
        "startingPrice": "7500000",
        "sortOrder": 30
      }
    ]
  },
  {
    "sourceCategory": "Deployment & DevOps Setup",
    "typeSlug": "additional-technical-services",
    "category": "Additional Technical Services",
    "title": "Server, Domain & SSL Configuration",
    "slug": "server-domain-and-ssl-configuration",
    "matchSlugs": [
      "domain-setup"
    ],
    "summary": "Konfigurasi domain, DNS, SSL, reverse proxy, dan lingkungan server.",
    "description": "Konfigurasi domain, DNS, SSL, reverse proxy, dan lingkungan server. Detail scope, deliverables, timeline, revisi, provider cost, dan harga final dikonfirmasi melalui discovery dan quotation Owner.",
    "startingPrice": "750000",
    "deliveryEstimate": null,
    "revisionGuidance": "Ditetapkan melalui quotation",
    "deliverables": [
      "Scope yang disepakati melalui quotation",
      "Handoff sesuai kebutuhan project"
    ],
    "technologies": [
      "Discovery",
      "Implementation",
      "Technical handoff"
    ],
    "searchAliases": [
      "Server, Domain & SSL Configuration",
      "Deployment & DevOps Setup"
    ],
    "levels": [
      {
        "code": "ESSENTIAL",
        "title": "Essential",
        "summary": "Untuk kebutuhan awal server, domain & ssl configuration dengan satu tujuan utama, alur terbatas, dan dependensi teknis yang masih sederhana.",
        "indicators": [
          "Satu workflow atau outcome utama",
          "Jumlah halaman, screen, endpoint, atau modul terbatas",
          "Data dan aturan bisnis masih sederhana",
          "Sedikit atau tanpa integrasi eksternal"
        ],
        "escalationSignals": [
          "Membutuhkan beberapa role atau approval",
          "Data harus tersinkron dengan sistem lain",
          "Scope mulai mencakup dashboard, laporan, atau automation",
          "Requirement belum cukup jelas untuk langsung dieksekusi"
        ],
        "startingPrice": "750000",
        "sortOrder": 10
      },
      {
        "code": "ADVANCED",
        "title": "Advanced",
        "summary": "Untuk server, domain & ssl configuration yang sudah melibatkan beberapa workflow, data online, role dasar, atau integrasi terpilih.",
        "indicators": [
          "Beberapa halaman, screen, endpoint, atau modul saling terhubung",
          "Menggunakan database dan pengelolaan data aktif",
          "Memerlukan autentikasi, dashboard, atau role dasar",
          "Ada integrasi eksternal dengan alur yang terdefinisi"
        ],
        "escalationSignals": [
          "Role, approval, dan permission semakin kompleks",
          "Membutuhkan real-time, payment, maps, hardware, atau multi-branch",
          "Ada migrasi data besar atau dependency sistem lama",
          "Target performa, security, atau availability lebih tinggi"
        ],
        "startingPrice": "2000000",
        "sortOrder": 20
      },
      {
        "code": "PREMIUM",
        "title": "Premium",
        "summary": "Untuk server, domain & ssl configuration dengan workflow lintas peran, integrasi lanjutan, kebutuhan arsitektur khusus, atau risiko delivery yang lebih tinggi.",
        "indicators": [
          "Banyak modul dan workflow saling bergantung",
          "Multi-role dengan permission dan approval berlapis",
          "Integrasi lanjutan atau data lintas sistem",
          "Ada kebutuhan performa, keamanan, audit, atau skalabilitas"
        ],
        "escalationSignals": [
          "Scope perlu dibagi ke beberapa phase delivery",
          "Membutuhkan discovery atau technical assessment khusus",
          "Ada kewajiban compliance, data sensitif, atau provider dependency",
          "Estimasi tidak aman ditentukan sebelum validasi arsitektur"
        ],
        "startingPrice": "4500000",
        "sortOrder": 30
      }
    ]
  },
  {
    "sourceCategory": "UI Implementation",
    "typeSlug": "ui-ux-design",
    "category": "UI/UX Design",
    "title": "Landing Page UI Implementation",
    "slug": "landing-page-ui-implementation",
    "matchSlugs": [
      "landing-page-campaign"
    ],
    "summary": "Mengubah desain menjadi landing page responsif dan siap diintegrasikan.",
    "description": "Mengubah desain menjadi landing page responsif dan siap diintegrasikan. Detail scope, deliverables, timeline, revisi, provider cost, dan harga final dikonfirmasi melalui discovery dan quotation Owner.",
    "startingPrice": "1000000",
    "deliveryEstimate": null,
    "revisionGuidance": "Ditetapkan melalui quotation",
    "deliverables": [
      "Scope yang disepakati melalui quotation",
      "Handoff sesuai kebutuhan project"
    ],
    "technologies": [
      "Discovery",
      "Implementation",
      "Technical handoff"
    ],
    "searchAliases": [
      "Landing Page UI Implementation",
      "UI Implementation"
    ],
    "levels": [
      {
        "code": "ESSENTIAL",
        "title": "Essential",
        "summary": "Untuk kebutuhan awal landing page ui implementation dengan satu tujuan utama, alur terbatas, dan dependensi teknis yang masih sederhana.",
        "indicators": [
          "Satu workflow atau outcome utama",
          "Jumlah halaman, screen, endpoint, atau modul terbatas",
          "Data dan aturan bisnis masih sederhana",
          "Sedikit atau tanpa integrasi eksternal"
        ],
        "escalationSignals": [
          "Membutuhkan beberapa role atau approval",
          "Data harus tersinkron dengan sistem lain",
          "Scope mulai mencakup dashboard, laporan, atau automation",
          "Requirement belum cukup jelas untuk langsung dieksekusi"
        ],
        "startingPrice": "1000000",
        "sortOrder": 10
      },
      {
        "code": "ADVANCED",
        "title": "Advanced",
        "summary": "Untuk landing page ui implementation yang sudah melibatkan beberapa workflow, data online, role dasar, atau integrasi terpilih.",
        "indicators": [
          "Beberapa halaman, screen, endpoint, atau modul saling terhubung",
          "Menggunakan database dan pengelolaan data aktif",
          "Memerlukan autentikasi, dashboard, atau role dasar",
          "Ada integrasi eksternal dengan alur yang terdefinisi"
        ],
        "escalationSignals": [
          "Role, approval, dan permission semakin kompleks",
          "Membutuhkan real-time, payment, maps, hardware, atau multi-branch",
          "Ada migrasi data besar atau dependency sistem lama",
          "Target performa, security, atau availability lebih tinggi"
        ],
        "startingPrice": "2500000",
        "sortOrder": 20
      },
      {
        "code": "PREMIUM",
        "title": "Premium",
        "summary": "Untuk landing page ui implementation dengan workflow lintas peran, integrasi lanjutan, kebutuhan arsitektur khusus, atau risiko delivery yang lebih tinggi.",
        "indicators": [
          "Banyak modul dan workflow saling bergantung",
          "Multi-role dengan permission dan approval berlapis",
          "Integrasi lanjutan atau data lintas sistem",
          "Ada kebutuhan performa, keamanan, audit, atau skalabilitas"
        ],
        "escalationSignals": [
          "Scope perlu dibagi ke beberapa phase delivery",
          "Membutuhkan discovery atau technical assessment khusus",
          "Ada kewajiban compliance, data sensitif, atau provider dependency",
          "Estimasi tidak aman ditentukan sebelum validasi arsitektur"
        ],
        "startingPrice": "5000000",
        "sortOrder": 30
      }
    ]
  },
  {
    "sourceCategory": "UI Implementation",
    "typeSlug": "ui-ux-design",
    "category": "UI/UX Design",
    "title": "Multi-Page Website UI Implementation",
    "slug": "multi-page-website-ui-implementation",
    "matchSlugs": [],
    "summary": "Implementasi antarmuka beberapa halaman dengan komponen yang konsisten.",
    "description": "Implementasi antarmuka beberapa halaman dengan komponen yang konsisten. Detail scope, deliverables, timeline, revisi, provider cost, dan harga final dikonfirmasi melalui discovery dan quotation Owner.",
    "startingPrice": "2000000",
    "deliveryEstimate": null,
    "revisionGuidance": "Ditetapkan melalui quotation",
    "deliverables": [
      "Scope yang disepakati melalui quotation",
      "Handoff sesuai kebutuhan project"
    ],
    "technologies": [
      "Discovery",
      "Implementation",
      "Technical handoff"
    ],
    "searchAliases": [
      "Multi-Page Website UI Implementation",
      "UI Implementation"
    ],
    "levels": [
      {
        "code": "ESSENTIAL",
        "title": "Essential",
        "summary": "Untuk kebutuhan awal multi-page website ui implementation dengan satu tujuan utama, alur terbatas, dan dependensi teknis yang masih sederhana.",
        "indicators": [
          "Satu workflow atau outcome utama",
          "Jumlah halaman, screen, endpoint, atau modul terbatas",
          "Data dan aturan bisnis masih sederhana",
          "Sedikit atau tanpa integrasi eksternal"
        ],
        "escalationSignals": [
          "Membutuhkan beberapa role atau approval",
          "Data harus tersinkron dengan sistem lain",
          "Scope mulai mencakup dashboard, laporan, atau automation",
          "Requirement belum cukup jelas untuk langsung dieksekusi"
        ],
        "startingPrice": "2000000",
        "sortOrder": 10
      },
      {
        "code": "ADVANCED",
        "title": "Advanced",
        "summary": "Untuk multi-page website ui implementation yang sudah melibatkan beberapa workflow, data online, role dasar, atau integrasi terpilih.",
        "indicators": [
          "Beberapa halaman, screen, endpoint, atau modul saling terhubung",
          "Menggunakan database dan pengelolaan data aktif",
          "Memerlukan autentikasi, dashboard, atau role dasar",
          "Ada integrasi eksternal dengan alur yang terdefinisi"
        ],
        "escalationSignals": [
          "Role, approval, dan permission semakin kompleks",
          "Membutuhkan real-time, payment, maps, hardware, atau multi-branch",
          "Ada migrasi data besar atau dependency sistem lama",
          "Target performa, security, atau availability lebih tinggi"
        ],
        "startingPrice": "5000000",
        "sortOrder": 20
      },
      {
        "code": "PREMIUM",
        "title": "Premium",
        "summary": "Untuk multi-page website ui implementation dengan workflow lintas peran, integrasi lanjutan, kebutuhan arsitektur khusus, atau risiko delivery yang lebih tinggi.",
        "indicators": [
          "Banyak modul dan workflow saling bergantung",
          "Multi-role dengan permission dan approval berlapis",
          "Integrasi lanjutan atau data lintas sistem",
          "Ada kebutuhan performa, keamanan, audit, atau skalabilitas"
        ],
        "escalationSignals": [
          "Scope perlu dibagi ke beberapa phase delivery",
          "Membutuhkan discovery atau technical assessment khusus",
          "Ada kewajiban compliance, data sensitif, atau provider dependency",
          "Estimasi tidak aman ditentukan sebelum validasi arsitektur"
        ],
        "startingPrice": "10000000",
        "sortOrder": 30
      }
    ]
  },
  {
    "sourceCategory": "UI Implementation",
    "typeSlug": "ui-ux-design",
    "category": "UI/UX Design",
    "title": "Dashboard UI Implementation",
    "slug": "dashboard-ui-implementation",
    "matchSlugs": [],
    "summary": "Implementasi UI dashboard, tabel, form, state, dan visualisasi data.",
    "description": "Implementasi UI dashboard, tabel, form, state, dan visualisasi data. Detail scope, deliverables, timeline, revisi, provider cost, dan harga final dikonfirmasi melalui discovery dan quotation Owner.",
    "startingPrice": "2500000",
    "deliveryEstimate": null,
    "revisionGuidance": "Ditetapkan melalui quotation",
    "deliverables": [
      "Scope yang disepakati melalui quotation",
      "Handoff sesuai kebutuhan project"
    ],
    "technologies": [
      "Discovery",
      "Implementation",
      "Technical handoff"
    ],
    "searchAliases": [
      "Dashboard UI Implementation",
      "UI Implementation"
    ],
    "levels": [
      {
        "code": "ESSENTIAL",
        "title": "Essential",
        "summary": "Untuk kebutuhan awal dashboard ui implementation dengan satu tujuan utama, alur terbatas, dan dependensi teknis yang masih sederhana.",
        "indicators": [
          "Satu workflow atau outcome utama",
          "Jumlah halaman, screen, endpoint, atau modul terbatas",
          "Data dan aturan bisnis masih sederhana",
          "Sedikit atau tanpa integrasi eksternal"
        ],
        "escalationSignals": [
          "Membutuhkan beberapa role atau approval",
          "Data harus tersinkron dengan sistem lain",
          "Scope mulai mencakup dashboard, laporan, atau automation",
          "Requirement belum cukup jelas untuk langsung dieksekusi"
        ],
        "startingPrice": "2500000",
        "sortOrder": 10
      },
      {
        "code": "ADVANCED",
        "title": "Advanced",
        "summary": "Untuk dashboard ui implementation yang sudah melibatkan beberapa workflow, data online, role dasar, atau integrasi terpilih.",
        "indicators": [
          "Beberapa halaman, screen, endpoint, atau modul saling terhubung",
          "Menggunakan database dan pengelolaan data aktif",
          "Memerlukan autentikasi, dashboard, atau role dasar",
          "Ada integrasi eksternal dengan alur yang terdefinisi"
        ],
        "escalationSignals": [
          "Role, approval, dan permission semakin kompleks",
          "Membutuhkan real-time, payment, maps, hardware, atau multi-branch",
          "Ada migrasi data besar atau dependency sistem lama",
          "Target performa, security, atau availability lebih tinggi"
        ],
        "startingPrice": "6500000",
        "sortOrder": 20
      },
      {
        "code": "PREMIUM",
        "title": "Premium",
        "summary": "Untuk dashboard ui implementation dengan workflow lintas peran, integrasi lanjutan, kebutuhan arsitektur khusus, atau risiko delivery yang lebih tinggi.",
        "indicators": [
          "Banyak modul dan workflow saling bergantung",
          "Multi-role dengan permission dan approval berlapis",
          "Integrasi lanjutan atau data lintas sistem",
          "Ada kebutuhan performa, keamanan, audit, atau skalabilitas"
        ],
        "escalationSignals": [
          "Scope perlu dibagi ke beberapa phase delivery",
          "Membutuhkan discovery atau technical assessment khusus",
          "Ada kewajiban compliance, data sensitif, atau provider dependency",
          "Estimasi tidak aman ditentukan sebelum validasi arsitektur"
        ],
        "startingPrice": "14000000",
        "sortOrder": 30
      }
    ]
  },
  {
    "sourceCategory": "Website Development",
    "typeSlug": "website-development",
    "category": "Website Development",
    "title": "Company Profile Website",
    "slug": "company-profile-website",
    "matchSlugs": [],
    "summary": "Website profesional untuk memperkenalkan bisnis, layanan, kredibilitas, dan jalur kontak.",
    "description": "Website profesional untuk memperkenalkan bisnis, layanan, kredibilitas, dan jalur kontak. Detail scope, deliverables, timeline, revisi, provider cost, dan harga final dikonfirmasi melalui discovery dan quotation Owner.",
    "startingPrice": "2500000",
    "deliveryEstimate": null,
    "revisionGuidance": "Ditetapkan melalui quotation",
    "deliverables": [
      "Scope yang disepakati melalui quotation",
      "Handoff sesuai kebutuhan project"
    ],
    "technologies": [
      "Discovery",
      "Implementation",
      "Technical handoff"
    ],
    "searchAliases": [
      "Company Profile Website",
      "Website Development"
    ],
    "levels": [
      {
        "code": "ESSENTIAL",
        "title": "Essential",
        "summary": "Untuk kebutuhan awal company profile website dengan satu tujuan utama, alur terbatas, dan dependensi teknis yang masih sederhana.",
        "indicators": [
          "Satu workflow atau outcome utama",
          "Jumlah halaman, screen, endpoint, atau modul terbatas",
          "Data dan aturan bisnis masih sederhana",
          "Sedikit atau tanpa integrasi eksternal"
        ],
        "escalationSignals": [
          "Membutuhkan beberapa role atau approval",
          "Data harus tersinkron dengan sistem lain",
          "Scope mulai mencakup dashboard, laporan, atau automation",
          "Requirement belum cukup jelas untuk langsung dieksekusi"
        ],
        "startingPrice": "2500000",
        "sortOrder": 10
      },
      {
        "code": "ADVANCED",
        "title": "Advanced",
        "summary": "Untuk company profile website yang sudah melibatkan beberapa workflow, data online, role dasar, atau integrasi terpilih.",
        "indicators": [
          "Beberapa halaman, screen, endpoint, atau modul saling terhubung",
          "Menggunakan database dan pengelolaan data aktif",
          "Memerlukan autentikasi, dashboard, atau role dasar",
          "Ada integrasi eksternal dengan alur yang terdefinisi"
        ],
        "escalationSignals": [
          "Role, approval, dan permission semakin kompleks",
          "Membutuhkan real-time, payment, maps, hardware, atau multi-branch",
          "Ada migrasi data besar atau dependency sistem lama",
          "Target performa, security, atau availability lebih tinggi"
        ],
        "startingPrice": "5000000",
        "sortOrder": 20
      },
      {
        "code": "PREMIUM",
        "title": "Premium",
        "summary": "Untuk company profile website dengan workflow lintas peran, integrasi lanjutan, kebutuhan arsitektur khusus, atau risiko delivery yang lebih tinggi.",
        "indicators": [
          "Banyak modul dan workflow saling bergantung",
          "Multi-role dengan permission dan approval berlapis",
          "Integrasi lanjutan atau data lintas sistem",
          "Ada kebutuhan performa, keamanan, audit, atau skalabilitas"
        ],
        "escalationSignals": [
          "Scope perlu dibagi ke beberapa phase delivery",
          "Membutuhkan discovery atau technical assessment khusus",
          "Ada kewajiban compliance, data sensitif, atau provider dependency",
          "Estimasi tidak aman ditentukan sebelum validasi arsitektur"
        ],
        "startingPrice": "10000000",
        "sortOrder": 30
      }
    ]
  },
  {
    "sourceCategory": "Website Development",
    "typeSlug": "website-development",
    "category": "Website Development",
    "title": "E-Commerce Website",
    "slug": "e-commerce-website",
    "matchSlugs": [],
    "summary": "Website penjualan dengan katalog, keranjang, checkout, dan kebutuhan operasional toko.",
    "description": "Website penjualan dengan katalog, keranjang, checkout, dan kebutuhan operasional toko. Detail scope, deliverables, timeline, revisi, provider cost, dan harga final dikonfirmasi melalui discovery dan quotation Owner.",
    "startingPrice": "5000000",
    "deliveryEstimate": null,
    "revisionGuidance": "Ditetapkan melalui quotation",
    "deliverables": [
      "Scope yang disepakati melalui quotation",
      "Handoff sesuai kebutuhan project"
    ],
    "technologies": [
      "Discovery",
      "Implementation",
      "Technical handoff"
    ],
    "searchAliases": [
      "E-Commerce Website",
      "Website Development"
    ],
    "levels": [
      {
        "code": "ESSENTIAL",
        "title": "Essential",
        "summary": "Untuk kebutuhan awal e-commerce website dengan satu tujuan utama, alur terbatas, dan dependensi teknis yang masih sederhana.",
        "indicators": [
          "Satu workflow atau outcome utama",
          "Jumlah halaman, screen, endpoint, atau modul terbatas",
          "Data dan aturan bisnis masih sederhana",
          "Sedikit atau tanpa integrasi eksternal"
        ],
        "escalationSignals": [
          "Membutuhkan beberapa role atau approval",
          "Data harus tersinkron dengan sistem lain",
          "Scope mulai mencakup dashboard, laporan, atau automation",
          "Requirement belum cukup jelas untuk langsung dieksekusi"
        ],
        "startingPrice": "5000000",
        "sortOrder": 10
      },
      {
        "code": "ADVANCED",
        "title": "Advanced",
        "summary": "Untuk e-commerce website yang sudah melibatkan beberapa workflow, data online, role dasar, atau integrasi terpilih.",
        "indicators": [
          "Beberapa halaman, screen, endpoint, atau modul saling terhubung",
          "Menggunakan database dan pengelolaan data aktif",
          "Memerlukan autentikasi, dashboard, atau role dasar",
          "Ada integrasi eksternal dengan alur yang terdefinisi"
        ],
        "escalationSignals": [
          "Role, approval, dan permission semakin kompleks",
          "Membutuhkan real-time, payment, maps, hardware, atau multi-branch",
          "Ada migrasi data besar atau dependency sistem lama",
          "Target performa, security, atau availability lebih tinggi"
        ],
        "startingPrice": "12000000",
        "sortOrder": 20
      },
      {
        "code": "PREMIUM",
        "title": "Premium",
        "summary": "Untuk e-commerce website dengan workflow lintas peran, integrasi lanjutan, kebutuhan arsitektur khusus, atau risiko delivery yang lebih tinggi.",
        "indicators": [
          "Banyak modul dan workflow saling bergantung",
          "Multi-role dengan permission dan approval berlapis",
          "Integrasi lanjutan atau data lintas sistem",
          "Ada kebutuhan performa, keamanan, audit, atau skalabilitas"
        ],
        "escalationSignals": [
          "Scope perlu dibagi ke beberapa phase delivery",
          "Membutuhkan discovery atau technical assessment khusus",
          "Ada kewajiban compliance, data sensitif, atau provider dependency",
          "Estimasi tidak aman ditentukan sebelum validasi arsitektur"
        ],
        "startingPrice": "25000000",
        "sortOrder": 30
      }
    ]
  },
  {
    "sourceCategory": "Website Development",
    "typeSlug": "website-development",
    "category": "Website Development",
    "title": "Booking & Reservation Website",
    "slug": "booking-and-reservation-website",
    "matchSlugs": [],
    "summary": "Website untuk pemesanan jadwal, layanan, tempat, atau reservasi berbasis ketersediaan.",
    "description": "Website untuk pemesanan jadwal, layanan, tempat, atau reservasi berbasis ketersediaan. Detail scope, deliverables, timeline, revisi, provider cost, dan harga final dikonfirmasi melalui discovery dan quotation Owner.",
    "startingPrice": "4000000",
    "deliveryEstimate": null,
    "revisionGuidance": "Ditetapkan melalui quotation",
    "deliverables": [
      "Scope yang disepakati melalui quotation",
      "Handoff sesuai kebutuhan project"
    ],
    "technologies": [
      "Discovery",
      "Implementation",
      "Technical handoff"
    ],
    "searchAliases": [
      "Booking & Reservation Website",
      "Website Development"
    ],
    "levels": [
      {
        "code": "ESSENTIAL",
        "title": "Essential",
        "summary": "Untuk kebutuhan awal booking & reservation website dengan satu tujuan utama, alur terbatas, dan dependensi teknis yang masih sederhana.",
        "indicators": [
          "Satu workflow atau outcome utama",
          "Jumlah halaman, screen, endpoint, atau modul terbatas",
          "Data dan aturan bisnis masih sederhana",
          "Sedikit atau tanpa integrasi eksternal"
        ],
        "escalationSignals": [
          "Membutuhkan beberapa role atau approval",
          "Data harus tersinkron dengan sistem lain",
          "Scope mulai mencakup dashboard, laporan, atau automation",
          "Requirement belum cukup jelas untuk langsung dieksekusi"
        ],
        "startingPrice": "4000000",
        "sortOrder": 10
      },
      {
        "code": "ADVANCED",
        "title": "Advanced",
        "summary": "Untuk booking & reservation website yang sudah melibatkan beberapa workflow, data online, role dasar, atau integrasi terpilih.",
        "indicators": [
          "Beberapa halaman, screen, endpoint, atau modul saling terhubung",
          "Menggunakan database dan pengelolaan data aktif",
          "Memerlukan autentikasi, dashboard, atau role dasar",
          "Ada integrasi eksternal dengan alur yang terdefinisi"
        ],
        "escalationSignals": [
          "Role, approval, dan permission semakin kompleks",
          "Membutuhkan real-time, payment, maps, hardware, atau multi-branch",
          "Ada migrasi data besar atau dependency sistem lama",
          "Target performa, security, atau availability lebih tinggi"
        ],
        "startingPrice": "9000000",
        "sortOrder": 20
      },
      {
        "code": "PREMIUM",
        "title": "Premium",
        "summary": "Untuk booking & reservation website dengan workflow lintas peran, integrasi lanjutan, kebutuhan arsitektur khusus, atau risiko delivery yang lebih tinggi.",
        "indicators": [
          "Banyak modul dan workflow saling bergantung",
          "Multi-role dengan permission dan approval berlapis",
          "Integrasi lanjutan atau data lintas sistem",
          "Ada kebutuhan performa, keamanan, audit, atau skalabilitas"
        ],
        "escalationSignals": [
          "Scope perlu dibagi ke beberapa phase delivery",
          "Membutuhkan discovery atau technical assessment khusus",
          "Ada kewajiban compliance, data sensitif, atau provider dependency",
          "Estimasi tidak aman ditentukan sebelum validasi arsitektur"
        ],
        "startingPrice": "20000000",
        "sortOrder": 30
      }
    ]
  },
  {
    "sourceCategory": "Web Application & Business Systems",
    "typeSlug": "web-application-business-systems",
    "category": "Web Application & Business Systems",
    "title": "Admin Dashboard System",
    "slug": "admin-dashboard-system",
    "matchSlugs": [
      "operations-dashboard"
    ],
    "summary": "Dashboard untuk mengelola data, pengguna, laporan, dan aktivitas operasional.",
    "description": "Dashboard untuk mengelola data, pengguna, laporan, dan aktivitas operasional. Detail scope, deliverables, timeline, revisi, provider cost, dan harga final dikonfirmasi melalui discovery dan quotation Owner.",
    "startingPrice": "4000000",
    "deliveryEstimate": null,
    "revisionGuidance": "Ditetapkan melalui quotation",
    "deliverables": [
      "Scope yang disepakati melalui quotation",
      "Handoff sesuai kebutuhan project"
    ],
    "technologies": [
      "Discovery",
      "Implementation",
      "Technical handoff"
    ],
    "searchAliases": [
      "Admin Dashboard System",
      "Web Application & Business Systems"
    ],
    "levels": [
      {
        "code": "ESSENTIAL",
        "title": "Essential",
        "summary": "Untuk kebutuhan awal admin dashboard system dengan satu tujuan utama, alur terbatas, dan dependensi teknis yang masih sederhana.",
        "indicators": [
          "Satu workflow atau outcome utama",
          "Jumlah halaman, screen, endpoint, atau modul terbatas",
          "Data dan aturan bisnis masih sederhana",
          "Sedikit atau tanpa integrasi eksternal"
        ],
        "escalationSignals": [
          "Membutuhkan beberapa role atau approval",
          "Data harus tersinkron dengan sistem lain",
          "Scope mulai mencakup dashboard, laporan, atau automation",
          "Requirement belum cukup jelas untuk langsung dieksekusi"
        ],
        "startingPrice": "4000000",
        "sortOrder": 10
      },
      {
        "code": "ADVANCED",
        "title": "Advanced",
        "summary": "Untuk admin dashboard system yang sudah melibatkan beberapa workflow, data online, role dasar, atau integrasi terpilih.",
        "indicators": [
          "Beberapa halaman, screen, endpoint, atau modul saling terhubung",
          "Menggunakan database dan pengelolaan data aktif",
          "Memerlukan autentikasi, dashboard, atau role dasar",
          "Ada integrasi eksternal dengan alur yang terdefinisi"
        ],
        "escalationSignals": [
          "Role, approval, dan permission semakin kompleks",
          "Membutuhkan real-time, payment, maps, hardware, atau multi-branch",
          "Ada migrasi data besar atau dependency sistem lama",
          "Target performa, security, atau availability lebih tinggi"
        ],
        "startingPrice": "9000000",
        "sortOrder": 20
      },
      {
        "code": "PREMIUM",
        "title": "Premium",
        "summary": "Untuk admin dashboard system dengan workflow lintas peran, integrasi lanjutan, kebutuhan arsitektur khusus, atau risiko delivery yang lebih tinggi.",
        "indicators": [
          "Banyak modul dan workflow saling bergantung",
          "Multi-role dengan permission dan approval berlapis",
          "Integrasi lanjutan atau data lintas sistem",
          "Ada kebutuhan performa, keamanan, audit, atau skalabilitas"
        ],
        "escalationSignals": [
          "Scope perlu dibagi ke beberapa phase delivery",
          "Membutuhkan discovery atau technical assessment khusus",
          "Ada kewajiban compliance, data sensitif, atau provider dependency",
          "Estimasi tidak aman ditentukan sebelum validasi arsitektur"
        ],
        "startingPrice": "20000000",
        "sortOrder": 30
      }
    ]
  },
  {
    "sourceCategory": "Web Application & Business Systems",
    "typeSlug": "web-application-business-systems",
    "category": "Web Application & Business Systems",
    "title": "Inventory & Stock Management System",
    "slug": "inventory-and-stock-management-system",
    "matchSlugs": [
      "inventory-application"
    ],
    "summary": "Sistem untuk mencatat stok, transaksi barang, supplier, dan pergerakan inventaris.",
    "description": "Sistem untuk mencatat stok, transaksi barang, supplier, dan pergerakan inventaris. Detail scope, deliverables, timeline, revisi, provider cost, dan harga final dikonfirmasi melalui discovery dan quotation Owner.",
    "startingPrice": "5000000",
    "deliveryEstimate": null,
    "revisionGuidance": "Ditetapkan melalui quotation",
    "deliverables": [
      "Scope yang disepakati melalui quotation",
      "Handoff sesuai kebutuhan project"
    ],
    "technologies": [
      "Discovery",
      "Implementation",
      "Technical handoff"
    ],
    "searchAliases": [
      "Inventory & Stock Management System",
      "Web Application & Business Systems"
    ],
    "levels": [
      {
        "code": "ESSENTIAL",
        "title": "Essential",
        "summary": "Untuk kebutuhan awal inventory & stock management system dengan satu tujuan utama, alur terbatas, dan dependensi teknis yang masih sederhana.",
        "indicators": [
          "Satu workflow atau outcome utama",
          "Jumlah halaman, screen, endpoint, atau modul terbatas",
          "Data dan aturan bisnis masih sederhana",
          "Sedikit atau tanpa integrasi eksternal"
        ],
        "escalationSignals": [
          "Membutuhkan beberapa role atau approval",
          "Data harus tersinkron dengan sistem lain",
          "Scope mulai mencakup dashboard, laporan, atau automation",
          "Requirement belum cukup jelas untuk langsung dieksekusi"
        ],
        "startingPrice": "5000000",
        "sortOrder": 10
      },
      {
        "code": "ADVANCED",
        "title": "Advanced",
        "summary": "Untuk inventory & stock management system yang sudah melibatkan beberapa workflow, data online, role dasar, atau integrasi terpilih.",
        "indicators": [
          "Beberapa halaman, screen, endpoint, atau modul saling terhubung",
          "Menggunakan database dan pengelolaan data aktif",
          "Memerlukan autentikasi, dashboard, atau role dasar",
          "Ada integrasi eksternal dengan alur yang terdefinisi"
        ],
        "escalationSignals": [
          "Role, approval, dan permission semakin kompleks",
          "Membutuhkan real-time, payment, maps, hardware, atau multi-branch",
          "Ada migrasi data besar atau dependency sistem lama",
          "Target performa, security, atau availability lebih tinggi"
        ],
        "startingPrice": "12000000",
        "sortOrder": 20
      },
      {
        "code": "PREMIUM",
        "title": "Premium",
        "summary": "Untuk inventory & stock management system dengan workflow lintas peran, integrasi lanjutan, kebutuhan arsitektur khusus, atau risiko delivery yang lebih tinggi.",
        "indicators": [
          "Banyak modul dan workflow saling bergantung",
          "Multi-role dengan permission dan approval berlapis",
          "Integrasi lanjutan atau data lintas sistem",
          "Ada kebutuhan performa, keamanan, audit, atau skalabilitas"
        ],
        "escalationSignals": [
          "Scope perlu dibagi ke beberapa phase delivery",
          "Membutuhkan discovery atau technical assessment khusus",
          "Ada kewajiban compliance, data sensitif, atau provider dependency",
          "Estimasi tidak aman ditentukan sebelum validasi arsitektur"
        ],
        "startingPrice": "28000000",
        "sortOrder": 30
      }
    ]
  },
  {
    "sourceCategory": "Web Application & Business Systems",
    "typeSlug": "web-application-business-systems",
    "category": "Web Application & Business Systems",
    "title": "CRM & Sales Workflow System",
    "slug": "crm-and-sales-workflow-system",
    "matchSlugs": [],
    "summary": "Sistem untuk mengelola prospek, pelanggan, pipeline, aktivitas, dan tindak lanjut penjualan.",
    "description": "Sistem untuk mengelola prospek, pelanggan, pipeline, aktivitas, dan tindak lanjut penjualan. Detail scope, deliverables, timeline, revisi, provider cost, dan harga final dikonfirmasi melalui discovery dan quotation Owner.",
    "startingPrice": "6000000",
    "deliveryEstimate": null,
    "revisionGuidance": "Ditetapkan melalui quotation",
    "deliverables": [
      "Scope yang disepakati melalui quotation",
      "Handoff sesuai kebutuhan project"
    ],
    "technologies": [
      "Discovery",
      "Implementation",
      "Technical handoff"
    ],
    "searchAliases": [
      "CRM & Sales Workflow System",
      "Web Application & Business Systems"
    ],
    "levels": [
      {
        "code": "ESSENTIAL",
        "title": "Essential",
        "summary": "Untuk kebutuhan awal crm & sales workflow system dengan satu tujuan utama, alur terbatas, dan dependensi teknis yang masih sederhana.",
        "indicators": [
          "Satu workflow atau outcome utama",
          "Jumlah halaman, screen, endpoint, atau modul terbatas",
          "Data dan aturan bisnis masih sederhana",
          "Sedikit atau tanpa integrasi eksternal"
        ],
        "escalationSignals": [
          "Membutuhkan beberapa role atau approval",
          "Data harus tersinkron dengan sistem lain",
          "Scope mulai mencakup dashboard, laporan, atau automation",
          "Requirement belum cukup jelas untuk langsung dieksekusi"
        ],
        "startingPrice": "6000000",
        "sortOrder": 10
      },
      {
        "code": "ADVANCED",
        "title": "Advanced",
        "summary": "Untuk crm & sales workflow system yang sudah melibatkan beberapa workflow, data online, role dasar, atau integrasi terpilih.",
        "indicators": [
          "Beberapa halaman, screen, endpoint, atau modul saling terhubung",
          "Menggunakan database dan pengelolaan data aktif",
          "Memerlukan autentikasi, dashboard, atau role dasar",
          "Ada integrasi eksternal dengan alur yang terdefinisi"
        ],
        "escalationSignals": [
          "Role, approval, dan permission semakin kompleks",
          "Membutuhkan real-time, payment, maps, hardware, atau multi-branch",
          "Ada migrasi data besar atau dependency sistem lama",
          "Target performa, security, atau availability lebih tinggi"
        ],
        "startingPrice": "14000000",
        "sortOrder": 20
      },
      {
        "code": "PREMIUM",
        "title": "Premium",
        "summary": "Untuk crm & sales workflow system dengan workflow lintas peran, integrasi lanjutan, kebutuhan arsitektur khusus, atau risiko delivery yang lebih tinggi.",
        "indicators": [
          "Banyak modul dan workflow saling bergantung",
          "Multi-role dengan permission dan approval berlapis",
          "Integrasi lanjutan atau data lintas sistem",
          "Ada kebutuhan performa, keamanan, audit, atau skalabilitas"
        ],
        "escalationSignals": [
          "Scope perlu dibagi ke beberapa phase delivery",
          "Membutuhkan discovery atau technical assessment khusus",
          "Ada kewajiban compliance, data sensitif, atau provider dependency",
          "Estimasi tidak aman ditentukan sebelum validasi arsitektur"
        ],
        "startingPrice": "30000000",
        "sortOrder": 30
      }
    ]
  },
  {
    "sourceCategory": "Android Development",
    "typeSlug": "android-development",
    "category": "Android Development",
    "title": "Android Business Application",
    "slug": "android-business-application",
    "matchSlugs": [
      "android-business-application"
    ],
    "summary": "Aplikasi Android untuk kebutuhan operasional, layanan, atau workflow bisnis.",
    "description": "Aplikasi Android untuk kebutuhan operasional, layanan, atau workflow bisnis. Detail scope, deliverables, timeline, revisi, provider cost, dan harga final dikonfirmasi melalui discovery dan quotation Owner.",
    "startingPrice": "4000000",
    "deliveryEstimate": null,
    "revisionGuidance": "Ditetapkan melalui quotation",
    "deliverables": [
      "Scope yang disepakati melalui quotation",
      "Handoff sesuai kebutuhan project"
    ],
    "technologies": [
      "Discovery",
      "Implementation",
      "Technical handoff"
    ],
    "searchAliases": [
      "Android Business Application",
      "Android Development"
    ],
    "levels": [
      {
        "code": "ESSENTIAL",
        "title": "Essential",
        "summary": "Untuk kebutuhan awal android business application dengan satu tujuan utama, alur terbatas, dan dependensi teknis yang masih sederhana.",
        "indicators": [
          "Satu workflow atau outcome utama",
          "Jumlah halaman, screen, endpoint, atau modul terbatas",
          "Data dan aturan bisnis masih sederhana",
          "Sedikit atau tanpa integrasi eksternal"
        ],
        "escalationSignals": [
          "Membutuhkan beberapa role atau approval",
          "Data harus tersinkron dengan sistem lain",
          "Scope mulai mencakup dashboard, laporan, atau automation",
          "Requirement belum cukup jelas untuk langsung dieksekusi"
        ],
        "startingPrice": "4000000",
        "sortOrder": 10
      },
      {
        "code": "ADVANCED",
        "title": "Advanced",
        "summary": "Untuk android business application yang sudah melibatkan beberapa workflow, data online, role dasar, atau integrasi terpilih.",
        "indicators": [
          "Beberapa halaman, screen, endpoint, atau modul saling terhubung",
          "Menggunakan database dan pengelolaan data aktif",
          "Memerlukan autentikasi, dashboard, atau role dasar",
          "Ada integrasi eksternal dengan alur yang terdefinisi"
        ],
        "escalationSignals": [
          "Role, approval, dan permission semakin kompleks",
          "Membutuhkan real-time, payment, maps, hardware, atau multi-branch",
          "Ada migrasi data besar atau dependency sistem lama",
          "Target performa, security, atau availability lebih tinggi"
        ],
        "startingPrice": "9000000",
        "sortOrder": 20
      },
      {
        "code": "PREMIUM",
        "title": "Premium",
        "summary": "Untuk android business application dengan workflow lintas peran, integrasi lanjutan, kebutuhan arsitektur khusus, atau risiko delivery yang lebih tinggi.",
        "indicators": [
          "Banyak modul dan workflow saling bergantung",
          "Multi-role dengan permission dan approval berlapis",
          "Integrasi lanjutan atau data lintas sistem",
          "Ada kebutuhan performa, keamanan, audit, atau skalabilitas"
        ],
        "escalationSignals": [
          "Scope perlu dibagi ke beberapa phase delivery",
          "Membutuhkan discovery atau technical assessment khusus",
          "Ada kewajiban compliance, data sensitif, atau provider dependency",
          "Estimasi tidak aman ditentukan sebelum validasi arsitektur"
        ],
        "startingPrice": "20000000",
        "sortOrder": 30
      }
    ]
  },
  {
    "sourceCategory": "Android Development",
    "typeSlug": "android-development",
    "category": "Android Development",
    "title": "Android Booking Application",
    "slug": "android-booking-application",
    "matchSlugs": [
      "android-booking-application"
    ],
    "summary": "Aplikasi pemesanan jadwal atau layanan dengan alur pengguna dan pengelolaan booking.",
    "description": "Aplikasi pemesanan jadwal atau layanan dengan alur pengguna dan pengelolaan booking. Detail scope, deliverables, timeline, revisi, provider cost, dan harga final dikonfirmasi melalui discovery dan quotation Owner.",
    "startingPrice": "5000000",
    "deliveryEstimate": null,
    "revisionGuidance": "Ditetapkan melalui quotation",
    "deliverables": [
      "Scope yang disepakati melalui quotation",
      "Handoff sesuai kebutuhan project"
    ],
    "technologies": [
      "Discovery",
      "Implementation",
      "Technical handoff"
    ],
    "searchAliases": [
      "Android Booking Application",
      "Android Development"
    ],
    "levels": [
      {
        "code": "ESSENTIAL",
        "title": "Essential",
        "summary": "Untuk kebutuhan awal android booking application dengan satu tujuan utama, alur terbatas, dan dependensi teknis yang masih sederhana.",
        "indicators": [
          "Satu workflow atau outcome utama",
          "Jumlah halaman, screen, endpoint, atau modul terbatas",
          "Data dan aturan bisnis masih sederhana",
          "Sedikit atau tanpa integrasi eksternal"
        ],
        "escalationSignals": [
          "Membutuhkan beberapa role atau approval",
          "Data harus tersinkron dengan sistem lain",
          "Scope mulai mencakup dashboard, laporan, atau automation",
          "Requirement belum cukup jelas untuk langsung dieksekusi"
        ],
        "startingPrice": "5000000",
        "sortOrder": 10
      },
      {
        "code": "ADVANCED",
        "title": "Advanced",
        "summary": "Untuk android booking application yang sudah melibatkan beberapa workflow, data online, role dasar, atau integrasi terpilih.",
        "indicators": [
          "Beberapa halaman, screen, endpoint, atau modul saling terhubung",
          "Menggunakan database dan pengelolaan data aktif",
          "Memerlukan autentikasi, dashboard, atau role dasar",
          "Ada integrasi eksternal dengan alur yang terdefinisi"
        ],
        "escalationSignals": [
          "Role, approval, dan permission semakin kompleks",
          "Membutuhkan real-time, payment, maps, hardware, atau multi-branch",
          "Ada migrasi data besar atau dependency sistem lama",
          "Target performa, security, atau availability lebih tinggi"
        ],
        "startingPrice": "12000000",
        "sortOrder": 20
      },
      {
        "code": "PREMIUM",
        "title": "Premium",
        "summary": "Untuk android booking application dengan workflow lintas peran, integrasi lanjutan, kebutuhan arsitektur khusus, atau risiko delivery yang lebih tinggi.",
        "indicators": [
          "Banyak modul dan workflow saling bergantung",
          "Multi-role dengan permission dan approval berlapis",
          "Integrasi lanjutan atau data lintas sistem",
          "Ada kebutuhan performa, keamanan, audit, atau skalabilitas"
        ],
        "escalationSignals": [
          "Scope perlu dibagi ke beberapa phase delivery",
          "Membutuhkan discovery atau technical assessment khusus",
          "Ada kewajiban compliance, data sensitif, atau provider dependency",
          "Estimasi tidak aman ditentukan sebelum validasi arsitektur"
        ],
        "startingPrice": "25000000",
        "sortOrder": 30
      }
    ]
  },
  {
    "sourceCategory": "Android Development",
    "typeSlug": "android-development",
    "category": "Android Development",
    "title": "Android E-Commerce Application",
    "slug": "android-e-commerce-application",
    "matchSlugs": [
      "android-e-commerce-application"
    ],
    "summary": "Aplikasi katalog dan transaksi untuk menjual produk melalui perangkat Android.",
    "description": "Aplikasi katalog dan transaksi untuk menjual produk melalui perangkat Android. Detail scope, deliverables, timeline, revisi, provider cost, dan harga final dikonfirmasi melalui discovery dan quotation Owner.",
    "startingPrice": "6000000",
    "deliveryEstimate": null,
    "revisionGuidance": "Ditetapkan melalui quotation",
    "deliverables": [
      "Scope yang disepakati melalui quotation",
      "Handoff sesuai kebutuhan project"
    ],
    "technologies": [
      "Discovery",
      "Implementation",
      "Technical handoff"
    ],
    "searchAliases": [
      "Android E-Commerce Application",
      "Android Development"
    ],
    "levels": [
      {
        "code": "ESSENTIAL",
        "title": "Essential",
        "summary": "Untuk kebutuhan awal android e-commerce application dengan satu tujuan utama, alur terbatas, dan dependensi teknis yang masih sederhana.",
        "indicators": [
          "Satu workflow atau outcome utama",
          "Jumlah halaman, screen, endpoint, atau modul terbatas",
          "Data dan aturan bisnis masih sederhana",
          "Sedikit atau tanpa integrasi eksternal"
        ],
        "escalationSignals": [
          "Membutuhkan beberapa role atau approval",
          "Data harus tersinkron dengan sistem lain",
          "Scope mulai mencakup dashboard, laporan, atau automation",
          "Requirement belum cukup jelas untuk langsung dieksekusi"
        ],
        "startingPrice": "6000000",
        "sortOrder": 10
      },
      {
        "code": "ADVANCED",
        "title": "Advanced",
        "summary": "Untuk android e-commerce application yang sudah melibatkan beberapa workflow, data online, role dasar, atau integrasi terpilih.",
        "indicators": [
          "Beberapa halaman, screen, endpoint, atau modul saling terhubung",
          "Menggunakan database dan pengelolaan data aktif",
          "Memerlukan autentikasi, dashboard, atau role dasar",
          "Ada integrasi eksternal dengan alur yang terdefinisi"
        ],
        "escalationSignals": [
          "Role, approval, dan permission semakin kompleks",
          "Membutuhkan real-time, payment, maps, hardware, atau multi-branch",
          "Ada migrasi data besar atau dependency sistem lama",
          "Target performa, security, atau availability lebih tinggi"
        ],
        "startingPrice": "15000000",
        "sortOrder": 20
      },
      {
        "code": "PREMIUM",
        "title": "Premium",
        "summary": "Untuk android e-commerce application dengan workflow lintas peran, integrasi lanjutan, kebutuhan arsitektur khusus, atau risiko delivery yang lebih tinggi.",
        "indicators": [
          "Banyak modul dan workflow saling bergantung",
          "Multi-role dengan permission dan approval berlapis",
          "Integrasi lanjutan atau data lintas sistem",
          "Ada kebutuhan performa, keamanan, audit, atau skalabilitas"
        ],
        "escalationSignals": [
          "Scope perlu dibagi ke beberapa phase delivery",
          "Membutuhkan discovery atau technical assessment khusus",
          "Ada kewajiban compliance, data sensitif, atau provider dependency",
          "Estimasi tidak aman ditentukan sebelum validasi arsitektur"
        ],
        "startingPrice": "32000000",
        "sortOrder": 30
      }
    ]
  },
  {
    "sourceCategory": "Desktop Application",
    "typeSlug": "desktop-application",
    "category": "Desktop Application",
    "title": "Point of Sale Application",
    "slug": "point-of-sale-application",
    "matchSlugs": [
      "point-of-sale-application"
    ],
    "summary": "Aplikasi kasir desktop untuk transaksi, produk, pelanggan, dan laporan dasar.",
    "description": "Aplikasi kasir desktop untuk transaksi, produk, pelanggan, dan laporan dasar. Detail scope, deliverables, timeline, revisi, provider cost, dan harga final dikonfirmasi melalui discovery dan quotation Owner.",
    "startingPrice": "4000000",
    "deliveryEstimate": null,
    "revisionGuidance": "Ditetapkan melalui quotation",
    "deliverables": [
      "Scope yang disepakati melalui quotation",
      "Handoff sesuai kebutuhan project"
    ],
    "technologies": [
      "Discovery",
      "Implementation",
      "Technical handoff"
    ],
    "searchAliases": [
      "Point of Sale Application",
      "Desktop Application"
    ],
    "levels": [
      {
        "code": "ESSENTIAL",
        "title": "Essential",
        "summary": "Untuk kebutuhan awal point of sale application dengan satu tujuan utama, alur terbatas, dan dependensi teknis yang masih sederhana.",
        "indicators": [
          "Satu workflow atau outcome utama",
          "Jumlah halaman, screen, endpoint, atau modul terbatas",
          "Data dan aturan bisnis masih sederhana",
          "Sedikit atau tanpa integrasi eksternal"
        ],
        "escalationSignals": [
          "Membutuhkan beberapa role atau approval",
          "Data harus tersinkron dengan sistem lain",
          "Scope mulai mencakup dashboard, laporan, atau automation",
          "Requirement belum cukup jelas untuk langsung dieksekusi"
        ],
        "startingPrice": "4000000",
        "sortOrder": 10
      },
      {
        "code": "ADVANCED",
        "title": "Advanced",
        "summary": "Untuk point of sale application yang sudah melibatkan beberapa workflow, data online, role dasar, atau integrasi terpilih.",
        "indicators": [
          "Beberapa halaman, screen, endpoint, atau modul saling terhubung",
          "Menggunakan database dan pengelolaan data aktif",
          "Memerlukan autentikasi, dashboard, atau role dasar",
          "Ada integrasi eksternal dengan alur yang terdefinisi"
        ],
        "escalationSignals": [
          "Role, approval, dan permission semakin kompleks",
          "Membutuhkan real-time, payment, maps, hardware, atau multi-branch",
          "Ada migrasi data besar atau dependency sistem lama",
          "Target performa, security, atau availability lebih tinggi"
        ],
        "startingPrice": "9000000",
        "sortOrder": 20
      },
      {
        "code": "PREMIUM",
        "title": "Premium",
        "summary": "Untuk point of sale application dengan workflow lintas peran, integrasi lanjutan, kebutuhan arsitektur khusus, atau risiko delivery yang lebih tinggi.",
        "indicators": [
          "Banyak modul dan workflow saling bergantung",
          "Multi-role dengan permission dan approval berlapis",
          "Integrasi lanjutan atau data lintas sistem",
          "Ada kebutuhan performa, keamanan, audit, atau skalabilitas"
        ],
        "escalationSignals": [
          "Scope perlu dibagi ke beberapa phase delivery",
          "Membutuhkan discovery atau technical assessment khusus",
          "Ada kewajiban compliance, data sensitif, atau provider dependency",
          "Estimasi tidak aman ditentukan sebelum validasi arsitektur"
        ],
        "startingPrice": "20000000",
        "sortOrder": 30
      }
    ]
  },
  {
    "sourceCategory": "Desktop Application",
    "typeSlug": "desktop-application",
    "category": "Desktop Application",
    "title": "Inventory Desktop Application",
    "slug": "inventory-desktop-application",
    "matchSlugs": [
      "inventory-application"
    ],
    "summary": "Aplikasi pengelolaan stok dan pergerakan barang untuk penggunaan lokal atau jaringan.",
    "description": "Aplikasi pengelolaan stok dan pergerakan barang untuk penggunaan lokal atau jaringan. Detail scope, deliverables, timeline, revisi, provider cost, dan harga final dikonfirmasi melalui discovery dan quotation Owner.",
    "startingPrice": "4500000",
    "deliveryEstimate": null,
    "revisionGuidance": "Ditetapkan melalui quotation",
    "deliverables": [
      "Scope yang disepakati melalui quotation",
      "Handoff sesuai kebutuhan project"
    ],
    "technologies": [
      "Discovery",
      "Implementation",
      "Technical handoff"
    ],
    "searchAliases": [
      "Inventory Desktop Application",
      "Desktop Application"
    ],
    "levels": [
      {
        "code": "ESSENTIAL",
        "title": "Essential",
        "summary": "Untuk kebutuhan awal inventory desktop application dengan satu tujuan utama, alur terbatas, dan dependensi teknis yang masih sederhana.",
        "indicators": [
          "Satu workflow atau outcome utama",
          "Jumlah halaman, screen, endpoint, atau modul terbatas",
          "Data dan aturan bisnis masih sederhana",
          "Sedikit atau tanpa integrasi eksternal"
        ],
        "escalationSignals": [
          "Membutuhkan beberapa role atau approval",
          "Data harus tersinkron dengan sistem lain",
          "Scope mulai mencakup dashboard, laporan, atau automation",
          "Requirement belum cukup jelas untuk langsung dieksekusi"
        ],
        "startingPrice": "4500000",
        "sortOrder": 10
      },
      {
        "code": "ADVANCED",
        "title": "Advanced",
        "summary": "Untuk inventory desktop application yang sudah melibatkan beberapa workflow, data online, role dasar, atau integrasi terpilih.",
        "indicators": [
          "Beberapa halaman, screen, endpoint, atau modul saling terhubung",
          "Menggunakan database dan pengelolaan data aktif",
          "Memerlukan autentikasi, dashboard, atau role dasar",
          "Ada integrasi eksternal dengan alur yang terdefinisi"
        ],
        "escalationSignals": [
          "Role, approval, dan permission semakin kompleks",
          "Membutuhkan real-time, payment, maps, hardware, atau multi-branch",
          "Ada migrasi data besar atau dependency sistem lama",
          "Target performa, security, atau availability lebih tinggi"
        ],
        "startingPrice": "10000000",
        "sortOrder": 20
      },
      {
        "code": "PREMIUM",
        "title": "Premium",
        "summary": "Untuk inventory desktop application dengan workflow lintas peran, integrasi lanjutan, kebutuhan arsitektur khusus, atau risiko delivery yang lebih tinggi.",
        "indicators": [
          "Banyak modul dan workflow saling bergantung",
          "Multi-role dengan permission dan approval berlapis",
          "Integrasi lanjutan atau data lintas sistem",
          "Ada kebutuhan performa, keamanan, audit, atau skalabilitas"
        ],
        "escalationSignals": [
          "Scope perlu dibagi ke beberapa phase delivery",
          "Membutuhkan discovery atau technical assessment khusus",
          "Ada kewajiban compliance, data sensitif, atau provider dependency",
          "Estimasi tidak aman ditentukan sebelum validasi arsitektur"
        ],
        "startingPrice": "24000000",
        "sortOrder": 30
      }
    ]
  },
  {
    "sourceCategory": "Desktop Application",
    "typeSlug": "desktop-application",
    "category": "Desktop Application",
    "title": "Custom Multi-User Desktop System",
    "slug": "custom-multi-user-desktop-system",
    "matchSlugs": [
      "multi-user-desktop-system"
    ],
    "summary": "Sistem desktop khusus dengan beberapa pengguna, role, dan workflow bisnis.",
    "description": "Sistem desktop khusus dengan beberapa pengguna, role, dan workflow bisnis. Detail scope, deliverables, timeline, revisi, provider cost, dan harga final dikonfirmasi melalui discovery dan quotation Owner.",
    "startingPrice": "6000000",
    "deliveryEstimate": null,
    "revisionGuidance": "Ditetapkan melalui quotation",
    "deliverables": [
      "Scope yang disepakati melalui quotation",
      "Handoff sesuai kebutuhan project"
    ],
    "technologies": [
      "Discovery",
      "Implementation",
      "Technical handoff"
    ],
    "searchAliases": [
      "Custom Multi-User Desktop System",
      "Desktop Application"
    ],
    "levels": [
      {
        "code": "ESSENTIAL",
        "title": "Essential",
        "summary": "Untuk kebutuhan awal custom multi-user desktop system dengan satu tujuan utama, alur terbatas, dan dependensi teknis yang masih sederhana.",
        "indicators": [
          "Satu workflow atau outcome utama",
          "Jumlah halaman, screen, endpoint, atau modul terbatas",
          "Data dan aturan bisnis masih sederhana",
          "Sedikit atau tanpa integrasi eksternal"
        ],
        "escalationSignals": [
          "Membutuhkan beberapa role atau approval",
          "Data harus tersinkron dengan sistem lain",
          "Scope mulai mencakup dashboard, laporan, atau automation",
          "Requirement belum cukup jelas untuk langsung dieksekusi"
        ],
        "startingPrice": "6000000",
        "sortOrder": 10
      },
      {
        "code": "ADVANCED",
        "title": "Advanced",
        "summary": "Untuk custom multi-user desktop system yang sudah melibatkan beberapa workflow, data online, role dasar, atau integrasi terpilih.",
        "indicators": [
          "Beberapa halaman, screen, endpoint, atau modul saling terhubung",
          "Menggunakan database dan pengelolaan data aktif",
          "Memerlukan autentikasi, dashboard, atau role dasar",
          "Ada integrasi eksternal dengan alur yang terdefinisi"
        ],
        "escalationSignals": [
          "Role, approval, dan permission semakin kompleks",
          "Membutuhkan real-time, payment, maps, hardware, atau multi-branch",
          "Ada migrasi data besar atau dependency sistem lama",
          "Target performa, security, atau availability lebih tinggi"
        ],
        "startingPrice": "15000000",
        "sortOrder": 20
      },
      {
        "code": "PREMIUM",
        "title": "Premium",
        "summary": "Untuk custom multi-user desktop system dengan workflow lintas peran, integrasi lanjutan, kebutuhan arsitektur khusus, atau risiko delivery yang lebih tinggi.",
        "indicators": [
          "Banyak modul dan workflow saling bergantung",
          "Multi-role dengan permission dan approval berlapis",
          "Integrasi lanjutan atau data lintas sistem",
          "Ada kebutuhan performa, keamanan, audit, atau skalabilitas"
        ],
        "escalationSignals": [
          "Scope perlu dibagi ke beberapa phase delivery",
          "Membutuhkan discovery atau technical assessment khusus",
          "Ada kewajiban compliance, data sensitif, atau provider dependency",
          "Estimasi tidak aman ditentukan sebelum validasi arsitektur"
        ],
        "startingPrice": "32000000",
        "sortOrder": 30
      }
    ]
  },
  {
    "sourceCategory": "UI/UX Design",
    "typeSlug": "ui-ux-design",
    "category": "UI/UX Design",
    "title": "Website UI/UX Design",
    "slug": "website-ui-ux-design",
    "matchSlugs": [
      "ui-ux-design"
    ],
    "summary": "Perancangan struktur dan antarmuka website berdasarkan tujuan bisnis dan perilaku pengguna.",
    "description": "Perancangan struktur dan antarmuka website berdasarkan tujuan bisnis dan perilaku pengguna. Detail scope, deliverables, timeline, revisi, provider cost, dan harga final dikonfirmasi melalui discovery dan quotation Owner.",
    "startingPrice": "1200000",
    "deliveryEstimate": null,
    "revisionGuidance": "Ditetapkan melalui quotation",
    "deliverables": [
      "Scope yang disepakati melalui quotation",
      "Handoff sesuai kebutuhan project"
    ],
    "technologies": [
      "Discovery",
      "Implementation",
      "Technical handoff"
    ],
    "searchAliases": [
      "Website UI/UX Design",
      "UI/UX Design"
    ],
    "levels": [
      {
        "code": "ESSENTIAL",
        "title": "Essential",
        "summary": "Untuk kebutuhan awal website ui/ux design dengan satu tujuan utama, alur terbatas, dan dependensi teknis yang masih sederhana.",
        "indicators": [
          "Satu workflow atau outcome utama",
          "Jumlah halaman, screen, endpoint, atau modul terbatas",
          "Data dan aturan bisnis masih sederhana",
          "Sedikit atau tanpa integrasi eksternal"
        ],
        "escalationSignals": [
          "Membutuhkan beberapa role atau approval",
          "Data harus tersinkron dengan sistem lain",
          "Scope mulai mencakup dashboard, laporan, atau automation",
          "Requirement belum cukup jelas untuk langsung dieksekusi"
        ],
        "startingPrice": "1200000",
        "sortOrder": 10
      },
      {
        "code": "ADVANCED",
        "title": "Advanced",
        "summary": "Untuk website ui/ux design yang sudah melibatkan beberapa workflow, data online, role dasar, atau integrasi terpilih.",
        "indicators": [
          "Beberapa halaman, screen, endpoint, atau modul saling terhubung",
          "Menggunakan database dan pengelolaan data aktif",
          "Memerlukan autentikasi, dashboard, atau role dasar",
          "Ada integrasi eksternal dengan alur yang terdefinisi"
        ],
        "escalationSignals": [
          "Role, approval, dan permission semakin kompleks",
          "Membutuhkan real-time, payment, maps, hardware, atau multi-branch",
          "Ada migrasi data besar atau dependency sistem lama",
          "Target performa, security, atau availability lebih tinggi"
        ],
        "startingPrice": "3000000",
        "sortOrder": 20
      },
      {
        "code": "PREMIUM",
        "title": "Premium",
        "summary": "Untuk website ui/ux design dengan workflow lintas peran, integrasi lanjutan, kebutuhan arsitektur khusus, atau risiko delivery yang lebih tinggi.",
        "indicators": [
          "Banyak modul dan workflow saling bergantung",
          "Multi-role dengan permission dan approval berlapis",
          "Integrasi lanjutan atau data lintas sistem",
          "Ada kebutuhan performa, keamanan, audit, atau skalabilitas"
        ],
        "escalationSignals": [
          "Scope perlu dibagi ke beberapa phase delivery",
          "Membutuhkan discovery atau technical assessment khusus",
          "Ada kewajiban compliance, data sensitif, atau provider dependency",
          "Estimasi tidak aman ditentukan sebelum validasi arsitektur"
        ],
        "startingPrice": "6500000",
        "sortOrder": 30
      }
    ]
  },
  {
    "sourceCategory": "UI/UX Design",
    "typeSlug": "ui-ux-design",
    "category": "UI/UX Design",
    "title": "Application UI/UX Design",
    "slug": "application-ui-ux-design",
    "matchSlugs": [],
    "summary": "Perancangan flow, wireframe, dan UI untuk aplikasi web, Android, atau desktop.",
    "description": "Perancangan flow, wireframe, dan UI untuk aplikasi web, Android, atau desktop. Detail scope, deliverables, timeline, revisi, provider cost, dan harga final dikonfirmasi melalui discovery dan quotation Owner.",
    "startingPrice": "2000000",
    "deliveryEstimate": null,
    "revisionGuidance": "Ditetapkan melalui quotation",
    "deliverables": [
      "Scope yang disepakati melalui quotation",
      "Handoff sesuai kebutuhan project"
    ],
    "technologies": [
      "Discovery",
      "Implementation",
      "Technical handoff"
    ],
    "searchAliases": [
      "Application UI/UX Design",
      "UI/UX Design"
    ],
    "levels": [
      {
        "code": "ESSENTIAL",
        "title": "Essential",
        "summary": "Untuk kebutuhan awal application ui/ux design dengan satu tujuan utama, alur terbatas, dan dependensi teknis yang masih sederhana.",
        "indicators": [
          "Satu workflow atau outcome utama",
          "Jumlah halaman, screen, endpoint, atau modul terbatas",
          "Data dan aturan bisnis masih sederhana",
          "Sedikit atau tanpa integrasi eksternal"
        ],
        "escalationSignals": [
          "Membutuhkan beberapa role atau approval",
          "Data harus tersinkron dengan sistem lain",
          "Scope mulai mencakup dashboard, laporan, atau automation",
          "Requirement belum cukup jelas untuk langsung dieksekusi"
        ],
        "startingPrice": "2000000",
        "sortOrder": 10
      },
      {
        "code": "ADVANCED",
        "title": "Advanced",
        "summary": "Untuk application ui/ux design yang sudah melibatkan beberapa workflow, data online, role dasar, atau integrasi terpilih.",
        "indicators": [
          "Beberapa halaman, screen, endpoint, atau modul saling terhubung",
          "Menggunakan database dan pengelolaan data aktif",
          "Memerlukan autentikasi, dashboard, atau role dasar",
          "Ada integrasi eksternal dengan alur yang terdefinisi"
        ],
        "escalationSignals": [
          "Role, approval, dan permission semakin kompleks",
          "Membutuhkan real-time, payment, maps, hardware, atau multi-branch",
          "Ada migrasi data besar atau dependency sistem lama",
          "Target performa, security, atau availability lebih tinggi"
        ],
        "startingPrice": "5000000",
        "sortOrder": 20
      },
      {
        "code": "PREMIUM",
        "title": "Premium",
        "summary": "Untuk application ui/ux design dengan workflow lintas peran, integrasi lanjutan, kebutuhan arsitektur khusus, atau risiko delivery yang lebih tinggi.",
        "indicators": [
          "Banyak modul dan workflow saling bergantung",
          "Multi-role dengan permission dan approval berlapis",
          "Integrasi lanjutan atau data lintas sistem",
          "Ada kebutuhan performa, keamanan, audit, atau skalabilitas"
        ],
        "escalationSignals": [
          "Scope perlu dibagi ke beberapa phase delivery",
          "Membutuhkan discovery atau technical assessment khusus",
          "Ada kewajiban compliance, data sensitif, atau provider dependency",
          "Estimasi tidak aman ditentukan sebelum validasi arsitektur"
        ],
        "startingPrice": "12000000",
        "sortOrder": 30
      }
    ]
  },
  {
    "sourceCategory": "UI/UX Design",
    "typeSlug": "ui-ux-design",
    "category": "UI/UX Design",
    "title": "UI/UX Audit & Redesign",
    "slug": "ui-ux-audit-and-redesign",
    "matchSlugs": [
      "ui-ux-audit"
    ],
    "summary": "Evaluasi masalah usability, hierarchy, consistency, dan conversion sebelum redesign.",
    "description": "Evaluasi masalah usability, hierarchy, consistency, dan conversion sebelum redesign. Detail scope, deliverables, timeline, revisi, provider cost, dan harga final dikonfirmasi melalui discovery dan quotation Owner.",
    "startingPrice": "1000000",
    "deliveryEstimate": null,
    "revisionGuidance": "Ditetapkan melalui quotation",
    "deliverables": [
      "Scope yang disepakati melalui quotation",
      "Handoff sesuai kebutuhan project"
    ],
    "technologies": [
      "Discovery",
      "Implementation",
      "Technical handoff"
    ],
    "searchAliases": [
      "UI/UX Audit & Redesign",
      "UI/UX Design"
    ],
    "levels": [
      {
        "code": "ESSENTIAL",
        "title": "Essential",
        "summary": "Untuk kebutuhan awal ui/ux audit & redesign dengan satu tujuan utama, alur terbatas, dan dependensi teknis yang masih sederhana.",
        "indicators": [
          "Satu workflow atau outcome utama",
          "Jumlah halaman, screen, endpoint, atau modul terbatas",
          "Data dan aturan bisnis masih sederhana",
          "Sedikit atau tanpa integrasi eksternal"
        ],
        "escalationSignals": [
          "Membutuhkan beberapa role atau approval",
          "Data harus tersinkron dengan sistem lain",
          "Scope mulai mencakup dashboard, laporan, atau automation",
          "Requirement belum cukup jelas untuk langsung dieksekusi"
        ],
        "startingPrice": "1000000",
        "sortOrder": 10
      },
      {
        "code": "ADVANCED",
        "title": "Advanced",
        "summary": "Untuk ui/ux audit & redesign yang sudah melibatkan beberapa workflow, data online, role dasar, atau integrasi terpilih.",
        "indicators": [
          "Beberapa halaman, screen, endpoint, atau modul saling terhubung",
          "Menggunakan database dan pengelolaan data aktif",
          "Memerlukan autentikasi, dashboard, atau role dasar",
          "Ada integrasi eksternal dengan alur yang terdefinisi"
        ],
        "escalationSignals": [
          "Role, approval, dan permission semakin kompleks",
          "Membutuhkan real-time, payment, maps, hardware, atau multi-branch",
          "Ada migrasi data besar atau dependency sistem lama",
          "Target performa, security, atau availability lebih tinggi"
        ],
        "startingPrice": "3000000",
        "sortOrder": 20
      },
      {
        "code": "PREMIUM",
        "title": "Premium",
        "summary": "Untuk ui/ux audit & redesign dengan workflow lintas peran, integrasi lanjutan, kebutuhan arsitektur khusus, atau risiko delivery yang lebih tinggi.",
        "indicators": [
          "Banyak modul dan workflow saling bergantung",
          "Multi-role dengan permission dan approval berlapis",
          "Integrasi lanjutan atau data lintas sistem",
          "Ada kebutuhan performa, keamanan, audit, atau skalabilitas"
        ],
        "escalationSignals": [
          "Scope perlu dibagi ke beberapa phase delivery",
          "Membutuhkan discovery atau technical assessment khusus",
          "Ada kewajiban compliance, data sensitif, atau provider dependency",
          "Estimasi tidak aman ditentukan sebelum validasi arsitektur"
        ],
        "startingPrice": "8000000",
        "sortOrder": 30
      }
    ]
  },
  {
    "sourceCategory": "Backend & System Services",
    "typeSlug": "backend-system-services",
    "category": "Backend & System Services",
    "title": "Backend System Development",
    "slug": "backend-system-development",
    "matchSlugs": [
      "backend-development"
    ],
    "summary": "Pengembangan logic server, database, workflow, dan layanan inti sebuah sistem.",
    "description": "Pengembangan logic server, database, workflow, dan layanan inti sebuah sistem. Detail scope, deliverables, timeline, revisi, provider cost, dan harga final dikonfirmasi melalui discovery dan quotation Owner.",
    "startingPrice": "3000000",
    "deliveryEstimate": null,
    "revisionGuidance": "Ditetapkan melalui quotation",
    "deliverables": [
      "Scope yang disepakati melalui quotation",
      "Handoff sesuai kebutuhan project"
    ],
    "technologies": [
      "Discovery",
      "Implementation",
      "Technical handoff"
    ],
    "searchAliases": [
      "Backend System Development",
      "Backend & System Services"
    ],
    "levels": [
      {
        "code": "ESSENTIAL",
        "title": "Essential",
        "summary": "Untuk kebutuhan awal backend system development dengan satu tujuan utama, alur terbatas, dan dependensi teknis yang masih sederhana.",
        "indicators": [
          "Satu workflow atau outcome utama",
          "Jumlah halaman, screen, endpoint, atau modul terbatas",
          "Data dan aturan bisnis masih sederhana",
          "Sedikit atau tanpa integrasi eksternal"
        ],
        "escalationSignals": [
          "Membutuhkan beberapa role atau approval",
          "Data harus tersinkron dengan sistem lain",
          "Scope mulai mencakup dashboard, laporan, atau automation",
          "Requirement belum cukup jelas untuk langsung dieksekusi"
        ],
        "startingPrice": "3000000",
        "sortOrder": 10
      },
      {
        "code": "ADVANCED",
        "title": "Advanced",
        "summary": "Untuk backend system development yang sudah melibatkan beberapa workflow, data online, role dasar, atau integrasi terpilih.",
        "indicators": [
          "Beberapa halaman, screen, endpoint, atau modul saling terhubung",
          "Menggunakan database dan pengelolaan data aktif",
          "Memerlukan autentikasi, dashboard, atau role dasar",
          "Ada integrasi eksternal dengan alur yang terdefinisi"
        ],
        "escalationSignals": [
          "Role, approval, dan permission semakin kompleks",
          "Membutuhkan real-time, payment, maps, hardware, atau multi-branch",
          "Ada migrasi data besar atau dependency sistem lama",
          "Target performa, security, atau availability lebih tinggi"
        ],
        "startingPrice": "7500000",
        "sortOrder": 20
      },
      {
        "code": "PREMIUM",
        "title": "Premium",
        "summary": "Untuk backend system development dengan workflow lintas peran, integrasi lanjutan, kebutuhan arsitektur khusus, atau risiko delivery yang lebih tinggi.",
        "indicators": [
          "Banyak modul dan workflow saling bergantung",
          "Multi-role dengan permission dan approval berlapis",
          "Integrasi lanjutan atau data lintas sistem",
          "Ada kebutuhan performa, keamanan, audit, atau skalabilitas"
        ],
        "escalationSignals": [
          "Scope perlu dibagi ke beberapa phase delivery",
          "Membutuhkan discovery atau technical assessment khusus",
          "Ada kewajiban compliance, data sensitif, atau provider dependency",
          "Estimasi tidak aman ditentukan sebelum validasi arsitektur"
        ],
        "startingPrice": "18000000",
        "sortOrder": 30
      }
    ]
  },
  {
    "sourceCategory": "Backend & System Services",
    "typeSlug": "backend-system-services",
    "category": "Backend & System Services",
    "title": "Database Design & Optimization",
    "slug": "database-design-and-optimization",
    "matchSlugs": [
      "database-design"
    ],
    "summary": "Perancangan atau perbaikan struktur data agar konsisten, aman, dan efisien.",
    "description": "Perancangan atau perbaikan struktur data agar konsisten, aman, dan efisien. Detail scope, deliverables, timeline, revisi, provider cost, dan harga final dikonfirmasi melalui discovery dan quotation Owner.",
    "startingPrice": "1500000",
    "deliveryEstimate": null,
    "revisionGuidance": "Ditetapkan melalui quotation",
    "deliverables": [
      "Scope yang disepakati melalui quotation",
      "Handoff sesuai kebutuhan project"
    ],
    "technologies": [
      "Discovery",
      "Implementation",
      "Technical handoff"
    ],
    "searchAliases": [
      "Database Design & Optimization",
      "Backend & System Services"
    ],
    "levels": [
      {
        "code": "ESSENTIAL",
        "title": "Essential",
        "summary": "Untuk kebutuhan awal database design & optimization dengan satu tujuan utama, alur terbatas, dan dependensi teknis yang masih sederhana.",
        "indicators": [
          "Satu workflow atau outcome utama",
          "Jumlah halaman, screen, endpoint, atau modul terbatas",
          "Data dan aturan bisnis masih sederhana",
          "Sedikit atau tanpa integrasi eksternal"
        ],
        "escalationSignals": [
          "Membutuhkan beberapa role atau approval",
          "Data harus tersinkron dengan sistem lain",
          "Scope mulai mencakup dashboard, laporan, atau automation",
          "Requirement belum cukup jelas untuk langsung dieksekusi"
        ],
        "startingPrice": "1500000",
        "sortOrder": 10
      },
      {
        "code": "ADVANCED",
        "title": "Advanced",
        "summary": "Untuk database design & optimization yang sudah melibatkan beberapa workflow, data online, role dasar, atau integrasi terpilih.",
        "indicators": [
          "Beberapa halaman, screen, endpoint, atau modul saling terhubung",
          "Menggunakan database dan pengelolaan data aktif",
          "Memerlukan autentikasi, dashboard, atau role dasar",
          "Ada integrasi eksternal dengan alur yang terdefinisi"
        ],
        "escalationSignals": [
          "Role, approval, dan permission semakin kompleks",
          "Membutuhkan real-time, payment, maps, hardware, atau multi-branch",
          "Ada migrasi data besar atau dependency sistem lama",
          "Target performa, security, atau availability lebih tinggi"
        ],
        "startingPrice": "4000000",
        "sortOrder": 20
      },
      {
        "code": "PREMIUM",
        "title": "Premium",
        "summary": "Untuk database design & optimization dengan workflow lintas peran, integrasi lanjutan, kebutuhan arsitektur khusus, atau risiko delivery yang lebih tinggi.",
        "indicators": [
          "Banyak modul dan workflow saling bergantung",
          "Multi-role dengan permission dan approval berlapis",
          "Integrasi lanjutan atau data lintas sistem",
          "Ada kebutuhan performa, keamanan, audit, atau skalabilitas"
        ],
        "escalationSignals": [
          "Scope perlu dibagi ke beberapa phase delivery",
          "Membutuhkan discovery atau technical assessment khusus",
          "Ada kewajiban compliance, data sensitif, atau provider dependency",
          "Estimasi tidak aman ditentukan sebelum validasi arsitektur"
        ],
        "startingPrice": "10000000",
        "sortOrder": 30
      }
    ]
  },
  {
    "sourceCategory": "Backend & System Services",
    "typeSlug": "backend-system-services",
    "category": "Backend & System Services",
    "title": "Admin Panel Development",
    "slug": "admin-panel-development",
    "matchSlugs": [
      "admin-panel-development"
    ],
    "summary": "Panel pengelolaan untuk data, pengguna, content, transaksi, dan aktivitas sistem.",
    "description": "Panel pengelolaan untuk data, pengguna, content, transaksi, dan aktivitas sistem. Detail scope, deliverables, timeline, revisi, provider cost, dan harga final dikonfirmasi melalui discovery dan quotation Owner.",
    "startingPrice": "3000000",
    "deliveryEstimate": null,
    "revisionGuidance": "Ditetapkan melalui quotation",
    "deliverables": [
      "Scope yang disepakati melalui quotation",
      "Handoff sesuai kebutuhan project"
    ],
    "technologies": [
      "Discovery",
      "Implementation",
      "Technical handoff"
    ],
    "searchAliases": [
      "Admin Panel Development",
      "Backend & System Services"
    ],
    "levels": [
      {
        "code": "ESSENTIAL",
        "title": "Essential",
        "summary": "Untuk kebutuhan awal admin panel development dengan satu tujuan utama, alur terbatas, dan dependensi teknis yang masih sederhana.",
        "indicators": [
          "Satu workflow atau outcome utama",
          "Jumlah halaman, screen, endpoint, atau modul terbatas",
          "Data dan aturan bisnis masih sederhana",
          "Sedikit atau tanpa integrasi eksternal"
        ],
        "escalationSignals": [
          "Membutuhkan beberapa role atau approval",
          "Data harus tersinkron dengan sistem lain",
          "Scope mulai mencakup dashboard, laporan, atau automation",
          "Requirement belum cukup jelas untuk langsung dieksekusi"
        ],
        "startingPrice": "3000000",
        "sortOrder": 10
      },
      {
        "code": "ADVANCED",
        "title": "Advanced",
        "summary": "Untuk admin panel development yang sudah melibatkan beberapa workflow, data online, role dasar, atau integrasi terpilih.",
        "indicators": [
          "Beberapa halaman, screen, endpoint, atau modul saling terhubung",
          "Menggunakan database dan pengelolaan data aktif",
          "Memerlukan autentikasi, dashboard, atau role dasar",
          "Ada integrasi eksternal dengan alur yang terdefinisi"
        ],
        "escalationSignals": [
          "Role, approval, dan permission semakin kompleks",
          "Membutuhkan real-time, payment, maps, hardware, atau multi-branch",
          "Ada migrasi data besar atau dependency sistem lama",
          "Target performa, security, atau availability lebih tinggi"
        ],
        "startingPrice": "7000000",
        "sortOrder": 20
      },
      {
        "code": "PREMIUM",
        "title": "Premium",
        "summary": "Untuk admin panel development dengan workflow lintas peran, integrasi lanjutan, kebutuhan arsitektur khusus, atau risiko delivery yang lebih tinggi.",
        "indicators": [
          "Banyak modul dan workflow saling bergantung",
          "Multi-role dengan permission dan approval berlapis",
          "Integrasi lanjutan atau data lintas sistem",
          "Ada kebutuhan performa, keamanan, audit, atau skalabilitas"
        ],
        "escalationSignals": [
          "Scope perlu dibagi ke beberapa phase delivery",
          "Membutuhkan discovery atau technical assessment khusus",
          "Ada kewajiban compliance, data sensitif, atau provider dependency",
          "Estimasi tidak aman ditentukan sebelum validasi arsitektur"
        ],
        "startingPrice": "16000000",
        "sortOrder": 30
      }
    ]
  },
  {
    "sourceCategory": "Additional Technical Services",
    "typeSlug": "additional-technical-services",
    "category": "Additional Technical Services",
    "title": "Data Import & Export",
    "slug": "data-import-and-export",
    "matchSlugs": [
      "data-import-export"
    ],
    "summary": "Pemindahan data melalui CSV, Excel, database, atau format lain yang disepakati.",
    "description": "Pemindahan data melalui CSV, Excel, database, atau format lain yang disepakati. Detail scope, deliverables, timeline, revisi, provider cost, dan harga final dikonfirmasi melalui discovery dan quotation Owner.",
    "startingPrice": "750000",
    "deliveryEstimate": null,
    "revisionGuidance": "Ditetapkan melalui quotation",
    "deliverables": [
      "Scope yang disepakati melalui quotation",
      "Handoff sesuai kebutuhan project"
    ],
    "technologies": [
      "Discovery",
      "Implementation",
      "Technical handoff"
    ],
    "searchAliases": [
      "Data Import & Export",
      "Additional Technical Services"
    ],
    "levels": [
      {
        "code": "ESSENTIAL",
        "title": "Essential",
        "summary": "Untuk kebutuhan awal data import & export dengan satu tujuan utama, alur terbatas, dan dependensi teknis yang masih sederhana.",
        "indicators": [
          "Satu workflow atau outcome utama",
          "Jumlah halaman, screen, endpoint, atau modul terbatas",
          "Data dan aturan bisnis masih sederhana",
          "Sedikit atau tanpa integrasi eksternal"
        ],
        "escalationSignals": [
          "Membutuhkan beberapa role atau approval",
          "Data harus tersinkron dengan sistem lain",
          "Scope mulai mencakup dashboard, laporan, atau automation",
          "Requirement belum cukup jelas untuk langsung dieksekusi"
        ],
        "startingPrice": "750000",
        "sortOrder": 10
      },
      {
        "code": "ADVANCED",
        "title": "Advanced",
        "summary": "Untuk data import & export yang sudah melibatkan beberapa workflow, data online, role dasar, atau integrasi terpilih.",
        "indicators": [
          "Beberapa halaman, screen, endpoint, atau modul saling terhubung",
          "Menggunakan database dan pengelolaan data aktif",
          "Memerlukan autentikasi, dashboard, atau role dasar",
          "Ada integrasi eksternal dengan alur yang terdefinisi"
        ],
        "escalationSignals": [
          "Role, approval, dan permission semakin kompleks",
          "Membutuhkan real-time, payment, maps, hardware, atau multi-branch",
          "Ada migrasi data besar atau dependency sistem lama",
          "Target performa, security, atau availability lebih tinggi"
        ],
        "startingPrice": "2000000",
        "sortOrder": 20
      },
      {
        "code": "PREMIUM",
        "title": "Premium",
        "summary": "Untuk data import & export dengan workflow lintas peran, integrasi lanjutan, kebutuhan arsitektur khusus, atau risiko delivery yang lebih tinggi.",
        "indicators": [
          "Banyak modul dan workflow saling bergantung",
          "Multi-role dengan permission dan approval berlapis",
          "Integrasi lanjutan atau data lintas sistem",
          "Ada kebutuhan performa, keamanan, audit, atau skalabilitas"
        ],
        "escalationSignals": [
          "Scope perlu dibagi ke beberapa phase delivery",
          "Membutuhkan discovery atau technical assessment khusus",
          "Ada kewajiban compliance, data sensitif, atau provider dependency",
          "Estimasi tidak aman ditentukan sebelum validasi arsitektur"
        ],
        "startingPrice": "5000000",
        "sortOrder": 30
      }
    ]
  },
  {
    "sourceCategory": "Additional Technical Services",
    "typeSlug": "additional-technical-services",
    "category": "Additional Technical Services",
    "title": "Technical Documentation",
    "slug": "technical-documentation",
    "matchSlugs": [
      "technical-documentation"
    ],
    "summary": "Dokumentasi sistem, API, deployment, penggunaan, atau handover teknis.",
    "description": "Dokumentasi sistem, API, deployment, penggunaan, atau handover teknis. Detail scope, deliverables, timeline, revisi, provider cost, dan harga final dikonfirmasi melalui discovery dan quotation Owner.",
    "startingPrice": "750000",
    "deliveryEstimate": null,
    "revisionGuidance": "Ditetapkan melalui quotation",
    "deliverables": [
      "Scope yang disepakati melalui quotation",
      "Handoff sesuai kebutuhan project"
    ],
    "technologies": [
      "Discovery",
      "Implementation",
      "Technical handoff"
    ],
    "searchAliases": [
      "Technical Documentation",
      "Additional Technical Services"
    ],
    "levels": [
      {
        "code": "ESSENTIAL",
        "title": "Essential",
        "summary": "Untuk kebutuhan awal technical documentation dengan satu tujuan utama, alur terbatas, dan dependensi teknis yang masih sederhana.",
        "indicators": [
          "Satu workflow atau outcome utama",
          "Jumlah halaman, screen, endpoint, atau modul terbatas",
          "Data dan aturan bisnis masih sederhana",
          "Sedikit atau tanpa integrasi eksternal"
        ],
        "escalationSignals": [
          "Membutuhkan beberapa role atau approval",
          "Data harus tersinkron dengan sistem lain",
          "Scope mulai mencakup dashboard, laporan, atau automation",
          "Requirement belum cukup jelas untuk langsung dieksekusi"
        ],
        "startingPrice": "750000",
        "sortOrder": 10
      },
      {
        "code": "ADVANCED",
        "title": "Advanced",
        "summary": "Untuk technical documentation yang sudah melibatkan beberapa workflow, data online, role dasar, atau integrasi terpilih.",
        "indicators": [
          "Beberapa halaman, screen, endpoint, atau modul saling terhubung",
          "Menggunakan database dan pengelolaan data aktif",
          "Memerlukan autentikasi, dashboard, atau role dasar",
          "Ada integrasi eksternal dengan alur yang terdefinisi"
        ],
        "escalationSignals": [
          "Role, approval, dan permission semakin kompleks",
          "Membutuhkan real-time, payment, maps, hardware, atau multi-branch",
          "Ada migrasi data besar atau dependency sistem lama",
          "Target performa, security, atau availability lebih tinggi"
        ],
        "startingPrice": "2000000",
        "sortOrder": 20
      },
      {
        "code": "PREMIUM",
        "title": "Premium",
        "summary": "Untuk technical documentation dengan workflow lintas peran, integrasi lanjutan, kebutuhan arsitektur khusus, atau risiko delivery yang lebih tinggi.",
        "indicators": [
          "Banyak modul dan workflow saling bergantung",
          "Multi-role dengan permission dan approval berlapis",
          "Integrasi lanjutan atau data lintas sistem",
          "Ada kebutuhan performa, keamanan, audit, atau skalabilitas"
        ],
        "escalationSignals": [
          "Scope perlu dibagi ke beberapa phase delivery",
          "Membutuhkan discovery atau technical assessment khusus",
          "Ada kewajiban compliance, data sensitif, atau provider dependency",
          "Estimasi tidak aman ditentukan sebelum validasi arsitektur"
        ],
        "startingPrice": "5000000",
        "sortOrder": 30
      }
    ]
  },
  {
    "sourceCategory": "Additional Technical Services",
    "typeSlug": "additional-technical-services",
    "category": "Additional Technical Services",
    "title": "Technical Consultation",
    "slug": "technical-consultation",
    "matchSlugs": [
      "technical-consultation"
    ],
    "summary": "Sesi terarah untuk menilai kebutuhan, risiko, arsitektur, atau keputusan implementasi.",
    "description": "Sesi terarah untuk menilai kebutuhan, risiko, arsitektur, atau keputusan implementasi. Detail scope, deliverables, timeline, revisi, provider cost, dan harga final dikonfirmasi melalui discovery dan quotation Owner.",
    "startingPrice": "300000",
    "deliveryEstimate": null,
    "revisionGuidance": "Ditetapkan melalui quotation",
    "deliverables": [
      "Scope yang disepakati melalui quotation",
      "Handoff sesuai kebutuhan project"
    ],
    "technologies": [
      "Discovery",
      "Implementation",
      "Technical handoff"
    ],
    "searchAliases": [
      "Technical Consultation",
      "Additional Technical Services"
    ],
    "levels": [
      {
        "code": "ESSENTIAL",
        "title": "Essential",
        "summary": "Untuk kebutuhan awal technical consultation dengan satu tujuan utama, alur terbatas, dan dependensi teknis yang masih sederhana.",
        "indicators": [
          "Satu workflow atau outcome utama",
          "Jumlah halaman, screen, endpoint, atau modul terbatas",
          "Data dan aturan bisnis masih sederhana",
          "Sedikit atau tanpa integrasi eksternal"
        ],
        "escalationSignals": [
          "Membutuhkan beberapa role atau approval",
          "Data harus tersinkron dengan sistem lain",
          "Scope mulai mencakup dashboard, laporan, atau automation",
          "Requirement belum cukup jelas untuk langsung dieksekusi"
        ],
        "startingPrice": "300000",
        "sortOrder": 10
      },
      {
        "code": "ADVANCED",
        "title": "Advanced",
        "summary": "Untuk technical consultation yang sudah melibatkan beberapa workflow, data online, role dasar, atau integrasi terpilih.",
        "indicators": [
          "Beberapa halaman, screen, endpoint, atau modul saling terhubung",
          "Menggunakan database dan pengelolaan data aktif",
          "Memerlukan autentikasi, dashboard, atau role dasar",
          "Ada integrasi eksternal dengan alur yang terdefinisi"
        ],
        "escalationSignals": [
          "Role, approval, dan permission semakin kompleks",
          "Membutuhkan real-time, payment, maps, hardware, atau multi-branch",
          "Ada migrasi data besar atau dependency sistem lama",
          "Target performa, security, atau availability lebih tinggi"
        ],
        "startingPrice": "1000000",
        "sortOrder": 20
      },
      {
        "code": "PREMIUM",
        "title": "Premium",
        "summary": "Untuk technical consultation dengan workflow lintas peran, integrasi lanjutan, kebutuhan arsitektur khusus, atau risiko delivery yang lebih tinggi.",
        "indicators": [
          "Banyak modul dan workflow saling bergantung",
          "Multi-role dengan permission dan approval berlapis",
          "Integrasi lanjutan atau data lintas sistem",
          "Ada kebutuhan performa, keamanan, audit, atau skalabilitas"
        ],
        "escalationSignals": [
          "Scope perlu dibagi ke beberapa phase delivery",
          "Membutuhkan discovery atau technical assessment khusus",
          "Ada kewajiban compliance, data sensitif, atau provider dependency",
          "Estimasi tidak aman ditentukan sebelum validasi arsitektur"
        ],
        "startingPrice": "3000000",
        "sortOrder": 30
      }
    ]
  },
  {
    "sourceCategory": "Maintenance & Technical Support",
    "typeSlug": "maintenance-technical-support",
    "category": "Maintenance & Technical Support",
    "title": "Website Maintenance",
    "slug": "website-maintenance",
    "matchSlugs": [
      "website-maintenance"
    ],
    "summary": "Pemeliharaan website untuk update terarah, pengecekan, dan penanganan issue sesuai scope.",
    "description": "Pemeliharaan website untuk update terarah, pengecekan, dan penanganan issue sesuai scope. Detail scope, deliverables, timeline, revisi, provider cost, dan harga final dikonfirmasi melalui discovery dan quotation Owner.",
    "startingPrice": "500000",
    "deliveryEstimate": null,
    "revisionGuidance": "Ditetapkan melalui quotation",
    "deliverables": [
      "Scope yang disepakati melalui quotation",
      "Handoff sesuai kebutuhan project"
    ],
    "technologies": [
      "Discovery",
      "Implementation",
      "Technical handoff"
    ],
    "searchAliases": [
      "Website Maintenance",
      "Maintenance & Technical Support"
    ],
    "levels": [
      {
        "code": "ESSENTIAL",
        "title": "Essential",
        "summary": "Untuk kebutuhan awal website maintenance dengan satu tujuan utama, alur terbatas, dan dependensi teknis yang masih sederhana.",
        "indicators": [
          "Satu workflow atau outcome utama",
          "Jumlah halaman, screen, endpoint, atau modul terbatas",
          "Data dan aturan bisnis masih sederhana",
          "Sedikit atau tanpa integrasi eksternal"
        ],
        "escalationSignals": [
          "Membutuhkan beberapa role atau approval",
          "Data harus tersinkron dengan sistem lain",
          "Scope mulai mencakup dashboard, laporan, atau automation",
          "Requirement belum cukup jelas untuk langsung dieksekusi"
        ],
        "startingPrice": "500000",
        "sortOrder": 10
      },
      {
        "code": "ADVANCED",
        "title": "Advanced",
        "summary": "Untuk website maintenance yang sudah melibatkan beberapa workflow, data online, role dasar, atau integrasi terpilih.",
        "indicators": [
          "Beberapa halaman, screen, endpoint, atau modul saling terhubung",
          "Menggunakan database dan pengelolaan data aktif",
          "Memerlukan autentikasi, dashboard, atau role dasar",
          "Ada integrasi eksternal dengan alur yang terdefinisi"
        ],
        "escalationSignals": [
          "Role, approval, dan permission semakin kompleks",
          "Membutuhkan real-time, payment, maps, hardware, atau multi-branch",
          "Ada migrasi data besar atau dependency sistem lama",
          "Target performa, security, atau availability lebih tinggi"
        ],
        "startingPrice": "1500000",
        "sortOrder": 20
      },
      {
        "code": "PREMIUM",
        "title": "Premium",
        "summary": "Untuk website maintenance dengan workflow lintas peran, integrasi lanjutan, kebutuhan arsitektur khusus, atau risiko delivery yang lebih tinggi.",
        "indicators": [
          "Banyak modul dan workflow saling bergantung",
          "Multi-role dengan permission dan approval berlapis",
          "Integrasi lanjutan atau data lintas sistem",
          "Ada kebutuhan performa, keamanan, audit, atau skalabilitas"
        ],
        "escalationSignals": [
          "Scope perlu dibagi ke beberapa phase delivery",
          "Membutuhkan discovery atau technical assessment khusus",
          "Ada kewajiban compliance, data sensitif, atau provider dependency",
          "Estimasi tidak aman ditentukan sebelum validasi arsitektur"
        ],
        "startingPrice": "4000000",
        "sortOrder": 30
      }
    ]
  },
  {
    "sourceCategory": "Maintenance & Technical Support",
    "typeSlug": "maintenance-technical-support",
    "category": "Maintenance & Technical Support",
    "title": "Application Maintenance",
    "slug": "application-maintenance",
    "matchSlugs": [],
    "summary": "Pemeliharaan aplikasi web, Android, atau desktop berdasarkan backlog dan prioritas.",
    "description": "Pemeliharaan aplikasi web, Android, atau desktop berdasarkan backlog dan prioritas. Detail scope, deliverables, timeline, revisi, provider cost, dan harga final dikonfirmasi melalui discovery dan quotation Owner.",
    "startingPrice": "1000000",
    "deliveryEstimate": null,
    "revisionGuidance": "Ditetapkan melalui quotation",
    "deliverables": [
      "Scope yang disepakati melalui quotation",
      "Handoff sesuai kebutuhan project"
    ],
    "technologies": [
      "Discovery",
      "Implementation",
      "Technical handoff"
    ],
    "searchAliases": [
      "Application Maintenance",
      "Maintenance & Technical Support"
    ],
    "levels": [
      {
        "code": "ESSENTIAL",
        "title": "Essential",
        "summary": "Untuk kebutuhan awal application maintenance dengan satu tujuan utama, alur terbatas, dan dependensi teknis yang masih sederhana.",
        "indicators": [
          "Satu workflow atau outcome utama",
          "Jumlah halaman, screen, endpoint, atau modul terbatas",
          "Data dan aturan bisnis masih sederhana",
          "Sedikit atau tanpa integrasi eksternal"
        ],
        "escalationSignals": [
          "Membutuhkan beberapa role atau approval",
          "Data harus tersinkron dengan sistem lain",
          "Scope mulai mencakup dashboard, laporan, atau automation",
          "Requirement belum cukup jelas untuk langsung dieksekusi"
        ],
        "startingPrice": "1000000",
        "sortOrder": 10
      },
      {
        "code": "ADVANCED",
        "title": "Advanced",
        "summary": "Untuk application maintenance yang sudah melibatkan beberapa workflow, data online, role dasar, atau integrasi terpilih.",
        "indicators": [
          "Beberapa halaman, screen, endpoint, atau modul saling terhubung",
          "Menggunakan database dan pengelolaan data aktif",
          "Memerlukan autentikasi, dashboard, atau role dasar",
          "Ada integrasi eksternal dengan alur yang terdefinisi"
        ],
        "escalationSignals": [
          "Role, approval, dan permission semakin kompleks",
          "Membutuhkan real-time, payment, maps, hardware, atau multi-branch",
          "Ada migrasi data besar atau dependency sistem lama",
          "Target performa, security, atau availability lebih tinggi"
        ],
        "startingPrice": "3000000",
        "sortOrder": 20
      },
      {
        "code": "PREMIUM",
        "title": "Premium",
        "summary": "Untuk application maintenance dengan workflow lintas peran, integrasi lanjutan, kebutuhan arsitektur khusus, atau risiko delivery yang lebih tinggi.",
        "indicators": [
          "Banyak modul dan workflow saling bergantung",
          "Multi-role dengan permission dan approval berlapis",
          "Integrasi lanjutan atau data lintas sistem",
          "Ada kebutuhan performa, keamanan, audit, atau skalabilitas"
        ],
        "escalationSignals": [
          "Scope perlu dibagi ke beberapa phase delivery",
          "Membutuhkan discovery atau technical assessment khusus",
          "Ada kewajiban compliance, data sensitif, atau provider dependency",
          "Estimasi tidak aman ditentukan sebelum validasi arsitektur"
        ],
        "startingPrice": "7500000",
        "sortOrder": 30
      }
    ]
  },
  {
    "sourceCategory": "Maintenance & Technical Support",
    "typeSlug": "maintenance-technical-support",
    "category": "Maintenance & Technical Support",
    "title": "Bug Fix & Technical Recovery",
    "slug": "bug-fix-and-technical-recovery",
    "matchSlugs": [],
    "summary": "Diagnosis dan perbaikan masalah teknis yang memiliki gejala dan akses yang dapat diperiksa.",
    "description": "Diagnosis dan perbaikan masalah teknis yang memiliki gejala dan akses yang dapat diperiksa. Detail scope, deliverables, timeline, revisi, provider cost, dan harga final dikonfirmasi melalui discovery dan quotation Owner.",
    "startingPrice": "300000",
    "deliveryEstimate": null,
    "revisionGuidance": "Ditetapkan melalui quotation",
    "deliverables": [
      "Scope yang disepakati melalui quotation",
      "Handoff sesuai kebutuhan project"
    ],
    "technologies": [
      "Discovery",
      "Implementation",
      "Technical handoff"
    ],
    "searchAliases": [
      "Bug Fix & Technical Recovery",
      "Maintenance & Technical Support"
    ],
    "levels": [
      {
        "code": "ESSENTIAL",
        "title": "Essential",
        "summary": "Untuk kebutuhan awal bug fix & technical recovery dengan satu tujuan utama, alur terbatas, dan dependensi teknis yang masih sederhana.",
        "indicators": [
          "Satu workflow atau outcome utama",
          "Jumlah halaman, screen, endpoint, atau modul terbatas",
          "Data dan aturan bisnis masih sederhana",
          "Sedikit atau tanpa integrasi eksternal"
        ],
        "escalationSignals": [
          "Membutuhkan beberapa role atau approval",
          "Data harus tersinkron dengan sistem lain",
          "Scope mulai mencakup dashboard, laporan, atau automation",
          "Requirement belum cukup jelas untuk langsung dieksekusi"
        ],
        "startingPrice": "300000",
        "sortOrder": 10
      },
      {
        "code": "ADVANCED",
        "title": "Advanced",
        "summary": "Untuk bug fix & technical recovery yang sudah melibatkan beberapa workflow, data online, role dasar, atau integrasi terpilih.",
        "indicators": [
          "Beberapa halaman, screen, endpoint, atau modul saling terhubung",
          "Menggunakan database dan pengelolaan data aktif",
          "Memerlukan autentikasi, dashboard, atau role dasar",
          "Ada integrasi eksternal dengan alur yang terdefinisi"
        ],
        "escalationSignals": [
          "Role, approval, dan permission semakin kompleks",
          "Membutuhkan real-time, payment, maps, hardware, atau multi-branch",
          "Ada migrasi data besar atau dependency sistem lama",
          "Target performa, security, atau availability lebih tinggi"
        ],
        "startingPrice": "1200000",
        "sortOrder": 20
      },
      {
        "code": "PREMIUM",
        "title": "Premium",
        "summary": "Untuk bug fix & technical recovery dengan workflow lintas peran, integrasi lanjutan, kebutuhan arsitektur khusus, atau risiko delivery yang lebih tinggi.",
        "indicators": [
          "Banyak modul dan workflow saling bergantung",
          "Multi-role dengan permission dan approval berlapis",
          "Integrasi lanjutan atau data lintas sistem",
          "Ada kebutuhan performa, keamanan, audit, atau skalabilitas"
        ],
        "escalationSignals": [
          "Scope perlu dibagi ke beberapa phase delivery",
          "Membutuhkan discovery atau technical assessment khusus",
          "Ada kewajiban compliance, data sensitif, atau provider dependency",
          "Estimasi tidak aman ditentukan sebelum validasi arsitektur"
        ],
        "startingPrice": "4000000",
        "sortOrder": 30
      }
    ]
  }
];
