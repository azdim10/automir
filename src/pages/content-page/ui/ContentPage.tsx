import { useParams } from 'react-router'

import { usePageContent } from '@entities/content'
import { Container, Skeleton, Typography } from '@shared/ui'
import { HomeSections } from '@widgets/home-sections'

function ContentPageSkeleton() {
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

export function ContentPage() {
  const { slug } = useParams()
  const { data, isError, isLoading } = usePageContent(slug)

  if (isLoading || isError || !data || data.sections.length === 0) {
    return <ContentPageSkeleton />
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
