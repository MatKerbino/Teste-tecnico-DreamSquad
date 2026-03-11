import { UserPlus, CheckCircle2, AlertCircle, Shield, User } from 'lucide-react'

interface Props {
    formData: any
    setFormData: (data: any) => void
    onSubmit: (e: React.FormEvent) => void
    disabled: boolean
    message: { type: 'success' | 'error', text: string } | null
}

export function UserForm({ formData, setFormData, onSubmit, disabled, message }: Props) {
    return (
        <div className={`card glass-panel transition-all duration-500 ${disabled ? 'opacity-40 grayscale pointer-events-none scale-95 origin-left' : 'opacity-100 scale-100'}`}>
            <div className="mb-8">
                <h2 className="text-xl font-black text-white flex items-center gap-3">
                    <div className="bg-brand-500/10 p-2 rounded-xl border border-brand-500/20">
                        <UserPlus size={20} className="text-brand-400" />
                    </div>
                    2. Configurar Acesso
                </h2>
                <p className="text-slate-400 text-xs mt-1 font-medium">Defina as credenciais e o nível de privilégio.</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Nome Completo</label>
                        <input
                            required
                            className="input"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Ex: Jorge Alencar"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">E-mail de Login</label>
                        <input
                            required
                            type="email"
                            className="input"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            placeholder="jorge@empresa.com"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Senha de Acesso</label>
                        <input
                            required
                            type="password"
                            className="input"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            placeholder="••••••••"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Nível de Permissão</label>
                        <div className="relative">
                            <select
                                className="input appearance-none text-slate-100"
                                value={formData.role}
                                onChange={e => setFormData({ ...formData, role: e.target.value })}
                            >
                                <option value="user" className="bg-[#0f172a]">Usuário Operacional</option>
                                <option value="admin" className="bg-[#0f172a]">Administrador Local</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                {formData.role === 'admin' ? <Shield size={16} /> : <User size={16} />}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <button type="submit" className="btn-primary w-full py-4 glow-purple text-base font-black tracking-tight">
                        Provisionar Novo Usuário
                    </button>
                </div>

                {message && (
                    <div className={`flex items-start gap-3 p-4 rounded-2xl text-sm font-medium animate-in slide-in-from-top-4 duration-300 ${message.type === 'success'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                        <div className="shrink-0 mt-0.5">
                            {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                        </div>
                        <p>{message.text}</p>
                    </div>
                )}
            </form>
        </div>
    )
}
