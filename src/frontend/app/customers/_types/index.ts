export interface Customer {
    id: string;
    name: string;
    email: string;
    document: string;
    company_id: string;
    related_company_id: string;
}

export interface Company {
    id: string;
    name: string;
}

export interface CustomerFormData {
    name: string;
    email: string;
    document: string;
    related_company_id: string;
}
