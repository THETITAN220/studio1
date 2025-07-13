
"use client";

import type { Material } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "./ui/button";
import { useBackpack } from "@/contexts/backpack";
import { BookPlus, CheckCircle } from "lucide-react";

export function MaterialClient({ material }: { material: Material }) {
  const { addToBackpack, isItemInBackpack } = useBackpack();
  const isInBackpack = isItemInBackpack(material.id);

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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">{material.title}</h1>
          <div className="flex items-center gap-2 text-muted-foreground mt-2">
            <Badge variant="outline">{material.type}</Badge>
            <Badge variant="secondary">{material.subject}</Badge>
            <Badge variant="secondary">Sem {material.semester}</Badge>
            <Badge variant="secondary">{material.year}</Badge>
          </div>
        </div>
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

      <Card>
        <CardHeader>
          <CardTitle>Document Preview</CardTitle>
          <CardDescription>This is a sample preview of the document content.</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg text-sm text-muted-foreground whitespace-pre-wrap font-sans">
            {sampleContent[material.type].trim()}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
