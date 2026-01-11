import './globals.css'

export const metadata = {
  title: 'Personal Dashboard',
  description: 'My daily productivity tool',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
