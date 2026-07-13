import type { PageSection } from '@entities/content'

import {
  parseBannerPayload,
  parseContentPayload,
  parseFeaturedProductsPayload,
  parseFeatureGridPayload,
  parseHeroPayload,
  parseImageTextPayload,
  parseWelcomePayload,
} from '../model/homeSectionPayload'
import { BannerSection } from './BannerSection'
import { ContentSection } from './ContentSection'
import { FeaturedProductsSection } from './FeaturedProductsSection'
import { FeatureGridSection } from './FeatureGridSection'
import { HeroSection } from './HeroSection'
import { ImageTextSection } from './ImageTextSection'
import { WelcomeSection } from './WelcomeSection'

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

  if (section.type === 'content') {
    const payload = parseContentPayload(section.payload)
    return payload ? <ContentSection payload={payload} /> : null
  }

  if (section.type === 'welcome') {
    const payload = parseWelcomePayload(section.payload)
    return payload ? <WelcomeSection payload={payload} /> : null
  }

  if (section.type === 'featured_products') {
    const payload = parseFeaturedProductsPayload(section.payload)
    return payload ? <FeaturedProductsSection payload={payload} /> : null
  }

  return null
}
