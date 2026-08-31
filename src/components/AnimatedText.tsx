import React, { useRef } from 'react'
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion'

// A single animated character driven by a shared scrollYProgress + its position fraction
function AnimatedChar({
  char,
  scrollYProgress,
  start,
  end,
}: {
  char: string
  scrollYProgress: MotionValue<number>
  start: number
  end: number
}) {
  const opacity = useTransform(scrollYProgress, [start, end], [0.25, 1])
  return (
    <span style={{ position: 'relative', display: 'inline' }}>
      {/* invisible placeholder preserving layout width */}
      <span style={{ opacity: 0 }}>{char}</span>
      {/* animated overlaid character */}
      <motion.span style={{ opacity, position: 'absolute', left: 0, top: 0 }}>
        {char}
      </motion.span>
    </span>
  )
}

type Props = {
  text: string
  className?: string
}

export default function AnimatedText({ text, className }: Props) {
  const ref = useRef<HTMLParagraphElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.88', 'start 0.38'],
  })

  const chars = Array.from(text)
  const total = chars.length

  return (
    <p
      ref={ref}
      className={`relative mx-auto text-center max-w-[560px] leading-relaxed font-medium text-[#D7E2EA] ${className ?? ''}`}
      style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
    >
      {chars.map((ch, i) => (
        <AnimatedChar
          key={i}
          char={ch}
          scrollYProgress={scrollYProgress}
          start={i / total}
          end={(i + 1) / total}
        />
      ))}
    </p>
  )
}
