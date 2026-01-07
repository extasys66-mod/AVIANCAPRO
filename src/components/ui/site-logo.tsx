import Image from "next/image"


interface SiteLogoProps {
  className?: string
}

export function SiteLogo({ className = "" }: SiteLogoProps) {
  return (
    <Image
      src="/logo.svg"
      alt="Logo"
      width={160}   
      height={56}
     
    />
      
  )
}
