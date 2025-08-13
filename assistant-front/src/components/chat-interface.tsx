"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CardContent, CardHeader } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    Send,
    Bot,
    User,
    Loader2,
    Sparkles,
    Paperclip,
    X,
    FileText,
    Upload,
} from "lucide-react"
import { useChat } from "@/lib/hooks/use-chat"
import { toast } from "sonner"

export function ChatInterface() {
    const [inputMessage, setInputMessage] = useState("")
    const [useKnowledgeBase, setUseKnowledgeBase] = useState(false)
    const [useStreaming, setUseStreaming] = useState(true)
    const [attachedFiles, setAttachedFiles] = useState<File[]>([])
    const [isDragOver, setIsDragOver] = useState(false)
    const scrollAreaRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const {
        messages,
        isLoading,
        sendMessage,
        addUserMessage
    } = useChat()

    const scrollToBottom = () => {
        if (scrollAreaRef.current) {
            const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight
            }
        }
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleFileSelect = (files: FileList | null) => {
        if (!files) return

        const validFiles = Array.from(files).filter((file) => {
            const isValidType =
                file.type === "text/plain" ||
                file.type === "text/csv" ||
                file.name.endsWith(".txt") ||
                file.name.endsWith(".csv")
            const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB

            if (!isValidType) {
                toast.error(`${file.name} no es un archivo TXT o CSV válido.`)
                return false
            }

            if (!isValidSize) {
                toast.error(`${file.name} excede el límite de 10MB.`)
                return false
            }

            return true
        })

        setAttachedFiles((prev) => [...prev, ...validFiles])
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
        handleFileSelect(e.dataTransfer.files)
    }

    const removeAttachedFile = (index: number) => {
        setAttachedFiles((prev) => prev.filter((_, i) => i !== index))
    }

    const handleSendMessage = async () => {
        if ((!inputMessage.trim() && attachedFiles.length === 0) || isLoading) return


        if (inputMessage.trim()) {
            addUserMessage(inputMessage)
            sendMessage({
                message: inputMessage,
                useKnowledgeBase,
                files: attachedFiles,
            })
        }

        setInputMessage("")
        setAttachedFiles([])
    }


    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    return (
        <div
            className="flex flex-col h-[650px]"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >

            <CardContent className="flex-1 p-0">
                <ScrollArea ref={scrollAreaRef} className="h-full px-6">
                    <div className="space-y-6 py-4">
                        {messages.length === 0 && (
                            <div className="text-center py-39">
                                <div className="mb-6">
                                    <Avatar className="h-16 w-16 mx-auto">
                                        <AvatarFallback className="bg-gradient-to-br from-[#64CF76] to-[#4263C8] text-white">
                                            <Sparkles className="h-8 w-8" />
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                                <h3 className="text-lg font-semibold text-foreground mb-2">¡Hola! Soy tu asistente de IA</h3>
                                <p className="text-muted-foreground max-w-md mx-auto">
                                    Estoy aquí para ayudarte con cualquier pregunta. Puedes subir archivos TXT o CSV directamente en el
                                    chat.
                                </p>
                            </div>
                        )}

                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                {message.role === "assistant" && (
                                    <Avatar className="h-8 w-8 flex-shrink-0">
                                        <AvatarFallback className="bg-gradient-to-br from-[#64CF76] to-[#4263C8] text-white">
                                            <Bot className="h-4 w-4" />
                                        </AvatarFallback>
                                    </Avatar>
                                )}

                                <div
                                    className={`max-w-[75%] rounded-2xl px-4 py-3 ${message.role === "user"
                                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                                        : "bg-muted border shadow-sm"
                                        }`}
                                >
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                                    <p className={`text-xs mt-2 ${message.role === "user" ? "text-blue-100" : "text-muted-foreground"}`}>
                                        {new Date(message.timestamp).toLocaleTimeString()}
                                    </p>
                                </div>

                                {message.role === "user" && (
                                    <Avatar className="h-8 w-8 flex-shrink-0">
                                        <AvatarFallback className="bg-gradient-to-br from-slate-600 to-slate-700 text-white">
                                            <User className="h-4 w-4" />
                                        </AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex gap-4 justify-start">
                                <Avatar className="h-8 w-8 flex-shrink-0">
                                    <AvatarFallback className="bg-gradient-to-br from-[#64CF76] to-[#4263C8] text-white">
                                        <Bot className="h-4 w-4" />
                                    </AvatarFallback>
                                </Avatar>
                                <div className="bg-muted border rounded-2xl px-4 py-3 shadow-sm">
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                                        <span className="text-sm text-muted-foreground">
                                            {useStreaming ? "Escribiendo..." : "Pensando..."}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>

            <div
                className={`p-6 pt-4 border-t bg-muted/30 transition-colors ${isDragOver ? "bg-blue-50 dark:bg-blue-950/20 border-blue-300" : ""}`}
            >
                {attachedFiles.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                        {attachedFiles.map((file, index) => (
                            <div key={index} className="flex items-center gap-2 bg-background border rounded-lg px-3 py-2 text-sm">
                                <FileText className="h-4 w-4 text-blue-500" />
                                <span className="truncate max-w-32">{file.name}</span>
                                <Button
                                    onClick={() => removeAttachedFile(index)}
                                    variant="ghost"
                                    size="sm"
                                    className="h-4 w-4 p-0 hover:bg-red-100 hover:text-red-600"
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}

                {/* <div className="flex gap-3">
                    <div className="flex-1 relative">
                        <Input
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={
                                attachedFiles.length > 0 ? "Mensaje opcional..." : "Escribe tu mensaje o arrastra archivos TXT/CSV..."
                            }
                            disabled={isLoading || isUploading}
                            className="bg-background border-2 focus:border-blue-500 transition-colors pr-12"
                        />
                        <Button
                            onClick={() => fileInputRef.current?.click()}
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                            disabled={isLoading || isUploading}
                        >
                            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Paperclip className="h-4 w-4" />}
                        </Button>
                    </div>
                    <Button
                        onClick={handleSendMessage}
                        disabled={(!inputMessage.trim() && attachedFiles.length === 0) || isLoading || isUploading}
                        size="icon"
                        className="bg-gradient-to-r from-[#64CF76] to-[#4263C8] hover:from-blue-600 hover:to-blue-700 shadow-lg h-10 w-10"
                    >
                        {isLoading || isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                </div> */}

                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".txt,.csv,text/plain,text/csv"
                    onChange={(e) => handleFileSelect(e.target.files)}
                    className="hidden"
                />

                {isDragOver && (
                    <div className="absolute inset-0 bg-blue-500/10 border-2 border-dashed border-blue-400 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                            <Upload className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                            <p className="text-blue-600 font-medium">Suelta los archivos aquí</p>
                            <p className="text-blue-500 text-sm">Solo archivos TXT y CSV</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
