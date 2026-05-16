import { Poppins } from 'next/font/google'
import '../styles/globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
})

export const metadata = {
  title: 'Magwi University of Technology',
  description: 'Online university dedicated to world-class IT education anytime, anywhere.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="min-h-screen antialiased font-sans bg-white text-gray-900 dark:bg-slate-950 dark:text-slate-100">{children}</body>
    </html>
  )
}
