export interface Invoice {
    id: string;
    subscription_id: string;
    target_company_id: string;
    company_id: string;
    amount: number;
    due_date: string;
    status: 'pending' | 'paid' | 'canceled';
    created_at: string;
}

export interface Company {
    id: string;
    name: string;
}

export interface InvoiceStats {
    total: number;
    paid: number;
    pending: number;
    count: number;
}
