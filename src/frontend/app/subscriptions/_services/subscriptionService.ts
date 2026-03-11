import api from '@/lib/api'
import { Subscription } from '../_types'

export const subscriptionService = {
    getSubscriptions: async () => {
        const response = await api.get('/api/subscriptions')
        return response.data as Subscription[]
    },

    getCompanies: async () => {
        const response = await api.get('/api/companies')
        return response.data as { id: string, name: string }[]
    },

    createSubscription: async (data: any) => {
        return await api.post('/api/subscriptions', data)
    },

    updateSubscription: async (id: string, data: any) => {
        return await api.put(`/api/subscriptions/${id}`, data)
    },

    deleteSubscription: async (id: string) => {
        return await api.delete(`/api/subscriptions/${id}`)
    }
}
