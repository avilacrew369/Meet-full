import Heading from "@/src/shared/components/typography/Heading"
import { Suspense } from "react"


export default async function CategoryPage({ params }: PageProps<'/categories/[id]'>) {
  const { id } = await params


  return (
    <Suspense>
    <main className="max-w-7xl mx-auto px-5 lg:px-0 py-10">
      <Heading className="text-center">Meetis en la categoria de : </Heading>
    </main>
    </Suspense>
  )
}