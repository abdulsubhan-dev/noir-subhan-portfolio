// All project images are imported locally from src/assets/projects/
import p01i1 from '../assets/projects/project-01-img-1.png'
import p01i2 from '../assets/projects/project-01-img-2.png'
import p01i3 from '../assets/projects/project-01-img-3.png'
import p02i1 from '../assets/projects/project-02-img-1.png'
import p02i2 from '../assets/projects/project-02-img-2.png'
import p02i3 from '../assets/projects/project-02-img-3.png'
import p03i1 from '../assets/projects/project-03-img-1.png'
import p03i2 from '../assets/projects/project-03-img-2.png'
import p03i3 from '../assets/projects/project-03-img-3.png'

export interface Project {
  id: string
  title: string
  tag: string
  col1: [string, string]
  col2: string
}

export const PROJECTS: Project[] = [
  {
    id: '01',
    title: 'Trinutra Campaigns',
    tag: 'Client',
    col1: [p01i1, p01i2],
    col2: p01i3,
  },
  {
    id: '02',
    title: 'Fixture King HTX',
    tag: 'Client',
    col1: [p02i1, p02i2],
    col2: p02i3,
  },
  {
    id: '03',
    title: 'HAT Tech Media',
    tag: 'Personal Brand',
    col1: [p03i1, p03i2],
    col2: p03i3,
  },
]
