'use client'
import { Shield } from 'lucide-react'
import Header from '@/components/Header'
import { useAdmin } from './_hooks/useAdmin'
import { CompanySelector } from './_components/CompanySelector'
import { UserForm } from './_components/UserForm'

export default function AdminPage() {
    const {
        loading,
        selectedCompanyId,
        setSelectedCompanyId,
        formData,
        setFormData,
        message,
        searchTerm,
        setSearchTerm,
        filteredCompanies,
        handleSubmit
    } = useAdmin()

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-600/10 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] -z-10" />

            <Header />

            <main className="max-w-7xl mx-auto px-6 py-12 relative">
                <div className="mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-wider mb-4">
                        Master Control Panel
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="bg-brand-600/10 p-4 rounded-3xl border border-brand-600/20 shadow-[0_0_30px_rgba(124,58,237,0.1)]">
                            <Shield className="w-10 h-10 text-brand-500 drop-shadow-[0_0_10px_rgba(124,58,237,0.5)]" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-white tracking-tight">
                                Painel <span className="text-gradient">Administrativo</span>
                            </h1>
                            <p className="text-slate-400 mt-1 text-lg font-medium">Gestão centralizada de acessos e permissões multi-inquilino.</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                    <div className="lg:col-span-2">
                        <CompanySelector
                            companies={filteredCompanies}
                            loading={loading}
                            selectedId={selectedCompanyId}
                            searchTerm={searchTerm}
                            onSelect={setSelectedCompanyId}
                            onSearchChange={setSearchTerm}
                        />
                    </div>

                    <div className="lg:col-span-3">
                        <UserForm
                            formData={formData}
                            setFormData={setFormData}
                            onSubmit={handleSubmit}
                            disabled={!selectedCompanyId}
                            message={message}
                        />
                    </div>
                </div>
            </main>
        </div>
    )
}
