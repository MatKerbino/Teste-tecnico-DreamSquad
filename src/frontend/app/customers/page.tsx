'use client'
import { Plus, Users } from 'lucide-react'
import Header from '@/components/Header'
import { useCustomers } from './_hooks/useCustomers'
import { CustomerTable } from './_components/CustomerTable'
import { CustomerModal } from './_components/CustomerModal'

export default function CustomersPage() {
    const {
        customers,
        companies,
        loading,
        modal,
        form,
        setForm,
        saving,
        error,
        handleSave,
        handleDelete,
        openCreate,
        openEdit,
        closeModal,
        getCompanyName
    } = useCustomers()

    return (
        <div className="min-h-screen relative overflow-hidden">
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-brand-600/10 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-brand-400/5 rounded-full blur-[100px] -z-10" />

            <Header />

            <main className="max-w-7xl mx-auto px-6 py-12 relative">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-wider mb-4">
                            Relationship Management
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-center gap-4">
                            <Users className="text-brand-500 w-10 h-10 md:w-12 md:h-12 drop-shadow-[0_0_15px_rgba(124,58,237,0.5)]" />
                            <span className="text-gradient">Contatos B2B</span>
                        </h1>
                        <p className="text-slate-400 mt-4 text-lg max-w-2xl font-medium">
                            Gerencie seus representantes e contatos corporativos em uma interface unificada e intuitiva.
                        </p>
                    </div>
                    <button
                        onClick={openCreate}
                        className="btn-primary flex items-center gap-2 px-8 glow-purple"
                    >
                        <Plus size={20} className="stroke-[3]" /> Novo Cliente
                    </button>
                </div>

                {loading ? (
                    <div className="space-y-6">
                        <div className="card h-20 animate-pulse bg-white/5" />
                        <div className="card h-96 animate-pulse bg-white/5" />
                    </div>
                ) : customers.length === 0 ? (
                    <div className="card text-center py-24 glass-panel border-dashed border-white/5">
                        <div className="w-20 h-20 bg-brand-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-brand-500/20">
                            <Users className="w-10 h-10 text-brand-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Nenhum cliente cadastrado</h3>
                        <p className="text-slate-400 max-w-sm mx-auto mb-8 font-medium">
                            Sua lista de contatos está vazia. Comece adicionando seu primeiro cliente corporativo.
                        </p>
                        <button
                            onClick={openCreate}
                            className="btn-primary inline-flex items-center gap-2 px-8"
                        >
                            <Plus size={20} className="stroke-[3]" /> Adicionar Primeiro Cliente
                        </button>
                    </div>
                ) : (
                    <CustomerTable
                        customers={customers}
                        getCompanyName={getCompanyName}
                        onEdit={openEdit}
                        onDelete={handleDelete}
                    />
                )}
            </main>

            <CustomerModal
                open={modal.open}
                editing={modal.editing}
                form={form}
                companies={companies}
                saving={saving}
                error={error}
                onClose={closeModal}
                onSave={handleSave}
                setForm={setForm}
            />
        </div>
    )
}
