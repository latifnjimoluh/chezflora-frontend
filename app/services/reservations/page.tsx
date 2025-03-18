"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Calendar, CheckCircle, Clock, MapPin, Users } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import API, { type DiscussionReservation, annulerReservation, type Reservation } from "@/services/apis"

export default function MesReservationsPage() {
  const router = useRouter()

  const [discussions, setDiscussions] = useState<DiscussionReservation[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (!API.auth.isAuthenticated()) {
      router.push("/login?redirect=/reservations");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");
        if (!token) {
          setError("Utilisateur non authentifié.");
          return;
        }

        // ✅ On envoie le token au backend, qui récupère `client_id`
        const [discussionsData, reservationsData] = await Promise.all([
          API.reservations.getUserDiscussions(token),
          API.reservations.getUserReservations(token),
        ]);

        setDiscussions(discussionsData);
        setReservations(reservationsData);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Erreur lors du chargement des données");
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);


  const handleFinalizeReservation = async (id: number, action: "valider" | "annuler") => {
    try {
      setLoading(true)

      await API.reservations.finalizeReservation({
        reservation_id: id,
        action,
      });
      

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Utilisateur non authentifié.");
        return;
      }

      const [discussionsData, reservationsData] = await Promise.all([
        API.reservations.getUserDiscussions(token),
        API.reservations.getUserReservations(token),
      ]);


      setDiscussions(discussionsData)
      setReservations(reservationsData)

      setSuccess(`Réservation ${action === "valider" ? "validée" : "annulée"} avec succès!`)
      setLoading(false)

      // Effacer le message de succès après 3 secondes
      setTimeout(() => {
        setSuccess(null)
      }, 3000)
    } catch (err: any) {
      setError(
        err.message || `Erreur lors de la ${action === "valider" ? "validation" : "annulation"} de la réservation`,
      )
      setLoading(false)

      // Effacer le message d'erreur après 3 secondes
      setTimeout(() => {
        setError(null)
      }, 3000)
    }
  }

  const handleCancelReservation = async (id: number) => {
    try {
      setLoading(true);
      await API.reservations.annulerReservation(id);
  
      // Mettre à jour la liste après annulation
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Utilisateur non authentifié.");
        return;
      }

      const reservationsData = await API.reservations.getUserReservations(token);

      setReservations(reservationsData);
  
      setSuccess("Réservation annulée avec succès !");
      setLoading(false);
  
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'annulation.");
      setLoading(false);
  
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };
  

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "réponse_client":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            En attente de réponse admin
          </Badge>
        )
      case "réponse_admin":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Réponse admin reçue
          </Badge>
        )
      case "finalisé":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Finalisé
          </Badge>
        )
      case "réservé":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Réservé
          </Badge>
        )
      case "annulé":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Annulé
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <p className="text-lg">Chargement...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Mes réservations</h1>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6 bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Succès</AlertTitle>
              <AlertDescription className="text-green-700">{success}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="reservations">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="reservations">Réservations</TabsTrigger>
              <TabsTrigger value="discussions">Discussions</TabsTrigger>
            </TabsList>

            <TabsContent value="reservations">
              {reservations.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Vous n'avez pas encore de réservations.</p>
                  <Button className="mt-4" onClick={() => router.push("/services")}>
                    Découvrir nos services
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {reservations.map((reservation) => (
                    <Card key={reservation.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                          <CardTitle>{reservation.service_nom ?? "Service inconnu"}</CardTitle>
                          <CardDescription>
                            Catégorie : {reservation.service_categorie ?? "Non spécifiée"}
                          </CardDescription>
                          </div>
                          {getStatusBadge(reservation.statut)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">Prix: {reservation.prix} €</span>
                          </div>
                          {reservation.service_dimension && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">Dimension: {reservation.service_dimension} m²</span>
                            </div>
                          )}
                          {reservation.service_nb_personnes && (
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">Personnes: {reservation.service_nb_personnes}</span>
                            </div>
                          )}
                          {reservation.service_lieu && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">Lieu: {reservation.service_lieu}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      {reservation.statut === "réservé" && (
                        <CardFooter>
                          <Button
                            variant="destructive"
                            onClick={() => handleCancelReservation(reservation.id)}
                            disabled={loading}
                          >
                            Annuler la réservation
                          </Button>
                        </CardFooter>
                      )}
                      </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="discussions">
              {discussions.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Vous n'avez pas encore de discussions de réservation.</p>
                  <Button className="mt-4" onClick={() => router.push("/services")}>
                    Découvrir nos services
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {discussions.map((discussion) => (
                    <Card key={discussion.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{discussion.service_nom}</CardTitle>
                            <CardDescription>
                              Discussion #{discussion.id} -{" "}
                              {new Date(discussion.date_creation).toLocaleDateString("fr-FR")}
                            </CardDescription>
                          </div>
                          {getStatusBadge(discussion.statut)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          {discussion.service_dimension && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">Dimension: {discussion.service_dimension} m²</span>
                            </div>
                          )}
                          {discussion.service_nb_personnes && (
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">Personnes: {discussion.service_nb_personnes}</span>
                            </div>
                          )}
                          {discussion.service_lieu && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">Lieu: {discussion.service_lieu}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">Prix proposé: {discussion.prix_propose} €</span>
                          </div>
                        </div>

                        {discussion.reponse_admin !== undefined && (
                          <div className="mt-4 p-4 bg-blue-50 rounded-md">
                            <h4 className="font-medium text-blue-800 mb-2">Réponse de l'administrateur:</h4>
                            <p className="text-blue-700">{discussion.reponse_admin ?? "Non spécifiée"} €</p>
                          </div>
                        )}
                      </CardContent>
                      {discussion.statut === "réponse_admin" && (
                        <CardFooter className="flex justify-between">
                          <Button
                            variant="destructive"
                            onClick={() => handleFinalizeReservation(discussion.id, "annuler")}
                            disabled={loading}
                          >
                            Refuser
                          </Button>
                          <Button
                            variant="default"
                            onClick={() => handleFinalizeReservation(discussion.id, "valider")}
                            disabled={loading}
                          >
                            Accepter
                          </Button>
                        </CardFooter>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}

