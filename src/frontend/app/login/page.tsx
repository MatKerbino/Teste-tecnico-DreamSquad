'use client'
import { Suspense } from 'react'
import Link from 'next/link'
import { Mail, Lock, LogIn, ArrowRight, ShieldCheck } from 'lucide-react'
import { useLogin } from './_hooks/useLogin'

function LoginForm() {
    const {
        email,
        setEmail,
        password,
        setPassword,
        error,
        loading,
        success,
        handleSubmit
    } = useLogin()

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
            <div className="absolute top-0 left-0 w-full h-full bg-background -z-20" />
            <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-brand-600/10 rounded-full blur-[120px] -z-10 animate-pulse transition-all duration-[10s]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[100px] -z-10" />

            <div className="w-full max-w-lg relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-brand-600/30 to-indigo-600/30 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />

                <div className="glass-panel relative p-10 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)] border-brand-500/10">
                    <div className="text-center space-y-4 mb-10">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-brand-600/10 border border-brand-600/20 shadow-[0_0_30px_rgba(124,58,237,0.2)] mb-4">
                            <ShieldCheck className="w-10 h-10 text-brand-500 drop-shadow-[0_0_10px_rgba(124,58,237,0.5)]" />
                        </div>
                        <h1 className="text-4xl font-black text-white tracking-tight">
                            Billing<span className="text-gradient">Manager</span>
                        </h1>
                        <p className="text-slate-400 font-medium tracking-wide flex items-center justify-center gap-2">
                            Acesso ao Sistema de <span className="text-brand-400 font-bold">Faturamento</span>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Endereço de E-mail</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-brand-400 transition-colors" />
                                <input
                                    type="email"
                                    className="input pl-12"
                                    placeholder="admin@billing.io"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
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
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-bold animate-in shake duration-300">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-sm font-bold animate-in slide-in-from-top-2">
                                {success}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-4 text-base font-black uppercase tracking-widest flex items-center justify-center gap-3 glow-purple"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Autenticar <LogIn className="w-5 h-5 stroke-[2.5]" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 text-center space-y-6">
                        <Link
                            href="/register"
                            className="inline-flex items-center gap-2 text-sm font-bold text-white/50 hover:text-brand-400 transition-all group"
                        >
                            Não possui conta? <span className="text-brand-500 underline underline-offset-4 decoration-brand-500/30">Registrar agora</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <div className="pt-6 border-t border-white/5">
                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-3">Acesso de Demonstração</p>
                            <div className="inline-flex gap-4 p-3 bg-white/5 rounded-2xl border border-white/5 text-[11px] font-mono text-slate-400">
                                <span>admin@billing.io</span>
                                <span className="text-slate-700">|</span>
                                <span>Billing@2026</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
            </div>
        }>
            <LoginForm />
        </Suspense>
    )
}
