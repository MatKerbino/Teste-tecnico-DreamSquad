import api from '@/lib/api'
import { Report } from '../_types'

export const operationService = {
    runBilling: async () => {
        return await api.post('/api/operations/billing')
    },

    runBackup: async () => {
        return await api.post('/api/operations/backup')
    },

    getReports: async () => {
        const response = await api.get('/api/operations/reports')
        return response.data as { billing_reports: Report[]; backup_reports: Report[] }
    },

    downloadReport: async (bucket: string, key: string) => {
        return await api.get('/api/operations/reports/download', {
            params: { bucket, key },
            responseType: 'blob'
        })
    }
}
