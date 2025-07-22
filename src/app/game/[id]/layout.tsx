import { Metadata } from 'next'
import { fetchGame } from '../../../../lib/actions/rank.actions'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const game = await fetchGame(id)
  
  if (!game) {
    return {
      title: 'Game Not Found | Rankems',
      description: 'The requested ranking game could not be found.'
    }
  }

  return {
    title: `${game.title} - Vote & Rank Now | Rankems`,
    description: `Join the interactive ranking for "${game.title}"! Drag and drop to rank items across ${game.categories.length} categories. ${game.votesCount} people have already voted in this ${game.votingMode} ranking game.`,
    keywords: `${game.title}, ranking game, vote now, interactive ranking, ${game.categories.join(', ')}, game ${id}, rankems voting`,
    authors: [{ name: 'Abdul Moid Khan' }],
    robots: 'index, follow',
    alternates: {
      canonical: `https://rankems.xyz/game/${id}`,
    },
    openGraph: {
      type: 'website',
      url: `https://rankems.xyz/game/${id}`,
      title: `${game.title} - Vote & Rank Now`,
      description: `Join the interactive ranking for "${game.title}"! Drag and drop to rank items across ${game.categories.length} categories. ${game.votesCount} people have already voted.`,
      images: [
        {
          url: 'https://rankems.xyz/og-game.jpg',
          width: 1200,
          height: 630,
        }
      ],
      siteName: 'Rankems',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${game.title} - Vote & Rank Now`,
      description: `Join the interactive ranking for "${game.title}"! ${game.votesCount} people have already voted. Add your rankings now!`,
      images: ['https://rankems.xyz/twitter-game.jpg'],
      creator: '@KXhakov',
    },
    other: {
      'theme-color': '#09031C',
      'application-name': 'Rankems',
    }
  }
}

export default function GameLayout({
  children,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  params,
}: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  return children
} 