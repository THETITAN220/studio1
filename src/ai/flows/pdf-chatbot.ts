// pdf-chatbot.ts
'use server';

/**
 * @fileOverview PDF Chatbot flow that allows users to ask questions about the content of a document.
 *
 * - pdfChatbot - A function that handles the PDF chatbot process.
 * - PdfChatbotInput - The input type for the pdfChatbot function.
 * - PdfChatbotOutput - The return type for the pdfChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PdfChatbotInputSchema = z.object({
  documentContent: z
    .string()
    .describe(
      "The text content of the document to be analyzed."
    ),
  question: z.string().describe('The question to ask about the PDF document.'),
  geminiApiKey: z.string().describe('The Gemini API key to use for the chatbot.'),
});
export type PdfChatbotInput = z.infer<typeof PdfChatbotInputSchema>;

const PdfChatbotOutputSchema = z.object({
  answer: z.string().describe('The answer to the question about the PDF document.'),
});
export type PdfChatbotOutput = z.infer<typeof PdfChatbotOutputSchema>;

export async function pdfChatbot(input: PdfChatbotInput): Promise<PdfChatbotOutput> {
  process.env.GEMINI_API_KEY = input.geminiApiKey;
  return pdfChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'pdfChatbotPrompt',
  input: {schema: PdfChatbotInputSchema},
  output: {schema: PdfChatbotOutputSchema},
  prompt: `You are a chatbot that answers questions about a document.

  Use the following document content to answer the question.
  Document Content:
  ---
  {{{documentContent}}}
  ---

  Question: {{{question}}}

  Answer:`,
  config: {
    //  Safety settings can be configured here if needed.
  },
});

const pdfChatbotFlow = ai.defineFlow(
  {
    name: 'pdfChatbotFlow',
    inputSchema: PdfChatbotInputSchema,
    outputSchema: PdfChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
