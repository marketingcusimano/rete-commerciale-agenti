// ==================== DASHBOARD CARABOT NATALINO - GITHUB PAGES ====================
// Vanilla JS â€” CSV live, parser IT, formattazione "k" max 3 cifre ovunque
// Fix: URL risolti automaticamente per GitHub Pages (repo-pages con /<repo>/),
//      rimozione controllo troppo rigido sul contenuto del CSV,
//      log dettagliati e messaggi d'errore piÃ¹ chiari.

class DashboardManager {
  constructor() {
    this.csvData = null;
    this.selectedProvince = 'all';
    this.isLoading = false;
    this.lastUpdate = null;
    this.updateInterval = null;

    // Nomi possibili del file CSV (vedi repo screenshot)
    this.csvFileNames = [
      '631.00238_CARABOT-NATALINO.csv',
      '631.00238_CARABOT NATALINO.csv'
    ];

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

  // Costruisce una lista di URL candidati che funzionano su GitHub Pages
  buildCandidateUrls() {
    const { pathname, origin } = window.location;
    // es.: /utente/repo/ => repoSlug = 'repo'
    const segs = pathname.split('/').filter(Boolean);
    const repoSlug = segs.length ? segs[0] : '';

    const bases = new Set([
      './',
      '',
      // base calcolata dalla pagina corrente (termina con /)
      pathname.endsWith('/') ? pathname : pathname.replace(/[^/]*$/, ''),
      // root del repo pages
      repoSlug ? `/${repoSlug}/` : '/',
      // in alcuni setup rimane /<repo>/docs/
      repoSlug ? `/${repoSlug}/docs/` : '/docs/'
    ]);

    const urls = [];
    for (const base of bases) {
      for (const name of this.csvFileNames) {
        try {
          const abs = new URL(base + name, origin).href;
          urls.push(abs);
        } catch { /* ignore */ }
      }
    }
    // dedup
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

      console.log('ðŸ”Ž CSV candidate URLs:', candidates);

      // Prova in sequenza gli URL definiti
      for (const url of candidates) {
        const u = url + cacheBuster;
        try {
          console.log('â†—ï¸ GET', u);
          const res = await fetch(u, {
            method: 'GET',
            cache: 'no-cache',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache'
            }
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
          const t = await res.text();
          if (t && t.trim().length > 0) { text = t; break; }
          lastError = new Error('CSV vuoto');
        } catch (e) {
          console.warn('âš ï¸ Fallito', u, e);
          lastError = e;
        }
      }

      if (!text) throw lastError || new Error('Impossibile leggere il CSV');

      // Log diagnostico
      console.log('âœ… CSV caricato, len:', text.length);
      console.log('ðŸ“ CSV head (200):', text.substring(0, 200));

      const parsedData = this.parseCSV(text);
      if (!parsedData) throw new Error('Parsing CSV fallito â€” controlla intestazioni/marker nel CSV');

      this.csvData = parsedData;
      this.lastUpdate = new Date();
      this.updateLoadingState('success');
      this.renderDashboard();

    } catch (error) {
      console.error('âŒ Errore fetch CSV:', error);
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
        clienti: parseInt(generaleMatch[4], 10)
      };

      // LATINA
      const ltMatch = obiettiviText.match(/LT;([\d.,]+);([\d.,]+);([\d.,]+);(\d+)%;(\d+);(\d+);(\d+);(\d+)%/);
      if (!ltMatch) throw new Error('Dati Latina non trovati');
      const latinaObiettivoRaw = this.parseNumber(ltMatch[3]);
      const latina = {
        annoPrecedente: this.parseNumber(ltMatch[1]),
        annoCorrente: this.parseNumber(ltMatch[2]),
        obiettivo: latinaObiettivoRaw * 1000, // CSV in "migliaia" â†’ euro
        percentualeObiettivo: parseInt(ltMatch[4], 10),
        clientiPrecedenti: parseInt(ltMatch[5], 10),
        clientiCorrente: parseInt(ltMatch[6], 10),
        obiettivoClienti: parseInt(ltMatch[7], 10)
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
            clienti: parseInt(rmMatch[1], 10)
          };
        }
      }

      // DETTAGLIO VENDITE â†’ top 10
      const dettaglioStart = csvText.indexOf('=== DETTAGLIO VENDITE PER CLIENTE ===');
      const dettaglioEnd = csvText.indexOf('=== RIEPILOGO PER CATEGORIA ===');
      let vendite = [];
      if (dettaglioStart !== -1 && dettaglioEnd !== -1) {
        const dettaglioSection = csvText.substring(dettaglioStart, dettaglioEnd);
        const lines = dettaglioSection.split('\n').filter(line =>
          line.trim() && !line.includes('===') && !line.includes('Provincia;Ragione Sociale Cliente') && line.includes(';') && line.split(';').length >= 4
        );
        const venditeMap = new Map();
        lines.forEach(line => {
          const parts = line.split(';');
          if (parts.length >= 4) {
            const fatturato = this.parseNumber(parts[3]);
            if (!isNaN(fatturato) && fatturato > 0) {
              const cliente = parts[1].trim();
              if (!venditeMap.has(cliente) || venditeMap.get(cliente).fatturato < fatturato) {
                venditeMap.set(cliente, {
                  provincia: parts[0].trim(),
                  cliente: cliente,
                  categoria: parts[2].trim(),
                  fatturato: fatturato
                });
              }
            }
          }
        });
        vendite = Array.from(venditeMap.values()).sort((a,b)=>b.fatturato-a.fatturato).slice(0,10);
      }

      const result = { generale, latina, roma, vendite, timestamp: new Date() };
      return result;
    } catch (e) {
      console.error('âŒ Errore parsing:', e);
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
        if (statusBadge) { statusBadge.className = 'status-badge updating'; statusBadge.textContent = 'ðŸ”„ Caricamento dati reali...'; }
        break;
      case 'success':
        if (mainEl) mainEl.style.display = 'block';
        if (connectionStatus) connectionStatus.textContent = 'Online';
        if (statusBadge) { statusBadge.className = 'status-badge success'; statusBadge.textContent = 'âœ… CSV letto correttamente'; }
        this.updateLastUpdateDisplay();
        break;
      case 'error':
        if (errorEl) errorEl.style.display = 'block';
        if (connectionStatus) connectionStatus.textContent = 'Errore';
        if (statusBadge) { statusBadge.className = 'status-badge error'; statusBadge.textContent = 'âš ï¸ Errore CSV'; }
        const err = byId('error-message');
        if (err) err.textContent = errorMessage || 'Errore sconosciuto';
        break;
    }
  }

  updateLastUpdateDisplay() {
    if (!this.lastUpdate) return;
    const now = new Date();
    const diff = Math.floor((now - this.lastUpdate) / 1000);
    let timeText;
    if (diff < 60) timeText = diff + 's fa';
    else if (diff < 3600) timeText = Math.floor(diff / 60) + 'm fa';
    else timeText = this.lastUpdate.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

    const lastUpdateEl = document.getElementById('last-update');
    if (lastUpdateEl) lastUpdateEl.textContent = timeText;

    const tableTimestamp = document.getElementById('table-timestamp');
    if (tableTimestamp) tableTimestamp.textContent = this.lastUpdate.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  }

  // ==================== DASHBOARD RENDERING ====================
  renderDashboard() {
    if (!this.csvData) return;
    this.renderKPICards();
    this.renderVenditeTable();
    this.updateProvinceOptions();
  }

  renderKPICards() {
    const data = this.getDisplayData();

    // Fatturato â€” in k
    const fatturatoValue = document.getElementById('fatturato-value');
    if (fatturatoValue) fatturatoValue.textContent = this.formatEuroK3(data.fatturato);

    const growthValue = document.getElementById('growth-value');
    if (growthValue) growthValue.textContent = '+' + data.crescita + '%';

    const previousValue = document.getElementById('previous-value');
    if (previousValue) previousValue.textContent = this.formatEuroK3(data.annoPrecedente);

    // Obiettivo â€” in k
    const obiettivoCard = document.getElementById('obiettivo-card');
    if (obiettivoCard) {
      if (data.obiettivo) {
        obiettivoCard.style.display = 'block';
        const obVal = document.getElementById('obiettivo-value');
        const obPerc = document.getElementById('obiettivo-percentage');
        const remVal = document.getElementById('remaining-value');
        if (obVal) obVal.textContent = this.formatEuroK3(data.obiettivo);
        if (obPerc) obPerc.textContent = (data.percentualeObiettivo || 0) + '%';
        if (remVal) remVal.textContent = this.formatEuroK3((data.obiettivo || 0) - data.fatturato);
        const progressFill = document.getElementById('progress-fill');
        if (progressFill) progressFill.style.width = (data.percentualeObiettivo || 0) + '%';
      } else {
        obiettivoCard.style.display = 'none';
      }
    }

    // Clienti
    const clientiValue = document.getElementById('clienti-value');
    if (clientiValue) clientiValue.textContent = String(data.clienti);

    const provinciaLabel = document.getElementById('provincia-label');
    if (provinciaLabel) provinciaLabel.textContent = this.selectedProvince === 'all' ? 'TOT' : this.selectedProvince;
  }

  renderVenditeTable() {
    if (!this.csvData.vendite || this.csvData.vendite.length === 0) return;

    const tbody = document.getElementById('vendite-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    this.csvData.vendite.forEach(vendita => {
      const row = document.createElement('tr');
      row.innerHTML =
        '<td>'+
          '<span class="province-badge '+ vendita.provincia +'">'+ vendita.provincia +'</span>'+
        '</td>'+
        '<td>'+ (vendita.cliente.length > 30 ? vendita.cliente.slice(0,30)+'...' : vendita.cliente) +'</td>'+
        '<td>'+ vendita.categoria +'</td>'+
        '<td>'+ this.formatEuroK3(vendita.fatturato) +'</td>';
      tbody.appendChild(row);
    });

    const totalClients = document.getElementById('total-clients');
    if (totalClients) totalClients.textContent = String(this.csvData.vendite.length);

    const totalTopRevenue = document.getElementById('total-top-revenue');
    if (totalTopRevenue) totalTopRevenue.textContent = this.formatEuroK3(
      this.csvData.vendite.reduce((sum, v) => sum + v.fatturato, 0)
    );

    const statusIcon = document.getElementById('update-status-icon');
    if (statusIcon) statusIcon.textContent = 'âœ…';

    const tableStatusBadge = document.getElementById('table-status-badge');
    if (tableStatusBadge) { tableStatusBadge.innerHTML = '<i class="fas fa-check-circle"></i><span>Live</span>'; tableStatusBadge.className = 'status-badge small success'; }
  }

  // ==================== PROVINCE FILTER ====================
  showProvincePopup() { if (!this.csvData) return; this.updateProvinceOptions(); const p = document.getElementById('province-popup'); if (p) p.style.display = 'flex'; }
  hideProvincePopup() { const p = document.getElementById('province-popup'); if (p) p.style.display = 'none'; }

  updateProvinceOptions() {
    if (!this.csvData) return;
    const popupOptions = document.getElementById('popup-options');
    if (!popupOptions) return;
    popupOptions.innerHTML = '';

    // Tutte le province
    popupOptions.appendChild(this.createProvinceOption('all', {
      title: 'Tutte le Province',
      description: this.formatEuroK3(this.csvData.generale.annoCorrente) + ' â€¢ ' + this.csvData.generale.clienti + ' clienti',
      className: ''
    }));

    // Latina
    popupOptions.appendChild(this.createProvinceOption('LT', {
      title: 'Latina (LT)',
      description: this.formatEuroK3(this.csvData.latina.annoCorrente) + ' â€¢ ' + this.csvData.latina.clientiCorrente + ' clienti â€¢ Obiettivo: ' + (this.csvData.latina.percentualeObiettivo || 0) + '%',
      className: 'LT'
    }));

    // Roma
    popupOptions.appendChild(this.createProvinceOption('RM', {
      title: 'Roma (RM)',
      description: this.formatEuroK3(this.csvData.roma.annoCorrente) + ' â€¢ ' + this.csvData.roma.clienti + ' clienti',
      className: 'RM'
    }));

    const popupStatusDot = document.getElementById('popup-status-dot');
    const popupStatusText = document.getElementById('popup-status-text');
    if (popupStatusDot) popupStatusDot.className = 'status-dot online';
    if (popupStatusText) popupStatusText.textContent = 'Dati CSV aggiornati automaticamente';
  }

  createProvinceOption(province, config) {
    const option = document.createElement('button');
    option.className = 'province-option ' + (this.selectedProvince === province ? 'selected ' + (config.className || '') : '');
    option.innerHTML =
      '<div class="option-info">' +
        '<h4>'+ config.title +'</h4>' +
        '<p>'+ config.description +'</p>' +
      '</div>' +
      '<div class="option-radio ' + (this.selectedProvince === province ? 'selected' : '') + '"></div>';

    option.addEventListener('click', () => {
      this.selectedProvince = province;
      this.renderDashboard();
      this.hideProvincePopup();
    });

    return option;
  }

  // ==================== DATA HELPERS ====================
  getDisplayData() {
    if (!this.csvData) {
      return { fatturato: 0, annoPrecedente: 0, crescita: 0, clienti: 0, obiettivo: null, percentualeObiettivo: null };
    }

    if (this.selectedProvince === 'all') {
      const prev = this.csvData.generale.annoPrecedente || 0;
      const curr = this.csvData.generale.annoCorrente || 0;
      const crescita = prev > 0 ? (((curr - prev) / prev) * 100).toFixed(1) : '0.0';
      return { fatturato: curr, annoPrecedente: prev, crescita, clienti: this.csvData.generale.clienti, obiettivo: null, percentualeObiettivo: null };
    } else if (this.selectedProvince === 'LT') {
      const prev = this.csvData.latina.annoPrecedente || 0;
      const curr = this.csvData.latina.annoCorrente || 0;
      const crescita = prev > 0 ? (((curr - prev) / prev) * 100).toFixed(1) : '0.0';
      return { fatturato: curr, annoPrecedente: prev, crescita, clienti: this.csvData.latina.clientiCorrente, obiettivo: this.csvData.latina.obiettivo, percentualeObiettivo: this.csvData.latina.percentualeObiettivo };
    } else if (this.selectedProvince === 'RM') {
      return { fatturato: this.csvData.roma.annoCorrente, annoPrecedente: 0, crescita: '0.0', clienti: this.csvData.roma.clienti, obiettivo: null, percentualeObiettivo: null };
    }

    return { fatturato: 0, annoPrecedente: 0, crescita: '0.0', clienti: 0, obiettivo: null, percentualeObiettivo: null };
  }

  // ==================== UTILITY FUNCTIONS ====================
  // Parser robusto per numeri in formato italiano
  parseNumber(input) {
    if (typeof input === 'number') return input;
    if (!input) return 0;
    const cleaned = String(input)
      .replace(/\s+/g, '')
      .replace(/â‚¬/g, '')
      .replace(/\./g, '')
      .replace(/,/g, '.');
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : 0;
  }

  // "k" con max 3 cifre (1,23k â€¢ 12,3k â€¢ 123k). Per importi in euro â†’ sempre migliaia.
  formatK3(value) {
    const num = Number(value) || 0;
    const sign = num < 0 ? '-' : '';
    const v = Math.abs(num);
    const k = v / 1000;
    let out;
    if (k >= 100) out = String(Math.round(k));
    else if (k >= 10) out = (Math.round(k * 10) / 10).toString().replace('.', ',');
    else out = (Math.round(k * 100) / 100).toString().replace('.', ',');
    // rimuovi zeri/virgola superflui
    out = out.replace(/,?0+$/, '');
    return sign + out + 'k';
  }

  formatEuroK3(value) {
    if (!value) return 'â‚¬0k';
    const k = this.formatK3(value);
    return 'â‚¬' + k.replace('k','') + 'k';
  }

  // ==================== AUTO UPDATE ====================
  startAutoUpdate() {
    // Auto-update ogni 2 minuti
    this.updateInterval = setInterval(() => {
      this.fetchCSVData();
    }, 2 * 60 * 1000);

    // Update time display ogni 30 secondi
    setInterval(() => this.updateLastUpdateDisplay(), 30 * 1000);

    // Esegui piccoli test in console all'avvio (non bloccanti)
    this.runUnitTests();
  }

  // ==================== TEST (console.assert) ====================
  runUnitTests() {
    try {
      const approx = (a,b) => Math.abs(a-b) < 1e-6;
      console.assert(approx(this.parseNumber('1.234,56'), 1234.56), 'parseNumber 1');
      console.assert(this.parseNumber('â‚¬ 987.654,00') === 987654, 'parseNumber 2');
      console.assert(this.formatK3(1234) === '1,23k', 'formatK3 1');
      console.assert(this.formatK3(12345) === '12,3k', 'formatK3 2');
      console.assert(this.formatK3(123456) === '123k', 'formatK3 3');
      console.assert(this.formatEuroK3(1500) === 'â‚¬1,5k', 'formatEuroK3');
    } catch (e) { /* ignore in produzione */ }
  }

  // ==================== CLEANUP ====================
  destroy() { if (this.updateInterval) clearInterval(this.updateInterval); }
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
  window.dashboard = new DashboardManager();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (window.dashboard) window.dashboard.destroy();
