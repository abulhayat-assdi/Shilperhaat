import StaticPage from '@/components/layout/StaticPage'
import { getPage } from '@/lib/pages-data'

export const metadata = { title: 'Terms of Use - Shilperhaat' }

export default function TermsOfUsePage() {
  const page = getPage('terms-of-use')!
  return <StaticPage title={page.title} subtitle={page.subtitle} section1={page.section1} section2={page.section2} />
}
