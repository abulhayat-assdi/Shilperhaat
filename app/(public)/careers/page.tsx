import StaticPage from '@/components/layout/StaticPage'
import { getPage } from '@/lib/pages-data'

export const metadata = { title: 'Careers - Shilperhaat' }

export default function CareersPage() {
  const page = getPage('careers')!
  return <StaticPage title={page.title} subtitle={page.subtitle} sections={page.sections} />
}
