import React from 'react'
import { motion } from 'framer-motion'
import Magnet from './Magnet'
import ContactButton from './ContactButton'
import heroPortrait from '../assets/hero-portrait.png'

export default function HeroSection() {
  return (
    <section
      className="relative min-h-[100dvh] h-screen flex flex-col justify-between overflow-hidden"
      style={{ background: '#0C0C0C' }}
    >
      {/* ── Hero Heading ── */}
      <div className="pt-20 sm:pt-28 md:pt-20 z-0">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-full text-[14vw] xs:text-[13.5vw] sm:text-[13vw] md:text-[13.5vw] lg:text-[15vw] text-center"
        >
          Hi, i&apos;m subhan
        </motion.h1>
      </div>

      {/* ── Hero Portrait (Overlaps "HI, I'M SUBHAN" heading on mobile just like desktop) ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        className="absolute inset-x-0 mx-auto z-10 w-[290px] xs:w-[330px] sm:w-[380px] md:w-[460px] lg:w-[520px] top-[115px] xs:top-[125px] sm:top-auto sm:bottom-0"
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
            className="w-full block mx-auto"
            draggable={false}
          />
        </Magnet>
      </motion.div>

      {/* ── Bottom Bar ── */}
      <div className="z-20 flex flex-row items-end justify-between px-5 sm:px-8 md:px-10 pb-6 sm:pb-8 md:pb-10 w-full gap-4 mt-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-[#D7E2EA] font-light uppercase tracking-wide leading-tight max-w-[140px] xs:max-w-[170px] sm:max-w-[220px] md:max-w-[260px]"
          style={{ fontSize: 'clamp(0.68rem, 1.3vw, 1.25rem)' }}
        >
          a graphic designer crafting striking visual identities
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex-shrink-0"
        >
          <ContactButton />
        </motion.div>
      </div>
    </section>
  )
}
