import { Edit2, Trash2, CreditCard, Building2, Calendar, BadgeDollarSign } from 'lucide-react'
import { Subscription, Company } from '../_types'

interface Props {
    subscriptions: Subscription[]
    companies: Company[]
    onEdit: (s: Subscription) => void
    onDelete: (id: string) => void
}

export function SubscriptionTable({ subscriptions, companies, onEdit, onDelete }: Props) {
    const getCompanyName = (id: string) => companies.find(c => c.id === id)?.name || id

    return (
        <div className="card glass-panel p-0 overflow-hidden shadow-2xl border-brand-500/10">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5 border-b border-white/5">
                            <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                                <div className="flex items-center gap-2">
                                    <Building2 size={14} className="text-brand-500" />
                                    Empresa Cliente
                                </div>
                            </th>
                            <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                                <div className="flex items-center gap-2">
                                    <BadgeDollarSign size={14} className="text-emerald-500" />
                                    Valor Mensal
                                </div>
                            </th>
                            <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                                <div className="flex items-center gap-2">
                                    <Calendar size={14} className="text-brand-400" />
                                    Vencimento
                                </div>
                            </th>
                            <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Status</th>
                            <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {subscriptions.map((s) => (
                            <tr key={s.id} className="group hover:bg-white/[0.03] transition-all duration-300">
                                <td className="px-6 py-5">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">
                                            {getCompanyName(s.target_company_id)}
                                        </span>
                                        <span className="text-[10px] font-mono text-slate-600 mt-0.5">{s.id}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="text-sm font-black text-emerald-400 font-mono tracking-tight group-hover:drop-shadow-[0_0_8px_rgba(52,211,153,0.3)] transition-all">
                                        R$ {s.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-slate-300">Dia {s.due_day}</span>
                                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">/ mês</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${s.active
                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                                        }`}>
                                        {s.active ? 'Ativo' : 'Pausado'}
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <button
                                            onClick={() => onEdit(s)}
                                            className="p-2.5 bg-white/5 text-slate-400 hover:text-brand-400 hover:bg-brand-500/10 rounded-xl transition-all active:scale-90"
                                            title="Editar"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => onDelete(s.id)}
                                            className="p-2.5 bg-white/5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all active:scale-90"
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
