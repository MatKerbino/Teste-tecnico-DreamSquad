import { RefreshCw, CheckCircle, AlertCircle, LucideIcon } from 'lucide-react'
import { OperationsState } from '../_types'

interface Props {
    title: string
    description: string
    icon: LucideIcon
    iconColor: string
    status: OperationsState
    buttonText: string
    buttonIcon: LucideIcon
    onAction: () => void
    disabled?: boolean
    permissionMessage?: string
    footerText?: string
}

export function OperationCard({
    title,
    description,
    icon: Icon,
    iconColor,
    status,
    buttonText,
    buttonIcon: BIcon,
    onAction,
    disabled,
    permissionMessage,
    footerText
}: Props) {
    return (
        <div className="card glass-panel group relative overflow-hidden h-full flex flex-col">
            <div className="flex items-start gap-5 mb-8">
                <div className={`p-4 rounded-2xl bg-${iconColor}-500/10 border border-${iconColor}-500/20 group-hover:scale-110 transition-transform duration-500`}>
                    <Icon size={28} className={`text-${iconColor}-400 drop-shadow-[0_0_8px_rgba(var(--color-${iconColor}-400),0.5)]`} />
                </div>
                <div>
                    <h2 className="text-xl font-black text-white tracking-tight">{title}</h2>
                    <p className="text-sm text-slate-400 mt-2 font-medium leading-relaxed">
                        {description}
                    </p>
                    {footerText && (
                        <p className="text-[10px] text-slate-500 mt-3 font-bold uppercase tracking-widest bg-white/5 py-1 px-2 rounded-lg inline-block">
                            {footerText}
                        </p>
                    )}
                </div>
            </div>

            <div className="mt-auto space-y-4">
                {!disabled ? (
                    <button
                        onClick={onAction}
                        disabled={status.loading}
                        className={`btn-primary w-full py-4 text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3 active:scale-[0.98] transition-all ${status.loading ? 'opacity-50 cursor-not-allowed' : 'glow-purple'}`}
                    >
                        {status.loading ? (
                            <RefreshCw className="w-5 h-5 animate-spin" />
                        ) : (
                            <BIcon className="w-5 h-5 stroke-[2.5]" />
                        )}
                        {status.loading ? 'Processando...' : buttonText}
                    </button>
                ) : (
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center text-slate-500 text-xs font-bold uppercase tracking-widest">
                        {permissionMessage || 'Permissão insuficiente'}
                    </div>
                )}

                {status.result && (
                    <div className={`p-4 rounded-2xl text-xs font-bold border flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 ${status.error
                        ? 'bg-red-500/10 text-red-400 border-red-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}>
                        <div className="shrink-0 mt-0.5">
                            {status.error ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
                        </div>
                        <span className="leading-normal">{status.result}</span>
                    </div>
                )}
            </div>

            <div className={`absolute -right-8 -bottom-8 w-32 h-32 bg-${iconColor}-500/5 rounded-full blur-3xl -z-10 group-hover:bg-${iconColor}-500/10 transition-all duration-700`} />
        </div>
    )
}
