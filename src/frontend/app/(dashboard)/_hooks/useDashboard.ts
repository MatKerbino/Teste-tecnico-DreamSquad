import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { dashboardService } from '../_services/dashboardService'
import { DashboardStats } from '../_types'

export function useDashboard() {
    const router = useRouter()
    const [stats, setStats] = useState<DashboardStats>({
        customers: 0,
        activeSubscriptions: 0,
        pendingInvoices: 0,
        totalRevenue: 0
    })
    const [loading, setLoading] = useState(true)
    const [isMaster, setIsMaster] = useState(false)

    const fetchData = useCallback(async () => {
        try {
            const data = await dashboardService.getStats()
            setStats(data)
        } catch {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            router.push('/login/')
        } finally {
            setLoading(false)
        }
    }, [router])

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            router.push('/login/')
            return
        }

        const uStr = localStorage.getItem('user')
        if (uStr) {
            const u = JSON.parse(uStr)
            const masterStatus = u.role === 'master' || (u.role === 'admin' && u.company_id === 'company-demo')
            setIsMaster(masterStatus)
        }

        fetchData()
    }, [router, fetchData])

    return {
        stats,
        loading,
        isMaster,
        fetchData
    }
}
