export const metadata = {
  title: 'IT Asset Tracker',
  description: 'ប្រព័ន្ធគ្រប់គ្រងទ្រព្យសកម្មព័ត៌មានវិទ្យា',
}

export default function RootLayout({ children }) {
  return (
    <html lang="km">
      <body>{children}</body>
    </html>
  )
}