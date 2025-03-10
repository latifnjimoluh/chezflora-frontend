"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Users, MapPin, Clock, AlertCircle, CheckCircle2 } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

// Sample services data
const services = [
  { id: "mariage", name: "Décoration de Mariage", price: "À partir de 500€" },
  { id: "entreprise", name: "Événements d'Entreprise", price: "À partir de 300€" },
  { id: "anniversaire", name: "Décoration d'Anniversaire", price: "À partir de 150€" },
  { id: "reception", name: "Décoration de Réception", price: "À partir de 200€" },
  { id: "abonnement", name: "Abonnements Floraux", price: "À partir de 45€/mois" },
  { id: "atelier", name: "Ateliers Floraux", price: "À partir de 75€/personne" },
]

export default function ReservationPage() {
  
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [pricingType, setPricingType] = useState("fixed")
  const [formData, setFormData] = useState({
    serviceId: "",
    eventDate: "",
    eventLocation: "",
    guestCount: "",
    spaceDetails: "",
    specialRequests: "",
    name: "",
    email: "",
    phone: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!formData.serviceId || !formData.eventDate || !formData.name || !formData.email || !formData.phone) {
      setError("Veuillez remplir tous les champs obligatoires.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Success scenario
      setSuccess(true)

      // Redirect to reservations page after a delay
      setTimeout(() => {
        router.push("/services/reservations")
      }, 3000)
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  const selectedService = services.find((service) => service.id === formData.serviceId)

  return (
    <div className="flex min-h-screen flex-col bg-off-white">
      <Header />

      <main className="flex-1 py-8 px-4 md:px-8 lg:px-16 bg-off-white bg-[url('/floral-pattern-light.svg')] bg-opacity-5">
        <div className="container mx-auto">
          <h1 className="font-script text-4xl text-center text-light-brown mb-2">
            Réserver un service de décoration florale
          </h1>
          <p className="text-center text-light-brown/80 mb-8 max-w-2xl mx-auto">
            Complétez le formulaire ci-dessous pour réserver l'un de nos services floraux pour votre événement
          </p>

          {success ? (
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center animate-fadeIn">
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="h-16 w-16 text-soft-green" />
              </div>
              <h2 className="font-script text-2xl text-light-brown mb-4">Réservation confirmée !</h2>
              <p className="text-light-brown/80 mb-6">
                Votre demande de réservation a été enregistrée avec succès. Nous vous contacterons prochainement pour
                finaliser les détails.
              </p>
              <div className="flex justify-center space-x-2">
                <div
                  className="h-2 w-2 bg-soft-green rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="h-2 w-2 bg-soft-green rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
                <div
                  className="h-2 w-2 bg-soft-green rounded-full animate-bounce"
                  style={{ animationDelay: "600ms" }}
                ></div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Reservation Form */}
              <div className="lg:col-span-2">
                <Card className="border-none shadow-md">
                  <CardContent className="p-6">
                    {error && (
                      <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <h2 className="font-semibold text-xl text-light-brown mb-4">Détails du service</h2>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="serviceId" className="text-light-brown">
                              Service souhaité <span className="text-red-500">*</span>
                            </Label>
                            <Select
                              value={formData.serviceId}
                              onValueChange={(value) => handleSelectChange("serviceId", value)}
                              required
                            >
                              <SelectTrigger className="bg-beige/30 border-soft-green/20 focus:border-soft-green">
                                <SelectValue placeholder="Sélectionnez un service" />
                              </SelectTrigger>
                              <SelectContent>
                                {services.map((service) => (
                                  <SelectItem key={service.id} value={service.id}>
                                    {service.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="eventDate" className="text-light-brown">
                                Date de l'événement <span className="text-red-500">*</span>
                              </Label>
                              <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-light-brown/60" />
                                <Input
                                  id="eventDate"
                                  name="eventDate"
                                  type="date"
                                  className="pl-10 bg-beige/30 border-soft-green/20 focus:border-soft-green"
                                  value={formData.eventDate}
                                  onChange={handleChange}
                                  required
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="guestCount" className="text-light-brown">
                                Nombre d'invités
                              </Label>
                              <div className="relative">
                                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-light-brown/60" />
                                <Input
                                  id="guestCount"
                                  name="guestCount"
                                  type="number"
                                  placeholder="Nombre approximatif"
                                  className="pl-10 bg-beige/30 border-soft-green/20 focus:border-soft-green"
                                  value={formData.guestCount}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="eventLocation" className="text-light-brown">
                              Lieu de l'événement <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-light-brown/60" />
                              <Input
                                id="eventLocation"
                                name="eventLocation"
                                placeholder="Adresse complète"
                                className="pl-10 bg-beige/30 border-soft-green/20 focus:border-soft-green"
                                value={formData.eventLocation}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="spaceDetails" className="text-light-brown">
                              Détails de l'espace à décorer
                            </Label>
                            <Textarea
                              id="spaceDetails"
                              name="spaceDetails"
                              placeholder="Dimensions, style, contraintes particulières..."
                              className="bg-beige/30 border-soft-green/20 focus:border-soft-green min-h-[100px]"
                              value={formData.spaceDetails}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h2 className="font-semibold text-xl text-light-brown mb-4">Type de tarification</h2>
                        <RadioGroup value={pricingType} onValueChange={setPricingType} className="space-y-3">
                          <div className="flex items-start space-x-3 bg-white p-3 rounded-md border border-soft-green/20">
                            <RadioGroupItem value="fixed" id="fixed" className="mt-1" />
                            <div className="flex-1">
                              <Label htmlFor="fixed" className="font-medium text-light-brown">
                                Tarif fixe
                              </Label>
                              <p className="text-sm text-light-brown/70 mt-1">
                                Tarification standard selon notre grille de prix
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3 bg-white p-3 rounded-md border border-soft-green/20">
                            <RadioGroupItem value="quote" id="quote" className="mt-1" />
                            <div className="flex-1">
                              <Label htmlFor="quote" className="font-medium text-light-brown">
                                Demande de devis personnalisé
                              </Label>
                              <p className="text-sm text-light-brown/70 mt-1">
                                Nous vous contacterons pour établir un devis sur mesure
                              </p>
                            </div>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="specialRequests" className="text-light-brown">
                          Demandes spéciales
                        </Label>
                        <Textarea
                          id="specialRequests"
                          name="specialRequests"
                          placeholder="Couleurs préférées, thème, fleurs spécifiques..."
                          className="bg-beige/30 border-soft-green/20 focus:border-soft-green min-h-[100px]"
                          value={formData.specialRequests}
                          onChange={handleChange}
                        />
                      </div>

                      <div>
                        <h2 className="font-semibold text-xl text-light-brown mb-4">Vos coordonnées</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name" className="text-light-brown">
                              Nom complet <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="name"
                              name="name"
                              className="bg-beige/30 border-soft-green/20 focus:border-soft-green"
                              value={formData.name}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-light-brown">
                              Email <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              className="bg-beige/30 border-soft-green/20 focus:border-soft-green"
                              value={formData.email}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="phone" className="text-light-brown">
                              Téléphone <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="phone"
                              name="phone"
                              className="bg-beige/30 border-soft-green/20 focus:border-soft-green"
                              value={formData.phone}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-4">
                        <Button
                          type="submit"
                          className="w-full bg-soft-green hover:bg-soft-green/90 text-white"
                          disabled={isLoading}
                        >
                          {isLoading ? "Traitement en cours..." : "Réserver ce service"}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Reservation Summary */}
              <div>
                <Card className="border-none shadow-md sticky top-4">
                  <CardContent className="p-6">
                    <h2 className="font-semibold text-xl text-light-brown mb-4">Récapitulatif</h2>

                    {selectedService ? (
                      <div className="space-y-4">
                        <div className="bg-beige/30 p-4 rounded-md">
                          <h3 className="font-medium text-light-brown mb-2">{selectedService.name}</h3>
                          <p className="text-soft-green font-medium">{selectedService.price}</p>
                        </div>

                        {formData.eventDate && (
                          <div className="flex items-start space-x-2 text-light-brown/80">
                            <Calendar className="h-5 w-5 mt-0.5 flex-shrink-0 text-soft-green" />
                            <div>
                              <p className="text-sm font-medium text-light-brown">Date de l'événement</p>
                              <p className="text-sm">
                                {new Date(formData.eventDate).toLocaleDateString("fr-FR", {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                          </div>
                        )}

                        {formData.eventLocation && (
                          <div className="flex items-start space-x-2 text-light-brown/80">
                            <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0 text-soft-green" />
                            <div>
                              <p className="text-sm font-medium text-light-brown">Lieu</p>
                              <p className="text-sm">{formData.eventLocation}</p>
                            </div>
                          </div>
                        )}

                        <div className="flex items-start space-x-2 text-light-brown/80">
                          <Clock className="h-5 w-5 mt-0.5 flex-shrink-0 text-soft-green" />
                          <div>
                            <p className="text-sm font-medium text-light-brown">Délai de réponse</p>
                            <p className="text-sm">Nous vous contacterons sous 24h</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-light-brown/70">
                        <p>Veuillez sélectionner un service pour voir le récapitulatif</p>
                      </div>
                    )}

                    <div className="mt-6 pt-6 border-t border-soft-green/10">
                      <h3 className="font-medium text-light-brown mb-3">Besoin d'aide ?</h3>
                      <p className="text-sm text-light-brown/80 mb-4">
                        Notre équipe est disponible pour répondre à toutes vos questions concernant nos services.
                      </p>
                      <Button
                        variant="outline"
                        className="w-full border-soft-green text-soft-green hover:bg-soft-green/10"
                      >
                        <Link href="/contact">Nous contacter</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

