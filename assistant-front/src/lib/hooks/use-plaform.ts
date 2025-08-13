import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { KnowledgeBaseFilters } from "../api/types";


export function usePlatform() {
    const queryClient = useQueryClient()

    const uploadFilesMutation = useMutation({
        mutationFn: async (params: { file: File; type: "csv" | "txt" }) => {
            const { file, type } = params

            const response = await apiClient.uploadFile({ file, type })
            console.log({response})

            return response
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["knowledge-base"] })
        },
    })

    return {
        uploadFile: uploadFilesMutation.mutateAsync
    }
}

export function useKnowledgeBase(filters: KnowledgeBaseFilters) {

    return useQuery({
        queryKey: ["knowledge-base", filters.page, filters.query],
        queryFn: async () => {
            const response = await apiClient.getKnowledgeBase(filters)
            return response.data
        }
    })
}