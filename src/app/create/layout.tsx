import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Your Ranking Game - Rankems | Free Interactive Polls & Voting',
  description: 'Create your own interactive ranking game for free! Set up custom categories, add items to rank, and choose voting modes. Perfect for ranking friends, movies, foods, or anything you can imagine. No signup required!',
  keywords: 'create ranking game, make poll, custom voting, interactive poll creator, rank creator, voting game maker, social ranking, free poll creator, ranking app',
  authors: [{ name: 'Abdul Moid Khan' }],
  robots: 'index, follow',
  alternates: {
    canonical: 'https://rankems.xyz/create',
  },
  openGraph: {
    type: 'website',
    url: 'https://rankems.xyz/create',
    title: 'Create Your Ranking Game - Rankems',
    description: 'Create your own interactive ranking game for free! Set up custom categories, add items to rank, and choose voting modes. Perfect for ranking friends, movies, foods, or anything you can imagine.',
    siteName: 'Rankems',
    locale: 'en_US',
    images: {
      url: 'https://rankems.xyz/og.png',
      width: 1200,
      height: 630,
    },
  },
  twitter: {
    title: 'Create Your Ranking Game - Rankems',
    description: 'Create your own interactive ranking game for free! Set up custom categories, add items to rank, and choose voting modes. No signup required!',
    creator: '@KXhakov',
  },
  other: {
    'theme-color': '#09031C',
    'application-name': 'Rankems',
  }
}

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 