import { BaseApiAdapter } from "./base-adapter"
import type { ApiResponse, ChatRequest, FileUploadRequest, FileInfo, PaginationInfo, KnowledgeBase, KnowledgeBaseFilters, ChatMessageResponse } from "../types"

export class RestApiAdapter extends BaseApiAdapter {
    private baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000/api/v1"

    async sendMessage(request: ChatRequest): Promise<ApiResponse<ChatMessageResponse>> {
        try {
            const response = await fetch(`${this.baseUrl}/assistant/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(request),
            })
            return await response.json()
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error",
            }
        }
    }

    async uploadFile(request: FileUploadRequest): Promise<ApiResponse<FileInfo>> {
        try {
            const formData = new FormData()
            formData.append("file", request.file)
            formData.append("type", request.type)

            const response = await fetch(`${this.baseUrl}/platform/upload-file`, {
                method: "POST",
                body: formData,
            })
            return await response.json()
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error",
            }
        }
    }

    async getKnowledgeBase(filters: KnowledgeBaseFilters): Promise<ApiResponse<KnowledgeBase>> {
        try {
            console.log(process.env.NEXT_PUBLIC_API_URL, 'process.env.NEXT_PUBLIC_API_URL')
            const params = new URLSearchParams();
            params.append('page', filters.page?.toString() || '1');
            params.append('size', filters.size?.toString() || '10');
            if (filters.query) {
                params.append('query', filters.query);
            }
            const response = await fetch(`${this.baseUrl}/platform/files` + `?${params.toString()}`)
            return await response.json()
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error",
            }
        }
    }
}
