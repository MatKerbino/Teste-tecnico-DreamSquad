import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { companyService } from '../_services/companyService'
import { Company, CompanyFormData } from '../_types'
import { isValidCNPJ } from '@/lib/utils'

export function useCompanies() {
    const router = useRouter()
    const [companies, setCompanies] = useState<Company[]>([])
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [form, setForm] = useState<CompanyFormData>({ name: '', cnpj: '' })
    const [user, setUser] = useState<{ role: string; company_id: string } | null>(null)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    const fetchCompanies = useCallback(async () => {
        try {
            const res = await companyService.getCompanies()
            setCompanies(res)
        } catch {
            router.push('/login/')
        } finally {
            setLoading(false)
        }
    }, [router])

    useEffect(() => {
        const token = localStorage.getItem('token')
        const userStr = localStorage.getItem('user')
        if (!token || !userStr) {
            router.push('/login/')
            return
        }
        setUser(JSON.parse(userStr))
        fetchCompanies()
    }, [router, fetchCompanies])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!isValidCNPJ(form.cnpj)) {
            setError('CNPJ inválido. Verifique os números.')
            return
        }

        setSaving(true)
        try {
            const data = { ...form, cnpj: form.cnpj.replace(/\D/g, '') }
            if (editingId) {
                await companyService.updateCompany(editingId, data)
            } else {
                await companyService.createCompany(data)
            }
            setModal(false)
            setEditingId(null)
            setForm({ name: '', cnpj: '' })
            await fetchCompanies()
        } catch {
            setError('Erro ao salvar empresa. Verifique os dados.')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir esta empresa? Isso pode afetar faturas e clientes vinculados.')) return
        try {
            await companyService.deleteCompany(id)
            await fetchCompanies()
        } catch {
            alert('Erro ao excluir empresa.')
        }
    }

    const handleImpersonate = async (id: string) => {
        try {
            const currentToken = localStorage.getItem('token')
            const currentUser = localStorage.getItem('user')
            if (currentToken && currentUser && !localStorage.getItem('master_token')) {
                localStorage.setItem('master_token', currentToken)
                localStorage.setItem('master_user', currentUser)
            }

            const res = await companyService.impersonateCompany(id)
            localStorage.setItem('token', res.token)
            localStorage.setItem('user', JSON.stringify(res.user))
            window.location.href = '/'
        } catch {
            alert('Erro ao acessar empresa.')
        }
    }

    const openEdit = (c: Company) => {
        setEditingId(c.id)
        setForm({ name: c.name, cnpj: c.cnpj })
        setError('')
        setModal(true)
    }

    const openCreate = () => {
        setForm({ name: '', cnpj: '' })
        setEditingId(null)
        setError('')
        setModal(true)
    }

    const closeModal = () => {
        setModal(false)
        setEditingId(null)
    }

    return {
        companies,
        loading,
        modal,
        editingId,
        form,
        setForm,
        user,
        saving,
        error,
        handleSave,
        handleDelete,
        handleImpersonate,
        openEdit,
        openCreate,
        closeModal
    }
}
