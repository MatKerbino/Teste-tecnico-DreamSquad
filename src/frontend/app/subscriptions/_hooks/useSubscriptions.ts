import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { subscriptionService } from '../_services/subscriptionService'
import { Subscription, Company, SubscriptionFormData } from '../_types'

export function useSubscriptions() {
    const router = useRouter()
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
    const [companies, setCompanies] = useState<Company[]>([])
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState<{ open: boolean; editing: Subscription | null }>({ open: false, editing: null })
    const [form, setForm] = useState<SubscriptionFormData>({ target_company_id: '', amount: '', due_day: '', active: true })
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    const fetchData = useCallback(async () => {
        try {
            const [subs, comps] = await Promise.all([
                subscriptionService.getSubscriptions(),
                subscriptionService.getCompanies()
            ])
            setSubscriptions(subs)
            setCompanies(comps)
        } catch {
            router.push('/login/')
        } finally {
            setLoading(false)
        }
    }, [router])

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            router.push('/login/')
            return
        }
        fetchData()
    }, [router, fetchData])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setError('')
        try {
            const data = {
                target_company_id: form.target_company_id,
                amount: parseFloat(form.amount),
                due_day: parseInt(form.due_day),
                active: form.active
            }
            if (modal.editing) {
                await subscriptionService.updateSubscription(modal.editing.id, data)
            } else {
                await subscriptionService.createSubscription(data)
            }
            setModal({ open: false, editing: null })
            await fetchData()
        } catch {
            setError('Erro ao salvar assinatura. Verifique os campos.')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Deseja realmente excluir esta assinatura corporativa?')) return
        try {
            await subscriptionService.deleteSubscription(id)
            await fetchData()
        } catch {
            alert('Erro ao excluir assinatura.')
        }
    }

    const openEdit = (s: Subscription) => {
        setForm({
            target_company_id: s.target_company_id,
            amount: s.amount.toString(),
            due_day: s.due_day.toString(),
            active: s.active
        })
        setModal({ open: true, editing: s })
        setError('')
    }

    const openCreate = () => {
        setForm({ target_company_id: '', amount: '', due_day: '', active: true })
        setError('')
        setModal({ open: true, editing: null })
    }

    const closeModal = () => {
        setModal({ open: false, editing: null })
    }

    return {
        subscriptions,
        companies,
        loading,
        modal,
        form,
        setForm,
        saving,
        error,
        handleSave,
        handleDelete,
        openEdit,
        openCreate,
        closeModal,
        fetchData
    }
}
