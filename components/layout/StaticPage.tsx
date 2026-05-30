import Link from 'next/link'
import type { PageSection } from '@/lib/pages-data'

interface StaticPageProps {
  title: string
  subtitle?: string
  sections?: PageSection[]
  children?: React.ReactNode
}

export default function StaticPage({ title, subtitle, sections, children }: StaticPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200 py-3">
        <div className="max-w-[1280px] mx-auto px-6">
          <nav className="text-sm text-gray-500 flex items-center gap-2">
            <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
            <span>›</span>
            <span className="text-gray-800 font-medium">{title}</span>
          </nav>
        </div>
      </div>

      {/* Page Hero Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 py-14">
        <div className="max-w-[1280px] mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold text-white mb-3">{title}</h1>
          {subtitle && <p className="text-orange-100 text-lg">{subtitle}</p>}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1280px] mx-auto px-6 py-14">
        <div className="max-w-4xl mx-auto">
          {children ? children : (
            sections && sections.length > 0 && (
              <div className="space-y-10">
                {sections.map(section =>
                  section.content ? (
                    <div
                      key={section.id}
                      className="prose prose-lg max-w-none
                        prose-headings:text-gray-800 prose-headings:font-bold
                        prose-h2:text-2xl prose-h2:border-b prose-h2:border-orange-200
                        prose-h2:pb-2 prose-h2:mb-6
                        prose-p:text-gray-600 prose-p:leading-relaxed
                        prose-strong:text-gray-800"
                      dangerouslySetInnerHTML={{ __html: section.content }}
                    />
                  ) : null
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}
