import { MainLayout } from "@/components/main-layout";
import { DashboardClient } from "@/components/dashboard-client";

export default function Home() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your academic world at a glance.</p>
        </div>
        <DashboardClient />
      </div>
    </MainLayout>
  );
}
