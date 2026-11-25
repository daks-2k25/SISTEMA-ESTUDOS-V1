import { Suspense } from "react";
import {
  DashboardSection,
  type DashboardSearchParams,
} from "@/components/features/dashboard-section";

interface HomePageProps {
  searchParams: DashboardSearchParams;
}

export default function HomePage({ searchParams }: HomePageProps) {
  return (
    <Suspense
      fallback={
        <p className="px-6 py-10 text-center text-slate-400">Carregando o dia de estudo...</p>
      }
    >
      <DashboardSection searchParams={searchParams} />
    </Suspense>
  );
}
