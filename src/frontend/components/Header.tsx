'use client'
import { useHeader } from '@/hooks/useHeader'
import { LogOut, Shield, Crown, Menu, X } from 'lucide-react'
import NextLink from 'next/link'

export default function Header() {
    const {
        company,
        user,
        isMaster,
        isAdmin,
        hasMasterSession,
        isMenuOpen,
        setIsMenuOpen,
        navItems,
        pathname,
        logout,
        stopImpersonation
    } = useHeader()

    return (
        <header className="sticky top-0 z-50 w-full bg-background/60 backdrop-blur-xl border-b border-white/5">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-10">
                    <NextLink href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white font-black text-lg shadow-[0_0_20px_rgba(124,58,237,0.3)] group-hover:scale-110 transition-transform duration-300">D</div>
                        <div className="flex flex-col">
                            <span className="font-black text-white leading-tight tracking-tight uppercase text-xs">
                                {company ? company.name : 'Billing Manager'}
                            </span>
                            {company && (
                                <span className="text-[9px] text-slate-500 font-mono tracking-tighter opacity-60">
                                    CORE SYSTEM v2.0
                                </span>
                            )}
                        </div>
                    </NextLink>

                    <nav className="hidden lg:flex items-center gap-1">
                        {navItems.map(({ href, label, icon: Icon }) => {
                            const isActive = pathname === href
                            return (
                                <NextLink key={href} href={href}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 group ${isActive
                                        ? 'text-brand-400 bg-brand-500/10 border border-brand-500/20'
                                        : 'text-slate-500 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10'
                                        }`}>
                                    <Icon size={14} className={isActive ? 'text-brand-500' : 'group-hover:text-brand-500 transition-colors'} />
                                    {label}
                                </NextLink>
                            )
                        })}
                    </nav>
                </div>

                <div className="flex items-center gap-6">
                    {hasMasterSession && (
                        <button
                            onClick={stopImpersonation}
                            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
                        >
                            <Shield size={14} className="stroke-[2.5]" />
                            Exit Impersonation
                        </button>
                    )}

                    {user && (
                        <div className="hidden md:flex flex-col items-end mr-2">
                            <span className="text-[11px] font-bold text-slate-200">{user.email}</span>
                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-0.5">
                                {isMaster ? 'Master Administrator' : isAdmin ? 'Company Manager' : 'Standard User'}
                            </span>
                        </div>
                    )}

                    <div className="hidden sm:block h-8 w-px bg-white/5 mx-1" />

                    <button
                        onClick={logout}
                        className="p-3 text-slate-500 hover:text-red-400 transition-all bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 rounded-xl"
                        title="Sair do Sistema"
                    >
                        <LogOut size={18} className="stroke-[2.5]" />
                    </button>

                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="lg:hidden p-3 text-slate-400 hover:text-white bg-white/5 border border-white/5 rounded-xl ml-1"
                    >
                        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {isMenuOpen && (
                <div className="lg:hidden absolute top-20 left-0 w-full bg-background/95 backdrop-blur-3xl border-b border-white/10 shadow-2xl animate-in slide-in-from-top duration-300 z-50 overflow-y-auto max-h-[calc(100vh-5rem)]">
                    <nav className="p-6 space-y-2">
                        {navItems.map(({ href, label, icon: Icon }) => {
                            const isActive = pathname === href
                            return (
                                <NextLink key={href} href={href}
                                    className={`w-full px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-4 transition-all ${isActive
                                        ? 'text-brand-400 bg-brand-500/10 border border-brand-500/20 shadow-[0_0_20px_rgba(124,58,237,0.1)]'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                                        }`}>
                                    <Icon size={18} className={isActive ? 'text-brand-500' : 'text-slate-500'} />
                                    {label}
                                </NextLink>
                            )
                        })}

                        {hasMasterSession && (
                            <button
                                onClick={stopImpersonation}
                                className="w-full mt-4 px-6 py-4 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-4"
                            >
                                <Shield size={18} className="stroke-[2.5]" />
                                Exit Impersonation
                            </button>
                        )}

                        {user && (
                            <div className="mt-8 pt-8 border-t border-white/5 px-6 pb-4">
                                <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Signed in as</div>
                                <div className="text-sm font-bold text-white">{user.email}</div>
                                <div className="text-[10px] font-black text-brand-500 uppercase tracking-widest mt-1">
                                    {isMaster ? 'Master Administrator' : isAdmin ? 'Company Manager' : 'Standard User'}
                                </div>
                            </div>
                        )}
                    </nav>
                </div>
            )}
        </header>
    )
}
