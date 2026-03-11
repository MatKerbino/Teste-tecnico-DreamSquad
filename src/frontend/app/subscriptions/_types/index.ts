export interface Subscription {
    id: string
    target_company_id: string
    company_id: string
    amount: number
    due_day: number
    active: boolean
}

export interface Company {
    id: string
    name: string
}

export interface SubscriptionFormData {
    target_company_id: string
    amount: string
    due_day: string
    active: boolean
}
