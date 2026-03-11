import api from '@/lib/api'
import { Company, CompanyFormData } from '../_types'

export const companyService = {
    getCompanies: async () => {
        const response = await api.get('/api/companies')
        return response.data as Company[]
    },

    createCompany: async (data: CompanyFormData) => {
        await api.post('/api/companies', data)
    },

    updateCompany: async (id: string, data: CompanyFormData) => {
        await api.put(`/api/companies/${id}`, data)
    },

    deleteCompany: async (id: string) => {
        await api.delete(`/api/companies/${id}`)
    },

    impersonateCompany: async (id: string) => {
        const response = await api.post('/api/auth/impersonate', null, { params: { id } })
        return response.data as { token: string; user: { role: string } }
    },

    getCompanyMe: async () => {
        return await api.get('/api/companies/me')
    }
}
