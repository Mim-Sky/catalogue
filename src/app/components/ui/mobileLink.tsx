import Link from "next/link"

export default function MobileLink({ title, path }) {
  return (
    <Link href={path} className="text-4xl hover:text-earth-gray">{title}</Link>  
  )
}