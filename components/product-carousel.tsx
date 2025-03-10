"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Sample product data
const products = [
  {
    id: 1,
    name: "Bouquet Printanier",
    image: "/placeholder.svg?height=300&width=300",
    price: "45,00 €",
    category: "Bouquets",
    slug: "/boutique/bouquet-printanier",
  },
  {
    id: 2,
    name: "Roses Pastel",
    image: "/placeholder.svg?height=300&width=300",
    price: "35,00 €",
    category: "Fleurs Fraîches",
    slug: "/boutique/roses-pastel",
  },
  {
    id: 3,
    name: "Orchidée Élégante",
    image: "/placeholder.svg?height=300&width=300",
    price: "55,00 €",
    category: "Plantes",
    slug: "/boutique/orchidee-elegante",
  },
  {
    id: 4,
    name: "Composition Exotique",
    image: "/placeholder.svg?height=300&width=300",
    price: "65,00 €",
    category: "Compositions",
    slug: "/boutique/composition-exotique",
  },
  {
    id: 5,
    name: "Bouquet de Saison",
    image: "/placeholder.svg?height=300&width=300",
    price: "40,00 €",
    category: "Bouquets",
    slug: "/boutique/bouquet-saison",
  },
  {
    id: 6,
    name: "Plante Verte Décorative",
    image: "/placeholder.svg?height=300&width=300",
    price: "38,00 €",
    category: "Plantes",
    slug: "/boutique/plante-verte-decorative",
  },
]

export default function ProductCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visibleItems, setVisibleItems] = useState(3)
  const containerRef = useRef<HTMLDivElement>(null)

  // Update visible items based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleItems(1)
      } else if (window.innerWidth < 1024) {
        setVisibleItems(2)
      } else {
        setVisibleItems(3)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const totalSlides = Math.ceil(products.length / visibleItems)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === totalSlides - 1 ? 0 : prevIndex + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? totalSlides - 1 : prevIndex - 1))
  }

  const startIdx = currentIndex * visibleItems
  const visibleProducts = products.slice(startIdx, startIdx + visibleItems)

  return (
    <div className="relative">
      <div className="flex justify-between absolute top-1/2 left-0 right-0 -mt-6 px-4 z-10">
        <Button
          variant="outline"
          size="icon"
          className="bg-white/80 hover:bg-white border-soft-green/30 text-light-brown rounded-full"
          onClick={prevSlide}
          aria-label="Produit précédent"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="bg-white/80 hover:bg-white border-soft-green/30 text-light-brown rounded-full"
          onClick={nextSlide}
          aria-label="Produit suivant"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      <div ref={containerRef} className="overflow-hidden">
        <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(0)` }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {visibleProducts.map((product) => (
              <Link href={product.slug} key={product.id}>
                <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300 h-full">
                  <div className="relative h-64 w-full">
                    <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                    <div className="absolute top-2 left-2 bg-powder-pink px-2 py-1 rounded-full text-xs text-light-brown">
                      {product.category}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg text-light-brown">{product.name}</h3>
                    <p className="text-soft-green font-medium mt-1">{product.price}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full ${index === currentIndex ? "bg-soft-green" : "bg-soft-green/30"}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Aller à la diapositive ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

