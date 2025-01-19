import Image from 'next/image'

export default function Logo() {
  return (
    <Image
      src="/images/logo.png"
      alt="KeyReach CRM"
      width={150}
      height={40}
      priority
    />
  )
}
