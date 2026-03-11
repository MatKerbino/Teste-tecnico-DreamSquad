export interface Report {
    key: string
    file_name: string
    size: number
    last_modified: string
    bucket: string
}

export interface OperationsState {
    loading: boolean
    result: string | null
    error: boolean
}
