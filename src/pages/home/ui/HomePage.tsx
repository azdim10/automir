import { usePageContent } from '@entities/content'
import { Container, Skeleton, Typography } from '@shared/ui'
import { HomeSections } from '@widgets/home-sections'

function HomePageSkeleton() {
  return (
    <main className="py-12">
      <Container>
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="grid content-center gap-4">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-12 w-full max-w-xl" />
            <Skeleton className="h-6 w-full max-w-lg" />
            <Skeleton className="h-6 w-3/4 max-w-md" />
            <div className="flex gap-3">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
          <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </Container>
    </main>
  )
}

export function HomePage() {
  const { data, isError, isLoading } = usePageContent('home')

  if (isLoading || isError || !data || data.sections.length === 0) {
    return <HomePageSkeleton />
  }

  return (
    <main>
      <Container className="sr-only">
        <Typography as="h1" variant="h1" weight="bold">
          {data.page.title}
        </Typography>
      </Container>
      <HomeSections sections={data.sections} />
    </main>
  )
}
