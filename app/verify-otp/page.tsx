"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { verifyOTP, resendOTP } from "@/services/api"

export default function VerifyOTPPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [email, setEmail] = useState("")
  const inputRefs = useRef<(HTMLInputElement | null)[]>([null, null, null, null, null, null])
  const [isClient, setIsClient] = useState(false)

  // Effet pour marquer quand le composant est monté côté client
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Récupérer l'email depuis localStorage côté client
  useEffect(() => {
    if (isClient && typeof window !== "undefined") {
      const storedEmail = localStorage.getItem("email")
      if (storedEmail) {
        setEmail(storedEmail)
      } else {
        setError("Aucune adresse e-mail trouvée. Veuillez vous reconnecter.")
      }
    }
  }, [isClient])

  const handleChange = (index: number, value: string) => {
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.some((digit) => !digit)) {
      setError("Veuillez entrer le code complet.")
      return
    }
    setIsLoading(true)
    setError(null)

    try {
      const data = await verifyOTP(email, otp.join(""))

      // Stocker les données dans localStorage côté client
      if (typeof window !== "undefined") {
        localStorage.setItem("token", data.token)
        localStorage.setItem("id", data.id)
        localStorage.setItem("role", data.role)
      }

      setOtp(["", "", "", "", "", ""]) // Réinitialiser le champ OTP après validation
      setSuccess(true)
      setTimeout(() => {
        router.push("/")
      }, 2000)
    } catch (err: any) {
      setError(err.message || "Code OTP incorrect.")
      setOtp(["", "", "", "", "", ""]) // Réinitialiser les champs en cas d'erreur
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setOtp(["", "", "", "", "", ""]) // Réinitialiser le champ OTP après validation
    if (!email) {
      setError("Aucune adresse e-mail trouvée. Veuillez vous reconnecter.")
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      await resendOTP(email)
      alert("Un nouveau code a été envoyé à votre email.")
    } catch (err) {
      setError("Impossible d'envoyer un nouveau code. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-off-white bg-[url('/floral-pattern-light.svg')] bg-opacity-5 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <Link href="/" className="mb-8">
          <Image
            src="/placeholder.svg?height=50&width=150"
            alt="ChezFlora Logo"
            width={150}
            height={50}
            className="h-12 w-auto"
          />
        </Link>

        <div className="w-full max-w-md">
          {success ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center animate-fadeIn">
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="h-16 w-16 text-soft-green" />
              </div>
              <h2 className="font-script text-2xl text-light-brown mb-4">Vérification réussie !</h2>
              <p className="text-light-brown/80 mb-6">Votre compte a été vérifié avec succès.</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8">
              <h1 className="font-script text-3xl text-center text-light-brown mb-2">Vérification</h1>
              <p className="text-center text-light-brown/80 mb-6">
                Veuillez entrer le code à 6 chiffres envoyé à votre email
              </p>
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex justify-center space-x-2">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      className="w-12 h-12 text-center text-xl bg-beige/30 border-soft-green/20 focus:border-soft-green"
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value.replace(/[^0-9]/g, ""))}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      required
                    />
                  ))}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-soft-green hover:bg-soft-green/90 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Vérification..." : "Vérifier"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-light-brown mb-4">Vous n'avez pas reçu de code ?</p>
                <Button
                  variant="outline"
                  className="border-soft-green text-soft-green hover:bg-soft-green/10"
                  onClick={handleResendOTP}
                  disabled={isLoading}
                >
                  Renvoyer le code
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

