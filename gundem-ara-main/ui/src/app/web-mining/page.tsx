'use client'

import { useState } from 'react'
import axios from 'axios'
import Link from 'next/link'

type SearchResult = {
  doc_id: number
  score: number
  title: string
  url: string
}

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [alpha, setAlpha] = useState(0.6)
  const [beta, setBeta] = useState(0.3)
  const [gamma, setGamma] = useState(0.1)
  const [results, setResults] = useState<SearchResult[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (page = 1) => {
    if (Math.abs(alpha + beta + gamma - 1.0) > 1e-5) {
      setError('α + β + γ toplamı 1 olmalıdır.')
      return
    }

    setLoading(true)
    setError('')
    try {
      const res = await axios.get('http://localhost:3001/advanced-search', {
        params: { query, alpha, beta, gamma, page }
      })

      setResults(res.data.results)
      setCurrentPage(res.data.pagination.current_page)
      setTotalPages(res.data.pagination.total_pages)
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Bir hata oluştu')
      setResults([])
    }
    setLoading(false)
  }

  const handleNext = () => {
    if (currentPage < totalPages) handleSearch(currentPage + 1)
  }

  const handlePrev = () => {
    if (currentPage > 1) handleSearch(currentPage - 1)
  }

  const Logo = ({ size = 'normal' }: { size?: 'normal' | 'large' }) => (
    <div className={`font-black tracking-tight select-none ${size === 'large' ? 'text-5xl mb-3' : 'text-2xl'}`}>
      <span className="text-sky-500">Gündem</span>
      <span className="text-slate-800">Radar</span>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col bg-[#F7FAFF] text-slate-800 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-80 bg-gradient-to-b from-sky-100/80 to-transparent pointer-events-none" />
      <div className="absolute top-24 right-16 w-72 h-72 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-24 w-72 h-72 bg-cyan-200/40 rounded-full blur-3xl pointer-events-none" />

      {results.length > 0 && (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-6">
              <a
                href="/web-mining"
                onClick={(e) => {
                  e.preventDefault()
                  setResults([])
                  setQuery('')
                }}
                className="hover:opacity-80 transition-opacity"
              >
                <Logo />
              </a>

              <div className="flex-1 max-w-3xl relative group">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="block w-full pl-5 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:bg-white transition-all shadow-sm"
                  placeholder="Gelişmiş arama..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(1)}
                />
                <button
                  onClick={() => handleSearch(1)}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition shadow-sm"
                >
                  {loading ? '...' : '→'}
                </button>
              </div>

              <Link href="/" className="text-sm font-medium text-slate-500 hover:text-sky-600 px-4 py-2 rounded-full hover:bg-sky-50 transition">
                Ana Sayfa
              </Link>
            </div>
          </div>
        </header>
      )}

      <main className="flex-1 flex flex-col relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {results.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center -mt-10">
            <div className="absolute top-6 right-6">
              <Link href="/" className="text-sm font-medium text-slate-500 hover:text-sky-600 px-4 py-2 rounded-full bg-white/70 border border-slate-200 hover:shadow-sm transition">
                Ana Sayfa
              </Link>
            </div>

            <div className="w-full max-w-4xl px-4 flex flex-col items-center space-y-8">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-sky-700 text-sm border border-sky-100 shadow-sm mb-6">
                  Web Mining Analysis
                </div>
                <Logo size="large" />
                <h1 className="text-4xl lg:text-6xl font-black text-slate-900 leading-tight">
                  Hibrit arama <br />
                  <span className="bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 bg-clip-text text-transparent">
                    analiz paneli.
                  </span>
                </h1>
                <p className="text-slate-500 mt-5 max-w-2xl mx-auto">
                  BM25, PageRank ve HITS ağırlıklarını değiştirerek haber sonuçlarının sıralamasını analiz edin.
                </p>
              </div>

              <div className="w-full bg-white p-8 rounded-[2rem] shadow-xl shadow-sky-100/60 border border-slate-200">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="block w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:bg-white transition"
                  placeholder="Analiz etmek istediğiniz sorguyu yazın..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(1)}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
                  {[
                    { label: 'BM25 Alpha', value: alpha, setter: setAlpha, box: 'bg-sky-50 border-sky-100 text-sky-700' },
                    { label: 'PageRank Beta', value: beta, setter: setBeta, box: 'bg-indigo-50 border-indigo-100 text-indigo-700' },
                    { label: 'HITS Gamma', value: gamma, setter: setGamma, box: 'bg-violet-50 border-violet-100 text-violet-700' }
                  ].map((item, idx) => (
                    <div key={idx} className={`p-4 rounded-2xl border ${item.box}`}>
                      <label className="block text-sm font-bold mb-2">{item.label}</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="1"
                        value={item.value}
                        onChange={(e) => item.setter(parseFloat(e.target.value))}
                        className="w-full p-3 bg-white border border-white rounded-xl outline-none text-slate-700 font-mono text-sm focus:ring-2 focus:ring-sky-200"
                      />
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleSearch(1)}
                  className="w-full bg-sky-500 text-white py-4 rounded-2xl font-bold hover:bg-sky-600 transition shadow-lg shadow-sky-200 active:scale-[0.99]"
                >
                  {loading ? 'Analiz ediliyor...' : 'Analizi Başlat'}
                </button>

                {error && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm flex items-center justify-center gap-2">
                    {error}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {results.length > 0 && (
          <div className="py-8">
            <div className="max-w-4xl mx-auto space-y-6">
              {results.map((result, index) => (
                <div key={result.doc_id} className="group bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-sky-100/70 hover:border-sky-200 transition">
                  <div className="flex gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-black border border-sky-100">
                      {(currentPage - 1) * 10 + index + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                          SCORE: {result.score.toFixed(4)}
                        </span>
                        <span className="text-xs text-slate-400 truncate">
                          {new URL(result.url).hostname}
                        </span>
                      </div>

                      <a
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xl font-bold text-slate-900 group-hover:text-sky-600 transition block"
                      >
                        {result.title || 'Başlıksız Haber'}
                      </a>

                      <div className="flex gap-4 text-xs text-slate-400 font-mono mt-3">
                        <span>DOC_ID: {result.doc_id}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="max-w-4xl mx-auto mt-10 pb-20">
              <div className="flex justify-center items-center gap-3 bg-white p-2 rounded-full shadow-sm border border-slate-200 w-fit mx-auto">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className="px-5 py-3 rounded-full hover:bg-slate-50 disabled:opacity-30 transition text-slate-600"
                >
                  Önceki
                </button>

                <div className="px-4 text-sm font-medium text-slate-600">
                  <span className="text-sky-600">{currentPage}</span>
                  <span className="mx-1 text-slate-300">/</span>
                  <span>{totalPages}</span>
                </div>

                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className="px-5 py-3 rounded-full hover:bg-slate-50 disabled:opacity-30 transition text-slate-600"
                >
                  Sonraki
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}