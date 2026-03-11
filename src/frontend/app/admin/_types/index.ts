export interface AdminCompany {
    id: string
    name: string
}

export interface UserRegistrationData {
    name: string
    email: string
    password: string
    role: string
    company_id: string
}
