'use client'
import { Plus, CreditCard } from 'lucide-react'
import Header from '@/components/Header'
import { useSubscriptions } from './_hooks/useSubscriptions'
import { SubscriptionTable } from './_components/SubscriptionTable'
import { SubscriptionModal } from './_components/SubscriptionModal'

export default function SubscriptionsPage() {
    const {
        subscriptions,
        companies,
        loading,
        modal,
        form,
        setForm,
        saving,
        error,
        handleSave,
        handleDelete,
        openEdit,
        openCreate,
        closeModal
    } = useSubscriptions()

    return (
        <div className="min-h-screen relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-brand-600/10 to-transparent -z-10" />
            <div className="absolute top-1/4 -right-24 w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-1/4 -left-24 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] -z-10" />

            <Header />

            <main className="max-w-7xl mx-auto px-6 py-12 relative">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-[10px] font-black uppercase tracking-widest mb-4">
                            Recurrence Management
                        </div>
                        <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-3">
                            Assinaturas <span className="text-gradient">Corporativas</span>
                        </h1>
                        <p className="text-slate-400 mt-2 text-lg font-medium max-w-2xl leading-relaxed">
                            Gerencie contratos recorrentes entre empresas e configure regras de faturamento automatizado.
                        </p>
                    </div>

                    <button
                        onClick={openCreate}
                        className="btn-primary px-8 py-4 text-xs font-black uppercase tracking-[0.15em] flex items-center gap-3 glow-purple shadow-[0_0_20px_rgba(124,58,237,0.3)] active:scale-95 transition-all"
                    >
                        <Plus size={18} className="stroke-[3]" /> Nova Assinatura
                    </button>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        <div className="h-16 bg-white/5 animate-pulse rounded-2xl border border-white/5" />
                        <div className="h-64 bg-white/5 animate-pulse rounded-2xl border border-white/5" />
                    </div>
                ) : subscriptions.length === 0 ? (
                    <div className="card glass-panel text-center py-24 flex flex-col items-center border-brand-500/10 shadow-2xl">
                        <div className="p-6 rounded-[2.5rem] bg-brand-600/5 border border-brand-600/10 mb-8">
                            <CreditCard size={64} className="text-brand-500/40" />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-3">Nenhuma assinatura ativa</h3>
                        <p className="text-slate-500 max-w-sm font-medium mb-10">
                            Comece criando sua primeira assinatura corporativa para automatizar cobranças mensais.
                        </p>
                        <button
                            onClick={openCreate}
                            className="btn-primary px-10 py-4 text-xs font-black uppercase tracking-widest glow-purple"
                        >
                            Criar Agora
                        </button>
                    </div>
                ) : (
                    <SubscriptionTable
                        subscriptions={subscriptions}
                        companies={companies}
                        onEdit={openEdit}
                        onDelete={handleDelete}
                    />
                )}
            </main>

            {modal.open && (
                <SubscriptionModal
                    editing={modal.editing}
                    companies={companies}
                    form={form}
                    setForm={setForm}
                    saving={saving}
                    error={error}
                    onClose={closeModal}
                    onSave={handleSave}
                />
            )}
        </div>
    )
}
