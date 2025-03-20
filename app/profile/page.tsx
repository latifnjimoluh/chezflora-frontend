"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Phone, Mail, Lock, AlertCircle, CheckCircle2, Camera, X, Eye, EyeOff } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import {
  getUserProfile,
  updateUserProfile,
  requestEmailChange,
  confirmEmailChange,
  updatePassword,
  updateProfileImage,
  requestAccountDeletion,
  confirmAccountDeletion,
} from "@/services/api"
import { useAuth } from "@/hooks/useAuth"

export default function ProfilePage() {
  // Utiliser le hook d'authentification pour protéger la page
  useAuth("/profile")

  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showOtpField, setShowOtpField] = useState(false)
  const [otp, setOtp] = useState("")
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    new_email: "",
  })

  // États pour la modification de l'email
  const [isEditingEmail, setIsEditingEmail] = useState(false)
  const [emailConfirmationSent, setEmailConfirmationSent] = useState(false)

  // États pour la modification du mot de passe
  const [isEditingPassword, setIsEditingPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirm_password: "",
  })
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  // État pour la popup de suppression de compte
  const [showDeletePopup, setShowDeletePopup] = useState(false)
  const [deleteOtp, setDeleteOtp] = useState("")
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)

  // Form validation states
  const [validation, setValidation] = useState({
    phone: true,
    email: true,
    password: true,
  })

  // Charger les données du profil au chargement de la page
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true)
        const profileData = await getUserProfile()
        setFormData({
          first_name: profileData.first_name || "",
          last_name: profileData.last_name || "",
          phone: profileData.phone || "",
          email: profileData.email || "",
          new_email: "",
        })
        setProfileImage(profileData.image || "/placeholder.svg?height=200&width=200")
        setIsLoading(false)
      } catch (err: any) {
        setError(err.message || "Impossible de récupérer les informations utilisateur.")
        setIsLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const validatePhone = (phone: string) => {
    const re = /^[0-9]{10}$/
    return re.test(phone)
  }

  const validatePassword = (password: string) => {
    return password.length >= 8
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Real-time validation
    if (name === "new_email") {
      setValidation((prev) => ({ ...prev, email: validateEmail(value) || value === "" }))
    } else if (name === "phone") {
      setValidation((prev) => ({ ...prev, phone: validatePhone(value) || value === "" }))
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))

    if (name === "newPassword" || name === "confirm_password") {
      setValidation((prev) => ({
        ...prev,
        password: validatePassword(value) || value === "",
      }))
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Afficher un aperçu de l'image
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)

      // Envoyer l'image au serveur
      handleImageUpload(file)
    }
  }

  const handleImageUpload = async (file: File) => {
    try {
      setIsLoading(true)
      const response = await updateProfileImage(file)
      setSuccess("Image de profil mise à jour avec succès.")
      // Si le serveur renvoie l'URL de l'image, on l'utilise
      if (response.imageUrl) {
        setProfileImage(response.imageUrl)
      }
    } catch (err: any) {
      console.error("Erreur lors de la mise à jour de l'image", err)
      setError(err.message || "Impossible de mettre à jour l'image de profil.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditEmail = async () => {
    if (isEditingEmail && formData.new_email) {
      // Vérifier si l'email est valide
      if (!validateEmail(formData.new_email)) {
        setError("Veuillez entrer une adresse email valide")
        return
      }

      try {
        setIsLoading(true)
        await requestEmailChange(formData.new_email)
        setEmailConfirmationSent(true)
        setShowOtpField(true)
        setSuccess("Un code de vérification a été envoyé à votre nouvelle adresse email.")
        setError(null)
      } catch (err: any) {
        console.error("Erreur lors de la demande de changement d'email", err)
        setError(err.message || "Impossible de demander un changement d'email.")
      } finally {
        setIsLoading(false)
      }
    } else {
      setFormData((prev) => ({ ...prev, new_email: prev.email }))
      setIsEditingEmail(true)
      setEmailConfirmationSent(false)
      setShowOtpField(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (!otp) {
      setError("Veuillez entrer le code OTP")
      return
    }

    try {
      setIsLoading(true)
      await confirmEmailChange(otp)
      setFormData((prev) => ({ ...prev, email: prev.new_email }))
      setIsEditingEmail(false)
      setEmailConfirmationSent(false)
      setShowOtpField(false)
      setOtp("")
      setSuccess("Adresse email mise à jour avec succès.")
      setError(null)
    } catch (err: any) {
      console.error("Erreur lors de la confirmation du changement d'email", err)
      setError(err.message || "Code OTP incorrect ou expiré.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSavePassword = async () => {
    // Validation des mots de passe
    if (!passwordData.currentPassword) {
      setError("Veuillez entrer votre mot de passe actuel")
      return
    }

    if (!passwordData.newPassword) {
      setError("Veuillez entrer un nouveau mot de passe")
      return
    }

    if (passwordData.newPassword !== passwordData.confirm_password) {
      setError("Les mots de passe ne correspondent pas")
      return
    }

    if (!validatePassword(passwordData.newPassword)) {
      setError("Le mot de passe doit contenir au moins 8 caractères")
      return
    }

    try {
      setIsLoading(true)
      await updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })
      setIsEditingPassword(false)
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirm_password: "",
      })
      setSuccess("Mot de passe mis à jour avec succès.")
      setError(null)
    } catch (err: any) {
      console.error("Erreur lors de la mise à jour du mot de passe", err)
      setError(err.message || "Impossible de mettre à jour le mot de passe.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      setIsLoading(true)
      await requestAccountDeletion()
      setShowDeletePopup(true)
      setSuccess("Un code de vérification a été envoyé à votre adresse email.")
      setError(null)
    } catch (err: any) {
      console.error("Erreur lors de la demande de suppression du compte", err)
      setError(err.message || "Impossible de demander la suppression du compte.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!deleteOtp) {
      setError("Veuillez entrer le code OTP")
      return
    }

    try {
      setIsDeletingAccount(true)
      await confirmAccountDeletion(deleteOtp)
      setIsDeletingAccount(false)
      setShowDeletePopup(false)
      // Rediriger vers la page d'accueil après la suppression du compte
      router.push("/")
    } catch (err: any) {
      console.error("Erreur lors de la confirmation de la suppression du compte", err)
      setError(err.message || "Code OTP incorrect ou expiré.")
      setIsDeletingAccount(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Final validation before submission
    const isPhoneValid = validatePhone(formData.phone)

    setValidation({
      ...validation,
      phone: isPhoneValid,
    })

    if (!isPhoneValid) {
      setError("Veuillez corriger les erreurs dans le formulaire.")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      await updateUserProfile({
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
      })

      setSuccess("Profil mis à jour avec succès.")

      // Reset success message after a delay
      setTimeout(() => {
        setSuccess(null)
      }, 5000)
    } catch (err: any) {
      console.error("Erreur lors de la mise à jour du profil", err)
      setError(err.message || "Impossible de mettre à jour le profil.")
    } finally {
      setIsLoading(false)
    }
  }

  // Afficher un indicateur de chargement pendant le chargement initial du profil
  if (isLoading && !formData.first_name) {
    return (
      <div className="flex min-h-screen flex-col bg-off-white">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-soft-green mx-auto"></div>
            <p className="mt-4 text-light-brown">Chargement de votre profil...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-off-white">
      <Header />

      <main className="flex-1 py-12 px-4 md:px-8 lg:px-16 bg-off-white bg-[url('/floral-pattern-light.svg')] bg-opacity-5">
        <div className="container mx-auto max-w-3xl">
          <h1 className="font-script text-3xl text-center text-light-brown mb-2">Mettre à jour votre profil</h1>
          <p className="text-center text-light-brown/80 mb-8">
            Modifiez vos informations personnelles et mettez à jour votre email ou votre photo de profil.
          </p>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6 bg-soft-green/10 border-soft-green/30">
              <CheckCircle2 className="h-4 w-4 text-soft-green" />
              <AlertDescription className="text-soft-green">{success}</AlertDescription>
            </Alert>
          )}

          <div className="bg-white rounded-lg shadow-md p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Image */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative mb-4">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-soft-green/20">
                    <Image
                      src={profileImage || "/placeholder.svg?height=200&width=200"}
                      alt="Photo de profil"
                      width={200}
                      height={200}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <button
                    type="button"
                    className="absolute bottom-0 right-0 bg-soft-green text-white p-2 rounded-full shadow-md hover:bg-soft-green/90 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
                <button
                  type="button"
                  className="text-soft-green hover:underline text-sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Changer la photo
                </button>
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name" className="text-light-brown">
                    Prénom
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-light-brown/60" />
                    <Input
                      id="first_name"
                      name="first_name"
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
                      className="pl-10 bg-beige/30 border-soft-green/20 focus:border-soft-green"
                      value={formData.last_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-light-brown">
                  Numéro de téléphone
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-light-brown/60" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
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
                    Veuillez entrer un numéro de téléphone valide (10 chiffres)
                  </p>
                )}
              </div>

              {/* Email Section */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="email" className="text-light-brown">
                    Adresse email
                  </Label>
                  {!isEditingEmail ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-soft-green text-soft-green hover:bg-soft-green/10"
                      onClick={handleEditEmail}
                    >
                      Modifier
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-soft-green text-soft-green hover:bg-soft-green/10"
                      onClick={handleEditEmail}
                      disabled={isLoading}
                    >
                      {isLoading ? "Envoi..." : "Confirmer"}
                    </Button>
                  )}
                </div>

                {!isEditingEmail ? (
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-light-brown/60" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      className="pl-10 bg-beige/30 border-soft-green/20 focus:border-soft-green"
                      value={formData.email}
                      disabled
                    />
                  </div>
                ) : (
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-light-brown/60" />
                    <Input
                      id="new_email"
                      name="new_email"
                      type="email"
                      className={`pl-10 bg-beige/30 border-soft-green/20 focus:border-soft-green ${
                        !validation.email ? "border-red-500" : ""
                      }`}
                      value={formData.new_email}
                      onChange={handleChange}
                      placeholder="Nouvelle adresse email"
                      required
                    />
                  </div>
                )}

                {!validation.email && (
                  <p className="text-red-500 text-xs mt-1">Veuillez entrer une adresse email valide</p>
                )}

                {emailConfirmationSent && (
                  <p className="text-sm text-soft-green mt-1">
                    Un code de vérification a été envoyé à votre nouvelle adresse email.
                  </p>
                )}
              </div>

              {/* OTP Field for Email Verification */}
              {showOtpField && (
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-light-brown">
                    Code de vérification
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="otp"
                      name="otp"
                      placeholder="Entrez le code envoyé à votre nouvel email"
                      className="bg-beige/30 border-soft-green/20 focus:border-soft-green"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                    <Button
                      type="button"
                      className="bg-soft-green hover:bg-soft-green/90 text-white"
                      onClick={handleVerifyOtp}
                      disabled={isLoading}
                    >
                      {isLoading ? "Vérification..." : "Vérifier"}
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-soft-green hover:bg-soft-green/90 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 border-light-brown text-light-brown hover:bg-light-brown/10"
                  onClick={() => router.push("/")}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </div>

          <div className="mt-8 bg-white rounded-lg shadow-md p-8">
            <h2 className="font-script text-2xl text-light-brown mb-4">Sécurité du compte</h2>
            <div className="space-y-4">
              {/* Password Change Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-light-brown">Changer de mot de passe</h3>
                    <p className="text-sm text-light-brown/70">
                      Mettez à jour votre mot de passe pour sécuriser votre compte
                    </p>
                  </div>
                  {!isEditingPassword ? (
                    <Button
                      variant="outline"
                      className="border-soft-green text-soft-green hover:bg-soft-green/10"
                      onClick={() => setIsEditingPassword(true)}
                    >
                      Modifier
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-500/10"
                      onClick={() => setIsEditingPassword(false)}
                    >
                      Annuler
                    </Button>
                  )}
                </div>

                {isEditingPassword && (
                  <div className="space-y-4 p-4 bg-beige/10 rounded-md">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword" className="text-light-brown">
                        Mot de passe actuel
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-light-brown/60" />
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type={showPassword.current ? "text" : "password"}
                          className="pl-10 pr-10 bg-beige/30 border-soft-green/20 focus:border-soft-green"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-light-brown/60"
                          onClick={() => setShowPassword((prev) => ({ ...prev, current: !prev.current }))}
                        >
                          {showPassword.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className="text-light-brown">
                        Nouveau mot de passe
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-light-brown/60" />
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type={showPassword.new ? "text" : "password"}
                          className={`pl-10 pr-10 bg-beige/30 border-soft-green/20 focus:border-soft-green ${
                            !validation.password && passwordData.newPassword ? "border-red-500" : ""
                          }`}
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-light-brown/60"
                          onClick={() => setShowPassword((prev) => ({ ...prev, new: !prev.new }))}
                        >
                          {showPassword.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {!validation.password && passwordData.newPassword && (
                        <p className="text-red-500 text-xs">Le mot de passe doit contenir au moins 8 caractères</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm_password" className="text-light-brown">
                        Confirmer le nouveau mot de passe
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-light-brown/60" />
                        <Input
                          id="confirm_password"
                          name="confirm_password"
                          type={showPassword.confirm ? "text" : "password"}
                          className={`pl-10 pr-10 bg-beige/30 border-soft-green/20 focus:border-soft-green ${
                            passwordData.newPassword !== passwordData.confirm_password && passwordData.confirm_password
                              ? "border-red-500"
                              : ""
                          }`}
                          value={passwordData.confirm_password}
                          onChange={handlePasswordChange}
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-light-brown/60"
                          onClick={() => setShowPassword((prev) => ({ ...prev, confirm: !prev.confirm }))}
                        >
                          {showPassword.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {passwordData.newPassword !== passwordData.confirm_password && passwordData.confirm_password && (
                        <p className="text-red-500 text-xs">Les mots de passe ne correspondent pas</p>
                      )}
                    </div>

                    <Button
                      type="button"
                      className="w-full bg-soft-green hover:bg-soft-green/90 text-white mt-2"
                      onClick={handleSavePassword}
                      disabled={isLoading}
                    >
                      {isLoading ? "Enregistrement..." : "Enregistrer le nouveau mot de passe"}
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-light-brown">Préférences de notification</h3>
                  <p className="text-sm text-light-brown/70">Gérez vos préférences d'emails et de notifications</p>
                </div>
                <Button variant="outline" className="border-soft-green text-soft-green hover:bg-soft-green/10">
                  Configurer
                </Button>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-light-brown">Supprimer le compte</h3>
                  <p className="text-sm text-light-brown/70">
                    Supprimez définitivement votre compte et toutes vos données
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-500/10"
                  onClick={handleDeleteAccount}
                >
                  Supprimer
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Delete Account Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium text-light-brown">Supprimer votre compte</h3>
              <button onClick={() => setShowDeletePopup(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-light-brown/80 mb-4">
              Cette action est irréversible. Toutes vos données seront définitivement supprimées.
            </p>

            <p className="text-light-brown/80 mb-4">
              Un code de vérification a été envoyé à votre adresse email. Veuillez le saisir ci-dessous pour confirmer
              la suppression.
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="delete_otp" className="text-light-brown">
                  Code de vérification
                </Label>
                <Input
                  id="delete_otp"
                  value={deleteOtp}
                  onChange={(e) => setDeleteOtp(e.target.value)}
                  className="bg-beige/30 border-soft-green/20 focus:border-soft-green"
                  placeholder="Entrez le code reçu par email"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 border-light-brown text-light-brown hover:bg-light-brown/10"
                  onClick={() => setShowDeletePopup(false)}
                >
                  Annuler
                </Button>
                <Button
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                  onClick={handleConfirmDelete}
                  disabled={isDeletingAccount}
                >
                  {isDeletingAccount ? "Suppression..." : "Confirmer la suppression"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

