"use client"
import Triangles from "@/_components/Triangles";
import Trophies from "@/_components/Trophies";
import Popular from "@/_components/Popular";
import Live from "@/_components/Live";
import Image from "next/image";
import Link from "next/link";
import Works from "@/_components/Works";



export default function Home() {

  return (
    <div className="bg-bg min-h-screen pb-30">
      <head>
        <title>Rankems - Interactive Social Ranking Platform | Rank Anything, Anytime</title>
        <meta name="description" content="Create and participate in fun interactive ranking games! Rank your friends, favorite movies, foods, or anything you can imagine. Free, no signup required - join thousands of users ranking everything!" />
        <meta name="keywords" content="ranking games, social voting, interactive polls, rank friends, voting platform, online rankings, social games, community voting, fun polls, rank anything" />
        <meta name="author" content="Abdul Moid Khan" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href="https://rankems.xyz/" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rankems.xyz/" />
        <meta property="og:title" content="Rankems - Interactive Social Ranking Platform" />
        <meta property="og:description" content="Create and participate in fun interactive ranking games! Rank your friends, favorite movies, foods, or anything you can imagine. Free, no signup required." />
        {/* <meta property="og:image" content="https://rankems.xyz/og-home.jpg" /> */}
        {/* <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" /> */}
        <meta property="og:site_name" content="Rankems" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter */}
        {/* <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://rankems.xyz/" />
        <meta property="twitter:title" content="Rankems - Interactive Social Ranking Platform" />
        <meta property="twitter:description" content="Create and participate in fun interactive ranking games! Rank your friends, favorite movies, foods, or anything you can imagine. Free, no signup required." />
        <meta property="twitter:image" content="https://rankems.xyz/twitter-home.jpg" />
        <meta property="twitter:creator" content="@KXhakov" /> */}

        {/* Additional SEO */}
        <meta name="theme-color" content="#09031C" />
        <meta name="application-name" content="Rankems" />
        <meta name="apple-mobile-web-app-title" content="Rankems" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Rankems",
            "description": "Interactive social ranking platform where users can create and participate in ranking games for anything - friends, movies, foods, and more.",
            "url": "https://rankems.xyz",
            "applicationCategory": "SocialNetworkingApplication",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "author": {
              "@type": "Person",
              "name": "Abdul Moid Khan",
              "url": "https://khanisic.xyz"
            },
            "publisher": {
              "@type": "Person",
              "name": "Abdul Moid Khan"
            },
            "datePublished": "2024-01-01",
            "inLanguage": "en-US",
            "isAccessibleForFree": true,
            "browserRequirements": "Requires JavaScript. Requires HTML5.",
            "softwareVersion": "1.0"
          })}
        </script>

        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2968967867450442"
          crossOrigin="anonymous"></script>
      </head>

      <div className="flex justify-center items-center pt-10">
        <Link href="/about" className="text-black  bg-yellow group hover:bg-bg border-b-4 hover:border-yellow  hover:text-yellow border-white md:px-6 px-4 py-1 rounded-full flex gap-2 items-center cursor-pointer transition-colors" >
          <p className="text-black font-mono md:text-xl text-lg group-hover:text-yellow">Who am I?</p>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.866.966 1.866 2.013 0 3.728-2.35 6.75-5.25 6.75S6.75 18.728 6.75 15c0-1.046.83-1.867 1.866-2.013A24.204 24.204 0 0 1 12 12.75Zm0 0c2.883 0 5.647.508 8.207 1.44a23.91 23.91 0 0 1-1.152 6.06M12 12.75c-2.883 0-5.647.508-8.208 1.44.125 2.104.52 4.136 1.153 6.06M12 12.75a2.25 2.25 0 0 0 2.248-2.354M12 12.75a2.25 2.25 0 0 1-2.248-2.354M12 8.25c.995 0 1.971-.08 2.922-.236.403-.066.74-.358.795-.762a3.778 3.778 0 0 0-.399-2.25M12 8.25c-.995 0-1.97-.08-2.922-.236-.402-.066-.74-.358-.795-.762a3.734 3.734 0 0 1 .4-2.253M12 8.25a2.25 2.25 0 0 0-2.248 2.146M12 8.25a2.25 2.25 0 0 1 2.248 2.146M8.683 5a6.032 6.032 0 0 1-1.155-1.002c.07-.63.27-1.222.574-1.747m.581 2.749A3.75 3.75 0 0 1 15.318 5m0 0c.427-.283.815-.62 1.155-.999a4.471 4.471 0 0 0-.575-1.752M4.921 6a24.048 24.048 0 0 0-.392 3.314c1.668.546 3.416.914 5.223 1.082M19.08 6c.205 1.08.337 2.187.392 3.314a23.882 23.882 0 0 1-5.223 1.082" />
          </svg>
        </Link>
      </div>

      <Triangles />


      <Trophies />
      <div className="md:flex hidden absolute md:left-[-200px] xl:left-[-100px] 2xl:left-[-50px] items-center justify-center top-[350px]">
        <Image src="/popular.svg" alt="ballon d'or" width={500} height={500} />
        <p className="font-base text-white text-xl -translate-x-[210px] translate-y-[-160px] rotate-[15deg]">Featured right now!</p>
      </div>

      <div className="md:py-6 py-4 z-10">
        <p className="text-pink font-mono m-0 z-10 text-5xl lg:text-7xl text-center leading-[80px] pt-4">Rank Em Up</p>
        <p className="text-white font-base text-xl lg:text-2xl px-6 text-center z-10">An application where you rank <span className="text-yellow">anything</span> based on <span className="text-purple">anything</span>. </p>
        <div className="flex md:flex-row flex-col z-10 gap-8 items-center justify-center pt-5">
          <Link href="/create">
            <button className="text-white relative z-20 bg-blue group hover:bg-bg border-b-2 hover:border-blue  hover:text-blue border-white md:px-6 px-4 py-1 rounded-full w-full flex gap-2 items-center cursor-pointer transition-colors">
              <p className="text-white font-mono md:text-xl text-lg group-hover:text-blue">Create Now</p>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 group-hover:text-white transition-all ease-in-out duration-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
              <p className="text-white font-sans w-full md:text-sm text-xs text-center absolute top-11 left-0">Its free, no signup required!!</p>
            </button>
          </Link>
          <Link href="/my-rankems">
            <button className="text-white bg-purple group z-40 hover:bg-bg border-b-2 hover:border-purple  hover:text-purple border-white md:px-6 px-4 py-1 rounded-full flex gap-2 items-center cursor-pointer transition-colors" >
              <p className="text-white font-mono md:text-xl text-lg group-hover:text-purple">My Rankems</p>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 group-hover:text-white transition-all ease-in-out duration-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
              </svg>

            </button>
          </Link>


        </div>

        <Popular />
      </div>

      <Works />
      <Live />
    </div >
  );
}
