import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Hulu Properties',
    short_name: 'HuluProp',
    description: 'The premier destination for luxury real estate, vehicles, and land.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#064e3b',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
