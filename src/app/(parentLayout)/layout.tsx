import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer"
export default function parentLayouts({children,}: { children: React.ReactNode }) {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className="min-h-[75vh]">{children}</main>
      <Footer/>
    </>
  );
}