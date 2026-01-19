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
      <section className=" flex flex-col items-center text-center p-12 px-8">
        <h1 className="font-epilogue flex items-center gap-2 text-5xl font-bold">
          Automate your
          <div className="">
            <LightModeIcon className="text-black border bg-[#42C08F] p-2 rounded-full" sx={{ fontSize: 50 }} />
            <DeviceThermostatIcon className="text-black -m-2  border bg-[#D9D9D7] p-2 rounded-full" sx={{ fontSize: 50 }} />
            <AirIcon className="text-black bg-[#d87d56] -m-1  border p-2 rounded-full" sx={{ fontSize: 50 }} />
          </div>
          workflows in just a few clicks
        </h1>
        <h2 className="mt-15 text-lg">Integrate Gmail, Slack, Trello, Google Sheets, and hundreds of other apps in minutes.</h2>
        <div className="sm:mt-15 flex justify-center bg-stone-50">
          <img
            src="/automation.png"
            alt="automatiser les réseaux sociaux"
            className="w-[45%] bg-stone-50"
          />
        </div>
      </section>
      <section className="bg-[#F8F4F0] flex items-center justify-between px-8 py-30">
        <div className="">
          <h1 className="text-8xl uppercase font-bold pt-8">No AI hype here.<br /> Just results.</h1>
          <h2 className="text-8xl font-bold text-[#1DD3C3] text-start pt-4">147,562,1</h2>
          <h2 className="text-2xl mt-3">Tasks automated on Area</h2>
        </div>
        <div className="w-[50%]">
          <img src="/proof.png" alt="how to automate" />
        </div>
      </section>
      <section className="bg-[#ECE5DD] py-15">
        <h1 className="text-8xl font-bold text-center">Over 410 integrations available</h1>
        <div className="flex justify-center mt-5">
          {availablecatego.map((cat, index) => (
            <h2
              key={index}
              className={` text-lg
                  p-2 border hover:underline underline-offset-4 decoration-5 decoration-[#C5C0B1] cursor-pointer
                  ${activeIndex === index ? "underline decoration-teal-500" : ""}
                `}
              onClick={() => setActiveIndex(index)}
            >
              {Object.keys(cat)}
            </h2>
          ))}
        </div>
        <div className="flex gap-4 justify-center mt-12">
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
                className="w-20 h-20"
              />
            );
          })}
        </div>
        <div className="flex flex-col items-center mt-10 gap-4">
          <h3 className="text-lg md:text-xl text-center text-gray-700">
            And we add new integrations every week
          </h3>
          <button className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors shadow-md hover:shadow-lg">
            View all integrations
          </button>
        </div>
      </section>
      <section className="call-to-action">
        <div
          className="relative bg-no-repeat bg-cover bg-center h-[60vh] flex items-center justify-center mx-20 rounded-2xl overflow-hidden"
          style={{ backgroundImage: `url("/footbg.jpg")` }}
        >
          <div className="absolute inset-0 bg-black/50"></div>

          <div className="relative z-10 text-white text-center px-6">
            <h2 className="text-5xl font-bold mb-4">Start Automating Today</h2>
            <p className="text-xl mb-8 font-light">Connect your apps and automate workflows in minutes.</p>

            <form
              action=""
              method="post"
              className="border-2 border-white/80 bg-white/20 backdrop-blur-sm flex justify-between items-center rounded-full p-2 max-w-xl mx-auto shadow-lg"
            >
              <MailIcon className="text-white ml-2" sx={{ fontSize: 30 }} />

              <input
                type="email"
                placeholder="Enter your work email"
                className="flex-1 ml-3 outline-none bg-transparent text-lg text-white placeholder-white/80"
                style={{ border: "none" }}
                required
              />

              <button
                type="submit"
                className="ml-3 cursor-pointer px-8 py-3 bg-teal-500 text-white font-semibold text-base rounded-full hover:bg-teal-600 hover:shadow-xl transition-all duration-300 transform"
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
