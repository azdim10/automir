import type { PageSection } from '@entities/content'

import { HomeSectionRenderer } from './HomeSectionRenderer'

interface HomeSectionsProps {
  sections: PageSection[]
}

export function HomeSections({ sections }: HomeSectionsProps) {
  return (
    <>
      {sections.map((section) => (
        <HomeSectionRenderer key={section.id} section={section} />
      ))}
    </>
  )
}
