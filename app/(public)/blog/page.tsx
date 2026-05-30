import StaticPage from '@/components/layout/StaticPage'
import { getPage } from '@/lib/pages-data'

export const metadata = { title: 'Blog - Shilperhaat' }

export default function BlogPage() {
  const page = getPage('blog')!
  return <StaticPage title={page.title} subtitle={page.subtitle} sections={page.sections} />
}
