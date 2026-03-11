import Link from 'next/link'
import { Activity, UserPlus, CreditCard, FileText, Zap } from 'lucide-react'

export function QuickActions() {
    const actions = [
        { href: '/customers/', label: 'Adicionar Cliente', icon: UserPlus, color: 'text-brand-500' },
        { href: '/subscriptions/', label: 'Nova Assinatura', icon: CreditCard, color: 'text-violet-500' },
        { href: '/invoices/', label: 'Ver Faturas', icon: FileText, color: 'text-amber-500' },
        { href: '/operations/', label: 'Rodar Faturamento', icon: Zap, color: 'text-emerald-500' },
    ]

    return (
        <div className="mt-12">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-brand-500/10 border border-brand-500/20">
                    <Activity size={18} className="text-brand-500" />
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">Ações <span className="text-gradient">Rápidas</span></h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {actions.map(({ href, label, icon: Icon, color }) => (
                    <Link key={href} href={href}
                        className="group flex flex-col items-center gap-4 p-6 sm:p-8 bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-brand-500/30 rounded-[2rem] transition-all duration-500 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className={`p-4 rounded-2xl bg-white/5 border border-white/5 group-hover:scale-110 transition-transform duration-500 relative`}>
                            <Icon size={24} className={`${color} stroke-[2.5]`} />
                        </div>
                        <span className="text-xs font-black text-slate-400 group-hover:text-white uppercase tracking-widest transition-colors relative">
                            {label}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    )
}
