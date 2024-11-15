import Image from "next/image";
import Link from "next/link";

interface CardProps {
  imageUrl: string | null; 
  title: string;
  latinTitle: string;
  description: string;
  slug: string;
}

const Card = ({ imageUrl, title, latinTitle, description, slug }: CardProps) => {
  return (
    <div className="rounded overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 ease-in-out bg-glacialBlue/20">
      <div className="relative">
        <Link href={`/insect/${slug}`}>
          <Image
            src={imageUrl}
            width={330}
            height={330}
            className="w-full object-cover brightness-90 hover:brightness-100 transition duration-300 ease-in-out"
            alt={title}
          />
        </Link>
      </div>
      <div className="px-6 py-4">
        <Link
          href={`/insect/${slug}`}
          className="font-semibold text-lg inline-block transition duration-500 ease-in-out"
        >
          <h1>{title}</h1>
          <h2>{latinTitle}</h2>
        </Link>
        <p className="text-gray-500 text-sm">{description}</p>
      </div>
    </div>
  );
};

export default Card;
