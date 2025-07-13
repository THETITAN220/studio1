"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookPlus, CheckCircle } from "lucide-react";
import { materials, semesters, subjects } from "@/lib/constants";
import type { Material } from "@/lib/types";
import { useBackpack } from "@/contexts/backpack";

export function DashboardClient() {
  const [selectedSemester, setSelectedSemester] = useState<string>("all");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");

  const filteredMaterials = materials.filter((material) => {
    return (
      (selectedSemester === "all" || material.semester.toString() === selectedSemester) &&
      (selectedSubject === "all" || material.subject === selectedSubject) &&
      (selectedType === "all" || material.type === selectedType)
    );
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Semester Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Semester</label>
              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Semesters</SelectItem>
                  {semesters.map((sem) => (
                    <SelectItem key={sem} value={sem.toString()}>
                      Semester {sem}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Subject Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Subject</label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.map((sub) => (
                    <SelectItem key={sub} value={sub}>
                      {sub}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Material Type</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Question Paper">Question Papers</SelectItem>
                  <SelectItem value="Notes">Notes</SelectItem>
                  <SelectItem value="Syllabus">Syllabus</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredMaterials.map((item) => (
          <MaterialCard key={item.id} item={item} />
        ))}
        {filteredMaterials.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">No materials found for the selected filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function MaterialCard({ item }: { item: Material }) {
  const { addToBackpack, isItemInBackpack } = useBackpack();
  const isInBackpack = isItemInBackpack(item.id);

  const handleAddToBackpack = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToBackpack(item);
  }

  return (
    <Link href={`/materials/${item.id}`} className="block hover:shadow-lg transition-shadow rounded-lg">
      <Card className="flex flex-col h-full">
        <CardHeader>
          <CardTitle className="font-headline text-lg">{item.title}</CardTitle>
          <CardDescription>{item.subject} - Sem {item.semester}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-muted-foreground">{item.description}</p>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={handleAddToBackpack}
            disabled={isInBackpack}
            variant={isInBackpack ? "secondary" : "default"}
          >
            {isInBackpack ? <CheckCircle /> : <BookPlus />}
            <span>{isInBackpack ? 'In Backpack' : 'Add to Backpack'}</span>
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}
