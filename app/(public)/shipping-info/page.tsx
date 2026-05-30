import StaticPage from '@/components/layout/StaticPage'
import { getPage } from '@/lib/pages-data'

export const metadata = { title: 'Shipping Info - Shilperhaat' }

export default function ShippingInfoPage() {
  const page = getPage('shipping-info')!
  return <StaticPage title={page.title} subtitle={page.subtitle} sections={page.sections} />
}
