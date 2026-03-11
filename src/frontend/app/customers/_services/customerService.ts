import api from '@/lib/api'
import { Customer, Company, CustomerFormData } from '../_types'

export const customerService = {
    getCustomers: async () => {
        const response = await api.get('/api/customers')
        return response.data as Customer[]
    },

    createCustomer: async (data: CustomerFormData) => {
        await api.post('/api/customers', data)
    },

    updateCustomer: async (id: string, data: CustomerFormData) => {
        await api.put(`/api/customers/${id}`, data)
    },

    deleteCustomer: async (id: string) => {
        await api.delete(`/api/customers/${id}`)
    },

    getCompanies: async () => {
        const response = await api.get('/api/companies')
        return response.data as Company[]
    }
}
