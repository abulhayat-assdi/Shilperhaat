import StaticPage from '@/components/layout/StaticPage'
import { getPage } from '@/lib/pages-data'

export const metadata = { title: 'Press - Shilperhaat' }

export default function PressPage() {
  const page = getPage('press')!
  return <StaticPage title={page.title} subtitle={page.subtitle} section1={page.section1} section2={page.section2} />
}
