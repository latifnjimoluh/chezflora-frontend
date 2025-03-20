"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Star, StarHalf, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import API from "@/services/apis"

interface Testimonial {
  id: number
  name: string
  text: string
  rating: number
  image: string
  is_featured: boolean
  created_at: string
}

export default function TestimonialsPage() {
  const router = useRouter()
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    text: "",
    rating: 5,
  })

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token")
      setIsLoggedIn(!!token)
    }

    const fetchTestimonials = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const data = await API.testimonials.getAll()
        setTestimonials(data || [])
      } catch (err: any) {
        console.error("Erreur lors du chargement des témoignages:", err)
        setError(err.message || "Une erreur est survenue lors du chargement des témoignages.")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
    fetchTestimonials()

    // Écouter les changements d'authentification
    window.addEventListener("storage", checkAuth)

    return () => {
      window.removeEventListener("storage", checkAuth)
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRatingChange = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.text) {
      setError("Veuillez remplir tous les champs obligatoires.")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await API.testimonials.addTestimonial({
        name: formData.name,
        text: formData.text,
        rating: formData.rating,
      })

      setSubmitSuccess(true)

      // Réinitialiser le formulaire
      setFormData({
        name: "",
        text: "",
        rating: 5,
      })

      // Fermer le dialogue après un délai
      setTimeout(() => {
        setShowAddDialog(false)
        setSubmitSuccess(false)

        // Recharger les témoignages
        API.testimonials.getAll().then((data) => {
          setTestimonials(data || [])
        })
      }, 2000)
    } catch (err: any) {
      console.error("Erreur lors de l'ajout du témoignage:", err)
      setError(err.message || "Une erreur est survenue lors de l'ajout du témoignage.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Fonction pour afficher les étoiles en fonction de la note
  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-5 w-5 fill-yellow-400 text-yellow-400" />)
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="h-5 w-5 fill-yellow-400 text-yellow-400" />)
    }

    const emptyStars = 5 - stars.length
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-5 w-5 text-gray-300" />)
    }

    return stars
  }

  return (
    <div className="flex min-h-screen flex-col bg-off-white">
      <Header />

      <main className="flex-1 py-16 px-4 md:px-8 lg:px-16 bg-off-white bg-[url('/floral-pattern-light.svg')] bg-opacity-5">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-script text-4xl md:text-5xl text-light-brown mb-4">Témoignages de nos clients</h1>
            <p className="text-light-brown/80 max-w-2xl mx-auto">
              Découvrez ce que nos clients disent de nos services et produits. Votre satisfaction est notre priorité.
            </p>

            {isLoggedIn && (
              <Button
                className="mt-6 bg-soft-green hover:bg-soft-green/90 text-white"
                onClick={() => setShowAddDialog(true)}
              >
                Partager votre expérience
              </Button>
            )}
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-soft-green" />
            </div>
          ) : error ? (
            <Alert variant="destructive" className="max-w-md mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : testimonials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <Card
                  key={testimonial.id}
                  className="border-none shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
                        <Image
                          src={testimonial.image || "/placeholder.svg?height=100&width=100"}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-light-brown">{testimonial.name}</h3>
                        <div className="flex">{renderStars(testimonial.rating)}</div>
                      </div>
                    </div>
                    <p className="text-light-brown/80 italic">"{testimonial.text}"</p>
                    <div className="mt-4 text-right">
                      <span className="text-light-brown/60 text-sm">
                        {new Date(testimonial.created_at).toLocaleDateString("fr-FR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-light-brown text-lg mb-4">Aucun témoignage disponible pour le moment.</p>
              {isLoggedIn && (
                <Button
                  className="bg-soft-green hover:bg-soft-green/90 text-white"
                  onClick={() => setShowAddDialog(true)}
                >
                  Soyez le premier à partager votre expérience
                </Button>
              )}
            </div>
          )}

          {!isLoggedIn && (
            <div className="mt-12 text-center">
              <p className="text-light-brown/80 mb-4">Vous souhaitez partager votre expérience avec ChezFlora ?</p>
              <Button
                className="bg-soft-green hover:bg-soft-green/90 text-white"
                onClick={() => router.push("/login?redirect=/testimonials")}
              >
                Connectez-vous pour laisser un témoignage
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Dialogue pour ajouter un témoignage */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-script text-2xl text-light-brown">
              {submitSuccess ? "Merci pour votre témoignage !" : "Partagez votre expérience"}
            </DialogTitle>
            <DialogDescription>
              {submitSuccess
                ? "Votre témoignage a été enregistré avec succès."
                : "Votre avis est important pour nous et aide d'autres clients à découvrir nos services."}
            </DialogDescription>
          </DialogHeader>

          {submitSuccess ? (
            <div className="flex flex-col items-center justify-center py-4">
              <CheckCircle2 className="h-16 w-16 text-soft-green mb-4" />
              <p className="text-center text-light-brown/80">Merci d'avoir partagé votre expérience avec nous !</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name" className="text-light-brown">
                  Votre nom <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Votre nom complet"
                  className="bg-beige/30 border-soft-green/20 focus:border-soft-green"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rating" className="text-light-brown">
                  Votre note <span className="text-red-500">*</span>
                </Label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => handleRatingChange(rating)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          rating <= formData.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="text" className="text-light-brown">
                  Votre témoignage <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="text"
                  name="text"
                  placeholder="Partagez votre expérience avec nous..."
                  className="bg-beige/30 border-soft-green/20 focus:border-soft-green min-h-[120px]"
                  value={formData.text}
                  onChange={handleChange}
                  required
                />
              </div>

              <DialogFooter className="sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddDialog(false)}
                  className="border-light-brown text-light-brown hover:bg-light-brown/10"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="bg-soft-green hover:bg-soft-green/90 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    "Envoyer mon témoignage"
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

