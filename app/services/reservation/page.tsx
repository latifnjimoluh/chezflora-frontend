"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Users, MapPin, Clock, AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import API from "@/services/apis"

// Type pour les services
interface Service {
  id_service: string
  nom: string
  description: string
  categorie: string
  tarification: string
  disponibilite: boolean
  dimension: string
  nb_personnes: number
  lieu: string
}

// Type pour l'utilisateur
interface User {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string
}

export default function ReservationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const serviceIdFromUrl = searchParams.get("serviceId")

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [services, setServices] = useState<Service[]>([])
  const [loadingServices, setLoadingServices] = useState(true)
  const [loadingUser, setLoadingUser] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const [formData, setFormData] = useState({
    serviceId: serviceIdFromUrl || "",
    eventDate: "",
    eventLocation: "",
    guestCount: "",
    spaceDetails: "",
    specialRequests: "",
    name: "",
    email: "",
    phone: "",
    prixPropose: "",
  })

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = API.auth.isAuthenticated()
      setIsAuthenticated(isAuth)

      if (!isAuth) {
        // Rediriger vers la page de connexion avec un paramètre de redirection
        router.push(`/login?redirect=/services/reservation${serviceIdFromUrl ? `?serviceId=${serviceIdFromUrl}` : ""}`)
      }
    }

    checkAuth()
  }, [router, serviceIdFromUrl])

  // Charger les informations de l'utilisateur connecté
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!isAuthenticated) return

      try {
        setLoadingUser(true)
        const userData = await API.auth.getCurrentUser()
        setUser(userData)

        // Pré-remplir les coordonnées de l'utilisateur
        setFormData((prev) => ({
          ...prev,
          name: `${userData.first_name} ${userData.last_name}`,
          email: userData.email,
          phone: userData.phone || "",
        }))
      } catch (err) {
        console.error("Erreur lors du chargement des informations utilisateur:", err)
      } finally {
        setLoadingUser(false)
      }
    }

    fetchUserInfo()
  }, [isAuthenticated])

  // Charger les services disponibles sur devis
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoadingServices(true)
        // Récupérer uniquement les services sur devis
        const allServices = await API.services.getServicesSurDevis()
        setServices(allServices)

        // Si un serviceId est fourni dans l'URL et qu'il n'est pas déjà dans formData
        if (serviceIdFromUrl && !formData.serviceId) {
          setFormData((prev) => ({ ...prev, serviceId: serviceIdFromUrl }))

          // Charger les détails du service sélectionné
          try {
            const serviceDetails = await API.services.getServiceById(serviceIdFromUrl)
            if (serviceDetails && serviceDetails.tarification !== "Sur devis") {
              // Rediriger vers la page de détail du service si ce n'est pas un service sur devis
              router.push(`/services/${serviceIdFromUrl}`)
            }
          } catch (err) {
            console.error("Erreur lors du chargement des détails du service:", err)
          }
        }
      } catch (err) {
        console.error("Erreur lors du chargement des services:", err)
        setError("Impossible de charger la liste des services. Veuillez réessayer.")
      } finally {
        setLoadingServices(false)
      }
    }

    if (isAuthenticated) {
      fetchServices()
    }
  }, [serviceIdFromUrl, formData.serviceId, router, isAuthenticated])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation de base
    if (!formData.serviceId || !formData.eventDate || !formData.name || !formData.email || !formData.phone) {
      setError("Veuillez remplir tous les champs obligatoires.")
      return
    }

    // Validation du prix proposé
    if (!formData.prixPropose) {
      setError("Veuillez proposer un prix pour votre demande de devis.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Préparer les données pour l'API
      const devisData = {
        service_id: formData.serviceId,
        dimension: formData.spaceDetails,
        nb_personnes: Number.parseInt(formData.guestCount) || 0,
        lieu: formData.eventLocation === "intérieur" ? "intérieur" : "extérieur",
        prix_propose: Number.parseFloat(formData.prixPropose),
        date_evenement: formData.eventDate,
        adresse: formData.eventLocation,
        details: formData.spaceDetails,
        message_client: formData.specialRequests,
      }

      // Appel à l'API pour ajouter une discussion de devis
      await API.reservations.ajouterDiscussionDevis(devisData)

      // Succès
      setSuccess(true)

      // Redirection vers la page des réservations après un délai
      setTimeout(() => {
        router.push("/services/reservations")
      }, 3000)
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  const selectedService = services.find((service) => service.id_service === formData.serviceId)

  if (!isAuthenticated) {
    return null // Ne rien afficher pendant la redirection
  }

  if (loadingUser || loadingServices) {
    return (
      <div className="flex min-h-screen flex-col bg-off-white">
        <Header />
        <main className="flex-1 py-16 px-4 md:px-8 lg:px-16">
          <div className="container mx-auto">
            <div className="flex justify-center items-center min-h-[50vh]">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-soft-green" />
                <p className="text-light-brown">Chargement des informations...</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-off-white">
      <Header />

      <main className="flex-1 py-8 px-4 md:px-8 lg:px-16 bg-off-white bg-[url('/floral-pattern-light.svg')] bg-opacity-5">
        <div className="container mx-auto">
          <h1 className="font-script text-4xl text-center text-light-brown mb-2">Demande de devis personnalisé</h1>
          <p className="text-center text-light-brown/80 mb-8 max-w-2xl mx-auto">
            Complétez le formulaire ci-dessous pour demander un devis personnalisé pour l'un de nos services floraux
          </p>

          {success ? (
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center animate-fadeIn">
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="h-16 w-16 text-soft-green" />
              </div>
              <h2 className="font-script text-2xl text-light-brown mb-4">Demande envoyée !</h2>
              <p className="text-light-brown/80 mb-6">
                Votre demande de devis a été enregistrée avec succès. Nous vous contacterons prochainement pour discuter
                des détails et vous proposer un tarif personnalisé.
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
                              disabled={loadingServices}
                            >
                              <SelectTrigger className="bg-beige/30 border-soft-green/20 focus:border-soft-green">
                                <SelectValue
                                  placeholder={
                                    loadingServices ? "Chargement des services..." : "Sélectionnez un service"
                                  }
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {services.map((service) => (
                                  <SelectItem key={service.id_service} value={service.id_service}>
                                    {service.nom}
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
                                Nombre d'invités <span className="text-red-500">*</span>
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
                                  required
                                />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="eventLocation" className="text-light-brown">
                              Type de lieu <span className="text-red-500">*</span>
                            </Label>
                            <select
                              id="eventLocation"
                              name="eventLocation"
                              className="w-full p-2 rounded-md bg-beige/30 border-soft-green/20 focus:border-soft-green"
                              value={formData.eventLocation}
                              onChange={(e) => setFormData((prev) => ({ ...prev, eventLocation: e.target.value }))}
                              required
                            >
                              <option value="">Sélectionnez un type</option>
                              <option value="intérieur">Intérieur</option>
                              <option value="extérieur">Extérieur</option>
                            </select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="spaceDetails" className="text-light-brown">
                              Dimensions (m²) <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="spaceDetails"
                              name="spaceDetails"
                              placeholder="Surface à décorer"
                              className="bg-beige/30 border-soft-green/20 focus:border-soft-green"
                              value={formData.spaceDetails}
                              onChange={handleChange}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="prixPropose" className="text-light-brown">
                              Budget proposé (XAF) <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="prixPropose"
                              name="prixPropose"
                              type="number"
                              step="0.01"
                              placeholder="Votre budget"
                              className="bg-beige/30 border-soft-green/20 focus:border-soft-green"
                              value={formData.prixPropose}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="specialRequests" className="text-light-brown">
                          Demandes spéciales <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id="specialRequests"
                          name="specialRequests"
                          placeholder="Couleurs préférées, thème, fleurs spécifiques..."
                          className="bg-beige/30 border-soft-green/20 focus:border-soft-green min-h-[100px]"
                          value={formData.specialRequests}
                          onChange={handleChange}
                          required
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
                              disabled={true} // Toujours désactivé car pré-rempli
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
                              disabled={true} // Toujours désactivé car pré-rempli
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
                              disabled={true} // Toujours désactivé car pré-rempli
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
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Traitement en cours...
                            </>
                          ) : (
                            "Envoyer ma demande de devis"
                          )}
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
                          <h3 className="font-medium text-light-brown mb-2">{selectedService.nom}</h3>
                          <p className="text-soft-green font-medium">Sur devis</p>
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
                              <p className="text-sm font-medium text-light-brown">Type de lieu</p>
                              <p className="text-sm">{formData.eventLocation}</p>
                            </div>
                          </div>
                        )}

                        {formData.prixPropose && (
                          <div className="flex items-start space-x-2 text-light-brown/80">
                            <div className="h-5 w-5 mt-0.5 flex-shrink-0 text-soft-green flex items-center justify-center font-bold">
                              XAF
                            </div>
                            <div>
                              <p className="text-sm font-medium text-light-brown">Budget proposé</p>
                              <p className="text-sm">{Number.parseFloat(formData.prixPropose).toFixed(2)} XAF</p>
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

