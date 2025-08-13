"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { FileText, File, Trash2, RefreshCw, Database, Search, BarChart3, ChevronLeft, ChevronRight } from "lucide-react"
import type { FileInfo, KnowledgeBaseFilters, PaginationInfo } from "@/lib/api/types"
import { useKnowledgeBase } from "@/lib/hooks/use-plaform"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"

export function KnowledgeBasePanel() {
    const [knowledgeBase, setKnowledgeBase] = useState<FileInfo[]>([])
    const [pagination, setPagination] = useState<PaginationInfo>({
        page: 1,
        size: 10,
        total: 0,
    })
    const [knowledgeBaseFilters, setKnowledgeBaseFilters] = useState<KnowledgeBaseFilters>({})
    const [searchQuery, setSearchQuery] = useState("")
    const { data: filesData, isLoading} = useKnowledgeBase(knowledgeBaseFilters);

    useEffect(() => {
        if (filesData) {
            setKnowledgeBase(filesData.files)
            setPagination(filesData.pagination)
        }
    }, [filesData])

    const loadKnowledgeBase = async () => {
        setSearchQuery("");
        setKnowledgeBaseFilters({})
    }

    const handleSearch = () => {
        setKnowledgeBaseFilters({
            page: 1,
            size: 10,
            query: searchQuery,
        })
    }

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            if (searchQuery.trim()) {
                handleSearch()
            }
        }, 500)

        return () => clearTimeout(debounceTimer)
    }, [searchQuery])

    const getFileIcon = (type: string) => {
        switch (type) {
            case "csv":
                return <File className="h-5 w-5 text-green-600" />
            case "txt":
            default:
                return <FileText className="h-5 w-5 text-blue-600" />
        }
    }

    const goToPage = (page: number) => {
        setKnowledgeBaseFilters((prev) => ({ ...prev, page }))
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Search className="h-5 w-5" />
                        Buscar en Base de Conocimiento
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2">
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar archivos por nombre o contenido..."
                            className="flex-1"
                        />
                        <Button onClick={handleSearch} disabled={isLoading} variant="outline">
                            {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                        </Button>
                    </div>
                    {searchQuery.trim() && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                            {knowledgeBase.length} resultado(s) para "{searchQuery}"
                        </p>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Database className="h-5 w-5" />
                            Base de Conocimiento
                        </CardTitle>
                        <Button onClick={loadKnowledgeBase} disabled={isLoading} variant="outline" size="sm">
                            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                            Actualizar
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {knowledgeBase.length === 0 ? (
                        <div className="text-center py-12">
                            <Database className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">
                                {searchQuery.trim() ? "No se encontraron resultados" : "No hay archivos en la base de conocimiento"}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-4">
                                {searchQuery.trim()
                                    ? "Intenta con otros términos de búsqueda"
                                    : "Sube archivos TXT o CSV para comenzar a personalizar tu asistente"}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="border rounded-lg">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-12"></TableHead>
                                            <TableHead>Archivo</TableHead>
                                            <TableHead>Tipo</TableHead>
                                            <TableHead>Tamaño</TableHead>
                                            <TableHead>Fecha</TableHead>
                                            <TableHead>Vista Previa</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {knowledgeBase.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>{getFileIcon(item.file_type)}</TableCell>
                                                <TableCell className="font-medium">
                                                    <div className="max-w-[200px] truncate" title={item.original_filename}>
                                                        {item.original_filename}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary" className="text-xs">
                                                        {item.file_type.toUpperCase()}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-sm text-slate-600">{item.file_size}</TableCell>
                                                <TableCell className="text-sm text-slate-600">
                                                    {new Date(item.upload_date).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="max-w-[300px] text-xs text-slate-500 truncate">
                                                        {item.content_preview.substring(0, 100)}
                                                        {item.content_preview.length > 100 && "..."}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {pagination.total > 0 && (
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-slate-600 dark:text-slate-400">
                                        Mostrando {(pagination.page - 1) * pagination.size + 1} a{" "}
                                        {Math.min(pagination.page * pagination.size, pagination.total)} de {pagination.total} archivos
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => goToPage(pagination.page - 1)}
                                            disabled={pagination.page === 1}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                            Anterior
                                        </Button>

                                        <div className="flex items-center gap-1">
                                            {Array.from(
                                                { length: Math.min(5, Math.ceil(pagination.total / pagination.size)) },
                                                (_, i) => {
                                                    const totalPages = Math.ceil(pagination.total / pagination.size)
                                                    let pageNum

                                                    if (totalPages <= 5) {
                                                        pageNum = i + 1
                                                    } else if (pagination.page <= 3) {
                                                        pageNum = i + 1
                                                    } else if (pagination.page >= totalPages - 2) {
                                                        pageNum = totalPages - 4 + i
                                                    } else {
                                                        pageNum = pagination.page - 2 + i
                                                    }

                                                    return (
                                                        <Button
                                                            key={pageNum}
                                                            variant={pagination.page === pageNum ? "default" : "outline"}
                                                            size="sm"
                                                            onClick={() => goToPage(pageNum)}
                                                            className="w-8 h-8 p-0"
                                                        >
                                                            {pageNum}
                                                        </Button>
                                                    )
                                                }
                                            )}
                                        </div>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => goToPage(pagination.page + 1)}
                                            disabled={pagination.page === Math.ceil(pagination.total / pagination.size)}
                                        >
                                            Siguiente
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
