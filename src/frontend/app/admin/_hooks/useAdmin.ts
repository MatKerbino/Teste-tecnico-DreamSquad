import { useState, useEffect, useCallback } from 'react'
import { adminService } from '../_services/adminService'
import { AdminCompany, UserRegistrationData } from '../_types'

export function useAdmin() {
    const [companies, setCompanies] = useState<AdminCompany[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedCompanyId, setSelectedCompanyId] = useState('')
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'admin' })
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
    const [searchTerm, setSearchTerm] = useState('')

    const loadCompanies = useCallback(async () => {
        setLoading(true)
        try {
            const res = await adminService.getCompanies()
            setCompanies(res)

            if (res.length === 1) {
                setSelectedCompanyId(res[0].id)
            }
        } catch (err) {
            console.error('Failed to load companies', err)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        loadCompanies()
    }, [loadCompanies])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedCompanyId) {
            setMessage({ type: 'error', text: 'Selecione uma empresa' })
            return
        }
        setMessage(null)
        try {
            await adminService.registerUser({ ...formData, company_id: selectedCompanyId })
            setMessage({ type: 'success', text: 'Usuário criado com sucesso!' })
            setFormData({ name: '', email: '', password: '', role: 'admin' })
        } catch (err: any) {
            setMessage({ type: 'error', text: err.response?.data?.error || 'Erro ao criar usuário' })
        }
    }

    const filteredCompanies = companies.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.id.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return {
        companies,
        loading,
        selectedCompanyId,
        setSelectedCompanyId,
        formData,
        setFormData,
        message,
        searchTerm,
        setSearchTerm,
        filteredCompanies,
        handleSubmit
    }
}
