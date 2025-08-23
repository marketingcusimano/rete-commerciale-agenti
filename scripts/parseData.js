const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

async function parseHtmlFiles() {
    console.log('🔍 Inizio parsing file HTML...');
    
    const dataDir = path.join(__dirname, '../data');
    
    // Crea cartella data se non esiste
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
        console.log('📁 Cartella data creata');
    }
    
    // Trova tutti i file HTML nella root
    const rootDir = path.join(__dirname, '../');
    const htmlFiles = fs.readdirSync(rootDir)
        .filter(file => file.endsWith('.html') && !file.includes('index'));
    
    console.log(`📄 Trovati ${htmlFiles.length} file HTML`);
    
    const allAgents = [];
    
    for (const file of htmlFiles) {
        console.log(`📖 Parsing ${file}...`);
        
        const filePath = path.join(rootDir, file);
        const html = fs.readFileSync(filePath, 'utf8');
        const $ = cheerio.load(html);
        
        // Estrai informazioni base dal nome file
        const parts = file.replace('.html', '').split('_');
        const agent = {
            filename: file,
            codice: parts[0] || '',
            nome: parts.slice(1).join(' ') || 'Nome non disponibile',
            lastUpdate: new Date().toISOString(),
            dataEstrazione: new Date().toLocaleDateString('it-IT'),
            tabelle: [],
            statistiche: {
                totaleTabelle: 0,
                totaleRighe: 0
            }
        };
        
        // Cerca e analizza tutte le tabelle
        $('table').each((i, table) => {
            const tableData = {
                indice: i + 1,
                intestazioni: [],
                righe: [],
                totaleRighe: 0
            };
            
            // Estrai intestazioni
            $(table).find('thead tr th, tr:first-child td').each((j, cell) => {
                tableData.intestazioni.push($(cell).text().trim());
            });
            
            // Estrai righe dati
            $(table).find('tbody tr, tr:not(:first-child)').each((j, row) => {
                const rigaData = {};
                $(row).find('td').each((k, cell) => {
                    const intestazione = tableData.intestazioni[k] || `Colonna_${k + 1}`;
                    rigaData[intestazione] = $(cell).text().trim();
                });
                
                if (Object.keys(rigaData).length > 0) {
                    tableData.righe.push(rigaData);
                }
            });
            
            tableData.totaleRighe = tableData.righe.length;
            agent.tabelle.push(tableData);
        });
        
        // Aggiorna statistiche
        agent.statistiche.totaleTabelle = agent.tabelle.length;
        agent.statistiche.totaleRighe = agent.tabelle.reduce((sum, t) => sum + t.totaleRighe, 0);
        
        allAgents.push(agent);
        console.log(`✅ ${file}: ${agent.statistiche.totaleTabelle} tabelle, ${agent.statistiche.totaleRighe} righe`);
    }
    
    // Salva i dati
    const outputPath = path.join(dataDir, 'agents.json');
    fs.writeFileSync(outputPath, JSON.stringify(allAgents, null, 2));
    
    // Crea anche un summary
    const summary = {
        dataGenerazione: new Date().toISOString(),
        totaleAgenti: allAgents.length,
        totaleTabelle: allAgents.reduce((sum, a) => sum + a.statistiche.totaleTabelle, 0),
        totaleRighe: allAgents.reduce((sum, a) => sum + a.statistiche.totaleRighe, 0),
        agenti: allAgents.map(a => ({
            nome: a.nome,
            codice: a.codice,
            tabelle: a.statistiche.totaleTabelle,
            righe: a.statistiche.totaleRighe
        }))
    };
    
    fs.writeFileSync(path.join(dataDir, 'summary.json'), JSON.stringify(summary, null, 2));
    
    console.log(`\n🎉 PARSING COMPLETATO!`);
    console.log(`📊 Totale agenti: ${summary.totaleAgenti}`);
    console.log(`📋 Totale tabelle: ${summary.totaleTabelle}`);
    console.log(`📄 Totale righe: ${summary.totaleRighe}`);
    console.log(`💾 Dati salvati in: ${outputPath}`);
}

// Esegui il parsing
parseHtmlFiles().catch(error => {
    console.error('❌ Errore durante il parsing:', error);
    process.exit(1);
});
