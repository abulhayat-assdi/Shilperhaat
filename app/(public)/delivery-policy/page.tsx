import StaticPage from '@/components/layout/StaticPage'
import { getPage } from '@/lib/pages-data'

export const metadata = { title: 'Delivery Policy - Shilperhaat' }

export default function DeliveryPolicyPage() {
  const page = getPage('delivery-policy')!
  return <StaticPage title={page.title} subtitle={page.subtitle} section1={page.section1} section2={page.section2} />
}
