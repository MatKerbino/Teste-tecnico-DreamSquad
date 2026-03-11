import api from '@/lib/api'

export const authService = {
    login: async (email: string, password: string) => {
        const response = await api.post('/api/auth/login', { email, password })
        return response.data as { token: string; user: { id: string; name: string; email: string; role: string; company_id: string } }
    },

    register: async (data: any) => {
        return await api.post('/api/auth/register', data)
    }
}
