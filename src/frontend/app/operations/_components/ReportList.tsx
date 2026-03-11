import { FileText, RefreshCw, Download, LucideIcon } from 'lucide-react'
import { Report } from '../_types'

interface Props {
    title: string
    icon: LucideIcon
    iconColor: string
    reports: Report[]
    loading: boolean
    onDownload: (r: Report) => void
    onRefresh: () => void
}

export function ReportList({ title, icon: Icon, iconColor, reports, loading, onDownload, onRefresh }: Props) {
    const formatSize = (bytes: number) => {
        if (!bytes) return '0 B'
        const k = 1024
        const sizes = ['B', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
    }

    return (
        <div className="card glass-panel h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-black text-white flex items-center gap-3">
                    <div className={`bg-${iconColor}-500/10 p-2 rounded-xl border border-${iconColor}-500/20`}>
                        <Icon size={20} className={`text-${iconColor}-400`} />
                    </div>
                    {title}
                </h3>
                <button
                    onClick={onRefresh}
                    disabled={loading}
                    className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-full transition-all active:rotate-180 duration-500"
                >
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar min-h-[200px]">
                {loading ? (
                    [...Array(4)].map((_, i) => (
                        <div key={i} className="h-16 bg-white/5 animate-pulse rounded-2xl border border-white/5" />
                    ))
                ) : reports.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-500 opacity-40">
                        <Icon size={48} className="mb-4" />
                        <p className="font-bold text-xs uppercase tracking-widest">Nenhum arquivo listado</p>
                    </div>
                ) : (
                    reports.map(r => (
                        <div key={r.key} className="group flex items-center justify-between p-4 bg-white/5 hover:bg-white/[0.08] border border-white/5 rounded-2xl transition-all duration-300">
                            <div className="min-w-0 flex-1">
                                <p className="text-sm text-slate-200 font-mono font-bold truncate group-hover:text-white transition-colors">
                                    {r.file_name}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">
                                        {formatSize(r.size || 0)}
                                    </span>
                                    <span className="w-1 h-1 bg-slate-700 rounded-full" />
                                    <span className="text-[10px] font-bold text-slate-500">
                                        {new Date(r.last_modified).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => onDownload(r)}
                                title="Download"
                                className="ml-4 p-3 bg-white/5 text-slate-400 hover:text-brand-400 hover:bg-brand-500/10 rounded-xl transition-all active:scale-90"
                            >
                                <Download size={18} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
