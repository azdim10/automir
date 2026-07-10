import type { PageSection } from '@entities/content'

import {
  parseBannerPayload,
  parseFeatureGridPayload,
  parseHeroPayload,
  parseImageTextPayload,
} from '../model/homeSectionPayload'
import { BannerSection } from './BannerSection'
import { FeatureGridSection } from './FeatureGridSection'
import { HeroSection } from './HeroSection'
import { ImageTextSection } from './ImageTextSection'

interface HomeSectionRendererProps {
  section: PageSection
}

export function HomeSectionRenderer({ section }: HomeSectionRendererProps) {
  if (section.type === 'hero') {
    const payload = parseHeroPayload(section.payload)
    return payload ? <HeroSection payload={payload} /> : null
  }

  if (section.type === 'banner') {
    const payload = parseBannerPayload(section.payload)
    return payload ? <BannerSection payload={payload} /> : null
  }

  if (section.type === 'image_text') {
    const payload = parseImageTextPayload(section.payload)
    return payload ? <ImageTextSection payload={payload} /> : null
  }

  if (section.type === 'feature_grid') {
    const payload = parseFeatureGridPayload(section.payload)
    return payload ? <FeatureGridSection payload={payload} /> : null
  }

  return null
}
