import React from 'react'
import { motion } from 'framer-motion'

type Props = React.PropsWithChildren<{
  delay?: number
  duration?: number
  x?: number
  y?: number
  className?: string
  style?: React.CSSProperties
  as?: keyof JSX.IntrinsicElements
}>

export default function FadeIn({
  children,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  className,
  style,
  as = 'div',
}: Props) {
  const MotionEl = motion[as as keyof typeof motion] as any
  return (
    <MotionEl
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={{ delay, duration, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
      style={style}
    >
      {children}
    </MotionEl>
  )
}
