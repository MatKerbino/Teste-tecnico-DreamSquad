'use client'
import { Zap, HardDrive, FileText } from 'lucide-react'
import Header from '@/components/Header'
import { useOperations } from './_hooks/useOperations'
import { OperationCard } from './_components/OperationCard'
import { ReportList } from './_components/ReportList'

export default function OperationsPage() {
    const {
        billingReports,
        backupReports,
        loadingReports,
        billingStatus,
        backupStatus,
        isMaster,
        isAdmin,
        handleRunBilling,
        handleRunBackup,
        handleDownload,
        fetchReports
    } = useOperations()

    return (
        <div className="min-h-screen relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-brand-600/10 to-transparent -z-10" />
            <div className="absolute top-1/4 -right-24 w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-1/4 -left-24 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] -z-10" />

            <Header />

            <main className="max-w-7xl mx-auto px-6 py-12 relative">
                <div className="mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs font-bold uppercase tracking-wider mb-4">
                        Critical Infrastructure
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="bg-yellow-500/10 p-4 rounded-3xl border border-yellow-500/20 shadow-[0_0_30px_rgba(234,179,8,0.1)]">
                            <Zap className="w-10 h-10 text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-white tracking-tight">
                                Painel de <span className="text-gradient">Operações</span>
                            </h1>
                            <p className="text-slate-400 mt-1 text-lg font-medium max-w-2xl">
                                Execute rotinas de sistema manualmente e gerencie relatórios de infraestrutura e segurança.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <OperationCard
                        title="Rotina de Faturamento"
                        description="Processa assinaturas ativas com vencimento para hoje, cria faturas no banco de dados e gera o arquivo consolidado de exportação para faturamento bancário."
                        icon={Zap}
                        iconColor="brand"
                        status={billingStatus}
                        buttonText="Disparar Ciclo de Faturamento"
                        buttonIcon={Zap}
                        onAction={handleRunBilling}
                        disabled={!isAdmin}
                        permissionMessage="Apenas administradores podem disparar faturamento"
                        footerText="Sincronizado via EventBridge"
                    />

                    <OperationCard
                        title="Backup de Segurança"
                        description="Exporta o estado atual de todas as tabelas críticas (Clientes, Faturas e Assinaturas) em um snapshot JSON com integridade garantida para recuperação."
                        icon={HardDrive}
                        iconColor="purple"
                        status={backupStatus}
                        buttonText="Executar Cold Backup Agora"
                        buttonIcon={HardDrive}
                        onAction={handleRunBackup}
                        disabled={!isMaster}
                        permissionMessage="Apenas Master Admins podem realizar backups"
                        footerText="Armazenamento criptografado S3"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <ReportList
                        title="Exportações de Faturamento"
                        icon={FileText}
                        iconColor="brand"
                        reports={billingReports}
                        loading={loadingReports}
                        onDownload={handleDownload}
                        onRefresh={fetchReports}
                    />

                    <ReportList
                        title="Histórico de Backups"
                        icon={HardDrive}
                        iconColor="purple"
                        reports={backupReports}
                        loading={loadingReports}
                        onDownload={handleDownload}
                        onRefresh={fetchReports}
                    />
                </div>
            </main>
        </div>
    )
}
