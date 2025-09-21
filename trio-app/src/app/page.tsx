import Image from "next/image";
import { Space_Grotesk } from 'next/font/google'
import NavigationButton from "@/components/NavigationButton";

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
})

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <NavigationButton href="/chat_ts">
          Enter the world of clarity
        </NavigationButton>
      </main>
    </div>
  );
}
