import type { ApiResponse, ChatRequest, FileUploadRequest, FileInfo, KnowledgeBase, KnowledgeBaseFilters, ChatMessageResponse } from "../types"

export abstract class BaseApiAdapter {
    abstract sendMessage(request: ChatRequest): Promise<ApiResponse<ChatMessageResponse>>
    abstract uploadFile(request: FileUploadRequest): Promise<ApiResponse<FileInfo>>
    abstract getKnowledgeBase(filters: KnowledgeBaseFilters): Promise<ApiResponse<KnowledgeBase>>
}
