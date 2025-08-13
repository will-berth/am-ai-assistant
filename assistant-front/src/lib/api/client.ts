import type { BaseApiAdapter } from "./adapters/base-adapter"
import { RestApiAdapter } from "./adapters/rest-adapter"
import { KnowledgeBaseFilters } from "./types"

type ApiType = "rest" | "graphql" // Note: Graphql feature

class ApiClient {
    private adapter: BaseApiAdapter
    private currentType: ApiType = "rest"

    constructor() {
        this.adapter = this.createAdapter(this.currentType)
    }

    private createAdapter(type: ApiType): BaseApiAdapter {
        switch (type) {
            case "rest":
                return new RestApiAdapter()
            default:
                return new RestApiAdapter()
        }
    }

    switchApiType(type: ApiType) {
        this.currentType = type
        this.adapter = this.createAdapter(type)
    }

    getCurrentApiType(): ApiType {
        return this.currentType
    }

    sendMessage = (request: Parameters<BaseApiAdapter["sendMessage"]>[0]) => this.adapter.sendMessage(request)

    uploadFile = (request: Parameters<BaseApiAdapter["uploadFile"]>[0]) => this.adapter.uploadFile(request)

    getKnowledgeBase = (filters: KnowledgeBaseFilters) => this.adapter.getKnowledgeBase(filters)

}

export const apiClient = new ApiClient()
