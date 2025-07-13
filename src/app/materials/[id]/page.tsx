import { MainLayout } from "@/components/main-layout";
import { MaterialClient } from "@/components/material-client";
import { materials } from "@/lib/constants";
import { notFound } from "next/navigation";

export default function MaterialPage({ params }: { params: { id: string } }) {
  const material = materials.find((m) => m.id === params.id);

  if (!material) {
    notFound();
  }

  return (
    <MainLayout>
      <MaterialClient material={material} />
    </MainLayout>
  );
}

export async function generateStaticParams() {
  return materials.map((material) => ({
    id: material.id,
  }));
}
