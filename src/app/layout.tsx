import type { Metadata } from 'next'

import './globals.css'
import { Toaster } from 'react-hot-toast'



export const metadata: Metadata = {
  title: 'Rankems - Interactive Social Ranking Platform | Rank Anything, Anytime',
  description: 'Create and participate in fun interactive ranking games! Rank your friends, favorite movies, foods, or anything you can imagine. Free, no signup required - join thousands of users ranking everything!',
  keywords: 'ranking games, social voting, interactive polls, rank friends, voting platform, online rankings, social games, community voting, fun polls, rank anything',
  authors: [{ name: 'Abdul Moid Khan' }],
  robots: 'index, follow',
  alternates: {
    canonical: 'https://www.rankems.xyz/',
  },
  openGraph: {
    type: 'website',
    url: 'https://www.rankems.xyz/',
    title: 'Rankems - Interactive Social Ranking Platform',
    images: {
      url: 'https://www.www.rankems.xyz/og.png',
      width: 1200,
      height: 630,
    },
    description: 'Create and participate in fun interactive ranking games! Rank your friends, favorite movies, foods, or anything you can imagine. Free, no signup required.',
    siteName: 'Rankems',
    locale: 'en_US',
  },
  twitter: {
    creator: '@KXhakov',
  },
  other: {
    'theme-color': '#09031C',
    'application-name': 'Rankems',
    'apple-mobile-web-app-title': 'Rankems',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
