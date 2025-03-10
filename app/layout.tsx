import type React from "react"
import type { Metadata } from "next"
import { Dancing_Script, Poppins } from "next/font/google"
import "./globals.css"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-dancing-script",
})

export const metadata: Metadata = {
  title: "ChezFlora - Fleuriste Artisanal",
  description: "Découvrez des compositions florales élégantes et naturelles pour tous vos moments de vie.",
    generator: 'v0.dev'
}

export default function RootLayout({children,}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="fr">
      <body className={`${poppins.variable} ${dancingScript.variable} font-sans`}>{children}</body>
    </html>
  )
}


import './globals.css'