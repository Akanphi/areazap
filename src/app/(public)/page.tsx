"use client"
import { useState } from "react";
import Image from "next/image";
import LightModeIcon from '@mui/icons-material/LightMode';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import AirIcon from '@mui/icons-material/Air';
import MailIcon from '@mui/icons-material/Mail';
import { availablecatego } from "@/data/data";

export default function Home() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const tablogs = Object.values(availablecatego[activeIndex])[0]
  console.log(tablogs)
  return (
    <div className="font-sans">
      <section className="flex flex-col items-center text-center py-12 px-4 md:px-8">
        <h1 className="font-epilogue flex flex-col md:flex-row items-center gap-2 text-3xl md:text-5xl font-bold">
          Automate your
          <div className="my-2 md:my-0">
            <LightModeIcon className="text-black border bg-[#42C08F] p-2 rounded-full" sx={{ fontSize: { xs: 40, md: 50 } }} />
            <DeviceThermostatIcon className="text-black -m-2 border bg-[#D9D9D7] p-2 rounded-full" sx={{ fontSize: { xs: 40, md: 50 } }} />
            <AirIcon className="text-black bg-[#d87d56] -m-1 border p-2 rounded-full" sx={{ fontSize: { xs: 40, md: 50 } }} />
          </div>
          workflows in just a few clicks
        </h1>
        <h2 className="mt-8 md:mt-15 text-base md:text-lg px-4">Integrate Gmail, Slack, Trello, Google Sheets, and hundreds of other apps in minutes.</h2>
        <div className="mt-8 md:mt-15 flex justify-center bg-stone-50 w-full">
          <img
            src="/automation.png"
            alt="automatiser les réseaux sociaux"
            className="w-full md:w-[45%] bg-stone-50"
          />
        </div>
      </section>
      <section className="bg-[#F8F4F0] flex flex-col-reverse md:flex-row items-center justify-between px-4 md:px-8 py-16 md:py-30 gap-8 md:gap-0">
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-8xl uppercase font-bold pt-8">No AI hype here.<br /> Just results.</h1>
          <h2 className="text-4xl md:text-8xl font-bold text-[#1DD3C3] text-center md:text-start pt-4">147,562,1</h2>
          <h2 className="text-xl md:text-2xl mt-3">Tasks automated on Area</h2>
        </div>
        <div className="w-full md:w-[50%]">
          <img src="/proof.png" alt="how to automate" className="w-full h-auto" />
        </div>
      </section>
      <section className="bg-[#ECE5DD] py-16 md:py-15 px-4">
        <h1 className="text-4xl md:text-8xl font-bold text-center">Over 410 integrations available</h1>
        <div className="flex flex-wrap justify-center mt-5 gap-2">
          {availablecatego.map((cat, index) => (
            <h2
              key={index}
              className={` text-sm md:text-lg
                  p-2 border hover:underline underline-offset-4 decoration-5 decoration-[#C5C0B1] cursor-pointer
                  ${activeIndex === index ? "underline decoration-teal-500" : ""}
                `}
              onClick={() => setActiveIndex(index)}
            >
              {Object.keys(cat)}
            </h2>
          ))}
        </div>
        <div className="flex flex-wrap gap-4 justify-center mt-12">
          {tablogs.map((tab: string, index: number) => {
            const altText = tab
              .replace(/^\//, "")
              .replace(".svg", "")
              .replace(/^./, c => c.toUpperCase());

            return (
              <img
                src={tab}
                alt={altText}
                title={altText}
                key={index}
                className="w-16 h-16 md:w-20 md:h-20"
              />
            );
          })}
        </div>
        <div className="flex flex-col items-center mt-10 gap-4">
          <h3 className="text-lg md:text-xl text-center text-gray-700 px-4">
            And we add new integrations every week
          </h3>
          <button className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors shadow-md hover:shadow-lg">
            View all integrations
          </button>
        </div>
      </section>
      <section className="call-to-action py-8 md:py-0">
        <div
          className="relative bg-no-repeat bg-cover bg-center h-auto py-20 md:h-[60vh] flex items-center justify-center mx-4 md:mx-20 rounded-2xl overflow-hidden"
          style={{ backgroundImage: `url("/footbg.jpg")` }}
        >
          <div className="absolute inset-0 bg-black/50"></div>

          <div className="relative z-10 text-white text-center px-4 md:px-6 w-full max-w-4xl">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Start Automating Today</h2>
            <p className="text-lg md:text-xl mb-8 font-light">Connect your apps and automate workflows in minutes.</p>

            <form
              action=""
              method="post"
              className="border-2 border-white/80 bg-white/20 backdrop-blur-sm flex flex-col md:flex-row justify-between items-center rounded-2xl md:rounded-full p-4 md:p-2 max-w-xl mx-auto shadow-lg gap-4 md:gap-0"
            >
              <div className="flex items-center w-full md:w-auto">
                <MailIcon className="text-white ml-2 hidden md:block" sx={{ fontSize: 30 }} />
                <input
                  type="email"
                  placeholder="Enter your work email"
                  className="flex-1 ml-0 md:ml-3 outline-none bg-transparent text-lg text-white placeholder-white/80 w-full text-center md:text-left"
                  style={{ border: "none" }}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full md:w-auto cursor-pointer px-8 py-3 bg-teal-500 text-white font-semibold text-base rounded-xl md:rounded-full hover:bg-teal-600 hover:shadow-xl transition-all duration-300 transform"
              >
                Get Started
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
