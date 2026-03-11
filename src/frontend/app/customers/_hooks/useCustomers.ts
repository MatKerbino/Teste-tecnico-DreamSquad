import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { customerService } from '../_services/customerService'
import { Customer, Company, CustomerFormData } from '../_types'
import { isValidDocument } from '@/lib/utils'

export function useCustomers() {
    const router = useRouter()
    const [customers, setCustomers] = useState<Customer[]>([])
    const [companies, setCompanies] = useState<Company[]>([])
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState<{ open: boolean; editing: Customer | null }>({ open: false, editing: null })
    const [form, setForm] = useState<CustomerFormData>({ name: '', email: '', document: '', related_company_id: '' })
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    const fetchData = useCallback(async () => {
        try {
            const [custRes, compRes] = await Promise.all([
                customerService.getCustomers(),
                customerService.getCompanies()
            ])
            setCustomers(custRes)
            setCompanies(compRes)
        } catch {
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
        fetchData()
    }, [router, fetchData])

    const openCreate = () => {
        setForm({ name: '', email: '', document: '', related_company_id: '' })
        setModal({ open: true, editing: null })
        setError('')
    }

    const openEdit = (customer: Customer) => {
        setForm({
            name: customer.name,
            email: customer.email,
            document: customer.document,
            related_company_id: customer.related_company_id
        })
        setModal({ open: true, editing: customer })
        setError('')
    }

    const closeModal = () => setModal({ open: false, editing: null })

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!isValidDocument(form.document)) {
            setError('CPF ou CNPJ inválido. Verifique os números.')
            return
        }

        setSaving(true)
        const data = { ...form, document: form.document.replace(/\D/g, '') }
        try {
            if (modal.editing) {
                await customerService.updateCustomer(modal.editing.id, data)
            } else {
                await customerService.createCustomer(data)
            }
            closeModal()
            await fetchData()
        } catch {
            setError('Erro ao salvar cliente.')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este cliente?')) return
        try {
            await customerService.deleteCustomer(id)
            await fetchData()
        } catch {
            alert('Erro ao excluir cliente.')
        }
    }

    const getCompanyName = (id: string) => companies.find(comp => comp.id === id)?.name || id

    return {
        customers,
        companies,
        loading,
        modal,
        form,
        setForm,
        saving,
        error,
        handleSave,
        handleDelete,
        openCreate,
        openEdit,
        closeModal,
        getCompanyName
    }
}
