// ==================== DASHBOARD CARABOT NATALINO - GITHUB PAGES ====================
// Vanilla JS — CSV live, parser IT, formattazione "k" max 3 cifre ovunque
// CSV fisso: 631.00238_CARABOT-NATALINO.csv
// Include 3 grafici Chart.js: Top 10 Clienti, Ripartizione Provincie, Obiettivo LT

class DashboardManager {
  constructor() {
    this.csvData = null;
    this.selectedProvince = 'all';
    this.isLoading = false;
    this.lastUpdate = null;
    this.updateInterval = null;
    this.charts = {}; // Chart.js instances

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
    if (themeToggle) themeToggle.addEventListener('click', () => {
      this.toggleTheme();
      // Re-render charts (per contrasto tema)
      this.renderCharts();
    });

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

  // ==================== THEME ====================
  toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('theme-icon');
    if (body.classList.contains('light-mode')) {
      body.classList.remove('light-mode'); body.classList.add('dark-mode');
      if (themeIcon) themeIcon.className = 'fas fa-sun';
    } else {
      body.classList.remove('dark-mode'); body.classList.add('light-mode');
      if (themeIcon) themeIcon.className = 'fas fa-moon';
    }
  }

  // ==================== DATA LOADING ====================
  async loadInitialData() { await this.fetchCSVData(); }

  buildCandidateUrls() {
    const { pathname, origin } = window.location;
    const dir = pathname.endsWith('/') ? pathname : pathname.replace(/[^/]*$/, '');
    const segs = dir.split('/').filter(Boolean);
    const repoSlug = segs.length ? segs[0] : '';
    const repoBase = repoSlug ? `/${repoSlug}/` : '/';
    const bases = new Set(['./', '', dir, repoBase]);
    const urls = [];
    for (const base of bases) {
      try { urls.push(new URL(base + this.csvFileName, origin).href); } catch {}
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
      let lastError = null, text = null;

      console.log('🔎 CSV candidate URLs:', candidates);
      for (const url of candidates) {
        const u = url + cacheBuster;
        try {
          console.log('↗️ GET', u);
          const res = await fetch(u, { method:'GET', cache:'no-cache',
            headers:{ 'Cache-Control':'no-cache, no-store, must-revalidate','Pragma':'no-cache' }});
          if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
          const t = await res.text();
          if (t && t.trim()) { text = t; break; }
          lastError = new Error('CSV vuoto');
        } catch (e) { console.warn('⚠️ Fallito', u, e); lastError = e; }
      }
      if (!text) throw lastError || new Error('Impossibile leggere il CSV');

      console.log('✅ CSV caricato, len:', text.length);
      console.log('📝 CSV head (200):', text.substring(0, 200));

      const parsedData = this.parseCSV(text);
      if (!parsedData) throw new Error('Parsing CSV fallito — verifica formati righe');

      this.csvData = parsedData;
      this.lastUpdate = new Date();
      this.updateLoadingState('success');
      this.renderDashboard();

    } catch (error) {
      console.error('❌ Errore fetch CSV:', error);
      this.updateLoadingState('error', error?.message || 'Errore sconosciuto');
    } finally {
      this.isLoading = false;
    }
  }

  // ==================== CSV PARSING (robusto, no marker richiesti) ====================
  parseCSV(csvText) {
    try {
      const lines = csvText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

      // GENERALE  (prima riga che inizia con "Generale;")
      const generalLine = lines.find(l => /^Generale;/.test(l));
      if (!generalLine) throw new Error('Riga "Generale;" non trovata');
      const g = generalLine.split(';');
      const generale = {
        annoPrecedente: this.parseNumber(g[1]),
        annoCorrente: this.parseNumber(g[2]),
        clienti: (() => { // ultimo intero sulla riga
          for (let i = g.length - 1; i >= 0; i--) if (/^\d+$/.test(g[i])) return parseInt(g[i], 10);
          return 0;
        })()
      };

      // LATINA (LT)
      const ltLine = lines.find(l => /^LT;/.test(l));
      if (!ltLine) throw new Error('Riga "LT;" non trovata');
      const lt = ltLine.split(';');
      const latinaObiettivoRaw = this.parseNumber(lt[3]);
      const latina = {
        annoPrecedente: this.parseNumber(lt[1]),
        annoCorrente: this.parseNumber(lt[2]),
        obiettivo: latinaObiettivoRaw * 1000,
        percentualeObiettivo: parseInt(String(lt[4]).replace(/\D/g, ''), 10) || 0,
        clientiPrecedenti: parseInt(lt[5], 10) || 0,
        clientiCorrente: parseInt(lt[6], 10) || 0,
        obiettivoClienti: parseInt(lt[7], 10) || 0
      };

      // ROMA (RM): cerca riga con RM;[clienti int];[fatturato numero]
      let roma = { annoCorrente: 0, clienti: 0 };
      for (const l of lines) {
        if (!/^RM;/.test(l)) continue;
        const parts = l.split(';');
        if (parts.length >= 3 && /^\d+$/.test(parts[1]) && this.isNumericIT(parts[2])) {
          roma = { clienti: parseInt(parts[1], 10), annoCorrente: this.parseNumber(parts[2]) };
          break;
        }
      }

      // DETTAGLIO VENDITE: provincia (2 lettere), cliente (stringa), categoria (stringa), fatturato (numero)
      const venditeMap = new Map();
      for (const l of lines) {
        if (!/^[A-Z]{2};/.test(l)) continue;
        const parts = l.split(';');
        if (parts.length < 4) continue;
        const prov = parts[0].trim();
        const campo2 = parts[1].trim();
        const categoria = parts[2].trim();
        const fatturato = this.parseNumber(parts[3]);
        if (/^\d+$/.test(campo2)) continue; // escludi righe "clienti per provincia"
        if (!prov || !categoria || !Number.isFinite(fatturato) || fatturato <= 0) continue;

        const cliente = campo2;
        const exist = venditeMap.get(cliente);
        if (!exist || exist.fatturato < fatturato) venditeMap.set(cliente, { provincia: prov, cliente, categoria, fatturato });
      }
      const vendite = Array.from(venditeMap.values()).sort((a,b)=>b.fatturato-a.fatturato).slice(0,10);

      return { generale, latina, roma, vendite, timestamp: new Date() };
    } catch (e) {
      console.error('❌ Errore parsing:', e);
      const err = document.getElementById('error-message');
      if (err && e?.message) err.textContent = e.message;
      return null;
    }
  }

  // ==================== UI ====================
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
        if (statusBadge) { statusBadge.className = 'status-badge error'; statusBadge.textContent = '⚠️ Errore CSV'; }
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

  // ==================== RENDER ====================
  renderDashboard() {
    if (!this.csvData) return;
    this.renderKPICards();
    this.renderVenditeTable();
    this.renderCharts();
    this.updateProvinceOptions();
  }

  renderKPICards() {
    const data = this.getDisplayData();
    const fatturatoValue = document.getElementById('fatturato-value');
    if (fatturatoValue) fatturatoValue.textContent = this.formatEuroK3(data.fatturato);
    const growthValue = document.getElementById('growth-value');
    if (growthValue) growthValue.textContent = '+' + data.crescita + '%';
    const previousValue = document.getElementById('previous-value');
    if (previousValue) previousValue.textContent = this.formatEuroK3(data.annoPrecedente);

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

    const clientiValue = document.getElementById('clienti-value');
    if (clientiValue) clientiValue.textContent = String(data.clienti);
    const provinciaLabel = document.getElementById('provincia-label');
    if (provinciaLabel) provinciaLabel.textContent = this.selectedProvince === 'all' ? 'TOT' : this.selectedProvince;
  }

  renderVenditeTable() {
    const tbody = document.getElementById('vendite-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    const vendite = Array.isArray(this.csvData?.vendite) ? this.csvData.vendite : [];
    vendite.forEach(v => {
      const row = document.createElement('tr');
      row.innerHTML =
        '<td><span class="province-badge ' + v.provincia + '">' + v.provincia + '</span></td>' +
        '<td>' + (v.cliente.length > 30 ? v.cliente.slice(0,30) + '...' : v.cliente) + '</td>' +
        '<td>' + v.categoria + '</td>' +
        '<td>' + this.formatEuroK3(v.fatturato) + '</td>';
      tbody.appendChild(row);
    });
    const totalClients = document.getElementById('total-clients');
    if (totalClients) totalClients.textContent = String(vendite.length);
    const totalTopRevenue = document.getElementById('total-top-revenue');
    if (totalTopRevenue) totalTopRevenue.textContent = this.formatEuroK3(
      vendite.reduce((sum, v) => sum + v.fatturato, 0)
    );
    const statusIcon = document.getElementById('update-status-icon');
    if (statusIcon) statusIcon.textContent = '✅';
    const tableStatusBadge = document.getElementById('table-status-badge');
    if (tableStatusBadge) { tableStatusBadge.innerHTML = '<i class="fas fa-check-circle"></i><span>Live</span>'; tableStatusBadge.className = 'status-badge small success'; }
  }

  // ====== CHARTS ======
  ensureChartsDOM() {
    if (document.getElementById('charts-grid')) return;
    const host = document.getElementById('main-content');
    if (!host) return;
    const grid = document.createElement('div');
    grid.className = 'kpi-grid';
    grid.id = 'charts-grid';
    grid.innerHTML = `
      <div class="kpi-card">
        <div class="kpi-header"><div class="kpi-info"><p class="kpi-label">Top 10 Clienti</p></div></div>
        <div style="height:320px"><canvas id="chart-top"></canvas></div>
      </div>
      <div class="kpi-card">
        <div class="kpi-header"><div class="kpi-info"><p class="kpi-label">Ripartizione per Provincia</p></div></div>
        <div style="height:320px"><canvas id="chart-provincie"></canvas></div>
      </div>
      <div class="kpi-card">
        <div class="kpi-header"><div class="kpi-info"><p class="kpi-label">Obiettivo LT</p></div></div>
        <div style="height:320px"><canvas id="chart-obiettivo"></canvas></div>
      </div>`;
    host.appendChild(grid);
  }

  destroyChart(name) {
    if (this.charts[name]) { this.charts[name].destroy(); delete this.charts[name]; }
  }

  upsertChart(name, type, ctx, data, options) {
    if (this.charts[name]) {
      this.charts[name].data = data;
      this.charts[name].options = options;
      this.charts[name].update();
    } else {
      this.charts[name] = new Chart(ctx, { type, data, options });
    }
  }

  renderCharts() {
    if (typeof Chart === 'undefined') return;
    if (!this.csvData) return;

    this.ensureChartsDOM();

    const fmt = this.formatEuroK3.bind(this);
    const textColor = getComputedStyle(document.body).getPropertyValue('--text-primary') || '#e5e7eb';

    // --- Top 10 Clienti (Bar) ---
    const topEl = document.getElementById('chart-top');
    if (topEl) {
      const labels = (this.csvData.vendite || []).map(v => v.cliente.length > 20 ? v.cliente.slice(0,20) + '…' : v.cliente);
      const values = (this.csvData.vendite || []).map(v => v.fatturato);
      const ctx = topEl.getContext('2d');
      this.upsertChart('top', 'bar', ctx, {
        labels,
        datasets: [{ data: values, borderWidth: 1 }]
      }, {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: (c) => fmt(c.raw) }
          }
        },
        scales: {
          x: { ticks: { color: textColor, maxRotation: 0, minRotation: 0 }, grid: { display: false } },
          y: { ticks: { color: textColor, callback: (v) => fmt(v) }, grid: { display: false } }
        }
      });
    }

    // --- Ripartizione Provincie (Doughnut) ---
    const provEl = document.getElementById('chart-provincie');
    if (provEl) {
      const lt = this.csvData.latina?.annoCorrente || 0;
      const rm = this.csvData.roma?.annoCorrente || 0;
      const tot = this.csvData.generale?.annoCorrente || 0;
      const altre = Math.max(0, tot - lt - rm);
      const labels = ['Latina', 'Roma', 'Altre'];
      const dataArr = [lt, rm, altre];
      const ctx = provEl.getContext('2d');
      this.upsertChart('provincie', 'doughnut', ctx, {
        labels, datasets: [{ data: dataArr, borderWidth: 1 }]
      }, {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { color: textColor } },
          tooltip: {
            callbacks: {
              label: (c) => {
                const val = c.raw;
                const total = c.dataset.data.reduce((a,b)=>a+b,0) || 1;
                const pct = Math.round((val/total)*1000)/10;
                return `${c.label}: ${fmt(val)} (${pct}%)`;
              }
            }
          }
        },
        cutout: '55%'
      });
    }

    // --- Obiettivo LT (Doughnut progress) ---
    const objEl = document.getElementById('chart-obiettivo');
    if (objEl) {
      const ob = this.csvData.latina?.obiettivo || 0;
      const curr = this.csvData.latina?.annoCorrente || 0;
      if (ob > 0) {
        const done = Math.min(curr, ob);
        const rem = Math.max(0, ob - done);
        const ctx = objEl.getContext('2d');
        this.upsertChart('obiettivo', 'doughnut', ctx, {
          labels: ['Raggiunto', 'Da fare'],
          datasets: [{ data: [done, rem], borderWidth: 1 }]
        }, {
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { color: textColor } },
            tooltip: { callbacks: { label: (c) => `${c.label}: ${fmt(c.raw)}` } }
          },
          cutout: '60%'
        });
      } else {
        this.destroyChart('obiettivo');
      }
    }
  }

  // ==================== PROVINCE FILTER ====================
  showProvincePopup() { if (!this.csvData) return; this.updateProvinceOptions(); const p = document.getElementById('province-popup'); if (p) p.style.display = 'flex'; }
  hideProvincePopup() { const p = document.getElementById('province-popup'); if (p) p.style.display = 'none'; }

  updateProvinceOptions() {
    if (!this.csvData) return;
    const popupOptions = document.getElementById('popup-options');
    if (!popupOptions) return;
    popupOptions.innerHTML = '';
    popupOptions.appendChild(this.createProvinceOption('all', {
      title: 'Tutte le Province',
      description: this.formatEuroK3(this.csvData.generale.annoCorrente) + ' • ' + this.csvData.generale.clienti + ' clienti',
      className: ''
    }));
    popupOptions.appendChild(this.createProvinceOption('LT', {
      title: 'Latina (LT)',
      description: this.formatEuroK3(this.csvData.latina.annoCorrente) + ' • ' + this.csvData.latina.clientiCorrente + ' clienti • Obiettivo: ' + (this.csvData.latina.percentualeObiettivo || 0) + '%',
      className: 'LT'
    }));
    popupOptions.appendChild(this.createProvinceOption('RM', {
      title: 'Roma (RM)',
      description: this.formatEuroK3(this.csvData.roma.annoCorrente) + ' • ' + this.csvData.roma.clienti + ' clienti',
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
      '<div class="option-info"><h4>' + config.title + '</h4><p>' + config.description + '</p></div>' +
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
    if (!this.csvData) return { fatturato: 0, annoPrecedente: 0, crescita: 0, clienti: 0, obiettivo: null, percentualeObiettivo: null };
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

  // Parser numeri IT
  parseNumber(input) {
    if (typeof input === 'number') return input;
    if (!input) return 0;
    const cleaned = String(input).replace(/\s+/g,'').replace(/€/g,'').replace(/\./g,'').replace(/,/g,'.');
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : 0;
  }
  isNumericIT(s) {
    if (s == null) return false;
    const t = String(s).trim();
    if (!t) return false;
    const cleaned = t.replace(/\s+/g,'').replace(/€/g,'').replace(/\./g,'').replace(/,/g,'.');
    return !isNaN(Number(cleaned));
  }

  // Formattazioni k
  formatK3(value) {
    const num = Number(value) || 0;
    const sign = num < 0 ? '-' : '';
    const v = Math.abs(num), k = v / 1000;
    let out;
    if (k >= 100) out = String(Math.round(k));
    else if (k >= 10) out = (Math.round(k * 10) / 10).toString().replace('.', ',');
    else out = (Math.round(k * 100) / 100).toString().replace('.', ',');
    out = out.replace(/,?0+$/, '');
    return sign + out + 'k';
  }
  formatEuroK3(value) {
    if (!value) return '€0k';
    const k = this.formatK3(value);
    return '€' + k.replace('k','') + 'k';
  }

  // ==================== AUTO UPDATE ====================
  startAutoUpdate() {
    this.updateInterval = setInterval(() => this.fetchCSVData(), 2 * 60 * 1000); // 2 minuti
    setInterval(() => this.updateLastUpdateDisplay(), 30 * 1000);
  }

  // ==================== CLEANUP ====================
  destroy() { if (this.updateInterval) clearInterval(this.updateInterval); }
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => { window.dashboard = new DashboardManager(); });
window.addEventListener('beforeunload', () => { if (window.dashboard) window.dashboard.destroy(); });
