import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { authService } from '../_services/authService'

export function useLogin() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const registered = searchParams.get('registered')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState('')

    useEffect(() => {
        if (registered === 'true') {
            setSuccess('Conta criada com sucesso! Faça login abaixo.')
        }
    }, [registered])

    useEffect(() => {
        if (typeof window !== 'undefined' && localStorage.getItem('token')) {
            router.push('/')
        }
    }, [router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const data = await authService.login(email, password)
            localStorage.setItem('token', data.token)
            localStorage.setItem('user', JSON.stringify(data.user))
            router.push('/')
        } catch {
            setError('Credenciais inválidas. Tente novamente.')
        } finally {
            setLoading(false)
        }
    }

    return {
        email,
        setEmail,
        password,
        setPassword,
        error,
        loading,
        success,
        handleSubmit
    }
}
