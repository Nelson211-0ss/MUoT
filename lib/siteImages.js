/**
 * Homepage images: hero carousel stays local under `public/images/`.
 * Spotlight, CTA, and program cards use Unsplash (see `images.remotePatterns` in next.config.mjs).
 */
const unsplash = (id, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`

export const homeHeroSlides = [
  { src: '/images/student1.png', alt: 'MUT student learning with laptop' },
  { src: '/images/student2.png', alt: 'MUT student working online at Magwi University' },
]

export const homeSpotlight = {
  src: unsplash('photo-1523580494863-6f3031224c94', 1200),
  alt: 'Graduates celebrating academic achievement',
}

export const homeCtaBackgroundSrc = unsplash('photo-1519389950473-47ba0277781c', 1600)

export const homeProgramCovers = {
  software: unsplash('photo-1498050108023-c5249f4df085', 900),
  cybersecurity: unsplash('photo-1550751827-4bd374c3f58b', 900),
  dataScience: unsplash('photo-1551288049-bebda4e38f71', 900),
  cloud: unsplash('photo-1451187580459-43490279c0fa', 900),
}
