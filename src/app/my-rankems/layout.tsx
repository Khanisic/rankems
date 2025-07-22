import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Rankems - Your Voting History & Created Games | Rankems',
  description: 'View all the ranking games you\'ve voted on or created. Track your voting history, see game results, and manage your Rankems activity in one place. Edit your votes anytime!',
  keywords: 'my rankems, voting history, created games, ranking history, vote tracker, my votes, game dashboard, ranking dashboard, personal rankems',
  authors: [{ name: 'Abdul Moid Khan' }],
  robots: 'index, follow',
  alternates: {
    canonical: 'https://rankems.xyz/my-rankems',
  },
  openGraph: {
    type: 'website',
    url: 'https://rankems.xyz/my-rankems',
    title: 'My Rankems - Your Voting History & Created Games',
    description: 'View all the ranking games you\'ve voted on or created. Track your voting history, see game results, and manage your Rankems activity in one place.',
    siteName: 'Rankems',
    locale: 'en_US',
    images: {
      url: 'https://rankems.xyz/og.png',
      width: 1200,
      height: 630,
    },
  },
  twitter: {
    title: 'My Rankems - Your Voting History & Created Games',
    description: 'View all the ranking games you\'ve voted on or created. Track your voting history and manage your Rankems activity.',
    creator: '@KXhakov',
  },
  other: {
    'theme-color': '#09031C',
    'application-name': 'Rankems',
  }
}

export default function MyRankemsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 