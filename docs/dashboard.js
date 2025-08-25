<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Carabot Natalino</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        :root {
            --primary-color: #3b82f6;
            --success-color: #10b981;
            --warning-color: #f59e0b;
            --danger-color: #ef4444;
            --dark-color: #1f2937;
            --gray-100: #f3f4f6;
            --gray-200: #e5e7eb;
            --gray-300: #d1d5db;
            --gray-400: #9ca3af;
            --gray-500: #6b7280;
            --gray-600: #4b5563;
            --gray-700: #374151;
            --gray-800: #1f2937;
            --gray-900: #111827;
            --border-radius: 12px;
            --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
            --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: var(--gray-800);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
            transition: all 0.3s ease;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-lg);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, var(--primary-color) 0%, #1d4ed8 100%);
            color: white;
            padding: 2rem;
            position: relative;
            overflow: hidden;
        }

        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
            opacity: 0.1;
        }

        .header-content {
            position: relative;
            z-index: 1;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 1rem;
        }

        .header-info h1 {
            font-size: 2.5rem;
            font-weight: 800;
            margin-bottom: 0.5rem;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .header-info p {
            font-size: 1.1rem;
            opacity: 0.9;
            margin-bottom: 0.25rem;
        }

        .header-controls {
            display: flex;
            gap: 1rem;
            align-items: center;
        }

        .btn {
            padding: 12px 20px;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            text-decoration: none;
            font-size: 0.9rem;
        }

        .btn-primary {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            backdrop-filter: blur(10px);
        }

        .btn-primary:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
        }

        .status-indicator {
            display: flex;
            align-items: center;
            gap: 8px;
            background: rgba(255, 255, 255, 0.1);
            padding: 8px 16px;
            border-radius: 20px;
            backdrop-filter: blur(10px);
        }

        .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            animation: pulse 2s infinite;
        }

        .status-dot.online { background: var(--success-color); }
        .status-dot.updating { background: var(--warning-color); }
        .status-dot.offline { background: var(--danger-color); }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }

        .main-content {
            padding: 2rem;
        }

        .kpi-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }

        .kpi-card {
            background: white;
            border-radius: var(--border-radius);
            padding: 1.5rem;
            box-shadow: var(--shadow-sm);
            border: 1px solid var(--gray-200);
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
            height: 4px;
            background: linear-gradient(90deg, var(--primary-color), #1d4ed8);
        }

        .kpi-card:hover {
            transform: translateY(-4px);
            box-shadow: var(--shadow-md);
        }

        .kpi-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }

        .kpi-title {
            color: var(--gray-600);
            font-size: 0.9rem;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .kpi-icon {
            width: 40px;
            height: 40px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            color: white;
        }

        .kpi-value {
            font-size: 2.2rem;
            font-weight: 800;
            color: var(--gray-800);
            margin-bottom: 0.5rem;
        }

        .kpi-subtitle {
            color: var(--gray-500);
            font-size: 0.85rem;
        }

        .progress-bar {
            width: 100%;
            height: 6px;
            background: var(--gray-200);
            border-radius: 3px;
            overflow: hidden;
            margin-top: 1rem;
        }

        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--success-color), #059669);
            border-radius: 3px;
            transition: width 0.8s ease;
        }

        /* Charts Section */
        .charts-section {
            margin: 2rem 0;
        }

        .charts-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid var(--gray-200);
        }

        .charts-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--gray-800);
        }

        .charts-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }

        .chart-card {
            background: white;
            border-radius: var(--border-radius);
            padding: 1.5rem;
            box-shadow: var(--shadow-sm);
            border: 1px solid var(--gray-200);
            transition: all 0.3s ease;
        }

        .chart-card:hover {
            box-shadow: var(--shadow-md);
        }

        .chart-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }

        .chart-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: var(--gray-700);
        }

        .chart-container {
            position: relative;
            height: 300px;
            width: 100%;
        }

        .sales-section {
            background: white;
            border-radius: var(--border-radius);
            padding: 1.5rem;
            box-shadow: var(--shadow-sm);
            border: 1px solid var(--gray-200);
        }

        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid var(--gray-200);
        }

        .section-title {
            font-size: 1.3rem;
            font-weight: 700;
            color: var(--gray-800);
        }

        .status-badge {
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .status-badge.success {
            background: rgba(16, 185, 129, 0.1);
            color: var(--success-color);
        }

        .status-badge.updating {
            background: rgba(245, 158, 11, 0.1);
            color: var(--warning-color);
        }

        .status-badge.error {
            background: rgba(239, 68, 68, 0.1);
            color: var(--danger-color);
        }

        .table-container {
            overflow-x: auto;
            border-radius: 8px;
            border: 1px solid var(--gray-200);
        }

        .data-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.9rem;
        }

        .data-table th {
            background: var(--gray-50);
            color: var(--gray-700);
            font-weight: 600;
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid var(--gray-200);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-size: 0.8rem;
        }

        .data-table td {
            padding: 12px;
            border-bottom: 1px solid var(--gray-100);
            transition: background 0.2s ease;
        }

        .data-table tr:hover {
            background: var(--gray-50);
        }

        .province-badge {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: 600;
            color: white;
            text-transform: uppercase;
        }

        .province-badge.LT { background: var(--primary-color); }
        .province-badge.RM { background: var(--danger-color); }

        /* Loading and Error States */
        .loading-state, .error-state {
            text-align: center;
            padding: 4rem 2rem;
        }

        .loading-spinner {
            width: 50px;
            height: 50px;
            border: 4px solid var(--gray-200);
            border-top: 4px solid var(--primary-color);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .error-icon {
            font-size: 3rem;
            color: var(--danger-color);
            margin-bottom: 1rem;
        }

        /* Province Filter Popup */
        .province-popup {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            backdrop-filter: blur(5px);
        }

        .popup-content {
            background: white;
            border-radius: var(--border-radius);
            padding: 2rem;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: var(--shadow-lg);
            animation: popupSlideIn 0.3s ease;
        }

        @keyframes popupSlideIn {
            from { opacity: 0; transform: scale(0.9) translateY(-20px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .popup-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid var(--gray-200);
        }

        .popup-title {
            font-size: 1.3rem;
            font-weight: 700;
            color: var(--gray-800);
        }

        .popup-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: var(--gray-400);
            transition: color 0.2s ease;
        }

        .popup-close:hover {
            color: var(--gray-600);
        }

        .province-option {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            padding: 1rem;
            margin-bottom: 0.5rem;
            border: 1px solid var(--gray-200);
            border-radius: 8px;
            background: white;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .province-option:hover {
            background: var(--gray-50);
            border-color: var(--primary-color);
        }

        .province-option.selected {
            background: rgba(59, 130, 246, 0.1);
            border-color: var(--primary-color);
        }

        .option-info h4 {
            font-size: 1rem;
            font-weight: 600;
            color: var(--gray-800);
            margin-bottom: 0.25rem;
        }

        .option-info p {
            font-size: 0.85rem;
            color: var(--gray-500);
        }

        .option-radio {
            width: 20px;
            height: 20px;
            border: 2px solid var(--gray-300);
            border-radius: 50%;
            position: relative;
        }

        .option-radio.selected {
            border-color: var(--primary-color);
        }

        .option-radio.selected::after {
            content: '';
            width: 10px;
            height: 10px;
            background: var(--primary-color);
            border-radius: 50%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            body { padding: 10px; }
            .header { padding: 1rem; }
            .header-content { flex-direction: column; text-align: center; }
            .header-info h1 { font-size: 2rem; }
            .main-content { padding: 1rem; }
            .kpi-grid { grid-template-columns: 1fr; gap: 1rem; }
            .charts-grid { grid-template-columns: 1fr; }
            .chart-container { height: 250px; }
        }

        /* Dark Mode Support */
        body.dark-mode {
            background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
            color: var(--gray-100);
        }

        body.dark-mode .container {
            background: rgba(31, 41, 55, 0.95);
        }

        body.dark-mode .kpi-card,
        body.dark-mode .chart-card,
        body.dark-mode .sales-section {
            background: var(--gray-800);
            border-color: var(--gray-700);
        }

        body.dark-mode .data-table th {
            background: var(--gray-700);
            color: var(--gray-200);
        }

        body.dark-mode .data-table td {
            border-color: var(--gray-700);
        }

        body.dark-mode .data-table tr:hover {
            background: var(--gray-700);
        }

        /* Animations */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .kpi-card, .chart-card, .sales-section {
            animation: fadeInUp 0.6s ease forwards;
        }

        .spinning {
            animation: spin 1s linear infinite;
        }
    </style>
</head>
<body class="light-mode">
    <div class="container">
        <!-- Header -->
        <header class="header">
            <div class="header-content">
                <div class="header-info">
                    <h1><i class="fas fa-chart-line"></i> Dashboard Carabot Natalino</h1>
                    <p><strong>Codice Agente:</strong> 631.00238</p>
                    <p><strong>Periodo:</strong> 01/01/2025 - 17/08/2025</p>
                </div>
                <div class="header-controls">
                    <div class="status-indicator">
                        <div class="status-dot offline" id="connection-dot"></div>
                        <span id="connection-status">Disconnesso</span>
                        <span id="last-update">--</span>
                    </div>
                    <button class="btn btn-primary" id="refresh-btn" title="Aggiorna dati">
                        <i class="fas fa-sync-alt" id="refresh-icon"></i>
                        Aggiorna
                    </button>
                    <button class="btn btn-primary" id="theme-toggle" title="Cambia tema">
                        <i class="fas fa-moon" id="theme-icon"></i>
                    </button>
                    <button class="btn btn-primary" id="province-filter" title="Filtra per provincia">
                        <i class="fas fa-map-marker-alt"></i>
                        <span id="provincia-label">TOT</span>
                    </button>
                </div>
            </div>
        </header>

        <!-- Loading State -->
        <div id="loading-state" class="loading-state">
            <div class="loading-spinner"></div>
            <h3>Caricamento dati in corso...</h3>
            <p>Connessione al CSV live</p>
            <div id="status-badge" class="status-badge updating">
                <i class="fas fa-spinner fa-spin"></i>
                <span>Inizializzazione...</span>
            </div>
        </div>

        <!-- Error State -->
        <div id="error-state" class="error-state" style="display: none;">
            <div class="error-icon">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <h3>Errore nel caricamento dei dati</h3>
            <p id="error-message">Impossibile accedere al file CSV. Verifica la connessione.</p>
            <button class="btn btn-primary" onclick="window.dashboard?.fetchCSVData(true)">
                <i class="fas fa-redo"></i>
                Riprova
            </button>
        </div>

        <!-- Main Content -->
        <main id="main-content" class="main-content" style="display: none;">
            <!-- KPI Cards -->
            <div class="kpi-grid">
                <div class="kpi-card">
                    <div class="kpi-header">
                        <div class="kpi-title">Fatturato Anno Corrente</div>
                        <div class="kpi-icon" style="background: var(--primary-color);">
                            <i class="fas fa-euro-sign"></i>
                        </div>
                    </div>
                    <div class="kpi-value" id="fatturato-value">€0k</div>
                    <div class="kpi-subtitle">
                        <span id="growth-value">+0%</span> vs anno precedente (<span id="previous-value">€0k</span>)
                    </div>
                </div>

                <div class="kpi-card" id="obiettivo-card">
                    <div class="kpi-header">
                        <div class="kpi-title">Obiettivo di Vendita</div>
                        <div class="kpi-icon" style="background: var(--success-color);">
                            <i class="fas fa-target"></i>
                        </div>
                    </div>
                    <div class="kpi-value" id="obiettivo-value">€0k</div>
                    <div class="kpi-subtitle">
                        <span id="obiettivo-percentage">0%</span> completato • Rimangono <span id="remaining-value">€0k</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" id="progress-fill" style="width: 0%;"></div>
                    </div>
                </div>

                <div class="kpi-card">
                    <div class="kpi-header">
                        <div class="kpi-title">Clienti Attivi</div>
                        <div class="kpi-icon" style="background: var(--warning-color);">
                            <i class="fas fa-users"></i>
                        </div>
                    </div>
                    <div class="kpi-value" id="clienti-value">0</div>
                    <div class="kpi-subtitle">Clienti serviti nel periodo</div>
                </div>
            </div>

            <!-- Charts Section -->
            <div class="charts-section">
                <div class="charts-header">
                    <h2 class="charts-title">
                        <i class="fas fa-chart-bar"></i> Analisi Vendite
                    </h2>
                    <div id="status-badge" class="status-badge success">
                        <i class="fas fa-database"></i>
                        <span>Dati Live</span>
                    </div>
                </div>

                <div class="charts-grid">
                    <div class="chart-card">
                        <div class="chart-header">
                            <h3 class="chart-title">
                                <i class="fas fa-map-marker-alt"></i> Fatturato per Provincia
                            </h3>
                        </div>
                        <div class="chart-container">
                            <canvas id="provinceChart"></canvas>
                        </div>
                    </div>

                    <div class="chart-card">
                        <div class="chart-header">
                            <h3 class="chart-title">
                                <i class="fas fa-bullseye"></i> Progresso Obiettivo
                            </h3>
                        </div>
                        <div class="chart-container">
                            <canvas id="progressChart"></canvas>
                        </div>
                    </div>

                    <div class="chart-card">
                        <div class="chart-header">
                            <h3 class="chart-title">
                                <i class="fas fa-layer-group"></i> Categorie Prodotti
                            </h3>
                        </div>
                        <div class="chart-container">
                            <canvas id="categoryChart"></canvas>
                        </div>
                    </div>

                    <div class="chart-card">
                        <div class="chart-header">
                            <h3 class="chart-title">
                                <i class="fas fa-crown"></i> Top 5 Clienti
                            </h3>
                        </div>
                        <div class="chart-container">
                            <canvas id="topClientsChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Sales Table -->
            <div class="sales-section">
                <div class="section-header">
                    <div>
                        <h2 class="section-title">
                            <i class="fas fa-table"></i> Top 10 Vendite per Cliente
                        </h2>
                        <p style="color: var(--gray-500); margin-top: 0.5rem;">
                            Aggiornato il <span id="table-timestamp">--</span>
                        </p>
                    </div>
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <div id="table-status-badge" class="status-badge success">
                            <i class="fas fa-check-circle"></i>
                            <span>Live</span>
                        </div>
                        <div style="font-size: 0.9rem; color: var(--gray-500);">
                            <span id="total-clients">0</span> clienti • <span id="total-top-revenue">€0k</span> fatturato
                        </div>
                    </div>
                </div>

                <div class="table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Provincia</th>
                                <th>Cliente</th>
                                <th>Categoria</th>
                                <th>Fatturato</th>
                            </tr>
                        </thead>
                        <tbody id="vendite-tbody">
                            <!-- Data will be populated by JavaScript -->
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    </div>

    <!-- Province Filter Popup -->
    <div id="province-popup" class="province-popup">
        <div class="popup-content">
            <div class="popup-header">
                <h3 class="popup-title">
                    <i class="fas fa-filter"></i> Filtra per Provincia
                </h3>
                <button class="popup-close" id="popup-close-btn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 1.5rem; padding: 12px; background: var(--gray-50); border-radius: 8px;">
                <div class="status-dot online" id="popup-status-dot"></div>
                <span style="font-size: 0.9rem; color: var(--gray-600);" id="popup-status-text">Dati CSV aggiornati automaticamente</span>
            </div>
            
            <div id="popup-options">
                <!-- Options will be populated by JavaScript -->
            </div>
            
            <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--gray-200); text-align: center;">
                <button class="btn btn-primary" id="close-popup">
                    <i class="fas fa-check"></i>
                    Chiudi
                </button>
            </div>
        </div>
    </div>

    <script>
        // ==================== DASHBOARD CARABOT NATALINO - GITHUB PAGES ====================
        // Vanilla JS — CSV live, parser IT, formattazione "k" max 3 cifre ovunque
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

            // Estrai le categorie principali dal CSV
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
              type: 'horizontalBar',
              data: data,
              options: {
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
          destroy() { if (this.updateInterval) clearInterval(this.updateInterval); }
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
