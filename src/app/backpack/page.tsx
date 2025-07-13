
"use client";

import Link from "next/link";
import { MainLayout } from "@/components/main-layout";
import { useBackpack } from "@/contexts/backpack";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { Material } from "@/lib/types";

export default function BackpackPage() {
  const { backpackItems } = useBackpack();

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">My Backpack</h1>
          <p className="text-muted-foreground">All your saved materials in one place. Click on a card to view.</p>
        </div>

        {backpackItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {backpackItems.map((item) => (
              <BackpackItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-20 border-2 border-dashed rounded-lg">
            <h2 className="text-xl font-semibold">Your Backpack is Empty</h2>
            <p className="text-muted-foreground mt-2">Add materials from the dashboard to see them here.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

function BackpackItemCard({ item }: { item: Material }) {
  const { removeFromBackpack } = useBackpack();

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeFromBackpack(item.id);
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
            variant="destructive"
            className="w-full" 
            onClick={handleRemove}
          >
            <Trash2 />
            <span>Remove</span>
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}
