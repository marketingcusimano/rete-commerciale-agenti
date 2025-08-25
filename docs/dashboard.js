// ==================== CARABOT NATALINO — Dashboard (RAW fallback) ====================
// - Auto update ogni 2 minuti
// - Parser numeri IT
// - Grafici Chart.js (bar, doughnut, trend) + KPI
// - Formattazione € in k (max 3 cifre: 1,23k • 12,3k • 123k)
// - CSV forzato da raw.githubusercontent.com per evitare problemi di path/CORS

class DashboardManager {
  constructor() {
    // === Config ===
    this.csvMainName = '631.00238_CARABOT-NATALINO.csv';
    this.altCsvNames = [
      '631.00238_CARABOT-NATALINO.csv',
      '631.00238_CARABOT NATALINO.csv' // con spazio
    ];
    // 👉 Forza RAW (consigliato): funziona anche se la pagina NON è servita da GitHub Pages
    this.FORCE_RAW = true;
    this.repoRawBase = 'https://raw.githubusercontent.com/marketingcusimano/rete-commerciale-agenti/main/docs/';

    // Stato
    this.csvData = null;
    this.aggregates = null;
    this.selectedProvince = 'all';
    this.isLoading = false;
    this.lastUpdate = null;
    this.updateInterval = null;
    this.charts = {};

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadInitialData();
    this.startAutoUpdate();
  }

  // ==================== Eventi UI ====================
  setupEventListeners() {
    const $ = (id) => document.getElementById(id);
    $('#refresh-btn')?.addEventListener('click', () => this.fetchCSVData(true));
    $('#theme-toggle')?.addEventListener('click', () => {
      this.toggleTheme();
      this.renderCharts(); // aggiorna palette grafici
    });
    $('#province-filter')?.addEventListener('click', () => this.showProvincePopup());
    $('#close-popup')?.addEventListener('click', () => this.hideProvincePopup());
    $('#popup-close-btn')?.addEventListener('click', () => this.hideProvincePopup());
    $('#province-popup')?.addEventListener('click', (e) => {
      if (e.target && e.target.id === 'province-popup') this.hideProvincePopup();
    });
  }

  // ==================== Tema ====================
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

  // ==================== Load iniziale ====================
  async loadInitialData() { await this.fetchCSVData(); }

  // Candidati URL del CSV
  buildCandidateUrls() {
    const urls = new Set();

    // RAW (sempre provato per primo se FORCE_RAW)
    for (const name of this.altCsvNames) {
      const encoded = name.replace(/ /g, '%20');
      urls.add(this.repoRawBase + encoded);
    }

    if (!this.FORCE_RAW) {
      // Percorsi locali/GH Pages (se ti servono, metti FORCE_RAW=false)
      const { pathname, origin } = window.location;
      const baseHref = document.baseURI || window.location.href;
      const parts = pathname.split('/').filter(Boolean);
      const repoRoot = parts.length ? `/${parts[0]}/` : '/';

      for (const name of this.altCsvNames) {
        try { urls.add(new URL(`./${name}`, baseHref).href); } catch {}
        try { urls.add(new URL(name, baseHref).href); } catch {}
        urls.add(origin + repoRoot + name);
        urls.add(origin + '/' + name);
      }
    }

    return Array.from(urls);
  }

  // ==================== Fetch CSV ====================
  async fetchCSVData(isManual = false) {
    if (this.isLoading) return;
    this.isLoading = true;
    this.updateLoadingState('updating');

    const tried = [];

    try {
      const cacheBuster = `?t=${Date.now()}&r=${Math.random()}`;
      const candidates = this.buildCandidateUrls();
      let lastError = null; let text = null;

      console.log('🔎 CSV candidate URLs:', candidates);

      for (const url of candidates) {
        const u = url + cacheBuster;
        tried.push(url);
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
          if (t && t.trim()) { text = t; break; }
          lastError = new Error('CSV vuoto');
        } catch (e) {
          console.warn('⚠️ Fallito', u, e);
          lastError = e;
        }
      }

      if (!text) {
        const msg = (lastError?.message || 'Impossibile leggere il CSV') + `\nProvati:\n${tried.join('\n')}`;
        throw new Error(msg);
      }

      console.log('✅ CSV caricato, len:', text.length);
      console.log('📝 CSV head (200):', text.substring(0, 200));

      const parsed = this.parseCSV(text);
      if (!parsed) throw new Error('Parsing CSV fallito — verifica formati righe');

      this.csvData = parsed;
      this.aggregates = this.computeAggregates(parsed);

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

  // ==================== Parser CSV ====================
  parseCSV(csvText) {
    try {
      const lines = csvText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

      // GENERALE — prima riga che inizia con "Generale;"
      const generalLine = lines.find(l => /^Generale;/.test(l));
      if (!generalLine) throw new Error('Riga "Generale;" non trovata nel CSV');
      const g = generalLine.split(';');
      const generale = {
        annoPrecedente: this.parseNumber(g[1]),
        annoCorrente: this.parseNumber(g[2]),
        clienti: (() => { for (let i = g.length - 1; i >= 0; i--) if (/^\d+$/.test(g[i])) return parseInt(g[i], 10); return 0; })()
      };

      // LATINA — riga "LT;..."
      const ltLine = lines.find(l => /^LT;/.test(l));
      if (!ltLine) throw new Error('Riga "LT;" non trovata nel CSV');
      const lt = ltLine.split(';');
      const latinaObiettivoRaw = this.parseNumber(lt[3]);
      const latina = {
        annoPrecedente: this.parseNumber(lt[1]),
        annoCorrente: this.parseNumber(lt[2]),
        obiettivo: latinaObiettivoRaw * 1000, // migliaia → euro
        percentualeObiettivo: parseInt(String(lt[4]).replace(/\D/g, ''), 10) || 0,
        clientiPrecedenti: parseInt(lt[5], 10) || 0,
        clientiCorrente: parseInt(lt[6], 10) || 0,
        obiettivoClienti: parseInt(lt[7], 10) || 0
      };

      // ROMA — riga con RM;[clienti int];[fatturato numero]
      let roma = { annoCorrente: 0, clienti: 0 };
      for (const l of lines) {
        if (!/^RM;/.test(l)) continue;
        const p = l.split(';');
        if (p.length >= 3 && /^\d+$/.test(p[1]) && this.isNumericIT(p[2])) {
          roma = { clienti: parseInt(p[1], 10), annoCorrente: this.parseNumber(p[2]) };
          break;
        }
      }

      // DETTAGLIO VENDITE — provincie (2 lettere), cliente (stringa), categoria (stringa), fatturato (numero)
      const venditeMap = new Map();
      const venditeRaw = [];
      for (const l of lines) {
        if (!/^[A-Z]{2};/.test(l)) continue;
        const parts = l.split(';');
        if (parts.length < 4) continue;

        const prov = parts[0].trim();
        const campo2 = parts[1].trim();
        const categoria = parts[2].trim();
        const fatturato = this.parseNumber(parts[3]);

        // escludi la riga “clienti per provincia” (campo2 numerico)
        if (/^\d+$/.test(campo2)) continue;
        if (!prov || !categoria || !Number.isFinite(fatturato) || fatturato <= 0) continue;

        const cliente = campo2;
        venditeRaw.push({ provincia: prov, cliente, categoria, fatturato });

        const exist = venditeMap.get(cliente);
        if (!exist || exist.fatturato < fatturato) {
          venditeMap.set(cliente, { provincia: prov, cliente, categoria, fatturato });
        }
      }
      const vendite = Array.from(venditeMap.values())
        .sort((a, b) => b.fatturato - a.fatturato)
        .slice(0, 10);

      // Trend mensile (opzionale): se nel CSV esistono due righe tipo:
      // Mese;Gen;Feb;...;Dic
      // Valori;1000;2000;...
      const monthHeaderIdx = lines.findIndex(l => /^Mese;/.test(l) || /^Trend;/.test(l));
      let monthly = null;
      if (monthHeaderIdx >= 0 && lines[monthHeaderIdx + 1]) {
        const header = lines[monthHeaderIdx].split(';');
        const values = lines[monthHeaderIdx + 1].split(';');
        const months = ['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic'];
        const arr = [];
        for (let i = 0; i < header.length; i++) {
          const h = header[i];
          if (months.includes(h)) arr.push({ label: h, value: this.parseNumber(values[i] || 0) });
        }
        if (arr.length) monthly = arr;
      }

      return { generale, latina, roma, vendite, venditeRaw, monthly, timestamp: new Date() };
    } catch (e) {
      console.error('❌ Errore parsing:', e);
      const err = document.getElementById('error-message');
      if (err && e?.message) err.textContent = e.message;
      return null;
    }
  }

  // ==================== Aggregazioni ====================
  computeAggregates(data) {
    const aggr = {
      byProvince: { LT: { fatturato: 0, clienti: 0 }, RM: { fatturato: 0, clienti: 0 }, ALTRE: { fatturato: 0, clienti: 0 } },
      byCategory: {},
      topCategories: []
    };

    aggr.byProvince.LT.fatturato = data.latina?.annoCorrente || 0;
    aggr.byProvince.LT.clienti   = data.latina?.clientiCorrente || 0;

    aggr.byProvince.RM.fatturato = data.roma?.annoCorrente || 0;
    aggr.byProvince.RM.clienti   = data.roma?.clienti || 0;

    const totGen = data.generale?.annoCorrente || 0;
    const altreF = Math.max(0, totGen - aggr.byProvince.LT.fatturato - aggr.byProvince.RM.fatturato);
    aggr.byProvince.ALTRE.fatturato = altreF;

    const totCli = data.generale?.clienti || 0;
    const altreC = Math.max(0, totCli - aggr.byProvince.LT.clienti - aggr.byProvince.RM.clienti);
    aggr.byProvince.ALTRE.clienti = altreC;

    for (const v of (data.venditeRaw || [])) {
      const cat = v.categoria || 'Altro';
      if (!aggr.byCategory[cat]) aggr.byCategory[cat] = { totale: 0, LT: 0, RM: 0 };
      aggr.byCategory[cat].totale += v.fatturato;
      if (v.provincia === 'LT') aggr.byCategory[cat].LT += v.fatturato;
      else if (v.provincia === 'RM') aggr.byCategory[cat].RM += v.fatturato;
    }

    aggr.topCategories = Object.entries(aggr.byCategory)
      .map(([k, v]) => ({ categoria: k, ...v }))
      .sort((a, b) => b.totale - a.totale)
      .slice(0, 8);

    return aggr;
  }

  // ==================== UI: stati ====================
  updateLoadingState(state, errorMessage = null) {
    const $ = (id) => document.getElementById(id);
    const loadingEl = $('loading-state');
    const errorEl = $('error-state');
    const mainEl = $('main-content');
    const refreshIcon = $('refresh-icon');
    const connectionDot = $('connection-dot');
    const connectionStatus = $('connection-status');
    const statusBadge = $('status-badge');

    if (loadingEl) loadingEl.style.display = 'none';
    if (errorEl) errorEl.style.display = 'none';
    if (mainEl) mainEl.style.display = 'none';

    if (refreshIcon) {
      if (state === 'updating') refreshIcon.classList.add('spinning');
      else refreshIcon.classList.remove('spinning');
    }
    const refreshBtn = $('refresh-btn');
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
        const err = $('error-message');
        if (err) err.textContent = errorMessage || 'Errore sconosciuto';
        break;
    }
  }

  updateLastUpdateDisplay() {
    if (!this.lastUpdate) return;
    const now = new Date();
    const diff = Math.floor((now - this.lastUpdate) / 1000);
    let timeText;
    if (diff < 60) timeText = `${diff}s fa`;
    else if (diff < 3600) timeText = `${Math.floor(diff / 60)}m fa`;
    else timeText = this.lastUpdate.toLocaleDateString('it-IT', {
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
    });

    const lastUpdateEl = document.getElementById('last-update');
    if (lastUpdateEl) lastUpdateEl.textContent = timeText;

    const tableTimestamp = document.getElementById('table-timestamp');
    if (tableTimestamp) tableTimestamp.textContent = this.lastUpdate.toLocaleDateString('it-IT', {
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
    });
  }

  // ==================== Render principale ====================
  renderDashboard() {
    if (!this.csvData) return;
    this.renderKPICards();
    this.renderVenditeTable();
    this.renderCharts();
    this.renderAdvancedSections();
    this.updateProvinceOptions();
  }

  renderKPICards() {
    const data = this.getDisplayData();
    const fatturatoValue = document.getElementById('fatturato-value');
    if (fatturatoValue) fatturatoValue.textContent = this.formatEuroK3(data.fatturato);
    const growthValue = document.getElementById('growth-value');
    if (growthValue) growthValue.textContent = `+${data.crescita}%`;
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
        if (obPerc) obPerc.textContent = `${data.percentualeObiettivo || 0}%`;
        if (remVal) remVal.textContent = this.formatEuroK3((data.obiettivo || 0) - data.fatturato);
        const progressFill = document.getElementById('progress-fill');
        if (progressFill) progressFill.style.width = `${data.percentualeObiettivo || 0}%`;
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
    if (!tbody) return; tbody.innerHTML = '';
    const vendite = Array.isArray(this.csvData?.vendite) ? this.csvData.vendite : [];
    vendite.forEach(v => {
      const row = document.createElement('tr');
      row.innerHTML =
        `<td><span class="province-badge ${v.provincia}">${v.provincia}</span></td>` +
        `<td>${v.cliente.length > 30 ? v.cliente.slice(0,30) + '…' : v.cliente}</td>` +
        `<td>${v.categoria}</td>` +
        `<td>${this.formatEuroK3(v.fatturato)}</td>`;
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

  // ==================== Grafici ====================
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
  destroyChart(name) { if (this.charts[name]) { this.charts[name].destroy(); delete this.charts[name]; } }
  upsertChart(name, type, ctx, data, options) {
    if (this.charts[name]) { this.charts[name].data = data; this.charts[name].options = options; this.charts[name].update(); }
    else { this.charts[name] = new Chart(ctx, { type, data, options }); }
  }
  pickColors(n) {
    const styles = getComputedStyle(document.body);
    const c1 = styles.getPropertyValue('--primary-blue').trim() || '#3b82f6';
    const c2 = styles.getPropertyValue('--primary-violet').trim() || '#8b5cf6';
    const c3 = styles.getPropertyValue('--primary-cyan').trim() || '#22d3ee';
    const c4 = styles.getPropertyValue('--primary-emerald').trim() || '#10b981';
    const arr = [c1,c2,c3,c4,'#64748b','#06b6d4','#a78bfa','#34d399'];
    return Array.from({length: n}, (_,i)=>arr[i%arr.length]);
  }
  renderCharts() {
    if (typeof Chart === 'undefined' || !this.csvData) return;
    this.ensureChartsDOM();
    const styles = getComputedStyle(document.body);
    const textColor = styles.getPropertyValue('--text-primary') || '#111827';

    // Top 10 (bar)
    const topEl = document.getElementById('chart-top');
    if (topEl) {
      const labels = (this.csvData.vendite || []).map(v => v.cliente.length > 20 ? v.cliente.slice(0,20)+'…' : v.cliente);
      const values = (this.csvData.vendite || []).map(v => v.fatturato);
      this.upsertChart('top', 'bar', topEl.getContext('2d'), {
        labels, datasets: [{ data: values, backgroundColor: this.pickColors(values.length), borderRadius: 6, maxBarThickness: 28 }]
      }, {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => this.formatEuroK3(c.raw) } } },
        scales: { x: { ticks: { color: textColor }, grid: { display: false } }, y: { ticks: { color: textColor, callback: (v)=> this.formatEuroK3(v) }, grid: { display: false } } }
      });
    }

    // Provincie (doughnut)
    const provEl = document.getElementById('chart-provincie');
    if (provEl) {
      const lt = this.csvData.latina?.annoCorrente || 0;
      const rm = this.csvData.roma?.annoCorrente || 0;
      const tot = this.csvData.generale?.annoCorrente || 0;
      const altre = Math.max(0, tot - lt - rm);
      const dataArr = [lt, rm, altre];
      this.upsertChart('provincie', 'doughnut', provEl.getContext('2d'), {
        labels: ['Latina','Roma','Altre'], datasets: [{ data: dataArr, backgroundColor: this.pickColors(3) }]
      }, {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { color: textColor } }, tooltip: { callbacks: { label: (c)=> {
          const val = c.raw, total = c.dataset.data.reduce((a,b)=>a+b,0) || 1; const pct = Math.round((val/total)*1000)/10;
          return `${c.label}: ${this.formatEuroK3(val)} (${pct}%)`;
        } } } }, cutout: '60%'
      });
    }

    // Obiettivo LT (doughnut)
    const objEl = document.getElementById('chart-obiettivo');
    if (objEl) {
      const ob = this.csvData.latina?.obiettivo || 0;
      const curr = this.csvData.latina?.annoCorrente || 0;
      if (ob > 0) {
        const done = Math.min(curr, ob), rem = Math.max(0, ob - done);
        this.upsertChart('obiettivo', 'doughnut', objEl.getContext('2d'), {
          labels: ['Raggiunto','Da fare'], datasets: [{ data: [done, rem], backgroundColor: this.pickColors(2) }]
        }, {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { color: textColor } }, tooltip: { callbacks: { label: (c)=> `${c.label}: ${this.formatEuroK3(c.raw)}` } } },
          cutout: '64%'
        });
      } else {
        this.destroyChart('obiettivo');
      }
    }
  }

  // ==================== Sezioni avanzate (mix/trend) ====================
  ensureAdvancedDOM() {
    if (document.getElementById('advanced-grid')) return;
    const host = document.getElementById('main-content'); if (!host) return;
    const wrap = document.createElement('div');
    wrap.id = 'advanced-grid';
    wrap.className = 'kpi-grid';
    wrap.innerHTML = `
      <div class="kpi-card"><div class="kpi-header"><div class="kpi-info"><p class="kpi-label">Confronto Clienti per Provincia</p></div></div><div style="height:320px"><canvas id="chart-clienti-prov"></canvas></div></div>
      <div class="kpi-card"><div class="kpi-header"><div class="kpi-info"><p class="kpi-label">Confronto Province (Fatturato)</p></div></div><div style="height:320px"><canvas id="chart-fatt-prov"></canvas></div></div>
      <div class="kpi-card"><div class="kpi-header"><div class="kpi-info"><p class="kpi-label">Mix Prodotti</p></div></div><div style="height:320px"><canvas id="chart-mix"></canvas></div></div>
      <div class="kpi-card" id="trend-card" style="display:none"><div class="kpi-header"><div class="kpi-info"><p class="kpi-label">Trend Mensile Cumulativo</p></div></div><div style="height:320px"><canvas id="chart-trend"></canvas></div></div>`;
    host.appendChild(wrap);

    const detail = document.createElement('div');
    detail.id = 'category-detail-card';
    detail.className = 'table-container';
    detail.innerHTML = `
      <div class="table-header"><h3>Dettaglio Categorie per Provincia</h3></div>
      <div class="table-wrapper"><table id="cat-table"><thead><tr><th>#</th><th>Categoria</th><th>Importo</th><th>LT</th><th>RM</th></tr></thead><tbody id="cat-tbody"></tbody></table></div>`;
    host.appendChild(detail);
  }

  renderAdvancedSections() {
    if (!this.csvData) return;
    this.ensureAdvancedDOM();

    const styles = getComputedStyle(document.body);
    const textColor = styles.getPropertyValue('--text-primary') || '#111827';

    // Clienti per provincia
    const c1 = document.getElementById('chart-clienti-prov');
    if (c1) {
      const lt = this.aggregates.byProvince.LT.clienti || 0;
      const rm = this.aggregates.byProvince.RM.clienti || 0;
      const altre = this.aggregates.byProvince.ALTRE.clienti || 0;
      this.upsertChart('clienti-prov', 'bar', c1.getContext('2d'), {
        labels: ['LT','RM','Altre'], datasets: [{ data: [lt, rm, altre], backgroundColor: this.pickColors(3), borderRadius: 6, maxBarThickness: 30 }]
      }, { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false }, tooltip:{ callbacks:{ label:(c)=> `${c.raw} clienti` } } }, scales:{ x:{ ticks:{ color:textColor }, grid:{ display:false } }, y:{ ticks:{ color:textColor }, grid:{ display:false } } } });
    }

    // Fatturato per provincia
    const c2 = document.getElementById('chart-fatt-prov');
    if (c2) {
      const lt = this.aggregates.byProvince.LT.fatturato || 0;
      const rm = this.aggregates.byProvince.RM.fatturato || 0;
      const altre = this.aggregates.byProvince.ALTRE.fatturato || 0;
      this.upsertChart('fatt-prov', 'bar', c2.getContext('2d'), {
        labels: ['LT','RM','Altre'], datasets: [{ data: [lt, rm, altre], backgroundColor: this.pickColors(3), borderRadius: 6, maxBarThickness: 30 }]
      }, { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false }, tooltip:{ callbacks:{ label:(c)=> this.formatEuroK3(c.raw) } } }, scales:{ x:{ ticks:{ color:textColor }, grid:{ display:false } }, y:{ ticks:{ color:textColor, callback:(v)=> this.formatEuroK3(v) }, grid:{ display:false } } } });
    }

    // Mix prodotti (categorie)
    const c3 = document.getElementById('chart-mix');
    if (c3) {
      const cats = this.aggregates.topCategories;
      const labels = cats.map(c => c.categoria.length>24 ? c.categoria.slice(0,24)+'…' : c.categoria);
      const data = cats.map(c => c.totale);
      this.upsertChart('mix', 'doughnut', c3.getContext('2d'), {
        labels, datasets: [{ data, backgroundColor: this.pickColors(data.length) }]
      }, { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom', labels:{ color:textColor } }, tooltip:{ callbacks:{ label:(c)=> `${c.label}: ${this.formatEuroK3(c.raw)}` } } }, cutout:'58%' });
    }

    // Trend mensile (se presente)
    const trendCard = document.getElementById('trend-card');
    const trendEl = document.getElementById('chart-trend');
    if (trendEl) {
      if (Array.isArray(this.csvData.monthly) && this.csvData.monthly.length) {
        trendCard.style.display = 'block';
        const labels = this.csvData.monthly.map(m => m.label);
        let acc = 0; const values = this.csvData.monthly.map(m => (acc += (m.value||0)));
        this.upsertChart('trend', 'line', trendEl.getContext('2d'), {
          labels, datasets: [{ data: values, fill: true, tension: 0.35, borderWidth: 2, pointRadius: 0, backgroundColor: 'rgba(59,130,246,0.15)', borderColor: this.pickColors(1)[0] }]
        }, { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false }, tooltip:{ callbacks:{ label:(c)=> this.formatEuroK3(c.raw) } } }, scales:{ x:{ ticks:{ color:textColor }, grid:{ display:false } }, y:{ ticks:{ color:textColor, callback:(v)=> this.formatEuroK3(v) }, grid:{ display:false } } } });
      } else {
        trendCard.style.display = 'none';
        this.destroyChart('trend');
      }
    }

    // Tabella categorie
    const tbody = document.getElementById('cat-tbody');
    if (tbody) {
      tbody.innerHTML = '';
      const rows = this.aggregates.topCategories.map((c, idx) => {
        return `<tr>
          <td style="width:36px;opacity:.7">${idx+1}</td>
          <td>${c.categoria}</td>
          <td style="text-align:right;font-weight:700">${this.formatEuroK3(c.totale)}</td>
          <td style="text-align:right">${this.formatEuroK3(c.LT)}</td>
          <td style="text-align:right">${this.formatEuroK3(c.RM)}</td>
        </tr>`;
      }).join('');
      tbody.insertAdjacentHTML('beforeend', rows);
    }
  }

  // ==================== Province filter ====================
  showProvincePopup() { if (!this.csvData) return; this.updateProvinceOptions(); const p = document.getElementById('province-popup'); if (p) p.style.display = 'flex'; }
  hideProvincePopup() { const p = document.getElementById('province-popup'); if (p) p.style.display = 'none'; }
  updateProvinceOptions() {
    if (!this.csvData) return;
    const popupOptions = document.getElementById('popup-options'); if (!popupOptions) return;
    popupOptions.innerHTML = '';
    popupOptions.appendChild(this.createProvinceOption('all', {
      title: 'Tutte le Province',
      description: `${this.formatEuroK3(this.csvData.generale.annoCorrente)} • ${this.csvData.generale.clienti} clienti`,
      className: ''
    }));
    popupOptions.appendChild(this.createProvinceOption('LT', {
      title: 'Latina (LT)',
      description: `${this.formatEuroK3(this.csvData.latina.annoCorrente)} • ${this.csvData.latina.clientiCorrente} clienti • Obiettivo: ${this.csvData.latina.percentualeObiettivo || 0}%`,
      className: 'LT'
    }));
    popupOptions.appendChild(this.createProvinceOption('RM', {
      title: 'Roma (RM)',
      description: `${this.formatEuroK3(this.csvData.roma.annoCorrente)} • ${this.csvData.roma.clienti} clienti`,
      className: 'RM'
    }));
    const dot = document.getElementById('popup-status-dot');
    const txt = document.getElementById('popup-status-text');
    if (dot) dot.className = 'status-dot online';
    if (txt) txt.textContent = 'Dati CSV aggiornati automaticamente';
  }
  createProvinceOption(province, config) {
    const option = document.createElement('button');
    option.className = `province-option ${this.selectedProvince === province ? 'selected ' + (config.className || '') : ''}`;
    option.innerHTML = `
      <div class="option-info"><h4>${config.title}</h4><p>${config.description}</p></div>
      <div class="option-radio ${this.selectedProvince === province ? 'selected' : ''}"></div>
    `;
    option.addEventListener('click', () => {
      this.selectedProvince = province;
      this.renderDashboard();
      this.hideProvincePopup();
    });
    return option;
  }

  // ==================== Helpers ====================
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

  parseNumber(input) {
    if (typeof input === 'number') return input;
    if (!input) return 0;
    const cleaned = String(input).replace(/\s+/g,'').replace(/€/g,'').replace(/\./g,'').replace(/,/g,'.');
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : 0;
  }
  isNumericIT(s) {
    if (s == null) return false;
    const t = String(s).trim(); if (!t) return false;
    const cleaned = t.replace(/\s+/g,'').replace(/€/g,'').replace(/\./g,'').replace(/,/g,'.');
    return !isNaN(Number(cleaned));
  }
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
  formatEuroK3(value) { if (!value) return '€0k'; const k = this.formatK3(value); return '€' + k.replace('k','') + 'k'; }

  // ==================== Auto update ====================
  startAutoUpdate() {
    this.updateInterval = setInterval(() => this.fetchCSVData(), 2 * 60 * 1000); // 2 min
    setInterval(() => this.updateLastUpdateDisplay(), 30 * 1000);
  }

  // ==================== Cleanup ====================
  destroy() { if (this.updateInterval) clearInterval(this.updateInterval); }
}

// Init
document.addEventListener('DOMContentLoaded', () => { window.dashboard = new DashboardManager(); });
window.addEventListener('beforeunload', () => { if (window.dashboard) window.dashboard.destroy(); });
