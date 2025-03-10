"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, User, Phone, Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react"
import { registerUser } from "@/services/api";

export default function RegisterPage() {
  
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  })

  // Form validation states
  const [validation, setValidation] = useState({
    email: true,
    phone: true,
    password: true,
  })

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const validatePhone = (phone: string) => {
    const re = /^[0-9]{9}$/
    return re.test(phone)
  }

  const validatePassword = (password: string) => {
    return password.length >= 4
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Real-time validation
    if (name === "email") {
      setValidation((prev) => ({ ...prev, email: validateEmail(value) || value === "" }))
    } else if (name === "phone") {
      setValidation((prev) => ({ ...prev, phone: validatePhone(value) || value === "" }))
    } else if (name === "password") {
      setValidation((prev) => ({ ...prev, password: validatePassword(value) || value === "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    // Final validation before submission
    const isEmailValid = validateEmail(formData.email)
    const isPhoneValid = validatePhone(formData.phone)
    const isPasswordValid = validatePassword(formData.password)

    setValidation({
      email: isEmailValid,
      phone: isPhoneValid,
      password: isPasswordValid,
    })

    if (!isEmailValid || !isPhoneValid || !isPasswordValid) {
      setError("Veuillez corriger les erreurs dans le formulaire.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      await registerUser(formData);

      const expirationTime = Date.now() + 10 * 60 * 1000; // 10 minutes
      localStorage.setItem("email", formData.email);
      localStorage.setItem("emailExpiration", expirationTime.toString());

      setSuccess(true);
      setFormData({ first_name: "", last_name: "", email: "", phone: "", password: "", confirmPassword: "" });
      setTimeout(() => {
        router.push("/verify-otp");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue. Veuillez réessayer.");
      setFormData((prev) => ({ ...prev, email: "", phone: "" }));
    } finally {
      setIsLoading(false);
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
              <h2 className="font-script text-2xl text-light-brown mb-4">Inscription réussie !</h2>
              <p className="text-light-brown/80 mb-6">
                Un code OTP a été envoyé à votre email. Vous allez être redirigé vers la page de vérification.
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
            <div className="bg-white rounded-lg shadow-md p-8">
              <h1 className="font-script text-3xl text-center text-light-brown mb-2">Créer un compte</h1>
              <p className="text-center text-light-brown/80 mb-6">Pour une expérience florale unique</p>

              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name" className="text-light-brown">
                      Prénom
                    </Label>
                  <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-light-brown/60" />
                      <Input
                        id="first_name"
                        name="first_name"
                        placeholder="Votre prénom"
                        className="pl-10 bg-beige/30 border-soft-green/20 focus:border-soft-green"
                        value={formData.first_name} 
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="last_name" className="text-light-brown">
                      Nom
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-light-brown/60" />
                      <Input
                        id="last_name"
                        name="last_name"
                        placeholder="Votre nom"
                        className="pl-10 bg-beige/30 border-soft-green/20 focus:border-soft-green"
                        value={formData.last_name}
                        onChange={handleChange} 
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-light-brown">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-light-brown/60" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="votre@email.com"
                      className={`pl-10 bg-beige/30 border-soft-green/20 focus:border-soft-green ${
                        !validation.email ? "border-red-500" : ""
                      }`}
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  {!validation.email && (
                    <p className="text-red-500 text-xs mt-1">Veuillez entrer une adresse email valide</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-light-brown">
                    Téléphone
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-light-brown/60" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="612345678"
                      className={`pl-10 bg-beige/30 border-soft-green/20 focus:border-soft-green ${
                        !validation.phone ? "border-red-500" : ""
                      }`}
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  {!validation.phone && (
                    <p className="text-red-500 text-xs mt-1">
                      Veuillez entrer un numéro de téléphone valide (9 chiffres)
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-light-brown">
                    Mot de passe
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-light-brown/60" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      type={showPassword ? "text" : "password"}
                      className={`pl-10 bg-beige/30 border-soft-green/20 focus:border-soft-green ${
                        !validation.password ? "border-red-500" : ""
                      }`}
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                      {showPassword ? <EyeOff className="h-5 w-5 text-light-brown" /> : <Eye className="h-5 w-5 text-light-brown" />}
                    </button>
                  </div>
                  {!validation.password && (
                    <p className="text-red-500 text-xs mt-1">Le mot de passe doit contenir au moins 4 caractères</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-light-brown">Confirmer le mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-light-brown/60" />
                    <Input 
                    id="confirmPassword" 
                    name="confirmPassword" 
                    className={`pl-10 bg-beige/30 border-soft-green/20 focus:border-soft-green ${
                      !validation.password ? "border-red-500" : ""
                    }`}
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                      {showPassword ? <EyeOff className="h-5 w-5 text-light-brown" /> : <Eye className="h-5 w-5 text-light-brown" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-soft-green hover:bg-soft-green/90 text-white mt-6"
                  disabled={isLoading}
                >
                  {isLoading ? "Inscription en cours..." : "S'inscrire"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-light-brown">
                  Vous avez déjà un compte ?{" "}
                  <Link href="/login" className="text-soft-green hover:underline">
                    Connectez-vous
                  </Link>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="py-4 text-center text-light-brown/70 text-sm">
        <p>&copy; {new Date().getFullYear()} ChezFlora. Tous droits réservés.</p>
      </footer>
    </div>
  )
}

