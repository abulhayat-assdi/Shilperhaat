import StaticPage from '@/components/layout/StaticPage'
import { getPage } from '@/lib/pages-data'

export const metadata = { title: 'Refund Policy - Shilperhaat' }

export default function RefundPolicyPage() {
  const page = getPage('refund-policy')!
  return <StaticPage title={page.title} subtitle={page.subtitle} sections={page.sections} />
}
