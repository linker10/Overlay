import Header from "@/components/Header";
import SideBar from "@/components/SideBar";
import ImageEditor from "@/components/Editor/ImageEditor";
import { FontOption } from "@/types/index.type";

/**
 * Server component: fetches Google Fonts list and renders the main layout.
 * Uses no-store caching due to potential payload size limits with ISR.
 */
export default async function Home() {
    let fonts: FontOption[] = [];
    // server-side fetch with ISR / caching
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_FONTS_API_KEY;
    const url = `https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}&sort=popularity`;
  
    const res = await fetch(url, { cache: "no-store" }); // Next js only allow cache for 2MB of data for ISR. Anything more than that cannot be cached by default.
    if (!res.ok) {
      const fallback = [] as FontOption[];
      fonts = fallback;
    } else {
      fonts = await res.json().then(data => data.items);
    }

  return (
    <>
      <Header />
      <main className="mx-10 my-5 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 md:h-[calc(100vh-160px)]">
        <div className="flex flex-col gap-4">
          <SideBar/>
        </div>
        <div className="md:col-span-2 lg:col-span-4 flex-1">
          <ImageEditor fonts={fonts} />
        </div>
      </main>
    </>
  );
}
