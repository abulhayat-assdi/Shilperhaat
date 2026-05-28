import StaticPage from '@/components/layout/StaticPage'
import { getPage } from '@/lib/pages-data'

export const metadata = { title: 'How to Order - Shilperhaat' }

export default function HowToOrderPage() {
  const page = getPage('how-to-order')!
  return <StaticPage title={page.title} subtitle={page.subtitle} section1={page.section1} section2={page.section2} />
}
