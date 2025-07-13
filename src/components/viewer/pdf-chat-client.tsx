"use client";

import { useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { pdfChatbot } from "@/ai/flows/pdf-chatbot";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Upload, Send, Bot, User, Loader2, KeyRound } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

interface ChatMessage {
  role: "user" | "bot";
  content: string;
}

const ApiKeySchema = z.object({
  apiKey: z.string().min(1, "API Key is required."),
});

export function PdfChatClient() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfDataUri, setPdfDataUri] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ApiKeySchema),
    defaultValues: { apiKey: "" },
  });

  useEffect(() => {
    const storedKey = localStorage.getItem("geminiApiKey");
    if (storedKey) {
      setApiKey(storedKey);
    } else {
      setIsApiKeyModalOpen(true);
    }
  }, []);

  const handleApiKeySubmit = (data: z.infer<typeof ApiKeySchema>) => {
    localStorage.setItem("geminiApiKey", data.apiKey);
    setApiKey(data.apiKey);
    setIsApiKeyModalOpen(false);
    toast({
      title: "API Key Saved",
      description: "Your Gemini API Key has been saved in your browser.",
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPdfDataUri(e.target?.result as string);
        setChatHistory([]); // Reset chat on new file
      };
      reader.readAsDataURL(file);
    } else {
      toast({
        variant: "destructive",
        title: "Invalid File Type",
        description: "Please upload a valid PDF file.",
      });
    }
  };

  const handleQuestionSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!pdfDataUri || isLoading || !apiKey) return;
    
    const formData = new FormData(event.currentTarget);
    const question = formData.get("question") as string;
    if (!question.trim()) return;

    (event.target as HTMLFormElement).reset();

    setIsLoading(true);
    setChatHistory((prev) => [...prev, { role: "user", content: question }]);

    try {
      const result = await pdfChatbot({
        pdfDataUri: pdfDataUri,
        question: question,
        geminiApiKey: apiKey,
      });
      setChatHistory((prev) => [...prev, { role: "bot", content: result.answer }]);
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      setChatHistory((prev) => [
        ...prev,
        { role: "bot", content: `Error: ${errorMessage}` },
      ]);
      toast({
        variant: "destructive",
        title: "Chatbot Error",
        description: "Could not get a response. Please check your API key and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="font-headline">Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => setIsApiKeyModalOpen(true)} className="w-full">
              <KeyRound className="mr-2 h-4 w-4" />
              Update API Key
            </Button>
            <Button onClick={() => fileInputRef.current?.click()} className="w-full" variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              {pdfFile ? 'Change PDF' : 'Upload PDF'}
            </Button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="application/pdf" className="hidden" />
            {pdfFile && (
              <Alert>
                <AlertTitle>PDF Loaded</AlertTitle>
                <AlertDescription className="text-sm break-all">{pdfFile.name}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline">Chat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col h-[60vh]">
              <ScrollArea className="flex-grow p-4 border rounded-md mb-4">
                {chatHistory.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    <p>{pdfFile ? "Ask a question about the PDF to start." : "Upload a PDF to begin."}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {chatHistory.map((msg, index) => (
                      <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        {msg.role === 'bot' && <div className="p-2 bg-primary rounded-full text-primary-foreground"><Bot size={16} /></div>}
                        <div className={`p-3 rounded-lg max-w-sm ${msg.role === 'user' ? 'bg-secondary' : 'bg-card border'}`}>
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        </div>
                         {msg.role === 'user' && <div className="p-2 bg-secondary rounded-full"><User size={16} /></div>}
                      </div>
                    ))}
                    {isLoading && (
                       <div className="flex items-start gap-3">
                          <div className="p-2 bg-primary rounded-full text-primary-foreground"><Bot size={16} /></div>
                          <div className="p-3 rounded-lg bg-card border"><Loader2 className="animate-spin" /></div>
                       </div>
                    )}
                  </div>
                )}
              </ScrollArea>
              <form onSubmit={handleQuestionSubmit} className="flex gap-2">
                <Textarea
                  name="question"
                  placeholder={pdfFile ? "Ask a question..." : "Please upload a PDF first"}
                  rows={1}
                  className="flex-grow resize-none"
                  disabled={!pdfFile || isLoading}
                />
                <Button type="submit" disabled={!pdfFile || isLoading}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isApiKeyModalOpen} onOpenChange={setIsApiKeyModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Gemini API Key</DialogTitle>
            <DialogDescription>
              To use the chatbot, you need a Gemini API key. You can get one from Google AI Studio. The key is stored securely in your browser's local storage.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleApiKeySubmit)}>
            <div className="space-y-2">
              <Controller
                name="apiKey"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="Your Gemini API Key" type="password" />
                )}
              />
              {errors.apiKey && <p className="text-sm text-destructive">{errors.apiKey.message}</p>}
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit">Save Key</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
