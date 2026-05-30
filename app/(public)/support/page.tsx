import StaticPage from '@/components/layout/StaticPage'
import { getPage } from '@/lib/pages-data'

export const metadata = { title: 'Support Center - Shilperhaat' }

export default function SupportPage() {
  const page = getPage('support')!
  return <StaticPage title={page.title} subtitle={page.subtitle} sections={page.sections} />
}
