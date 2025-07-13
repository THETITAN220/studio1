
"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { pdfChatbot } from "@/ai/flows/pdf-chatbot";
import type { Material } from "@/lib/types";
import { useBackpack } from "@/contexts/backpack";
import { useToast } from "@/hooks/use-toast";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "./ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { BookPlus, CheckCircle, Bot, Send, Loader2, User, KeyRound, MessageCircle } from "lucide-react";

interface ChatMessage {
  role: "user" | "bot";
  content: string;
}

const ApiKeySchema = z.object({
  apiKey: z.string().min(1, "API Key is required."),
});

export function MaterialClient({ material }: { material: Material }) {
  const { addToBackpack, isItemInBackpack } = useBackpack();
  const isInBackpack = isItemInBackpack(material.id);

  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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

  const sampleContent: { [key in Material['type']]: string } = {
    "Question Paper": `
      University: TechVille University
      Examination: End of Semester Examination, ${material.year}
      Course: ${material.subject}
      Semester: ${material.semester}

      Instructions: Answer any FIVE full questions.

      1. a) Explain the core concepts of ${material.subject}. (10 Marks)
         b) What are the main challenges in this field? (10 Marks)

      2. a) Describe the architecture of a system related to ${material.subject}. (12 Marks)
         b) Write a short note on a relevant algorithm or protocol. (8 Marks)

      3. ...
    `,
    "Notes": `
      Chapter 1: Introduction to ${material.subject}
      
      1.1: What is ${material.subject}?
      ${material.subject} is a fundamental area of computer science that deals with...
      
      1.2: Key Terminologies
      - TKO (The Key Object): Represents the primary data structure.
      - PQR (Process Query Rule): A method for accessing TKO.
      
      This document provides a comprehensive overview of ${material.title}.
      Description: ${material.description}
    `,
    "Syllabus": `
      Course Code: CS${material.semester}01
      Course Title: ${material.subject}
      Semester: ${material.semester}

      Module 1: Introduction
      - Overview of the subject
      - Historical context and evolution

      Module 2: Core Concepts
      - Fundamental principles and theories
      - Key algorithms and data structures

      Module 3: Advanced Topics
      - In-depth study of specialized areas
      - Practical applications and case studies
    `
  };

  const documentTextContent = sampleContent[material.type].trim();

  const handleQuestionSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading || !apiKey) return;

    const formData = new FormData(event.currentTarget);
    const question = formData.get("question") as string;
    if (!question.trim()) return;

    (event.target as HTMLFormElement).reset();
    setIsLoading(true);
    setChatHistory((prev) => [...prev, { role: "user", content: question }]);

    try {
      const result = await pdfChatbot({
        documentContent: documentTextContent,
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

  const openChatAssistant = () => {
    if (!apiKey) {
      setIsApiKeyModalOpen(true);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-headline tracking-tight">{material.title}</h1>
            <div className="flex items-center gap-2 text-muted-foreground mt-2 flex-wrap">
              <Badge variant="outline">{material.type}</Badge>
              <Badge variant="secondary">{material.subject}</Badge>
              <Badge variant="secondary">Sem {material.semester}</Badge>
              <Badge variant="secondary">{material.year}</Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
             <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" onClick={openChatAssistant}>
                  <MessageCircle />
                  <span>Chat Assistant</span>
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full md:w-1/2 lg:w-1/3 p-0">
                <div className="flex flex-col h-full">
                  <SheetHeader className="p-4 border-b">
                    <SheetTitle>Chat Assistant</SheetTitle>
                    <SheetDescription>Ask questions about this document.</SheetDescription>
                  </SheetHeader>
                  <div className="flex-grow flex flex-col p-4 gap-4 overflow-y-auto">
                     <ScrollArea className="flex-grow">
                        {chatHistory.length === 0 ? (
                          <div className="flex h-full items-center justify-center text-muted-foreground">
                            <p>Ask a question to start.</p>
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
                  </div>
                   <SheetFooter className="p-4 border-t">
                      <form onSubmit={handleQuestionSubmit} className="flex gap-2 w-full">
                        <Textarea
                          name="question"
                          placeholder="Ask a question..."
                          rows={1}
                          className="flex-grow resize-none"
                          disabled={isLoading}
                        />
                        <Button type="submit" disabled={isLoading}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </form>
                  </SheetFooter>
                </div>
              </SheetContent>
            </Sheet>
            <Button
              onClick={() => addToBackpack(material)}
              disabled={isInBackpack}
              variant={isInBackpack ? "secondary" : "default"}
              className="shrink-0"
            >
              {isInBackpack ? <CheckCircle /> : <BookPlus />}
              <span>{isInBackpack ? 'In Backpack' : 'Add to Backpack'}</span>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Document Preview</CardTitle>
            <CardDescription>This is a sample preview of the document content.</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg text-sm text-muted-foreground whitespace-pre-wrap font-sans">
              {documentTextContent}
            </pre>
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
