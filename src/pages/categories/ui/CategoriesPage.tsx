import { Link } from 'react-router'

import { useCategories } from '@entities/category'
import { useSiteSettings } from '@entities/content'
import type { Json } from '@shared/api/supabase'
import { getJsonString, isJsonRecord } from '@shared/lib/json'
import {
  Card,
  CardContent,
  Container,
  EmptyState,
  Skeleton,
  Typography,
} from '@shared/ui'

interface CategoriesLabels {
  description: string
  empty: string
  title: string
}

function parseCategoriesLabels(value: Json | undefined): CategoriesLabels | null {
  if (!isJsonRecord(value)) {
    return null
  }

  const description = getJsonString(value, 'description')
  const empty = getJsonString(value, 'empty')
  const title = getJsonString(value, 'title')

  if (!description || !empty || !title) {
    return null
  }

  return { description, empty, title }
}

function CategoriesPageSkeleton() {
  return (
    <main className="py-10">
      <Container>
        <Skeleton className="h-10 w-full max-w-sm" />
        <Skeleton className="mt-3 h-5 w-full max-w-md" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </Container>
    </main>
  )
}

export function CategoriesPage() {
  const { data: siteSettings } = useSiteSettings()
  const { data: categories = [], isLoading } = useCategories()
  const labels = parseCategoriesLabels(siteSettings?.categories_labels)

  if (isLoading || !labels) {
    return <CategoriesPageSkeleton />
  }

  return (
    <main className="py-10">
      <Container>
        <div className="grid gap-2">
          <Typography as="h1" variant="h1" weight="bold">
            {labels.title}
          </Typography>
          <Typography className="text-slate-500" variant="body">
            {labels.description}
          </Typography>
        </div>

        {categories.length === 0 ? (
          <div className="mt-8">
            <EmptyState title={labels.empty} />
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                className="block h-full"
                key={category.id}
                to={`/catalog/${category.slug}`}
              >
                <Card className="h-full transition-shadow hover:shadow-md" padding="none">
                  {category.imageUrl ? (
                    <img
                      className="aspect-video w-full rounded-t-lg object-cover"
                      src={category.imageUrl}
                      alt={category.name}
                    />
                  ) : null}
                  <CardContent className="grid gap-2 p-4">
                    <Typography as="h2" variant="h3" weight="semibold">
                      {category.name}
                    </Typography>
                    {category.description ? (
                      <Typography className="text-slate-600" variant="body-sm">
                        {category.description}
                      </Typography>
                    ) : null}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </main>
  )
}
