import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { operationService } from '../_services/operationService'
import { Report, OperationsState } from '../_types'

export function useOperations() {
    const router = useRouter()
    const [billingReports, setBillingReports] = useState<Report[]>([])
    const [backupReports, setBackupReports] = useState<Report[]>([])
    const [loadingReports, setLoadingReports] = useState(true)
    const [billingStatus, setBillingStatus] = useState<OperationsState>({ loading: false, result: null, error: false })
    const [backupStatus, setBackupStatus] = useState<OperationsState>({ loading: false, result: null, error: false })
    const [isMaster, setIsMaster] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)

    const fetchReports = useCallback(async () => {
        setLoadingReports(true)
        try {
            const data = await operationService.getReports()
            const sortByDate = (a: Report, b: Report) =>
                new Date(b.last_modified).getTime() - new Date(a.last_modified).getTime()

            setBillingReports((data.billing_reports || []).sort(sortByDate))
            setBackupReports((data.backup_reports || []).sort(sortByDate))
        } catch {
            console.error('Failed to load reports')
        } finally {
            setLoadingReports(false)
        }
    }, [])

    useEffect(() => {
        const token = localStorage.getItem('token')
        const userStr = localStorage.getItem('user')
        if (!token || !userStr) {
            router.push('/login/')
            return
        }
        const u = JSON.parse(userStr)
        const masterStatus = u.role === 'master' || (u.role === 'admin' && u.company_id === 'company-demo')
        setIsMaster(masterStatus)
        setIsAdmin(u.role === 'admin' || u.role === 'master')
        fetchReports()
    }, [router, fetchReports])

    const handleRunBilling = async () => {
        setBillingStatus({ loading: true, result: null, error: false })
        try {
            const res = await operationService.runBilling()
            const { invoices_created, report_key } = res.data
            setBillingStatus({
                loading: false,
                result: `${invoices_created} faturas criadas. Relatório gerado com sucesso no S3.`,
                error: false
            })
            await fetchReports()
        } catch (e: any) {
            const msg = e.response?.data?.error || 'Erro na rotina de faturamento.'
            setBillingStatus({ loading: false, result: msg, error: true })
        }
    }

    const handleRunBackup = async () => {
        setBackupStatus({ loading: true, result: null, error: false })
        try {
            const res = await operationService.runBackup()
            setBackupStatus({
                loading: false,
                result: `Backup criado com sucesso no S3: ${res.data.backup_key}`,
                error: false
            })
            await fetchReports()
        } catch (e: any) {
            const msg = e.response?.data?.error || 'Erro no backup.'
            setBackupStatus({ loading: false, result: msg, error: true })
        }
    }

    const handleDownload = async (r: Report) => {
        try {
            const res = await operationService.downloadReport(r.bucket, r.key)
            const url = window.URL.createObjectURL(new Blob([res.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', r.file_name)
            document.body.appendChild(link)
            link.click()
            link.remove()
        } catch {
            alert('Erro ao baixar arquivo')
        }
    }

    return {
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
    }
}
