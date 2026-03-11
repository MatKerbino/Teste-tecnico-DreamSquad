import { X, Building2, BadgeDollarSign, Calendar, Save, Check } from 'lucide-react'
import { Subscription, Company, SubscriptionFormData } from '../_types'

interface Props {
    editing: Subscription | null
    companies: Company[]
    form: SubscriptionFormData
    setForm: (f: SubscriptionFormData) => void
    saving: boolean
    error: string
    onClose: () => void
    onSave: (e: React.FormEvent) => void
}

export function SubscriptionModal({ editing, companies, form, setForm, saving, error, onClose, onSave }: Props) {
    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-xl flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
            <div className="w-full max-w-lg relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-brand-600/30 to-indigo-600/30 rounded-[2.5rem] blur-2xl opacity-50" />

                <div className="glass-panel relative p-8 md:p-10 border-brand-500/20 overflow-hidden">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-full transition-all"
                    >
                        <X size={20} />
                    </button>

                    <div className="flex items-center gap-4 mb-10">
                        <div className="p-4 rounded-2xl bg-brand-600/10 border border-brand-600/20">
                            <BadgeDollarSign size={32} className="text-brand-500" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white tracking-tight">
                                {editing ? 'Editar' : 'Nova'} <span className="text-gradient">Assinatura</span>
                            </h2>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
                                Gerenciar Ciclo de Faturamento
                            </p>
                        </div>
                    </div>

                    <form onSubmit={onSave} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Empresa Destino</label>
                            <div className="relative group">
                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-brand-400 transition-colors" />
                                <select
                                    className="input pl-12 appearance-none cursor-pointer text-slate-100"
                                    value={form.target_company_id}
                                    onChange={e => setForm({ ...form, target_company_id: e.target.value })}
                                    required
                                >
                                    <option value="" className="bg-[#0f172a] text-slate-400">Selecione uma empresa...</option>
                                    {companies.map(c => (
                                        <option key={c.id} value={c.id} className="bg-[#0f172a] text-white">
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Valor Mensal (R$)</label>
                                <div className="relative group">
                                    <BadgeDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-brand-400 transition-colors" />
                                    <input
                                        type="number" step="0.01" min="0"
                                        className="input pl-12"
                                        placeholder="0,00"
                                        value={form.amount}
                                        onChange={e => setForm({ ...form, amount: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Dia Vencim.</label>
                                <div className="relative group">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-brand-400 transition-colors" />
                                    <input
                                        type="number" min="1" max="28"
                                        className="input pl-12"
                                        placeholder="10"
                                        value={form.due_day}
                                        onChange={e => setForm({ ...form, due_day: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 cursor-pointer hover:bg-white/[0.08] transition-colors" onClick={() => setForm({ ...form, active: !form.active })}>
                            <div className={`w-10 h-6 rounded-full relative transition-colors duration-300 p-1 ${form.active ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-slate-700/50 border border-slate-600/30'}`}>
                                <div className={`w-4 h-4 rounded-full bg-white shadow-lg shadow-black/50 transition-transform duration-300 ${form.active ? 'translate-x-4' : 'translate-x-0'}`} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-200">Assinatura Ativa</p>
                                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Habilitar faturamento recorrente</p>
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold animate-in shake">
                                {error}
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="btn-secondary w-full sm:flex-1 py-4 text-xs font-black uppercase tracking-widest active:scale-95 transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="btn-primary w-full sm:flex-1 py-4 text-xs font-black uppercase tracking-widest glow-purple active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                {saving ? (
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        {editing ? 'Atualizar' : 'Confirmar'} <Save size={14} />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
