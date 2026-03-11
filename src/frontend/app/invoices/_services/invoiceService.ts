import api from '@/lib/api'
import { Invoice, Company } from '../_types'

export const invoiceService = {
    getInvoices: async () => {
        const response = await api.get('/api/invoices')
        return response.data as Invoice[]
    },

    payInvoice: async (subscriptionId: string, invoiceId: string) => {
        await api.patch(`/api/invoices/${subscriptionId}:${invoiceId}/pay`)
    },

    deleteInvoice: async (id: string) => {
        await api.delete(`/api/invoices/${id}`)
    },

    getCompanies: async () => {
        const response = await api.get('/api/companies')
        return response.data as Company[]
    }
}
