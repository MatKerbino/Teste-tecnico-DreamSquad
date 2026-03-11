import { InvoiceStats as Stats } from '../_types'

interface Props {
    stats: Stats
}

export function InvoiceStats({ stats }: Props) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
                { label: 'Total Gerado', value: stats.total, color: 'text-white' },
                { label: 'Recebido', value: stats.paid, color: 'text-emerald-400' },
                { label: 'Pendente', value: stats.pending, color: 'text-amber-400' },
            ].map(({ label, value, color }) => (
                <div key={label} className="card group">
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-2">{label}</p>
                    <p className={`text-3xl font-black mt-1 ${color} drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]`}>
                        R$ {value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <div className="mt-4 h-1 w-0 bg-brand-500 transition-all duration-500 group-hover:w-full rounded-full" />
                </div>
            ))}
        </div>
    )
}
