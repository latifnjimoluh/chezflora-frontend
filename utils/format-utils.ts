/**
 * Formate un prix en remplaçant le symbole XAF par XAF
 * @param price - Le prix à formater
 * @returns Le prix formaté avec XAF
 */
export const formatPrice = (price: number | string): string => {
    if (price === undefined || price === null) return "Prix non disponible"
  
    // Convertir en nombre si c'est une chaîne
    const numericPrice = typeof price === "string" ? Number.parseFloat(price) : price
  
    // Vérifier si le prix est un nombre valide
    if (isNaN(numericPrice)) return "Prix non disponible"
  
    // Si le prix est 0 ou négatif, retourner "Gratuit"
    if (numericPrice <= 0) return "Gratuit"
  
    // Formater le prix avec séparateur d'espaces pour les milliers
    return `${numericPrice.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} XAF`
  }
  
  /**
   * Formate une date ISO en format lisible
   * @param dateString - La date au format ISO
   * @returns La date formatée (ex: 15/04/2023)
   */
  export const formatDate = (dateString: string): string => {
    if (!dateString) return ""
  
    try {
      const date = new Date(dateString)
  
      // Vérifier si la date est valide
      if (isNaN(date.getTime())) {
        return dateString
      }
  
      // Formater la date (jour/mois/année)
      return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    } catch (error) {
      console.error("Erreur lors du formatage de la date:", error)
      return dateString
    }
  }
  
  /**
   * Vérifie si l'utilisateur est connecté
   * @returns true si l'utilisateur est connecté, false sinon
   */
  export const isUserLoggedIn = (): boolean => {
    if (typeof window === "undefined") return false
  
    const token = localStorage.getItem("token")
    if (!token) return false
  
    // Vérifier si le token est expiré (si le token est un JWT)
    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      const expiry = payload.exp * 1000 // Convertir en millisecondes
  
      if (Date.now() >= expiry) {
        // Token expiré, le supprimer
        localStorage.removeItem("token")
        return false
      }
  
      return true
    } catch (error) {
      // Si le token n'est pas un JWT valide, on considère l'utilisateur comme connecté
      // tant que le token existe
      return true
    }
  }
  
  /**
   * Redirige l'utilisateur vers la page de connexion s'il n'est pas connecté
   * @param router - L'objet router de Next.js
   * @param redirectPath - Le chemin vers lequel rediriger après la connexion
   * @returns true si l'utilisateur est connecté, false sinon
   */
  export const requireAuthentication = (router: any, redirectPath?: string): boolean => {
    if (typeof window === "undefined") return false
  
    const isLoggedIn = isUserLoggedIn()
  
    if (!isLoggedIn) {
      const redirectUrl = redirectPath ? `/login?redirect=${encodeURIComponent(redirectPath)}` : "/login"
      router.push(redirectUrl)
      return false
    }
  
    return true
  }
  
  