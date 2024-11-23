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
    <Card className="overflow-hidden">
      <div className="relative h-48">
        <Image
          src={imageUrl}
          alt={title}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <CardContent className="p-4">
        <h2 className="text-xl font-semibold mb-1">{title}</h2>
        <h3 className="text-sm text-muted-foreground italic mb-2">{latinTitle}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{shortDescription}</p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/insect/${slug}`}>
            Learn More
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default InsectCard

