import { useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"


interface CardProps {
  imageUrl: string
  title: string
  latinTitle: string
  shortDescription: string
  slug: string
}

const InsectCard: React.FC<CardProps> = ({
  imageUrl,
  title,
  latinTitle,
  shortDescription,
  slug,
}) => {
  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="relative h-48 w-full">
        <Image
          src={imageUrl}
          alt={title}
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>
      <CardContent className="flex flex-col justify-between p-4 flex-grow">
        <div className="mb-2">
          <h2 className="text-xl font-semibold mb-1">{title}</h2>
          <h3 className="text-sm text-muted-foreground italic">{latinTitle}</h3>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{shortDescription}</p>
      </CardContent>
      <CardFooter className="p-4">
        <Button 
          asChild
          variant="outline"
          className="w-full bg-white text-black focus:outline-none transition-all duration-300 ease-in-out">
          <Link href={`/insect/${slug}`}>
            Learn More
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default InsectCard

