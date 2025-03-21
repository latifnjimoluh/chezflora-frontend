"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function VerifyOTP() {
  const [otp, setOtp] = useState("")
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedEmail = localStorage.getItem("email")
      if (storedEmail) {
        setEmail(storedEmail)
      } else {
        setError("Aucune adresse e-mail trouvée. Veuillez vous reconnecter.")
      }
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!otp) {
      setError("Veuillez entrer l'OTP.")
      return
    }

    try {
      const response = await fetch("/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      })

      const data = await response.json()

      if (response.ok) {
        // OTP verification successful
        localStorage.removeItem("email")
        router.push("/new-password")
      } else {
        // OTP verification failed
        setError(data.message || "Erreur lors de la vérification de l'OTP.")
      }
    } catch (err) {
      console.error("Erreur:", err)
      setError("Erreur lors de la vérification de l'OTP.")
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4">Vérifier l'OTP</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="otp" className="block text-gray-700 text-sm font-bold mb-2">
              OTP:
            </label>
            <input
              type="text"
              id="otp"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Vérifier
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

