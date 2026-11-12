import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import { CartProvider } from '@/lib/cart-context'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata = {
  title: 'The Athlete Factory',
  description: "Lebanon's supplements store — 100% authentic proteins, creatine, pre-workout and more",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-white antialiased`}>
        <CartProvider>
          <Navbar />
          {children}
          <Footer />
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  )
}