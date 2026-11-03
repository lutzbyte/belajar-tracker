import { useCallback, useEffect, useState } from 'react'

export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? '')

  const updateActive = useCallback(() => {
    const header = document.querySelector('header')
    const headerHeight = header?.getBoundingClientRect().height ?? 80

    // Garis penentu tepat di bawah navbar.
    const position = window.scrollY + headerHeight + 30

    let current = ids[0] ?? ''

    for (const id of ids) {
      const section = document.getElementById(id)

      if (!section) continue

      const sectionTop =
        section.getBoundingClientRect().top + window.scrollY

      if (position >= sectionTop) {
        current = id
      } else {
        break
      }
    }

    setActive((previous) =>
      previous === current ? previous : current
    )
  }, [ids])

  useEffect(() => {
    let frame = 0

    const handleUpdate = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(updateActive)
    }

    handleUpdate()

    window.addEventListener('scroll', handleUpdate, {
      passive: true,
    })
    window.addEventListener('resize', handleUpdate)
    window.addEventListener('load', handleUpdate)

    const timer = window.setTimeout(handleUpdate, 300)

    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(timer)

      window.removeEventListener('scroll', handleUpdate)
      window.removeEventListener('resize', handleUpdate)
      window.removeEventListener('load', handleUpdate)
    }
  }, [updateActive])

  return active
}
