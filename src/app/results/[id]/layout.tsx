import { Metadata } from 'next'
import { fetchGame, fetchResults } from '../../../../lib/actions/rank.actions'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const game = await fetchGame(id)
  const results = await fetchResults(id)
  
  if (!game) {
    return {
      title: 'Results Not Found | Rankems',
      description: 'The requested ranking results could not be found.'
    }
  }

  const votesCount = results?.votesCount || 0

  return {
    title: `${game.title} - Live Results & Rankings | Rankems`,
    description: `See live results for "${game.title}"! View current rankings based on ${votesCount} votes. Interactive results showing winners and trends across all categories.`,
    keywords: `${game.title} results, ranking results, voting results, live rankings, ${game.categories.join(', ')}, game ${id} results, rankems leaderboard`,
    authors: [{ name: 'Abdul Moid Khan' }],
    robots: 'index, follow',
    alternates: {
      canonical: `https://rankems.xyz/results/${id}`,
    },
    openGraph: {
      type: 'website',
      url: `https://rankems.xyz/results/${id}`,
      title: `${game.title} - Live Results & Rankings`,
      description: `See live results for "${game.title}"! View current rankings based on ${votesCount} votes. Interactive results showing winners and trends.`,
      images: [
        {
          url: 'https://rankems.xyz/og-results.jpg',
          width: 1200,
          height: 630,
        }
      ],
      siteName: 'Rankems',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${game.title} - Live Results & Rankings`,
      description: `Check out the results for "${game.title}"! ${votesCount} votes counted. See who's winning!`,
      images: ['https://rankems.xyz/twitter-results.jpg'],
      creator: '@KXhakov',
    },
    other: {
      'theme-color': '#09031C',
      'application-name': 'Rankems',
    }
  }
}

export default function ResultsLayout({
  children,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  params,
}: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  return children
} 