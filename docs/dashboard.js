<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard CARABOT NATALINO - Pro</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.min.js"></script>
    <style>
        /* ==================== CSS VARIABLES & RESET ==================== */
        :root {
            /* Modern Color Palette */
            --primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            --primary-solid: #667eea;
            --secondary: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            --accent: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            --success: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
            --warning: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
            --error: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
            
            /* Neutral Colors */
            --bg-primary: #0f1419;
            --bg-secondary: #1a1f2e;
            --bg-tertiary: #252b3b;
            --bg-card: rgba(255, 255, 255, 0.05);
            --bg-glass: rgba(255, 255, 255, 0.08);
            
            --text-primary: #ffffff;
            --text-secondary: #a0a9c0;
            --text-muted: #6b7280;
            --border: rgba(255, 255, 255, 0.1);
            --shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            --shadow-lg: 0 35px 60px -12px rgba(0, 0, 0, 0.7);
            
            /* Light Mode */
            --bg-primary-light: #f8fafc;
            --bg-secondary-light: #ffffff;
            --bg-tertiary-light: #f1f5f9;
            --bg-card-light: rgba(255, 255, 255, 0.9);
            --bg-glass-light: rgba(255, 255, 255, 0.7);
            
            --text-primary-light: #1e293b;
            --text-secondary-light: #475569;
            --text-muted-light: #94a3b8;
            --border-light: rgba(0, 0, 0, 0.08);
            --shadow-light: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
            --shadow-lg-light: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
            
            /* Typography */
            --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
            
            /* Spacing & Sizing */
            --border-radius: 16px;
            --border-radius-lg: 24px;
            --spacing-xs: 0.5rem;
            --spacing-sm: 1rem;
            --spacing-md: 1.5rem;
            --spacing-lg: 2rem;
            --spacing-xl: 3rem;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: var(--font-primary);
            background: var(--bg-primary);
            color: var(--text-primary);
            line-height: 1.6;
            transition: all 0.3s ease;
            overflow-x: hidden;
        }

        body.light-mode {
            background: var(--bg-primary-light);
            color: var(--text-primary-light);
            --bg-card: var(--bg-card-light);
            --bg-glass: var(--bg-glass-light);
            --text-primary: var(--text-primary-light);
            --text-secondary: var(--text-secondary-light);
            --text-muted: var(--text-muted-light);
            --border: var(--border-light);
            --shadow: var(--shadow-light);
            --shadow-lg: var(--shadow-lg-light);
        }

        /* ==================== GLASSMORPHISM EFFECTS ==================== */
        .glass {
            backdrop-filter: blur(20px);
            background: var(--bg-glass);
            border: 1px solid var(--border);
            box-shadow: var(--shadow);
        }

        .glass-card {
            backdrop-filter: blur(15px);
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: var(--border-radius);
            box-shadow: var(--shadow);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        }

        .glass-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        }

        .glass-card:hover {
            transform: translateY(-4px);
            box-shadow: var(--shadow-lg);
            border-color: rgba(255, 255, 255, 0.2);
        }

        /* ==================== HEADER ==================== */
        .header {
            padding: var(--spacing-md) var(--spacing-lg);
            border-bottom: 1px solid var(--border);
            position: sticky;
            top: 0;
            z-index: 100;
        }

        .header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 1400px;
            margin: 0 auto;
        }

        .header-left {
            display: flex;
            align-items: center;
            gap: var(--spacing-md);
        }

        .logo {
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
        }

        .logo-icon {
            width: 48px;
            height: 48px;
            background: var(--primary);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
            font-weight: bold;
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }

        .logo-text h1 {
            font-size: 24px;
            font-weight: 700;
            background: var(--primary);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .logo-text p {
            color: var(--text-secondary);
            font-size: 14px;
            margin-top: -4px;
        }

        .header-stats {
            display: flex;
            align-items: center;
            gap: var(--spacing-md);
        }

        .connection-status {
            display: flex;
            align-items: center;
            gap: var(--spacing-xs);
            padding: 8px 16px;
            border-radius: 50px;
            font-size: 14px;
            font-weight: 500;
        }

        .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            animation: pulse 2s infinite;
        }

        .status-dot.online { background: #10b981; }
        .status-dot.updating { background: #f59e0b; }
        .status-dot.offline { background: #ef4444; }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }

        .header-actions {
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
        }

        .btn {
            padding: 10px 16px;
            border: none;
            border-radius: 12px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            position: relative;
            overflow: hidden;
        }

        .btn-primary {
            background: var(--primary);
            color: white;
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }

        .btn-secondary {
            background: var(--bg-tertiary);
            color: var(--text-primary);
            border: 1px solid var(--border);
        }

        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
        }

        .btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }

        .spinning {
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        /* ==================== MAIN LAYOUT ==================== */
        .main-container {
            max-width: 1400px;
            margin: 0 auto;
            padding: var(--spacing-lg);
            gap: var(--spacing-lg);
            display: flex;
            flex-direction: column;
        }

        /* ==================== OVERVIEW SECTION ==================== */
        .overview-section {
            margin-bottom: var(--spacing-xl);
        }

        .section-header {
            margin-bottom: var(--spacing-lg);
        }

        .section-title {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: var(--spacing-xs);
            background: var(--primary);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .section-subtitle {
            color: var(--text-secondary);
            font-size: 16px;
        }

        /* ==================== KPI CARDS ==================== */
        .kpi-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: var(--spacing-lg);
            margin-bottom: var(--spacing-xl);
        }

        .kpi-card {
            padding: var(--spacing-lg);
            position: relative;
            overflow: hidden;
        }

        .kpi-card::after {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 100px;
            height: 100px;
            opacity: 0.1;
            border-radius: 50%;
            transform: translate(30%, -30%);
        }

        .kpi-card.revenue::after {
            background: var(--primary);
        }

        .kpi-card.target::after {
            background: var(--success);
        }

        .kpi-card.clients::after {
            background: var(--accent);
        }

        .kpi-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: var(--spacing-md);
        }

        .kpi-icon {
            width: 50px;
            height: 50px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
            margin-bottom: var(--spacing-sm);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }

        .kpi-icon.revenue { background: var(--primary); }
        .kpi-icon.target { background: var(--success); }
        .kpi-icon.clients { background: var(--accent); }

        .kpi-title {
            color: var(--text-secondary);
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .kpi-value {
            font-size: 36px;
            font-weight: 700;
            margin: var(--spacing-xs) 0;
            font-family: var(--font-mono);
        }

        .kpi-subtitle {
            display: flex;
            align-items: center;
            gap: var(--spacing-xs);
            color: var(--text-secondary);
            font-size: 14px;
            margin-bottom: var(--spacing-md);
        }

        .growth-badge {
            background: var(--success);
            color: white;
            padding: 4px 8px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
        }

        .progress-container {
            margin-top: var(--spacing-md);
        }

        .progress-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: var(--spacing-xs);
        }

        .progress-bar {
            height: 8px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            overflow: hidden;
            position: relative;
        }

        .progress-fill {
            height: 100%;
            border-radius: 4px;
            transition: width 1s ease-out;
            background: var(--success);
            position: relative;
        }

        .progress-fill::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }

        /* ==================== CHARTS SECTION ==================== */
        .charts-grid {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: var(--spacing-lg);
            margin-bottom: var(--spacing-xl);
        }

        .chart-card {
            padding: var(--spacing-lg);
        }

        .chart-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: var(--spacing-lg);
        }

        .chart-title {
            font-size: 20px;
            font-weight: 600;
        }

        .chart-controls {
            display: flex;
            gap: var(--spacing-xs);
        }

        .chart-btn {
            padding: 6px 12px;
            border: none;
            border-radius: 8px;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            background: transparent;
            color: var(--text-secondary);
        }

        .chart-btn.active {
            background: var(--primary);
            color: white;
        }

        .chart-container {
            height: 300px;
            position: relative;
        }

        .mini-chart-container {
            height: 200px;
            position: relative;
        }

        /* ==================== DATA TABLE ==================== */
        .data-section {
            margin-bottom: var(--spacing-xl);
        }

        .table-card {
            padding: 0;
            overflow: hidden;
        }

        .table-header {
            padding: var(--spacing-lg);
            border-bottom: 1px solid var(--border);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .table-title {
            font-size: 20px;
            font-weight: 600;
        }

        .table-actions {
            display: flex;
            gap: var(--spacing-sm);
            align-items: center;
        }

        .search-box {
            position: relative;
        }

        .search-input {
            padding: 8px 12px 8px 36px;
            border: 1px solid var(--border);
            border-radius: 8px;
            background: var(--bg-tertiary);
            color: var(--text-primary);
            font-size: 14px;
            width: 200px;
        }

        .search-icon {
            position: absolute;
            left: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-secondary);
        }

        .data-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
        }

        .data-table th {
            padding: 16px 20px;
            text-align: left;
            font-weight: 600;
            color: var(--text-secondary);
            border-bottom: 1px solid var(--border);
            background: var(--bg-tertiary);
            position: sticky;
            top: 0;
        }

        .data-table td {
            padding: 16px 20px;
            border-bottom: 1px solid var(--border);
            vertical-align: middle;
        }

        .data-table tbody tr {
            transition: all 0.2s ease;
        }

        .data-table tbody tr:hover {
            background: rgba(255, 255, 255, 0.03);
        }

        .province-badge {
            padding: 4px 8px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
        }

        .province-badge.LT {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
        }

        .province-badge.RM {
            background: linear-gradient(135deg, #f093fb, #f5576c);
            color: white;
        }

        .table-footer {
            padding: var(--spacing-lg);
            border-top: 1px solid var(--border);
            background: var(--bg-tertiary);
            display: flex;
            justify-content: between;
            align-items: center;
            gap: var(--spacing-lg);
        }

        .footer-stats {
            display: flex;
            gap: var(--spacing-lg);
            flex: 1;
        }

        .footer-stat {
            display: flex;
            flex-direction: column;
        }

        .footer-stat-label {
            font-size: 12px;
            color: var(--text-secondary);
            font-weight: 500;
        }

        .footer-stat-value {
            font-size: 16px;
            font-weight: 600;
            font-family: var(--font-mono);
        }

        /* ==================== PROVINCE FILTER POPUP ==================== */
        .province-popup {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(8px);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: var(--spacing-lg);
        }

        .popup-content {
            max-width: 500px;
            width: 100%;
            max-height: 80vh;
            overflow-y: auto;
            border-radius: var(--border-radius-lg);
        }

        .popup-header {
            padding: var(--spacing-lg);
            border-bottom: 1px solid var(--border);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .popup-title {
            font-size: 20px;
            font-weight: 600;
        }

        .close-btn {
            background: none;
            border: none;
            color: var(--text-secondary);
            font-size: 24px;
            cursor: pointer;
            padding: 0;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            transition: all 0.2s ease;
        }

        .close-btn:hover {
            background: var(--bg-tertiary);
            color: var(--text-primary);
        }

        .popup-body {
            padding: var(--spacing-lg);
        }

        .province-options {
            display: flex;
            flex-direction: column;
            gap: var(--spacing-sm);
        }

        .province-option {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: var(--spacing-md);
            border: 1px solid var(--border);
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
            background: transparent;
            color: var(--text-primary);
            text-align: left;
        }

        .province-option:hover {
            border-color: var(--primary-solid);
            background: rgba(102, 126, 234, 0.1);
        }

        .province-option.selected {
            border-color: var(--primary-solid);
            background: rgba(102, 126, 234, 0.15);
        }

        .option-info h4 {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 4px;
        }

        .option-info p {
            font-size: 14px;
            color: var(--text-secondary);
        }

        .option-radio {
            width: 20px;
            height: 20px;
            border: 2px solid var(--border);
            border-radius: 50%;
            position: relative;
        }

        .option-radio.selected {
            border-color: var(--primary-solid);
        }

        .option-radio.selected::after {
            content: '';
            position: absolute;
            top: 3px;
            left: 3px;
            right: 3px;
            bottom: 3px;
            background: var(--primary-solid);
            border-radius: 50%;
        }

        /* ==================== LOADING & ERROR STATES ==================== */
        .loading-state,
        .error-state {
            display: none;
            align-items: center;
            justify-content: center;
            min-height: 400px;
            text-align: center;
        }

        .loading-content,
        .error-content {
            max-width: 400px;
        }

        .loading-spinner {
            width: 64px;
            height: 64px;
            border: 4px solid var(--bg-tertiary);
            border-top: 4px solid var(--primary-solid);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto var(--spacing-lg);
        }

        .error-icon {
            font-size: 48px;
            color: #ef4444;
            margin-bottom: var(--spacing-lg);
        }

        .status-message {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: var(--spacing-sm);
        }

        .status-description {
            color: var(--text-secondary);
            margin-bottom: var(--spacing-lg);
        }

        /* ==================== RESPONSIVE DESIGN ==================== */
        @media (max-width: 1200px) {
            .charts-grid {
                grid-template-columns: 1fr;
            }
        }

        @media (max-width: 768px) {
            .header {
                padding: var(--spacing-sm);
            }
            
            .header-content {
                flex-direction: column;
                gap: var(--spacing-sm);
            }
            
            .header-stats {
                order: -1;
            }
            
            .main-container {
                padding: var(--spacing-sm);
            }
            
            .kpi-grid {
                grid-template-columns: 1fr;
                gap: var(--spacing-sm);
            }
            
            .search-input {
                width: 150px;
            }
            
            .table-footer {
                flex-direction: column;
                align-items: flex-start;
                gap: var(--spacing-sm);
            }
            
            .footer-stats {
                width: 100%;
            }
        }

        @media (max-width: 480px) {
            .section-title {
                font-size: 24px;
            }
            
            .kpi-value {
                font-size: 28px;
            }
            
            .data-table {
                font-size: 12px;
            }
            
            .data-table th,
            .data-table td {
                padding: 12px 16px;
            }
        }

        /* ==================== ANIMATIONS ==================== */
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .slide-up {
            animation: slideUp 0.6s ease-out;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .fade-in {
            animation: fadeIn 0.4s ease-out;
        }

        /* ==================== UTILITY CLASSES ==================== */
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .font-mono { font-family: var(--font-mono); }
        .font-bold { font-weight: 700; }
        .text-success { color: #10b981; }
        .text-warning { color: #f59e0b; }
        .text-error { color: #ef4444; }
        
        .hidden { display: none !important; }
        .flex { display: flex; }
        .items-center { align-items: center; }
        .justify-between { justify-content: space-between; }
        .gap-sm { gap: var(--spacing-sm); }
    </style>
</head>
<body class="dark-mode">
    <!-- ==================== HEADER ==================== -->
    <header class="header glass">
        <div class="header-content">
            <div class="header-left">
                <div class="logo">
                    <div class="logo-icon">CN</div>
                    <div class="logo-text">
                        <h1>CARABOT NATALINO</h1>
                        <p>Dashboard Pro • Real-time Analytics</p>
                    </div>
                </div>
            </div>
            
            <div class="header-stats">
                <div class="connection-status glass-card">
                    <div class="status-dot online" id="connection-dot"></div>
                    <span id="connection-status">Online</span>
                </div>
                <div class="connection-status glass-card">
                    <i class="fas fa-clock"></i>
                    <span id="last-update">Mai</span>
                </div>
            </div>
            
            <div class="header-actions">
                <button class="btn btn-secondary" id="province-filter">
                    <i class="fas fa-filter"></i>
                    <span id="province-label">TOT</span>
                </button>
                <button class="btn btn-primary" id="refresh-btn">
                    <i class="fas fa-sync-alt" id="refresh-icon"></i>
                    Aggiorna
                </button>
                <button class="btn btn-secondary" id="theme-toggle">
                    <i class="fas fa-moon" id="theme-icon"></i>
                </button>
            </div>
        </div>
    </header>

    <!-- ==================== MAIN CONTENT ==================== -->
    <main class="main-container">
        <!-- Loading State -->
        <div id="loading-state" class="loading-state">
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <div class="status-message">Caricamento dati CSV</div>
                <div class="status-description">Connessione al sistema CARABOT NATALINO in corso...</div>
            </div>
        </div>

        <!-- Error State -->
        <div id="error-state" class="error-state">
            <div class="error-content">
                <div class="error-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <div class="status-message">Errore di connessione</div>
                <div class="status-description" id="error-message">Impossibile caricare i dati CSV</div>
                <button class="btn btn-primary" onclick="window.dashboard?.fetchCSVData(true)">
                    <i class="fas fa-redo"></i>
                    Riprova
                </button>
            </div>
        </div>

        <!-- Main Content -->
        <div id="main-content" style="display: none;">
            <!-- Overview Section -->
            <section class="overview-section">
                <div class="section-header">
                    <h2 class="section-title">Panoramica Performance</h2>
                    <p class="section-subtitle">Monitoraggio vendite e obiettivi in tempo reale</p>
                </div>

                <!-- KPI Cards -->
                <div class="kpi-grid">
                    <!-- Revenue Card -->
                    <div class="glass-card kpi-card revenue slide-up">
                        <div class="kpi-header">
                            <div>
                                <div class="kpi-icon revenue">
                                    <i class="fas fa-euro-sign"></i>
                                </div>
                                <div class="kpi-title">Fatturato Corrente</div>
                            </div>
                        </div>
                        <div class="kpi-value" id="fatturato-value">€0</div>
                        <div class="kpi-subtitle">
                            <span class="growth-badge" id="growth-value">+0%</span>
                            <span>vs anno precedente (<span id="previous-value">€0</span>)</span>
                        </div>
                        <canvas id="revenue-mini-chart" class="mini-chart-container"></canvas>
                    </div>

                    <!-- Target Card -->
                    <div class="glass-card kpi-card target slide-up" id="obiettivo-card">
                        <div class="kpi-header">
                            <div>
                                <div class="kpi-icon target">
                                    <i class="fas fa-bullseye"></i>
                                </div>
                                <div class="kpi-title">Obiettivo</div>
                            </div>
                        </div>
                        <div class="kpi-value" id="obiettivo-value">€0</div>
                        <div class="progress-container">
                            <div class="progress-header">
                                <span>Progresso</span>
                                <span id="obiettivo-percentage">0%</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" id="progress-fill" style="width: 0%"></div>
                            </div>
                            <div class="kpi-subtitle" style="margin-top: 8px;">
                                Rimangono <strong id="remaining-value">€0</strong>
                            </div>
                        </div>
                    </div>

                    <!-- Clients Card -->
                    <div class="glass-card kpi-card clients slide-up">
                        <div class="kpi-header">
                            <div>
                                <div class="kpi-icon clients">
                                    <i class="fas fa-users"></i>
                                </div>
                                <div class="kpi-title">Clienti Attivi</div>
                            </div>
                        </div>
                        <div class="kpi-value" id="clienti-value">0</div>
                        <div class="kpi-subtitle">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>Provincia: <strong id="provincia-label-card">TOT</strong></span>
                        </div>
                        <canvas id="clients-mini-chart" class="mini-chart-container"></canvas>
                    </div>
                </div>
            </section>

            <!-- Charts Section -->
            <section class="charts-section">
                <div class="charts-grid">
                    <!-- Main Chart -->
                    <div class="glass-card chart-card slide-up">
                        <div class="chart-header">
                            <h3 class="chart-title">Trend Vendite</h3>
                            <div class="chart-controls">
                                <button class="chart-btn active">Anno</button>
                                <button class="chart-btn">Trimestre</button>
                                <button class="chart-btn">Mese</button>
                            </div>
                        </div>
                        <canvas id="main-chart" class="chart-container"></canvas>
                    </div>

                    <!-- Distribution Chart -->
                    <div class="glass-card chart-card slide-up">
                        <div class="chart-header">
                            <h3 class="chart-title">Distribuzione Province</h3>
                        </div>
                        <canvas id="distribution-chart" class="chart-container"></canvas>
                    </div>
                </div>
            </section>

            <!-- Data Table Section -->
            <section class="data-section">
                <div class="glass-card table-card slide-up">
                    <div class="table-header">
                        <h3 class="table-title">Top Clienti per Fatturato</h3>
                        <div class="table-actions">
                            <div class="search-box">
                                <i class="fas fa-search search-icon"></i>
                                <input type="text" class="search-input" placeholder="Cerca cliente...">
                            </div>
                            <div class="connection-status glass-card">
                                <div class="status-dot online"></div>
                                <span>Live</span>
                            </div>
                        </div>
                    </div>
                    
                    <div style="overflow-x: auto;">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Provincia</th>
                                    <th>Ragione Sociale</th>
                                    <th>Categoria</th>
                                    <th>Fatturato</th>
                                    <th>Trend</th>
                                </tr>
                            </thead>
                            <tbody id="vendite-tbody">
                                <!-- Dynamic content -->
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="table-footer">
                        <div class="footer-stats">
                            <div class="footer-stat">
                                <div class="footer-stat-label">Totale Clienti</div>
                                <div class="footer-stat-value" id="total-clients">0</div>
                            </div>
                            <div class="footer-stat">
                                <div class="footer-stat-label">Fatturato Top 10</div>
                                <div class="footer-stat-value" id="total-top-revenue">€0</div>
                            </div>
                            <div class="footer-stat">
                                <div class="footer-stat-label">Ultimo Aggiornamento</div>
                                <div class="footer-stat-value" id="table-timestamp">Mai</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </main>

    <!-- ==================== PROVINCE FILTER POPUP ==================== -->
    <div class="province-popup" id="province-popup">
        <div class="popup-content glass-card">
            <div class="popup-header">
                <h3 class="popup-title">Seleziona Provincia</h3>
                <button class="close-btn" id="close-popup">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="popup-body">
                <div class="province-options" id="popup-options">
                    <!-- Dynamic content -->
                </div>
            </div>
        </div>
    </div>

    <script>
        // ==================== DASHBOARD MANAGER - MODERNIZED VERSION ====================
        class DashboardManager {
            constructor() {
                this.csvData = null;
                this.selectedProvince = 'all';
                this.isLoading = false;
                this.lastUpdate = null;
                this.updateInterval = null;
                this.charts = {};
                
                // URL del CSV (relativo al repo GitHub Pages)
                this.csvUrl = './631.00238_CARABOT-NATALINO.csv';
                
                this.init();
            }
            
            init() {
                this.setupEventListeners();
                this.loadInitialData();
                this.startAutoUpdate();
                this.initializeCharts();
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
                
                // Close popup
                document.getElementById('close-popup').addEventListener('click', () => {
                    this.hideProvincePopup();
                });
                
                // Close popup on overlay click
                document.getElementById('province-popup').addEventListener('click', (e) => {
                    if (e.target.id === 'province-popup') {
                        this.hideProvincePopup();
                    }
                });

                // Search functionality
                document.querySelector('.search-input').addEventListener('input', (e) => {
                    this.filterTable(e.target.value);
                });
            }
            
            // ==================== THEME MANAGEMENT ====================
            toggleTheme() {
                const body = document.body;
                const themeIcon = document.getElementById('theme-icon');
                
                if (body.classList.contains('light-mode')) {
                    body.classList.remove('light-mode');
                    body.classList.add('dark-mode');
                    themeIcon.className = 'fas fa-moon';
                } else {
                    body.classList.remove('dark-mode');
                    body.classList.add('light-mode');
                    themeIcon.className = 'fas fa-sun';
                }
                
                // Update charts theme
                setTimeout(() => this.updateChartsTheme(), 100);
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
                    
                    console.log('✅ CSV caricato');
                    const parsedData = this.parseCSV(csvText);
                    
                    if (parsedData) {
                        this.csvData = parsedData;
                        this.lastUpdate = new Date();
                        this.updateLoadingState('success');
                        this.renderDashboard();
                        
                        // Add slide-up animation to cards
                        setTimeout(() => {
                            document.querySelectorAll('.slide-up').forEach((el, index) => {
                                setTimeout(() => {
                                    el.style.opacity = '0';
                                    el.style.transform = 'translateY(20px)';
                                    el.style.animation = `slideUp 0.6s ease-out ${index * 0.1}s forwards`;
                                }, 50);
                            });
                        }, 100);
                        
                        console.log('✅ Dashboard aggiornato con successo');
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
                    
                    // Parse OBIETTIVI section
                    const obiettiviMatch = csvText.match(/=== VERIFICA OBIETTIVI ===([\s\S]*?)===.*===/);
                    if (!obiettiviMatch) {
                        throw new Error('Sezione obiettivi non trovata');
                    }
                    
                    const obiettiviText = obiettiviMatch[1];
                    
                    // Parse GENERALE
                    const generaleMatch = obiettiviText.match(/Generale;([\d.,]+);([\d.,]+);;;(\d+);(\d+);;/);
                    if (!generaleMatch) {
                        throw new Error('Dati Generale non trovati');
                    }
                    
                    const generale = {
                        annoPrecedente: parseFloat(generaleMatch[1].replace(',', '.')),
                        annoCorrente: parseFloat(generaleMatch[2].replace(',', '.')),
                        clienti: parseInt(generaleMatch[4])
                    };
                    
                    // Parse LATINA
                    const ltMatch = obiettiviText.match(/LT;([\d.,]+);([\d.,]+);([\d.,]+);(\d+)%;(\d+);(\d+);(\d+);(\d+)%/);
                    if (!ltMatch) {
                        throw new Error('Dati Latina non trovati');
                    }
                    
                    const latina = {
                        annoPrecedente: parseFloat(ltMatch[1].replace(',', '.')),
                        annoCorrente: parseFloat(ltMatch[2].replace(',', '.')),
                        obiettivo: parseFloat(ltMatch[3].replace(',', '.')) * 1000,
                        percentualeObiettivo: parseInt(ltMatch[4]),
                        clientiPrecedenti: parseInt(ltMatch[5]),
                        clientiCorrente: parseInt(ltMatch[6]),
                        obiettivoClienti: parseInt(ltMatch[7])
                    };
                    
                    // Parse ROMA
                    const clientiMatch = csvText.match(/=== CLIENTI PER PROVINCIA ===([\s\S]*?)===.*===/);
                    let roma = { annoCorrente: 0, clienti: 0 };
                    
                    if (clientiMatch) {
                        const clientiText = clientiMatch[1];
                        const rmMatch = clientiText.match(/RM;(\d+);([\d.,]+);;;;;;/);
                        if (rmMatch) {
                            roma = {
                                annoCorrente: parseFloat(rmMatch[2].replace(',', '.')),
                                clienti: parseInt(rmMatch[1])
                            };
                        }
                    }
                    
                    // Parse VENDITE DETTAGLIO
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
                                const fatturato = parseFloat(parts[3].replace(',', '.'));
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
                            .slice(0, 20);
                    }
                    
                    const result = { generale, latina, roma, vendite, timestamp: new Date() };
                    return result;
                    
                } catch (error) {
                    console.error('❌ Errore parsing:', error);
                    return null;
                }
            }
            
            // ==================== CHARTS INITIALIZATION ====================
            initializeCharts() {
                // Initialize main revenue chart
                const mainCtx = document.getElementById('main-chart');
                if (mainCtx) {
                    this.charts.main = new Chart(mainCtx, {
                        type: 'line',
                        data: {
                            labels: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
                            datasets: [{
                                label: 'Fatturato 2024',
                                data: [120000, 135000, 142000, 138000, 155000, 168000, 172000, 165000, 0, 0, 0, 0],
                                borderColor: '#667eea',
                                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                                borderWidth: 3,
                                fill: true,
                                tension: 0.4,
                                pointBackgroundColor: '#667eea',
                                pointBorderColor: '#fff',
                                pointBorderWidth: 2,
                                pointRadius: 6,
                                pointHoverRadius: 8
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    display: false
                                }
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    ticks: {
                                        callback: function(value) {
                                            return '€' + (value / 1000).toFixed(0) + 'k';
                                        }
                                    },
                                    grid: {
                                        color: 'rgba(255, 255, 255, 0.1)'
                                    }
                                },
                                x: {
                                    grid: {
                                        color: 'rgba(255, 255, 255, 0.1)'
                                    }
                                }
                            }
                        }
                    });
                }

                // Initialize distribution chart
                const distCtx = document.getElementById('distribution-chart');
                if (distCtx) {
                    this.charts.distribution = new Chart(distCtx, {
                        type: 'doughnut',
                        data: {
                            labels: ['Latina', 'Roma', 'Altre'],
                            datasets: [{
                                data: [60, 30, 10],
                                backgroundColor: [
                                    '#667eea',
                                    '#f093fb',
                                    '#43e97b'
                                ],
                                borderWidth: 0
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'bottom',
                                    labels: {
                                        padding: 20,
                                        usePointStyle: true
                                    }
                                }
                            }
                        }
                    });
                }

                // Initialize mini charts
                this.initializeMiniCharts();
            }

            initializeMiniCharts() {
                // Revenue mini chart
                const revenueCtx = document.getElementById('revenue-mini-chart');
                if (revenueCtx) {
                    this.charts.revenueMini = new Chart(revenueCtx, {
                        type: 'line',
                        data: {
                            labels: ['', '', '', '', '', '', ''],
                            datasets: [{
                                data: [100, 120, 115, 135, 142, 155, 165],
                                borderColor: '#667eea',
                                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                                borderWidth: 2,
                                fill: true,
                                tension: 0.4,
                                pointRadius: 0
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: { legend: { display: false } },
                            scales: {
                                x: { display: false },
                                y: { display: false }
                            },
                            elements: {
                                point: { radius: 0 }
                            }
                        }
                    });
                }

                // Clients mini chart
                const clientsCtx = document.getElementById('clients-mini-chart');
                if (clientsCtx) {
                    this.charts.clientsMini = new Chart(clientsCtx, {
                        type: 'bar',
                        data: {
                            labels: ['', '', '', '', '', '', ''],
                            datasets: [{
                                data: [45, 52, 48, 61, 55, 67, 63],
                                backgroundColor: '#4facfe',
                                borderRadius: 4
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: { legend: { display: false } },
                            scales: {
                                x: { display: false },
                                y: { display: false }
                            }
                        }
                    });
                }
            }

            updateChartsTheme() {
                const isDark = document.body.classList.contains('dark-mode');
                const textColor = isDark ? '#a0a9c0' : '#475569';
                const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

                Object.values(this.charts).forEach(chart => {
                    if (chart && chart.options) {
                        if (chart.options.scales) {
                            if (chart.options.scales.x) {
                                chart.options.scales.x.ticks = { ...chart.options.scales.x.ticks, color: textColor };
                                chart.options.scales.x.grid = { ...chart.options.scales.x.grid, color: gridColor };
                            }
                            if (chart.options.scales.y) {
                                chart.options.scales.y.ticks = { ...chart.options.scales.y.ticks, color: textColor };
                                chart.options.scales.y.grid = { ...chart.options.scales.y.grid, color: gridColor };
                            }
                        }
                        if (chart.options.plugins && chart.options.plugins.legend) {
                            chart.options.plugins.legend.labels = { 
                                ...chart.options.plugins.legend.labels, 
                                color: textColor 
                            };
                        }
                        chart.update();
                    }
                });
            }
            
            // ==================== UI UPDATES ====================
            updateLoadingState(state, errorMessage = null) {
                const loadingEl = document.getElementById('loading-state');
                const errorEl = document.getElementById('error-state');
                const mainEl = document.getElementById('main-content');
                const refreshIcon = document.getElementById('refresh-icon');
                const connectionDot = document.getElementById('connection-dot');
                const connectionStatus = document.getElementById('connection-status');
                
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
                        loadingEl.style.display = 'flex';
                        connectionStatus.textContent = 'Aggiornamento...';
                        break;
                        
                    case 'success':
                        mainEl.style.display = 'block';
                        connectionStatus.textContent = 'Online';
                        this.updateLastUpdateDisplay();
                        break;
                        
                    case 'error':
                        errorEl.style.display = 'flex';
                        connectionStatus.textContent = 'Errore';
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
                this.updateCharts();
            }
            
            renderKPICards() {
                const data = this.getDisplayData();
                
                // Fatturato
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
                document.getElementById('provincia-label-card').textContent = this.selectedProvince === 'all' ? 'TOT' : this.selectedProvince;
            }

            updateCharts() {
                if (!this.csvData) return;

                // Update distribution chart with real data
                if (this.charts.distribution) {
                    const ltPerc = this.csvData.latina.annoCorrente / this.csvData.generale.annoCorrente * 100;
                    const rmPerc = this.csvData.roma.annoCorrente / this.csvData.generale.annoCorrente * 100;
                    const othersPerc = 100 - ltPerc - rmPerc;

                    this.charts.distribution.data.datasets[0].data = [
                        Math.round(ltPerc),
                        Math.round(rmPerc),
                        Math.round(othersPerc)
                    ];
                    this.charts.distribution.update();
                }

                // Update mini charts with trend data
                if (this.charts.revenueMini) {
                    // Simulate monthly progression
                    const currentMonth = 8; // August
                    const monthlyTarget = this.csvData.generale.annoCorrente / currentMonth;
                    const monthlyData = [];
                    
                    for (let i = 0; i < 7; i++) {
                        monthlyData.push(monthlyTarget * (0.7 + Math.random() * 0.6));
                    }
                    
                    this.charts.revenueMini.data.datasets[0].data = monthlyData;
                    this.charts.revenueMini.update();
                }
            }
            
            renderVenditeTable() {
                if (!this.csvData.vendite || this.csvData.vendite.length === 0) return;
                
                const tbody = document.getElementById('vendite-tbody');
                tbody.innerHTML = '';
                
                this.csvData.vendite.forEach((vendita, index) => {
                    const row = document.createElement('tr');
                    const trendIcon = index < 5 ? '📈' : index < 10 ? '📊' : '📉';
                    
                    row.innerHTML = `
                        <td>
                            <span class="province-badge ${vendita.provincia}">
                                ${vendita.provincia}
                            </span>
                        </td>
                        <td>${vendita.cliente.length > 35 ? vendita.cliente.slice(0, 35) + '...' : vendita.cliente}</td>
                        <td>${vendita.categoria}</td>
                        <td class="font-mono font-bold">${this.formatCurrency(vendita.fatturato)}</td>
                        <td>${trendIcon}</td>
                    `;
                    tbody.appendChild(row);
                });
