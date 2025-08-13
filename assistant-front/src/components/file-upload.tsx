"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Upload, FileText, File, CheckCircle, AlertCircle, X, Eye, EyeOff } from "lucide-react"
import { usePlatform } from "@/lib/hooks/use-plaform"

interface FilePreview {
    file: File
    content: string
    type: "txt" | "csv"
    size: string
}

export function FileUpload() {
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
    const [uploadMessage, setUploadMessage] = useState("")
    const [isDragOver, setIsDragOver] = useState(false)
    const [filePreviews, setFilePreviews] = useState<FilePreview[]>([])
    const [showPreview, setShowPreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const { uploadFile } = usePlatform();

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
        const files = Array.from(e.dataTransfer.files)
        handleFiles(files)
    }, [])

    const validateAndPreviewFiles = async (files: File[]): Promise<FilePreview[]> => {
        const validFiles: FilePreview[] = []
        const maxSize = 10 * 1024 * 1024 // 10MB

        for (const file of files) {
            const fileName = file.name.toLowerCase()
            if (!fileName.endsWith(".txt") && !fileName.endsWith(".csv")) {
                setUploadStatus("error")
                setUploadMessage(`Archivo "${file.name}" no es válido. Solo se permiten archivos TXT y CSV.`)
                continue
            }

            if (file.size > maxSize) {
                setUploadStatus("error")
                setUploadMessage(`Archivo "${file.name}" es demasiado grande. Máximo 10MB permitido.`)
                continue
            }

            try {
                const content = await file.text()
                const fileType = fileName.endsWith(".csv") ? "csv" : "txt"
                const size = formatFileSize(file.size)

                validFiles.push({
                    file,
                    content,
                    type: fileType,
                    size,
                })
            } catch (error) {
                setUploadStatus("error")
                setUploadMessage(`Error al leer el archivo "${file.name}"`)
            }
        }

        return validFiles
    }

    const handleFiles = async (files: File[]) => {
        if (files.length === 0) return

        const previews = await validateAndPreviewFiles(files)
        setFilePreviews(previews)

        if (previews.length === 0) {
            return
        }

        setUploadStatus("idle")
        setUploadMessage("")
    }

    const handleFileSelect = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || [])
        await handleFiles(files)
    }

    const uploadFiles = async () => {
        if (filePreviews.length === 0) return

        setIsUploading(true)
        setUploadProgress(0)
        setUploadStatus("idle")

        const totalFiles = filePreviews.length
        let uploadedFiles = 0
        const results: string[] = []

        for (const preview of filePreviews) {
            try {
                const fileProgressStart = (uploadedFiles / totalFiles) * 100
                const fileProgressEnd = ((uploadedFiles + 1) / totalFiles) * 100

                const progressInterval = setInterval(() => {
                    setUploadProgress((prev) => {
                        const targetProgress = fileProgressStart + (fileProgressEnd - fileProgressStart) * 0.8
                        return Math.min(prev + 2, targetProgress)
                    })
                }, 100)

                const response = await uploadFile({ file: preview.file, type: preview.type })

                console.log({response})
                clearInterval(progressInterval)

                if (response.success) {
                    uploadedFiles++
                    setUploadProgress(fileProgressEnd)
                } else {
                }
            } catch (error) {
                results.push(`${preview.file.name}: Error de conexión`)
            }
        }

        setUploadProgress(100)
        console.log(uploadedFiles)

        if (uploadedFiles === totalFiles) {
            setUploadStatus("success")
            setUploadMessage(`${uploadedFiles} archivo(s) subido(s) exitosamente`)
        } else if (uploadedFiles > 0) {
            setUploadStatus("success")
            setUploadMessage(`${uploadedFiles}/${totalFiles} archivos subidos. Algunos fallaron.`)
        } else {
            setUploadStatus("error")
            setUploadMessage("Error al subir todos los archivos")
        }

        setTimeout(() => {
            setFilePreviews([])
            setUploadProgress(0)
            setUploadStatus("idle")
            setUploadMessage("")
            if (fileInputRef.current) {
                fileInputRef.current.value = ""
            }
        }, 3000)

        setIsUploading(false)
    }

    const removeFilePreview = (index: number) => {
        setFilePreviews((prev) => prev.filter((_, i) => i !== index))
    }

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    }

    const togglePreview = (fileName: string) => {
        setShowPreview(showPreview === fileName ? null : fileName)
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Upload className="h-5 w-5" />
                        Subir Base de Conocimiento
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div
                        className={`text-center py-8 border-2 border-dashed rounded-lg transition-colors ${isDragOver ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-slate-300 dark:border-slate-600"
                            }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <div className="flex flex-col items-center gap-4">
                            <div
                                className={`p-4 rounded-full ${isDragOver ? "bg-blue-100 dark:bg-blue-800" : "bg-blue-50 dark:bg-blue-900/20"}`}
                            >
                                <Upload className={`h-8 w-8 ${isDragOver ? "text-blue-700" : "text-blue-600"}`} />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">
                                    {isDragOver ? "Suelta los archivos aquí" : "Arrastra archivos aquí o haz clic para seleccionar"}
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                    Formatos soportados: TXT, CSV (máximo 10MB cada uno)
                                </p>
                                <Button onClick={handleFileSelect} disabled={isUploading}>
                                    Seleccionar Archivos
                                </Button>
                            </div>
                        </div>
                    </div>

                    {filePreviews.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="font-medium">Archivos seleccionados ({filePreviews.length})</h4>
                            {filePreviews.map((preview, index) => (
                                <Card key={index} className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 flex-1">
                                            {preview.type === "csv" ? (
                                                <File className="h-5 w-5 text-green-600" />
                                            ) : (
                                                <FileText className="h-5 w-5 text-blue-600" />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <h5 className="font-medium truncate">{preview.file.name}</h5>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge variant="secondary" className="text-xs">
                                                        {preview.type.toUpperCase()}
                                                    </Badge>
                                                    <span className="text-xs text-slate-500">{formatFileSize(parseInt(preview.size))}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button onClick={() => togglePreview(preview.file.name)} variant="outline" size="sm">
                                                {showPreview === preview.file.name ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </Button>
                                            <Button
                                                onClick={() => removeFilePreview(index)}
                                                variant="outline"
                                                size="sm"
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    {showPreview === preview.file.name && (
                                        <div className="mt-3">
                                            <Textarea
                                                value={preview.content.substring(0, 500) + (preview.content.length > 500 ? "..." : "")}
                                                readOnly
                                                className="h-32 text-xs font-mono"
                                            />
                                            <p className="text-xs text-slate-500 mt-1">
                                                Mostrando {Math.min(500, preview.content.length)} de {preview.content.length} caracteres
                                            </p>
                                        </div>
                                    )}
                                </Card>
                            ))}
                            <Button onClick={uploadFiles} disabled={isUploading} className="w-full">
                                {isUploading ? "Subiendo..." : `Subir ${filePreviews.length} archivo(s)`}
                            </Button>
                        </div>
                    )}

                    {isUploading && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Subiendo archivos...</span>
                                <span>{Math.round(uploadProgress)}%</span>
                            </div>
                            <Progress value={uploadProgress} className="w-full" />
                        </div>
                    )}

                    {uploadStatus !== "idle" && (
                        <div
                            className={`flex items-center gap-2 p-3 rounded-lg ${uploadStatus === "success"
                                    ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                                    : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                                }`}
                        >
                            {uploadStatus === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                            <span className="text-sm">{uploadMessage}</span>
                        </div>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".txt,.csv"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </CardContent>
            </Card>

        </div>
    )
}
