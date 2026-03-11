import { Globe, Edit2, Trash2, ExternalLink, Shield } from 'lucide-react'
import { Company } from '../_types'
import { formatDocument } from '@/lib/utils'

interface Props {
    company: Company
    userRole?: string
    onEdit: (c: Company) => void
    onDelete: (id: string) => void
    onImpersonate: (id: string) => void
}

export function CompanyCard({ company, userRole, onEdit, onDelete, onImpersonate }: Props) {
    return (
        <div className="card group hover:scale-[1.02] active:scale-[0.98]">
            <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-400 border border-brand-500/20 group-hover:bg-brand-500/20 group-hover:text-brand-300 transition-all duration-300">
                    <Globe size={24} />
                </div>
                {userRole === 'admin' && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => onEdit(company)}
                            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                            title="Editar Dados"
                        >
                            <Edit2 size={16} />
                        </button>
                        <button
                            onClick={() => onDelete(company.id)}
                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                            title="Excluir Empresa"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                )}
            </div>

            <h3 className="text-xl font-black text-white mb-1 group-hover:text-brand-300 transition-colors tracking-tight">
                {company.name}
            </h3>
            <p className="text-sm font-mono text-slate-500 mb-6 bg-white/5 inline-block px-2 py-0.5 rounded border border-white/5">
                {formatDocument(company.cnpj)}
            </p>

            <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest">
                    <Shield size={14} className="fill-emerald-400/20" />
                    <span>Ativa</span>
                </div>
                {userRole === 'admin' && (
                    <button
                        onClick={() => onImpersonate(company.id)}
                        className="btn-secondary py-1.5 px-4 text-xs flex items-center gap-2 group/btn hover:border-brand-500/50"
                    >
                        <ExternalLink size={14} className="group-hover/btn:scale-110 transition-transform" />
                        Acessar Painel
                    </button>
                )}
            </div>

            <div className="absolute top-2 right-2 text-[8px] font-mono text-slate-700 select-none">
                {company.id.split('-')[0]}
            </div>
        </div>
    )
}
