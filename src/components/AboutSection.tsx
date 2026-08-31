import React from 'react'
import FadeIn from './FadeIn'
import AnimatedText from './AnimatedText'
import ContactButton from './ContactButton'

// ── Decorative corner images (local imports) ──────────────────────────────────
import decorTopLeft from '../assets/decor/decor-top-left.png'
import decorBottomLeft from '../assets/decor/decor-bottom-left.png'
import decorTopRight from '../assets/decor/decor-top-right.png'
import decorBottomRight from '../assets/decor/decor-bottom-right.png'

const ABOUT_TEXT =
  "With over 1 year of professional design experience, i specialize in graphic design, visual branding, and creative content creation. I focus on building striking visual identities and meaningful designs for brands that want to stand out. My work spans social media campaigns, product advertising, and digital experiences. Let's create something extraordinary together!"

export default function AboutSection() {
  return (
    <section
      id="about"
      className="min-h-screen flex items-center justify-center px-5 sm:px-8 md:px-10 py-20 relative overflow-hidden"
      style={{ background: '#0C0C0C' }}
    >
      {/* ── Corner decorative images — compact & managed for mobile view ── */}
      <FadeIn
        delay={0.1}
        x={-80}
        y={0}
        duration={0.9}
        className="absolute w-[55px] xs:w-[70px] sm:w-[160px] md:w-[210px] top-[2%] sm:top-[4%] left-[2%] md:left-[4%] pointer-events-none"
      >
        <img src={decorTopLeft} alt="" draggable={false} className="w-full" />
      </FadeIn>

      <FadeIn
        delay={0.25}
        x={-80}
        y={0}
        duration={0.9}
        className="absolute w-[48px] xs:w-[62px] sm:w-[140px] md:w-[180px] bottom-[3%] sm:bottom-[8%] left-[2%] sm:left-[6%] md:left-[10%] pointer-events-none"
      >
        <img src={decorBottomLeft} alt="" draggable={false} className="w-full" />
      </FadeIn>

      <FadeIn
        delay={0.15}
        x={80}
        y={0}
        duration={0.9}
        className="absolute w-[55px] xs:w-[70px] sm:w-[160px] md:w-[210px] top-[2%] sm:top-[4%] right-[2%] md:right-[4%] pointer-events-none"
      >
        <img src={decorTopRight} alt="" draggable={false} className="w-full" />
      </FadeIn>

      <FadeIn
        delay={0.3}
        x={80}
        y={0}
        duration={0.9}
        className="absolute w-[58px] xs:w-[74px] sm:w-[170px] md:w-[220px] bottom-[3%] sm:bottom-[8%] right-[2%] sm:right-[6%] md:right-[10%] pointer-events-none"
      >
        <img src={decorBottomRight} alt="" draggable={false} className="w-full" />
      </FadeIn>

      {/* ── Main content ── */}
      <div className="flex flex-col items-center gap-10 sm:gap-14 md:gap-16 z-10">
        {/* Heading */}
        <FadeIn delay={0} y={40}>
          <h2
            className="hero-heading font-black uppercase leading-none tracking-tight text-center"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            About me
          </h2>
        </FadeIn>

        {/* Animated paragraph */}
        <AnimatedText text={ABOUT_TEXT} />

        {/* Contact button */}
        <div className="mt-6 sm:mt-10 md:mt-14">
          <FadeIn delay={0.2} y={20}>
            <ContactButton />
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
