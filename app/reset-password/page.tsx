"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock, AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react"
import { resetPassword } from "@/services/api";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export default function ResetPasswordPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })

  const [resetToken, setResetToken] = useLocalStorage<string | null>("resetToken", null);



  const [isClient, setIsClient] = useState(false);

    useEffect(() => {
      if (!resetToken) {
        setError("Token invalide ou expiré. Veuillez recommencer.");
      }
    }, [resetToken]);

    useEffect(() => {
      if (isClient) {
        const token = localStorage.getItem("resetToken");
        if (token) {
          setResetToken(token);
        } else {
          setError("Token invalide ou expiré. Veuillez recommencer.");
        }
      }
    }, [isClient]);

  

  // Form validation states
  const [validation, setValidation] = useState({
    password: true,
    confirmPassword: true,
    passwordMatch: true,
  })

  const validatePassword = (password: string) => {
    return password.length >= 4
  }

  const validatePasswordMatch = (password: string, confirmPassword: string) => {
    return password === confirmPassword
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Real-time validation
    if (name === "password") {
      const isValid = validatePassword(value)
      setValidation((prev) => ({
        ...prev,
        password: isValid || value === "",
        passwordMatch: validatePasswordMatch(value, formData.confirmPassword) || formData.confirmPassword === "",
      }))
    } else if (name === "confirmPassword") {
      setValidation((prev) => ({
        ...prev,
        confirmPassword: true,
        passwordMatch: validatePasswordMatch(formData.password, value) || value === "",
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!resetToken) {
      setError("Token invalide ou expiré.");
      return;
    }
  
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
  
    setIsLoading(true);
    setError(null);
  
    try {
      await resetPassword(resetToken, formData.password);
      setResetToken(null); // ✅ Supprime le token après la réinitialisation
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };
  
  
  console.log("LocalStorage Data:", localStorage);

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
              <h2 className="font-script text-2xl text-light-brown mb-4">Mot de passe modifié !</h2>
              <p className="text-light-brown/80 mb-6">
                Votre mot de passe a été réinitialisé avec succès. Vous allez être redirigé vers la page de connexion.
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
              <h1 className="font-script text-3xl text-center text-light-brown mb-2">Réinitialiser le mot de passe</h1>
              <p className="text-center text-light-brown/80 mb-6">Veuillez choisir un nouveau mot de passe</p>

              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-light-brown">
                    Nouveau mot de passe
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-light-brown/60" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className={`pl-10 pr-10 bg-beige/30 border-soft-green/20 focus:border-soft-green ${
                        !validation.password ? "border-red-500" : ""
                      }`}
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-light-brown/60"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {!validation.password && (
                    <p className="text-red-500 text-xs mt-1">Le mot de passe doit contenir au moins 4 caractères</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-light-brown">
                    Confirmer le mot de passe
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-light-brown/60" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className={`pl-10 pr-10 bg-beige/30 border-soft-green/20 focus:border-soft-green ${
                        !validation.passwordMatch ? "border-red-500" : ""
                      }`}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-light-brown/60"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {!validation.passwordMatch && (
                    <p className="text-red-500 text-xs mt-1">Les mots de passe ne correspondent pas</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-soft-green hover:bg-soft-green/90 text-white mt-6"
                  disabled={isLoading}
                >
                  {isLoading ? "Modification en cours..." : "Changer le mot de passe"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-light-brown">
                  <Link href="/login" className="text-soft-green hover:underline">
                    Retour à la connexion
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

