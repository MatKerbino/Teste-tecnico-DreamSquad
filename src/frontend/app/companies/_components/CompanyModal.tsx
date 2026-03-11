import { X, AlertCircle } from 'lucide-react'
import { CompanyFormData } from '../_types'
import { formatDocument } from '@/lib/utils'

interface Props {
    open: boolean
    editingId: string | null
    form: CompanyFormData
    saving: boolean
    error: string
    onClose: () => void
    onSave: (e: React.FormEvent) => void
    setForm: (form: CompanyFormData) => void
}

export function CompanyModal({ open, editingId, form, saving, error, onClose, onSave, setForm }: Props) {
    if (!open) return null

    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-50 px-4 animate-in fade-in duration-300">
            <div className="glass-panel w-full max-w-md relative p-8 border-brand-500/20 shadow-[0_0_50px_rgba(124,58,237,0.1)]">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-slate-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all"
                >
                    <X size={20} />
                </button>

                <div className="mb-8">
                    <h2 className="text-2xl font-black text-white tracking-tight">
                        {editingId ? 'Editar' : 'Nova'} <span className="text-gradient">Empresa</span>
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">
                        {editingId ? 'Atualize os dados da empresa corporativa.' : 'Cadastre uma nova empresa para gestão de faturas.'}
                    </p>
                </div>

                <form onSubmit={onSave} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Nome da Empresa</label>
                        <input
                            className="input"
                            placeholder="Ex: Billing Manager Core"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">CNPJ</label>
                        <input
                            className="input"
                            placeholder="00.000.000/0001-00"
                            value={form.cnpj}
                            onChange={e => setForm({ ...form, cnpj: formatDocument(e.target.value) })}
                            required
                        />
                    </div>

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium flex items-start gap-3 animate-in slide-in-from-top-2">
                            <AlertCircle size={18} className="shrink-0 mt-0.5" />
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button type="button" onClick={onClose} className="btn-secondary w-full sm:flex-1">Cancelar</button>
                        <button type="submit" disabled={saving} className="btn-primary w-full sm:flex-1 glow-purple">
                            {saving ? 'Processando...' : (editingId ? 'Salvar Alterações' : 'Cadastrar Empresa')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
