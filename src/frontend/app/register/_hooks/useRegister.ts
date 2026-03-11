import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/app/login/_services/authService'
import { formatDocument, isValidCNPJ } from '@/lib/utils'

export function useRegister() {
    const router = useRouter()
    const [name, setName] = useState('')
    const [cnpj, setCnpj] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!isValidCNPJ(cnpj)) {
            setError('CNPJ inválido. Verifique os números informados.')
            return
        }

        setLoading(true)
        try {
            await authService.register({
                name,
                cnpj: cnpj.replace(/\D/g, ''),
                email,
                password
            })
            router.push('/login?registered=true')
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erro ao realizar cadastro. Verifique os dados.')
        } finally {
            setLoading(false)
        }
    }

    const onCnpjChange = (val: string) => {
        setCnpj(formatDocument(val))
    }

    return {
        name,
        setName,
        cnpj,
        onCnpjChange,
        email,
        setEmail,
        password,
        setPassword,
        error,
        loading,
        handleFormSubmit
    }
}
