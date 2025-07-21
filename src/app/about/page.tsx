'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { createMessage } from '../../../lib/actions/messages.actions'


function About() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [message, setMessage] = useState('')
    const [messageType, setMessageType] = useState<'success' | 'error' | ''>('')

    // Accordion state
    const [openAccordions, setOpenAccordions] = useState({
        bio: false,
        connect: false,
        donate: false,
        feedback: false
    })

    const toggleAccordion = (section: keyof typeof openAccordions) => {
        setOpenAccordions(prev => ({
            ...prev,
            [section]: !prev[section]
        }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)
        setMessage('')
        setMessageType('')

        const form = e.currentTarget
        const formData = new FormData(form)
        const result = await createMessage(formData)

        if (result.error) {
            setMessage(result.error)
            setMessageType('error')
            setIsSubmitting(false)
        } else if (result.success) {
            setMessage(result.success)
            setMessageType('success')
            setIsSubmitting(false)

            // Reset form
            form.reset()
        }

    }
    return (
        <div className="bg-bg min-h-screen pb-30">
            <head>
                <title>About Abdul Moid Khan - Full-Stack Developer & Rankems Creator</title>
                <meta name="description" content="Meet Abdul Moid Khan, the full-stack engineer and Computer Science graduate student behind Rankems. Learn about his journey building innovative web applications, from blockchain NFT marketplaces to AI-powered academic planners." />
                <meta name="keywords" content="Abdul Moid Khan, full-stack developer, Computer Science, Bradley University, web development, React, Next.js, Spring Boot, Rankems creator, software engineer" />
                <meta name="author" content="Abdul Moid Khan" />
                <meta name="robots" content="index, follow" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="canonical" href="https://rankems.xyz/about" />
                
                {/* Open Graph / Facebook */}
                <meta property="og:type" content="profile" />
                <meta property="og:url" content="https://rankems.xyz/about" />
                <meta property="og:title" content="About Abdul Moid Khan - Full-Stack Developer & Rankems Creator" />
                <meta property="og:description" content="Meet Abdul Moid Khan, the full-stack engineer and Computer Science graduate student behind Rankems. Learn about his journey building innovative web applications." />
                {/* <meta property="og:image" content="https://rankems.xyz/og-about.jpg" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" /> */}
                <meta property="og:site_name" content="Rankems" />
                <meta property="og:locale" content="en_US" />

                {/* Twitter */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content="https://rankems.xyz/about" />
                <meta property="twitter:title" content="About Abdul Moid Khan - Full-Stack Developer & Rankems Creator" />
                {/* <meta property="twitter:image" content="https://rankems.xyz/og-about.jpg" /> */}
                <meta property="twitter:description" content="Meet Abdul Moid Khan, the full-stack engineer and Computer Science graduate student behind Rankems. Learn about his journey building innovative web applications." />
                <meta property="twitter:creator" content="@KXhakov" />

                {/* Additional SEO */}
                <meta name="theme-color" content="#09031C" />
                <meta name="application-name" content="Rankems" />

                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
                
                {/* Structured Data */}
                <script type="application/ld+json">
                  {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Person",
                    "name": "Abdul Moid Khan",
                    "description": "Full-stack engineer and Computer Science graduate student at Bradley University, creator of Rankems and other innovative web applications.",
                    "url": "https://khanisic.xyz",
                    "sameAs": [
                      "https://www.linkedin.com/in/abdulmoidkhan/",
                      "https://github.com/Khanisic",
                      "https://x.com/KXhakov",
                      "https://www.reddit.com/user/Khanisic/"
                    ],
                    "jobTitle": "Full-Stack Engineer",
                    "worksFor": {
                      "@type": "EducationalOrganization",
                      "name": "Bradley University"
                    },
                    "alumniOf": {
                      "@type": "EducationalOrganization",
                      "name": "Bradley University"
                    },
                    "knowsAbout": [
                      "React",
                      "Next.js",
                      "Spring Boot",
                      "GraphQL",
                      "WebSockets",
                      "Full-Stack Development",
                      "Computer Science"
                    ],
                    "email": "khanisic@gmail.com",
                    "hasCredential": {
                      "@type": "EducationalOccupationalCredential",
                      "credentialCategory": "Graduate Degree",
                      "educationalLevel": "Master's Degree",
                      "recognizedBy": {
                        "@type": "EducationalOrganization",
                        "name": "Bradley University"
                      }
                    }
                  })}
                </script>

                <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2968967867450442"
                    crossOrigin="anonymous"></script>
            </head>
            {/* Back to Home Button */}
            <div className="flex justify-center items-center pt-10">
                <Link href="/" className="text-black bg-pink group hover:bg-bg border-b-4 hover:border-pink hover:text-pink border-white md:px-6 px-4 py-1 rounded-full flex gap-2 items-center cursor-pointer transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                    <p className="text-black font-mono md:text-xl text-lg group-hover:text-pink">Back to Home</p>
                </Link>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-6 pt-16">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-yellow font-mono text-5xl lg:text-7xl leading-tight mb-6">
                        About Developer
                    </h1>
                    <div className="bg-bg border border-border-box rounded-2xl p-8 mb-8">
                        <p className="text-white font-base text-xl lg:text-2xl leading-relaxed">
                            Turning innovative ideas into full-stack solutions—from code battles to scalable ranking apps.
                        </p>
                    </div>
                </div>

                {/* Bio Section */}
                <div className="bg-bg border border-border-box rounded-2xl mb-8">
                    <button
                        onClick={() => toggleAccordion('bio')}
                        className="w-full cursor-pointer p-8 text-left flex justify-between items-center hover:bg-bg/50 transition-colors"
                    >
                        <h2 className="text-green font-mono text-3xl lg:text-4xl">Who Am I?</h2>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className={`size-8 text-green transition-transform ${openAccordions.bio ? 'rotate-180' : ''}`}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${openAccordions.bio ? 'max-h-full opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="px-8 pb-8 text-white font-base text-lg leading-relaxed space-y-4">
                            <p>
                                I&apos;m a passionate <span className="text-blue">full-stack engineer</span> and a <span className="text-purple">Computer Science graduate student</span> at Bradley University, with a strong foundation in both frontend and backend technologies. Through hands-on experience at early-stage startups and academic research, I&apos;ve built and deployed scalable applications ranging from blockchain-integrated NFT marketplaces to AI-powered academic planners.
                            </p>
                            <p>
                                I&apos;m proficient in tools like <span className="text-pink">React</span>, <span className="text-yellow">Next.js</span>, <span className="text-green">Spring Boot</span>, <span className="text-purple">GraphQL</span>, and <span className="text-blue">WebSockets</span>, and I&apos;ve led the development of projects like <span className="text-red">Meetcode</span>, a real-time collaborative coding platform, and <span className="text-yellow">Rankem</span>, a social ranking game built on live interactions.
                            </p>
                            <p>
                                My research work has focused on <span className="text-green">large-scale sentiment analysis</span> using NLP techniques, building caching strategies, and mapping emotions across millions of data points.
                            </p>
                            <p>
                                I thrive in high-ownership environments, love the process of turning ideas into prototypes and scaling them into production-ready systems, and bring a unique blend of <span className="text-pink">startup hustle</span> and <span className="text-purple">academic rigor</span> to every project I take on.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Links Section */}
                <div className="bg-bg border  border-border-box rounded-2xl mb-8">
                    <button
                        onClick={() => toggleAccordion('connect')}
                        className="w-full p-8 cursor-pointer text-left flex justify-between items-center hover:bg-bg/50 transition-colors"
                    >
                        <h2 className="text-red font-mono text-3xl lg:text-4xl">Connect With Me</h2>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className={`size-8 cursor-pointer text-red transition-transform ${openAccordions.connect ? 'rotate-180' : ''}`}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${openAccordions.connect ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="px-8 pb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Portfolio */}
                            <a
                                href="https://www.khanisic.xyz/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-bg group hover:bg-bg border-b-4 hover:border-purple hover:text-purple border-white px-6 py-3 rounded-full flex gap-3 items-center cursor-pointer transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 stroke-purple">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                                </svg>
                                <p className="text-white font-mono text-lg group-hover:text-purple">Portfolio</p>
                            </a>

                            {/* LinkedIn */}
                            <a
                                href="https://www.linkedin.com/in/abdulmoidkhan/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-bg group hover:bg-bg border-b-4 hover:border-blue hover:text-blue border-white px-6 py-3 rounded-full flex gap-3 items-center cursor-pointer transition-colors"
                            >
                                <svg width="25px" height="25px" viewBox="7.025 7.025 497.951 497.951" xmlns="http://www.w3.org/2000/svg"><linearGradient id="a" gradientUnits="userSpaceOnUse" x1="-974.482" y1="1306.773" x2="-622.378" y2="1658.877" gradientTransform="translate(1054.43 -1226.825)"><stop offset="0" stopColor="#2489be" /><stop offset="1" stopColor="#0575b3" /></linearGradient><path d="M256 7.025C118.494 7.025 7.025 118.494 7.025 256S118.494 504.975 256 504.975 504.976 393.506 504.976 256C504.975 118.494 393.504 7.025 256 7.025zm-66.427 369.343h-54.665V199.761h54.665v176.607zM161.98 176.633c-17.853 0-32.326-14.591-32.326-32.587 0-17.998 14.475-32.588 32.326-32.588s32.324 14.59 32.324 32.588c.001 17.997-14.472 32.587-32.324 32.587zm232.45 199.735h-54.4v-92.704c0-25.426-9.658-39.619-29.763-39.619-21.881 0-33.312 14.782-33.312 39.619v92.704h-52.43V199.761h52.43v23.786s15.771-29.173 53.219-29.173c37.449 0 64.257 22.866 64.257 70.169l-.001 111.825z" fill="url(#a)" /></svg>
                                <p className="text-white font-mono text-lg group-hover:text-blue">LinkedIn</p>
                            </a>

                            {/* GitHub */}
                            <a
                                href="https://github.com/Khanisic"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-bg group hover:bg-bg border-b-4 hover:border-yellow hover:text-yellow border-white px-6 py-3 rounded-full flex gap-3 items-center cursor-pointer transition-colors"
                            >
                                <svg width="25px" height="25px" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet"><path d="M251.172 116.594L139.4 4.828c-6.433-6.437-16.873-6.437-23.314 0l-23.21 23.21 29.443 29.443c6.842-2.312 14.688-.761 20.142 4.693 5.48 5.489 7.02 13.402 4.652 20.266l28.375 28.376c6.865-2.365 14.786-.835 20.269 4.657 7.663 7.66 7.663 20.075 0 27.74-7.665 7.666-20.08 7.666-27.749 0-5.764-5.77-7.188-14.235-4.27-21.336l-26.462-26.462-.003 69.637a19.82 19.82 0 0 1 5.188 3.71c7.663 7.66 7.663 20.076 0 27.747-7.665 7.662-20.086 7.662-27.74 0-7.663-7.671-7.663-20.086 0-27.746a19.654 19.654 0 0 1 6.421-4.281V94.196a19.378 19.378 0 0 1-6.421-4.281c-5.806-5.798-7.202-14.317-4.227-21.446L81.47 39.442l-76.64 76.635c-6.44 6.443-6.44 16.884 0 23.322l111.774 111.768c6.435 6.438 16.873 6.438 23.316 0l111.251-111.249c6.438-6.44 6.438-16.887 0-23.324" fill="#DE4C36" /></svg>
                                <p className="text-white font-mono text-lg group-hover:text-yellow">GitHub</p>
                            </a>

                            {/* Twitter */}
                            <a
                                href="https://x.com/KXhakov"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-bg group hover:bg-bg border-b-4 hover:border-green hover:text-green border-white px-6 py-3 rounded-full flex gap-3 items-center cursor-pointer transition-colors"
                            >
                                <svg width="25px" height="25px" viewBox="126.444 2.281 589 589" xmlns="http://www.w3.org/2000/svg"><circle cx="420.944" cy="296.781" r="294.5" fill="#2daae1" /><path d="M609.773 179.634c-13.891 6.164-28.811 10.331-44.498 12.204 16.01-9.587 28.275-24.779 34.066-42.86a154.78 154.78 0 0 1-49.209 18.801c-14.125-15.056-34.267-24.456-56.551-24.456-42.773 0-77.462 34.675-77.462 77.473 0 6.064.683 11.98 1.996 17.66-64.389-3.236-121.474-34.079-159.684-80.945-6.672 11.446-10.491 24.754-10.491 38.953 0 26.875 13.679 50.587 34.464 64.477a77.122 77.122 0 0 1-35.097-9.686v.979c0 37.54 26.701 68.842 62.145 75.961-6.511 1.784-13.344 2.716-20.413 2.716-4.998 0-9.847-.473-14.584-1.364 9.859 30.769 38.471 53.166 72.363 53.799-26.515 20.785-59.925 33.175-96.212 33.175-6.25 0-12.427-.373-18.491-1.104 34.291 21.988 75.006 34.824 118.759 34.824 142.496 0 220.428-118.052 220.428-220.428 0-3.361-.074-6.697-.236-10.021a157.855 157.855 0 0 0 38.707-40.158z" fill="#ffffff" /></svg>
                                <p className="text-white font-mono text-lg group-hover:text-green">Twitter</p>
                            </a>

                            {/* Reddit */}
                            <a
                                href="mailto:khanisic@gmail.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-bg group hover:bg-bg border-b-4 hover:border-red hover:text-red border-white px-6 py-3 rounded-full flex gap-3 items-center cursor-pointer transition-colors"                        >
                                <svg width="25px" height="25px" viewBox="7.086 -169.483 1277.149 1277.149" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M1138.734 931.095h.283M1139.017 931.095h-.283" /><path d="M1179.439 7.087c57.543 0 104.627 47.083 104.627 104.626v30.331l-145.36 103.833-494.873 340.894L148.96 242.419v688.676h-37.247c-57.543 0-104.627-47.082-104.627-104.625V111.742C7.086 54.198 54.17 7.115 111.713 7.115l532.12 394.525L1179.41 7.115l.029-.028z" fill="#e75a4d" /><linearGradient id="a" gradientUnits="userSpaceOnUse" x1="1959.712" y1="737.107" x2="26066.213" y2="737.107" gradientTransform="matrix(.0283 0 0 -.0283 248.36 225.244)"><stop offset="0" stopColor="#f8f6ef" /><stop offset="1" stopColor="#e7e4d6" /></linearGradient><path fill="url(#a)" d="M111.713 7.087l532.12 394.525L1179.439 7.087z" /><path fill="#e7e4d7" d="M148.96 242.419v688.676h989.774V245.877L643.833 586.771z" /><path fill="#b8b7ae" d="M148.96 931.095l494.873-344.324-2.24-1.586L148.96 923.527z" /><path fill="#b7b6ad" d="M1138.734 245.877l.283 685.218-495.184-344.324z" /><path d="M1284.066 142.044l.17 684.51c-2.494 76.082-35.461 103.238-145.219 104.514l-.283-685.219 145.36-103.833-.028.028z" fill="#b2392f" /><linearGradient id="b" gradientUnits="userSpaceOnUse" x1="1959.712" y1="737.107" x2="26066.213" y2="737.107" gradientTransform="matrix(.0283 0 0 -.0283 248.36 225.244)"><stop offset="0" stopColor="#f8f6ef" /><stop offset="1" stopColor="#e7e4d6" /></linearGradient><path fill="url(#b)" d="M111.713 7.087l532.12 394.525L1179.439 7.087z" /><linearGradient id="c" gradientUnits="userSpaceOnUse" x1="1959.712" y1="737.107" x2="26066.213" y2="737.107" gradientTransform="matrix(.0283 0 0 -.0283 248.36 225.244)"><stop offset="0" stopColor="#f8f6ef" /><stop offset="1" stopColor="#e7e4d6" /></linearGradient><path fill="url(#c)" d="M111.713 7.087l532.12 394.525L1179.439 7.087z" /><linearGradient id="d" gradientUnits="userSpaceOnUse" x1="1959.712" y1="737.107" x2="26066.213" y2="737.107" gradientTransform="matrix(.0283 0 0 -.0283 248.36 225.244)"><stop offset="0" stopColor="#f8f6ef" /><stop offset="1" stopColor="#e7e4d6" /></linearGradient><path fill="url(#d)" d="M111.713 7.087l532.12 394.525L1179.439 7.087z" /><linearGradient id="e" gradientUnits="userSpaceOnUse" x1="1959.712" y1="737.107" x2="26066.213" y2="737.107" gradientTransform="matrix(.0283 0 0 -.0283 248.36 225.244)"><stop offset="0" stopColor="#f8f6ef" /><stop offset="1" stopColor="#e7e4d6" /></linearGradient><path fill="url(#e)" d="M111.713 7.087l532.12 394.525L1179.439 7.087z" /><linearGradient id="f" gradientUnits="userSpaceOnUse" x1="1959.712" y1="737.107" x2="26066.213" y2="737.107" gradientTransform="matrix(.0283 0 0 -.0283 248.36 225.244)"><stop offset="0" stopColor="#f8f6ef" /><stop offset="1" stopColor="#e7e4d6" /></linearGradient><path fill="url(#f)" d="M111.713 7.087l532.12 394.525L1179.439 7.087z" /><linearGradient id="g" gradientUnits="userSpaceOnUse" x1="1959.712" y1="737.107" x2="26066.213" y2="737.107" gradientTransform="matrix(.0283 0 0 -.0283 248.36 225.244)"><stop offset="0" stopColor="#f8f6ef" /><stop offset="1" stopColor="#e7e4d6" /></linearGradient><path fill="url(#g)" d="M111.713 7.087l532.12 394.525L1179.439 7.087z" /><linearGradient id="h" gradientUnits="userSpaceOnUse" x1="1959.712" y1="737.107" x2="26066.213" y2="737.107" gradientTransform="matrix(.0283 0 0 -.0283 248.36 225.244)"><stop offset="0" stopColor="#f8f6ef" /><stop offset="1" stopColor="#e7e4d6" /></linearGradient><path fill="url(#h)" d="M111.713 7.087l532.12 394.525L1179.439 7.087z" /><path fill="#f7f5ed" d="M111.713 7.087l532.12 394.525L1179.439 7.087z" /></svg>
                                <p className="text-white font-mono text-lg group-hover:text-red">Mail</p>
                            </a>

                            <a
                                href="https://www.reddit.com/user/Khanisic/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-bg group hover:bg-bg border-b-4 hover:border-pink hover:text-pink border-white px-6 py-3 rounded-full flex gap-3 items-center cursor-pointer transition-colors"                        >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 stroke-pink">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                                </svg>

                                <p className="text-white font-mono text-lg group-hover:text-pink">Reddit</p>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Donate Section */}
                <div className="bg-bg border border-border-box rounded-2xl mb-8">
                    <button
                        onClick={() => toggleAccordion('donate')}
                        className="w-full p-8 cursor-pointer text-left flex justify-between items-center hover:bg-bg/50 transition-colors"
                    >
                        <h2 className="text-blue font-mono text-3xl lg:text-4xl">Support My Work</h2>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className={`size-8  text-blue transition-transform ${openAccordions.donate ? 'rotate-180' : ''}`}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${openAccordions.donate ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="px-8 pb-8 text-center">
                            <p className="text-white font-base text-xl mb-6 leading-relaxed">
                                If you enjoy my projects like <span className="text-pink">Rankem</span> and find them valuable,
                                consider supporting my work! Your support helps me continue building innovative solutions
                                and creating more awesome projects.
                            </p>
                            <a
                                href="https://buymeacoffee.com/trueheadlines"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 bg-blue text-black hover:bg-bg hover:text-blue border-b-4 border-white hover:border-blue px-8 py-2 rounded-full font-mono text-lg transition-colors cursor-pointer"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75-1.5.75a3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0L3 16.5m15-3.379a48.474 48.474 0 0 0-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 0 1 3 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 0 1 6 13.12M12.265 3.11a.375.375 0 1 1-.53 0L12 2.845l.265.265Zm-3 0a.375.375 0 1 1-.53 0L9 2.845l.265.265Zm6 0a.375.375 0 1 1-.53 0L15 2.845l.265.265Z" />
                                </svg>

                                Buy Me a Coffee
                            </a>
                        </div>
                    </div>
                </div>

                {/* Feedback Form */}
                <div className="bg-bg border border-border-box rounded-2xl mb-8">
                    <button
                        onClick={() => toggleAccordion('feedback')}
                        className="w-full cursor-pointer p-8 text-left flex justify-between items-center hover:bg-bg/50 transition-colors"
                    >
                        <h2 className="text-purple font-mono text-3xl lg:text-4xl">Send Feedback</h2>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className={`size-8 text-purple transition-transform ${openAccordions.feedback ? 'rotate-180' : ''}`}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${openAccordions.feedback ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="px-8 pb-8">
                            {/* Success/Error Message */}
                            {message && (
                                <div className={`mb-6 p-4 rounded-lg ${messageType === 'success'
                                    ? 'bg-green/10 border border-green text-green'
                                    : 'bg-red/10 border border-red text-red'
                                    }`}>
                                    <p className="font-mono text-lg">{message}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-white font-mono text-lg mb-2">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            required
                                            disabled={isSubmitting}
                                            className="w-full bg-bg border border-border-box rounded-lg px-4 py-3 text-white font-base text-lg focus:outline-none focus:border-purple transition-colors disabled:opacity-50"
                                            placeholder="Your name"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-white font-mono text-lg mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            required
                                            disabled={isSubmitting}
                                            className="w-full bg-bg border border-border-box rounded-lg px-4 py-3 text-white font-base text-lg focus:outline-none focus:border-purple transition-colors disabled:opacity-50"
                                            placeholder="your.email@example.com"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="subject" className="block text-white font-mono text-lg mb-2">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        required
                                        disabled={isSubmitting}
                                        className="w-full bg-bg border border-border-box rounded-lg px-4 py-3 text-white font-base text-lg focus:outline-none focus:border-purple transition-colors disabled:opacity-50"
                                        placeholder="What's this about?"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-white font-mono text-lg mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        required
                                        rows={5}
                                        disabled={isSubmitting}
                                        className="w-full bg-bg border border-border-box rounded-lg px-4 py-3 text-white font-base text-lg focus:outline-none focus:border-purple transition-colors resize-none disabled:opacity-50"
                                        placeholder="Tell me your thoughts, suggestions, or feedback..."
                                    />
                                </div>
                                <div className="flex justify-center">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="text-black bg-purple group hover:bg-bg border-b-4 hover:border-purple hover:text-purple border-white md:px-8 px-6 py-3 rounded-full flex gap-3 items-center cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (
                                            <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                                            </svg>
                                        )}
                                        <span className="text-black font-mono text-lg group-hover:text-purple">
                                            {isSubmitting ? 'Sending...' : 'Send Message'}
                                        </span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Fun Footer */}
                <div className="text-center py-8">
                    <p className="text-white font-base text-lg">
                        Thanks for checking out <span className="text-pink">Rankem</span>! 🚀
                    </p>
                    <p className="text-white/60 font-base text-sm mt-2">
                        Built with ❤️ and lots of ☕
                    </p>
                </div>
            </div>
        </div>
    )
}

export default About