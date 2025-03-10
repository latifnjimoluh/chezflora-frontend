import Image from "next/image"
import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface TestimonialCardProps {
  name: string
  image: string
  rating: number
  text: string
}

export default function TestimonialCard({ name, image, rating, text }: TestimonialCardProps) {
  return (
    <Card className="bg-white border-none shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <div className="relative h-20 w-20 rounded-full overflow-hidden mb-4">
            <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
          </div>

          <h3 className="font-semibold text-lg text-light-brown mb-2">{name}</h3>

          <div className="flex mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`h-4 w-4 ${i < rating ? "text-amber-400 fill-amber-400" : "text-gray-300"}`} />
            ))}
          </div>

          <p className="text-light-brown/80 italic">"{text}"</p>
        </div>
      </CardContent>
    </Card>
  )
}

