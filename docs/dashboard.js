// ==================== DASHBOARD CARABOT NATALINO - GITHUB PAGES ====================
// Vanilla JS — CSV live, parser IT, formattazione "k" max 3 cifre ovunque
// CSV fisso: 631.00238_CARABOT-NATALINO.csv

class DashboardManager {
  constructor() {
    this.csvData = null;
    this.selectedProvince = 'all';
    this.isLoading = false;
    this.lastUpdate = null;
    this.updateInterval = null;

    // 🔒 Unico file CSV richiesto
    this.csvFileName = '631.00238_CARABOT-NATALINO.csv';

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadInitialData();
    this.startAutoUpdate();
  }

  // ==================== EVENT LISTENERS ====================
  setupEventListeners() {
    const byId = (id) => document.getElementById(id);

    const refreshBtn = byId('refresh-btn');
    if (refreshBtn) refreshBtn.addEventListener('click', () => this.fetchCSVData(true));

    const themeToggle = byId('theme-toggle');
    if (themeToggle) themeToggle.addEventListener('click', () => this.toggleTheme());

    const provinceFilter = byId('province-filter');
    if (provinceFilter) provinceFilter.addEventListener('click', () => this.showProvincePopup());

    const closePopup = byId('close-popup');
    if (closePopup) closePopup.addEventListener('click', () => this.hideProvincePopup());

    const popupCloseBtn = byId('popup-close-btn');
    if (popupCloseBtn) popupCloseBtn.addEventListener('click', () => this.hideProvincePopup());

    const provincePopup = byId('province-popup');
    if (provincePopup) {
      provincePopup.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'province-popup') this.hideProvincePopup();
      });
    }
  }

  // ==================== THEME MANAGEMENT ====================
  toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('theme-icon');
    if (body.classList.contains('light-mode')) {
      body.classList.remove('light-mode');
      body.classList.add('dark-mode');
      if (themeIcon) themeIcon.className = 'fas fa-sun';
    } else {
      body.classList.remove('dark-mode');
      body.classList.add('light-mode');
      if (themeIcon) themeIcon.className = 'fas fa-moon';
    }
  }

  // ==================== DATA LOADING ====================
  async loadInitialData() { await this.fetchCSVData(); }

  // Costruisce una lista di URL candidati compatibili con GitHub Pages (repo pages)
  buildCandidateUrls() {
    const { pathname, origin } = window.location;

    // directory corrente della pagina (finisce con "/")
    const dir = pathname.endsWith('/') ? pathname : pathname.replace(/[^/]*$/, '');
    // slug repo, es. "/rete-commerciale-agenti/"
    const segs = dir.split('/').filter(Boolean);
    const repoSlug = segs.length ? segs[0] : '';
    const repoBase = repoSlug ? `/${repoSlug}/` : '/';

    const bases = new Set([
      './',                 // relativo
      '',                   // solo nome file
      dir,                  // base pagina corrente
      repoBase,             // root repo pages
    ]);

    // compone URL assoluti, rimuove duplicati
    const urls = [];
    for (const base of bases) {
      try {
        const abs = new URL(base + this.csvFileName, origin).href;
        urls.push(abs);
      } catch { /* ignore */ }
    }
    return Array.from(new Set(urls));
  }

  async fetchCSVData(isManual = false) {
    if (this.isLoading) return;

    this.isLoading = true;
    this.updateLoadingState('updating');

    try {
      const cacheBuster = `?t=${Date.now()}&r=${Math.random()}`;
      const candidates = this.buildCandidateUrls();
      let lastError = null;
      let text = null;

      console.log('🔎 CSV candidate URLs:', candidates);

      for (const url of candidates) {
        const u = url + cacheBuster;
        try {
          console.log('↗️ GET', u);
          const res = await fetch(u, {
            method: 'GET',
            cache: 'no-cache',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
            },
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
          const t = await res.text();
          if (t && t.trim().length > 0) { text = t; break; }
          lastError = new Error('CSV vuoto');
        } catch (e) {
          console.warn('⚠️ Fallito', u, e);
          lastError = e;
        }
      }

      if (!text) throw lastError || new Error('Impossibile leggere il CSV');

      console.log('✅ CSV caricato, len:', text.length);
      console.log('📝 CSV head (200):', text.substring(0, 200));

      const parsedData = this.parseCSV(text);
      if (!parsedData) throw new Error('Parsing CSV fallito — controlla intestazioni/marker nel CSV');

      this.csvData = parsedData;
      this.lastUpdate = new Date();
      this.updateLoadingState('success');
      this.renderDashboard();

    } catch (error) {
      console.error('❌ Errore fetch CSV:', error);
      this.updateLoadingState('error', error && error.message ? error.message : 'Errore sconosciuto');
    } finally {
      this.isLoading = false;
    }
  }

  // ==================== CSV PARSING ====================
  parseCSV(csvText) {
    try {
      // OBIETTIVI
      const obiettiviMatch = csvText.match(/=== VERIFICA OBIETTIVI ===([\s\S]*?)===.*===/);
      if (!obiettiviMatch) throw new Error('Sezione obiettivi non trovata');
      const obiettiviText = obiettiviMatch[1];

      // GENERALE
      const generaleMatch = obiettiviText.match(/Generale;([\d.,]+);([\d.,]+);;;(\d+);(\d+);;/);
      if (!generaleMatch) throw new Error('Dati Generale non trovati');
      const generale = {
        annoPrecedente: this.parseNumber(generaleMatch[1]),
        annoCorrente: this.parseNumber(generaleMatch[2]),
        clienti: parseInt(generaleMatch[4], 10),
      };

      // LATINA
      const ltMatch = obiettiviText.match(/LT;([\d.,]+);([\d.,]+);([\d.,]+);(\d+)%;(\d+);(\d+);(\d+);(\d+)%/);
      if (!ltMatch) throw new Error('Dati Latina non trovati');
      const latinaObiettivoRaw = this.parseNumber(ltMatch[3]);
      const latina = {
        annoPrecedente: this.parseNumber(ltMatch[1]),
        annoCorrente: this.parseNumber(ltMatch[2]),
        obiettivo: latinaObiettivoRaw * 1000, // CSV in "migliaia" → euro
        percentualeObiettivo: parseInt(ltMatch[4], 10),
        clientiPrecedenti: parseInt(ltMatch[5], 10),
        clientiCorrente: parseInt(ltMatch[6], 10),
        obiettivoClienti: parseInt(ltMatch[7], 10),
      };

      // ROMA (da sezione Clienti per provincia)
      const clientiMatch = csvText.match(/=== CLIENTI PER PROVINCIA ===([\s\S]*?)===.*===/);
      let roma = { annoCorrente: 0, clienti: 0 };
      if (clientiMatch) {
        const clientiText = clientiMatch[1];
        const rmMatch = clientiText.match(/RM;(\d+);([\d.,]+);;;;;;/);
        if (rmMatch) {
          roma = {
            annoCorrente: this.parseNumber(rmMatch[2]),
            clienti: parseInt(rmMatch[1], 10),
          };
        }
      } else {
        // fallback: cerca riga RM ovunque
        const rmMatch = csvText.match(/RM;(\d+);([\d.,]+);/);
        if (rmMatch) {
          roma = {
            annoCorrente: this.parseNumber(rmMatch[2]),
            clienti: parseInt(rmMatch[1], 10),
          };
        }
      }

      // DETTAGLIO VENDITE → top 10
      let vendite = [];
      const dettaglioStart = csvText.indexOf('=== DETTAGLIO VENDITE PER CLIENTE ===');
      const dettaglioEnd = csvText.indexOf('=== RIEPILOGO PER CATEGORIA ===');

      let dettaglioSection = '';
      if (dettaglioStart !== -1 && dettaglioEnd !== -1 && dettaglioEnd > dettaglioStart) {
        dettaglioSection = csvText.substring(dettaglioStart, dettaglioEnd);
      } else {
        // fallback: usa tutto il file (filtriamo meglio sotto)
        dettaglioSection = csvText;
      }

      const lines = dettaglioSection.split('\n').filter((line) => {
        const ok = line.trim()
          && !line.includes('===')
          && !line.includes('Provincia;Ragione Sociale Cliente')
          && line.includes(';')
          && line.split(';').length >= 4;

        if (!ok) return false;
        // accetta solo righe con provincia 2 lettere maiuscole (LT, RM…)
        const prov = line.split(';')[0].trim();
        return /^[A-Z]{2}$/.test(prov);
      });

      const venditeMap = new Map();
      lines.forEach((line) => {
        const parts = line.split(';');
        if (parts.length >= 4) {
          const fatturato = this.parseNumber(parts[3]);
          if (!isNaN(fatturato) && fatturato > 0) {
            const cliente = parts[1].trim();
            const vendita = {
              provincia: parts[0].trim(),
              cliente,
              categoria: parts[2].trim(),
              fatturato,
            };
            const exist = venditeMap.get(cliente);
            if (!exist || exist.fatturato < fatturato) venditeMap.set(cliente, vendita);
          }
        }
      });

      vendite = Array.from(venditeMap.values())
        .sort((a, b) => b.fatturato - a.fatturato)
        .slice(0, 10);

      return { generale, latina, roma, vendite, timestamp: new Date() };
    } catch (e) {
      console.error('❌ Errore parsing:', e);
      // Stampa un hint in pagina
      const err = document.getElementById('error-message');
      if (err && e && e.message) err.textContent = e.message;
      return null;
    }
  }

  // ==================== UI UPDATES ====================
  updateLoadingState(state, errorMessage = null) {
    const byId = (id) => document.getElementById(id);
    const loadingEl = byId('loading-state');
    const errorEl = byId('error-state');
    const mainEl = byId('main-content');
    const refreshIcon = byId('refresh-icon');
    const connectionDot = byId('connection-dot');
    const connectionStatus = byId('connection-status');
    const statusBadge = byId('status-badge');

    if (loadingEl) loadingEl.style.display = 'none';
    if (errorEl) errorEl.style.display = 'none';
    if (mainEl) mainEl.style.display = 'none';

    if (refreshIcon) {
      if (state === 'updating') refreshIcon.classList.add('spinning');
      else refreshIcon.classList.remove('spinning');
    }
    const refreshBtn = byId('refresh-btn');
    if (refreshBtn) refreshBtn.disabled = (state === 'updating');

    if (connectionDot) connectionDot.className = 'status-dot ' + (state === 'updating' ? 'updating' : state === 'success' ? 'online' : 'offline');

    switch (state) {
      case 'updating':
        if (loadingEl) loadingEl.style.display = 'block';
        if (connectionStatus) connectionStatus.textContent = 'Aggiornamento...';
        if (statusBadge) { statusBadge.className = 'status-badge updating'; statusBadge.textContent = '🔄 Caricamento dati reali...'; }
        break;
      case 'success':
        if (mainEl) mainEl.style.display = 'block';
        if (connectionStatus) connectionStatus.textContent = 'Online';
        if (statusBadge) { statusBadge.className = 'status-badge success'; statusBadge.textContent = '✅ CSV letto correttamente'; }
        this.updateLastUpdateDisplay();
        break;
      case 'error':
        if (errorEl) errorEl.style.display = 'block';
        if (connectionStatus) connectionStatus.textContent = 'Errore';
