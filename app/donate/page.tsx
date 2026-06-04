import type { Metadata } from 'next'
import DonateClient from './donate-client'

export const metadata: Metadata = {
  title: 'Donate 💚',
}

export default function DonatePage() {
  return <DonateClient />
}
