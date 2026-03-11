import { Building, Search, CheckCircle2 } from 'lucide-react'
import { AdminCompany } from '../_types'

interface Props {
    companies: AdminCompany[]
    loading: boolean
    selectedId: string
    searchTerm: string
    onSelect: (id: string) => void
    onSearchChange: (term: string) => void
}

export function CompanySelector({ companies, loading, selectedId, searchTerm, onSelect, onSearchChange }: Props) {
    return (
        <div className="card glass-panel h-full flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-xl font-black text-white flex items-center gap-3">
                        <div className="bg-brand-500/10 p-2 rounded-xl border border-brand-500/20">
                            <Building size={20} className="text-brand-400" />
                        </div>
                        1. Selecionar Empresa
                    </h2>
                    <p className="text-slate-400 text-xs mt-1 font-medium">Escolha a organização para o novo usuário.</p>
                </div>

                <div className="relative group">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-brand-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Filtrar empresas..."
                        className="bg-white/5 border border-white/10 pl-10 pr-4 py-2 text-sm rounded-xl text-white w-full md:w-64 focus:border-brand-500/50 focus:bg-white/10 transition-all outline-none"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1 min-h-[300px]">
                {loading ? (
                    [...Array(6)].map((_, i) => (
                        <div key={i} className="h-16 bg-white/5 animate-pulse rounded-2xl border border-white/5" />
                    ))
                ) : companies.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                        <Building size={40} className="opacity-20 mb-4" />
                        <p className="font-medium">Nenhuma empresa encontrada</p>
                    </div>
                ) : companies.map(c => (
                    <button
                        key={c.id}
                        onClick={() => onSelect(c.id)}
                        className={`w-full group flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${selectedId === c.id
                                ? 'bg-brand-500/10 border-brand-500/50 shadow-[0_0_20px_rgba(124,58,237,0.1)]'
                                : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/10 hover:bg-white/10'
                            }`}
                    >
                        <div className="text-left">
                            <p className={`font-bold tracking-tight ${selectedId === c.id ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                                {c.name}
                            </p>
                            <p className="text-[10px] font-mono opacity-40 uppercase tracking-tighter">ID: {c.id}</p>
                        </div>
                        {selectedId === c.id && (
                            <div className="bg-brand-500 rounded-full p-1 shadow-[0_0_10px_rgba(124,58,237,0.5)]">
                                <CheckCircle2 className="w-4 h-4 text-white" />
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    )
}
