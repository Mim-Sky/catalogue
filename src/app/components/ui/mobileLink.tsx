import Link from "next/link"

interface MobileLinkProps {
  title: string;
  path: string;
}

export default function MobileLink({ title, path }:MobileLinkProps) {
  return (
    <Link href={path} className="text-4xl hover:text-earth-gray">{title}</Link>  
  )
}