import { Pencil, Trash2 } from 'lucide-react'
import { Customer } from '../_types'
import { formatDocument } from '@/lib/utils'

interface Props {
    customers: Customer[]
    getCompanyName: (id: string) => string
    onEdit: (c: Customer) => void
    onDelete: (id: string) => void
}

export function CustomerTable({ customers, getCompanyName, onEdit, onDelete }: Props) {
    return (
        <div className="glass-panel overflow-hidden border-white/5">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5 border-b border-white/10">
                            {['Nome', 'Empresa Relacionada', 'Email', 'Documento', 'Ações'].map(h => (
                                <th key={h} className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {customers.map(c => (
                            <tr key={c.id} className="hover:bg-brand-500/5 transition-colors group">
                                <td className="px-6 py-5">
                                    <div className="font-semibold text-white group-hover:text-brand-300 transition-colors">{c.name}</div>
                                    <div className="text-[10px] text-slate-500 mt-0.5 font-mono">{c.id.split('-')[0]}</div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="inline-flex items-center px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-slate-300">
                                        {getCompanyName(c.related_company_id)}
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-slate-400 text-sm font-medium">{c.email}</td>
                                <td className="px-6 py-5">
                                    <span className="text-slate-500 font-mono text-xs bg-white/5 px-2 py-1 rounded border border-white/5">
                                        {formatDocument(c.document)}
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => onEdit(c)}
                                            className="p-2 text-brand-400 hover:text-brand-300 hover:bg-brand-500/10 rounded-xl transition-all"
                                            title="Editar"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            onClick={() => onDelete(c.id)}
                                            className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                                            title="Excluir"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
