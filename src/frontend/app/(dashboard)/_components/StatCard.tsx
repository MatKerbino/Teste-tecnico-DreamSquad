import Link from 'next/link'
import { LucideIcon } from 'lucide-react'

interface Props {
    icon: LucideIcon
    label: string
    value: string | number
    color: string
    bg: string
    link: string
}

export function StatCard({ icon: Icon, label, value, color, bg, link }: Props) {
    return (
        <Link href={link} className="card glass-panel group hover:border-brand-500/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(124,58,237,0.15)] overflow-hidden relative">
            <div className={`absolute -right-4 -top-4 w-24 h-24 ${bg} blur-[40px] opacity-0 group-hover:opacity-40 transition-opacity duration-500 -z-10`} />

            <div className="flex items-start justify-between relative z-10">
                <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{label}</p>
                    <p className="text-3xl font-black text-white tracking-tight group-hover:text-gradient transition-all duration-500">
                        {value}
                    </p>
                </div>
                <div className={`${bg} p-3.5 rounded-[1.25rem] border border-white/5 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    <Icon className={`${color} w-6 h-6 stroke-[2.5]`} />
                </div>
            </div>

            <div className="mt-6 flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-500">
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest group-hover:text-brand-500 transition-colors">Ver Detalhes</span>
                <div className="h-px flex-1 bg-white/5 group-hover:bg-brand-500/20 transition-colors" />
            </div>
        </Link>
    )
}
