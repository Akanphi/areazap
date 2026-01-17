import { Banner } from "@/components/Banner";
import { Footer } from "@/components/Footer";

export default function PublicLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen flex flex-col bg-stone-50">
            <Banner />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
}
