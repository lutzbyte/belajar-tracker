import { useEffect } from 'react'

type Meta = { title: string; description?: string; noindex?: boolean }

function setTag(key: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export function usePageMeta({ title, description, noindex }: Meta) {
  useEffect(() => {
    document.title = title
    setTag('og:title', title, 'property')
    setTag('twitter:title', title)
    if (description) {
      setTag('description', description)
      setTag('og:description', description, 'property')
      setTag('twitter:description', description)
    }
    setTag('robots', noindex ? 'noindex, nofollow' : 'index, follow')
  }, [title, description, noindex])
}
