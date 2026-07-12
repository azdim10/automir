import { usePageContent, useSiteSettings } from '@entities/content'
import type { Json } from '@shared/api/supabase'
import { getJsonString, isJsonRecord } from '@shared/lib/json'
import { Container, EmptyState, Skeleton, Typography } from '@shared/ui'
import { HomeSections } from '@widgets/home-sections'

interface NewsLabels {
  empty: string
  loadError: string
  loadErrorDescription: string
}

function parseNewsLabels(value: Json | undefined): NewsLabels | null {
  if (!isJsonRecord(value)) {
    return null
  }

  const empty = getJsonString(value, 'empty')
  const loadError = getJsonString(value, 'loadError')
  const loadErrorDescription = getJsonString(value, 'loadErrorDescription')

  if (!empty || !loadError || !loadErrorDescription) {
    return null
  }

  return { empty, loadError, loadErrorDescription }
}

function NewsPageSkeleton() {
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

export function NewsPage() {
  const { data: siteSettings } = useSiteSettings()
  const { data, isError, isLoading } = usePageContent('news')
  const labels = parseNewsLabels(siteSettings?.news_labels)

  if (isLoading || !labels) {
    return <NewsPageSkeleton />
  }

  if (isError || !data) {
    return (
      <main className="py-12">
        <Container>
          <EmptyState
            description={labels.loadErrorDescription}
            title={labels.loadError}
          />
        </Container>
      </main>
    )
  }

  if (data.sections.length === 0) {
    return (
      <main className="py-12">
        <Container>
          <Typography as="h1" variant="h1" weight="bold">
            {data.page.title}
          </Typography>
          <div className="mt-8">
            <EmptyState title={labels.empty} />
          </div>
        </Container>
      </main>
    )
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
