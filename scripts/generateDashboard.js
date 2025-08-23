const fs = require('fs');
const path = require('path');

async function generateDashboard() {
    console.log('🎨 Inizio generazione dashboard...');
    
    const dashboardDir = path.join(__dirname, '../dashboard');
    const dataPath = path.join(__dirname, '../data/agents.json');
    const summaryPath = path.join(__dirname, '../data/summary.json');
    
    // Crea cartella dashboard
    if (!fs.existsSync(dashboardDir)) {
        fs.mkdirSync(dashboardDir, { recursive: true });
        console.log('📁 Cartella dashboard creata');
    }
    
    // Leggi i dati
    let agentsData = [];
    let summaryData = {};
    
    if (fs.existsSync(dataPath)) {
        agentsData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        console.log(`📊 Caricati dati di ${agentsData.length} agenti`);
    }
    
    if (fs.existsSync(summaryPath)) {
        summaryData = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
        console.log('📈 Caricato summary');
    }
    
    // Template HTML React completo
    const htmlTemplate = `<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>📊 Dashboard Rete Commerciale Agenti</title>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/recharts@2.8.0/umd/Recharts.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .card-hover:hover { transform: translateY(-2px); transition: all 0.3s ease; }
    </style>
</head>
<body class="bg-gradient-to-br from-blue-50 to-indigo-100">
    <div id="root"></div>
    
    <script>
        // Dati caricati dal backend
        const agentsData = ${JSON.stringify(agentsData, null, 2)};
        const summaryData = ${JSON.stringify(summaryData, null, 2)};
        
        const { useState, useEffect } = React;
        const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } = Recharts;
        
        // Colori per i grafici
        const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
        
        function StatCard({ title, value, subtitle, icon, color = 'blue' }) {
            const colorClasses = {
                blue: 'bg-blue-500 text-blue-100',
                green: 'bg-green-500 text-green-100',
                purple: 'bg-purple-500 text-purple-100',
                orange: 'bg-orange-500 text-orange-100'
            };
            
            return React.createElement('div', {
                className: 'bg-white rounded-xl shadow-lg p-6 card-hover'
            }, [
                React.createElement('div', {
                    key: 'header',
                    className: 'flex items-center justify-between mb-4'
                }, [
                    React.createElement('h3', {
                        key: 'title',
                        className: 'text-gray-700 text-sm font-semibold uppercase tracking-wide'
                    }, title),
                    React.createElement('div', {
                        key: 'icon',
                        className: \`w-10 h-10 rounded-full flex items-center justify-center \${colorClasses[color]}\`
                    }, icon)
                ]),
                React.createElement('div', {
                    key: 'content',
                    className: 'space-y-2'
                }, [
                    React.createElement('p', {
                        key: 'value',
                        className: 'text-3xl font-bold text-gray-800'
                    }, value),
                    subtitle && React.createElement('p', {
                        key: 'subtitle',
                        className: 'text-gray-600 text-sm'
                    }, subtitle)
                ])
            ]);
        }
        
        function AgentCard({ agent }) {
            return React.createElement('div', {
                className: 'bg-white rounded-lg shadow-md p-4 card-hover'
            }, [
                React.createElement('div', {
                    key: 'header',
                    className: 'flex justify-between items-start mb-3'
                }, [
                    React.createElement('div', { key: 'info' }, [
                        React.createElement('h4', {
                            key: 'name',
                            className: 'font-bold text-gray-800'
                        }, agent.nome),
                        React.createElement('p', {
                            key: 'code',
                            className: 'text-gray-600 text-sm'
                        }, \`Codice: \${agent.codice}\`)
                    ]),
                    React.createElement('span', {
                        key: 'badge',
                        className: 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold'
                    }, \`\${agent.statistiche.totaleTabelle} tabelle\`)
                ]),
                React.createElement('div', {
                    key: 'stats',
                    className: 'grid grid-cols-2 gap-4 text-sm'
                }, [
                    React.createElement('div', {
                        key: 'rows',
                        className: 'text-center bg-gray-50 rounded p-2'
                    }, [
                        React.createElement('div', {
                            key: 'value',
                            className: 'font-bold text-lg text-gray-800'
                        }, agent.statistiche.totaleRighe),
                        React.createElement('div', {
                            key: 'label',
                            className: 'text-gray-600'
                        }, 'Righe')
                    ]),
                    React.createElement('div', {
                        key: 'update',
                        className: 'text-center bg-gray-50 rounded p-2'
                    }, [
                        React.createElement('div', {
                            key: 'date',
                            className: 'font-bold text-sm text-gray-800'
                        }, agent.dataEstrazione),
                        React.createElement('div', {
                            key: 'label',
                            className: 'text-gray-600'
                        }, 'Aggiornato')
                    ])
                ])
            ]);
        }
        
        function Dashboard() {
            const [selectedAgent, setSelectedAgent] = useState(null);
            
            // Prepara dati per i grafici
            const chartData = agentsData.map(agent => ({
                nome: agent.nome.length > 10 ? agent.nome.substring(0, 10) + '...' : agent.nome,
                tabelle: agent.statistiche.totaleTabelle,
                righe: agent.statistiche.totaleRighe
            }));
            
            return React.createElement('div', {
                className: 'min-h-screen p-6'
            }, [
                // Header
                React.createElement('div', {
                    key: 'header',
                    className: 'mb-8 text-center'
                }, [
                    React.createElement('h1', {
                        key: 'title',
                        className: 'text-4xl font-bold text-gray-800 mb-2'
                    }, '📊 Dashboard Rete Commerciale'),
                    React.createElement('p', {
                        key: 'subtitle',
                        className: 'text-gray-600 text-lg'
                    }, \`Ultimo aggiornamento: \${new Date().toLocaleString('it-IT')}\`),
                    summaryData.dataGenerazione && React.createElement('p', {
                        key: 'data-gen',
                        className: 'text-gray-500 text-sm mt-1'
                    }, \`Dati generati: \${new Date(summaryData.dataGenerazione).toLocaleString('it-IT')}\`)
                ]),
                
                // Stats Cards
                React.createElement('div', {
                    key: 'stats',
                    className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'
                }, [
                    React.createElement(StatCard, {
                        key: 'agents',
                        title: 'Agenti Totali',
                        value: summaryData.totaleAgenti || agentsData.length,
                        subtitle: 'Agenti nel sistema',
                        icon: '👥',
                        color: 'blue'
                    }),
                    React.createElement(StatCard, {
                        key: 'tables',
                        title: 'Tabelle Totali',
                        value: summaryData.totaleTabelle || '0',
                        subtitle: 'Tabelle elaborate',
                        icon: '📋',
                        color: 'green'
                    }),
                    React.createElement(StatCard, {
                        key: 'rows',
                        title: 'Righe Totali',
                        value: summaryData.totaleRighe || '0',
                        subtitle: 'Dati processati',
                        icon: '📄',
                        color: 'purple'
                    }),
                    React.createElement(StatCard, {
                        key: 'avg',
                        title: 'Media Righe/Agente',
                        value: summaryData.totaleAgenti ? Math.round(summaryData.totaleRighe / summaryData.totaleAgenti) : '0',
                        subtitle: 'Righe per agente',
                        icon: '📊',
                        color: 'orange'
                    })
                ]),
                
                // Charts Section
                agentsData.length > 0 && React.createElement('div', {
                    key: 'charts',
                    className: 'grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'
                }, [
                    React.createElement('div', {
                        key: 'chart1',
                        className: 'bg-white rounded-xl shadow-lg p-6'
                    }, [
                        React.createElement('h3', {
                            key: 'title1',
                            className: 'text-lg font-semibold text-gray-800 mb-4'
                        }, '📋 Tabelle per Agente'),
                        React.createElement(ResponsiveContainer, {
                            key: 'chart1-container',
                            width: '100%',
                            height: 300
                        }, React.createElement(BarChart, {
                            data: chartData.slice(0, 10)
                        }, [
                            React.createElement(CartesianGrid, { key: 'grid1', strokeDasharray: '3 3' }),
                            React.createElement(XAxis, { key: 'x1', dataKey: 'nome', fontSize: 12 }),
                            React.createElement(YAxis, { key: 'y1', fontSize: 12 }),
                            React.createElement(Tooltip, { key: 'tooltip1' }),
                            React.createElement(Bar, { key: 'bar1', dataKey: 'tabelle', fill: '#0088FE' })
                        ]))
                    ]),
                    React.createElement('div', {
                        key: 'chart2',
                        className: 'bg-white rounded-xl shadow-lg p-6'
                    }, [
                        React.createElement('h3', {
                            key: 'title2',
                            className: 'text-lg font-semibold text-gray-800 mb-4'
                        }, '📄 Righe per Agente'),
                        React.createElement(ResponsiveContainer, {
                            key: 'chart2-container',
                            width: '100%',
                            height: 300
                        }, React.createElement(BarChart, {
                            data: chartData.slice(0, 10)
                        }, [
                            React.createElement(CartesianGrid, { key: 'grid2', strokeDasharray: '3 3' }),
                            React.createElement(XAxis, { key: 'x2', dataKey: 'nome', fontSize: 12 }),
                            React.createElement(YAxis, { key: 'y2', fontSize: 12 }),
                            React.createElement(Tooltip, { key: 'tooltip2' }),
                            React.createElement(Bar, { key: 'bar2', dataKey: 'righe', fill: '#00C49F' })
                        ]))
                    ])
                ]),
                
                // Agents Grid
                React.createElement('div', {
                    key: 'agents-section',
                    className: 'bg-white rounded-xl shadow-lg p-6'
                }, [
                    React.createElement('h3', {
                        key: 'agents-title',
                        className: 'text-xl font-semibold text-gray-800 mb-6'
                    }, \`👥 Agenti (\${agentsData.length})\`),
                    agentsData.length > 0 ? React.createElement('div', {
                        key: 'agents-grid',
                        className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                    }, agentsData.map((agent, index) => 
                        React.createElement(AgentCard, {
                            key: \`agent-\${index}\`,
                            agent: agent
                        })
                    )) : React.createElement('div', {
                        key: 'no-data',
                        className: 'text-center py-8 text-gray-500'
                    }, [
                        React.createElement('div', {
                            key: 'icon',
                            className: 'text-6xl mb-4'
                        }, '📊'),
                        React.createElement('p', {
                            key: 'message',
                            className: 'text-lg'
                        }, 'Nessun dato disponibile'),
                        React.createElement('p', {
                            key: 'submessage',
                            className: 'text-sm'
                        }, 'I dati verranno elaborati automaticamente')
                    ])
                ]),
                
                // Footer
                React.createElement('div', {
                    key: 'footer',
                    className: 'mt-8 text-center text-gray-600 text-sm'
                }, [
                    React.createElement('p', {
                        key: 'footer-text'
                    }, \`🔄 Dashboard aggiornato automaticamente • \${new Date().getFullYear()}\`)
                ])
            ]);
        }
        
        // Render dell'applicazione
        ReactDOM.render(React.createElement(Dashboard), document.getElementById('root'));
    </script>
</body>
</html>`;
    
    // Salva il dashboard
    const outputPath = path.join(dashboardDir, 'index.html');
    fs.writeFileSync(outputPath, htmlTemplate);
    
    console.log('✅ Dashboard generato con successo!');
    console.log(`📁 File salvato in: ${outputPath}`);
    console.log(`📊 Dashboard include ${agentsData.length} agenti`);
    console.log(`🌐 Sarà disponibile su GitHub Pages una volta deployato`);
}

// Esegui la generazione
generateDashboard().catch(error => {
    console.error('❌ Errore durante la generazione:', error);
    process.exit(1);
});
