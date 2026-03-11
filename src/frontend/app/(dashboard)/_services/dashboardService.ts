import api from '@/lib/api'

export const dashboardService = {
    getStats: async () => {
        const [customersRes, subsRes, invoicesRes] = await Promise.all([
            api.get('/api/customers'),
            api.get('/api/subscriptions'),
            api.get('/api/invoices')
        ])

        const invoices = invoicesRes.data || []
        const pendingInvoices = invoices.filter((i: any) => i.status === 'pending')
        const totalRevenue = invoices
            .filter((i: any) => i.status === 'paid')
            .reduce((acc: number, i: any) => acc + i.amount, 0)

        return {
            customers: (customersRes.data || []).length,
            activeSubscriptions: (subsRes.data || []).filter((s: any) => s.active).length,
            pendingInvoices: pendingInvoices.length,
            totalRevenue,
        }
    }
}
