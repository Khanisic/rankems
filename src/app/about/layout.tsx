import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Abdul Moid Khan - Full-Stack Developer & Rankems Creator',
  description: 'Meet Abdul Moid Khan, the full-stack engineer and Computer Science graduate student behind Rankems. Learn about his journey building innovative web applications, from blockchain NFT marketplaces to AI-powered academic planners.',
  keywords: 'Abdul Moid Khan, full-stack developer, Computer Science, Bradley University, web development, React, Next.js, Spring Boot, Rankems creator, software engineer',
  authors: [{ name: 'Abdul Moid Khan' }],
  robots: 'index, follow',
  alternates: {
    canonical: 'https://rankems.xyz/about',
  },
  openGraph: {
    type: 'profile',
    url: 'https://rankems.xyz/about',
    title: 'About Abdul Moid Khan - Full-Stack Developer & Rankems Creator',
    description: 'Meet Abdul Moid Khan, the full-stack engineer and Computer Science graduate student behind Rankems. Learn about his journey building innovative web applications.',
    siteName: 'Rankems',
    locale: 'en_US',
  },
  twitter: {
    title: 'About Abdul Moid Khan - Full-Stack Developer & Rankems Creator',
    description: 'Meet Abdul Moid Khan, the full-stack engineer and Computer Science graduate student behind Rankems. Learn about his journey building innovative web applications.',
    creator: '@KXhakov',
  },
  other: {
    'theme-color': '#09031C',
    'application-name': 'Rankems',
  }
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 