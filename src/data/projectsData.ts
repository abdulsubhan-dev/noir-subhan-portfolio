/**
 * projectsData.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for all project/category data.
 * Replace image imports with your real files — component code never needs to change.
 */

// ── Image imports (replace with your actual assets) ───────────────────────────
import p01i1 from '../assets/projects/project-01-img-1.png'
import p01i2 from '../assets/projects/project-01-img-2.png'
import p01i3 from '../assets/projects/project-01-img-3.png'
import p02i1 from '../assets/projects/project-02-img-1.png'
import p02i2 from '../assets/projects/project-02-img-2.png'
import p02i3 from '../assets/projects/project-02-img-3.png'
import p03i1 from '../assets/projects/project-03-img-1.png'
import p03i2 from '../assets/projects/project-03-img-2.png'
import p03i3 from '../assets/projects/project-03-img-3.png'

// ── Types ─────────────────────────────────────────────────────────────────────
export interface Brand {
  name: string
  role: string
}

export interface Project {
  id: string
  image: string
  title: string
  company: string
  type: string
  description?: string
}

export interface Category {
  slug: string
  name: string
  description: string
  coverImage: string
  projects: Project[]
}

// ── Brands / Clients ──────────────────────────────────────────────────────────
export const BRANDS: Brand[] = [
  { name: 'HAT Tech Media',  role: 'Social Media & Personal Branding' },
  { name: 'Trinutra',        role: 'Product Campaigns & Advertising'  },
  { name: 'Optimizers',      role: 'Marketing Creatives'              },
  { name: 'MADX',            role: 'Digital Design & Web'             },
  { name: 'Phantoms',        role: 'Visual Identity & Branding'       },
  { name: 'Fixture King HTX',role: 'Product Display & Advertising'    },
]

// ── Categories + Projects ─────────────────────────────────────────────────────
export const CATEGORIES: Category[] = [
  {
    slug:        'social-media',
    name:        'Social Media',
    description: 'Social campaigns, promotional creatives and visual communication crafted for different brands and audiences.',
    coverImage:  p01i1,
    projects: [
      { id: 'sm-01', image: p01i1, title: 'Testron Campaign',    company: 'Trinutra',        type: 'Social Media Design' },
      { id: 'sm-02', image: p01i2, title: 'Brand Story',         company: 'HAT Tech Media',  type: 'Social Post'         },
      { id: 'sm-03', image: p01i3, title: 'Promo Visual',        company: 'Optimizers',      type: 'Promotional'         },
      { id: 'sm-04', image: p02i1, title: 'Product Reveal',      company: 'Trinutra',        type: 'Social Campaign'     },
      { id: 'sm-05', image: p02i2, title: 'Feature Post',        company: 'MADX',            type: 'Social Post'         },
      { id: 'sm-06', image: p02i3, title: 'Awareness Creative',  company: 'Phantoms',        type: 'Social Media'        },
    ],
  },
  {
    slug:        'product-display',
    name:        'Product Display',
    description: 'High-quality product visuals and advertising designs built around product storytelling and lifestyle.',
    coverImage:  p02i1,
    projects: [
      { id: 'pd-01', image: p02i1, title: 'Cash Register Ad',    company: 'Fixture King HTX', type: 'Product Advertising' },
      { id: 'pd-02', image: p02i2, title: 'Chair Display',       company: 'Fixture King HTX', type: 'Product Display'     },
      { id: 'pd-03', image: p02i3, title: 'Product Hero',        company: 'Trinutra',         type: 'Product Campaign'   },
      { id: 'pd-04', image: p03i1, title: 'Supplement Visual',   company: 'Trinutra',         type: 'Product Ad'         },
    ],
  },
  {
    slug:        'banners',
    name:        'Banners',
    description: 'Digital and print banners designed for maximum visual impact and consistent brand representation.',
    coverImage:  p03i1,
    projects: [
      { id: 'bn-01', image: p03i1, title: 'Brand Banner',        company: 'HAT Tech Media',  type: 'Digital Banner'  },
      { id: 'bn-02', image: p03i2, title: 'Event Banner',        company: 'Optimizers',      type: 'Print Banner'    },
      { id: 'bn-03', image: p03i3, title: 'Promo Strip',         company: 'MADX',            type: 'Web Banner'      },
      { id: 'bn-04', image: p01i3, title: 'Display Ad',          company: 'Phantoms',        type: 'Display Banner'  },
    ],
  },
  {
    slug:        'branding',
    name:        'Branding',
    description: 'Complete visual identity systems — logos, palettes, guidelines and brand assets for lasting impressions.',
    coverImage:  p03i3,
    projects: [
      { id: 'br-01', image: p03i3, title: 'Full Identity',       company: 'HAT Tech Media',  type: 'Brand Identity'    },
      { id: 'br-02', image: p03i2, title: 'Logo System',         company: 'Phantoms',        type: 'Logo Design'       },
      { id: 'br-03', image: p01i2, title: 'Visual Guidelines',   company: 'MADX',            type: 'Brand Guidelines'  },
    ],
  },
  {
    slug:        'carousels',
    name:        'Carousels',
    description: 'Swipeable multi-slide carousels for social platforms, storytelling and digital marketing.',
    coverImage:  p01i2,
    projects: [
      { id: 'cr-01', image: p01i2, title: 'Product Story',       company: 'Trinutra',        type: 'Instagram Carousel' },
      { id: 'cr-02', image: p02i2, title: 'Service Guide',       company: 'Optimizers',      type: 'Carousel'           },
      { id: 'cr-03', image: p03i2, title: 'Brand Deck',          company: 'HAT Tech Media',  type: 'Social Carousel'    },
    ],
  },
  {
    slug:        'reels-motion',
    name:        'Reels / Motion',
    description: 'Short-form video edits, animated creatives and motion graphics for social media.',
    coverImage:  p02i3,
    projects: [
      { id: 'rm-01', image: p02i3, title: 'Promo Reel',          company: 'Phantoms',        type: 'Motion Graphic'  },
      { id: 'rm-02', image: p01i3, title: 'Product Teaser',      company: 'Trinutra',        type: 'Animated Ad'     },
    ],
  },
  {
    slug:        'website-ui',
    name:        'Website / UI',
    description: 'Web designs, UI screens and digital experiences built for brands.',
    coverImage:  p03i1,
    projects: [
      { id: 'wu-01', image: p03i1, title: 'Landing Page',        company: 'HAT Tech Media',  type: 'Web Design'   },
      { id: 'wu-02', image: p03i3, title: 'UI Screens',          company: 'MADX',            type: 'UI Design'    },
    ],
  },
  {
    slug:        'other',
    name:        'Other',
    description: 'Miscellaneous creative work — posters, print media and experimental design explorations.',
    coverImage:  p01i3,
    projects: [
      { id: 'ot-01', image: p01i3, title: 'Event Poster',        company: 'Optimizers',      type: 'Print Design'  },
      { id: 'ot-02', image: p02i1, title: 'Flyer Design',        company: 'MADX',            type: 'Flyer'         },
    ],
  },
]
