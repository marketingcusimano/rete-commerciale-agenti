import React, { useEffect, useMemo, useRef, useState } from 'react'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ChevronUp, Moon, Sun, Calendar } from 'lucide-react'

/**
 * 📊 DASHBOARD CARABOT NATALINO — CSV LIVE (React + Tailwind + Recharts)
 * 
 * - Lettura automatica dal CSV locale: ./631.00238_CARABOT-NATALINO.csv
 * - Auto-refresh ogni 2 minuti (con cache-busting)
 * - Parser robusto per numeri in formato IT
 * - Formattazione in "k" con max 3 cifre (1,23k • 12,3k • 123k)
 * - UI moderna (dark/light), province popup, KPI, grafici
 */

// ==================== TIPI DI DATO ====================
type ProvinciaCode = string

interface Generale {
  annoPrecedente: number
  annoCorrente: number
  clienti: number
}

interface ProvinciaLT {
  annoPrecedente: number
  annoCorrente: number
  obiettivo: number | null
  percentualeObiettivo: number | null
  clientiPrecedenti: number
  clientiCorrente: number
  obiettivoClienti: number | null
}

interface ProvinciaRM {
  annoCorrente: number
  clienti: number
}

interface Vendita {
  provincia: ProvinciaCode
  cliente: string
  categoria: string
  fatturato: number
}

interface CsvState {
  generale: Generale
  latina: ProvinciaLT
  roma: ProvinciaRM
  vendite: Vendita[]
}

// ==================== UTILITY CLASSNAMES ====================
function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}

// ==================== UTILITY NUMERI ====================
function parseNumberIT(input: unknown): number {
  if (typeof input === 'number') return input
  if (input === null || input === undefined) return 0
  const cleaned = String(input)
    .replace(/\s+/g, '')
    .replace(/€/g, '')
    .replace(/\./g, '')
    .replace(/,/g, '.')
  const n = Number(cleaned)
  return Number.isFinite(n) ? n : 0
}

// 1,23k | 12,3k | 123k (max 3 cifre) — sempre in "migliaia"
function formatK3(value: number): string {
  const num = Number(value) || 0
  const sign = num < 0 ? '-' : ''
  const v = Math.abs(num)
  const k = v / 1000
  let outNum: string
  if (k >= 100) {
    outNum = Math.round(k).toString()
  } else if (k >= 10) {
    outNum = formatItDecimals(Math.round(k * 10) / 10, 1)
  } else {
    outNum = formatItDecimals(Math.round(k * 100) / 100, 2)
  }
  return `${sign}${outNum}k`
}

function formatEuroK3(value: number): string {
  if (!value) return '€0k'
  return `€${formatK3(value).replace('k', '')}k`
}

function formatItDecimals(n: number, decimals: number): string {
  const s = n.toFixed(decimals).replace('.', ',')
  return s.replace(/,?0+$/, '')
}

function formatCurrencyEuro(value?: number): string {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value || 0)
}

function growthPct(current: number, previous: number): string {
  if (!previous) return '0.0'
  return (((current - previous) / previous) * 100).toFixed(1)
}

// ==================== PALETTE PROVINCE ====================
const palette = [
  { name: 'violet', hex: '#8b5cf6' },
  { name: 'cyan', hex: '#06b6d4' },
  { name: 'emerald', hex: '#10b981' },
  { name: 'orange', hex: '#f97316' },
  { name: 'pink', hex: '#ec4899' },
  { name: 'indigo', hex: '#6366f1' },
  { name: 'yellow', hex: '#eab308' },
  { name: 'red', hex: '#ef4444' },
  { name: 'purple', hex: '#a855f7' },
  { name: 'teal', hex: '#14b8a6' },
  { name: 'lime', hex: '#84cc16' },
  { name: 'blue', hex: '#3b82f6' },
]

function getProvinceColor(code: ProvinciaCode, index?: number) {
  const map: Record<string, { name: string; hex: string }> = {
    LT: palette[0], // violet
    RM: palette[1], // cyan
  }
  if (map[code]) return map[code]
  const idx = typeof index === 'number' ? index % palette.length : (code.charCodeAt(0) + code.charCodeAt(code.length - 1)) % palette.length
  return palette[idx]
}

function getProvinceName(code: ProvinciaCode) {
  const names: Record<string, string> = { LT: 'Latina', RM: 'Roma' }
  return names[code] || code
}

// ==================== PARSING CSV (stesso schema dello script originale) ====================
function parseCsvText(csvText: string): CsvState | null {
  // OBIETTIVI
  const obiettiviMatch = csvText.match(/=== VERIFICA OBIETTIVI ===([\s\S]*?)===.*===/)
  if (!obiettiviMatch) return null
  const obiettiviText = obiettiviMatch[1]

  const generaleMatch = obiettiviText.match(/Generale;([\d.,]+);([\d.,]+);;;(\d+);(\d+);;/)
  if (!generaleMatch) return null
  const generale: Generale = {
    annoPrecedente: parseNumberIT(generaleMatch[1]),
    annoCorrente: parseNumberIT(generaleMatch[2]),
    clienti: parseInt(generaleMatch[4], 10),
  }

  const ltMatch = obiettiviText.match(/LT;([\d.,]+);([\d.,]+);([\d.,]+);(\d+)%;(\d+);(\d+);(\d+);(\d+)%/)
  if (!ltMatch) return null

  const latinaObiettivoMigliaia = parseNumberIT(ltMatch[3])
  const latina: ProvinciaLT = {
    annoPrecedente: parseNumberIT(ltMatch[1]),
    annoCorrente: parseNumberIT(ltMatch[2]),
    obiettivo: latinaObiettivoMigliaia * 1000, // CSV in migliaia → euro
    percentualeObiettivo: parseInt(ltMatch[4], 10),
    clientiPrecedenti: parseInt(ltMatch[5], 10),
    clientiCorrente: parseInt(ltMatch[6], 10),
    obiettivoClienti: parseInt(ltMatch[7], 10),
  }

  // CLIENTI PER PROVINCIA → ROMA
  const clientiMatch = csvText.match(/=== CLIENTI PER PROVINCIA ===([\s\S]*?)===.*===/)
  let roma: ProvinciaRM = { annoCorrente: 0, clienti: 0 }
  if (clientiMatch) {
    const clientiText = clientiMatch[1]
    const rmMatch = clientiText.match(/RM;(\d+);([\d.,]+);;;;;;/)
    if (rmMatch) {
      roma = {
        annoCorrente: parseNumberIT(rmMatch[2]),
        clienti: parseInt(rmMatch[1], 10),
      }
    }
  }

  // DETTAGLIO VENDITE PER CLIENTE → top 10 + base per categorie
  const dettaglioStart = csvText.indexOf('=== DETTAGLIO VENDITE PER CLIENTE ===')
  const dettaglioEnd = csvText.indexOf('=== RIEPILOGO PER CATEGORIA ===')
  let vendite: Vendita[] = []
  if (dettaglioStart !== -1 && dettaglioEnd !== -1) {
    const dettaglioSection = csvText.substring(dettaglioStart, dettaglioEnd)
    const lines = dettaglioSection
      .split('\n')
      .filter(
        (line) =>
          line.trim() &&
          !line.includes('===') &&
          !line.includes('Provincia;Ragione Sociale Cliente') &&
          line.includes(';') &&
          line.split(';').length >= 4,
      )

    const venditeMap = new Map<string, Vendita>()
    lines.forEach((line) => {
      const parts = line.split(';')
      if (parts.length >= 4) {
        const fatturato = parseNumberIT(parts[3])
        if (!isNaN(fatturato) && fatturato > 0) {
          const cliente = parts[1].trim()
          const vendita: Vendita = {
            provincia: parts[0].trim(),
            cliente,
            categoria: parts[2].trim(),
            fatturato,
          }
          const exist = venditeMap.get(cliente)
          if (!exist || exist.fatturato < fatturato) venditeMap.set(cliente, vendita)
        }
      }
    })

    vendite = Array.from(venditeMap.values()).sort((a, b) => b.fatturato - a.fatturato).slice(0, 10)
  }

  return { generale, latina, roma, vendite }
}

// ==================== TESTS (console) ====================
function runUnitTests() {
  // parseNumberIT tests
  const parseCases = [
    { input: '1.234,56', expected: 1234.56 },
    { input: '12.345', expected: 12345 },
    { input: '€ 987.654,00', expected: 987654 },
    { input: '0,00', expected: 0 },
  ]
  parseCases.forEach(({ input, expected }) => {
    const got = parseNumberIT(input)
    console.assert(Math.abs(got - expected) < 1e-6, `parseNumberIT(${input}) => ${got}, atteso ${expected}`)
  })

  // formatK3 tests
  const kCases = [
    { v: 1234, exp: '1,23k' },
    { v: 12345, exp: '12,3k' },
    { v: 123456, exp: '123k' },
    { v: -9876, exp: '-9,88k' },
    { v: 1234567, exp: '1235k' }
  ]
  kCases.forEach(({ v, exp }) => {
    const got = formatK3(v)
    console.assert(got === exp, `formatK3(${v}) => ${got}, atteso ${exp}`)
  })

  // formatEuroK3 tests
  console.assert(formatEuroK3(0) === '€0k', `formatEuroK3(0) => ${formatEuroK3(0)} atteso €0k`)
  console.assert(formatEuroK3(1500) === '€1,5k', `formatEuroK3(1500) => ${formatEuroK3(1500)} atteso €1,5k`)
  console.assert(formatEuroK3(12345) === '€12,3k', `formatEuroK3(12345) => ${formatEuroK3(12345)} atteso €12,3k`)
  
  // growthPct tests
  console.assert(growthPct(200, 100) === '100.0', `growthPct(200,100) => ${growthPct(200, 100)} atteso 100.0`)
}

// ==================== COMPONENTE PRINCIPALE ====================
export default function DashboardCarabotCSV() {
  const [darkMode, setDarkMode] = useState(false)
  const [selectedProvince, setSelectedProvince] = useState<'all' | ProvinciaCode>('all')
  const [showTerritoryPopup, setShowTerritoryPopup] = useState(false)
  const [data, setData] = useState<CsvState | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const lastUpdateRef = useRef<Date | null>(null)

  // Auto-update + unit tests (una volta)
  useEffect(() => {
    let timer: any
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const cacheBuster = `?t=${Date.now()}&r=${Math.random()}`
        const res = await fetch(`./631.00238_CARABOT-NATALINO.csv${cacheBuster}`, {
          method: 'GET',
          cache: 'no-cache',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
          },
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const text = await res.text()
        if (!text || !text.includes('CARABOT NATALINO')) throw new Error('CSV non valido o vuoto')
        const parsed = parseCsvText(text)
        if (!parsed) throw new Error('Parsing CSV fallito')
        setData(parsed)
        lastUpdateRef.current = new Date()
      } catch (e: any) {
        setError(e?.message || 'Errore sconosciuto')
      } finally {
        setLoading(false)
      }
    }

    // tests
    try { runUnitTests() } catch {}

    load()
    timer = setInterval(load, 2 * 60 * 1000) // 2 minuti
    return () => clearInterval(timer)
  }, [])

  // Dati derivati
  const provinceCards = useMemo(() => {
    if (!data) return [] as { code: ProvinciaCode; label: string; value: number; clienti: number; color: string }[]
    return [
      {
        code: 'all',
        label: 'Tutte le Province',
        value: data.generale.annoCorrente,
        clienti: data.generale.clienti,
        color: '#3b82f6',
      },
      {
        code: 'LT',
        label: 'Latina (LT)',
        value: data.latina.annoCorrente,
        clienti: data.latina.clientiCorrente,
        color: getProvinceColor('LT').hex,
      },
      {
        code: 'RM',
        label: 'Roma (RM)',
        value: data.roma.annoCorrente,
        clienti: data.roma.clienti,
        color: getProvinceColor('RM').hex,
      },
    ]
  }, [data])

  const currentTotals = useMemo(() => {
    if (!data) return null
    if (selectedProvince === 'all') {
      return {
        annoPrecedente: data.generale.annoPrecedente,
        annoCorrente: data.generale.annoCorrente,
        obiettivo: data.latina.obiettivo, // a livello generale usiamo obiettivo LT se presente
        percentualeObiettivo: data.latina.percentualeObiettivo,
        clientiTotali: data.generale.clienti,
        clientiObiettivoTotale: data.latina.obiettivoClienti,
      }
    }
    if (selectedProvince === 'LT') {
      return {
        annoPrecedente: data.latina.annoPrecedente,
        annoCorrente: data.latina.annoCorrente,
        obiettivo: data.latina.obiettivo,
        percentualeObiettivo: data.latina.percentualeObiettivo,
        clientiTotali: data.latina.clientiCorrente,
        clientiObiettivoTotale: data.latina.obiettivoClienti,
      }
    }
    // RM
    return {
      annoPrecedente: 0,
      annoCorrente: data.roma.annoCorrente,
      obiettivo: null as number | null,
      percentualeObiettivo: null as number | null,
      clientiTotali: data.roma.clienti,
      clientiObiettivoTotale: null as number | null,
    }
  }, [data, selectedProvince])

  const comparisonData = useMemo(() => {
    if (!data) return [] as any[]
    return [
      { provincia: 'LT', '2024': data.latina.annoPrecedente, '2025': data.latina.annoCorrente },
      { provincia: 'RM', '2024': 0, '2025': data.roma.annoCorrente },
    ]
  }, [data])

  const clientiDettaglio = useMemo(() => {
    if (!data) return [] as any[]
    return [
      { provincia: 'LT', clienti: data.latina.clientiCorrente, clienti2024: data.latina.clientiPrecedenti, fatturato: data.latina.annoCorrente },
      { provincia: 'RM', clienti: data.roma.clienti, clienti2024: 0, fatturato: data.roma.annoCorrente },
    ]
  }, [data])

  const categorie = useMemo(() => {
    if (!data) return [] as { categoria: string; importo: number; province: Record<string, number> }[]
    const agg: Record<string, { importo: number; province: Record<string, number> }> = {}
    data.vendite.forEach((v) => {
      if (!agg[v.categoria]) agg[v.categoria] = { importo: 0, province: {} }
      agg[v.categoria].importo += v.fatturato
      agg[v.categoria].province[v.provincia] = (agg[v.categoria].province[v.provincia] || 0) + 1
    })
    return Object.entries(agg)
      .map(([categoria, { importo, province }]) => ({ categoria, importo, province }))
      .sort((a, b) => b.importo - a.importo)
  }, [data])

  // ==================== RENDER ====================
  return (
    <div className={`min-h-screen transition-all duration-500 ${darkMode ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'}`}>
      <div className="relative max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* SFONDI DECORATIVI */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute top-0 left-0 w-96 h-96 ${darkMode ? 'bg-purple-500/10' : 'bg-blue-300/20'} rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2`}></div>
          <div className={`absolute top-1/2 right-0 w-80 h-80 ${darkMode ? 'bg-indigo-500/10' : 'bg-indigo-300/30'} rounded-full blur-3xl translate-x-1/2`}></div>
          <div className={`absolute bottom-0 left-1/3 w-72 h-72 ${darkMode ? 'bg-blue-500/10' : 'bg-purple-300/25'} rounded-full blur-3xl translate-y-1/2`}></div>
        </div>

        {/* HEADER */}
        <div className={`mb-8 relative z-10`}>
          <div className={`${darkMode ? 'bg-slate-800/90 border-slate-700/60' : 'bg-white/95 border-gray-200/40'} backdrop-blur-3xl rounded-2xl border shadow-xl`}>
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>CARABOT NATALINO</h1>
                  <p className={`${darkMode ? 'text-slate-400' : 'text-gray-600'} text-lg`}>Dashboard Performance Vendite (CSV Live)</p>
                </div>
                <button onClick={() => setDarkMode((v) => !v)} className={`p-3 rounded-xl transition-all ${darkMode ? 'bg-orange-500 text-white' : 'bg-gray-800 text-white'} hover:scale-105`}>
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${darkMode ? 'text-slate-500' : 'text-gray-500'}`}>ID:</span>
                  <code className={`px-2 py-1 rounded text-sm font-mono ${darkMode ? 'bg-slate-700 text-white' : 'bg-gray-100 text-gray-800'}`}>631.00238</code>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className={`w-4 h-4 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`} />
                  <span className={`${darkMode ? 'text-slate-300' : 'text-gray-700'} font-medium`}>Anno 2025</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${error ? 'bg-red-500' : loading ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                  <span className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>{error ? 'Errore CSV' : loading ? 'Aggiornamento…' : 'Online'}</span>
                  {lastUpdateRef.current && !loading && (
                    <span className={`text-xs ${darkMode ? 'text-slate-500' : 'text-gray-500'} ml-2`}>
                      (agg. {lastUpdateRef.current.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })})
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className={`border-t ${darkMode ? 'border-slate-700/50' : 'border-gray-200/50'} px-4 sm:px-8 py-4 sm:py-6`}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <h2 className={`text-xs sm:text-sm font-bold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-gray-600'} mb-2`}>Filtro Territorio</h2>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedProvince === 'all' ? 'Tutte le Province' : getProvinceName(selectedProvince)}</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowTerritoryPopup(true)}
                  className={cn(
                    'flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 hover:scale-105 shadow-sm border bg-blue-600 hover:bg-blue-700 text-white border-blue-500 shadow-blue-600/20',
                  )}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  <span>Selezione Provincia</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* KPI CARDS */}
        {data && currentTotals && (
          <div className={`grid gap-5 mb-8 relative z-10 ${currentTotals.obiettivo && currentTotals.clientiObiettivoTotale ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4' : currentTotals.obiettivo || currentTotals.clientiObiettivoTotale ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`}>
            {/* FATTURATO */}
            <div className="transform transition-all duration-700">
              <div className={`${darkMode ? 'bg-slate-800/60 border-slate-600/50' : 'bg-white/80 border-white/90'} backdrop-blur-3xl rounded-3xl p-6 lg:p-8 border-2 h-full flex flex-col shadow-xl`}>
                <div className="flex items-start justify-between mb-4 flex-1">
                  <div>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm font-medium mb-2`}>Fatturato 2025</p>
                    <p className={`text-3xl lg:text-4xl font-black ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{formatEuroK3(currentTotals.annoCorrente)}</p>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${darkMode ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-700'}`}>
                    <ChevronUp className="w-4 h-4" />
                    <span className="text-sm font-bold">+{growthPct(currentTotals.annoCorrente, currentTotals.annoPrecedente)}%</span>
                  </div>
                </div>
                <div className={`flex items-center gap-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-auto`}>
                  <span className="text-sm">vs 2024:</span>
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{formatEuroK3(currentTotals.annoPrecedente)}</span>
                </div>
              </div>
            </div>

            {/* OBIETTIVO */}
            {currentTotals.obiettivo && (
              <div className="transform transition-all duration-700">
                <div className={`${darkMode ? 'bg-slate-800/70 border-slate-700/60' : 'bg-white/85 border-white/95'} backdrop-blur-3xl rounded-3xl p-6 lg:p-8 border shadow-xl h-full flex flex-col`}>
                  <div className="flex items-start justify-between mb-4 flex-1">
                    <div>
                      <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm font-medium mb-2`}>Obiettivo 2025</p>
                      <p className={`text-3xl lg:text-4xl font-black ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{formatEuroK3(currentTotals.obiettivo as number)}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-2xl lg:text-3xl font-black ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{currentTotals.percentualeObiettivo}%</span>
                    </div>
                  </div>
                  <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-full h-3 mb-3`}>
                    <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-1000" style={{ width: `${currentTotals.percentualeObiettivo}%` }}></div>
                  </div>
                  <div className={`flex items-center justify-between ${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-auto`}>
                    <span className="text-sm">Da raggiungere:</span>
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{formatEuroK3(((currentTotals.obiettivo || 0) as number) - currentTotals.annoCorrente)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* PERFORMANCE PROVINCIA */}
            <div className="transform transition-all duration-700">
              <div className={`${darkMode ? 'bg-slate-800/70 border-slate-700/60' : 'bg-white/85 border-white/95'} backdrop-blur-3xl rounded-3xl p-6 lg:p-8 border shadow-xl h-full flex flex-col`}>
                <div className="flex items-start justify-between mb-4 flex-1">
                  <div>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm font-medium mb-2`}>{selectedProvince === 'all' ? 'Top Performance' : 'Performance'}</p>
                    <p className={`text-3xl lg:text-4xl font-black ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{selectedProvince === 'all' ? 'LT' : selectedProvince}</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>Provincia {getProvinceName(selectedProvince === 'all' ? 'LT' : selectedProvince)}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xl lg:text-2xl font-black ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>+{(() => {
                      if (!data) return '0.0'
                      const src = selectedProvince === 'LT' || selectedProvince === 'all' ? data.latina : (data.roma as any)
                      return growthPct(src.annoCorrente, (src as any).annoPrecedente || 0)
                    })()}%</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>crescita totale</p>
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mt-1`}>{formatEuroK3(selectedProvince === 'RM' ? data?.roma.annoCorrente || 0 : data?.latina.annoCorrente || 0)}</p>
                  </div>
                </div>
                <div className="mt-2 p-3 rounded-xl bg-gradient-to-r from-cyan-500/10 to-cyan-600/10 border border-cyan-500/20 text-xs">
                  <span className="font-semibold mr-1">Incremento YoY:</span>
                  {(() => {
                    if (!data) return '€0k'
                    const src = selectedProvince === 'RM' ? { c: data.roma.annoCorrente, p: 0 } : { c: data.latina.annoCorrente, p: data.latina.annoPrecedente }
                    return formatEuroK3(src.c - src.p)
                  })()}
                </div>
              </div>
            </div>

            {/* CLIENTI */}
            {currentTotals.clientiObiettivoTotale && (
              <div className="transform transition-all duration-700">
                <div className={`${darkMode ? 'bg-slate-800/70 border-slate-700/60' : 'bg-white/85 border-white/95'} backdrop-blur-3xl rounded-3xl p-6 lg:p-8 border shadow-xl h-full flex flex-col`}>
                  <div className="flex items-start justify-between mb-4 flex-1">
                    <div>
                      <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm font-medium mb-2`}>Clienti Attivi</p>
                      <p className={`text-3xl lg:text-4xl font-black ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{currentTotals.clientiTotali}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xl lg:text-2xl font-black ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{Math.round(((currentTotals.clientiTotali || 0) / (currentTotals.clientiObiettivoTotale || 1)) * 100)}%</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>raggiunto</p>
                    </div>
                  </div>
                  <div className={`flex items-center justify-between ${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-auto`}>
                    <span className="text-sm">Obiettivo:</span>
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{currentTotals.clientiObiettivoTotale}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* GRAFICI */}
        {data && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8 relative z-10">
            {/* Confronto Province */}
            <div className="transform transition-all duration-700">
              <div className={`${darkMode ? 'bg-slate-800/60 border-slate-700/50' : 'bg-white/75 border-white/90'} backdrop-blur-3xl rounded-3xl p-6 lg:p-8 border shadow-xl`}>
                <h3 className={`text-lg lg:text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'} mb-4 lg:mb-6`}>Confronto Province</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={comparisonData}>
                    <CartesianGrid strokeDasharray="0" stroke={darkMode ? '#374151' : '#f3f4f6'} vertical={false} />
                    <XAxis dataKey="provincia" axisLine={false} tickLine={false} tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }} tickFormatter={(v) => formatEuroK3(Number(v))} />
                    <Tooltip formatter={(value) => [formatEuroK3(Number(value)), 'Fatturato']} />
                    <Bar dataKey="2024" fill={darkMode ? '#6b7280' : '#cbd5e1'} radius={[8, 8, 0, 0]} />
                    <Bar dataKey="2025" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Confronto Clienti per Provincia */}
            <div className="transform transition-all duration-700">
              <div className={`${darkMode ? 'bg-slate-800/60 border-slate-700/50' : 'bg-white/75 border-white/90'} backdrop-blur-3xl rounded-3xl p-6 lg:p-8 border shadow-xl`}>
                <h3 className={`text-lg lg:text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'} mb-4 lg:mb-6`}>Confronto Clienti</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={clientiDettaglio}>
                    <CartesianGrid strokeDasharray="0" stroke={darkMode ? '#374151' : '#f3f4f6'} vertical={false} />
                    <XAxis dataKey="provincia" axisLine={false} tickLine={false} tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }} />
                    <Tooltip formatter={(value: any, name: any) => [value, name === 'clienti' ? 'Clienti 2025' : 'Clienti 2024']} />
                    <Bar dataKey="clienti2024" fill={darkMode ? '#6b7280' : '#cbd5e1'} radius={[8, 8, 0, 0]} />
                    <Bar dataKey="clienti" fill="#06b6d4" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* MIX PRODOTTI + TOP VENDITE */}
        {data && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8 relative z-10">
            {/* MIX */}
            <div className="transform transition-all duration-700">
              <div className={`${darkMode ? 'bg-slate-800/60 border-slate-700/50' : 'bg-white/75 border-white/90'} backdrop-blur-3xl rounded-3xl p-6 lg:p-8 border shadow-xl`}>
                <h3 className={`text-lg lg:text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'} mb-4 lg:mb-6`}>Mix Prodotti</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      {(() => {
                        const top2 = categorie.slice(0, 2)
                        const altriTot = Math.max(0, categorie.slice(2).reduce((s, c) => s + c.importo, 0))
                        const pie = [
                          ...top2.map((c, i) => ({ name: c.categoria, value: c.importo, color: i === 0 ? '#3b82f6' : '#8b5cf6' })),
                          { name: 'Altri', value: altriTot, color: '#6b7280' },
                        ]
                        return (
                          <Pie data={pie} cx="50%" cy="50%" innerRadius={50} outerRadius={110} paddingAngle={4} dataKey="value">
                            {pie.map((p, i) => (
                              <Cell key={i} fill={p.color} />
                            ))}
                          </Pie>
                        )
                      })()}
                      <Tooltip formatter={(v) => [formatEuroK3(Number(v)), 'Fatturato']} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-3">
                    {categorie.slice(0, 3).map((c) => (
                      <div key={c.categoria} className={`${darkMode ? 'bg-slate-700/30 border-slate-600/40' : 'bg-gray-50 border-gray-200'} p-3 rounded-xl border`}>
                        <div className="flex items-center justify-between">
                          <span className={`font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{c.categoria}</span>
                          <span className={`font-black ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>{formatEuroK3(c.importo)}</span>
                        </div>
                        <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{Object.keys(c.province).length} province • {Object.values(c.province).reduce((a, b) => a + b, 0)} clienti</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* TOP VENDITE */}
            <div className="transform transition-all duration-700">
              <div className={`${darkMode ? 'bg-slate-800/60 border-slate-700/50' : 'bg-white/75 border-white/90'} backdrop-blur-3xl rounded-3xl p-6 lg:p-8 border shadow-xl`}>
                <h3 className={`text-lg lg:text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'} mb-4 lg:mb-6`}>Top 10 Vendite per Cliente</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className={`border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                        <th className={`text-left py-3 px-2 lg:px-4 text-xs font-bold ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase`}>Prov.</th>
                        <th className={`text-left py-3 px-2 lg:px-4 text-xs font-bold ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase`}>Cliente</th>
                        <th className={`text-left py-3 px-2 lg:px-4 text-xs font-bold ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase`}>Categoria</th>
                        <th className={`text-right py-3 px-2 lg:px-4 text-xs font-bold ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase`}>Fatturato</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.vendite.map((v, i) => (
                        <tr key={i} className={`border-b ${darkMode ? 'border-gray-700 hover:bg-gray-700/30' : 'border-gray-100 hover:bg-gray-50/50'} transition-all duration-300`}>
                          <td className="py-3 px-2 lg:px-4">
                            <span className="px-2 py-1 rounded-full text-xs font-bold" style={{ background: getProvinceColor(v.provincia).hex + '22', color: getProvinceColor(v.provincia).hex }}>
                              {v.provincia}
                            </span>
                          </td>
                          <td className={`${darkMode ? 'text-gray-200' : 'text-gray-800'} font-medium text-xs lg:text-sm py-3 px-2 lg:px-4`}>
                            {v.cliente.length > 22 ? v.cliente.slice(0, 22) + '…' : v.cliente}
                          </td>
                          <td className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-xs lg:text-sm py-3 px-2 lg:px-4`}>{v.categoria}</td>
                          <td className={`text-right font-bold text-xs lg:text-sm ${darkMode ? 'text-gray-100' : 'text-gray-900'} py-3 px-2 lg:px-4`}>{formatEuroK3(v.fatturato)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ERRORE */}
        {error && (
          <div className="max-w-3xl mx-auto mb-8">
            <div className="p-4 rounded-xl border bg-red-50 border-red-200 text-red-700">⚠️ {error}</div>
          </div>
        )}
      </div>

      {/* POPUP SELEZIONE TERRITORIO */}
      {showTerritoryPopup && data && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? 'bg-slate-800/95 border-slate-700/70' : 'bg-white/95 border-gray-200/70'} backdrop-blur-xl rounded-2xl border shadow-2xl w-full max-w-md mx-4 max-h-[85vh] overflow-hidden`}>
            <div className={`px-6 py-5 border-b ${darkMode ? 'border-slate-700/50' : 'border-gray-200/50'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Seleziona Provincia</h3>
                  <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-500'} mt-1`}>Scegli il territorio da visualizzare</p>
                </div>
                <button onClick={() => setShowTerritoryPopup(false)} className={cn('p-2 rounded-lg transition-colors hover:scale-105', darkMode ? 'hover:bg-slate-700 text-slate-400 hover:text-slate-200' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700')}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-3 max-h-96 overflow-y-auto">
              {provinceCards.map((p) => (
                <button
                  key={p.code}
                  onClick={() => { setSelectedProvince(p.code as any); setShowTerritoryPopup(false) }}
                  className={cn(
                    'w-full p-4 rounded-xl transition-all duration-200 border-2 text-left group',
                    selectedProvince === p.code
                      ? 'bg-blue-600 border-blue-500 text-white shadow-lg scale-[1.02]'
                      : (darkMode
                          ? 'bg-slate-700/30 border-slate-600/40 text-slate-200 hover:bg-slate-700/50 hover:border-slate-500/60'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300'),
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        'relative w-12 h-12 rounded-xl flex items-center justify-center transition-all',
                        selectedProvince === p.code
                          ? 'bg-white/20'
                          : (darkMode ? 'bg-blue-500/20 group-hover:bg-blue-500/30' : 'bg-blue-100 group-hover:bg-blue-200'),
                      )}
                    >
                      <svg
                        className={cn('w-6 h-6', selectedProvince === p.code ? 'text-white' : (darkMode ? 'text-blue-400' : 'text-blue-600'))}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-base">{p.label}</p>
                          <p className={cn('text-sm', selectedProvince === p.code ? 'text-blue-100' : (darkMode ? 'text-slate-400' : 'text-gray-500'))}>{formatEuroK3(p.value)} • {p.clienti} clienti</p>
                        </div>
                        <div className={cn('w-5 h-5 rounded-full border-2 flex items-center justify-center', selectedProvince === p.code ? 'border-white' : (darkMode ? 'border-slate-500' : 'border-gray-400'))}>
                          {selectedProvince === p.code && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div className={`px-6 py-4 border-t ${darkMode ? 'border-slate-700/50' : 'border-gray-200/50'}`}>
              <button onClick={() => setShowTerritoryPopup(false)} className={cn('w-full py-2.5 px-4 rounded-lg font-medium text-sm transition-colors', darkMode ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700')}>Annulla</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
