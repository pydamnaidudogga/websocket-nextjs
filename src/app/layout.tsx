'use client'

import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
import { WebSocketProvider } from 'next-ws/client';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
  <WebSocketProvider  url="ws://localhost:3000/api/ws">
  {children}
  </WebSocketProvider>
       
      
       
        </body>
    </html>
  );
}
