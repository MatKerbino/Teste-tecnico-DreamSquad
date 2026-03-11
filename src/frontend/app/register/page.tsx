'use client'
import Link from 'next/link'
import { Building2, FileText, Mail, Lock, UserPlus, ArrowLeft, ShieldCheck } from 'lucide-react'
import { useRegister } from './_hooks/useRegister'

export default function RegisterPage() {
    const {
        name,
        setName,
        cnpj,
        onCnpjChange,
        email,
        setEmail,
        password,
        setPassword,
        error,
        loading,
        handleFormSubmit
    } = useRegister()

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-12">
            <div className="absolute top-0 left-0 w-full h-full bg-background -z-20" />
            <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-brand-600/10 rounded-full blur-[120px] -z-10 animate-pulse transition-all duration-[10s]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[100px] -z-10" />

            <div className="w-full max-w-xl relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-brand-600/30 to-indigo-600/30 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                <div className="glass-panel relative p-10 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)] border-brand-500/10">
                    <div className="text-center space-y-4 mb-10">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-brand-600/10 border border-brand-600/20 shadow-[0_0_30px_rgba(124,58,237,0.2)] mb-4">
                            <Building2 className="w-10 h-10 text-brand-500 drop-shadow-[0_0_10px_rgba(124,58,237,0.5)]" />
                        </div>
                        <h1 className="text-4xl font-black text-white tracking-tight">
                            Criar <span className="text-gradient">Empresa</span>
                        </h1>
                        <p className="text-slate-400 font-medium tracking-wide">
                            Inicie o gerenciamento de suas faturas com o nosso sistema
                        </p>
                    </div>

                    <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Razão Social / Nome Fantasia</label>
                            <div className="relative group">
                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-brand-400 transition-colors" />
                                <input
                                    type="text"
                                    className="input pl-12"
                                    placeholder="Minha Empresa LTDA"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">CNPJ</label>
                            <div className="relative group">
                                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-brand-400 transition-colors" />
                                <input
                                    type="text"
                                    className="input pl-12"
                                    placeholder="00.000.000/0001-00"
                                    value={cnpj}
                                    onChange={e => onCnpjChange(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">E-mail Admin</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-brand-400 transition-colors" />
                                <input
                                    type="email"
                                    className="input pl-12"
                                    placeholder="admin@empresa.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Senha de Acesso</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-brand-400 transition-colors" />
                                <input
                                    type="password"
                                    className="input pl-12"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="md:col-span-2 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-bold animate-in shake">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="md:col-span-2 btn-primary py-4 text-base font-black uppercase tracking-widest flex items-center justify-center gap-3 glow-purple transition-all"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Criar Conta <UserPlus className="w-5 h-5 stroke-[2.5]" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 text-sm font-bold text-white/50 hover:text-brand-400 transition-all group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Já possui uma conta ativa? <span className="text-brand-500 underline underline-offset-4 decoration-brand-500/30">Fazer login</span>
                        </Link>
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-center gap-6">
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                            <ShieldCheck size={14} className="text-emerald-500/50" />
                            Dados Encriptados
                        </div>
                        <div className="w-1 h-1 bg-white/10 rounded-full" />
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                            <ShieldCheck size={14} className="text-brand-500/50" />
                            Ambiente AWS
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
