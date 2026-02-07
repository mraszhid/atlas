import Image from 'next/image'

interface AtlasLogoProps {
  size?: number
  showText?: boolean
  textClassName?: string
  className?: string
}

export default function AtlasLogo({ size = 40, showText = true, textClassName, className }: AtlasLogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className ?? ''}`}>
      <Image
        src="/atlas-logo.png"
        alt="ATLAS"
        width={size}
        height={size}
        className="flex-shrink-0"
      />
      {showText && (
        <span className={textClassName ?? 'text-xl font-bold tracking-tight'}>
          ATLAS
        </span>
      )}
    </div>
  )
}
