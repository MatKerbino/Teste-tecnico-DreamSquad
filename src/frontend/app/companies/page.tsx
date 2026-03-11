'use client'
import { Building, Plus } from 'lucide-react'
import Header from '@/components/Header'
import { useCompanies } from './_hooks/useCompanies'
import { CompanyCard } from './_components/CompanyCard'
import { CompanyModal } from './_components/CompanyModal'

export default function CompaniesPage() {
    const {
        companies,
        loading,
        modal,
        editingId,
        form,
        setForm,
        user,
        saving,
        error,
        handleSave,
        handleDelete,
        handleImpersonate,
        openEdit,
        openCreate,
        closeModal
    } = useCompanies()

    return (
        <div className="min-h-screen relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-600/10 rounded-full blur-[120px] -z-10" />
            <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-brand-500/5 rounded-full blur-[100px] -z-10" />

            <Header />

            <main className="max-w-7xl mx-auto px-6 py-12 relative">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-wider mb-4">
                            Enterprise Asset Management
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-center gap-4">
                            <Building className="text-brand-500 w-10 h-10 md:w-12 md:h-12 drop-shadow-[0_0_15px_rgba(124,58,237,0.5)]" />
                            <span className="text-gradient">Empresas</span>
                        </h1>
                        <p className="text-slate-400 mt-4 text-lg max-w-2xl font-medium">
                            Gerencie o ecossistema de empresas parceiras e clientes corporativos de forma centralizada.
                        </p>
                    </div>
                    {(user?.role === 'master' || (user?.role === 'admin' && user?.company_id === 'company-demo')) && (
                        <button
                            onClick={openCreate}
                            className="btn-primary flex items-center gap-2 px-8 glow-purple"
                        >
                            <Plus size={20} className="stroke-[3]" /> Nova Empresa
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => <div key={i} className="card h-64 animate-pulse bg-white/5" />)}
                    </div>
                ) : companies.length === 0 ? (
                    <div className="card text-center py-24 glass-panel border-dashed border-white/5">
                        <div className="w-20 h-20 bg-brand-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-brand-500/20">
                            <Building className="w-10 h-10 text-brand-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Nenhuma empresa encontrada</h3>
                        <p className="text-slate-400 max-w-sm mx-auto mb-8 font-medium">
                            Não há empresas registradas no sistema no momento.
                        </p>
                        {user?.role === 'admin' && (
                            <button
                                onClick={openCreate}
                                className="btn-primary inline-flex items-center gap-2 px-8"
                            >
                                <Plus size={20} className="stroke-[3]" /> Cadastrar Primeira Empresa
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {companies.map(c => (
                            <CompanyCard
                                key={c.id}
                                company={c}
                                userRole={user?.role}
                                onEdit={openEdit}
                                onDelete={handleDelete}
                                onImpersonate={handleImpersonate}
                            />
                        ))}
                    </div>
                )}
            </main>

            <CompanyModal
                open={modal}
                editingId={editingId}
                form={form}
                saving={saving}
                error={error}
                onClose={closeModal}
                onSave={handleSave}
                setForm={setForm}
            />
        </div>
    )
}
