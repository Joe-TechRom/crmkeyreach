import HomeContent from '@/components/home/HomeContent';

export const metadata = {
  metadataBase: new URL('https://keyreach-crm.com'),
  title: 'KeyReach CRM',
  description: 'Modern Real Estate CRM Solution',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png'
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://keyreach-crm.com',
    title: 'KeyReach CRM',
    description: 'Modern Real Estate CRM Solution',
    images: [{
      url: '/images/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'KeyReach CRM'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KeyReach CRM',
    description: 'Modern Real Estate CRM Solution',
    images: ['/images/twitter-image.jpg']
  }
};

export default function Home() {
  return <HomeContent />;
}
