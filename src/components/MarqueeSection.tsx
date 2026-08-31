import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

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

export default function MarqueeSection() {
  const containerRef = useRef<HTMLDivElement | null>(null)

  // Track scroll progress while scrolling through this pinned section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Row 1 & 2 horizontal scroll transforms driven by user scrolling
  const xRow1 = useTransform(scrollYProgress, [0, 1], ['0%', '-42%'])
  const xRow2 = useTransform(scrollYProgress, [0, 1], ['-42%', '0%'])

  const row1 = ALL_IMAGES.slice(0, 10)
  const row2 = ALL_IMAGES.slice(10)

  return (
    // Outer scroll track (250vh height keeps screen pinned while user scrolls through cards)
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        height: '250vh',
        background: '#0C0C0C',
      }}
    >
      {/* Sticky viewport container — stays completely still until all images finish */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <div className="flex flex-col gap-3">
          {/* Row 1 — moves RIGHT to LEFT smoothly as user scrolls */}
          <div className="overflow-hidden" style={{ willChange: 'transform' }}>
            <motion.div
              className="flex gap-3"
              style={{ x: xRow1, width: 'max-content' }}
            >
              {[...row1, ...row1, ...row1].map((src, i) => (
                <MarqueeCard key={i} src={src} alt={`project preview ${(i % 10) + 1}`} />
              ))}
            </motion.div>
          </div>

          {/* Row 2 — moves LEFT to RIGHT smoothly as user scrolls */}
          <div className="overflow-hidden" style={{ willChange: 'transform' }}>
            <motion.div
              className="flex gap-3"
              style={{ x: xRow2, width: 'max-content' }}
            >
              {[...row2, ...row2, ...row2].map((src, i) => (
                <MarqueeCard key={i} src={src} alt={`project preview ${(i % 10) + 11}`} />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Square card — compact scale so both rows fit perfectly in frame ────────
function MarqueeCard({ src, alt }: { src: string; alt: string }) {
  return (
    <div
      className="rounded-2xl flex-shrink-0 overflow-hidden"
      style={{
        width: 'clamp(180px, 20vw, 230px)',
        height: 'clamp(180px, 20vw, 230px)',
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
