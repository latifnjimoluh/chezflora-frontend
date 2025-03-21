"use client"

import { useState, useEffect } from "react"

export function useLocalStorage<T>(key: string, initialValue: T) {
  // État pour stocker notre valeur
  // Passer la fonction d'initialisation à useState pour qu'elle ne s'exécute qu'une fois
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  // État pour vérifier si le code s'exécute côté client
  const [isClient, setIsClient] = useState(false)

  // Effet pour marquer quand le composant est monté côté client
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Effet pour charger la valeur depuis localStorage côté client
  useEffect(() => {
    if (isClient && typeof window !== "undefined") {
      try {
        const item = localStorage.getItem(key)
        const value = item ? JSON.parse(item) : initialValue
        setStoredValue(value)
      } catch (error) {
        console.error(error)
        setStoredValue(initialValue)
      }
    }
  }, [key, initialValue, isClient])

  // Fonction pour mettre à jour la valeur dans localStorage et l'état
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permettre à la valeur d'être une fonction pour la même API que useState
      const valueToStore = value instanceof Function ? value(storedValue) : value

      // Sauvegarder dans l'état
      setStoredValue(valueToStore)

      // Sauvegarder dans localStorage uniquement côté client
      if (typeof window !== "undefined") {
        localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue] as const
}

