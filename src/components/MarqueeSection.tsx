import React, { useEffect, useRef, useState } from 'react'

// ── Import marquee images locally ─────────────────────────────────────────────
import img01 from '../assets/marquee/marquee-01.gif'
import img02 from '../assets/marquee/marquee-02.gif'
import img03 from '../assets/marquee/marquee-03.gif'
import img04 from '../assets/marquee/marquee-04.gif'
import img05 from '../assets/marquee/marquee-05.gif'
import img06 from '../assets/marquee/marquee-06.gif'
import img07 from '../assets/marquee/marquee-07.gif'
import img08 from '../assets/marquee/marquee-08.gif'
import img09 from '../assets/marquee/marquee-09.gif'
import img10 from '../assets/marquee/marquee-10.gif'
import img11 from '../assets/marquee/marquee-11.gif'
import img12 from '../assets/marquee/marquee-12.gif'
import img13 from '../assets/marquee/marquee-13.gif'
import img14 from '../assets/marquee/marquee-14.gif'
import img15 from '../assets/marquee/marquee-15.gif'
import img16 from '../assets/marquee/marquee-16.gif'
import img17 from '../assets/marquee/marquee-17.gif'
import img18 from '../assets/marquee/marquee-18.gif'
import img19 from '../assets/marquee/marquee-19.gif'
import img20 from '../assets/marquee/marquee-20.gif'

const ALL_IMAGES = [
  img01, img02, img03, img04, img05, img06, img07,
  img08, img09, img10, img11, img12, img13, img14,
  img15, img16, img17, img18, img19, img20,
]

// ── Scroll offset hook ────────────────────────────────────────────────────────
function useScrollOffset(ref: React.RefObject<HTMLElement | null>) {
  const [offset, setOffset] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    function onScroll() {
      const sectionTop = el!.getBoundingClientRect().top + window.scrollY
      const val = (window.scrollY - sectionTop + window.innerHeight) * 0.3
      setOffset(val)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [ref])
  return offset
}

export default function MarqueeSection() {
  const ref = useRef<HTMLElement | null>(null)
  const offset = useScrollOffset(ref)

  const row1 = ALL_IMAGES.slice(0, 10)   // first 10
  const row2 = ALL_IMAGES.slice(10)       // next 10

  return (
    <section
      ref={ref}
      className="pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden"
      style={{ background: '#0C0C0C' }}
    >
      <div className="flex flex-col gap-3">
        {/* Row 1 — moves RIGHT */}
        <div className="overflow-hidden" style={{ willChange: 'transform' }}>
          <div
            className="flex gap-3"
            style={{ transform: `translateX(${offset - 200}px)` }}
          >
            {[...row1, ...row1, ...row1].map((src, i) => (
              <MarqueeCard key={i} src={src} alt={`project preview ${(i % 10) + 1}`} />
            ))}
          </div>
        </div>

        {/* Row 2 — moves LEFT */}
        <div className="overflow-hidden" style={{ willChange: 'transform' }}>
          <div
            className="flex gap-3"
            style={{ transform: `translateX(${-(offset - 200)}px)` }}
          >
            {[...row2, ...row2, ...row2].map((src, i) => (
              <MarqueeCard key={i} src={src} alt={`project preview ${(i % 10) + 11}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Square card — image fully visible, never cropped ─────────────────────────
function MarqueeCard({ src, alt }: { src: string; alt: string }) {
  return (
    <div
      className="rounded-2xl flex-shrink-0 overflow-hidden"
      style={{
        width: 320,
        height: 320,
        background: '#111111',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',
        }}
      />
    </div>
  )
}
