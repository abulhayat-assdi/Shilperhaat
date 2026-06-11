'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import DOMPurify from 'dompurify'
import { BlogPost } from '@/lib/blog-data'

function formatDate(iso: string): string {
  const d = new Date(iso)
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ]
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const [post, setPost] = useState<BlogPost | null | undefined>(undefined)

  useEffect(() => {
    fetch(`/api/blog/${encodeURIComponent(slug)}`)
      .then(res => res.json())
      .then(data => setPost(data.post ?? null))
      .catch(() => setPost(null))
  }, [slug])

  // Still loading
  if (post === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div
            className="inline-block w-10 h-10 border-4 border-t-transparent rounded-full animate-spin mb-4"
            style={{ borderColor: '#800000', borderTopColor: 'transparent' }}
          />
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  // 404 state
  if (post === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-7xl mb-4">📄</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">পোস্টটি পাওয়া যায়নি</h1>
          <p className="text-gray-500 mb-6">
            এই ব্লগ পোস্টটি মুছে দেওয়া হয়েছে বা প্রকাশিত হয়নি।
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold transition-colors"
            style={{ backgroundColor: '#800000' }}
          >
            ← Blog-এ ফিরে যান
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-[#800000] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[#800000] transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium truncate max-w-xs">{post.title}</span>
        </div>
      </div>

      {/* Cover Image */}
      <div className="w-full overflow-hidden" style={{ maxHeight: 480 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full object-cover"
          style={{ maxHeight: 480 }}
        />
      </div>

      {/* Article */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        <article className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
          {/* Category badge */}
          <span
            className="inline-block text-xs font-semibold px-3 py-1 rounded-full text-white mb-4"
            style={{ backgroundColor: '#800000' }}
          >
            {post.category}
          </span>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-5">
            {post.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 pb-6 border-b border-gray-100 mb-8">
            <span
              className="inline-flex items-center justify-center w-9 h-9 rounded-full text-white font-bold text-sm flex-shrink-0"
              style={{ backgroundColor: '#800000' }}
            >
              {post.author.charAt(0)}
            </span>
            <span className="text-sm font-semibold text-gray-700">{post.author}</span>
            <span className="text-gray-300">|</span>
            <span className="text-sm text-gray-500">{formatDate(post.publishedAt)}</span>
            <span className="text-gray-300">|</span>
            <span className="text-sm text-gray-500">{post.readTime} min read</span>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 rounded-full bg-[#FFF0F0] text-[#800000] border border-[#f5d0d0]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Content */}
          <div
            className="blog-content text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
          />

          {/* Back button */}
          <div className="mt-10 pt-6 border-t border-gray-100">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 font-semibold text-sm transition-all hover:text-white"
              style={{ borderColor: '#800000', color: '#800000' }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.backgroundColor = '#800000'
                el.style.color = '#fff'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.backgroundColor = 'transparent'
                el.style.color = '#800000'
              }}
            >
              ← Back to Blog
            </Link>
          </div>
        </article>
      </div>

      <style>{`
        .blog-content h2 {
          font-size: 1.35rem;
          font-weight: 700;
          color: #1a1208;
          margin: 1.5rem 0 0.6rem;
          line-height: 1.35;
        }
        .blog-content h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #333;
          margin: 1.2rem 0 0.5rem;
          line-height: 1.4;
        }
        .blog-content p {
          margin: 0 0 1rem;
          color: #555;
          line-height: 1.8;
        }
        .blog-content ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin: 0.75rem 0 1rem;
        }
        .blog-content ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin: 0.75rem 0 1rem;
        }
        .blog-content li {
          margin-bottom: 0.35rem;
          color: #555;
          line-height: 1.7;
        }
        .blog-content a {
          color: #800000;
          text-decoration: underline;
        }
        .blog-content strong {
          font-weight: 700;
          color: #1a1208;
        }
      `}</style>
    </div>
  )
}
