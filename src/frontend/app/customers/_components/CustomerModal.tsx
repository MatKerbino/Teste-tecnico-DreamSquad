import { X } from 'lucide-react'
import { Customer, Company, CustomerFormData } from '../_types'
import { formatDocument } from '@/lib/utils'

interface Props {
    open: boolean
    editing: Customer | null
    form: CustomerFormData
    companies: Company[]
    saving: boolean
    error: string
    onClose: () => void
    onSave: (e: React.FormEvent) => void
    setForm: (form: CustomerFormData) => void
}

export function CustomerModal({ open, editing, form, companies, saving, error, onClose, onSave, setForm }: Props) {
    if (!open) return null

    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-50 px-4 animate-in fade-in duration-300">
            <div className="glass-panel w-full max-w-lg relative p-8 border-brand-500/20 shadow-[0_0_50px_rgba(124,58,237,0.1)]">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-slate-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all"
                >
                    <X size={20} />
                </button>

                <div className="mb-8">
                    <h2 className="text-2xl font-black text-white tracking-tight">
                        {editing ? 'Editar' : 'Novo'} <span className="text-gradient">Cliente</span>
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">Preencha os dados abaixo para {editing ? 'atualizar' : 'cadastrar'} o cliente B2B.</p>
                </div>

                <form onSubmit={onSave} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Nome Completo</label>
                            <input
                                className="input"
                                placeholder="João Silva"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">E-mail Corporativo</label>
                            <input
                                type="email"
                                className="input"
                                placeholder="joao@empresa.com"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Empresa Vinculada</label>
                        <select
                            className="input appearance-none text-slate-100"
                            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'white\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1em' }}
                            value={form.related_company_id}
                            onChange={e => setForm({ ...form, related_company_id: e.target.value })}
                            required
                        >
                            <option value="" className="bg-[#0f172a] text-slate-400">Selecione uma empresa...</option>
                            {companies.map(c => (
                                <option key={c.id} value={c.id} className="bg-[#0f172a] text-white">{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Documento (CPF / CNPJ)</label>
                        <input
                            className="input"
                            placeholder="000.000.000-00"
                            value={form.document}
                            onChange={e => setForm({ ...form, document: formatDocument(e.target.value) })}
                            required
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium animate-in slide-in-from-top-2">
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button type="button" onClick={onClose} className="btn-secondary w-full sm:flex-1">Cancelar</button>
                        <button type="submit" disabled={saving} className="btn-primary w-full sm:flex-1 glow-purple">
                            {saving ? 'Processando...' : (editing ? 'Salvar Alterações' : 'Cadastrar Cliente')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
