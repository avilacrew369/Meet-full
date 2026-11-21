

import FeaturedCommunities from "@/src/features/communities/components/FeaturedCommunities";
import CategoryList from "@/src/features/meetis/components/CategoryList";
import UpcomingMeetis from "@/src/features/meetis/components/UpcomingMeetis";
import { auth } from "@/src/lib/auth";
import Hero from "@/src/shared/components/ui/Hero";
import { generatePageTitle } from "@/src/shared/utils/metadata";
import { Metadata } from "next";
import { headers } from "next/headers";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: generatePageTitle('Inicio')
};

export default async function Home() {

  return (
    <>
      
      <Hero />

      <Suspense fallback={<main className="max-w-7xl mx-auto py-10 px-5 lg:px-0"><p className="text-center text-lg text-gray-600">Cargando proximos meetis...</p></main>}>
        <UpcomingMeetis />
        <FeaturedCommunities />
        <CategoryList />
      </Suspense>
    </>
  );
}