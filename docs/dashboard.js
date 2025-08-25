<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard CARABOT NATALINO - Auto Update</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@3.9.1/chart.min.js"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        /* ==================== VARIABLES ==================== */
        :root {
          --primary-blue: #3b82f6;
          --primary-violet: #8b5cf6;
          --primary-cyan: #22d3ee;
          --primary-emerald: #10b981;
          --text-primary: #1f2937;
          --text-secondary: #6b7280;
          --bg-primary: #f8fafc;
          --bg-card: rgba(255, 255, 255, 0.95);
          --border-color: rgba(255, 255, 255, 0.9);
          --shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        [class*="dark-mode"] {
          --text-primary: #f9fafb;
          --text-secondary: #9ca3af;
          --bg-primary: #0f172a;
          --bg-card: rgba(30, 41, 59, 0.9);
          --border-color: rgba(51, 65, 85, 0.6);
          --shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        /* ==================== BASE STYLES ==================== */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          min-height: 100vh;
          transition: all 0.5s ease;
        }

        .light-mode {
          background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 50%, #f3e8ff 100%);
          color: var(--text-primary);
        }

        .dark-mode {
          background: linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%);
          color: var(--text-primary);
        }

        #dashboard-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 1.5rem;
          position: relative;
        }

        /* ==================== HEADER ==================== */
        .dashboard-header {
          background: var(--bg-card);
          backdrop-filter: blur(20px);
          border-radius: 1.5rem;
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow);
          margin-bottom: 2rem;
          overflow: hidden;
        }

        .header-content {
          padding: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 1.5rem;
        }

        .agent-info h1 {
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .agent-info p {
          color: var(--text-secondary);
          font-size: 1.125rem;
        }

        .header-controls {
          display: flex;
          gap: 0.75rem;
        }

        .control-btn {
          padding: 0.75rem;
          border-radius: 0.75rem;
          border: none;
          background: var(--primary-blue);
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1.125rem;
        }

        .control-btn:hover {
          transform: scale(1.05);
          filter: brightness(1.1);
        }

        .control-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .control-btn i.fa-sync-alt.spinning {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .status-info {
          padding: 0 2rem 1.5rem;
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          align-items: center;
        }

        .status-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
        }

        .status-item .label {
          color: var(--text-secondary);
        }

        .status-item code {
          background: rgba(107, 114, 128, 0.1);
          padding: 0.25rem 0.5rem;
          border-radius: 0.375rem;
          font-family: 'Monaco', 'Consolas', monospace;
          font-size: 0.875rem;
        }

        .status-dot {
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .status-dot.online { background: #10b981; }
        .status-dot.offline { background: #ef4444; }
        .status-dot.updating { background: var(--primary-blue); animation: pulse 2s infinite; }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .status-bar {
          padding: 1rem 2rem;
          border-top: 1px solid rgba(107, 114, 128, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .status-badge {
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .status-badge.success {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
        }

        .status-badge.error {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .status-badge.updating {
          background: rgba(59, 130, 246, 0.1);
          color: var(--primary-blue);
        }

        .filter-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: var(--primary-blue);
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .filter-btn:hover {
          transform: scale(1.05);
          filter: brightness(1.1);
        }

        /* ==================== LOADING & ERROR STATES ==================== */
        .loading-container, .error-container {
          background: var(--bg-card);
          backdrop-filter: blur(20px);
          border-radius: 1.5rem;
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow);
          padding: 3rem;
          text-align: center;
          margin-bottom: 2rem;
        }

        .loading-spinner {
          font-size: 2rem;
          color: var(--primary-blue);
          margin-bottom: 1rem;
          animation: spin 1s linear infinite;
        }

        .loading-content p, .error-content p {
          font-size: 1.125rem;
          font-weight: 500;
          color: var(--text-primary);
        }

        .error-content {
          display: flex;
          align-items: center;
          gap: 1rem;
          text-align: left;
        }

        .error-content i {
          font-size: 1.5rem;
          color: #ef4444;
        }

        .error-content h3 {
          font-weight: 700;
          color: #ef4444;
          margin-bottom: 0.25rem;
        }

        /* ==================== KPI CARDS ==================== */
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .kpi-card {
          background: var(--bg-card);
          backdrop-filter: blur(20px);
          border-radius: 1.5rem;
          border: 2px solid var(--border-color);
          box-shadow: var(--shadow);
          padding: 2rem;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .kpi-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, var(--primary-blue), var(--primary-violet));
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .kpi-card:hover::before {
          opacity: 1;
        }

        .kpi-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .kpi-label {
          color: var(--text-secondary);
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }

        .kpi-value {
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1;
          transition: all 0.5s ease;
        }

        .kpi-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          border-radius: 9999px;
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
          font-size: 0.875rem;
          font-weight: 700;
        }

        .kpi-badge.secondary {
          background: rgba(34, 211, 238, 0.1);
          color: #22d3ee;
        }

        .kpi-percentage {
          text-align: right;
        }

        .kpi-percentage span {
          font-size: 2rem;
          font-weight: 800;
          color: var(--primary-emerald);
          transition: all 0.5s ease;
        }

        .progress-container {
          margin: 1rem 0;
        }

        .progress-bar {
          width: 100%;
          height: 0.75rem;
          background: rgba(107, 114, 128, 0.2);
          border-radius: 9999px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--primary-emerald), #34d399);
          border-radius: 9999px;
          transition: width 1.5s ease;
          width: 0%;
        }

        .kpi-footer {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-secondary);
          font-size: 0.875rem;
          margin-top: auto;
        }

        .kpi-footer span:last-child {
          font-weight: 500;
          color: var(--text-primary);
        }

        /* ==================== CHARTS ==================== */
        .charts-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .chart-card {
          background: var(--bg-card);
          backdrop-filter: blur(20px);
          border-radius: 1.5rem;
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow);
          padding: 2rem;
          transition: all 0.3s ease;
        }

        .chart-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
        }

        .chart-card h3 {
          margin-bottom: 1.5rem;
          color: var(--text-primary);
          font-size: 1.2rem;
          font-weight: 700;
        }

        /* ==================== TABLE ==================== */
        .table-container {
          background: var(--bg-card);
          backdrop-filter: blur(20px);
          border-radius: 1.5rem;
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow);
          padding: 2rem;
          position: relative;
          overflow: hidden;
        }

        .table-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .table-header h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .table-status {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 0.875rem;
        }

        .status-badge.small {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.5rem;
          border-radius: 0.5rem;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .table-wrapper {
          overflow-x: auto;
          margin-bottom: 1.5rem;
        }

        #vendite-table {
          width: 100%;
          border-collapse: collapse;
        }

        #vendite-table th {
          text-align: left;
          padding: 0.75rem 1rem;
          border-bottom: 2px solid rgba(107, 114, 128, 0.1);
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--text-secondary);
          letter-spacing: 0.05em;
        }

        #vendite-table th:last-child {
          text-align: right;
        }

        #vendite-table td {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid rgba(107, 114, 128, 0.05);
          transition: all 0.3s ease;
        }

        #vendite-table td:last-child {
          text-align: right;
          font-weight: 700;
          color: var(--text-primary);
        }

        #vendite-table tr:hover {
          background: rgba(107, 114, 128, 0.03);
        }

        .province-badge {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .province-badge.LT {
          background: rgba(139, 92, 246, 0.1);
          color: #8b5cf6;
        }

        .province-badge.RM {
          background: rgba(34, 211, 238, 0.1);
          color: #22d3ee;
        }

        .table-footer {
          border-top: 1px solid rgba(107, 114, 128, 0.1);
          padding-top: 1rem;
        }

        .footer-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 1rem;
          text-align: center;
        }

        .stat {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .stat-value {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--text-primary);
          transition: all 0.5s ease;
        }

        .stat-label {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        /* ==================== POPUP ==================== */
        .popup-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .popup-content {
          background: var(--bg-card);
          backdrop-filter: blur(20px);
          border-radius: 1rem;
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow);
          width: 100%;
          max-width: 28rem;
          max-height: 85vh;
          overflow: hidden;
        }

        .popup-header {
          padding: 1.5rem;
          border-bottom: 1px solid rgba(107, 114, 128, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .popup-header h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .popup-header p {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-top: 0.25rem;
        }

        .close-btn {
          padding: 0.5rem;
          border-radius: 0.5rem;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .close-btn:hover {
          background: rgba(107, 114, 128, 0.1);
          color: var(--text-primary);
          transform: scale(1.05);
        }

        .popup-body {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          max-height: 60vh;
          overflow-y: auto;
        }

        .province-option {
          width: 100%;
          padding: 1rem;
          border-radius: 0.75rem;
          border: 2px solid transparent;
          background: rgba(107, 114, 128, 0.05);
          text-align: left;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .province-option:hover {
          background: rgba(107, 114, 128, 0.1);
        }

        .province-option.selected {
          background: var(--primary-blue);
          border-color: var(--primary-blue);
          color: white;
          transform: scale(1.02);
        }

        .province-option.selected.LT {
          background: #8b5cf6;
          border-color: #8b5cf6;
        }

        .province-option.selected.RM {
          background: #22d3ee;
          border-color: #22d3ee;
        }

        .option-info h4 {
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .option-info p {
          font-size: 0.875rem;
          opacity: 0.8;
        }

        .option-radio {
          width: 1.25rem;
          height: 1.25rem;
          border-radius: 50%;
          border: 2px solid currentColor;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .option-radio.selected::after {
          content: '';
          width: 0.625rem;
          height: 0.625rem;
          border-radius: 50%;
          background: currentColor;
        }

        .popup-footer {
          padding: 1rem 1.5rem;
          border-top: 1px solid rgba(107, 114, 128, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .popup-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .popup-btn {
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          border: none;
          background: rgba(107, 114, 128, 0.1);
          color: var(--text-primary);
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .popup-btn:hover {
          background: rgba(107, 114, 128, 0.2);
        }

        /* ==================== RESPONSIVE ==================== */
        @media (max-width: 768px) {
          #dashboard-container {
            padding: 1rem;
          }
          
          .header-content {
            padding: 1.5rem;
          }
          
          .agent-info h1 {
            font-size: 2rem;
          }
          
          .agent-info p {
            font-size: 1rem;
          }
          
          .status-info {
            padding: 0 1.5rem 1rem;
            gap: 1rem;
          }
          
          .status-bar {
            padding: 1rem 1.5rem;
            flex-direction: column;
            align-items: stretch;
          }
          
          .kpi-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          
          .kpi-card {
            padding: 1.5rem;
          }
          
          .kpi-value {
            font-size: 2rem;
          }
          
          .charts-container {
            grid-template-columns: 1fr;
          }
          
          .table-container {
            padding: 1.5rem;
          }
          
          .table-header {
            flex-direction: column;
            align-items: stretch;
          }
          
          .footer-stats {
            grid-template-columns: repeat(2, 1fr);
          }
        }
    </style>
</head>
<body class="light-mode">
    <div id="dashboard-container">
        
        <!-- HEADER -->
        <header class="dashboard-header">
            <div class="header-content">
                <div class="agent-info">
                    <h1>CARABOT NATALINO</h1>
                    <p>Dashboard Performance Vendite - Auto Update dal CSV GitHub</p>
                </div>
                
                <div class="header-controls">
                    <button id="refresh-btn" class="control-btn">
                        <i class="fas fa-sync-alt" id="refresh-icon"></i>
                    </button>
                    <button id="theme-toggle" class="control-btn">
                        <i class="fas fa-moon" id="theme-icon"></i>
                    </button>
                </div>
            </div>
            
            <div class="status-info">
                <div class="status-item">
                    <span class="label">ID:</span>
                    <code>631.00238</code>
                </div>
                <div class="status-item">
                    <i class="fas fa-calendar"></i>
                    <span>Gen - Ago 2025</span>
                </div>
                <div class="status-item">
                    <div class="status-dot" id="connection-dot"></div>
                    <span id="connection-status">Caricamento...</span>
                </div>
                <div class="status-item">
                    <span>Ultimo: <span id="last-update">Mai</span></span>
                </div>
            </div>
            
            <div class="status-bar">
                <div class="status-badge" id="status-badge">
                    🔄 Caricamento dati...
                </div>
                <button id="province-filter" class="filter-btn">
                    <i class="fas fa-filter"></i>
                    <span>Filtro Provincia</span>
                </button>
            </div>
        </header>

        <!-- LOADING STATE -->
        <div id="loading-state" class="loading-container">
            <div class="loading-content">
                <i class="fas fa-sync-alt loading-spinner"></i>
                <p>Caricamento dati REALI dal CSV GitHub...</p>
            </div>
        </div>

        <!-- ERROR STATE -->
        <div id="error-state" class="error-container" style="display: none;">
            <div class="error-content">
                <i class="fas fa-exclamation-triangle"></i>
                <div>
                    <h3>Errore di connessione</h3>
                    <p id="error-message"></p>
                </div>
            </div>
        </div>

        <!-- MAIN CONTENT -->
        <div id="main-content" style="display: none;">
            
            <!-- KPI CARDS -->
            <div class="kpi-grid" id="kpi-grid">
                
                <!-- Fatturato Card -->
                <div class="kpi-card" id="fatturato-card">
                    <div class="kpi-header">
                        <div class="kpi-info">
                            <p class="kpi-label">Fatturato 2025</p>
                            <p class="kpi-value" id="fatturato-value">€0</p>
                        </div>
                        <div class="kpi-badge">
                            <i class="fas fa-arrow-up"></i>
                            <span id="growth-value">+0%</span>
                        </div>
                    </div>
                    <div class="kpi-footer">
                        <span>vs 2024: </span>
                        <span id="previous-value">€0</span>
                    </div>
                </div>

                <!-- Obiettivo Card (condizionale) -->
                <div class="kpi-card" id="obiettivo-card" style="display: none;">
                    <div class="kpi-header">
                        <div class="kpi-info">
                            <p class="kpi-label">Obiettivo 2025</p>
                            <p class="kpi-value" id="obiettivo-value">€0</p>
                        </div>
                        <div class="kpi-percentage">
                            <span id="obiettivo-percentage">0%</span>
                        </div>
                    </div>
                    <div class="progress-container">
                        <div class="progress-bar">
                            <div class="progress-fill" id="progress-fill"></div>
                        </div>
                    </div>
                    <div class="kpi-footer">
                        <span>Da raggiungere: </span>
                        <span id="remaining-value">€0</span>
                    </div>
                </div>

                <!-- Clienti Card -->
                <div class="kpi-card" id="clienti-card">
                    <div class="kpi-header">
                        <div class="kpi-info">
                            <p class="kpi-label">Clienti Attivi</p>
                            <p class="kpi-value" id="clienti-value">0</p>
                        </div>
                        <div class="kpi-badge secondary">
                            <span id="provincia-label">TOT</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- CHARTS SECTION -->
            <div class="charts-container">
                
                <div class="chart-card">
                    <h3>
                        <i class="fas fa-map-marker-alt" style="margin-right: 0.5rem; color: var(--primary-blue);"></i>
                        Fatturato per Provincia
                    </h3>
                    <div style="position: relative; height: 300px;">
                        <canvas id="provinceChart"></canvas>
                    </div>
                </div>

                <div class="chart-card">
                    <h3>
                        <i class="fas fa-bullseye" style="margin-right: 0.5rem; color: var(--primary-emerald);"></i>
                        Progresso Obiettivo
                    </h3>
                    <div style="position: relative; height: 300px;">
                        <canvas id="progressChart"></canvas>
                    </div>
                </div>

                <div class="chart-card">
                    <h3>
                        <i class="fas fa-layer-group" style="margin-right: 0.5rem; color: var(--primary-violet);"></i>
                        Categorie Prodotti
                    </h3>
                    <div style="position: relative; height: 300px;">
                        <canvas id="categoryChart"></canvas>
                    </div>
                </div>

                <div class="chart-card">
                    <h3>
                        <i class="fas fa-crown" style="margin-right: 0.5rem; color: var(--primary-cyan);"></i>
                        Top 5 Clienti
                    </h3>
                    <div style="position: relative; height: 300px;">
                        <canvas id="topClientsChart"></canvas>
                    </div>
                </div>
            </div>

            <!-- TOP VENDITE TABLE -->
            <div class="table-container" id="table-container">
                <div class="table-header">
                    <h3>Top Vendite per Cliente (Dati Reali CSV)</h3>
                    <div class="table-status">
                        <span id="table-update">Aggiornato: <span id="table-timestamp">-</span></span>
                        <div class="status-badge small" id="table-status-badge">
                            <i class="fas fa-check-circle"></i>
                            <span>Live</span>
                        </div>
                    </div>
                </div>
                
                <div class="table-wrapper">
                    <table id="vendite-table">
                        <thead>
                            <tr>
                                <th>Provincia</th>
                                <th>Cliente</th>
                                <th>Categoria</th>
                                <th>Fatturato</th>
                            </tr>
                        </thead>
                        <tbody id="vendite-tbody">
                            <!-- Popolato dinamicamente -->
                        </tbody>
                    </table>
                </div>
                
                <div class="table-footer">
                    <div class="footer-stats">
                        <div class="stat">
                            <span class="stat-value" id="total-clients">0</span>
                            <span class="stat-label">Top Clienti</span>
                        </div>
                        <div class="stat">
                            <span class="stat-value" id="total-top-revenue">€0</span>
                            <span class="stat-label">Fatturato Top</span>
                        </div>
                        <div class="stat">
                            <span class="stat-value" id="update-status-icon">✅</span>
                            <span class="stat-label">Status</span>
                        </div>
                        <div class="stat">
                            <span class="stat-value">2min</span>
                            <span class="stat-label">Auto Update</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- PROVINCE FILTER POPUP -->
        <div id="province-popup" class="popup-overlay" style="display: none;">
            <div class="popup-content">
                <div class="popup-header">
                    <div>
                        <h3>Seleziona Provincia</h3>
                        <p>Filtra i dati per territorio</p>
                    </div>
                    <button id="close-popup" class="close-btn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="popup-body" id="popup-options">
                    <!-- Popolato dinamicamente -->
                </div>
                
                <div class="popup-footer">
                    <div class="popup-status">
                        <div class="status-dot" id="popup-status-dot"></div>
                        <span id="popup-status-text">Dati CSV aggiornati automaticamente</span>
                    </div>
                    <button id="popup-close-btn" class="popup-btn">Chiudi</button>
                </div>
            </div>
        </div>
    </div>

    <script>
        // ==================== DASHBOARD CARABOT NATALINO - GITHUB PAGES ====================
        // Vanilla JS — CSV live, parser IT, formattazione "k" max 3 cifre ovunque + Grafici
        // Fix: URL risolti automaticamente per GitHub Pages (repo-pages con /<repo>/),
        //      rimozione controllo troppo rigido sul contenuto del CSV,
        //      log dettagliati e messaggi d'errore più chiari.

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

              console.log('🔎 CSV candidate URLs:', candidates);

              // Prova in sequenza gli URL definiti
              for (const url of candidates) {
                const u = url + cacheBuster;
                try {
                  console.log('↗️ GET', u);
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
                  console.warn('⚠️ Fallito', u, e);
                  lastError = e;
                }
              }

              if (!text) throw lastError || new Error('Impossibile leggere il CSV');

              // Log diagnostico
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
                clienti: parseInt(generaleMatch[4], 10)
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

              // DETTAGLIO VENDITE → top 10
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

          // ==================== DASHBOARD RENDERING ====================
          renderDashboard() {
            if (!this.csvData) return;
            this.renderKPICards();
            this.renderVenditeTable();
            this.renderCharts();
            this.updateProvinceOptions();
          }

          renderKPICards() {
            const data = this.getDisplayData();

            // Fatturato — in k
            const fatturatoValue = document.getElementById('fatturato-value');
            if (fatturatoValue) fatturatoValue.textContent = this.formatEuroK3(data.fatturato);

            const growthValue = document.getElementById('growth-value');
            if (growthValue) growthValue.textContent = '+' + data.crescita + '%';

            const previousValue = document.getElementById('previous-value');
            if (previousValue) previousValue.textContent = this.formatEuroK3(data.annoPrecedente);

            // Obiettivo — in k
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
            if (statusIcon) statusIcon.textContent = '✅';

            const tableStatusBadge = document.getElementById('table-status-badge');
            if (tableStatusBadge) { tableStatusBadge.innerHTML = '<i class="fas fa-check-circle"></i><span>Live</span>'; tableStatusBadge.className = 'status-badge small success'; }
          }

          // ==================== CHARTS RENDERING ====================
          renderCharts() {
            if (!this.csvData) return;
            this.renderProvinceChart();
            this.renderCategoryChart();
            this.renderTopClientsChart();
            this.renderProgressChart();
          }

          renderProvinceChart() {
            const ctx = document.getElementById('provinceChart');
            if (!ctx) return;

            const data = {
              labels: ['Latina (LT)', 'Roma (RM)'],
              datasets: [{
                label: 'Fatturato per Provincia',
                data: [this.csvData.latina.annoCorrente, this.csvData.roma.annoCorrente],
                backgroundColor: ['#3b82f6', '#ef4444'],
                borderColor: ['#2563eb', '#dc2626'],
                borderWidth: 2
              }]
            };

            if (window.provinceChartInstance) {
              window.provinceChartInstance.destroy();
            }

            window.provinceChartInstance = new Chart(ctx, {
              type: 'doughnut',
              data: data,
              options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: { color: '#64748b', font: { size: 12 } }
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const value = this.formatEuroK3(context.raw);
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((context.raw / total) * 100).toFixed(1);
                        return `${context.label}: ${value} (${percentage}%)`;
                      }
                    }
                  }
                }
              }
            });
          }

          renderCategoryChart() {
            const ctx = document.getElementById('categoryChart');
            if (!ctx) return;

            const categories = this.extractCategoryData();
            
            const data = {
              labels: categories.map(c => c.name),
              datasets: [{
                label: 'Fatturato per Categoria',
                data: categories.map(c => c.value),
                backgroundColor: [
                  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
                  '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6b7280'
                ],
                borderWidth: 0
              }]
            };

            if (window.categoryChartInstance) {
              window.categoryChartInstance.destroy();
            }

            window.categoryChartInstance = new Chart(ctx, {
              type: 'bar',
              data: data,
              options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label: (context) => `${context.label}: ${this.formatEuroK3(context.raw)}`
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) => this.formatK3(value),
                      color: '#64748b'
                    },
                    grid: { color: 'rgba(148, 163, 184, 0.1)' }
                  },
                  x: {
                    ticks: { 
                      color: '#64748b',
                      maxRotation: 45,
                      font: { size: 10 }
                    },
                    grid: { display: false }
                  }
                }
              }
            });
          }

          renderTopClientsChart() {
            const ctx = document.getElementById('topClientsChart');
            if (!ctx) return;

            const topClients = this.csvData.vendite.slice(0, 5);
            
            const data = {
              labels: topClients.map(c => c.cliente.length > 25 ? c.cliente.substring(0, 25) + '...' : c.cliente),
              datasets: [{
                label: 'Top 5 Clienti',
                data: topClients.map(c => c.fatturato),
                backgroundColor: '#3b82f6',
                borderColor: '#2563eb',
                borderWidth: 1
              }]
            };

            if (window.topClientsChartInstance) {
              window.topClientsChartInstance.destroy();
            }

            window.topClientsChartInstance = new Chart(ctx, {
              type: 'bar',
              data: data,
              options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label: (context) => this.formatEuroK3(context.raw)
                    }
                  }
                },
                scales: {
                  x: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) => this.formatK3(value),
                      color: '#64748b'
                    },
                    grid: { color: 'rgba(148, 163, 184, 0.1)' }
                  },
                  y: {
                    ticks: { 
                      color: '#64748b',
                      font: { size: 11 }
                    },
                    grid: { display: false }
                  }
                }
              }
            });
          }

          renderProgressChart() {
            const ctx = document.getElementById('progressChart');
            if (!ctx) return;

            const data = this.getDisplayData();
            const obiettivo = data.obiettivo || 0;
            const fatturato = data.fatturato || 0;
            const rimanente = Math.max(0, obiettivo - fatturato);

            const chartData = {
              labels: ['Realizzato', 'Da Realizzare'],
              datasets: [{
                data: [fatturato, rimanente],
                backgroundColor: ['#10b981', '#e5e7eb'],
                borderColor: ['#059669', '#d1d5db'],
                borderWidth: 2
              }]
            };

            if (window.progressChartInstance) {
              window.progressChartInstance.destroy();
            }

            if (obiettivo > 0) {
              window.progressChartInstance = new Chart(ctx, {
                type: 'doughnut',
                data: chartData,
                options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  cutout: '70%',
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: { color: '#64748b', font: { size: 12 } }
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          const value = this.formatEuroK3(context.raw);
                          const percentage = ((context.raw / obiettivo) * 100).toFixed(1);
                          return `${context.label}: ${value} (${percentage}%)`;
                        }
                      }
                    }
                  }
                }
              });
            }
          }

          extractCategoryData() {
            if (!this.csvData.vendite) return [];
            
            const categoryMap = new Map();
            
            this.csvData.vendite.forEach(vendita => {
              const cat = vendita.categoria;
              if (categoryMap.has(cat)) {
                categoryMap.set(cat, categoryMap.get(cat) + vendita.fatturato);
              } else {
                categoryMap.set(cat, vendita.fatturato);
              }
            });

            return Array.from(categoryMap.entries())
              .map(([name, value]) => ({ name, value }))
              .sort((a, b) => b.value - a.value)
              .slice(0, 8);
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
              description: this.formatEuroK3(this.csvData.generale.annoCorrente) + ' • ' + this.csvData.generale.clienti + ' clienti',
              className: ''
            }));

            // Latina
            popupOptions.appendChild(this.createProvinceOption('LT', {
              title: 'Latina (LT)',
              description: this.formatEuroK3(this.csvData.latina.annoCorrente) + ' • ' + this.csvData.latina.clientiCorrente + ' clienti • Obiettivo: ' + (this.csvData.latina.percentualeObiettivo || 0) + '%',
              className: 'LT'
            }));

            // Roma
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
              .replace(/€/g, '')
              .replace(/\./g, '')
              .replace(/,/g, '.');
            const n = Number(cleaned);
            return Number.isFinite(n) ? n : 0;
          }

          // "k" con max 3 cifre (1,23k • 12,3k • 123k). Per importi in euro → sempre migliaia.
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
            if (!value) return '€0k';
            const k = this.formatK3(value);
            return '€' + k.replace('k','') + 'k';
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
              console.assert(this.parseNumber('€ 987.654,00') === 987654, 'parseNumber 2');
              console.assert(this.formatK3(1234) === '1,23k', 'formatK3 1');
              console.assert(this.formatK3(12345) === '12,3k', 'formatK3 2');
              console.assert(this.formatK3(123456) === '123k', 'formatK3 3');
              console.assert(this.formatEuroK3(1500) === '€1,5k', 'formatEuroK3');
            } catch (e) { /* ignore in produzione */ }
          }

          // ==================== CLEANUP ====================
          destroy() { 
            if (this.updateInterval) clearInterval(this.updateInterval); 
            // Destroy chart instances
            if (window.provinceChartInstance) window.provinceChartInstance.destroy();
            if (window.categoryChartInstance) window.categoryChartInstance.destroy();
            if (window.topClientsChartInstance) window.topClientsChartInstance.destroy();
            if (window.progressChartInstance) window.progressChartInstance.destroy();
          }
        }

        // ==================== INITIALIZATION ====================
        document.addEventListener('DOMContentLoaded', () => {
          window.dashboard = new DashboardManager();
        });

        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
          if (window.dashboard) window.dashboard.destroy();
        });
    </script>
</body>
</html>
