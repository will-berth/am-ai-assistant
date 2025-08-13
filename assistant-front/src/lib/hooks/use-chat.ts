"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import type { ChatMessage } from "@/lib/api/types"
import { apiClient } from "../api/client"

interface SendMessageParams {
    message: string
    useKnowledgeBase: boolean
    files?: File[]
}

interface ChatState {
    messages: ChatMessage[]
    isLoading: boolean
}

export function useChat() {
    const [chatState, setChatState] = useState<ChatState>({
        messages: [],
        isLoading: false,
    })

    const sendMessageMutation = useMutation({
        mutationFn: async ({ message, useKnowledgeBase, files }: SendMessageParams) => {
            const formData = new FormData()
            formData.append("message", message)
            const response = await apiClient.sendMessage({ message })

            return response
        },
        onSuccess: (data) => {
            if (data.success && data.data) {
                const response: ChatMessage = {
                    id: Date.now().toString(),
                    role: "assistant",
                    content: data.data.response,
                    timestamp: new Date(),
                }
                setChatState((prev) => ({
                    ...prev,
                    messages: [...prev.messages, response],
                    isLoading: false,
                }))
            }
        },
        onError: () => {
            const errorMessage: ChatMessage = {
                id: Date.now().toString(),
                role: "assistant",
                content: "Lo siento, hubo un error al procesar tu mensaje. Por favor intenta de nuevo.",
                timestamp: new Date(),
            }
            setChatState((prev) => ({
                ...prev,
                messages: [...prev.messages, errorMessage],
                isLoading: false,
            }))
        },
    })

    const addUserMessage = (message: string) => {
        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: "user",
            content: message,
            timestamp: new Date(),
        }
        setChatState((prev) => ({
            ...prev,
            messages: [...prev.messages, userMessage],
            isLoading: true,
        }))
    }

    const clearConversation = () => {
        setChatState({
            messages: [],
            isLoading: false,
        })
    }

    return {
        ...chatState,
        sendMessage: sendMessageMutation.mutate,
        addUserMessage,
        clearConversation
    }
}
