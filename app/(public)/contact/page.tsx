import StaticPage from '@/components/layout/StaticPage'
import { getPage } from '@/lib/pages-data'

export const metadata = { title: 'Contact Us - Shilperhaat' }

export default function ContactPage() {
  const page = getPage('contact')!
  return <StaticPage title={page.title} subtitle={page.subtitle} sections={page.sections} />
}
