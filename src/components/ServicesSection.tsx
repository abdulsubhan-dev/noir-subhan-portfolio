import React from 'react'
import FadeIn from './FadeIn'

const SERVICES = [
  {
    num: '01',
    title: 'Graphic Design',
    desc: 'Custom visual designs tailored to your brand, from logos to complete visual systems that communicate identity and purpose.',
  },
  {
    num: '02',
    title: 'Social Media Design',
    desc: 'Engaging social media content, carousels, and campaigns that drive brand awareness and audience connection across platforms.',
  },
  {
    num: '03',
    title: 'Product Advertising',
    desc: 'Professional product visuals and promotional designs showcasing your products with high-quality photography aesthetics and compelling composition.',
  },
  {
    num: '04',
    title: 'Branding',
    desc: 'Complete brand identity systems — logos, color palettes, typography, and brand guidelines that establish a strong, memorable presence.',
  },
  
]

export default function ServicesSection() {
  return (
    <section
      id="services"
      className="bg-white rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 text-[#0C0C0C]"
    >
      {/* Heading */}
      <FadeIn delay={0} y={40}>
        <h2
          className="font-black uppercase text-center mb-16 sm:mb-20 md:mb-28"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)', color: '#0C0C0C' }}
        >
          Services
        </h2>
      </FadeIn>

      {/* Service list */}
      <div className="max-w-5xl mx-auto">
        {/* top border */}
        <div style={{ borderTop: '1px solid rgba(12,12,12,0.15)' }} />

        {SERVICES.map((s, i) => (
          <FadeIn key={s.num} delay={i * 0.1} y={20}>
            <div
              className="flex gap-4 md:gap-8 items-start py-8 sm:py-10 md:py-12"
              style={{ borderBottom: '1px solid rgba(12,12,12,0.15)' }}
            >
              {/* Number */}
              <div
                className="font-black text-[#0C0C0C] flex-shrink-0 leading-none"
                style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}
              >
                {s.num}
              </div>

              {/* Title + description */}
              <div className="flex flex-col justify-center py-2">
                <div
                  className="font-medium uppercase text-[#0C0C0C]"
                  style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}
                >
                  {s.title}
                </div>
                <p
                  className="font-light leading-relaxed opacity-60 mt-2 max-w-2xl"
                  style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)' }}
                >
                  {s.desc}
                </p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}
