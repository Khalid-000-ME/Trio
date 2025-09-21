'use client';

import { useRouter } from 'next/navigation';
import { Space_Grotesk } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
});

interface NavigationButtonProps {
  children: React.ReactNode;
  href: string;
}

export default function NavigationButton({ children, href }: NavigationButtonProps) {
  const router = useRouter();

  return (
    <button 
      onClick={() => router.push(href)}
      className={`
        ${spaceGrotesk.className}
        bg-white 
        min-h-[100px] 
        min-w-[300px] 
        rounded-[50px] 
        p-8 
        sm:p-12 
        text-4xl 
        sm:text-2xl 
        font-bold 
        text-black 
        hover:scale-105 
        transition-transform
        cursor-pointer
      `}
    >
      {children}
    </button>
  );
}