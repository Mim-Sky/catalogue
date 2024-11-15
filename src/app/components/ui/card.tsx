import Image from "next/image";
import Link from "next/link";

const Card = () => {
  return (
    <div className="rounded overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 ease-in-out">
      <div className="relative">
        <Link href={`#`}>
          {/* Corrected conditional rendering */}
          <Image
            src={"/butterfly.webp"}
            width={330}
            height={330}
            className="w-full object-cover brightness-90 hover:brightness-100 transition duration-300 ease-in-out"
            alt="mountain photo"
          />
        </Link>
      </div>
      <div className="px-6 py-4">
        <Link
          href={`#`}
          className="font-semibold text-lg inline-block transition duration-500 ease-in-out"
        >
          Test Title
        </Link>
        <p className="text-gray-500 text-sm">TEST 1</p>
      </div>
    </div>
  );
};

export default Card;
