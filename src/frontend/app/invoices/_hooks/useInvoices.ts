import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { invoiceService } from '../_services/invoiceService'
import { Invoice, Company, InvoiceStats } from '../_types'

export function useInvoices() {
    const router = useRouter()
    const [invoices, setInvoices] = useState<Invoice[]>([])
    const [companies, setCompanies] = useState<Company[]>([])
    const [loading, setLoading] = useState(true)
    const [paying, setPaying] = useState<string | null>(null)
    const [user, setUser] = useState<{ role: string } | null>(null)

    const fetchData = useCallback(async () => {
        try {
            const [invRes, compRes] = await Promise.all([
                invoiceService.getInvoices(),
                invoiceService.getCompanies()
            ])
            setInvoices(invRes.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()))
            setCompanies(compRes)
        } catch {
            router.push('/login/')
        } finally {
            setLoading(false)
        }
    }, [router])

    useEffect(() => {
        const token = localStorage.getItem('token')
        const userStr = localStorage.getItem('user')
        if (!token || !userStr) {
            router.push('/login/')
            return
        }
        setUser(JSON.parse(userStr))
        fetchData()
    }, [router, fetchData])

    const handlePay = async (invoice: Invoice) => {
        setPaying(invoice.id)
        try {
            await invoiceService.payInvoice(invoice.subscription_id, invoice.id)
            await fetchData()
        } catch {
            alert('Erro ao registrar pagamento.')
        } finally {
            setPaying(null)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Deseja excluir esta fatura?')) return
        try {
            await invoiceService.deleteInvoice(id)
            await fetchData()
        } catch {
            alert('Erro ao excluir fatura.')
        }
    }

    const stats: InvoiceStats = {
        total: invoices.reduce((sum, i) => sum + i.amount, 0),
        paid: invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0),
        pending: invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.amount, 0),
        count: invoices.length
    }

    const getCompanyName = (id: string) => companies.find(c => c.id === id)?.name || id

    return {
        invoices,
        loading,
        paying,
        user,
        stats,
        handlePay,
        handleDelete,
        getCompanyName,
        refresh: fetchData
    }
}
