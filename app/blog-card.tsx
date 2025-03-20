import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { formatDate } from "@/utils/format-utils"

interface BlogCardProps {
  title: string
  image: string
  excerpt: string
  date: string
  slug: string
}

export default function BlogCard({ title, image, excerpt, date, slug }: BlogCardProps) {
  return (
    <Link href={`/blog/${slug}`}>
      <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300 h-full">
        <div className="relative h-48 w-full">
          <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
        </div>
        <CardContent className="p-4">
          <div className="text-xs text-light-brown/60 mb-2">{formatDate(date)}</div>
          <h3 className="font-script text-xl text-light-brown mb-2">{title}</h3>
          <p className="text-light-brown/80 line-clamp-3">{excerpt}</p>
          <div className="mt-3 text-soft-green hover:underline text-sm">Lire la suite →</div>
        </CardContent>
      </Card>
    </Link>
  )
}

