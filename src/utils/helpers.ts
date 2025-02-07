import { Metadata } from 'next/types';

export function getURL() {
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
}

export function constructMetadata({
  title = 'KeyReach CRM - The CRM for KeyReachers',
  description = 'KeyReach CRM is a customer relationship management (CRM) platform designed to help businesses manage their interactions with customers and prospects.',
  image = '/og.png',
  icons = '/favicon.ico',
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    icons,
    metadataBase: new URL(getURL()),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
