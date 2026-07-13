import { usePageContent } from '@entities/content'
import { Container, EmptyState, Skeleton } from '@shared/ui'
import { HomeSections } from '@widgets/home-sections'

interface StaticContentPageProps {
  slug: string
}

function StaticContentPageSkeleton() {
  return (
    <main className="py-12">
      <Container>
        <Skeleton className="h-10 w-full max-w-md" />
        <div className="mt-8 grid gap-4">
          <Skeleton className="h-64" />
          <Skeleton className="h-40" />
        </div>
      </Container>
    </main>
  )
}

export function StaticContentPage({ slug }: StaticContentPageProps) {
  const { data, isError, isLoading } = usePageContent(slug)

  if (isLoading) {
    return <StaticContentPageSkeleton />
  }

  if (isError || !data || data.sections.length === 0) {
    return (
      <main className="py-12">
        <Container>
          <EmptyState title={data?.page.title ?? slug} />
        </Container>
      </main>
    )
  }

  return (
    <main>
      <HomeSections sections={data.sections} />
    </main>
  )
}
