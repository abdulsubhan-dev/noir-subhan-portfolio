import React from 'react'
import { motion } from 'framer-motion'
import Magnet from './Magnet'
import ContactButton from './ContactButton'
import heroPortrait from '../assets/hero-portrait.png'

export default function HeroSection() {
  return (
    <section
      className="relative h-screen flex flex-col items-stretch"
      style={{ overflowX: 'clip' }}
    >
      {/* ── Hero Heading ── */}
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-full text-[11.5vw] sm:text-[12.5vw] md:text-[13.5vw] lg:text-[15vw] mt-24 sm:mt-28 md:mt-20 text-center"
      >
        Hi, i&apos;m subhan
      </motion.h1>

      {/* ── Hero Portrait (absolute centred) ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        className="absolute inset-x-0 mx-auto z-10 w-[280px] sm:w-[360px] md:w-[440px] lg:w-[520px] top-1/2 -translate-y-1/2 sm:top-auto sm:translate-y-0 sm:bottom-0"
      >
        <Magnet
          padding={150}
          strength={3}
          activeTransition="transform 0.3s ease-out"
          inactiveTransition="transform 0.6s ease-in-out"
        >
          <img
            src={heroPortrait}
            alt="Abdul Subhan portrait"
            className="w-full block"
            draggable={false}
          />
        </Magnet>
      </motion.div>

      {/* ── Bottom Bar ── */}
      <div className="mt-auto flex justify-between items-end px-6 md:px-10 pb-7 sm:pb-8 md:pb-10">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug max-w-[160px] sm:max-w-[220px] md:max-w-[260px]"
          style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}
        >
          a graphic designer crafting striking visual identities and creative experiences
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <ContactButton />
        </motion.div>
      </div>
    </section>
  )
}
