import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { CartProvider } from '@/lib/cart-context'
import { LanguageProvider } from '@/lib/language-context'
import { ChatbotWidget } from '@/components/chatbot-widget'
import './globals.css'

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'Platzi Store | Premium Tech Merch',
  description: 'Discover premium tech merchandise at Platzi Store. Minimalist designs, premium quality.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="bg-background">
      <body className={`${inter.variable} font-sans antialiased`}>
        <CartProvider>
          <LanguageProvider>
            <Navbar />
            <main className="min-h-screen pt-20">
              {children}
            </main>
            <Footer />
            <ChatbotWidget />
          </LanguageProvider>
        </CartProvider>
      </body>
    </html>
  )
}
