"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, CheckCircle, XCircle, ChevronDown, ChevronUp, MapPin } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

// Sample reservations data
const reservations = [
  {
    id: "RES-2023-001",
    date: "15/03/2023",
    status: "confirmed",
    service: "Décoration de Mariage",
    eventDate: "10/06/2023",
    eventLocation: "Château des Fleurs, 75016 Paris",
    price: "1 200,00 €",
    image: "/placeholder.svg?height=100&width=100",
    description: "Décoration complète pour un mariage de 80 personnes, incluant la cérémonie et la réception.",
    contactPerson: "Marie Dupont",
    contactPhone: "06 12 34 56 78",
  },
  {
    id: "RES-2023-002",
    date: "02/04/2023",
    status: "pending",
    service: "Événements d'Entreprise",
    eventDate: "15/05/2023",
    eventLocation: "Espace Business, 75008 Paris",
    price: "En attente de devis",
    image: "/placeholder.svg?height=100&width=100",
    description: "Décoration florale pour un séminaire d'entreprise de 50 personnes.",
    contactPerson: "Jean Martin",
    contactPhone: "06 98 76 54 32",
  },
  {
    id: "RES-2023-003",
    date: "10/04/2023",
    status: "cancelled",
    service: "Ateliers Floraux",
    eventDate: "20/04/2023",
    eventLocation: "Boutique ChezFlora, 75001 Paris",
    price: "375,00 €",
    image: "/placeholder.svg?height=100&width=100",
    description: "Atelier floral pour 5 personnes, création de couronnes de fleurs.",
    contactPerson: "Sophie Petit",
    contactPhone: "06 11 22 33 44",
  },
]

export default function ReservationsPage() {
  const [expandedReservations, setExpandedReservations] = useState<string[]>([])

  const toggleReservationDetails = (reservationId: string) => {
    setExpandedReservations((prev) =>
      prev.includes(reservationId) ? prev.filter((id) => id !== reservationId) : [...prev, reservationId],
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-amber-500">En attente</Badge>
      case "confirmed":
        return <Badge className="bg-soft-green">Confirmée</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">Annulée</Badge>
      default:
        return <Badge className="bg-gray-500">En traitement</Badge>
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-off-white">
      <Header />

      <main className="flex-1 py-8 px-4 md:px-8 lg:px-16 bg-off-white bg-[url('/floral-pattern-light.svg')] bg-opacity-5">
        <div className="container mx-auto">
          <h1 className="font-script text-4xl text-center text-light-brown mb-2">Vos réservations</h1>
          <p className="text-center text-light-brown/80 mb-8 max-w-2xl mx-auto">
            Consultez et gérez vos réservations de services floraux
          </p>

          <Tabs defaultValue="all" className="mb-8">
            <TabsList className="bg-beige/30 border-b border-soft-green/10 w-full justify-start">
              <TabsTrigger value="all" className="text-light-brown">
                Toutes les réservations
              </TabsTrigger>
              <TabsTrigger value="pending" className="text-light-brown">
                En attente
              </TabsTrigger>
              <TabsTrigger value="confirmed" className="text-light-brown">
                Confirmées
              </TabsTrigger>
              <TabsTrigger value="cancelled" className="text-light-brown">
                Annulées
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              {reservations.length === 0 ? (
                <div className="text-center py-12">
                  <div className="flex justify-center mb-4">
                    <Calendar className="h-16 w-16 text-light-brown/30" />
                  </div>
                  <h2 className="text-xl font-semibold text-light-brown mb-2">Aucune réservation</h2>
                  <p className="text-light-brown/70 mb-6">Vous n'avez pas encore réservé de service</p>
                  <Button
                    className="bg-soft-green hover:bg-soft-green/90 text-white"
                    onClick={() => (window.location.href = "/services")}
                  >
                    Découvrir nos services
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {reservations.map((reservation) => (
                    <Card key={reservation.id} className="border-none shadow-md overflow-hidden">
                      <div
                        className="p-4 bg-white cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        onClick={() => toggleReservationDetails(reservation.id)}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="flex items-center gap-2">
                            {reservation.status === "pending" && <Clock className="h-5 w-5 text-amber-500" />}
                            {reservation.status === "confirmed" && <CheckCircle className="h-5 w-5 text-soft-green" />}
                            {reservation.status === "cancelled" && <XCircle className="h-5 w-5 text-red-500" />}
                            <span className="font-medium text-light-brown">{reservation.service}</span>
                          </div>
                          <div className="text-sm text-light-brown/70">Réservé le {reservation.date}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          {getStatusBadge(reservation.status)}
                          <div className="font-medium text-light-brown">{reservation.price}</div>
                          {expandedReservations.includes(reservation.id) ? (
                            <ChevronUp className="h-5 w-5 text-light-brown" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-light-brown" />
                          )}
                        </div>
                      </div>

                      {expandedReservations.includes(reservation.id) && (
                        <CardContent className="p-4 border-t border-soft-green/10 bg-beige/10">
                          <div className="space-y-6">
                            <div className="flex flex-col md:flex-row gap-6">
                              <div className="relative h-32 w-32 rounded-md overflow-hidden flex-shrink-0">
                                <Image
                                  src={reservation.image || "/placeholder.svg"}
                                  alt={reservation.service}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-medium text-lg text-light-brown mb-2">{reservation.service}</h3>
                                <p className="text-light-brown/80 mb-4">{reservation.description}</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="flex items-start space-x-2">
                                    <Calendar className="h-5 w-5 mt-0.5 text-soft-green flex-shrink-0" />
                                    <div>
                                      <p className="text-sm font-medium text-light-brown">Date de l'événement</p>
                                      <p className="text-sm text-light-brown/80">{reservation.eventDate}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-start space-x-2">
                                    <MapPin className="h-5 w-5 mt-0.5 text-soft-green flex-shrink-0" />
                                    <div>
                                      <p className="text-sm font-medium text-light-brown">Lieu</p>
                                      <p className="text-sm text-light-brown/80">{reservation.eventLocation}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h3 className="font-medium text-light-brown mb-2">Informations de contact</h3>
                                <p className="text-sm text-light-brown/80">Contact: {reservation.contactPerson}</p>
                                <p className="text-sm text-light-brown/80">Téléphone: {reservation.contactPhone}</p>
                                <p className="text-sm text-light-brown/80">Référence: {reservation.id}</p>
                              </div>

                              <div className="flex flex-col justify-end items-start md:items-end gap-2">
                                {reservation.status === "pending" && (
                                  <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500/10">
                                    Annuler la réservation
                                  </Button>
                                )}
                                {reservation.status === "confirmed" && (
                                  <Button
                                    variant="outline"
                                    className="border-amber-500 text-amber-500 hover:bg-amber-500/10"
                                  >
                                    Demander une modification
                                  </Button>
                                )}
                                <Button
                                  variant="outline"
                                  className="border-soft-green text-soft-green hover:bg-soft-green/10"
                                >
                                  Contacter le service client
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="pending" className="mt-6">
              <div className="space-y-4">
                {reservations
                  .filter((reservation) => reservation.status === "pending")
                  .map((reservation) => (
                    <Card key={reservation.id} className="border-none shadow-md overflow-hidden">
                      {/* Same card content as above, filtered for pending reservations */}
                      <div
                        className="p-4 bg-white cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        onClick={() => toggleReservationDetails(reservation.id)}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-amber-500" />
                            <span className="font-medium text-light-brown">{reservation.service}</span>
                          </div>
                          <div className="text-sm text-light-brown/70">Réservé le {reservation.date}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          {getStatusBadge(reservation.status)}
                          <div className="font-medium text-light-brown">{reservation.price}</div>
                          {expandedReservations.includes(reservation.id) ? (
                            <ChevronUp className="h-5 w-5 text-light-brown" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-light-brown" />
                          )}
                        </div>
                      </div>

                      {expandedReservations.includes(reservation.id) && (
                        <CardContent className="p-4 border-t border-soft-green/10 bg-beige/10">
                          {/* Same expanded content as above */}
                          <div className="space-y-6">
                            <div className="flex flex-col md:flex-row gap-6">
                              <div className="relative h-32 w-32 rounded-md overflow-hidden flex-shrink-0">
                                <Image
                                  src={reservation.image || "/placeholder.svg"}
                                  alt={reservation.service}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-medium text-lg text-light-brown mb-2">{reservation.service}</h3>
                                <p className="text-light-brown/80 mb-4">{reservation.description}</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="flex items-start space-x-2">
                                    <Calendar className="h-5 w-5 mt-0.5 text-soft-green flex-shrink-0" />
                                    <div>
                                      <p className="text-sm font-medium text-light-brown">Date de l'événement</p>
                                      <p className="text-sm text-light-brown/80">{reservation.eventDate}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-start space-x-2">
                                    <MapPin className="h-5 w-5 mt-0.5 text-soft-green flex-shrink-0" />
                                    <div>
                                      <p className="text-sm font-medium text-light-brown">Lieu</p>
                                      <p className="text-sm text-light-brown/80">{reservation.eventLocation}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h3 className="font-medium text-light-brown mb-2">Informations de contact</h3>
                                <p className="text-sm text-light-brown/80">Contact: {reservation.contactPerson}</p>
                                <p className="text-sm text-light-brown/80">Téléphone: {reservation.contactPhone}</p>
                                <p className="text-sm text-light-brown/80">Référence: {reservation.id}</p>
                              </div>

                              <div className="flex flex-col justify-end items-start md:items-end gap-2">
                                <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500/10">
                                  Annuler la réservation
                                </Button>
                                <Button
                                  variant="outline"
                                  className="border-soft-green text-soft-green hover:bg-soft-green/10"
                                >
                                  Contacter le service client
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}

                {reservations.filter((reservation) => reservation.status === "pending").length === 0 && (
                  <div className="text-center py-12">
                    <div className="flex justify-center mb-4">
                      <Clock className="h-16 w-16 text-light-brown/30" />
                    </div>
                    <h2 className="text-xl font-semibold text-light-brown mb-2">Aucune réservation en attente</h2>
                    <p className="text-light-brown/70 mb-6">
                      Vous n'avez pas de réservation en attente de confirmation
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="confirmed" className="mt-6">
              {/* Similar content for confirmed reservations */}
              <div className="space-y-4">
                {reservations
                  .filter((reservation) => reservation.status === "confirmed")
                  .map((reservation) => (
                    <Card key={reservation.id} className="border-none shadow-md overflow-hidden">
                      {/* Card content for confirmed reservations */}
                      <div
                        className="p-4 bg-white cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        onClick={() => toggleReservationDetails(reservation.id)}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-soft-green" />
                            <span className="font-medium text-light-brown">{reservation.service}</span>
                          </div>
                          <div className="text-sm text-light-brown/70">Réservé le {reservation.date}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          {getStatusBadge(reservation.status)}
                          <div className="font-medium text-light-brown">{reservation.price}</div>
                          {expandedReservations.includes(reservation.id) ? (
                            <ChevronUp className="h-5 w-5 text-light-brown" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-light-brown" />
                          )}
                        </div>
                      </div>

                      {expandedReservations.includes(reservation.id) && (
                        <CardContent className="p-4 border-t border-soft-green/10 bg-beige/10">
                          {/* Expanded content for confirmed reservations */}
                          <div className="space-y-6">
                            <div className="flex flex-col md:flex-row gap-6">
                              <div className="relative h-32 w-32 rounded-md overflow-hidden flex-shrink-0">
                                <Image
                                  src={reservation.image || "/placeholder.svg"}
                                  alt={reservation.service}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-medium text-lg text-light-brown mb-2">{reservation.service}</h3>
                                <p className="text-light-brown/80 mb-4">{reservation.description}</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="flex items-start space-x-2">
                                    <Calendar className="h-5 w-5 mt-0.5 text-soft-green flex-shrink-0" />
                                    <div>
                                      <p className="text-sm font-medium text-light-brown">Date de l'événement</p>
                                      <p className="text-sm text-light-brown/80">{reservation.eventDate}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-start space-x-2">
                                    <MapPin className="h-5 w-5 mt-0.5 text-soft-green flex-shrink-0" />
                                    <div>
                                      <p className="text-sm font-medium text-light-brown">Lieu</p>
                                      <p className="text-sm text-light-brown/80">{reservation.eventLocation}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h3 className="font-medium text-light-brown mb-2">Informations de contact</h3>
                                <p className="text-sm text-light-brown/80">Contact: {reservation.contactPerson}</p>
                                <p className="text-sm text-light-brown/80">Téléphone: {reservation.contactPhone}</p>
                                <p className="text-sm text-light-brown/80">Référence: {reservation.id}</p>
                              </div>

                              <div className="flex flex-col justify-end items-start md:items-end gap-2">
                                <Button
                                  variant="outline"
                                  className="border-amber-500 text-amber-500 hover:bg-amber-500/10"
                                >
                                  Demander une modification
                                </Button>
                                <Button
                                  variant="outline"
                                  className="border-soft-green text-soft-green hover:bg-soft-green/10"
                                >
                                  Contacter le service client
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}

                {reservations.filter((reservation) => reservation.status === "confirmed").length === 0 && (
                  <div className="text-center py-12">
                    <div className="flex justify-center mb-4">
                      <CheckCircle className="h-16 w-16 text-light-brown/30" />
                    </div>
                    <h2 className="text-xl font-semibold text-light-brown mb-2">Aucune réservation confirmée</h2>
                    <p className="text-light-brown/70 mb-6">Vous n'avez pas encore de réservation confirmée</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="cancelled" className="mt-6">
              {/* Similar content for cancelled reservations */}
              <div className="space-y-4">
                {reservations
                  .filter((reservation) => reservation.status === "cancelled")
                  .map((reservation) => (
                    <Card key={reservation.id} className="border-none shadow-md overflow-hidden">
                      {/* Card content for cancelled reservations */}
                      <div
                        className="p-4 bg-white cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        onClick={() => toggleReservationDetails(reservation.id)}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="flex items-center gap-2">
                            <XCircle className="h-5 w-5 text-red-500" />
                            <span className="font-medium text-light-brown">{reservation.service}</span>
                          </div>
                          <div className="text-sm text-light-brown/70">Réservé le {reservation.date}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          {getStatusBadge(reservation.status)}
                          <div className="font-medium text-light-brown">{reservation.price}</div>
                          {expandedReservations.includes(reservation.id) ? (
                            <ChevronUp className="h-5 w-5 text-light-brown" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-light-brown" />
                          )}
                        </div>
                      </div>

                      {expandedReservations.includes(reservation.id) && (
                        <CardContent className="p-4 border-t border-soft-green/10 bg-beige/10">
                          {/* Expanded content for cancelled reservations */}
                          <div className="space-y-6">
                            <div className="flex flex-col md:flex-row gap-6">
                              <div className="relative h-32 w-32 rounded-md overflow-hidden flex-shrink-0">
                                <Image
                                  src={reservation.image || "/placeholder.svg"}
                                  alt={reservation.service}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-medium text-lg text-light-brown mb-2">{reservation.service}</h3>
                                <p className="text-light-brown/80 mb-4">{reservation.description}</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="flex items-start space-x-2">
                                    <Calendar className="h-5 w-5 mt-0.5 text-soft-green flex-shrink-0" />
                                    <div>
                                      <p className="text-sm font-medium text-light-brown">Date de l'événement</p>
                                      <p className="text-sm text-light-brown/80">{reservation.eventDate}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-start space-x-2">
                                    <MapPin className="h-5 w-5 mt-0.5 text-soft-green flex-shrink-0" />
                                    <div>
                                      <p className="text-sm font-medium text-light-brown">Lieu</p>
                                      <p className="text-sm text-light-brown/80">{reservation.eventLocation}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h3 className="font-medium text-light-brown mb-2">Informations</h3>
                                <p className="text-sm text-light-brown/80">Contact: {reservation.contactPerson}</p>
                                <p className="text-sm text-light-brown/80">Référence: {reservation.id}</p>
                                <p className="text-sm text-light-brown/80">Statut: Annulée</p>
                              </div>

                              <div className="flex flex-col justify-end items-start md:items-end gap-2">
                                <Button
                                  variant="outline"
                                  className="border-soft-green text-soft-green hover:bg-soft-green/10"
                                >
                                  Réserver à nouveau
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}

                {reservations.filter((reservation) => reservation.status === "cancelled").length === 0 && (
                  <div className="text-center py-12">
                    <div className="flex justify-center mb-4">
                      <XCircle className="h-16 w-16 text-light-brown/30" />
                    </div>
                    <h2 className="text-xl font-semibold text-light-brown mb-2">Aucune réservation annulée</h2>
                    <p className="text-light-brown/70 mb-6">Vous n'avez pas de réservation annulée</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}

