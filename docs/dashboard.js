<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard CARABOT NATALINO - Performance Vendite</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            transition: all 0.5s ease;
        }

        body.light-mode {
            background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 50%, #e8eaf6 100%);
        }

        body.dark-mode {
            background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
            position: relative;
            z-index: 10;
        }

        /* Elementi decorativi di sfondo */
        .bg-decoration {
            position: fixed;
            pointer-events: none;
            border-radius: 50%;
            filter: blur(120px);
            z-index: 1;
        }

        .bg-decoration:nth-child(1) {
            width: 400px;
            height: 400px;
            background: rgba(139, 92, 246, 0.1);
            top: -200px;
            left: -200px;
        }

        .bg-decoration:nth-child(2) {
            width: 350px;
            height: 350px;
            background: rgba(34, 211, 238, 0.1);
            top: 50%;
            right: -175px;
        }

        .bg-decoration:nth-child(3) {
            width: 300px;
            height: 300px;
            background: rgba(168, 85, 247, 0.1);
            bottom: -150px;
            left: 30%;
        }

        .dark-mode .bg-decoration:nth-child(1) {
            background: rgba(139, 92, 246, 0.15);
        }

        .dark-mode .bg-decoration:nth-child(2) {
            background: rgba(34, 211, 238, 0.15);
        }

        .dark-mode .bg-decoration:nth-child(3) {
            background: rgba(168, 85, 247, 0.15);
        }

        /* Header migliorato */
        .header-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 24px;
            border: 1px solid rgba(255, 255, 255, 0.4);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
            margin-bottom: 32px;
            transform: translateY(-20px);
            opacity: 0;
            animation: slideInDown 0.8s ease forwards;
        }

        .dark-mode .header-card {
            background: rgba(30, 41, 59, 0.9);
            border: 1px solid rgba(71, 85, 105, 0.6);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.3);
        }

        .header-main {
            padding: 32px;
        }

        .header-title {
            font-size: 2.5rem;
            font-weight: 900;
            color: #1f2937;
            margin-bottom: 8px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .dark-mode .header-title {
            color: #f8fafc;
            background: linear-gradient(135deg, #8b5cf6, #06b6d4);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .header-subtitle {
            font-size: 1.125rem;
            color: #6b7280;
            margin-bottom: 24px;
        }

        .dark-mode .header-subtitle {
            color: #94a3b8;
        }

        .header-info {
            display: flex;
            flex-wrap: wrap;
            gap: 24px;
            align-items: center;
        }

        .info-item {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .info-badge {
            background: #f3f4f6;
            color: #374151;
            padding: 4px 12px;
            border-radius: 8px;
            font-family: 'Monaco', monospace;
            font-size: 0.875rem;
            font-weight: 600;
        }

        .dark-mode .info-badge {
            background: #374151;
            color: #f3f4f6;
        }

        .status-indicator {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #10b981;
            animation: pulse 2s infinite;
        }

        /* Theme toggle */
        .theme-toggle {
            background: #1f2937;
            color: white;
            border: none;
            padding: 12px;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-left: auto;
        }

        .theme-toggle:hover {
            transform: scale(1.1);
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
        }

        .dark-mode .theme-toggle {
            background: #f59e0b;
        }

        /* Filtri territorio */
        .territory-filters {
            border-top: 1px solid rgba(229, 231, 235, 0.5);
            padding: 24px 32px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 16px;
        }

        .dark-mode .territory-filters {
            border-top: 1px solid rgba(71, 85, 105, 0.5);
        }

        .filter-info h3 {
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #6b7280;
            margin-bottom: 8px;
        }

        .dark-mode .filter-info h3 {
            color: #94a3b8;
        }

        .current-filter {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .filter-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #3b82f6;
        }

        .filter-dot.violet {
            background: #8b5cf6;
        }

        .filter-dot.cyan {
            background: #06b6d4;
        }

        .filter-name {
            font-weight: 600;
            color: #1f2937;
            font-size: 1rem;
        }

        .dark-mode .filter-name {
            color: #f8fafc;
        }

        .filter-button {
            background: #3b82f6;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.875rem;
        }

        .filter-button:hover {
            background: #2563eb;
            transform: translateY(-2px);
            box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.3);
        }

        /* KPI Cards migliorati */
        .kpi-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 24px;
            margin-bottom: 32px;
        }

        .kpi-card {
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(20px);
            border: 2px solid rgba(255, 255, 255, 0.9);
            border-radius: 24px;
            padding: 32px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
            transform: translateY(20px);
            opacity: 0;
        }

        .kpi-card.animate {
            animation: slideInUp 0.6s ease forwards;
        }

        .dark-mode .kpi-card {
            background: rgba(30, 41, 59, 0.7);
            border: 1px solid rgba(71, 85, 105, 0.6);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.3);
        }

        .kpi-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.2);
        }

        .kpi-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #3b82f6, #8b5cf6);
        }

        .kpi-card.success::before {
            background: linear-gradient(90deg, #10b981, #059669);
        }

        .kpi-card.warning::before {
            background: linear-gradient(90deg, #f59e0b, #d97706);
        }

        .kpi-card.info::before {
            background: linear-gradient(90deg, #06b6d4, #0891b2);
        }

        .kpi-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 24px;
        }

        .kpi-title {
            font-size: 0.875rem;
            font-weight: 500;
            color: #6b7280;
            margin-bottom: 8px;
        }

        .dark-mode .kpi-title {
            color: #9ca3af;
        }

        .kpi-value {
            font-size: 2.5rem;
            font-weight: 900;
            color: #1f2937;
            line-height: 1;
        }

        .dark-mode .kpi-value {
            color: #f8fafc;
        }

        .kpi-badge {
            display: flex;
            align-items: center;
            gap: 4px;
            background: #ecfdf5;
            color: #065f46;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 0.875rem;
            font-weight: 700;
        }

        .kpi-badge.success {
            background: #ecfdf5;
            color: #065f46;
        }

        .kpi-badge.info {
            background: #eff6ff;
            color: #1e40af;
        }

        .dark-mode .kpi-badge.success {
            background: rgba(16, 185, 129, 0.2);
            color: #34d399;
        }

        .dark-mode .kpi-badge.info {
            background: rgba(59, 130, 246, 0.2);
            color: #60a5fa;
        }

        .kpi-subtitle {
            color: #6b7280;
            font-size: 0.875rem;
            margin-top: 16px;
        }

        .dark-mode .kpi-subtitle {
            color: #9ca3af;
        }

        /* Progress bars migliorate */
        .progress-section {
            margin-top: 24px;
            padding: 20px;
            border-radius: 16px;
            background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1));
            border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .progress-section.blue {
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.1));
            border: 1px solid rgba(59, 130, 246, 0.2);
        }

        .progress-section.orange {
            background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.1));
            border: 1px solid rgba(245, 158, 11, 0.2);
        }

        .progress-section.cyan {
            background: linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(8, 145, 178, 0.1));
            border: 1px solid rgba(6, 182, 212, 0.2);
        }

        .progress-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
        }

        .progress-label {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.875rem;
            font-weight: 600;
            color: #059669;
        }

        .progress-label.blue {
            color: #2563eb;
        }

        .progress-label.orange {
            color: #d97706;
        }

        .progress-label.cyan {
            color: #0891b2;
        }

        .dark-mode .progress-label {
            color: #34d399;
        }

        .dark-mode .progress-label.blue {
            color: #60a5fa;
        }

        .dark-mode .progress-label.orange {
            color: #fbbf24;
        }

        .dark-mode .progress-label.cyan {
            color: #22d3ee;
        }

        .progress-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #10b981;
        }

        .progress-dot.blue {
            background: #3b82f6;
        }

        .progress-dot.orange {
            background: #f59e0b;
        }

        .progress-dot.cyan {
            background: #06b6d4;
        }

        .progress-bar {
            width: 100%;
            height: 8px;
            background: rgba(16, 185, 129, 0.2);
            border-radius: 4px;
            overflow: hidden;
            margin: 8px 0;
        }

        .progress-bar.blue {
            background: rgba(59, 130, 246, 0.2);
        }

        .progress-bar.orange {
            background: rgba(245, 158, 11, 0.2);
        }

        .progress-bar.cyan {
            background: rgba(6, 182, 212, 0.2);
        }

        .dark-mode .progress-bar {
            background: rgba(16, 185, 129, 0.3);
        }

        .dark-mode .progress-bar.blue {
            background: rgba(59, 130, 246, 0.3);
        }

        .dark-mode .progress-bar.orange {
            background: rgba(245, 158, 11, 0.3);
        }

        .dark-mode .progress-bar.cyan {
            background: rgba(6, 182, 212, 0.3);
        }

        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #10b981, #059669);
            border-radius: 4px;
            transition: width 1.5s ease;
            position: relative;
            overflow: hidden;
        }

        .progress-fill.blue {
            background: linear-gradient(90deg, #3b82f6, #2563eb);
        }

        .progress-fill.orange {
            background: linear-gradient(90deg, #f59e0b, #d97706);
        }

        .progress-fill.cyan {
            background: linear-gradient(90deg, #06b6d4, #0891b2);
        }

        .progress-fill::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
            animation: shimmer 2s infinite;
        }

        .progress-footer {
            display: flex;
            justify-content: space-between;
            font-size: 0.75rem;
        }

        .progress-footer .left {
            color: #059669;
        }

        .progress-footer .left.blue {
            color: #2563eb;
        }

        .progress-footer .left.orange {
            color: #d97706;
        }

        .progress-footer .left.cyan {
            color: #0891b2;
        }

        .dark-mode .progress-footer .left {
            color: #34d399;
        }

        .dark-mode .progress-footer .left.blue {
            color: #60a5fa;
        }

        .dark-mode .progress-footer .left.orange {
            color: #fbbf24;
        }

        .dark-mode .progress-footer .left.cyan {
            color: #22d3ee;
        }

        .progress-footer .right {
            color: #059669;
            font-weight: 700;
        }

        .progress-footer .right.blue {
            color: #2563eb;
        }

        .progress-footer .right.orange {
            color: #d97706;
        }

        .progress-footer .right.cyan {
            color: #0891b2;
        }

        .dark-mode .progress-footer .right {
            color: #34d399;
        }

        .dark-mode .progress-footer .right.blue {
            color: #60a5fa;
        }

        .dark-mode .progress-footer .right.orange {
            color: #fbbf24;
        }

        .dark-mode .progress-footer .right.cyan {
            color: #22d3ee;
        }

        /* Chart containers migliorati */
        .chart-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 24px;
            margin-bottom: 32px;
        }

        .chart-card {
            background: rgba(255, 255, 255, 0.75);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.9);
            border-radius: 24px;
            padding: 32px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
            transform: translateY(20px);
            opacity: 0;
        }

        .chart-card.animate {
            animation: slideInUp 0.8s ease forwards;
        }

        .dark-mode .chart-card {
            background: rgba(30, 41, 59, 0.6);
            border: 1px solid rgba(71, 85, 105, 0.5);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.3);
        }

        .chart-title {
            font-size: 1.25rem;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 24px;
        }

        .dark-mode .chart-title {
            color: #f8fafc;
        }

        .chart-container {
            position: relative;
            height: 350px;
            margin-bottom: 24px;
        }

        /* Tables migliorate */
        .table-container {
            background: rgba(255, 255, 255, 0.75);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.9);
            border-radius: 24px;
            padding: 32px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
            margin-bottom: 32px;
            transform: translateY(20px);
            opacity: 0;
        }

        .table-container.animate {
            animation: slideInUp 0.8s ease forwards;
        }

        .dark-mode .table-container {
            background: rgba(30, 41, 59, 0.6);
            border: 1px solid rgba(71, 85, 105, 0.5);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.3);
        }

        .table-responsive {
            overflow-x: auto;
            border-radius: 16px;
        }

        .vendite-table {
            width: 100%;
            border-collapse: collapse;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .dark-mode .vendite-table {
            background: rgba(30, 41, 59, 0.8);
        }

        .vendite-table thead th {
            background: linear-gradient(135deg, #f8fafc, #f1f5f9);
            color: #374151;
            font-weight: 700;
            text-transform: uppercase;
            font-size: 0.75rem;
            letter-spacing: 0.05em;
            padding: 16px;
            text-align: left;
            border-bottom: 2px solid rgba(229, 231, 235, 0.5);
        }

        .dark-mode .vendite-table thead th {
            background: linear-gradient(135deg, #374151, #4b5563);
            color: #d1d5db;
            border-bottom: 2px solid rgba(75, 85, 99, 0.5);
        }

        .vendite-table tbody tr {
            transition: all 0.3s ease;
            border-bottom: 1px solid rgba(229, 231, 235, 0.3);
        }

        .vendite-table tbody tr:hover {
            background: rgba(59, 130, 246, 0.05);
            transform: scale(1.01);
        }

        .dark-mode .vendite-table tbody tr {
            border-bottom: 1px solid rgba(75, 85, 99, 0.3);
        }

        .dark-mode .vendite-table tbody tr:hover {
            background: rgba(59, 130, 246, 0.1);
        }

        .vendite-table td {
            padding: 16px;
            color: #374151;
            font-weight: 500;
        }

        .dark-mode .vendite-table td {
            color: #d1d5db;
        }

        .province-badge {
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 700;
            text-align: center;
            min-width: 40px;
            display: inline-block;
        }

        .province-badge.LT {
            background: rgba(139, 92, 246, 0.2);
            color: #6b21a8;
        }

        .province-badge.RM {
            background: rgba(6, 182, 212, 0.2);
            color: #0f766e;
        }

        .dark-mode .province-badge.LT {
            background: rgba(139, 92, 246, 0.3);
            color: #a78bfa;
        }

        .dark-mode .province-badge.RM {
            background: rgba(6, 182, 212, 0.3);
            color: #22d3ee;
        }

        /* Status indicators migliorati */
        .status-card {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.4);
            border-radius: 16px;
            padding: 16px 20px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            min-width: 200px;
            transition: all 0.3s ease;
        }

        .dark-mode .status-card {
            background: rgba(30, 41, 59, 0.95);
            border: 1px solid rgba(71, 85, 105, 0.4);
        }

        .status-header {
            display: flex;
            align-items: center;
            justify-content: between;
            gap: 12px;
            margin-bottom: 8px;
        }

        .connection-status {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .status-dot.online {
            background: #10b981;
        }

        .status-dot.updating {
            background: #f59e0b;
            animation: pulse 1s infinite;
        }

        .status-dot.offline {
            background: #ef4444;
        }

        .refresh-btn {
            background: #3b82f6;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 0.875rem;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: all 0.3s ease;
            margin-left: auto;
        }

        .refresh-btn:hover {
            background: #2563eb;
            transform: translateY(-1px);
        }

        .refresh-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .refresh-icon.spinning {
            animation: spin 1s linear infinite;
        }

        .status-badge {
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .status-badge.success {
            background: #ecfdf5;
            color: #065f46;
        }

        .status-badge.updating {
            background: #fef3c7;
            color: #92400e;
        }

        .status-badge.error {
            background: #fef2f2;
            color: #991b1b;
        }

        .dark-mode .status-badge.success {
            background: rgba(16, 185, 129, 0.2);
            color: #34d399;
        }

        .dark-mode .status-badge.updating {
            background: rgba(245, 158, 11, 0.2);
            color: #fbbf24;
        }

        .dark-mode .status-badge.error {
            background: rgba(239, 68, 68, 0.2);
            color: #f87171;
        }

        /* Loading e Error states */
        .loading-state, .error-state {
            text-align: center;
            padding: 60px 20px;
            color: #6b7280;
        }

        .dark-mode .loading-state, .dark-mode .error-state {
            color: #9ca3af;
        }

        .loading-spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #e5e7eb;
            border-top: 4px solid #3b82f6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 16px;
        }

        .dark-mode .loading-spinner {
            border-color: #4b5563;
            border-top-color: #60a5fa;
        }

        /* Popup migliorato */
        .popup-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            padding: 20px;
        }

        .popup-content {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.4);
            border-radius: 24px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.3);
            width: 100%;
            max-width: 500px;
            max-height: 85vh;
            overflow: hidden;
            transform: scale(0.9);
            opacity: 0;
            transition: all 0.3s ease;
        }

        .popup-overlay.show .popup-content {
            transform: scale(1);
            opacity: 1;
        }

        .dark-mode .popup-content {
            background: rgba(30, 41, 59, 0.95);
            border: 1px solid rgba(71, 85, 105, 0.4);
        }

        .popup-header {
            padding: 24px 32px;
            border-bottom: 1px solid rgba(229, 231, 235, 0.5);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .dark-mode .popup-header {
            border-bottom: 1px solid rgba(75, 85, 99, 0.5);
        }

        .popup-title {
            font-size: 1.25rem;
            font-weight: 700;
            color: #1f2937;
        }

        .dark-mode .popup-title {
            color: #f8fafc;
        }

        .popup-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            color: #6b7280;
            cursor: pointer;
            padding: 4px;
            border-radius: 8px;
            transition: all 0.2s ease;
        }

        .popup-close:hover {
            background: rgba(107, 114, 128, 0.1);
            color: #374151;
            transform: scale(1.1);
        }

        .dark-mode .popup-close {
            color: #9ca3af;
        }

        .dark-mode .popup-close:hover {
            background: rgba(156, 163, 175, 0.1);
            color: #d1d5db;
        }

        .popup-body {
            padding: 24px 32px;
            max-height: 400px;
            overflow-y: auto;
        }

        .province-option {
            width: 100%;
            background: none;
            border: 2px solid transparent;
            border-radius: 16px;
            padding: 20px;
            text-align: left;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .province-option:hover {
            background: rgba(59, 130, 246, 0.05);
            border-color: rgba(59, 130, 246, 0.2);
            transform: translateY(-2px);
        }

        .province-option.selected {
            background: #3b82f6;
            border-color: #2563eb;
            color: white;
            transform: scale(1.02);
        }

        .province-option.selected.LT {
            background: #8b5cf6;
            border-color: #7c3aed;
        }

        .province-option.selected.RM {
            background: #06b6d4;
            border-color: #0891b2;
        }

        .dark-mode .province-option:hover {
            background: rgba(59, 130, 246, 0.1);
        }

        .option-info h4 {
            font-weight: 700;
            font-size: 1rem;
            margin-bottom: 4px;
        }

        .option-info p {
            font-size: 0.875rem;
            opacity: 0.8;
        }

        .option-radio {
            width: 20px;
            height: 20px;
            border: 2px solid #d1d5db;
            border-radius: 50%;
            position: relative;
            transition: all 0.2s ease;
        }

        .option-radio.selected {
            border-color: white;
        }

        .option-radio.selected::after {
            content: '';
            position: absolute;
            width: 10px;
            height: 10px;
            background: white;
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }

        .dark-mode .option-radio {
            border-color: #6b7280;
        }

        /* Animazioni */
        @keyframes slideInDown {
            from {
                transform: translateY(-20px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }

        @keyframes slideInUp {
            from {
                transform: translateY(20px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }

        @keyframes pulse {
            0%, 100% {
                opacity: 1;
                transform: scale(1);
            }
            50% {
                opacity: 0.7;
                transform: scale(1.1);
            }
        }

        @keyframes spin {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }

        @keyframes shimmer {
            0% {
                left: -100%;
            }
            100% {
                left: 100%;
            }
        }

        /* Responsive */
        @media (max-width: 768px) {
            .container {
                padding: 16px;
            }

            .header-main {
                padding: 24px;
            }

            .header-title {
                font-size: 2rem;
            }

            .territory-filters {
                padding: 16px 24px;
                flex-direction: column;
                align-items: flex-start;
            }

            .kpi-grid {
                grid-template-columns: 1fr;
                gap: 16px;
            }

            .kpi-card {
                padding: 24px;
            }

            .kpi-value {
                font-size: 2rem;
            }

            .chart-grid {
                grid-template-columns: 1fr;
                gap: 16px;
            }

            .chart-card {
                padding: 24px;
            }

            .chart-container {
                height: 280px;
            }

            .table-container {
                padding: 16px;
            }

            .vendite-table td {
                padding: 12px 8px;
                font-size: 0.875rem;
            }

            .status-card {
                position: relative;
                top: auto;
                right: auto;
                margin-bottom: 16px;
            }

            .popup-header, .popup-body {
                padding: 20px;
            }

            .province-option {
                padding: 16px;
            }
        }

        /* Utilities */
        .hidden {
            display: none !important;
        }

        .text-center {
            text-align: center;
        }

        .font-bold {
            font-weight: 700;
        }

        .text-sm {
            font-size: 0.875rem;
        }

        .text-xs {
            font-size: 0.75rem;
        }

        .mt-2 {
            margin-top: 0.5rem;
        }

        .mb-4 {
            margin-bottom: 1rem;
        }

        .p-4 {
            padding: 1rem;
        }

        .rounded-lg {
            border-radius: 0.5rem;
        }
    </style>
</head>
<body class="dark-mode">
    <!-- Elementi decorativi di sfondo -->
    <div class="bg-decoration"></div>
    <div class="bg-decoration"></div>
    <div class="bg-decoration"></div>

    <!-- Status Card -->
    <div class="status-card">
        <div class="status-header">
            <div class="connection-status">
                <div id="connection-dot" class="status-dot online"></div>
                <span id="connection-status" class="font-bold text-sm">Online</span>
            </div>
            <button id="refresh-btn" class="refresh-btn">
                <i id="refresh-icon" class="fas fa-sync-alt"></i>
            </button>
        </div>
        <div id="status-badge" class="status-badge success">
            ✅ CSV letto correttamente
        </div>
        <div class="text-xs mt-2">
            Ultimo aggiornamento: <span id="last-update">--</span>
        </div>
    </div>

    <div class="container">
        <!-- Header migliorato -->
        <div class="header-card">
            <div class="header-main">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;">
                    <div>
                        <h1 class="header-title">CARABOT NATALINO</h1>
                        <p class="header-subtitle">Dashboard Performance Vendite</p>
                    </div>
                    <button id="theme-toggle" class="theme-toggle">
                        <i id="theme-icon" class="fas fa-sun"></i>
                    </button>
                </div>
                
                <div class="header-info">
                    <div class="info-item">
                        <span class="text-sm" style="color: #6b7280;">ID:</span>
                        <code class="info-badge">631.00238</code>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-calendar" style="color: #6b7280;"></i>
                        <span class="font-bold">Gen - Ago 2025 (8 mesi)</span>
                    </div>
                    <div class="status-indicator">
                        <div class="status-dot"></div>
                        <span class="text-sm">Dati aggiornati dal CSV GitHub</span>
                    </div>
                </div>
            </div>
            
            <div class="territory-filters">
                <div class="filter-info">
                    <h3>Filtro Territorio</h3>
                    <div class="current-filter">
                        <div id="current-filter-dot" class="filter-dot"></div>
                        <span id="current-filter-name" class="filter-name">Tutte le Province</span>
                    </div>
                </div>
                <button id="province-filter" class="filter-button">
                    <i class="fas fa-chevron-down"></i>
                    <span>Selezione Provincia</span>
                </button>
            </div>
        </div>

        <!-- Loading State -->
        <div id="loading-state" class="loading-state hidden">
            <div class="loading-spinner"></div>
            <h3>Caricamento dati CSV...</h3>
            <p>Aggiornamento in corso dal repository GitHub</p>
        </div>

        <!-- Error State -->
        <div id="error-state" class="error-state hidden">
            <div style="font-size: 3rem; margin-bottom: 16px;">⚠️</div>
            <h3>Errore nel caricamento</h3>
            <p id="error-message">Impossibile caricare i dati CSV</p>
            <button onclick="window.dashboard.fetchCSVData(true)" style="margin-top: 16px; padding: 12px 24px; background: #3b82f6; color: white; border: none; border-radius: 8px; cursor: pointer;">
                Riprova
            </button>
        </div>

        <!-- Main Content -->
        <div id="main-content" class="hidden">
            <!-- KPI Cards -->
            <div class="kpi-grid">
                <!-- Fatturato -->
                <div class="kpi-card success">
                    <div class="kpi-header">
                        <div>
                            <p class="kpi-title">Fatturato 2025</p>
                            <p id="fatturato-value" class="kpi-value">€0</p>
                        </div>
                        <div id="growth-badge" class="kpi-badge success">
                            <i class="fas fa-arrow-up"></i>
                            <span id="growth-value">+0%</span>
                        </div>
                    </div>
                    <div class="kpi-subtitle">
                        vs 2024: <span id="previous-value" class="font-bold">€0</span>
                    </div>
                    
                    <div id="fatturato-progress" class="progress-section">
                        <div class="progress-header">
                            <div class="progress-label">
                                <div class="progress-dot"></div>
                                <span>Obiettivo Fatturato</span>
                            </div>
                            <span id="obiettivo-target" class="font-bold">€0</span>
                        </div>
                        <div class="progress-bar">
                            <div id="fatturato-progress-fill" class="progress-fill" style="width: 0%"></div>
                        </div>
                        <div class="progress-footer">
                            <span class="left">Mancano: <span id="fatturato-remaining">€0</span></span>
                            <span class="right"><span id="fatturato-percentage">0</span>%</span>
                        </div>
                    </div>
                </div>

                <!-- Obiettivo -->
                <div id="obiettivo-card" class="kpi-card info hidden">
                    <div class="kpi-header">
                        <div>
                            <p class="kpi-title">Obiettivo 2025</p>
                            <p id="obiettivo-value" class="kpi-value">€0</p>
                        </div>
                        <div class="kpi-badge info">
                            <span id="obiettivo-percentage">0%</span>
                        </div>
                    </div>
                    <div class="kpi-subtitle">
                        Da raggiungere: <span id="remaining-value" class="font-bold">€0</span>
                    </div>
                    
                    <div class="progress-section blue">
                        <div class="progress-header">
                            <div class="progress-label blue">
                                <div class="progress-dot blue"></div>
                                <span>Progressione Obiettivo</span>
                            </div>
                            <span id="obiettivo-target2" class="font-bold">€0</span>
                        </div>
                        <div class="progress-bar blue">
                            <div id="progress-fill" class="progress-fill blue" style="width: 0%"></div>
                        </div>
                        <div class="progress-footer">
                            <span class="left blue">Mancano: <span id="obiettivo-remaining">€0</span></span>
                            <span class="right blue"><span id="obiettivo-percentage2">0</span>%</span>
                        </div>
                    </div>
                </div>

                <!-- Performance -->
                <div class="kpi-card">
                    <div class="kpi-header">
                        <div>
                            <p class="kpi-title">Top Performance</p>
                            <p id="performance-provincia" class="kpi-value">--</p>
                            <p class="text-sm" style="color: #6b7280; margin-top: 4px;">
                                Provincia <span id="performance-nome">--</span>
                            </p>
                        </div>
                        <div class="text-right">
                            <p id="performance-crescita" class="kpi-badge info" style="font-size: 1.5rem; background: none; color: #06b6d4; padding: 0;">+0%</p>
                            <p class="text-xs" style="color: #6b7280;">crescita totale</p>
                            <p id="performance-fatturato" class="font-bold text-sm" style="margin-top: 4px;">€0</p>
                        </div>
                    </div>
                    
                    <div class="progress-section cyan">
                        <div class="progress-header">
                            <div class="progress-label cyan">
                                <div class="progress-dot cyan"></div>
                                <span>Crescita Complessiva</span>
                            </div>
                            <span id="performance-incremento" class="font-bold">+€0</span>
                        </div>
                        <div class="progress-bar cyan">
                            <div id="performance-progress" class="progress-fill cyan" style="width: 0%"></div>
                        </div>
                        <div class="progress-footer">
                            <span class="left cyan">Crescita: +<span id="performance-crescita2">0</span>%</span>
                            <span class="right cyan">Trend positivo</span>
                        </div>
                    </div>
                </div>

                <!-- Clienti -->
                <div class="kpi-card warning">
                    <div class="kpi-header">
                        <div>
                            <p class="kpi-title">Clienti Attivi</p>
                            <p id="clienti-value" class="kpi-value">0</p>
                        </div>
                        <div class="text-right">
                            <p id="clienti-percentage" class="kpi-badge warning" style="font-size: 1.5rem; background: none; color: #f59e0b; padding: 0;">0%</p>
                            <p class="text-xs" style="color: #6b7280;">raggiunto</p>
                        </div>
                    </div>
                    <div class="kpi-subtitle">
                        <span id="provincia-label">TOT</span> • Obiettivo: <span id="clienti-obiettivo" class="font-bold">0</span>
                    </div>
                    
                    <div class="progress-section orange">
                        <div class="progress-header">
                            <div class="progress-label orange">
                                <div class="progress-dot orange"></div>
                                <span>Obiettivo Clienti</span>
                            </div>
                            <span id="clienti-obiettivo2" class="font-bold">0</span>
                        </div>
                        <div class="progress-bar orange">
                            <div id="clienti-progress" class="progress-fill orange" style="width: 0%"></div>
                        </div>
                        <div class="progress-footer">
                            <span class="left orange">Mancano: <span id="clienti-mancanti">0</span> clienti</span>
                            <span class="right orange"><span id="clienti-percentage2">0</span>%</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Charts -->
            <div class="chart-grid">
                <!-- Trend Chart -->
                <div class="chart-card">
                    <h3 class="chart-title">Trend Vendite Mensile</h3>
                    <div class="chart-container">
                        <canvas id="trend-chart"></canvas>
                    </div>
                </div>

                <!-- Province Chart -->
                <div class="chart-card">
                    <h3 class="chart-title">Confronto Province</h3>
                    <div class="chart-container">
                        <canvas id="province-chart"></canvas>
                    </div>
                </div>
            </div>

            <!-- Vendite Table -->
            <div class="table-container">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                    <h3 class="chart-title" style="margin: 0;">Top Vendite per Cliente</h3>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div class="status-badge success">
                            <i id="update-status-icon" class="fas fa-check-circle"></i>
                            <span id="table-status-text">Live</span>
                        </div>
                        <span class="text-xs" style="color: #6b7280;">
                            Aggiornato: <span id="table-timestamp">--</span>
                        </span>
                    </div>
                </div>
                
                <div class="table-responsive">
                    <table class="vendite-table">
                        <thead>
                            <tr>
                                <th>Provincia</th>
                                <th>Cliente</th>
                                <th>Categoria</th>
                                <th style="text-align: right;">Fatturato</th>
                            </tr>
                        </thead>
                        <tbody id="vendite-tbody">
                            <!-- Righe generate dinamicamente -->
                        </tbody>
                    </table>
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(229, 231, 235, 0.5);">
                    <div class="text-sm" style="color: #6b7280;">
                        Totale: <span id="total-clients" class="font-bold">0</span> clienti
                    </div>
                    <div class="text-sm" style="color: #6b7280;">
                        Fatturato Top 10: <span id="total-top-revenue" class="font-bold">€0</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Popup Selezione Provincia -->
    <div id="province-popup" class="popup-overlay">
        <div class="popup-content">
            <div class="popup-header">
                <div>
                    <h3 class="popup-title">Seleziona Provincia</h3>
                    <p class="text-sm" style="color: #6b7280; margin-top: 4px;">Scegli il territorio da visualizzare</p>
                </div>
                <button id="close-popup" class="popup-close">&times;</button>
            </div>
            <div class="popup-body">
                <div id="popup-options">
                    <!-- Opzioni generate dinamicamente -->
                </div>
                
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(229, 231, 235, 0.5);">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                        <div id="popup-status-dot" class="status-dot online"></div>
                        <span id="popup-status-text" class="text-sm font-bold">Dati CSV aggiornati automaticamente</span>
                    </div>
                </div>
            </div>
            
            <div style="padding: 16px 32px; border-top: 1px solid rgba(229, 231, 235, 0.5);">
                <button id="popup-close-btn" style="width: 100%; padding: 12px; background: #f3f4f6; color: #374151; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
                    Annulla
                </button>
            </div>
        </div>
    </div>

    <script>
        // ==================== DASHBOARD CARABOT NATALINO - VERSIONE MIGLIORATA ====================
        // Sistema REALE di auto-update dal CSV GitHub con design moderno

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
                this.startAnimations();
            }
            
            // ==================== ANIMAZIONI ====================
            startAnimations() {
                // Anima le KPI cards
                setTimeout(() => {
                    const kpiCards = document.querySelectorAll('.kpi-card');
                    kpiCards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('animate');
                        }, index * 200);
                    });
                }, 500);
                
                // Anima i chart containers
                setTimeout(() => {
                    const chartCards = document.querySelectorAll('.chart-card');
                    chartCards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('animate');
                        }, index * 300);
                    });
                }, 1000);
                
                // Anima la tabella
                setTimeout(() => {
                    const tableContainer = document.querySelector('.table-container');
                    if (tableContainer) {
                        tableContainer.classList.add('animate');
                    }
                }, 1500);
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
                
                // Aggiorna i grafici per il nuovo tema
                setTimeout(() => {
                    this.updateCharts();
                }, 100);
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
                    
                    const parsedData = this.parseCSV(csvText);
                    
                    if (parsedData) {
                        this.csvData = parsedData;
                        this.lastUpdate = new Date();
                        this.updateLoadingState('success');
                        this.renderDashboard();
                        
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
                    
                    // ✅ SEZIONE OBIETTIVI
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
