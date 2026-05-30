import StaticPage from '@/components/layout/StaticPage'
import { getPage } from '@/lib/pages-data'

export const metadata = { title: 'FAQ - Shilperhaat' }

export default function FAQPage() {
  const page = getPage('faq')!
  return <StaticPage title={page.title} subtitle={page.subtitle} sections={page.sections} />
}
