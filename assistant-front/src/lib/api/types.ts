export interface ApiResponse<T = any> {
    success: boolean
    data?: T
    error?: string
    message?: string
}

export interface ChatMessageResponse {
    response: string
}
export interface ChatMessage {
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: Date
}

export interface FileInfo {
    id: number
    file_id: string
    original_filename: string
    file_type: "txt" | "csv"
    file_size: number
    upload_date: Date
    content_preview: string
}

export interface ChatRequest {
    message: string
    useKnowledgeBase?: boolean
}

export interface ChatResponse {
    message: ChatMessage
}

export interface FileUploadRequest {
    file: File
    type: "txt" | "csv"
}

export interface PaginationInfo {
    page: number
    size: number
    total: number
}

export interface KnowledgeBase {
    files: FileInfo[]
    pagination: PaginationInfo
}

export interface KnowledgeBaseFilters{
    page?: number
    size?: number
    query?: string
}