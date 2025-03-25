"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Phone, Mail, MapPin, Clock, AlertCircle, CheckCircle2 } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import API from "@/services/apis"

// Type pour les informations de contact
interface ContactInfo {
  address: { value: string; icon: string }
  phone: { value: string; icon: string }
  email: { value: string; icon: string }
  hours: { value: string; icon: string }
}

// Type pour les sujets de contact
interface ContactSubject {
  id: number
  value: string
  label: string
}

// Type pour les FAQ
interface FAQ {
  id: number
  question: string
  answer: string
  category: string
}

// Type pour le formulaire de contact
interface FormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

// Fonction pour obtenir l'icône correspondante
const getIcon = (iconName: string) => {
  const icons: { [key: string]: React.ReactNode } = {
    MapPin: <MapPin className="h-6 w-6 text-soft-green" />,
    Phone: <Phone className="h-6 w-6 text-soft-green" />,
    Mail: <Mail className="h-6 w-6 text-soft-green" />,
    Clock: <Clock className="h-6 w-6 text-soft-green" />,
  }
  return icons[iconName] || <MapPin className="h-6 w-6 text-soft-green" />
}

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null)
  const [subjects, setSubjects] = useState<ContactSubject[]>([])
  const [faqs, setFaqs] = useState<FAQ[]>([])

  // Charger les données au chargement de la page
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer les informations de contact
        try {
          const infoResponse = await API.contact.getContactInfo()
          console.log("Contact info response:", infoResponse) // Add this for debugging

          if (infoResponse) {
            // Transform the API response to match the expected structure
            // The API is returning different keys than what your component expects
            setContactInfo({
              address: {
                value: infoResponse.footer_address || "123 Rue des Fleurs, Yaounde",
                icon: "MapPin",
              },
              phone: {
                value: infoResponse.footer_phone || "+297 672475691",
                icon: "Phone",
              },
              email: {
                value: infoResponse.footer_email || "contact@chezflora.com",
                icon: "Mail",
              },
              hours: {
                value: infoResponse.footer_hours || "Lundi - Vendredi: 9h - 18h\nSamedi: 10h - 16h\nDimanche: Fermé",
                icon: "Clock",
              },
            })
          } else {
            // Fallback data if API returns empty
            setContactInfo({
              address: { value: "123 Rue des Fleurs, 75000 Paris", icon: "MapPin" },
              phone: { value: "+33 1 23 45 67 89", icon: "Phone" },
              email: { value: "contact@chezflora.com", icon: "Mail" },
              hours: { value: "Lundi - Vendredi: 9h - 18h\nSamedi: 10h - 16h\nDimanche: Fermé", icon: "Clock" },
            })
          }
        } catch (err) {
          console.error("Erreur lors de la récupération des informations de contact:", err)
          // Fallback data
          setContactInfo({
            address: { value: "123 Rue des Fleurs, 75000 Paris", icon: "MapPin" },
            phone: { value: "+33 1 23 45 67 89", icon: "Phone" },
            email: { value: "contact@chezflora.com", icon: "Mail" },
            hours: { value: "Lundi - Vendredi: 9h - 18h\nSamedi: 10h - 16h\nDimanche: Fermé", icon: "Clock" },
          })
        }

        // Récupérer les sujets de contact
        try {
          const subjectsResponse = await API.contact.getContactSubjects()
          if (subjectsResponse && subjectsResponse.length > 0) {
            setSubjects(subjectsResponse)
          } else {
            // Fallback data
            setSubjects([
              { id: 1, value: "information", label: "Demande d'information" },
              { id: 2, value: "commande", label: "Question sur une commande" },
              { id: 3, value: "reclamation", label: "Réclamation" },
              { id: 4, value: "autre", label: "Autre" },
            ])
          }
        } catch (err) {
          console.error("Erreur lors de la récupération des sujets de contact:", err)
          // Fallback data
          setSubjects([
            { id: 1, value: "information", label: "Demande d'information" },
            { id: 2, value: "commande", label: "Question sur une commande" },
            { id: 3, value: "reclamation", label: "Réclamation" },
            { id: 4, value: "autre", label: "Autre" },
          ])
        }

        // Récupérer les FAQ
        try {
          const faqsResponse = await API.contact.getFaqs()
          if (faqsResponse && faqsResponse.length > 0) {
            setFaqs(faqsResponse)
          } else {
            // Fallback data
            setFaqs([
              {
                id: 1,
                question: "Comment passer une commande ?",
                answer:
                  "Vous pouvez passer une commande directement sur notre site web ou nous contacter par téléphone.",
                category: "commandes",
              },
              {
                id: 2,
                question: "Quels sont les délais de livraison ?",
                answer: "Nos délais de livraison varient entre 24h et 48h selon votre localisation.",
                category: "livraison",
              },
              {
                id: 3,
                question: "Comment entretenir mes fleurs ?",
                answer:
                  "Changez l'eau régulièrement et coupez les tiges en biseau pour prolonger la durée de vie de vos fleurs.",
                category: "entretien",
              },
            ])
          }
        } catch (err) {
          console.error("Erreur lors de la récupération des FAQ:", err)
          // Fallback data
          setFaqs([
            {
              id: 1,
              question: "Comment passer une commande ?",
              answer: "Vous pouvez passer une commande directement sur notre site web ou nous contacter par téléphone.",
              category: "commandes",
            },
            {
              id: 2,
              question: "Quels sont les délais de livraison ?",
              answer: "Nos délais de livraison varient entre 24h et 48h selon votre localisation.",
              category: "livraison",
            },
            {
              id: 3,
              question: "Comment entretenir mes fleurs ?",
              answer:
                "Changez l'eau régulièrement et coupez les tiges en biseau pour prolonger la durée de vie de vos fleurs.",
              category: "entretien",
            },
          ])
        }
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err)
        setError("Une erreur est survenue lors du chargement des données. Veuillez réessayer.")
      }
    }

    fetchData()
  }, [])

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
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setError("Veuillez remplir tous les champs obligatoires.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Envoyer le message à l'API
      await API.contact.sendContactMessage(formData)

      // Success scenario
      setSuccess(true)
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      })
    } catch (err) {
      setError("Une erreur est survenue lors de l'envoi du message. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  // Fonction pour formater le texte avec des sauts de ligne
  const formatText = (text: string) => {
    return text.split("\n").map((line, index) => <p key={index}>{line}</p>)
  }

  return (
    <div className="flex min-h-screen flex-col bg-off-white">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[300px] w-full overflow-hidden">
          <Image
          src="https://res.cloudinary.com/dtrjwgblw/image/upload/v1742734439/chezflora/produits/zmzm4eqray6j1e71t9py.png"
            
            alt="Contactez ChezFlora"
            width={1920}
            height={300}
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 text-white">
            <h1 className="font-script mb-4 text-center text-4xl md:text-5xl">Contactez-nous</h1>
            <p className="max-w-2xl text-center text-lg">
              Notre équipe est à votre disposition pour répondre à toutes vos questions
            </p>
          </div>
        </section>

        <section className="py-16 px-4 md:px-8 lg:px-16 bg-white bg-[url('/floral-pattern-light.svg')] bg-opacity-5">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <Card className="border-none shadow-md">
                  <CardContent className="p-6">
                    <h2 className="font-script text-2xl text-light-brown mb-6">Envoyez-nous un message</h2>

                    {error && (
                      <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    {success && (
                      <Alert className="mb-6 bg-soft-green/10 border-soft-green/30">
                        <CheckCircle2 className="h-4 w-4 text-soft-green" />
                        <AlertDescription className="text-soft-green">
                          Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.
                        </AlertDescription>
                      </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
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
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-light-brown">
                            Téléphone
                          </Label>
                          <Input
                            id="phone"
                            name="phone"
                            className="bg-beige/30 border-soft-green/20 focus:border-soft-green"
                            value={formData.phone}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="subject" className="text-light-brown">
                            Sujet <span className="text-red-500">*</span>
                          </Label>
                          <Select
                            value={formData.subject}
                            onValueChange={(value) => handleSelectChange("subject", value)}
                            required
                          >
                            <SelectTrigger className="bg-beige/30 border-soft-green/20 focus:border-soft-green">
                              <SelectValue placeholder="Sélectionnez un sujet" />
                            </SelectTrigger>
                            <SelectContent>
                              {subjects.map((subject) => (
                                <SelectItem key={subject.id} value={subject.value}>
                                  {subject.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-light-brown">
                          Message <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id="message"
                          name="message"
                          className="bg-beige/30 border-soft-green/20 focus:border-soft-green min-h-[150px]"
                          value={formData.message}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-soft-green hover:bg-soft-green/90 text-white"
                        disabled={isLoading}
                      >
                        {isLoading ? "Envoi en cours..." : "Envoyer le message"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="font-script text-2xl text-light-brown mb-6">Nos coordonnées</h2>
                  <div className="space-y-4">
                    {contactInfo && (
                      <>
                        <div className="flex items-start space-x-4">
                          <div className="bg-soft-green/10 p-3 rounded-full">{getIcon(contactInfo.address.icon)}</div>
                          <div>
                            <h3 className="font-medium text-light-brown">Adresse</h3>
                            <div className="text-light-brown/80">{formatText(contactInfo.address.value)}</div>
                          </div>
                        </div>

                        <div className="flex items-start space-x-4">
                          <div className="bg-soft-green/10 p-3 rounded-full">{getIcon(contactInfo.phone.icon)}</div>
                          <div>
                            <h3 className="font-medium text-light-brown">Téléphone</h3>
                            <div className="text-light-brown/80">{formatText(contactInfo.phone.value)}</div>
                          </div>
                        </div>

                        <div className="flex items-start space-x-4">
                          <div className="bg-soft-green/10 p-3 rounded-full">{getIcon(contactInfo.email.icon)}</div>
                          <div>
                            <h3 className="font-medium text-light-brown">Email</h3>
                            <div className="text-light-brown/80">{formatText(contactInfo.email.value)}</div>
                          </div>
                        </div>

                        <div className="flex items-start space-x-4">
                          <div className="bg-soft-green/10 p-3 rounded-full">{getIcon(contactInfo.hours.icon)}</div>
                          <div>
                            <h3 className="font-medium text-light-brown">Horaires d'ouverture</h3>
                            <div className="text-light-brown/80">{formatText(contactInfo.hours.value)}</div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <h2 className="font-script text-2xl text-light-brown mb-6">Nous trouver</h2>
                  <div className="relative h-[300px] w-full rounded-lg overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=300&width=600"
                      alt="Carte ChezFlora"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white p-3 rounded-lg shadow-md">
                        <MapPin className="h-6 w-6 text-soft-green" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 md:px-8 lg:px-16 bg-off-white">
          <div className="container mx-auto">
            <h2 className="font-script text-3xl text-center text-light-brown mb-12">Questions fréquentes</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {faqs.map((faq) => (
                <Card key={faq.id} className="border-none shadow-md">
                  <CardContent className="p-6">
                    <h3 className="font-medium text-lg text-light-brown mb-2">{faq.question}</h3>
                    <p className="text-light-brown/80">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-light-brown/80 mb-4">Vous n'avez pas trouvé la réponse à votre question ?</p>
              <Button className="bg-soft-green hover:bg-soft-green/90 text-white">Contactez-nous</Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

