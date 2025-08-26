// WOW Charts App (Chart.js + parser per report multi-sezione)
// Auto-refresh + cache-busting + filtri

const CSV_CANDIDATES = [
  "631.00238_CARABOT-NATALINO.csv",
  "docs/631.00238_CARABOT-NATALINO.csv",
  "631.00238_CARABOT NATALINO.csv",
  "docs/631.00238_CARABOT NATALINO.csv",
];

const STATE = {
  RAW: [],      // righe {provincia, cliente, categoria, valore}
  VIEW: [],
  RIEP: [],     // riepilogo per categoria (opzionale)
  PERIODO: "",
  charts: { cat:null, prov:null, top:null, donut:null },
  timer: null
};

const nf = new Intl.NumberFormat('it-IT', { maximumFractionDigits: 2 });

// ======= Parser =======
function parseItNumber(s){
  if (s == null) return 0;
  const t = String(s).trim().replace(/\./g, "").replace(",", ".");
  const n = parseFloat(t);
  return Number.isFinite(n) ? n : 0;
}
function splitRow(row){
  const r = row.replace(/^\uFEFF/, "");
  return r.split(";").map(c => c.trim());
}
function extractSectionLines(lines, title){
  const marker = `=== ${title} ===`;
  let start = -1;
  for (let i=0;i<lines.length;i++){
    if (lines[i].includes(marker)){ start = i; break; }
  }
  if (start === -1) return [];
  let i = start + 1;
  while (i < lines.length && lines[i].replace(/;/g,"").trim() === "") i++;
  const headerLine = lines[i] || "";
  const headers = splitRow(headerLine).map(h => h.toLowerCase());
  const data = [];
  for (let j=i+1; j<lines.length; j++){
    const raw = lines[j];
    if (!raw || raw.startsWith("===") || raw.replace(/;/g,"").trim() === "") break;
    const cells = splitRow(raw);
    data.push({ headers, cells });
  }
  return data;
}
function parseAgentReport(csvText){
  const lines = csvText.split(/\r?\n/);
  const dettagli = extractSectionLines(lines, "DETTAGLIO VENDITE PER CLIENTE").map(({headers, cells}) => {
    const H = (name) => headers.findIndex(h => h.includes(name));
    const idxProv = H("provincia");
    const idxCli  = headers.findIndex(h => h.includes("ragione sociale"));
    const idxCat  = H("categoria");
    const idxVal  = H("fatturato");
    return {
      provincia: idxProv>=0 ? cells[idxProv] : "",
      cliente:   idxCli >=0 ? cells[idxCli]  : "",
      categoria: idxCat>=0 ? cells[idxCat]  : "",
      valore:    idxVal>=0 ? parseItNumber(cells[idxVal]) : 0
    };
  }).filter(r => r.cliente || r.valore>0);

  const riepilogoCat = extractSectionLines(lines, "RIEPILOGO PER CATEGORIA").map(({headers, cells}) => {
    const H = (name) => headers.findIndex(h => h.includes(name));
    const idxCat = H("categoria");
    const idxTot = headers.findIndex(h => h.includes("importo totale"));
    return {
      categoria: idxCat>=0 ? cells[idxCat] : "",
      importo:   idxTot>=0 ? parseItNumber(cells[idxTot]) : 0
    };
  });

  const periodoRow = lines.find(l => l.toLowerCase().startsWith("periodo;"));
  let periodo = "";
  if (periodoRow){
    const cells = splitRow(periodoRow);
    periodo = (cells[1] || "").trim();
  }
  return { dettagli, riepilogoCat, periodo };
}

// ======= Data Loading =======
async function fetchCSVData(){
  let text = "";
  let lastErr = null;
  for (const baseUrl of CSV_CANDIDATES){
    const url = `${baseUrl}?t=${Date.now()}&r=${Math.random().toString(36).slice(2)}`;
    try{
      const res = await fetch(url, { cache: "no-cache" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      text = await res.text();
      if (text && text.length > 0){ break; }
    }catch(err){ lastErr = err; }
  }
  if (!text) throw lastErr || new Error("CSV non trovato");

  const { dettagli, riepilogoCat, periodo } = parseAgentReport(text);
  STATE.RAW = dettagli;
  STATE.VIEW = dettagli.slice();
  STATE.RIEP = riepilogoCat;
  STATE.PERIODO = periodo || "";
}

// ======= Filters & UI =======
function initUI(){
  const selCat = document.getElementById("categoria");
  const selProv = document.getElementById("provincia");
  const search = document.getElementById("search");

  const cats = Array.from(new Set(STATE.RAW.map(r => r.categoria))).sort();
  selCat.innerHTML = `<option value="__ALL__">Tutte</option>` + cats.map(c => `<option>${c}</option>`).join("");

  const provs = Array.from(new Set(STATE.RAW.map(r => r.provincia))).sort();
  selProv.innerHTML = `<option value="__ALL__">Tutte</option>` + provs.map(p => `<option>${p}</option>`).join("");

  selCat.onchange = applyFilters;
  selProv.onchange = applyFilters;
  search.oninput = debounce(applyFilters, 120);

  document.getElementById("reset").onclick = () => {
    selCat.value = "__ALL__";
    selProv.value = "__ALL__";
    search.value = "";
    STATE.VIEW = STATE.RAW.slice();
    renderAll();
  };
}
function applyFilters(){
  const cat = document.getElementById("categoria").value;
  const prov = document.getElementById("provincia").value;
  const q = document.getElementById("search").value.toLowerCase().trim();

  STATE.VIEW = STATE.RAW.filter(r => {
    const okCat  = (cat === "__ALL__") ? true : r.categoria === cat;
    const okProv = (prov === "__ALL__") ? true : r.provincia === prov;
    const okQ = q ? (r.cliente.toLowerCase().includes(q)) : true;
    return okCat && okProv && okQ;
  });
  renderAll();
}
function debounce(fn, ms){
  let t; return (...args) => { clearTimeout(t); t = setTimeout(()=>fn(...args), ms); };
}

// ======= Rendering =======
function renderAll(){
  document.getElementById("periodo").textContent = STATE.PERIODO || "—";
  document.getElementById("rows-count").textContent = STATE.VIEW.length;
  renderKPIs();
  renderCharts();
  renderTable();
  setStatus("Online");
}
function renderKPIs(){
  const total = STATE.VIEW.reduce((s,r)=> s + (r.valore||0), 0);
  const clients = new Set(STATE.VIEW.map(r => r.cliente)).size;
  const cats = new Set(STATE.VIEW.map(r => r.categoria)).size;
  const provs = new Set(STATE.VIEW.map(r => r.provincia)).size;
  document.getElementById("kpiTotal").textContent = nf.format(total);
  document.getElementById("kpiClients").textContent = nf.format(clients);
  document.getElementById("kpiCats").textContent = nf.format(cats);
  document.getElementById("kpiProv").textContent = nf.format(provs);
}
function buildGradient(ctx, colorA, colorB){
  const {ctx: c, chartArea} = ctx.chart;
  if (!chartArea) return null;
  const g = c.createLinearGradient(chartArea.left, chartArea.bottom, chartArea.right, chartArea.top);
  g.addColorStop(0, colorA);
  g.addColorStop(1, colorB);
  return g;
}
function renderCharts(){
  // 1) Categoria (BAR)
  const catAgg = STATE.VIEW.reduce((m,r)=> (m[r.categoria]=(m[r.categoria]||0)+(r.valore||0), m), {});
  const labelsCat = Object.keys(catAgg).sort();
  const valuesCat = labelsCat.map(k => catAgg[k]);
  const c1 = document.getElementById("categoryChart").getContext("2d");
  if (STATE.charts.cat) STATE.charts.cat.destroy();
  STATE.charts.cat = new Chart(c1, {
    type: "bar",
    data: { labels: labelsCat, datasets: [{ label: "Somma per categoria", data: valuesCat,
      borderWidth: 2, borderRadius: 8, backgroundColor: (ctx)=>buildGradient(ctx,"#7c5cff55","#23b4ff66"), borderColor:"#23b4ff" }]},
    options: { responsive:true, maintainAspectRatio:false, scales:{ y:{ beginAtZero:true }}, plugins:{ legend:{display:false} } }
  });

  // 2) Provincia (BAR)
  const provAgg = STATE.VIEW.reduce((m,r)=> (m[r.provincia]=(m[r.provincia]||0)+(r.valore||0), m), {});
  const labelsProv = Object.keys(provAgg).sort();
  const valuesProv = labelsProv.map(k => provAgg[k]);
  const c2 = document.getElementById("provinceChart").getContext("2d");
  if (STATE.charts.prov) STATE.charts.prov.destroy();
  STATE.charts.prov = new Chart(c2, {
    type: "bar",
    data: { labels: labelsProv, datasets: [{ label: "Somma per provincia", data: valuesProv,
      borderWidth:2, borderRadius:8, backgroundColor:(ctx)=>buildGradient(ctx,"#18d3a644","#23b4ff66"), borderColor:"#18d3a6" }]},
    options: { indexAxis: "x", responsive:true, maintainAspectRatio:false, scales:{ y:{ beginAtZero:true }}, plugins:{ legend:{display:false} } }
  });

  // 3) Top 10 clienti (HBAR)
  const clientAgg = STATE.VIEW.reduce((m,r)=> (m[r.cliente]=(m[r.cliente]||0)+(r.valore||0), m), {});
  const pairs = Object.entries(clientAgg).sort((a,b)=> b[1]-a[1]).slice(0,10);
  const labelsTop = pairs.map(p=>p[0]);
  const valuesTop = pairs.map(p=>p[1]);
  const c3 = document.getElementById("topClientsChart").getContext("2d");
  if (STATE.charts.top) STATE.charts.top.destroy();
  STATE.charts.top = new Chart(c3, {
    type: "bar",
    data: { labels: labelsTop, datasets: [{ label:"Top clienti", data: valuesTop,
      borderWidth:2, borderRadius:8, backgroundColor:(ctx)=>buildGradient(ctx,"#7c5cff66","#18d3a655"), borderColor:"#7c5cff" }]},
    options: { indexAxis:"y", responsive:true, maintainAspectRatio:false, scales:{ x:{ beginAtZero:true }}, plugins:{ legend:{display:false} } }
  });

  // 4) Donut da RIEPILOGO (se presente)
  const donutLabels = STATE.RIEP.map(r => r.categoria || "—");
  const donutValues = STATE.RIEP.map(r => r.importo || 0);
  const c4 = document.getElementById("donutChart").getContext("2d");
  if (STATE.charts.donut) STATE.charts.donut.destroy();
  STATE.charts.donut = new Chart(c4, {
    type: "doughnut",
    data: { labels: donutLabels, datasets: [{ data: donutValues,
      hoverOffset: 6, borderWidth:2, borderColor:"#0e111a" }]},
    options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:"right" }}, cutout:"60%" }
  });
}

function renderTable(){
  const tbody = document.querySelector("#dataTable tbody");
  tbody.innerHTML = "";
  for (const r of STATE.VIEW.slice(0,300)){
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${r.cliente}</td><td>${r.categoria}</td><td>${r.provincia}</td><td style="text-align:right">${nf.format(r.valore)}</td>`;
    tbody.appendChild(tr);
  }
}

// ======= Status & Auto update =======
function setStatus(s){
  const el = document.getElementById("status-badge");
  el.textContent = s;
  el.style.background = s === "Online"
    ? "linear-gradient(135deg, var(--accent3), var(--accent2))"
    : "linear-gradient(135deg, #a33, #f55)";
}
async function refreshAll(){
  try{
    setStatus("Aggiorno...");
    await fetchCSVData();
    initUI(); // prima volta o aggiorna le opzioni
    renderAll();
  }catch(e){
    console.error(e);
    setStatus("Offline");
  }
}
function startAutoUpdate(intervalMinutes = 2){
  if (STATE.timer) clearInterval(STATE.timer);
  STATE.timer = setInterval(refreshAll, intervalMinutes * 60 * 1000);
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("refresh-btn").onclick = refreshAll;
  refreshAll();
  startAutoUpdate(2); // ogni 2 minuti
});
