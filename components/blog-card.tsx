import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

interface BlogCardProps {
  title: string
  image: string
  excerpt: string
  date: string
  slug: string
}

export default function BlogCard({ title, image, excerpt, date, slug }: BlogCardProps) {
  return (
    <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300 h-full">
      <div className="relative h-48 w-full">
        <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
      </div>
      <CardContent className="p-4">
        <div className="text-sm text-soft-green mb-2">{date}</div>
        <h3 className="font-semibold text-lg text-light-brown mb-2">{title}</h3>
        <p className="text-light-brown/80 mb-4 line-clamp-3">{excerpt}</p>
        <Link href={slug} className="text-light-brown font-medium hover:text-soft-green transition-colors">
          Lire la suite →
        </Link>
      </CardContent>
    </Card>
  )
}

