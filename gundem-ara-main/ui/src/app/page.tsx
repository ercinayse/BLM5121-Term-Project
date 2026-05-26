'use client'
import {useState} from 'react'
import axios from 'axios'
import Link from 'next/link'

type SearchResult = {
    doc_id: number
    score: number
    title: string
    url: string
}
export default function Home() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<SearchResult[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const handleSearch = async (page = 1) => {
        if (!query.trim()) return setLoading(true)
        setError('')
        try {
            const res = await axios.get('http://localhost:3001/search', {params: {query, page}})
            setResults(res.data.results)
            setCurrentPage(res.data.pagination.current_page)
            setTotalPages(res.data.pagination.total_pages)
        } catch (err: any) {
            setError(err?.response?.data?.error || 'Arama sırasında bir hata oluştu')
            setResults([])
        }
        setLoading(false)
    }
    return (<div className="min-h-screen bg-[#F7FAFF] text-slate-800 flex">
        <aside
            className="hidden lg:flex w-72 min-h-screen bg-white border-r border-slate-200 px-6 py-8 flex-col justify-between shadow-sm">
            <div>
                <div className="mb-12">
                    <div className="text-3xl font-black tracking-tight"><span className="text-sky-500">Gündem</span>
                        <span className="text-slate-800">Radar</span></div>
                    <p className="text-slate-500 text-sm mt-2"> Türkçe haber arama ve sıralama sistemi </p></div>
                <nav className="space-y-3 text-sm">
                    <div
                        className="px-4 py-3 rounded-2xl bg-sky-50 text-sky-700 border border-sky-100 font-semibold"> Haber
                        Arama
                    </div>
                    <div className="px-4 py-3 rounded-2xl text-slate-500 hover:bg-slate-50"> BM25 Ranking</div>
                    <div className="px-4 py-3 rounded-2xl text-slate-500 hover:bg-slate-50"> PageRank</div>
                    <div className="px-4 py-3 rounded-2xl text-slate-500 hover:bg-slate-50"> HITS Authority</div>
                </nav>
            </div>
            <div className="rounded-3xl bg-gradient-to-br from-sky-50 to-indigo-50 border border-sky-100 p-4"><p
                className="text-xs text-slate-500">Web Mining Project</p>          <p
                className="text-lg font-bold text-slate-800">2026</p></div>
        </aside>
        <main className="flex-1 px-6 lg:px-12 py-8 relative overflow-hidden">
            <div
                className="absolute top-0 left-0 right-0 h-80 bg-gradient-to-b from-sky-100/80 to-transparent pointer-events-none"/>
            <div
                className="absolute top-24 right-16 w-72 h-72 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none"/>
            <div
                className="absolute bottom-20 left-24 w-72 h-72 bg-cyan-200/40 rounded-full blur-3xl pointer-events-none"/>
            <section className="max-w-5xl mx-auto relative z-10">
                <div className="mb-10">
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        <div
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-sky-700 text-sm border border-sky-100 shadow-sm">
                            Hybrid Information Retrieval
                        </div>

                        <Link
                            href="/web-mining"
                            className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm border border-indigo-100 hover:bg-indigo-100 transition"
                        >
                            Web Mining Sayfası →
                        </Link>
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-black leading-tight text-slate-900"> Haberleri daha
                        akıllı <br/> <span
                            className="bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 bg-clip-text text-transparent">                keşfedin.              </span>
                    </h1>
                    <p className="text-slate-500 mt-6 max-w-2xl text-lg"> BM25, PageRank ve HITS
                        algoritmalarıyla Türkçe haber içeriklerinde modern ve hibrit bir arama deneyimi. </p></div>
                <div className="bg-white border border-slate-200 rounded-[2rem] p-4 lg:p-6 shadow-xl shadow-sky-100/60">
                    <div className="flex flex-col md:flex-row gap-3"><input value={query}
                                                                            onChange={(e) => setQuery(e.target.value)}
                                                                            onKeyDown={(e) => e.key === 'Enter' && handleSearch(1)}
                                                                            placeholder="Örn: deprem oldu mu, enflasyon oranı, süper lig..."
                                                                            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 placeholder:text-slate-400 outline-none focus:border-sky-400 focus:bg-white transition"/>
                        <button onClick={() => handleSearch(1)}
                                className="px-8 py-4 rounded-2xl bg-sky-500 text-white font-bold hover:bg-sky-600 transition active:scale-95 shadow-lg shadow-sky-200">                {loading ? 'Aranıyor...' : 'Ara'}              </button>
                        <button onClick={() => {
                            setQuery('')
                            setResults([])
                            setCurrentPage(1)
                            setTotalPages(1)
                            setError('')
                        }}
                                className="px-6 py-4 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition"> Temizle
                        </button>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mt-5">
                        <div className="rounded-2xl bg-sky-50 border border-sky-100 p-4"><p
                            className="text-xs text-slate-500">Algorithm</p>                <p
                            className="font-bold text-sky-700">BM25</p></div>
                        <div className="rounded-2xl bg-indigo-50 border border-indigo-100 p-4"><p
                            className="text-xs text-slate-500">Authority</p>                <p
                            className="font-bold text-indigo-700">PageRank</p></div>
                        <div className="rounded-2xl bg-violet-50 border border-violet-100 p-4"><p
                            className="text-xs text-slate-500">Hub Score</p>                <p
                            className="font-bold text-violet-700">HITS</p></div>
                    </div>
                </div>
                {error && (<div
                    className="mt-6 bg-red-50 border border-red-100 text-red-600 px-5 py-4 rounded-2xl">              {error}            </div>)} {results.length > 0 && (
                <section className="mt-10 space-y-4">
                    <div className="flex items-center justify-between"><h2
                        className="text-xl font-bold text-slate-900">Arama Sonuçları</h2>                <p
                        className="text-sm text-slate-500"> Sayfa {currentPage} / {totalPages}                </p></div>
                    {results.map((result, index) => (
                        <a key={result.doc_id} href={result.url} target="_blank" rel="noopener noreferrer"
                           className="block group rounded-3xl bg-white border border-slate-200 p-6 hover:border-sky-200 hover:shadow-xl hover:shadow-sky-100/70 transition">
                            <div className="flex gap-5">
                                <div
                                    className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-black border border-sky-100">                      {(currentPage - 1) * 10 + index + 1}                    </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2"><span
                                        className="text-xs px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">                          {(result.score * 100).toFixed(1)}% match                        </span>
                                        <span className="text-xs text-slate-400">
  Doc ID: {result.doc_id}
</span>
                                        <span
                                            className="text-xs text-slate-400 truncate">                          {new URL(result.url).hostname}                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-600 transition">                        {result.title || 'Başlıksız Haber'}                      </h3>
                                    <p className="text-slate-500 mt-2 text-sm line-clamp-2"> Bu haber sorgunuzla yüksek
                                        benzerlik göstermektedir. Detayları görmek için kaynağa gidebilirsiniz. </p>
                                </div>
                            </div>
                        </a>))}
                    <div className="flex items-center justify-center gap-4 pt-6 pb-10">
                        <button onClick={() => currentPage > 1 && handleSearch(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-5 py-3 rounded-2xl bg-white border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-50"> Önceki
                        </button>
                        <button onClick={() => currentPage < totalPages && handleSearch(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-5 py-3 rounded-2xl bg-white border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-50"> Sonraki
                        </button>
                    </div>
                </section>)}        </section>
        </main>
    </div>)
}