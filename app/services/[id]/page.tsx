"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Home, Calendar, AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Header from "@/components/header"
import Footer from "@/components/footer"
import API, { type Service } from "@/services/apis"

export default function ServiceDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [service, setService] = useState<Service | null>(null)
  const [loading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mainImage, setMainImage] = useState<string | null>(null)
  const [showReservationModal, setShowReservationModal] = useState(false)
  const [reservationSuccess, setReservationSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const [formData, setFormData] = useState({
    lieu: "",
    date_evenement: "",
    adresse: "",
    details: "",
    message_client: "",
  })

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = API.auth.isAuthenticated()
      setIsAuthenticated(isAuth)
    }

    checkAuth()
  }, [])

  useEffect(() => {
    const fetchService = async () => {
      try {
        setIsLoading(true)
        // Utiliser l'ID tel quel sans conversion
        const data = await API.services.getServiceById(params.id)

        // Vérifier si "images" est une chaîne JSON et la convertir en tableau
        const parsedImages = typeof data.images === "string" ? JSON.parse(data.images) : data.images

        setService({ ...data, images: parsedImages })

        // Définir la première image comme image principale
        if (parsedImages && Array.isArray(parsedImages) && parsedImages.length > 0) {
          setMainImage(parsedImages[0])
        }

        setIsLoading(false)
      } catch (err: any) {
        setError(err.message || "Erreur lors du chargement du service")
        setIsLoading(false)
      }
    }

    fetchService()
  }, [params.id])

  const handleReservation = () => {
    // Vérifier si l'utilisateur est connecté
    if (!isAuthenticated) {
      // Rediriger vers la page de connexion avec un paramètre de redirection
      router.push(`/login?redirect=/services/${params.id}`)
      return
    }

    if (service?.tarification === "Sur devis") {
      // Rediriger vers la page de demande de devis
      router.push(`/services/reservation?serviceId=${params.id}`)
    } else {
      // Afficher le modal pour les services à prix fixe
      setShowReservationModal(true)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmitReservation = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.lieu || !formData.date_evenement || !formData.adresse || !formData.message_client) {
      setError("Veuillez remplir tous les champs obligatoires.")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const reservationData = {
        service_id: params.id,
        lieu: formData.lieu,
        date_evenement: formData.date_evenement,
        adresse: formData.adresse,
        details: formData.details,
        message_client: formData.message_client,
      }

      await API.reservations.reserveService(reservationData)
      setReservationSuccess(true)

      // Fermer le modal après 3 secondes et rediriger vers la page des réservations
      setTimeout(() => {
        setShowReservationModal(false)
        router.push("/services/reservations")
      }, 3000)
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de la réservation.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-off-white">
        <Header />
        <main className="flex-1 py-8 px-4 md:px-8 lg:px-16 bg-off-white">
          <div className="container mx-auto text-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-soft-green mx-auto mb-4" />
            <p className="text-light-brown">Chargement du service...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !service) {
    return (
      <div className="flex min-h-screen flex-col bg-off-white">
        <Header />
        <main className="flex-1 py-8 px-4 md:px-8 lg:px-16 bg-off-white">
          <div className="container mx-auto text-center py-12">
            <Alert variant="destructive" className="max-w-md mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error || "Service non trouvé"}</AlertDescription>
            </Alert>
            <Button
              className="mt-4 bg-soft-green hover:bg-soft-green/90 text-white"
              onClick={() => router.push("/services")}
            >
              Retour aux services
            </Button>
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
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm">
            <ol className="flex items-center space-x-2">
              <li>
                <Link href="/" className="text-light-brown/70 hover:text-light-brown">
                  Accueil
                </Link>
              </li>
              <li className="text-light-brown/70">/</li>
              <li>
                <Link href="/services" className="text-light-brown/70 hover:text-light-brown">
                  Services
                </Link>
              </li>
              <li className="text-light-brown/70">/</li>
              <li>
                <Link href={`/services/${params.id}`} className="text-light-brown font-medium">
                  {service.nom}
                </Link>
              </li>
            </ol>
          </nav>

          {/* Service Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Service Image */}
            <div className="space-y-4">
              <div className="relative h-[400px] md:h-[500px] w-full rounded-lg overflow-hidden border border-soft-green/10">
                <Image
                  src={mainImage || "/placeholder.svg?height=600&width=600"}
                  alt={service.nom}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute top-4 right-4 bg-powder-pink px-3 py-1 rounded-full text-sm text-light-brown">
                  {service.categorie}
                </div>
              </div>

              {/* Thumbnails */}
              {service.images && Array.isArray(service.images) && service.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {service.images.map((image, index) => (
                    <div
                      key={index}
                      className={`relative h-20 rounded-md overflow-hidden border border-soft-green/10 cursor-pointer ${
                        mainImage === image ? "ring-2 ring-soft-green" : ""
                      }`}
                      onClick={() => setMainImage(image)}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${service.nom} - image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Service Info */}
            <div className="space-y-6">
              <div>
                <h1 className="font-script text-3xl md:text-4xl text-light-brown">{service.nom}</h1>
                <p className="text-light-brown/70 mt-1">{service.categorie}</p>
              </div>

              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-semibold text-light-brown">
                  {typeof service.tarification === "number" ? `${service.tarification} XAF` : service.tarification}
                </span>
                {service.mis_en_avant && <Badge className="bg-soft-green text-white">Populaire</Badge>}
              </div>

              <p className="text-light-brown/80">{service.description}</p>

              <div className="space-y-3 pt-4 border-t border-soft-green/10">
                {service.dimension && (
                  <div className="flex items-start space-x-2 text-light-brown/70">
                    <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm">Dimension: {service.dimension}</p>
                    </div>
                  </div>
                )}

                {service.nb_personnes > 0 && (
                  <div className="flex items-start space-x-2 text-light-brown/70">
                    <Users className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm">Pour {service.nb_personnes} personnes</p>
                    </div>
                  </div>
                )}

                {service.lieu && (
                  <div className="flex items-start space-x-2 text-light-brown/70">
                    <Home className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm">Lieu: {service.lieu}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-6">
                <Button
                  size="lg"
                  className="w-full bg-soft-green hover:bg-soft-green/90 text-white"
                  onClick={handleReservation}
                >
                  {service.tarification === "Sur devis" ? "Demander un devis" : "Réserver maintenant"}
                </Button>

                {!isAuthenticated && (
                  <p className="text-sm text-light-brown/70 text-center mt-2">
                    Vous devez être connecté pour réserver ce service
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mb-16">
            <Tabs defaultValue="details">
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                <TabsTrigger value="details">Détails</TabsTrigger>
                <TabsTrigger value="conditions">Conditions</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="mt-6">
                <Card className="border-none shadow-md">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-light-brown mb-4">Détails du service</h3>
                    <p className="text-light-brown/80 mb-4">{service.description}</p>

                    {service.tarification === "Sur devis" && (
                      <div className="bg-beige/30 p-4 rounded-md mt-4">
                        <h4 className="font-medium text-light-brown mb-2">Information importante</h4>
                        <p className="text-light-brown/80">
                          Ce service est proposé sur devis. Le prix final sera déterminé en fonction de vos besoins
                          spécifiques. Veuillez remplir le formulaire de demande de devis pour obtenir une proposition
                          personnalisée.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="conditions" className="mt-6">
                <Card className="border-none shadow-md">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-light-brown mb-4">Conditions de réservation</h3>
                    <ul className="list-disc pl-5 space-y-2 text-light-brown/80">
                      <li>La réservation est confirmée après validation par notre équipe.</li>
                      <li>Un acompte de 30% peut être demandé pour confirmer la réservation.</li>
                      <li>Annulation gratuite jusqu'à 7 jours avant la date prévue.</li>
                      <li>En cas d'annulation tardive, des frais peuvent s'appliquer.</li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />

      {/* Modal de réservation pour les services à prix fixe */}
      <Dialog open={showReservationModal} onOpenChange={setShowReservationModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-script text-2xl text-light-brown">
              {reservationSuccess ? "Réservation confirmée !" : "Réserver ce service"}
            </DialogTitle>
            <DialogDescription>
              {reservationSuccess
                ? "Votre réservation a été enregistrée avec succès. Nous vous contacterons prochainement."
                : "Veuillez compléter les informations suivantes pour finaliser votre réservation."}
            </DialogDescription>
          </DialogHeader>

          {reservationSuccess ? (
            <div className="flex flex-col items-center justify-center py-4">
              <CheckCircle2 className="h-16 w-16 text-soft-green mb-4" />
              <p className="text-center text-light-brown/80">
                Vous allez être redirigé vers la page de vos réservations...
              </p>
              <div className="flex justify-center space-x-2 mt-4">
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
            <form onSubmit={handleSubmitReservation} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="date_evenement" className="text-light-brown">
                  Date de l'événement <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-light-brown/60" />
                  <Input
                    id="date_evenement"
                    name="date_evenement"
                    type="date"
                    className="pl-10 bg-beige/30 border-soft-green/20 focus:border-soft-green"
                    value={formData.date_evenement}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lieu" className="text-light-brown">
                  Type de lieu <span className="text-red-500">*</span>
                </Label>
                <select
                  id="lieu"
                  name="lieu"
                  className="w-full p-2 rounded-md bg-beige/30 border-soft-green/20 focus:border-soft-green"
                  value={formData.lieu}
                  onChange={handleChange}
                  required
                >
                  <option value="">Sélectionnez un type</option>
                  <option value="intérieur">Intérieur</option>
                  <option value="extérieur">Extérieur</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adresse" className="text-light-brown">
                  Adresse complète <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-light-brown/60" />
                  <Input
                    id="adresse"
                    name="adresse"
                    placeholder="Adresse de l'événement"
                    className="pl-10 bg-beige/30 border-soft-green/20 focus:border-soft-green"
                    value={formData.adresse}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="details" className="text-light-brown">
                  Détails supplémentaires
                </Label>
                <Textarea
                  id="details"
                  name="details"
                  placeholder="Précisions sur l'espace, contraintes particulières..."
                  className="bg-beige/30 border-soft-green/20 focus:border-soft-green min-h-[80px]"
                  value={formData.details}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message_client" className="text-light-brown">
                  Message <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="message_client"
                  name="message_client"
                  placeholder="Vos attentes, préférences, questions..."
                  className="bg-beige/30 border-soft-green/20 focus:border-soft-green min-h-[80px]"
                  value={formData.message_client}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  className="bg-soft-green hover:bg-soft-green/90 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Traitement en cours...
                    </>
                  ) : (
                    "Confirmer la réservation"
                  )}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

