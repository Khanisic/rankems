"use client"
import Triangles from "@/_components/Triangles";
import Trophies from "@/_components/Trophies";
import Popular from "@/_components/Popular";
import Image from "next/image";
import Link from "next/link";



export default function Home() {

  const colours = ["#5D4A59", "#37635E", "#374963", "#374963"]

  const data = [
    {
      title: "Best Way to hide a body",
      votes: 791,
      items: [
        {
          rank: 1,
          name: "Bury It",
          increase: true,
          decrease: false,
        },
        {
          rank: 2,
          name: "Burn the body",
          increase: true,
          decrease: false,
        },
        {
          rank: 3,
          name: "Send it to the neighbor",
          increase: true,
          decrease: false,
        },
        {
          rank: 4,
          name: "Start eating it, discretely.",
          increase: false,
          decrease: false,
        },
        {
          rank: 5,
          name: "Call the police, act surprised!",
          increase: true,
          decrease: false,
        },
        {
          rank: 6,
          name: "Freeze dry it.",
          increase: true,
          decrease: false,
        },
      ]
    },

    {
      title: "Best formula 1 drivers of all time",
      votes: 120,
      items: [
        {
          rank: 1,
          name: "Michael Schumacher",
          increase: true,
          decrease: false,
        },
        {
          rank: 2,
          name: "Lewis Hamilton",
          increase: true,
          decrease: false,
        },
        {
          rank: 3,
          name: "Ayrton Senna",
          increase: true,
          decrease: false,
        },
        {
          rank: 4,
          name: "Alain Prost",
          increase: false,
          decrease: false,
        },
        {
          rank: 5,
          name: "Niki Lauda",
          increase: true,
          decrease: false,
        },
        {
          rank: 6,
          name: "Fernando Alonso",
          increase: true,
          decrease: false,
        },
        {
          rank: 7,
          name: "Jenson Button",
          increase: true,
          decrease: false,
        },
        {
          rank: 8,
          name: "Nigel Mansell",
          increase: true,
          decrease: false,
        },
      ]
    },
    {
      title: "Best Retirement Plans",
      votes: 110,
      items: [
        {
          rank: 1,
          name: "Visit all the continents",
          increase: true,
          decrease: false,
        },
        {
          rank: 2,
          name: "Relax and chill, do nothing.",
          increase: true,
          decrease: false,
        },
        {
          rank: 3,
          name: "Spend, Spend, Spend $$",
          increase: true,
          decrease: false,
        },
        {
          rank: 4,
          name: "Bucket List items",
          increase: false,
          decrease: false,
        },
        {
          rank: 5,
          name: "Become a gamer",
          increase: true,
          decrease: false,
        },
      ]
    },
    {
      title: "Best Way to hide a body",
      votes: 791,
      items: [
        {
          rank: 1,
          name: "Bury It",
          increase: true,
          decrease: false,
        },
        {
          rank: 2,
          name: "Burn the body",
          increase: true,
          decrease: false,
        },
        {
          rank: 3,
          name: "Send it to the neighbor",
          increase: true,
          decrease: false,
        },
        {
          rank: 4,
          name: "Start eating it, discretely.",
          increase: false,
          decrease: false,
        },
        {
          rank: 5,
          name: "Call the police, act surprised!",
          increase: true,
          decrease: false,
        },
        {
          rank: 6,
          name: "Freeze dry it.",
          increase: true,
          decrease: false,
        },
      ]
    },

    {
      title: "Best formula 1 drivers of all time",
      votes: 120,
      items: [
        {
          rank: 1,
          name: "Michael Schumacher",
          increase: true,
          decrease: false,
        },
        {
          rank: 2,
          name: "Lewis Hamilton",
          increase: true,
          decrease: false,
        },
        {
          rank: 3,
          name: "Ayrton Senna",
          increase: true,
          decrease: false,
        },
        {
          rank: 4,
          name: "Alain Prost",
          increase: false,
          decrease: false,
        },
        {
          rank: 5,
          name: "Niki Lauda",
          increase: true,
          decrease: false,
        },
        {
          rank: 6,
          name: "Fernando Alonso",
          increase: true,
          decrease: false,
        },
        {
          rank: 7,
          name: "Jenson Button",
          increase: true,
          decrease: false,
        },
        {
          rank: 8,
          name: "Nigel Mansell",
          increase: true,
          decrease: false,
        },
      ]
    },
    {
      title: "Best Retirement Plans",
      votes: 110,
      items: [
        {
          rank: 1,
          name: "Visit all the continents",
          increase: true,
          decrease: false,
        },
        {
          rank: 2,
          name: "Relax and chill, do nothing.",
          increase: true,
          decrease: false,
        },
        {
          rank: 3,
          name: "Spend, Spend, Spend $$",
          increase: true,
          decrease: false,
        },
        {
          rank: 4,
          name: "Bucket List items",
          increase: false,
          decrease: false,
        },
        {
          rank: 5,
          name: "Become a gamer",
          increase: true,
          decrease: false,
        },
      ]
    },
    {
      title: "Best Way to hide a body",
      votes: 791,
      items: [
        {
          rank: 1,
          name: "Bury It",
          increase: true,
          decrease: false,
        },
        {
          rank: 2,
          name: "Burn the body",
          increase: true,
          decrease: false,
        },
        {
          rank: 3,
          name: "Send it to the neighbor",
          increase: true,
          decrease: false,
        },
        {
          rank: 4,
          name: "Start eating it, discretely.",
          increase: false,
          decrease: false,
        },
        {
          rank: 5,
          name: "Call the police, act surprised!",
          increase: true,
          decrease: false,
        },
        {
          rank: 6,
          name: "Freeze dry it.",
          increase: true,
          decrease: false,
        },
      ]
    },
    {
      title: "Best Way to hide a body",
      votes: 791,
      items: [
        {
          rank: 1,
          name: "Bury It",
          increase: true,
          decrease: false,
        },
        {
          rank: 2,
          name: "Burn the body",
          increase: true,
          decrease: false,
        },
        {
          rank: 3,
          name: "Send it to the neighbor",
          increase: true,
          decrease: false,
        },
        {
          rank: 4,
          name: "Start eating it, discretely.",
          increase: false,
          decrease: false,
        },
        {
          rank: 5,
          name: "Call the police, act surprised!",
          increase: true,
          decrease: false,
        },
        {
          rank: 6,
          name: "Freeze dry it.",
          increase: true,
          decrease: false,
        },
      ]
    },


  ]


  return (
    <div className="bg-bg h-full">

      <Triangles />


      <Trophies />
      <div className="md:flex hidden absolute md:left-[-200px] xl:left-[-100px] 2xl:left-[-50px] items-center justify-center top-[350px]">
        <Image src="/popular.svg" alt="ballon d'or" width={500} height={500} />
        <p className="font-base text-white text-xl -translate-x-[210px] translate-y-[-160px] rotate-[15deg]">Most Popular right now!</p>
      </div>

      <div className="min-h-screen overflow-x-hidden">



        <p className="text-pink font-mono m-0 z-10 text-5xl lg:text-7xl text-center leading-[80px] pt-8">Rank Em Up</p>
        <p className="text-white font-base text-xl lg:text-2xl px-6 text-center z-10">An application where you rank <span className="text-yellow">anything</span> based on <span className="text-purple">anything</span>. </p>
        <div className="flex z-10 gap-4 items-center justify-center pt-5">
          <Link href="/create">
            <button className="text-white relative bg-blue group hover:bg-bg border-b-2 hover:border-blue  hover:text-blue border-white px-6 py-1 rounded-full w-full flex gap-2 items-center cursor-pointer transition-colors">
              <p className="text-white font-mono text-xl group-hover:text-blue">Create Now</p>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 group-hover:text-white transition-all ease-in-out duration-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
              <p className="text-white font-sans w-full text-sm text-center absolute top-11 left-0">Its free, no signup required!!</p>
            </button>
          </Link>
          <button className="text-white bg-purple group hover:bg-bg border-b-2 hover:border-purple  hover:text-purple border-white px-6 py-1 rounded-full flex gap-2 items-center cursor-pointer transition-colors" >
            <p className="text-white font-mono text-xl group-hover:text-purple">Rank Existing</p>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 group-hover:text-white transition-all ease-in-out duration-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
            </svg>

          </button>

        </div>

        <Popular />
      </div>

      <div className="bg-bg h-full px-20">
        <p className="text-white font-mono text-4xl mt-10 mb-2 text-center">Current <span className="text-yellow">Live</span> Rankems</p>
        <p className="text-white font-mono text-2xl text-center mb-2">You can update your ranking anytime.</p>
        <div className="relative  columns-2 md:columns-3 lg:columns-4 xl:columns-4 gap-8 ">
          {data.map((item, index) => (
            <div key={index} className="mt-8 z-20 break-inside-avoid h-fit border border-border-box rounded-3xl p-4" style={{ backgroundColor: colours[index % colours.length] }}>
              <p className="text-white font-mono text-2xl text-center  mb-2">{item.title}</p>
              <div className="flex flex-col items-center gap-2 justify-center">
                {item.items.map((item, index) => (
                  <div key={index} className="w-full flex gap-3 items-center group bg-bg border-1 border-border-box rounded-xl px-5 py-2  justify-between">
                    <div className="flex gap-3 items-center">
                      <p className="font-base text-white text-sm">{item.rank}.</p>
                      {item.increase &&
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-green group-hover:translate-x-1 rotate-180 transition-all ease-in-out duration-300">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                      }

                      {item.decrease &&
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-red transform group-hover:translate-x-1 transition-all ease-in-out duration-300">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                      }

                      {!item.increase && !item.decrease &&
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 stroke-2 stroke-purple">
                          <path fillRule="evenodd" d="M3.748 8.248a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75ZM3.748 15.75a.75.75 0 0 1 .75-.751h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                        </svg>

                      }
                    </div>
                    <p className="font-base text-white text-lg w-full leading-none text-center pr-12">{item.name}</p>
                  </div>
                ))}
              </div>
              <p className="text-white font-mono text-sm text-center mt-2">{item.votes} votes</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
