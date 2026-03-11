import api from '@/lib/api'
import { AdminCompany, UserRegistrationData } from '../_types'

export const adminService = {
    getCompanies: async () => {
        const response = await api.get('/api/companies')
        return response.data as AdminCompany[]
    },

    registerUser: async (data: UserRegistrationData) => {
        await api.post('/api/auth/register', data)
    }
}
