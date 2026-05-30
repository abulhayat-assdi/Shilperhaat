import StaticPage from '@/components/layout/StaticPage'
import { getPage } from '@/lib/pages-data'

export const metadata = { title: 'About Us - Shilperhaat' }

export default function AboutPage() {
  const page = getPage('about')!
  return <StaticPage title={page.title} subtitle={page.subtitle} sections={page.sections} />
}
