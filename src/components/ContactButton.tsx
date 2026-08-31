import React from 'react'

export default function ContactButton() {
  return (
    <a
      href="https://wa.me/923200474990"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block rounded-full px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base font-medium uppercase tracking-widest text-white text-center no-underline cursor-pointer hover:opacity-90 transition-opacity"
      style={{
        background: 'linear-gradient(123deg, #0A0A0A 0%, #1A120A 35%, #C85500 75%, #F57C00 100%)',
        boxShadow: '0px 4px 20px rgba(245, 124, 0, 0.35), inset 0px 2px 8px rgba(245, 124, 0, 0.4)',
        outline: '2px solid rgba(255, 255, 255, 1)',
        outlineOffset: '-3px',
      }}
    >
      Contact Me
    </a>
  )
}
