import "./globals.css"
import { Inter } from "next/font/google"
import { DataProvider } from "@/lib/DataContext";
import GeolocationHandler from "@/components/GeolocationHandler";
import { TopHeadlistfetchNews } from '@/lib/api';

export const metadata = {
  title:{
    default:"PulseCast - News and Weather Updates",
    template:"%s | PulseCast - News and Weather Updates"
  },
  description:"Get Latest Updates on Weather and New all over the world.",
  icons:{
    icon: [
    { url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    { url: "/favicon/favicon.svg", type: "image/svg+xml" },
    { url: "/favicon/favicon.ico", type: "image/x-icon" },
    ],
    apple: "/favicon/apple-touch-icon.png",
  },
  manifest: "/favicon/site.webmanifest",
  // Open Graph and twitter for social sharing
  openGraph: {
    title: "PulseCast - Weather and News Updates",
    description: "Get personalized weather updates and trending news in one place.",
    url: "https://pulse-cast-pi.vercel.app/",
    siteName: "PulseCast",
    images: [
    {
        url: "/favicon/pulsecast.png",
        width: 1200,
        height: 630,
        alt: "Weather + News App preview",
    },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
      card: "summary_large_image",
      title: "Weather + News App",
      description: "Stay updated with real-time weather and top news headlines.",
      images: ["/favicon/pulsecast.png"],
  },
}

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});


async function getInitialNewsData() {
  try {
    const newsData = await TopHeadlistfetchNews();
    return newsData;
  } catch (error) {
    console.error("Failed to fetch initial news:", error);
    return { error: "Failed to load news" };
  }
}


export default async function RootLayout(
  {children}:{children:React.ReactNode}
){
  const initialNewsData= await getInitialNewsData();
  return(
    <html lang="en">
      <body className={inter.className}>
        <DataProvider 
          initialWeatherData={null}
          initialNewsData={initialNewsData}
          initialSearchData={null}
          >
          <GeolocationHandler />
          {children}
        </DataProvider>
      </body>
    </html>
  )
}