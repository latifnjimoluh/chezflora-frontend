"use client"

import { useState, useEffect } from "react"

export function useLocalStorage<T>(key: string, initialValue: T) {
  // État pour stocker notre valeur
  // Passer la fonction d'initialisation à useState pour qu'elle ne s'exécute qu'une fois
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  // Initialiser l'état côté client uniquement
  const [initialized, setInitialized] = useState(false)

  // Effet pour charger la valeur depuis localStorage côté client
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const item = localStorage.getItem(key)
        const value = item ? JSON.parse(item) : initialValue
        setStoredValue(value)
      } catch (error) {
        console.error(error)
        setStoredValue(initialValue)
      }
      setInitialized(true)
    }
  }, [key, initialValue])

  // Effet pour mettre à jour localStorage quand la valeur change
  useEffect(() => {
    if (initialized && typeof window !== "undefined") {
      try {
        localStorage.setItem(key, JSON.stringify(storedValue))
      } catch (error) {
        console.error(error)
      }
    }
  }, [key, storedValue, initialized])

  return [storedValue, setStoredValue] as const
}

