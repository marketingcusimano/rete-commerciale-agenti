<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CARABOT NATALINO - Dashboard Executive</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: #f8fafc;
          color: #1f2937;
          line-height: 1.6;
          transition: all 0.3s ease;
        }

        body.dark-mode {
          background: #0f172a;
          color: #f8fafc;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
        }

        /* Header */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .header-info h1 {
          font-size: 2.5rem;
          font-weight: 900;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        body.dark-mode .header-info h1 {
          color: #f8fafc;
        }

        .header-info p {
          color: #6b7280;
          font-size: 1.1rem;
          font-weight: 500;
        }

        .theme-toggle {
          background: #374151;
          color: white;
          border: none;
          padding: 0.75rem;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1.25rem;
          width: 50px;
          height: 50px;
        }

        .theme-toggle:hover {
          background: #4b5563;
          transform: scale(1.1);
        }

        /* Status Bar */
        .status-bar {
          display: flex;
          align-items: center;
          gap: 2rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .status-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          color: #6b7280;
        }

        .status-item i {
          color: #3b82f6;
        }

        .status-item strong {
          color: #1f2937;
        }

        body.dark-mode .status-item strong {
          color: #f8fafc;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* Filter Section */
        .filter-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .filter-label {
          font-weight: 600;
          color: #374151;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        body.dark-mode .filter-label {
          color: #d1d5db;
        }

        .province-selector {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0.75rem;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .province-selector:hover {
          background: #2563eb;
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3);
        }

        /* Cards Grid */
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .card {
          background: white;
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          border: 1px solid #e5e7eb;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        body.dark-mode .card {
          background: #1e293b;
          border-color: #334155;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
        }

        body.dark-mode .card:hover {
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .card-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .card-badge {
          background: #dcfce7;
          color: #16a34a;
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.75rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .card-badge.warning {
          background: #fef3c7;
          color: #d97706;
        }

        .card-value {
          font-size: 2.5rem;
          font-weight: 900;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        body.dark-mode .card-value {
          color: #f8fafc;
        }

        .card-subtitle {
          color: #6b7280;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }

        .progress-section {
          background: #f8fafc;
          padding: 1rem;
          border-radius: 0.75rem;
          margin-top: 1rem;
        }

        body.dark-mode .progress-section {
          background: #0f172a;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .progress-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #1f2937;
        }

        body.dark-mode .progress-label {
          color: #f8fafc;
        }

        .progress-value {
          font-size: 0.875rem;
          font-weight: 700;
          color: #6b7280;
        }

        .progress-bar-container {
          width: 100%;
          height: 8px;
          background: #e5e7eb;
          border-radius: 1rem;
          overflow: hidden;
        }

        body.dark-mode .progress-bar-container {
          background: #374151;
        }

        .progress-bar {
          height: 100%;
          border-radius: 1rem;
          transition: width 2s ease-in-out;
          position: relative;
        }

        .progress-bar.green {
          background: linear-gradient(90deg, #10b981, #34d399);
        }

        .progress-bar.blue {
          background: linear-gradient(90deg, #3b82f6, #60a5fa);
        }

        .progress-bar.orange {
          background: linear-gradient(90deg, #f59e0b, #fbbf24);
        }

        .progress-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 0.75rem;
          font-size: 0.875rem;
        }

        .progress-remaining {
          color: #6b7280;
        }

        .progress-percentage {
          color: #3b82f6;
          font-weight: 700;
        }

        /* Loading States */
        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 200px;
          color: #6b7280;
        }

        .loading-spinner {
          animation: spin 1s linear infinite;
          font-size: 2rem;
          margin-right: 1rem;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .error-container {
          background: #fee2e2;
          color: #dc2626;
          padding: 1rem;
          border-radius: 0.75rem;
          text-align: center;
          margin: 2rem 0;
        }

        body.dark-mode .error-container {
          background: #7f1d1d;
          color: #fca5a5;
        }

        /* Province Selection Popup */
        .popup-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
          z-index: 1000;
          padding: 1rem;
          display: none;
          align-items: center;
          justify-content: center;
        }

        .popup-content {
          background: white;
          border-radius: 1rem;
          max-width: 400px;
          margin: 2rem auto;
          padding: 2rem;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }

        body.dark-mode .popup-content {
          background: #1e293b;
          color: #f8fafc;
        }

        .popup-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .province-options {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .province-option {
          width: 100%;
          padding: 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.75rem;
          background: white;
          text-align: left;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        body.dark-mode .province-option {
          background: #334155;
          border-color: #475569;
          color: #f8fafc;
        }

        .province-option:hover {
          border-color: #3b82f6;
          background: #f0f9ff;
        }

        body.dark-mode .province-option:hover {
          background: #475569;
        }

        .province-option.selected {
          border-color: #3b82f6;
          background: #f0f9ff;
        }

        .close-popup-btn {
          margin-top: 1.5rem;
          padding: 0.75rem 1.5rem;
          background: #374151;
          color: white;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          width: 100%;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .container {
            padding: 1rem;
          }
          
          .header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .header-info h1 {
            font-size: 2rem;
          }
          
          .cards-grid {
            grid-template-columns: 1fr;
          }
          
          .card-value {
            font-size: 2rem;
          }
        }
    </style>
</head>
<body class="light-mode">
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="header-info">
                <h1>CARABOT NATALINO</h1>
                <p>Dashboard Performance Vendite</p>
            </div>
            <button class="theme-toggle" id="theme-toggle">
                <i class="fas fa-moon"></i>
            </button>
        </div>

        <!-- Status Bar -->
        <div class="status-bar">
            <div class="status-item">
                <i class="fas fa-id-card"></i>
                <span><strong>ID:</strong> 631.00238</span>
            </div>
            <div class="status-item">
                <i class="fas fa-calendar"></i>
                <span><strong>Gen - Ago 2025</strong> (8 mesi)</span>
            </div>
            <div class="status-item">
                <div class="status-dot" id="connection-dot"></div>
                <span id="connection-status">Caricamento...</span>
            </div>
        </div>

        <!-- Filter Section -->
        <div class="filter-section">
            <div>
                <div class="filter-label">Filtro Territorio</div>
                <div style="color: #3b82f6; font-weight: 600; margin-top: 0.25rem;" id="current-filter">Tutte le Province</div>
            </div>
            <button class="province-selector" id="province-selector">
                <i class="fas fa-chevron-down"></i>
                <span>Selezione Provincia</span>
            </button>
        </div>

        <!-- Loading State -->
        <div id="loading-state" class="loading-container">
            <i class="fas fa-sync-alt loading-spinner"></i>
            <span>Caricamento dati CSV...</span>
        </div>

        <!-- Error State -->
        <div id="error-state" class="error-container" style="display: none;">
            <i class="fas fa-exclamation-triangle"></i>
            <strong>Errore di caricamento</strong>
            <p id="error-message">Impossibile caricare i dati CSV</p>
        </div>

        <!-- Main Content -->
        <div id="main-content" style="display: none;">
            <div class="cards-grid">
                <!-- Fatturato Card -->
                <div class="card">
                    <div class="card-header">
                        <div class="card-title">Fatturato 2025</div>
                        <div class="card-badge">
                            <i class="fas fa-arrow-up"></i>
                            <span id="growth-badge">+0%</span>
                        </div>
                    </div>
                    <div class="card-value" id="fatturato-value">€0k</div>
                    <div class="card-subtitle">vs 2024: <strong id="fatturato-vs">€0k</strong></div>
                    
                    <div class="progress-section">
                        <div class="progress-header">
                            <div class="progress-label">Obiettivo Fatturato</div>
                            <div class="progress-value" id="obiettivo-fatturato">€0k</div>
                        </div>
                        <div class="progress-bar-container">
                            <div class="progress-bar green" id="progress-fatturato" style="width: 0%;"></div>
                        </div>
                        <div class="progress-footer">
                            <div class="progress-remaining">Mancano: <strong id="fatturato-remaining">€0k</strong></div>
                            <div class="progress-percentage" id="fatturato-percentage">0%</div>
                        </div>
                    </div>
                </div>

                <!-- Obiettivo Card -->
                <div class="card" id="obiettivo-card">
                    <div class="card-header">
                        <div class="card-title">Obiettivo 2025</div>
                        <div class="card-badge" id="obiettivo-badge">
                            <span id="obiettivo-percentage">0%</span>
                        </div>
                    </div>
                    <div class="card-value" id="obiettivo-value">€0k</div>
                    <div class="card-subtitle">Da raggiungere: <strong id="obiettivo-remaining">€0k</strong></div>
                    
                    <div class="progress-section">
                        <div class="progress-header">
                            <div class="progress-label">Progressione Obiettivo</div>
                            <div class="progress-value" id="obiettivo-target">€0k</div>
                        </div>
                        <div class="progress-bar-container">
                            <div class="progress-bar blue" id="progress-obiettivo" style="width: 0%;"></div>
                        </div>
                        <div class="progress-footer">
                            <div class="progress-remaining">Mancano: <strong id="obiettivo-mancano">€0k</strong></div>
                            <div class="progress-percentage" id="obiettivo-perc-display">0%</div>
                        </div>
                    </div>
                </div>

                <!-- Clienti Attivi Card -->
                <div class="card">
                    <div class="card-header">
                        <div class="card-title">Clienti Attivi</div>
                    </div>
                    <div class="card-value" id="clienti-count">0</div>
                    <div class="card-subtitle">Obiettivo: <span id="clienti-obiettivo">0</span></div>
                    
                    <div class="progress-section">
                        <div class="progress-header">
                            <div class="progress-label">Obiettivo Clienti</div>
                            <div class="progress-value" id="clienti-target-value">0</div>
                        </div>
                        <div class="progress-bar-container">
                            <div class="progress-bar orange" id="progress-clienti" style="width: 0%;"></div>
                        </div>
                        <div class="progress-footer">
                            <div class="progress-remaining">Mancano: <strong id="clienti-mancanti">0 clienti</strong></div>
                            <div class="progress-percentage" id="clienti-perc-display">0%</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Province Selection Popup -->
        <div id="province-popup" class="popup-overlay">
            <div class="popup-content">
                <h3 class="popup-title">Seleziona Provincia</h3>
                <div class="province-options" id="province-options">
                    <button class="province-option" data-province="all">
                        <strong>Tutte le Province</strong>
                        <div style="color: #6b7280; font-size: 0.875rem; margin-top: 0.25rem;" id="all-desc">€0k • 0 clienti</div>
                    </button>
                    <button class="province-option" data-province="LT">
                        <strong>Latina (LT)</strong>
                        <div style="color: #6b7280; font-size: 0.875rem; margin-top: 0.25rem;" id="lt-desc">€0k • 0 clienti</div>
                    </button>
                    <button class="province-option" data-province="RM">
                        <strong>Roma (RM)</strong>
                        <div style="color: #6b7280; font-size: 0.875rem; margin-top: 0.25rem;" id="rm-desc">€0k • 0 clienti</div>
                    </button>
                </div>
                <button id="close-popup" class="close-popup-btn">Chiudi</button>
            </div>
        </div>
    </div>

    <script>
        class DashboardManager {
            constructor() {
                this.csvData = null;
                this.selectedProvince = 'all';
                this.isLoading = false;
                this.csvFileNames = [
                    '631.00238_CARABOT-NATALINO.csv',
                    '631.00238_CARABOT NATALINO.csv'
                ];
                this.init();
            }

            init() {
                this.setupEventListeners();
                this.loadData();
            }

            setupEventListeners() {
                // Theme toggle
                document.getElementById('theme-toggle').addEventListener('click', () => this.toggleTheme());
                
                // Province selector
                document.getElementById('province-selector').addEventListener('click', () => this.showProvincePopup());
                document.getElementById('close-popup').addEventListener('click', () => this.hideProvincePopup());
                
                // Province options
                document.addEventListener('click', (e) => {
                    if (e.target.closest('.province-option')) {
                        const province = e.target.closest('.province-option').dataset.province;
                        this.selectProvince(province);
                    }
                });

                // Close popup on backdrop click
                document.getElementById('province-popup').addEventListener('click', (e) => {
                    if (e.target.id === 'province-popup') {
                        this.hideProvincePopup();
                    }
                });
            }

            toggleTheme() {
                const body = document.body;
                const icon = document.querySelector('#theme-toggle i');
                
                if (body.classList.contains('light-mode')) {
                    body.classList.remove('light-mode');
                    body.classList.add('dark-mode');
                    icon.className = 'fas fa-sun';
                } else {
                    body.classList.remove('dark-mode');
                    body.classList.add('light-mode');
                    icon.className = 'fas fa-moon';
                }
            }

            showProvincePopup() {
                if (this.csvData) {
                    this.updateProvinceOptions();
                    document.getElementById('province-popup').style.display = 'flex';
                }
            }

            hideProvincePopup() {
                document.getElementById('province-popup').style.display = 'none';
            }

            selectProvince(province) {
                this.selectedProvince = province;
                
                const labels = { 
                    all: 'Tutte le Province', 
                    LT: 'Provincia Latina', 
                    RM: 'Provincia Roma' 
                };
                
                document.getElementById('current-filter').textContent = labels[province] || 'Tutte le Province';
                this.hideProvincePopup();
                this.updateDashboard();
            }

            async loadData() {
                this.isLoading = true;
                this.showLoading();

                try {
                    const csvText = await this.tryLoadCSV();
                    this.csvData = this.parseCSV(csvText);
                    
                    if (!this.csvData) {
                        throw new Error('Errore nel parsing del CSV - struttura non riconosciuta');
                    }

                    console.log('CSV caricato con successo:', this.csvData);
                    this.showSuccess();
                    this.updateDashboard();
                    
                } catch (error) {
                    console.error('Errore caricamento CSV:', error);
                    this.showError(error.message);
                } finally {
                    this.isLoading = false;
                }
            }

            async tryLoadCSV() {
                const candidates = this.buildCandidateUrls();
                let csvText = null;
                
                console.log('Tentativo caricamento CSV da questi URL:', candidates);
                
                for (const url of candidates) {
                    try {
                        console.log('Tentativo:', url);
                        
                        const response = await fetch(url + '?t=' + Date.now(), {
                            cache: 'no-cache'
                        });
                        
                        console.log(`Risposta per ${url}:`, response.status, response.ok);
                        if (response.ok) {
                            csvText = await response.text();
                            if (csvText && csvText.trim().length > 0) {
                                console.log('CSV caricato con successo da:', url);
                                return csvText;
                            }
                        }
                    } catch (e) {
                        console.warn('Fallito caricamento da:', url, e.message);
                    }
                }

                throw new Error('File CSV non trovato in nessuno degli URL candidati');
            }

            buildCandidateUrls() {
                const { pathname, origin } = window.location;
                const segs = pathname.split('/').filter(Boolean);
                const repoSlug = segs.length ? segs[0] : '';

                const bases = [
                    './',
                    '',
                    pathname.endsWith('/') ? pathname : pathname.replace(/[^/]*$/, ''),
                    repoSlug ? `/${repoSlug}/` : '/'
                ];

                const urls = [];
                for (const base of bases) {
                    for (const name of this.csvFileNames) {
                        try {
                            urls.push(new URL(base + name, origin).href);
                        } catch (e) {}
                    }
                }
                return [...new Set(urls)];
            }

            parseCSV(csvText) {
                try {
                    console.log('Inizio parsing CSV...');
                    console.log('Lunghezza CSV:', csvText.length);
                    
                    // Parse OBIETTIVI section
                    const obiettiviMatch = csvText.match(/=== VERIFICA OBIETTIVI ===([\s\S]*?)===.*===/);
                    if (!obiettiviMatch) {
                        console.error('Sezione obiettivi non trovata');
                        throw new Error('Sezione obiettivi non trovata nel CSV');
                    }
                    const obiettiviText = obiettiviMatch[1];
                    console.log('Sezione obiettivi trovata:', obiettiviText.substring(0, 200));

                    // Parse GENERALE data - CORRETTO
                    const generaleMatch = obiettiviText.match(/Generale;([\d.,]+);([\d.,]+);;;(\d+);(\d+);;/);
                    if (!generaleMatch) {
                        console.error('Dati Generale non trovati in:', obiettiviText);
                        throw new Error('Dati Generale non trovati - verificare formato CSV');
                    }
                    
                    const generale = {
                        annoPrecedente: this.parseNumber(generaleMatch[1]), // 80.238,72
                        annoCorrente: this.parseNumber(generaleMatch[2]),   // 190.159,79  
                        clienti: parseInt(generaleMatch[4], 10)             // 20 (4° gruppo, non 3°)
                    };
                    console.log('Generale parsed:', generale);

                    // Parse LATINA data - CORRETTO
                    const ltMatch = obiettiviText.match(/LT;([\d.,]+);([\d.,]+);([\d.,]+);(\d+)%;(\d+);(\d+);(\d+);(\d+)%/);
                    if (!ltMatch) {
                        console.error('Dati Latina non trovati in:', obiettiviText);
                        throw new Error('Dati Latina non trovati - verificare formato CSV');
                    }
                    
                    const latinaObiettivoRaw = this.parseNumber(ltMatch[3]); // 350.000
                    const latina = {
                        annoPrecedente: this.parseNumber(ltMatch[1]),    // 79.029,16
                        annoCorrente: this.parseNumber(ltMatch[2]),      // 82.389,23
                        obiettivo: latinaObiettivoRaw,                   // 350000 (già in euro)
                        percentualeObiettivo: parseInt(ltMatch[4], 10),  // 58%
                        clientiPrecedenti: parseInt(ltMatch[5], 10),     // 23
                        clientiCorrente: parseInt(ltMatch[6], 10),       // 18  
                        obiettivoClienti: parseInt(ltMatch[7], 10),      // 35
                        percentualeClienti: parseInt(ltMatch[8], 10)     // 51%
                    };
                    console.log('Latina parsed:', latina);

                    // Parse ROMA data
                    const clientiMatch = csvText.match(/=== CLIENTI PER PROVINCIA ===([\s\S]*?)===.*===/);
                    let roma = { annoCorrente: 0, clienti: 0 };
                    if (clientiMatch) {
                        const clientiText = clientiMatch[1];
                        console.log('Sezione clienti per provincia:', clientiText.substring(0, 100));
                        
                        const rmMatch = clientiText.match(/RM;(\d+);([\d.,]+);;;;;;/);
                        if (rmMatch) {
                            roma = {
                                annoCorrente: this.parseNumber(rmMatch[2]), // 7.770,56
                                clienti: parseInt(rmMatch[1], 10)           // 2
                            };
                            console.log('Roma parsed:', roma);
                        }
                    }

                    // Parse DETTAGLIO VENDITE
                    const dettaglioMatch = csvText.match(/=== DETTAGLIO VENDITE PER CLIENTE ===([\s\S]*?)===.*===/);
                    let vendite = [];
                    if (dettaglioMatch) {
                        const dettaglioText = dettaglioMatch[1];
                        console.log('Sezione dettaglio vendite trovata');
                        
                        const lines = dettaglioText.split('\n').filter(line => {
                            const trimmed = line.trim();
                            return trimmed && 
                                   !trimmed.includes('===') && 
                                   !trimmed.includes('Provincia;Ragione Sociale Cliente') &&
                                   line.includes(';') && 
                                   line.split(';').length >= 4;
                        });
                        
                        console.log(`Trovate ${lines.length} righe di vendite`);
                        
                        // Raggruppa per cliente per ottenere i totali
                        const clienteTotals = new Map();
                        lines.forEach(line => {
                            const parts = line.split(';');
                            if (parts.length >= 4) {
                                const provincia = parts[0]?.trim();
                                const cliente = parts[1]?.trim();
                                const categoria = parts[2]?.trim();
                                const fatturato = this.parseNumber(parts[3]);
                                
                                if (cliente && fatturato > 0) {
                                    if (!clienteTotals.has(cliente)) {
                                        clienteTotals.set(cliente, {
                                            provincia,
                                            cliente,
                                            categoria,
                                            fatturato: 0
                                        });
                                    }
                                    clienteTotals.get(cliente).fatturato += fatturato;
                                }
                            }
                        });
                        
                        vendite = Array.from(clienteTotals.values())
                            .sort((a, b) => b.fatturato - a.fatturato)
                            .slice(0, 10);
                            
                        console.log(`Top 10 clienti parsed:`, vendite.length);
                    }

                    // Parse RIEPILOGO CATEGORIE
                    const categorieMatch = csvText.match(/=== RIEPILOGO PER CATEGORIA ===([\s\S]*?)===.*===/);
                    let categorie = [];
                    if (categorieMatch) {
                        const categorieText = categorieMatch[1];
                        console.log('Sezione categorie trovata');
                        
                        const lines = categorieText.split('\n').filter(line => {
                            const trimmed = line.trim();
                            return trimmed && 
                                   !trimmed.includes('===') && 
                                   !trimmed.includes('Categoria;Importo Totale') &&
                                   line.includes(';') && 
                                   line.split(';').length >= 2;
                        });
                        
                        lines.forEach(line => {
                            const parts = line.split(';');
                            if (parts.length >= 2) {
                                const nome = parts[0]?.trim();
                                const importo = this.parseNumber(parts[1]);
                                
                                if (nome && importo > 0) {
                                    categorie.push({ nome, importo });
                                }
                            }
                        });
                        
                        console.log(`${categorie.length} categorie parsed`);
                    }

                    const result = { 
                        generale, 
                        latina, 
                        roma, 
                        vendite, 
                        categorie,
                        timestamp: new Date() 
                    };
                    
                    console.log('Parsing CSV completato con successo:', result);
                    return result;
                    
                } catch (e) {
                    console.error('Errore Parsing CSV:', e);
                    console.error('Contenuto CSV sample:', csvText.substring(0, 500));
                    return null;
                }
            }

            parseNumber(input) {
                if (typeof input === 'number') return input;
                if (!input) return 0;
                const cleaned = String(input)
                    .replace(/\s+/g, '')
                    .replace(/€/g, '')
                    .replace(/\./g, '')
                    .replace(/,/g, '.');
                const n = Number(cleaned);
                return Number.isFinite(n) ? n : 0;
            }

            formatEuroK(value) {
                if (!value) return '€0k';
                const k = Math.round(value / 1000);
                return `€${k}k`;
            }

            calculateGrowthPercentage(current, previous) {
                if (!previous) return '0.0';
                return (((current - previous) / previous) * 100).toFixed(1);
            }

            getDisplayData() {
                if (!this.csvData) return null;
                
                switch (this.selectedProvince) {
                    case 'all':
                        const growthGeneral = this.calculateGrowthPercentage(
                            this.csvData.generale.annoCorrente, 
                            this.csvData.generale.annoPrecedente
                        );
                        return {
                            fatturato: this.csvData.generale.annoCorrente,
                            fatturatoVs: this.csvData.generale.annoPrecedente,
                            crescita: growthGeneral,
                            clienti: this.csvData.generale.clienti,
                            obiettivo: null, // Generale non ha obiettivo
                            percentualeObiettivo: null,
                            obiettivoClienti: null,
                            percentualeClienti: null
                        };
                    case 'LT':
                        const growthLT = this.calculateGrowthPercentage(
                            this.csvData.latina.annoCorrente, 
                            this.csvData.latina.annoPrecedente
                        );
                        return {
                            fatturato: this.csvData.latina.annoCorrente,
                            fatturatoVs: this.csvData.latina.annoPrecedente,
                            crescita: growthLT,
                            clienti: this.csvData.latina.clientiCorrente,
                            obiettivo: this.csvData.latina.obiettivo,
                            percentualeObiettivo: this.csvData.latina.percentualeObiettivo,
                            obiettivoClienti: this.csvData.latina.obiettivoClienti,
                            percentualeClienti: this.csvData.latina.percentualeClienti
                        };
                    case 'RM':
                        return {
                            fatturato: this.csvData.roma.annoCorrente,
                            fatturatoVs: 0,
                            crescita: '0.0',
                            clienti: this.csvData.roma.clienti,
                            obiettivo: null,
                            percentualeObiettivo: null,
                            obiettivoClienti: null,
                            percentualeClienti: null
                        };
                    default:
                        return null;
                }
            }

            updateDashboard() {
                const data = this.getDisplayData();
                if (!data) return;

                // Update Fatturato Card
                document.getElementById('fatturato-value').textContent = this.formatEuroK(data.fatturato);
                document.getElementById('fatturato-vs').textContent = this.formatEuroK(data.fatturatoVs);
                document.getElementById('growth-badge').textContent = `+${data.crescita}%`;
                
                // Update Obiettivo Card
                const obiettivoCard = document.getElementById('obiettivo-card');
                if (data.obiettivo && data.percentualeObiettivo) {
                    obiettivoCard.style.display = 'block';
                    
                    document.getElementById('obiettivo-value').textContent = this.formatEuroK(data.obiettivo);
                    document.getElementById('obiettivo-percentage').textContent = `${data.percentualeObiettivo}%`;
                    document.getElementById('obiettivo-remaining').textContent = this.formatEuroK(Math.max(0, data.obiettivo - data.fatturato));
                    document.getElementById('obiettivo-fatturato').textContent = this.formatEuroK(data.obiettivo);
                    document.getElementById('fatturato-remaining').textContent = this.formatEuroK(Math.max(0, data.obiettivo - data.fatturato));
                    document.getElementById('fatturato-percentage').textContent = `${data.percentualeObiettivo}%`;
                    document.getElementById('obiettivo-target').textContent = this.formatEuroK(data.obiettivo);
                    document.getElementById('obiettivo-mancano').textContent = this.formatEuroK(Math.max(0, data.obiettivo - data.fatturato));
                    document.getElementById('obiettivo-perc-display').textContent = `${data.percentualeObiettivo}%`;
                    
                    // Update badge color
                    const badge = document.getElementById('obiettivo-badge');
                    if (data.percentualeObiettivo >= 80) {
                        badge.className = 'card-badge';
                    } else {
                        badge.className = 'card-badge warning';
                    }
                    
                    // Animate progress bars
                    setTimeout(() => {
                        document.getElementById('progress-fatturato').style.width = `${Math.min(100, data.percentualeObiettivo)}%`;
                        document.getElementById('progress-obiettivo').style.width = `${Math.min(100, data.percentualeObiettivo)}%`;
                    }, 300);
                } else {
                    obiettivoCard.style.display = 'none';
                }

                // Update Clienti Card
                document.getElementById('clienti-count').textContent = data.clienti;
                
                if (data.obiettivoClienti && data.percentualeClienti) {
                    document.getElementById('clienti-obiettivo').textContent = data.obiettivoClienti;
                    document.getElementById('clienti-target-value').textContent = data.obiettivoClienti;
                    document.getElementById('clienti-mancanti').textContent = `${Math.max(0, data.obiettivoClienti - data.clienti)} clienti`;
                    document.getElementById('clienti-perc-display').textContent = `${data.percentualeClienti}%`;
                    
                    setTimeout(() => {
                        document.getElementById('progress-clienti').style.width = `${Math.min(100, data.percentualeClienti)}%`;
                    }, 400);
                } else {
                    document.getElementById('clienti-obiettivo').textContent = 'N/A';
                    document.getElementById('clienti-target-value').textContent = 'N/A';
                    document.getElementById('clienti-mancanti').textContent = 'N/A';
                    document.getElementById('clienti-perc-display').textContent = 'N/A';
                    document.getElementById('progress-clienti').style.width = '0%';
                }
            }

            updateProvinceOptions() {
                if (!this.csvData) return;
                
                const allDesc = document.getElementById('all-desc');
                const ltDesc = document.getElementById('lt-desc');
                const rmDesc = document.getElementById('rm-desc');
                
                if (allDesc) allDesc.textContent = `${this.formatEuroK(this.csvData.generale.annoCorrente)} • ${this.csvData.generale.clienti} clienti`;
                if (ltDesc) ltDesc.textContent = `${this.formatEuroK(this.csvData.latina.annoCorrente)} • ${this.csvData.latina.clientiCorrente} clienti • Obiettivo: ${this.csvData.latina.percentualeObiettivo}%`;
                if (rmDesc) rmDesc.textContent = `${this.formatEuroK(this.csvData.roma.annoCorrente)} • ${this.csvData.roma.clienti} clienti`;
                
                // Update selected state
                document.querySelectorAll('.province-option').forEach(option => {
                    const province = option.dataset.province;
                    if (province === this.selectedProvince) {
                        option.classList.add('selected');
                    } else {
                        option.classList.remove('selected');
                    }
                });
            }

            showLoading() {
                document.getElementById('loading-state').style.display = 'block';
                document.getElementById('error-state').style.display = 'none';
                document.getElementById('main-content').style.display = 'none';
                document.getElementById('connection-status').textContent = 'Caricamento...';
                document.getElementById('connection-dot').style.background = '#3b82f6';
            }

            showError(message) {
                document.getElementById('loading-state').style.display = 'none';
                document.getElementById('error-state').style.display = 'block';
                document.getElementById('main-content').style.display = 'none';
                document.getElementById('error-message').textContent = message;
                document.getElementById('connection-status').textContent = 'Errore';
                document.getElementById('connection-dot').style.background = '#ef4444';
            }

            showSuccess() {
                document.getElementById('loading-state').style.display = 'none';
                document.getElementById('error-state').style.display = 'none';
                document.getElementById('main-content').style.display = 'block';
                document.getElementById('connection-status').textContent = 'Connesso';
                document.getElementById('connection-dot').style.background = '#10b981';
            }
        }

        // Initialize dashboard
        document.addEventListener('DOMContentLoaded', () => {
            new DashboardManager();
        });
    </script>
</body>
</html>
