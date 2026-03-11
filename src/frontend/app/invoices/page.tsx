'use client'
import { FileText } from 'lucide-react'
import Header from '@/components/Header'
import Link from 'next/link'
import { useInvoices } from './_hooks/useInvoices'
import { InvoiceStats } from './_components/InvoiceStats'
import { InvoiceTable } from './_components/InvoiceTable'

export default function InvoicesPage() {
    const {
        invoices,
        loading,
        paying,
        user,
        stats,
        handlePay,
        handleDelete,
        getCompanyName
    } = useInvoices()

    return (
        <div className="min-h-screen relative overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-500/5 rounded-full blur-[100px] -z-10" />

            <Header />

            <main className="max-w-7xl mx-auto px-6 py-12 relative">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-wider mb-4">
                            Financial Operations
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-center gap-4">
                            <FileText className="text-brand-500 w-10 h-10 md:w-12 md:h-12 drop-shadow-[0_0_15px_rgba(124,58,237,0.5)]" />
                            <span className="text-gradient">Faturas B2B</span>
                        </h1>
                        <p className="text-slate-400 mt-4 text-lg max-w-2xl font-medium">
                            Gerencie suas faturas corporativas e acompanhe o status dos pagamentos em tempo real.
                        </p>
                    </div>
                </div>

                {!loading && invoices.length > 0 && <InvoiceStats stats={stats} />}

                {loading ? (
                    <div className="space-y-6">
                        <div className="grid grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => <div key={i} className="card h-32 animate-pulse bg-white/5" />)}
                        </div>
                        <div className="card h-96 animate-pulse bg-white/5" />
                    </div>
                ) : invoices.length === 0 ? (
                    <div className="card text-center py-24 glass-panel border-dashed border-white/5">
                        <div className="w-20 h-20 bg-brand-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-brand-500/20">
                            <FileText className="w-10 h-10 text-brand-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Sem faturas encontradas</h3>
                        <p className="text-slate-400 max-w-sm mx-auto mb-8 font-medium">
                            Não há faturas geradas no momento. As faturas são geradas automaticamente com base nas assinaturas ativas.
                        </p>
                        {user?.role === 'admin' && (
                            <Link href="/operations/" className="btn-primary inline-flex items-center gap-2">
                                Gerar Faturas do Dia
                            </Link>
                        )}
                    </div>
                ) : (
                    <InvoiceTable
                        invoices={invoices}
                        paying={paying}
                        getCompanyName={getCompanyName}
                        onPay={handlePay}
                        onDelete={handleDelete}
                    />
                )}
            </main>
        </div>
    )
}
