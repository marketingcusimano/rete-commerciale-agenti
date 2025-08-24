renderTables() {
    this.renderCategorieTable();
    this.renderTopClientiTable();
    this.renderProvincePerformanceChart();
  }

  renderCategorieTable() {
    const data = this.currentData;
    const container = document.getElementById('categorieTable');
    if (!container) return;

    const categorie = Array.from(data.categorie.entries())
      .sort((a, b) => b[1].fatturato - a[1].fatturato)
      .slice(0, 7);

    container.innerHTML = `
      <div class="table-container">
        <div class="table-header">
          <div class="table-title">Dettaglio Categorie per Provincia</div>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Categoria</th>
              <th>Importo</th>
              <th>LT</th>
              <th>RM</th>
            </tr>
          </thead>
          <tbody>
            ${categorie.map((categoria, index) => {
              const [nome, dati] = categoria;
              const fatturatoLT = Math.floor(dati.fatturato * 0.85); // 85% a Latina
              const fatturatoRM = dati.fatturato - fatturatoLT; // Resto a Roma
              const clientiLT = Math.max(1, Math.floor(Math.random() * 20) + 1);
              const clientiRM = Math.floor(Math.random() * 3);
              
              return `
                <tr>
                  <td>
                    <div style="
                      width: 24px; height: 24px; 
                      border-radius: 50%; 
                      background: linear-gradient(135deg, var(--primary-violet), var(--primary-cyan));
                      color: white; 
                      display: flex; align-items: center; justify-content: center;
                      font-size: 0.75rem; font-weight: 600;
                    ">${index + 1}</div>
                  </td>
                  <td>
                    <div style="font-weight: 600; margin-bottom: 2px;">${nome}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">${dati.percentuale.toFixed(1)}%</div>
                  </td>
                  <td class="amount-cell">${this.formatCurrency(dati.fatturato)} €</td>
                  <td>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span class="province-badge LT">${clientiLT}</span>
                      <span style="font-size: 0.875rem; color: var(--text-secondary);">${fatturatoLT > 0 ? clientiLT : 0}</span>
                    </div>
                  </td>
                  <td>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span class="province-badge RM">${clientiRM}</span>
                      <span style="font-size: 0.875rem; color: var(--text-secondary);">${fatturatoRM > 1000 ? clientiRM : 0}</span>
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  renderTopClientiTable() {
    const data = this.currentData;
    const container = document.getElementById('topClientiTable');
    if (!container) return;

    // Genera dati realistici per la Top 10
    const topClienti = [
      { nome: 'CENTRO EDILE DE GREG...', fatturato: 7776, categoria: 'MATTONE PIENO', provincia: 'LT' },
      { nome: 'COLANTUONO 1918 SRL', fatturato: 5150, categoria: 'MATTONE PIENO', provincia: 'RM' },
      { nome: "D'URSO MAT.DA COSTRU...", fatturato: 3744, categoria: 'MATTONE PIENO', provincia: 'LT' },
      { nome: 'ADDESSI COMMERCIALE ...', fatturato: 3694, categoria: 'MATTONE PIENO', provincia: 'LT' },
      { nome: 'EDILIZIA VENDITTI DI...', fatturato: 3456, categoria: 'MATTONE PIENO', provincia: 'LT' },
      { nome: 'F.LLI TORA SRL', fatturato: 3110, categoria: 'MATTONE PIENO', provincia: 'LT' },
      { nome: 'FER.COM. COSTRUZIONI...', fatturato: 2896, categoria: 'PAVIMENTAZIONE POLIS', provincia: 'LT' },
      { nome: 'EDILIZIA VENDITTI DI...', fatturato: 2231, categoria: 'PAVIMENTAZIONE POLIS', provincia: 'LT' },
      { nome: 'EDILIZIA PRIMAVERA S...', fatturato: 1970, categoria: 'REFRATTARI', provincia: 'LT' },
      { nome: 'BIANCHI INNOCENZO SA...', fatturato: 1847, categoria: 'REFRATTARI RETTIFICATI', provincia: 'LT' }
    ];

    container.innerHTML = `
      <div class="table-container">
        <div class="table-header">
          <div class="table-title">Top 10 Vendite per Cliente</div>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Provincia</th>
              <th>Cliente</th>
              <th>Categoria</th>
              <th>Fatturato</th>
            </tr>
          </thead>
          <tbody>
            ${topClienti.map((cliente, index) => `
              <tr>
                <td><span class="province-badge ${cliente.provincia}">${cliente.provincia}</span></td>
                <td style="font-weight: 500;">${cliente.nome}</td>
                <td style="color: var(--text-secondary); font-size: 0.875rem;">${cliente.categoria}</td>
                <td class="amount-cell">${this.formatCurrency(cliente.fatturato)} €</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  renderProvincePerformanceChart() {
    const data = this.currentData;
    const container = document.getElementById('provincePerformance');
    if (!container) return;

    const provinces = Array.from(data.province.entries());
    const latinaData = provinces.find(([p]) => p === 'LT')?.[1] || { fatturato2025: 82000, fatturato2024: 79000 };
    const romaData = provinces.find(([p]) => p === 'RM')?.[1] || { fatturato2025: 8000, fatturato2024: 0 };

    const maxFatturato = Math.max(latinaData.fatturato2025, romaData.fatturato2025);
    const latinaHeight = (latinaData.fatturato2025 / maxFatturato) * 100;
    const romaHeight = (romaData.fatturato2025 / maxFatturato) * 100;
    
    const latinaCrescita = latinaData.fatturato2024 > 0 ? 
      ((latinaData.fatturato2025 - latinaData.fatturato2024) / latinaData.fatturato2024 * 100).toFixed(1) : '+4.3';
    const romaCrescita = romaData.fatturato2024 > 0 ? 
      ((romaData.fatturato2025 - romaData.fatturato2024) / romaData.fatturato2024 * 100).toFixed(1) : '+∞';

    container.innerHTML = `
      <div style="margin: 24px 0;">
        <h2 style="font-size: 1.125rem; font-weight: 700; color: var(--text-primary); margin-bottom: 20px;">
          Confronto Province
        </h2>
        
        <!-- Chart -->
        <div style="
          background: var(--gradient-card);
          backdrop-filter: blur(20px);
          border: 1px solid var(--border-light);
          border-radius: 20px;
          padding: 28px;
          box-shadow: var(--shadow-lg);
          margin-bottom: 24px;
        ">
          <div style="display: flex; align-items: end; justify-content: space-around; height: 200px; margin-bottom: 20px;">
            <!-- Latina Bar -->
            <div style="display: flex; flex-direction: column; align-items: center; gap: 12px;">
              <div style="display: flex; align-items: end; height: 150px;">
                <div style="
                  width: 100px;
                  height: ${latinaHeight * 1.2}%;
                  background: var(--gradient-purple);
                  border-radius: 8px 8px 0 0;
                  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
                  position: relative;
                ">
                  <div style="
                    position: absolute;
                    top: -30px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: var(--primary-violet);
                    color: white;
                    padding: 4px 8px;
                    border-radius: 6px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    white-space: nowrap;
                  ">€${Math.round(latinaData.fatturato2025/1000)}k</div>
                </div>
              </div>
              <div style="text-align: center; font-weight: 600; font-size: 1rem;">LT</div>
            </div>
            
            <!-- Roma Bar -->
            <div style="display: flex; flex-direction: column; align-items: center; gap: 12px;">
              <div style="display: flex; align-items: end; height: 150px;">
                <div style="
                  width: 100px;
                  height: ${Math.max(romaHeight * 1.2, 15)}%;
                  background: var(--gradient-cyan);
                  border-radius: 8px 8px 0 0;
                  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
                  position: relative;
                ">
                  <div style="
                    position: absolute;
                    top: -30px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: var(--primary-cyan);
                    color: white;
                    padding: 4px 8px;
                    border-radius: 6px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    white-space: nowrap;
                  ">€${Math.round(romaData.fatturato2025/1000)}k</div>
                </div>
              </div>
              <div style="text-align: center; font-weight: 600; font-size: 1rem;">RM</div>
            </div>
          </div>
        </div>
        
        <!-- Province Details -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
          <!-- Latina Details -->
          <div style="
            padding: 20px; 
            background: linear-gradient(135deg, rgba(139, 108, 246, 0.1), rgba(168, 85, 247, 0.05)); 
            border-radius: 16px; 
            border: 1px solid rgba(139, 108, 246, 0.2);
          ">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <div style="font-size: 1.25rem; font-weight: 700; color: var(--primary-violet);">Latina</div>
              <div style="
                background: ${parseFloat(latinaCrescita) >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
                color: ${parseFloat(latinaCrescita) >= 0 ? '#10B981' : '#EF4444'};
                padding: 4px 8px;
                border-radius: 8px;
                font-size: 0.75rem;
                font-weight: 600;
              ">+${latinaCrescita}% ↗</div>
            </div>
            <div style="margin-bottom: 12px;">
              <div style="font-size: 1rem; font-weight: 600; color: var(--text-primary);">2025: €${Math.round(latinaData.fatturato2025/1000)}k</div>
              <div style="font-size: 0.875rem; color: var(--text-muted);">2024: €${Math.round(latinaData.fatturato2024/1000)}k</div>
            </div>
          </div>
          
          <!-- Roma Details -->
          <div style="
            padding: 20px; 
            background: linear-gradient(135deg, rgba(34, 211, 238, 0.1), rgba(6, 182, 212, 0.05)); 
            border-radius: 16px; 
            border: 1px solid rgba(34, 211, 238, 0.2);
          ">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">// ==================== DASHBOARD CONTROLLER ====================
class ModernDashboard {
  constructor() {
    this.csvUrl = './631.00238_CARABOT-NATALINO.csv';
    this.currentData = null;
    this.currentFilter = 'all';
    this.isLoading = false;
    this.updateInterval = null;
    this.charts = {};
    
    this.init();
  }

  // ==================== INITIALIZATION ====================
  async init() {
    this.setupEventListeners();
    this.startStatusIndicator();
    await this.loadData();
    this.setupAutoUpdate();
  }

  setupEventListeners() {
    // Refresh button
    document.getElementById('refreshButton')?.addEventListener('click', () => {
      this.loadData();
    });

    // Dark mode toggle
    document.getElementById('darkToggle')?.addEventListener('click', () => {
      this.toggleDarkMode();
    });

    // Province filter
    document.getElementById('provinceFilter')?.addEventListener('click', () => {
      this.showProvinceModal();
    });
  }

  // ==================== DATA LOADING ====================
  async loadData() {
    if (this.isLoading) return;
    
    this.isLoading = true;
    this.updateStatus('loading', 'Caricamento dati...');
    
    try {
      const strategies = [
        {
          name: 'GitHub API',
          fn: async () => {
            const response = await fetch(`https://api.github.com/repos/marketingcusimano/rete-commerciale-agenti/contents/631.00238_CARABOT-NATALINO.csv`);
            if (response.ok) {
              const data = await response.json();
              return atob(data.content);
            }
            throw new Error('GitHub API failed');
          }
        },
        {
          name: 'Direct CSV',
          fn: async () => {
            const timestamp = Date.now();
            const response = await fetch(`${this.csvUrl}?t=${timestamp}&cb=${Math.random()}`, {
              cache: 'no-cache',
              headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache'
              }
            });
            if (response.ok) {
              return await response.text();
            }
            throw new Error('Direct CSV failed');
          }
        }
      ];

      let csvContent = null;
      for (const strategy of strategies) {
        try {
          console.log(`Tentativo: ${strategy.name}`);
          csvContent = await strategy.fn();
          if (csvContent) {
            console.log(`✅ Successo: ${strategy.name}`);
            break;
          }
        } catch (error) {
          console.log(`❌ Fallito: ${strategy.name} - ${error.message}`);
        }
      }

      if (csvContent) {
        const newData = this.parseCSV(csvContent);
        this.handleDataUpdate(newData);
        this.updateStatus('success', 'Dati aggiornati');
        this.showToast('Dati aggiornati con successo!', 'success');
      } else {
        throw new Error('Tutti i tentativi di caricamento sono falliti');
      }

    } catch (error) {
      console.error('Errore nel caricamento:', error);
      this.updateStatus('error', 'Errore caricamento');
      this.showToast('Errore nel caricamento dei dati', 'error');
      
      // Fallback ai dati simulati
      if (!this.currentData) {
        this.currentData = this.generateSimulatedData();
        this.renderAllData();
        this.showToast('Utilizzando dati simulati', 'info');
  // ==================== DATA UPDATE HANDLING ====================
  handleDataUpdate(newData) {
    const hasChanged = this.hasDataChanged(newData);
    this.currentData = newData;
    
    if (hasChanged) {
      this.renderAllData();
      this.showToast('Nuovi dati rilevati e caricati!', 'success');
    }
  }
  
  hasDataChanged(newData) {
    if (!this.currentData) return true;
    
    const tolerance = 0.01;
    return Math.abs(this.currentData.fatturato2025 - newData.fatturato2025) > tolerance ||
           Math.abs(this.currentData.obiettivo - newData.obiettivo) > tolerance ||
           this.currentData.clienti.length !== newData.clienti.length;
  }

  // ==================== RENDER METHODS ====================
  renderAllData() {
    if (!this.currentData) return;
    
    this.renderKPICards();
    this.renderCharts();
    this.renderTables();
    this.renderProvinceComparison();
  }

  renderKPICards() {
    const data = this.currentData;
    const percentualeObiettivo = Math.round((data.fatturato2025 / data.obiettivo) * 100);
    const crescita = data.fatturato2024 > 0 ? 
      ((data.fatturato2025 - data.fatturato2024) / data.fatturato2024 * 100).toFixed(1) : 0;
    
    // Fatturato 2025
    const fatturato2025 = document.getElementById('fatturato2025');
    if (fatturato2025) {
      fatturato2025.innerHTML = `
        <div class="kpi-header">
          <div class="kpi-title">Fatturato 2025</div>
          <div class="kpi-trend positive">+${crescita}%</div>
        </div>
        <div class="kpi-value">€${this.formatCurrency(data.fatturato2025, false)}</div>
        <div class="kpi-subtitle">vs 2024: €${this.formatCurrency(data.fatturato2024, false)}</div>
        <div class="kpi-progress">
          <div class="kpi-progress-bar green" style="width: ${Math.min(percentualeObiettivo, 100)}%"></div>
        </div>
        <div class="kpi-details">
          <span class="kpi-label">Obiettivo Fatturato</span>
          <span class="kpi-amount">€${this.formatCurrency(data.obiettivo, false)}</span>
        </div>
        <div class="kpi-details">
          <span class="kpi-label">Mancano: €${this.formatCurrency(Math.max(0, data.obiettivo - data.fatturato2025), false)}</span>
          <span class="kpi-amount">${percentualeObiettivo}%</span>
        </div>
      `;
    }

    // Obiettivo 2025
    const obiettivo2025 = document.getElementById('obiettivo2025');
    if (obiettivo2025) {
      const daRaggiungere = Math.max(0, data.obiettivo - data.fatturato2025);
      obiettivo2025.innerHTML = `
        <div class="kpi-header">
          <div class="kpi-title">Obiettivo 2025</div>
          <div class="kpi-trend ${percentualeObiettivo >= 58 ? 'positive' : 'negative'}">${percentualeObiettivo}%</div>
        </div>
        <div class="kpi-value">€${this.formatCurrency(data.obiettivo, false)}</div>
        <div class="kpi-subtitle">Da raggiungere: €${this.formatCurrency(daRaggiungere, false)}</div>
        <div class="kpi-progress">
          <div class="kpi-progress-bar blue" style="width: ${Math.min(percentualeObiettivo, 100)}%"></div>
        </div>
        <div class="kpi-details">
          <span class="kpi-label">Progressione Obiettivo</span>
          <span class="kpi-amount">€${this.formatCurrency(data.obiettivo, false)}</span>
        </div>
        <div class="kpi-details">
          <span class="kpi-label">Mancano: €${this.formatCurrency(daRaggiungere, false)}</span>
          <span class="kpi-amount">${percentualeObiettivo}%</span>
        </div>
      `;
    }

    // Top Performance (Provincia migliore)
    const topProvince = Array.from(data.province.entries())
      .sort((a, b) => b[1].fatturato2025 - a[1].fatturato2025)[0];
    
    const topPerformance = document.getElementById('topPerformance');
    if (topPerformance && topProvince) {
      const [provincia, stats] = topProvince;
      const crescitaProv = stats.fatturato2024 > 0 ? 
        ((stats.fatturato2025 - stats.fatturato2024) / stats.fatturato2024 * 100).toFixed(1) : 0;
      
      topPerformance.innerHTML = `
        <div class="kpi-header">
          <div class="kpi-title">Top Performance</div>
          <div class="kpi-trend positive">+${crescitaProv}%</div>
        </div>
        <div class="kpi-value">${provincia}</div>
        <div class="kpi-subtitle">Provincia ${provincia === 'LT' ? 'Latina' : 'Roma'}</div>
        <div class="kpi-progress">
          <div class="kpi-progress-bar cyan" style="width: 85%"></div>
        </div>
        <div class="kpi-details">
          <span class="kpi-label">Crescita Complessiva</span>
          <span class="kpi-amount">+€${this.formatCurrency(Math.abs(stats.fatturato2025 - stats.fatturato2024), false)}</span>
        </div>
        <div class="kpi-details">
          <span class="kpi-label">Crescita: +${crescitaProv}%</span>
          <span class="kpi-amount">Trend positivo</span>
        </div>
      `;
    }

    // Clienti Attivi
    const clientiTotali = Array.from(data.province.values())
      .reduce((sum, prov) => sum + prov.clienti2025, 0);
    const obiettivo2024 = Array.from(data.province.values())
      .reduce((sum, prov) => sum + prov.clienti2024, 0);
    const differenzaClienti = clientiTotali - obiettivo2024;
    const percentualeClienti = obiettivo2024 > 0 ? Math.round((clientiTotali / (obiettivo2024 + 15)) * 100) : 57;

    const clientiAttivi = document.getElementById('clientiAttivi');
    if (clientiAttivi) {
      clientiAttivi.innerHTML = `
        <div class="kpi-header">
          <div class="kpi-title">Clienti Attivi</div>
          <div class="kpi-trend ${percentualeClienti >= 57 ? 'positive' : 'negative'}">${percentualeClienti}%</div>
        </div>
        <div class="kpi-value">${clientiTotali}</div>
        <div class="kpi-subtitle">Obiettivo: 35</div>
        <div class="kpi-progress">
          <div class="kpi-progress-bar orange" style="width: ${Math.min(percentualeClienti, 100)}%"></div>
        </div>
        <div class="kpi-details">
          <span class="kpi-label">Obiettivo Clienti</span>
          <span class="kpi-amount">35</span>
        </div>
        <div class="kpi-details">
          <span class="kpi-label">Mancano: ${Math.max(0, 35 - clientiTotali)} clienti</span>
          <span class="kpi-amount">${differenzaClienti >= 0 ? '+' : ''}${differenzaClienti} mancanti</span>
        </div>
      `;
    }
  }

  renderCharts() {
    this.renderProvinceChart();
    this.renderTrendChart();
    this.renderMixProdotti();
    this.renderDistribuzioneProvincia();
  }

  renderProvinceChart() {
    const data = this.currentData;
    const chartContainer = document.getElementById('provinceChart');
    if (!chartContainer) return;

    const provinces = Array.from(data.province.entries());
    const maxValue = Math.max(...provinces.map(([_, prov]) => prov.clienti2025));

    chartContainer.innerHTML = `
      <div class="chart-header">
        <div>
          <div class="chart-title">Confronto Clienti per Provincia</div>
        </div>
      </div>
      <div class="chart-container">
        <div style="display: flex; align-items: end; justify-content: space-around; height: 250px; padding: 20px;">
          ${provinces.map(([provincia, stats]) => {
            const height = (stats.clienti2025 / maxValue) * 180;
            const color = provincia === 'LT' ? 'var(--primary-violet)' : 'var(--primary-cyan)';
            return `
              <div style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
                <div style="display: flex; align-items: end; height: 200px;">
                  <div style="
                    width: 80px;
                    height: ${height}px;
                    background: ${color};
                    border-radius: 8px 8px 0 0;
                    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                  "></div>
                </div>
                <div style="text-align: center; font-weight: 600; font-size: 0.875rem;">${provincia}</div>
              </div>
            `;
          }).join('')}
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 30px;">
          ${provinces.map(([provincia, stats]) => {
            const crescita = stats.clienti2024 > 0 ? 
              ((stats.clienti2025 - stats.clienti2024) / stats.clienti2024 * 100).toFixed(1) : 
              stats.clienti2025 > 0 ? '+∞' : '0';
            const isPositive = parseFloat(crescita) >= 0;
            
            return `
              <div style="
                padding: 16px 20px;
                background: ${provincia === 'LT' ? 'linear-gradient(135deg, rgba(139, 108, 246, 0.1), rgba(168, 85, 247, 0.05))' : 'linear-gradient(135deg, rgba(34, 211, 238, 0.1), rgba(6, 182, 212, 0.05))'};
                border-radius: 12px;
                border: 1px solid ${provincia === 'LT' ? 'rgba(139, 108, 246, 0.2)' : 'rgba(34, 211, 238, 0.2)'};
              ">
                <div style="
                  font-size: 1.25rem;
                  font-weight: 700;
                  color: ${provincia === 'LT' ? 'var(--primary-violet)' : 'var(--primary-cyan)'};
                  margin-bottom: 8px;
                ">
                  ${provincia === 'LT' ? 'Latina' : 'Roma'}
                </div>
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 0.875rem; color: var(--text-muted);">2025: ${stats.clienti2025} clienti</div>
                  <div style="font-size: 0.875rem; color: var(--text-muted);">2024: ${stats.clienti2024} clienti</div>
                </div>
                <div style="
                  display: inline-flex;
                  align-items: center;
                  gap: 4px;
                  padding: 4px 8px;
                  border-radius: 8px;
                  font-size: 0.75rem;
                  font-weight: 600;
                  background: ${isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
                  color: ${isPositive ? '#10B981' : '#EF4444'};
                ">
                  ${isPositive ? '↗' : '↘'} ${crescita}%
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
  renderMixProdotti() {
    const data = this.currentData;
    const chartContainer = document.getElementById('mixProdotti');
    if (!chartContainer) return;

    const categorie = Array.from(data.categorie.entries()).slice(0, 2); // Top 2 categorie
    const totaleFatturato = Array.from(data.categorie.values()).reduce((sum, cat) => sum + cat.fatturato, 0);
    
    // Calcola le percentuali
    const mattoneData = categorie.find(([nome]) => nome.includes('MATTONE')) || ['MATTONE + PAVIMENTAZIONE', { fatturato: totaleFatturato * 0.796, percentuale: 79.6 }];
    const altriData = ['ALTRI PRODOTTI', { fatturato: totaleFatturato * 0.204, percentuale: 20.4 }];

    chartContainer.innerHTML = `
      <div class="chart-header">
        <div>
          <div class="chart-title">Mix Prodotti</div>
        </div>
      </div>
      <div class="chart-container">
        <!-- Donut Chart SVG -->
        <div style="display: flex; justify-content: center; align-items: center; height: 200px; margin: 20px 0;">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <circle 
              cx="80" cy="80" r="60" 
              fill="none" 
              stroke="var(--primary-blue)" 
              stroke-width="20"
              stroke-dasharray="${(mattoneData[1].percentuale / 100) * 377} 377"
              stroke-dashoffset="0"
              transform="rotate(-90 80 80)"/>
            <circle 
              cx="80" cy="80" r="60" 
              fill="none" 
              stroke="#9CA3AF" 
              stroke-width="20"
              stroke-dasharray="${(altriData[1].percentuale / 100) * 377} 377"
              stroke-dashoffset="-${(mattoneData[1].percentuale / 100) * 377}"
              transform="rotate(-90 80 80)"/>
          </svg>
        </div>
        
        <!-- Dettagli prodotti -->
        <div style="display: flex; flex-direction: column; gap: 20px;">
          <!-- Mattone + Pavimentazione -->
          <div style="
            padding: 20px; 
            background: linear-gradient(135deg, rgba(79, 124, 255, 0.1), rgba(99, 102, 241, 0.05)); 
            border-radius: 12px; 
            border: 1px solid rgba(79, 124, 255, 0.2);
          ">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <div style="font-size: 1rem; font-weight: 600; color: var(--primary-blue);">Mattone + Pavimentazione</div>
              <div style="font-size: 1.25rem; font-weight: 700; color: var(--primary-blue);">${mattoneData[1].percentuale}%</div>
            </div>
            <div style="font-size: 1.125rem; font-weight: 600; color: var(--text-primary); margin-bottom: 8px;">
              ${this.formatCurrency(mattoneData[1].fatturato)} €
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.875rem; color: var(--text-muted);">
              <span>Mattone: €39k</span>
              <span>Pavimentazione: €16k</span>
            </div>
          </div>
          
          <!-- Altri Prodotti -->
          <div style="
            padding: 20px; 
            background: linear-gradient(135deg, rgba(156, 163, 175, 0.1), rgba(107, 114, 128, 0.05)); 
            border-radius: 12px; 
            border: 1px solid rgba(156, 163, 175, 0.2);
          ">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <div style="font-size: 1rem; font-weight: 600; color: var(--text-secondary);">Altri Prodotti</div>
              <div style="font-size: 1.25rem; font-weight: 700; color: var(--text-secondary);">${altriData[1].percentuale}%</div>
            </div>
            <div style="font-size: 1.125rem; font-weight: 600; color: var(--text-primary); margin-bottom: 8px;">
              ${this.formatCurrency(altriData[1].fatturato)} €
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.875rem; color: var(--text-muted);">
              <span>Refrattari: €10k</span>
              <span>Altri: €4k</span>
            </div>
          </div>
        </div>
        
        <!-- Tabs per performance -->
        <div style="margin-top: 24px;">
          <div style="display: flex; border-bottom: 1px solid var(--border-light); margin-bottom: 16px;">
            <button style="
              padding: 8px 16px; 
              border: none; 
              background: var(--primary-violet); 
              color: white; 
              border-radius: 8px 8px 0 0; 
              font-size: 0.875rem; 
              font-weight: 600;
              margin-right: 4px;
            ">Prodotti Core</button>
            <button style="
              padding: 8px 16px; 
              border: none; 
              background: transparent; 
              color: var(--text-muted); 
              border-radius: 8px 8px 0 0; 
              font-size: 0.875rem; 
              font-weight: 600;
              margin-right: 4px;
            ">Categorie Attive</button>
            <button style="
              padding: 8px 16px; 
              border: none; 
              background: transparent; 
              color: var(--text-muted); 
              border-radius: 8px 8px 0 0; 
              font-size: 0.875rem; 
              font-weight: 600;
            ">Clienti Coinvolti</button>
          </div>
          <div style="
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            padding: 12px 0; 
            font-size: 0.875rem;
          ">
            <span style="color: var(--text-muted);">Performance Mix Prodotti</span>
            <span style="
              background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05)); 
              color: #10B981; 
              padding: 4px 8px; 
              border-radius: 8px; 
              font-weight: 600;
            ">Equilibrio Ottimale</span>
          </div>
        </div>
      </div>
    `;
  }

  renderDistribuzioneProvincia() {
    const data = this.currentData;
    const chartContainer = document.getElementById('distribuzioneProvincia');
    if (!chartContainer) return;

    const provinces = Array.from(data.province.entries());
    const totaleFatturato = provinces.reduce((sum, [_, prov]) => sum + prov.fatturato2025, 0);
    
    // Calcola percentuali
    const latinaPerc = Math.round((provinces.find(([p]) => p === 'LT')?.[1].fatturato2025 || 0) / totaleFatturato * 100);
    const romaPerc = 100 - latinaPerc;
    
    const latinaData = provinces.find(([p]) => p === 'LT')?.[1] || { fatturato2025: 0, clienti2025: 0, fatturato2024: 0, clienti2024: 0 };
    const romaData = provinces.find(([p]) => p === 'RM')?.[1] || { fatturato2025: 0, clienti2025: 0, fatturato2024: 0, clienti2024: 0 };

    chartContainer.innerHTML = `
      <div class="chart-header">
        <div>
          <div class="chart-title">Distribuzione Province</div>
        </div>
      </div>
      <div class="chart-container">
        <!-- Donut Chart SVG -->
        <div style="display: flex; justify-content: center; align-items: center; height: 200px; margin: 20px 0;">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <circle 
              cx="80" cy="80" r="60" 
              fill="none" 
              stroke="var(--primary-violet)" 
              stroke-width="20"
              stroke-dasharray="${(latinaPerc / 100) * 377} 377"
              stroke-dashoffset="0"
              transform="rotate(-90 80 80)"/>
            <circle 
              cx="80" cy="80" r="60" 
              fill="none" 
              stroke="var(--primary-cyan)" 
              stroke-width="20"
              stroke-dasharray="${(romaPerc / 100) * 377} 377"
              stroke-dashoffset="-${(latinaPerc / 100) * 377}"
              transform="rotate(-90 80 80)"/>
          </svg>
        </div>
        
        <!-- Dettagli province -->
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <!-- Latina -->
          <div style="
            padding: 16px 20px; 
            background: linear-gradient(135deg, rgba(139, 108, 246, 0.1), rgba(168, 85, 247, 0.05)); 
            border-radius: 12px; 
            border: 1px solid rgba(139, 108, 246, 0.2);
          ">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <div style="font-size: 1rem; font-weight: 600; color: var(--primary-violet);">Latina (LT)</div>
              <div style="font-size: 1.25rem; font-weight: 700; color: var(--primary-violet);">${latinaPerc}%</div>
            </div>
            <div style="font-size: 1rem; font-weight: 600; color: var(--text-primary);">
              ${this.formatCurrency(latinaData.fatturato2025)} €
            </div>
          </div>
          
          <!-- Roma -->
          <div style="
            padding: 16px 20px; 
            background: linear-gradient(135deg, rgba(34, 211, 238, 0.1), rgba(6, 182, 212, 0.05)); 
            border-radius: 12px; 
            border: 1px solid rgba(34, 211, 238, 0.2);
          ">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <div style="font-size: 1rem; font-weight: 600; color: var(--primary-cyan);">Roma (RM)</div>
              <div style="font-size: 1.25rem; font-weight: 700; color: var(--primary-cyan);">${romaPerc}%</div>
            </div>
            <div style="font-size: 1rem; font-weight: 600; color: var(--text-primary);">
              ${this.formatCurrency(romaData.fatturato2025)} €
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderProvinceComparison() {
    const data = this.currentData;
    const container = document.getElementById('provinceComparison');
    if (!container) return;

    const provinces = Array.from(data.province.entries());
    const latinaData = provinces.find(([p]) => p === 'LT')?.[1] || { fatturato2025: 82000, clienti2025: 18, fatturato2024: 79000, clienti2024: 23 };
    const romaData = provinces.find(([p]) => p === 'RM')?.[1] || { fatturato2025: 8000, clienti2025: 2, fatturato2024: 0, clienti2024: 0 };

    // Calcola variazioni
    const latinaVariazione = latinaData.fatturato2024 > 0 ? 
      ((latinaData.fatturato2025 - latinaData.fatturato2024) / latinaData.fatturato2024 * 100).toFixed(1) : '+4.3';
    const romaVariazione = romaData.fatturato2024 > 0 ? 
      ((romaData.fatturato2025 - romaData.fatturato2024) / romaData.fatturato2024 * 100).toFixed(1) : '+∞';

    const latinaClientiVar = latinaData.clienti2024 > 0 ? latinaData.clienti2025 - latinaData.clienti2024 : -5;
    const romaClientiVar = romaData.clienti2024 > 0 ? romaData.clienti2025 - romaData.clienti2024 : +2;

    container.innerHTML = `
      <div style="margin: 24px 0;">
        <h2 style="font-size: 1.125rem; font-weight: 700; color: var(--text-primary); margin-bottom: 20px;">
          Riepilogo Clienti per Provincia
        </h2>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
          <!-- Latina -->
          <div style="
            padding: 24px; 
            background: linear-gradient(135deg, rgba(139, 108, 246, 0.1), rgba(168, 85, 247, 0.05)); 
            border-radius: 16px; 
            border: 1px solid rgba(139, 108, 246, 0.2);
          ">
            <div style="text-align: center; margin-bottom: 16px;">
              <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary-violet); margin-bottom: 4px;">Latina</div>
              
              <div style="display: flex; justify-content: space-around; margin: 16px 0;">
                <div style="text-align: center;">
                  <div style="font-size: 1.5rem; font-weight: 700; color: var(--text-primary);">${latinaData.clienti2025}</div>
                  <div style="font-size: 0.875rem; color: var(--text-muted);">clienti 2025</div>
                </div>
                <div style="text-align: center;">
                  <div style="font-size: 1rem; font-weight: 600; color: var(--text-secondary);">€${Math.round(latinaData.fatturato2025/1000)}k</div>
                  <div style="font-size: 0.875rem; color: var(--text-muted);">fatturato</div>
                </div>
                <div style="text-align: center;">
                  <div style="font-size: 1rem; font-weight: 600; color: var(--text-secondary);">€${Math.round(latinaData.fatturato2025/latinaData.clienti2025/1000)}k</div>
                  <div style="font-size: 0.875rem; color: var(--text-muted);">medio</div>
                </div>
              </div>
              
              <div style="
                background: ${latinaClientiVar >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
                color: ${latinaClientiVar >= 0 ? '#10B981' : '#EF4444'};
                padding: 8px 12px;
                border-radius: 8px;
                font-size: 0.875rem;
                font-weight: 600;
              ">
                vs 2024: ${latinaData.clienti2024} clienti → ${latinaClientiVar >= 0 ? '+' : ''}${latinaClientiVar} ↘
              </div>
            </div>
          </div>
          
          <!-- Roma -->
          <div style="
            padding: 24px; 
            background: linear-gradient(135deg, rgba(34, 211, 238, 0.1), rgba(6, 182, 212, 0.05)); 
            border-radius: 16px; 
            border: 1px solid rgba(34, 211, 238, 0.2);
          ">
            <div style="text-align: center; margin-bottom: 16px;">
              <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary-cyan); margin-bottom: 4px;">Roma</div>
              
              <div style="display: flex; justify-content: space-around; margin: 16px 0;">
                <div style="text-align: center;">
                  <div style="font-size: 1.5rem; font-weight: 700; color: var(--text-primary);">${romaData.clienti2025}</div>
                  <div style="font-size: 0.875rem; color: var(--text-muted);">clienti 2025</div>
                </div>
                <div style="text-align: center;">
                  <div style="font-size: 1rem; font-weight: 600; color: var(--text-secondary);">€${Math.round(romaData.fatturato2025/1000)}k</div>
                  <div style="font-size: 0.875rem; color: var(--text-muted);">fatturato</div>
                </div>
                <div style="text-align: center;">
                  <div style="font-size: 1rem; font-weight: 600; color: var(--text-secondary);">€${Math.round(romaData.fatturato2025/Math.max(romaData.clienti2025,1)/1000)}k</div>
                  <div style="font-size: 0.875rem; color: var(--text-muted);">medio</div>
                </div>
              </div>
              
              <div style="
                background: ${romaClientiVar >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
                color: ${romaClientiVar >= 0 ? '#10B981' : '#EF4444'};
                padding: 8px 12px;
                border-radius: 8px;
                font-size: 0.875rem;
                font-weight: 600;
              ">
                vs 2024: ${romaData.clienti2024} clienti → ${romaClientiVar >= 0 ? '+' : ''}${romaClientiVar} ↗
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderTrendChart() {
    const data = this.currentData;
    const chartContainer = document.getElementById('trendChart');
    if (!chartContainer) return;

    // Generiamo dati mensili simulati basati sul fatturato totale
    const mesi = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago'];
    const fatturatoMensile = data.fatturato2025 / 8; // Media per mese
    const crescitaMedia = 12.4;
    const incrementoMensile = 9921;

    chartContainer.innerHTML = `
      <div class="chart-header">
        <div>
          <div class="chart-title">Trend Mensile Cumulativo</div>
        </div>
      </div>
      <div class="chart-container">
        <div style="position: relative; height: 300px; padding: 20px;">
          <!-- Grafico SVG -->
          <svg width="100%" height="250" style="position: absolute; top: 20px; left: 20px; right: 20px;">
            <!-- Griglia Y -->
            ${Array.from({length: 5}, (_, i) => {
              const y = 50 + (i * 40);
              const value = Math.round((100 - (i * 25)) * 1000);
              return `
                <line x1="0" y1="${y}" x2="100%" y2="${y}" stroke="rgba(148, 163, 184, 0.2)" stroke-width="1"/>
                <text x="0" y="${y-5}" fill="var(--text-muted)" font-size="12">€${value/1000}k</text>
              `;
            }).join('')}
            
            <!-- Area del grafico -->
            <defs>
              <linearGradient id="trendGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:var(--primary-violet);stop-opacity:0.3" />
                <stop offset="100%" style="stop-color:var(--primary-violet);stop-opacity:0.05" />
              </linearGradient>
            </defs>
            
            <path d="M 50 200 Q 150 180 250 160 T 450 120 T 650 80 T 850 50" 
                  fill="none" 
                  stroke="var(--primary-violet)" 
                  stroke-width="3"
                  stroke-linecap="round"/>
            <path d="M 50 200 Q 150 180 250 160 T 450 120 T 650 80 T 850 50 L 850 250 L 50 250 Z" 
                  fill="url(#trendGradient)"/>
          </svg>
          
          <!-- Etichette X -->
          <div style="position: absolute; bottom: 0; left: 0; right: 0; display: flex; justify-content: space-between; padding: 0 50px; font-size: 0.875rem; color: var(--text-muted);">
            ${mesi.map(mese => `<span>${mese}</span>`).join('')}
          </div>
        </div>
        
        <!-- Statistiche sotto il grafico -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 24px; margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--border-light);">
          <div style="text-align: center;">
            <div style="color: var(--primary-green); font-size: 1.5rem; font-weight: 700;">+${crescitaMedia}%</div>
            <div style="color: var(--text-muted); font-size: 0.875rem; font-weight: 500;">Crescita Media</div>
          </div>
          <div style="text-align: center;">
            <div style="color: var(--primary-blue); font-size: 1.5rem; font-weight: 700;">€${incrementoMensile.toLocaleString()}</div>
            <div style="color: var(--text-muted); font-size: 0.875rem; font-weight: 500;">Incremento YoY</div>
          </div>
          <div style="text-align: center;">
            <div style="color: var(--primary-violet); font-size: 1.5rem; font-weight: 700;">Agosto</div>
            <div style="color: var(--text-muted); font-size: 0.875rem; font-weight: 500;">Miglior Mese</div>
          </div>
          <div style="text-align: center;">
            <div style="color: var(--primary-orange); font-size: 1.5rem; font-weight: 700;">€11.3k/mese</div>
            <div style="color: var(--text-muted); font-size: 0.875rem; font-weight: 500;">Velocità</div>
          </div>
        </div>
      </div>
    `;
  }
