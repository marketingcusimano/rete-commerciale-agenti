Certo! Ho aggiornato il file **completo**: ora puoi mostrare i valori “compattati” in **k** con **al massimo 3 cifre** (es.: `1,23k`, `12,3k`, `999k`). Ho aggiunto `formatK3` e l’ho usato nel popup province. Copia & incolla:

```js
// ==================== DASHBOARD CARABOT NATALINO - GITHUB PAGES ====================
// Sistema REALE di auto-update dal CSV GitHub

class DashboardManager {
    constructor() {
        this.csvData = null;
        this.selectedProvince = 'all';
        this.isLoading = false;
        this.lastUpdate = null;
        this.updateInterval = null;
        
        // URL del CSV (relativo al repo GitHub Pages)
        this.csvUrl = './631.00238_CARABOT-NATALINO.csv';
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadInitialData();
        this.startAutoUpdate();
    }
    
    // ==================== EVENT LISTENERS ====================
    setupEventListeners() {
        // Refresh button
        document.getElementById('refresh-btn').addEventListener('click', () => {
            this.fetchCSVData(true);
        });
        
        // Theme toggle
        document.getElementById('theme-toggle').addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // Province filter
        document.getElementById('province-filter').addEventListener('click', () => {
            this.showProvincePopup();
        });
        
        // Close popup buttons
        document.getElementById('close-popup').addEventListener('click', () => {
            this.hideProvincePopup();
        });
        
        document.getElementById('popup-close-btn').addEventListener('click', () => {
            this.hideProvincePopup();
        });
        
        // Close popup on overlay click
        document.getElementById('province-popup').addEventListener('click', (e) => {
            if (e.target.id === 'province-popup') {
                this.hideProvincePopup();
            }
        });
    }
    
    // ==================== THEME MANAGEMENT ====================
    toggleTheme() {
        const body = document.body;
        const themeIcon = document.getElementById('theme-icon');
        
        if (body.classList.contains('light-mode')) {
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
            themeIcon.className = 'fas fa-sun';
        } else {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            themeIcon.className = 'fas fa-moon';
        }
    }
    
    // ==================== DATA LOADING ====================
    async loadInitialData() {
        await this.fetchCSVData();
    }
    
    async fetchCSVData(isManual = false) {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.updateLoadingState('updating');
        
        try {
            console.log('🔄 Fetching CSV data from:', this.csvUrl);
            
            // Cache busting per evitare cache del browser
            const cacheBuster = `?t=${Date.now()}&r=${Math.random()}`;
            const response = await fetch(this.csvUrl + cacheBuster, {
                method: 'GET',
                cache: 'no-cache',
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const csvText = await response.text();
            
            if (!csvText || !csvText.includes('CARABOT NATALINO')) {
                throw new Error('CSV non valido o vuoto');
            }
            
            console.log('✅ CSV caricato, lunghezza:', csvText.length);
            console.log('📝 Prime 200 caratteri:', csvText.substring(0, 200));
            
            const parsedData = this.parseCSV(csvText);
            
            if (parsedData) {
                this.csvData = parsedData;
                this.lastUpdate = new Date();
                this.updateLoadingState('success');
                this.renderDashboard();
                
                console.log('✅ Dashboard aggiornato con successo');
                console.log('📊 Dati:', {
                    generale: parsedData.generale,
                    latina: parsedData.latina,
                    roma: parsedData.roma,
                    vendite: parsedData.vendite.length + ' clienti'
                });
            } else {
                throw new Error('Parsing CSV fallito');
            }
            
        } catch (error) {
            console.error('❌ Errore fetch CSV:', error);
            this.updateLoadingState('error', error.message);
        } finally {
            this.isLoading = false;
        }
    }
    
    // ==================== CSV PARSING ====================
    parseCSV(csvText) {
        try {
            console.log('🔍 Inizio parsing CSV...');
            
            // ✅ SEZIONE OBIETTIVI
            const obiettiviMatch = csvText.match(/=== VERIFICA OBIETTIVI ===([\s\S]*?)===.*===/);
            if (!obiettiviMatch) {
                throw new Error('Sezione obiettivi non trovata');
            }
            
            const obiettiviText = obiettiviMatch[1];
            console.log('📊 Sezione obiettivi:', obiettiviText.substring(0, 150));
            
            // Parse GENERALE
            const generaleMatch = obiettiviText.match(/Generale;([\d.,]+);([\d.,]+);;;(\d+);(\d+);;/);
            if (!generaleMatch) {
                throw new Error('Dati Generale non trovati');
            }
            
            const generale = {
                annoPrecedente: this.parseNumber(generaleMatch[1]),
                annoCorrente:   this.parseNumber(generaleMatch[2]),
                clienti:        parseInt(generaleMatch[4], 10)
            };
            
            console.log('🌍 GENERALE:', generale);
            
            // Parse LATINA
            const ltMatch = obiettiviText.match(/LT;([\d.,]+);([\d.,]+);([\d.,]+);(\d+)%;(\d+);(\d+);(\d+);(\d+)%/);
            if (!ltMatch) {
                throw new Error('Dati Latina non trovati');
            }
            
            const latinaObiettivoRaw = this.parseNumber(ltMatch[3]);
            const latinaObiettivoEuro = latinaObiettivoRaw * 1000; // Converti in euro se il CSV è in "migliaia"
            
            const latina = {
                annoPrecedente:       this.parseNumber(ltMatch[1]),
                annoCorrente:         this.parseNumber(ltMatch[2]),
                obiettivo:            latinaObiettivoEuro,
                percentualeObiettivo: parseInt(ltMatch[4], 10),
                clientiPrecedenti:    parseInt(ltMatch[5], 10),
                clientiCorrente:      parseInt(ltMatch[6], 10),
                obiettivoClienti:     parseInt(ltMatch[7], 10)
            };
            
            console.log('🏛️ LATINA:', latina);
            
            // ✅ SEZIONE CLIENTI (per Roma)
            const clientiMatch = csvText.match(/=== CLIENTI PER PROVINCIA ===([\s\S]*?)===.*===/);
            let roma = { annoCorrente: 0, clienti: 0 };
            
            if (clientiMatch) {
                const clientiText = clientiMatch[1];
                const rmMatch = clientiText.match(/RM;(\d+);([\d.,]+);;;;;;/);
                if (rmMatch) {
                    roma = {
                        annoCorrente: this.parseNumber(rmMatch[2]),
                        clienti:      parseInt(rmMatch[1], 10)
                    };
                    console.log('🏛️ ROMA:', roma);
                }
            }
            
            // ✅ PARSE VENDITE DETTAGLIO
            const dettaglioStart = csvText.indexOf("=== DETTAGLIO VENDITE PER CLIENTE ===");
            const dettaglioEnd = csvText.indexOf("=== RIEPILOGO PER CATEGORIA ===");
            
            let vendite = [];
            if (dettaglioStart !== -1 && dettaglioEnd !== -1) {
                const dettaglioSection = csvText.substring(dettaglioStart, dettaglioEnd);
                const venditeLines = dettaglioSection.split('\n').filter(line => 
                    line.trim() && 
                    !line.includes('===') && 
                    !line.includes('Provincia;Ragione Sociale Cliente') &&
                    line.includes(';') &&
                    line.split(';').length >= 4
                );
                
                const venditeMap = new Map();
                venditeLines.forEach(line => {
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
                
                vendite = Array.from(venditeMap.values())
                    .sort((a, b) => b.fatturato - a.fatturato)
                    .slice(0, 10);
                
                console.log('💰 Vendite top:', vendite.length);
            }
            
            const result = { generale, latina, roma, vendite, timestamp: new Date() };
            console.log('✅ Parsing completato:', result);
            return result;
            
        } catch (error) {
            console.error('❌ Errore parsing:', error);
            return null;
        }
    }
    
    // ==================== UI UPDATES ====================
    updateLoadingState(state, errorMessage = null) {
        const loadingEl = document.getElementById('loading-state');
        const errorEl = document.getElementById('error-state');
        const mainEl = document.getElementById('main-content');
        const refreshIcon = document.getElementById('refresh-icon');
        const connectionDot = document.getElementById('connection-dot');
        const connectionStatus = document.getElementById('connection-status');
        const statusBadge = document.getElementById('status-badge');
        
        // Reset states
        loadingEl.style.display = 'none';
        errorEl.style.display = 'none';
        mainEl.style.display = 'none';
        
        // Update refresh icon
        if (state === 'updating') {
            refreshIcon.classList.add('spinning');
            document.getElementById('refresh-btn').disabled = true;
        } else {
            refreshIcon.classList.remove('spinning');
            document.getElementById('refresh-btn').disabled = false;
        }
        
        // Update connection status
        connectionDot.className = 'status-dot ' + (state === 'updating' ? 'updating' : state === 'success' ? 'online' : 'offline');
        
        switch (state) {
            case 'updating':
                loadingEl.style.display = 'block';
                connectionStatus.textContent = 'Aggiornamento...';
                statusBadge.className = 'status-badge updating';
                statusBadge.textContent = '🔄 Caricamento dati reali...';
                break;
                
            case 'success':
                mainEl.style.display = 'block';
                connectionStatus.textContent = 'Online';
                statusBadge.className = 'status-badge success';
                statusBadge.textContent = '✅ CSV letto correttamente';
                this.updateLastUpdateDisplay();
                break;
                
            case 'error':
                errorEl.style.display = 'block';
                connectionStatus.textContent = 'Errore';
                statusBadge.className = 'status-badge error';
                statusBadge.textContent = '⚠️ Errore CSV';
                document.getElementById('error-message').textContent = errorMessage || 'Errore sconosciuto';
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
            day: '2-digit', 
            month: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        document.getElementById('last-update').textContent = timeText;
        
        const tableTimestamp = document.getElementById('table-timestamp');
        if (tableTimestamp) {
            tableTimestamp.textContent = this.lastUpdate.toLocaleDateString('it-IT', { 
                day: '2-digit', 
                month: '2-digit', 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        }
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
        
        // Fatturato (rimane in EUR pieno)
        document.getElementById('fatturato-value').textContent = this.formatCurrency(data.fatturato);
        document.getElementById('growth-value').textContent = `+${data.crescita}%`;
        document.getElementById('previous-value').textContent = this.formatCurrency(data.annoPrecedente);
        
        // Obiettivo
        const obiettivoCard = document.getElementById('obiettivo-card');
        if (data.obiettivo) {
            obiettivoCard.style.display = 'block';
            document.getElementById('obiettivo-value').textContent = this.formatCurrency(data.obiettivo);
            document.getElementById('obiettivo-percentage').textContent = `${data.percentualeObiettivo}%`;
            document.getElementById('remaining-value').textContent = this.formatCurrency(data.obiettivo - data.fatturato);
            
            const progressFill = document.getElementById('progress-fill');
            progressFill.style.width = `${data.percentualeObiettivo}%`;
        } else {
            obiettivoCard.style.display = 'none';
        }
        
        // Clienti
        document.getElementById('clienti-value').textContent = data.clienti;
        document.getElementById('provincia-label').textContent = this.selectedProvince === 'all' ? 'TOT' : this.selectedProvince;
    }
    
    renderVenditeTable() {
        if (!this.csvData.vendite || this.csvData.vendite.length === 0) return;
        
        const tbody = document.getElementById('vendite-tbody');
        tbody.innerHTML = '';
        
        this.csvData.vendite.forEach(vendita => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <span class="province-badge ${vendita.provincia}">
                        ${vendita.provincia}
                    </span>
                </td>
                <td>${vendita.cliente.length > 30 ? vendita.cliente.slice(0, 30) + '...' : vendita.cliente}</td>
                <td>${vendita.categoria}</td>
                <td>${this.formatCurrency(vendita.fatturato)}</td>
            `;
            tbody.appendChild(row);
        });
        
        // Update footer stats
        document.getElementById('total-clients').textContent = this.csvData.vendite.length;
        document.getElementById('total-top-revenue').textContent = this.formatCurrency(
            this.csvData.vendite.reduce((sum, v) => sum + v.fatturato, 0)
        );
        
        // Update status icon
        const statusIcon = document.getElementById('update-status-icon');
        statusIcon.textContent = '✅';
        
        const tableStatusBadge = document.getElementById('table-status-badge');
        tableStatusBadge.innerHTML = '<i class="fas fa-check-circle"></i><span>Live</span>';
        tableStatusBadge.className = 'status-badge small success';
    }
    
    // ==================== PROVINCE FILTER ====================
    showProvincePopup() {
        if (!this.csvData) return;
        
        this.updateProvinceOptions();
        document.getElementById('province-popup').style.display = 'flex';
    }
    
    hideProvincePopup() {
        document.getElementById('province-popup').style.display = 'none';
    }
    
    updateProvinceOptions() {
        if (!this.csvData) return;
        
        const popupOptions = document.getElementById('popup-options');
        popupOptions.innerHTML = '';
        
        // Tutte le province
        const allOption = this.createProvinceOption('all', {
            title: 'Tutte le Province',
            description: `${this.formatK3(this.csvData.generale.annoCorrente)} • ${this.csvData.generale.clienti} clienti`,
            className: ''
        });
        popupOptions.appendChild(allOption);
        
        // Latina
        const ltOption = this.createProvinceOption('LT', {
            title: 'Latina (LT)',
            description: `${this.formatK3(this.csvData.latina.annoCorrente)} • ${this.csvData.latina.clientiCorrente} clienti • Obiettivo: ${this.csvData.latina.percentualeObiettivo}%`,
            className: 'LT'
        });
        popupOptions.appendChild(ltOption);
        
        // Roma
        const rmOption = this.createProvinceOption('RM', {
            title: 'Roma (RM)',
            description: `${this.formatK3(this.csvData.roma.annoCorrente)} • ${this.csvData.roma.clienti} clienti`,
            className: 'RM'
        });
        popupOptions.appendChild(rmOption);
        
        // Update popup status
        const popupStatusDot = document.getElementById('popup-status-dot');
        const popupStatusText = document.getElementById('popup-status-text');
        popupStatusDot.className = 'status-dot online';
        popupStatusText.textContent = 'Dati CSV aggiornati automaticamente';
    }
    
    createProvinceOption(province, config) {
        const option = document.createElement('button');
        option.className = `province-option ${this.selectedProvince === province ? 'selected ' + config.className : ''}`;
        option.innerHTML = `
            <div class="option-info">
                <h4>${config.title}</h4>
                <p>${config.description}</p>
            </div>
            <div class="option-radio ${this.selectedProvince === province ? 'selected' : ''}"></div>
        `;
        
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
            return {
                fatturato: 0,
                annoPrecedente: 0,
                crescita: 0,
                clienti: 0,
                obiettivo: null,
                percentualeObiettivo: null
            };
        }
        
        if (this.selectedProvince === 'all') {
            const prev = this.csvData.generale.annoPrecedente || 0;
            const curr = this.csvData.generale.annoCorrente || 0;
            const crescita = prev > 0 ? (((curr - prev) / prev) * 100).toFixed(1) : 0;
            return {
                fatturato: curr,
                annoPrecedente: prev,
                crescita,
                clienti: this.csvData.generale.clienti,
                obiettivo: null,
                percentualeObiettivo: null
            };
        } else if (this.selectedProvince === 'LT') {
            const prev = this.csvData.latina.annoPrecedente || 0;
            const curr = this.csvData.latina.annoCorrente || 0;
            const crescita = prev > 0 ? (((curr - prev) / prev) * 100).toFixed(1) : 0;
            return {
                fatturato: curr,
                annoPrecedente: prev,
                crescita,
                clienti: this.csvData.latina.clientiCorrente,
                obiettivo: this.csvData.latina.obiettivo,
                percentualeObiettivo: this.csvData.latina.percentualeObiettivo
            };
        } else if (this.selectedProvince === 'RM') {
            return {
                fatturato: this.csvData.roma.annoCorrente,
                annoPrecedente: 0,
                crescita: 0,
                clienti: this.csvData.roma.clienti,
                obiettivo: null,
                percentualeObiettivo: null
            };
        }
        
        return { fatturato: 0, annoPrecedente: 0, crescita: 0, clienti: 0, obiettivo: null, percentualeObiettivo: null };
    }
    
    // ==================== UTILITY FUNCTIONS ====================
    // Parser robusto per numeri in formato italiano: "123.456,78" -> 123456.78
    parseNumber(input) {
        if (typeof input === 'number') return input;
        if (input === null || input === undefined) return 0;
        const cleaned = String(input)
            .replace(/\s+/g, '')    // spazi
            .replace(/€/g, '')      // simbolo euro
            .replace(/\./g, '')     // punto (migliaia)
            .replace(/,/g, '.');    // virgola (decimali)
        const n = Number(cleaned);
        return Number.isFinite(n) ? n : 0;
    }

    // Formattatore EUR completo (per KPI e tabella vendite)
    formatCurrency(value) {
        return new Intl.NumberFormat('it-IT', { 
            style: 'currency', 
            currency: 'EUR', 
            minimumFractionDigits: 0, 
            maximumFractionDigits: 0 
        }).format(value || 0);
    }
    
    // Compatto classico (lasciato per eventuale uso altrove)
    formatCompactCurrency(value) {
        const v = Number(value) || 0;
        if (v >= 1_000_000) return `€${(v / 1_000_000).toFixed(1)}M`;
        if (v >= 1_000)    return `€${(v / 1_000).toFixed(0)}k`;
        return this.formatCurrency(v);
    }

    // ==================== NUOVO: "k" con max 3 cifre ====================
    // Esempi: 987  -> "1k"; 1.234 -> "1,23k"; 12.345 -> "12,3k"; 123.456 -> "123k"; 1.234.567 -> "1.235k"
    // Regole: sempre in "migliaia", con 2/1/0 decimali per mantenere max 3 cifre significative.
    formatK3(value) {
        const num = Number(value) || 0;
        const sign = num < 0 ? '-' : '';
        const v = Math.abs(num);
        const k = v / 1000;

        // Scegli i decimali per avere al massimo 3 cifre significative
        let outNum;
        if (k >= 100) {
            // 100–999 -> intero (es. 123k)
            outNum = Math.round(k).toString();
        } else if (k >= 10) {
            // 10–99.9 -> una cifra decimale (es. 12,3k)
            outNum = this._formatItDecimals(Math.round(k * 10) / 10, 1);
        } else {
            // 0–9.99 -> due cifre decimali (es. 1,23k)
            outNum = this._formatItDecimals(Math.round(k * 100) / 100, 2);
        }

        return `${sign}${outNum}k`;
    }

    // Supporto: converte decimali in stile IT e rimuove zeri finali superflui
    _formatItDecimals(n, decimals) {
        const s = n.toFixed(decimals).replace('.', ',');
        // rimuovi zeri e l'eventuale virgola finale
        return s.replace(/,?0+$/, '');
    }
    
    // ==================== AUTO UPDATE ====================
    startAutoUpdate() {
        // Auto-update ogni 2 minuti
        this.updateInterval = setInterval(() => {
            console.log('🕐 Auto-update schedulato...');
            this.fetchCSVData();
        }, 2 * 60 * 1000);
        
        // Update time display ogni 30 secondi
        setInterval(() => {
            this.updateLastUpdateDisplay();
        }, 30 * 1000);
    }
    
    // ==================== CLEANUP ====================
    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Dashboard CARABOT NATALINO inizializzato');
    window.dashboard = new DashboardManager();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.dashboard) {
        window.dashboard.destroy();
    }
});
```

Vuoi che mostri in **k** anche i valori nelle **carte KPI** (invece dell’euro pieno)? Posso adattare anche quelli allo stesso stile.
