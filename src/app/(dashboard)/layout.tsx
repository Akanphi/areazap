import Menu from "@/components/Menu"
import Navbar from "@/components/Navbar";
import Link from "next/link";
import Image from "next/image";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section>
      <div className="min-h-screen flex bg-linear-to-br from-slate-50 to-purple-50">
        {/* LEFT */}
        <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4">
          <Link
            href="/"
            className="flex items-center justify-center lg:justify-start gap-2"
          >
            <Image src="/logo.svg" alt="logo" width={50} height={50} />
            <span className="hidden lg:block font-bold">Area</span>
          </Link>
          <Menu />
        </div>

        {/* RIGHT */}
        <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#E3E8E9] overflow-scroll flex flex-col">
          <Navbar />
          {children}
        </div>
      </div>
    </section>
  );
}
