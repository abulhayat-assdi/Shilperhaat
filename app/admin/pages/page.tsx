'use client'

import { useState } from 'react'
import { getAllPages, PageContent } from '@/lib/pages-data'
import AdminLayout from '@/components/admin/AdminLayout'

export default function AdminPagesManager() {
  const [pages, setPages] = useState<PageContent[]>(getAllPages())
  const [selectedPage, setSelectedPage] = useState<PageContent | null>(null)
  const [editMode, setEditMode] = useState<'richtext' | 'html'>('richtext')
  const [saveMsg, setSaveMsg] = useState('')

  const handleEdit = (page: PageContent) => {
    setSelectedPage({ ...page })
    setSaveMsg('')
  }

  const handleSave = () => {
    if (!selectedPage) return
    setPages(prev => prev.map(p => p.slug === selectedPage.slug ? {
      ...selectedPage,
      updatedAt: new Date().toISOString()
    } : p))
    setSaveMsg('Saved successfully!')
    setTimeout(() => setSaveMsg(''), 3000)
  }

  return (
    <AdminLayout title="Pages Manager">
      <div className="flex h-[calc(100vh-112px)] -m-4 md:-m-6 bg-gray-50">

        {/* LEFT: Pages List */}
        <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0">
          <div className="p-4 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">All Pages</p>
            <p className="text-xs text-gray-400 mt-0.5">{pages.length} pages total</p>
          </div>
          {pages.map(page => (
            <button
              key={page.slug}
              onClick={() => handleEdit(page)}
              className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-orange-50 transition-colors ${
                selectedPage?.slug === page.slug ? 'bg-orange-50 border-l-4 border-l-[#c8860a]' : ''
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{page.title}</p>
                  <p className="text-xs text-gray-400">/{page.slug}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                  page.isPublished
                    ? 'bg-green-100 text-green-600'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {page.isPublished ? 'Live' : 'Draft'}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* RIGHT: Editor */}
        <div className="flex-1 overflow-y-auto p-6">
          {selectedPage ? (
            <div className="max-w-4xl mx-auto">

              {/* Page Settings */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                <h2 className="text-base font-bold text-gray-800 mb-4">Page Settings</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Page Title</label>
                    <input
                      type="text"
                      value={selectedPage.title}
                      onChange={e => setSelectedPage({ ...selectedPage, title: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#c8860a]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Subtitle</label>
                    <input
                      type="text"
                      value={selectedPage.subtitle}
                      onChange={e => setSelectedPage({ ...selectedPage, subtitle: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#c8860a]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Meta Title (SEO)</label>
                    <input
                      type="text"
                      value={selectedPage.metaTitle}
                      onChange={e => setSelectedPage({ ...selectedPage, metaTitle: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#c8860a]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Meta Description (SEO)</label>
                    <input
                      type="text"
                      value={selectedPage.metaDescription}
                      onChange={e => setSelectedPage({ ...selectedPage, metaDescription: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#c8860a]"
                    />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <label className="text-xs font-semibold text-gray-600">Status:</label>
                  <button
                    onClick={() => setSelectedPage({ ...selectedPage, isPublished: !selectedPage.isPublished })}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      selectedPage.isPublished
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    {selectedPage.isPublished ? '✓ Published' : 'Draft'}
                  </button>
                  <a
                    href={`/${selectedPage.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#c8860a] hover:underline"
                  >
                    View Page →
                  </a>
                </div>
              </div>

              {/* Editor Mode Toggle */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm font-medium text-gray-700">Editor Mode:</span>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  {(['richtext', 'html'] as const).map(mode => (
                    <button
                      key={mode}
                      onClick={() => setEditMode(mode)}
                      className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        editMode === mode ? 'bg-white shadow text-[#c8860a]' : 'text-gray-500'
                      }`}
                    >
                      {mode === 'richtext' ? 'Rich Text' : 'HTML'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Section 1 */}
              <ContentSection
                title="Section 1 — Main Content"
                value={selectedPage.section1}
                onChange={v => setSelectedPage({ ...selectedPage, section1: v })}
                editMode={editMode}
                sectionId="editor-s1"
              />

              {/* Section 2 */}
              <ContentSection
                title="Section 2 — Additional Content"
                value={selectedPage.section2}
                onChange={v => setSelectedPage({ ...selectedPage, section2: v })}
                editMode={editMode}
                sectionId="editor-s2"
              />

              {/* Save */}
              <div className="flex items-center gap-4 pb-6">
                <button
                  onClick={handleSave}
                  className="bg-[#c8860a] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#a86e08] transition-colors shadow-sm"
                >
                  Save & Publish
                </button>
                {saveMsg && (
                  <span className="text-green-600 font-medium text-sm bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                    ✅ {saveMsg}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <div className="text-6xl mb-4">📄</div>
              <p className="text-lg font-medium">Select a page to edit</p>
              <p className="text-sm mt-1">Choose from the list on the left</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

const TOOLBAR_BUTTONS = [
  { label: 'B', cmd: 'bold', val: undefined, style: 'font-bold' },
  { label: 'I', cmd: 'italic', val: undefined, style: 'italic' },
  { label: 'U', cmd: 'underline', val: undefined, style: 'underline' },
  { label: 'H2', cmd: 'formatBlock', val: 'h2', style: '' },
  { label: 'H3', cmd: 'formatBlock', val: 'h3', style: '' },
  { label: '• List', cmd: 'insertUnorderedList', val: undefined, style: '' },
  { label: '1. List', cmd: 'insertOrderedList', val: undefined, style: '' },
] as const

function ContentSection({
  title,
  value,
  onChange,
  editMode,
  sectionId,
}: {
  title: string
  value: string
  onChange: (v: string) => void
  editMode: 'richtext' | 'html'
  sectionId: string
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      <h3 className="text-sm font-bold text-gray-800 mb-3">{title}</h3>

      {editMode === 'html' ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          rows={12}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-[#c8860a]"
          placeholder="<h2>Section Title</h2><p>Your content here...</p>"
        />
      ) : (
        <div>
          <div className="flex flex-wrap gap-1 mb-0 p-2 bg-gray-50 border border-gray-200 rounded-t-lg">
            {TOOLBAR_BUTTONS.map(btn => (
              <button
                key={btn.cmd + btn.label}
                onMouseDown={e => {
                  e.preventDefault()
                  document.execCommand(btn.cmd, false, btn.val)
                }}
                className={`px-2 py-1 text-xs border border-gray-300 rounded hover:bg-orange-50 hover:border-orange-300 ${btn.style}`}
              >
                {btn.label}
              </button>
            ))}
          </div>
          <div
            id={sectionId}
            contentEditable
            suppressContentEditableWarning
            onInput={e => onChange((e.target as HTMLElement).innerHTML)}
            dangerouslySetInnerHTML={{ __html: value }}
            className="w-full min-h-[180px] border border-gray-300 border-t-0 rounded-b-lg px-4 py-3 text-sm focus:outline-none prose max-w-none"
          />
        </div>
      )}

      {value && (
        <div className="mt-4 border-t border-gray-100 pt-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Preview</p>
          <div
            className="prose prose-sm max-w-none text-gray-600 bg-gray-50 rounded-lg p-4"
            dangerouslySetInnerHTML={{ __html: value }}
          />
        </div>
      )}
    </div>
  )
}
