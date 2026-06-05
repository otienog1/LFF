import type { Metadata } from 'next'
import DonateClient from '@/components/donate/DonateClient'

export const metadata: Metadata = { title: 'Donate' }

export default function DonatePage() {
  return <DonateClient />
}
