import { Suspense } from "react";
import {
  DashboardSection,
  type DashboardSearchParams,
} from "@/components/features/dashboard-section";
import { RouteLoading } from "@/components/features/route-loading";

interface HomePageProps {
  searchParams: DashboardSearchParams;
}

export default function HomePage({ searchParams }: HomePageProps) {
  return (
    <Suspense fallback={<RouteLoading area="o dia de estudo" />}>
      <DashboardSection searchParams={searchParams} />
    </Suspense>
  );
}
