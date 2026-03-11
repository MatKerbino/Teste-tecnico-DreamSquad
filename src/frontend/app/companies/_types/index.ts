export interface Company {
    id: string
    name: string
    cnpj: string
    created_at: string
}

export interface CompanyFormData {
    name: string
    cnpj: string
}
