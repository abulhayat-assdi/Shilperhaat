import StaticPage from '@/components/layout/StaticPage'
import { getPage } from '@/lib/pages-data'

export const metadata = { title: 'Privacy Policy - Shilperhaat' }

export default function PrivacyPolicyPage() {
  const page = getPage('privacy-policy')!
  return <StaticPage title={page.title} subtitle={page.subtitle} sections={page.sections} />
}
