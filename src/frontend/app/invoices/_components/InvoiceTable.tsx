import { CheckCircle, Trash2 } from 'lucide-react'
import { Invoice } from '../_types'

interface Props {
    invoices: Invoice[]
    paying: string | null
    getCompanyName: (id: string) => string
    onPay: (inv: Invoice) => void
    onDelete: (id: string) => void
}

export function InvoiceTable({ invoices, paying, getCompanyName, onPay, onDelete }: Props) {
    const statusBadge = (status: string) => {
        const cls = status === 'paid' ? 'badge-paid' : status === 'canceled' ? 'badge-canceled' : 'badge-pending'
        const label = status === 'paid' ? 'Pago' : status === 'canceled' ? 'Cancelado' : 'Pendente'
        return <span className={cls}>{label}</span>
    }

    return (
        <div className="glass-panel overflow-hidden border-white/5">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5 border-b border-white/10">
                            {['Empresa', 'Valor', 'Vencimento', 'Status', 'Criada em', 'Ações'].map(h => (
                                <th key={h} className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {invoices.map(inv => (
                            <tr key={inv.id} className="hover:bg-brand-500/5 transition-colors group">
                                <td className="px-6 py-5">
                                    <div className="font-semibold text-white group-hover:text-brand-300 transition-colors">
                                        {getCompanyName(inv.target_company_id)}
                                    </div>
                                    <div className="text-[10px] text-slate-500 mt-0.5 font-mono">{inv.id.split('-')[0]}</div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="font-bold text-white">
                                        R$ {inv.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </span>
                                </td>
                                <td className="px-6 py-5 text-slate-400 font-medium">
                                    {new Date(inv.due_date).toLocaleDateString('pt-BR')}
                                </td>
                                <td className="px-6 py-5">{statusBadge(inv.status)}</td>
                                <td className="px-6 py-5 text-slate-500 text-xs font-medium">
                                    {new Date(inv.created_at).toLocaleString('pt-BR')}
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        {inv.status === 'pending' && (
                                            <button
                                                onClick={() => onPay(inv)}
                                                disabled={paying === inv.id}
                                                className="btn-primary py-1.5 px-4 text-xs flex items-center gap-2 glow-purple"
                                            >
                                                <CheckCircle size={14} />
                                                {paying === inv.id ? 'Processando...' : 'Pagar'}
                                            </button>
                                        )}
                                        <button
                                            onClick={() => onDelete(inv.id)}
                                            className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                                            title="Excluir Fatura"
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
