"use client"

import { useState } from "react"
import { ChatInterface } from "@/components/chat-interface"
import { FileUpload } from "@/components/file-upload"
import { KnowledgeBasePanel } from "@/components/knowledge-base-panel"
import { ThemeToggle } from "@/components/theme-toggle"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Upload, Database, Sparkles } from "lucide-react"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("chat")

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-[#64CF76] to-[#4263C8] rounded-xl shadow-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            {/* <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Asistente ActivaMente
              </h1>
              <p className="text-sm text-muted-foreground">Potenciado por tu base de conocimiento</p>
            </div> */}
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>

        <Card className="shadow-2xl border-1">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="border-b px-6 py-4">
                <TabsList className="grid w-full max-w-md grid-cols-3 bg-foreground/5">
                  <TabsTrigger value="chat" className="flex items-center gap-2 text-sm">
                    <MessageSquare className="h-4 w-4" />
                    <span className="hidden sm:inline">Chat</span>
                  </TabsTrigger>
                  <TabsTrigger value="upload" className="flex items-center gap-2 text-sm">
                    <Upload className="h-4 w-4" />
                    <span className="hidden sm:inline">Archivos</span>
                  </TabsTrigger>
                  <TabsTrigger value="knowledge" className="flex items-center gap-2 text-sm">
                    <Database className="h-4 w-4" />
                    <span className="hidden sm:inline">Base</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="p-6">
                <TabsContent value="chat" className="mt-0 border-1">
                  <ChatInterface />
                </TabsContent>

                <TabsContent value="upload" className="mt-0">
                  <FileUpload />
                </TabsContent>

                <TabsContent value="knowledge" className="mt-0">
                  <KnowledgeBasePanel />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground">
            ActivaMente AI Assistant
          </p>
        </div>
      </div>
    </div>
  )
}
