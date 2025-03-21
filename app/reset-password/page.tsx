"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [resetToken, setResetToken] = useState("")
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient) {
      const token = localStorage.getItem("resetToken")
      if (token) {
        setResetToken(token)
      } else {
        setError("Token invalide ou expiré. Veuillez recommencer.")
      }
    }
  }, [isClient, setResetToken])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!password || !confirmPassword) {
      setError("Veuillez remplir tous les champs.")
      return
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.")
      return
    }

    if (!resetToken) {
      setError("Token de réinitialisation manquant.")
      return
    }

    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: resetToken, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccessMessage(data.message)
        setError("")
        localStorage.removeItem("resetToken")
        // Redirect to login page after successful password reset
        setTimeout(() => {
          router.push("/login")
        }, 2000) // Redirect after 2 seconds
      } else {
        setError(data.error || "Une erreur s'est produite.")
        setSuccessMessage("")
      }
    } catch (error) {
      console.error("Erreur lors de la réinitialisation du mot de passe:", error)
      setError("Une erreur s'est produite lors de la réinitialisation du mot de passe.")
      setSuccessMessage("")
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4">Réinitialiser le mot de passe</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Nouveau mot de passe:
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Nouveau mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
              Confirmer le mot de passe:
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Confirmer le mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Réinitialiser le mot de passe
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ResetPasswordPage

