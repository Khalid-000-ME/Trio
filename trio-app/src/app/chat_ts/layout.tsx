import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trio AI Chat - Collaborative Intelligence",
  description: "Experience collaborative AI with multiple intelligent agents working together",
};

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-[50px] p-6 min-w-[900px] max-w-[1200px] border border-white/20 h-[calc(100vh-300px)] w-full mx-4 my-2 overflow-hidden">
      {children}
    </div>
  );
}
