import { MainLayout } from "@/components/main-layout";
import { PdfChatClient } from "@/components/viewer/pdf-chat-client";

export default function ViewerPage() {
  return (
    <MainLayout>
       <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">PDF Chatbot</h1>
          <p className="text-muted-foreground">Upload a PDF and ask questions about its content using AI.</p>
        </div>
        <PdfChatClient />
      </div>
    </MainLayout>
  );
}
