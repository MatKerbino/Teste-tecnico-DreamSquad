'use client'
import { useEffect, useState } from 'react'
import { companyService } from '@/app/companies/_services/companyService'
import { useRouter, usePathname } from 'next/navigation'
import { LayoutDashboard, Crown, Building2, Users, CreditCard, FileText, Zap } from 'lucide-react'

export function useHeader() {
    const router = useRouter()
    const pathname = usePathname()
    const [company, setCompany] = useState<{ id: string; name: string } | null>(null)
    const [user, setUser] = useState<{ email: string; role: string; company_id: string } | null>(null)
    const [isMaster, setIsMaster] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const [hasMasterSession, setHasMasterSession] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    useEffect(() => {
        const uStr = localStorage.getItem('user')
        if (uStr) {
            const u = JSON.parse(uStr)
            setUser(u)
            const masterStatus = u.role === 'master' || (u.role === 'admin' && u.company_id === 'company-demo')
            setIsMaster(masterStatus)
            setIsAdmin(u.role === 'admin' || u.role === 'master')
        }

        setHasMasterSession(!!localStorage.getItem('master_token'))

        companyService.getCompanyMe().then(res => {
            setCompany(res.data)
        }).catch(() => { })
    }, [])

    useEffect(() => {
        setIsMenuOpen(false)
    }, [pathname])

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('master_token')
        localStorage.removeItem('master_user')
        router.push('/login/')
    }

    const stopImpersonation = () => {
        const mToken = localStorage.getItem('master_token')
        const mUser = localStorage.getItem('master_user')
        if (mToken && mUser) {
            localStorage.setItem('token', mToken)
            localStorage.setItem('user', mUser)
            localStorage.removeItem('master_token')
            localStorage.removeItem('master_user')
            window.location.href = '/companies/'
        }
    }

    const navItems = [
        { href: '/', label: 'Dashboard', icon: LayoutDashboard },
        ...(isAdmin ? [{ href: '/admin/', label: 'Admin', icon: Crown }] : []),
        { href: '/companies/', label: 'Empresas', icon: Building2 },
        { href: '/customers/', label: 'Clientes', icon: Users },
        { href: '/subscriptions/', label: 'Assinaturas', icon: CreditCard },
        { href: '/invoices/', label: 'Faturas', icon: FileText },
        ...(isAdmin ? [{ href: '/operations/', label: 'Operações', icon: Zap }] : []),
    ]

    return {
        user,
        company,
        isMaster,
        isAdmin,
        hasMasterSession,
        isMenuOpen,
        setIsMenuOpen,
        navItems,
        pathname,
        logout,
        stopImpersonation
    }
}
