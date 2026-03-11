'use client'
import { Users, CreditCard, FileText, TrendingUp, Sparkles } from 'lucide-react'
import Header from '@/components/Header'
import { useDashboard } from './_hooks/useDashboard'
import { StatCard } from './_components/StatCard'
import { QuickActions } from './_components/QuickActions'

export default function Dashboard() {
  const { stats, loading, isMaster } = useDashboard()

  const cards = [
    {
      icon: Users,
      label: 'Total de Clientes',
      value: stats.customers,
      color: 'text-brand-400',
      bg: 'bg-brand-400/10',
      link: '/customers/'
    },
    {
      icon: CreditCard,
      label: 'Assinaturas Ativas',
      value: stats.activeSubscriptions,
      color: 'text-violet-400',
      bg: 'bg-violet-400/10',
      link: '/subscriptions/'
    },
    {
      icon: FileText,
      label: 'Faturas Pendentes',
      value: stats.pendingInvoices,
      color: 'text-amber-400',
      bg: 'bg-amber-400/10',
      link: '/invoices/'
    },
    {
      icon: TrendingUp,
      label: isMaster ? 'Receita Movimentada' : 'Receita Recebida',
      value: `R$ ${stats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
      link: '/invoices/'
    },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-brand-600/10 rounded-full blur-[120px] -z-10 mix-blend-screen animate-pulse" />
      <div className="absolute -top-[10%] right-[10%] w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] -z-10" />

      <Header />

      <main className="max-w-7xl mx-auto px-6 py-12 relative">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-600/10 border border-brand-600/20 text-brand-400 text-[10px] font-black uppercase tracking-widest mb-4">
              <Sparkles size={12} /> Billing Intelligence
            </div>
            <h1 className="text-5xl font-black text-white tracking-tight">
              Bem-vindo de <span className="text-gradient">Volta</span>
            </h1>
            <p className="text-slate-400 mt-3 text-lg font-medium max-w-2xl leading-relaxed">
              Resumo da sua plataforma de cobranças corporativas em tempo real.
            </p>
          </div>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card glass-panel animate-pulse h-40 bg-white/5" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card) => (
              <StatCard key={card.label} {...card} />
            ))}
          </div>
        )}

        <QuickActions />

        {/* Ambient glow footer */}
        <div className="mt-24 pt-12 border-t border-white/5 flex items-center justify-between text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
          <span>Billing Manager &copy; 2024</span>
          <div className="flex items-center gap-6">
            <span className="hover:text-brand-500 cursor-pointer transition-colors">Sistema Altamente Disponível</span>
            <div className="w-1 h-1 bg-brand-500 rounded-full animate-ping" />
            <span className="text-brand-500">Online</span>
          </div>
        </div>
      </main>
    </div>
  )
}
