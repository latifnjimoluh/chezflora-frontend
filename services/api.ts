import axios from "axios"

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

// Configuration de l'intercepteur pour ajouter le token à chaque requête
const api = axios.create({
  baseURL: apiUrl,
})

// Fonction utilitaire pour récupérer le token
export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token")
  }
  return null
}

// Fonction utilitaire pour définir le token
export const setAuthToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token)
  }
}

// Fonction utilitaire pour supprimer le token
export const removeAuthToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token")
  }
}

// Ajouter un intercepteur pour inclure le token JWT dans les headers
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Ajouter un intercepteur pour gérer les réponses
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error("Erreur API:", error.message || "Erreur inconnue")

    // Gérer les erreurs réseau
    if (error.message === "Network Error") {
      console.error("Erreur réseau - Vérifiez votre connexion ou si le serveur est en cours d'exécution")
    }

    // Gérer les timeouts
    if (error.code === "ECONNABORTED") {
      console.error("La requête a expiré - Le serveur ne répond pas dans le délai imparti")
    }

    return Promise.reject(error)
  },
)

// ==================== AUTHENTIFICATION ====================

// Fonction pour la connexion
export const loginUser = async (identifier: string, password: string): Promise<any> => {
  try {
    const response = await axios.post(`${apiUrl}/api/auth/login`, {
      identifier,
      password,
    })

    // Stocker le token dans le localStorage
    if (response.data && response.data.token) {
      setAuthToken(response.data.token)
    }

    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la connexion", error)
    throw error.response?.data || { message: "Identifiants incorrects." }
  }
}

// Fonction pour l'inscription
export const registerUser = async (userData: {
  first_name: string
  last_name: string
  email: string
  phone: string
  password: string
}): Promise<any> => {
  try {
    const response = await axios.post(`${apiUrl}/api/auth/register`, userData)
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de l'inscription", error)
    throw error.response?.data || { message: "Erreur lors de l'inscription." }
  }
}

// Fonction pour vérifier le code OTP
export const verifyOTP = async (email: string, otp_code: string): Promise<any> => {
  try {
    const response = await axios.post(`${apiUrl}/api/auth/verify-otp`, { email, otp_code })

    // Stocker le token dans le localStorage si présent dans la réponse
    if (response.data && response.data.token) {
      setAuthToken(response.data.token)
    }

    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la vérification de l'OTP", error)
    throw error.response?.data || { message: "Code OTP incorrect." }
  }
}

// Fonction pour renvoyer un nouveau code OTP
export const resendOTP = async (email: string): Promise<any> => {
  try {
    const response = await axios.post(`${apiUrl}/api/auth/resend-otp`, { email })
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de l'envoi du nouvel OTP", error)
    throw error.response?.data || { message: "Impossible d'envoyer un nouveau code OTP." }
  }
}

// Fonction pour la réinitialisation du mot de passe (Forgot Password)
export const forgotPassword = async (email: string): Promise<any> => {
  try {
    const response = await axios.post(`${apiUrl}/api/auth/forgot-password`, { email })
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la demande de réinitialisation du mot de passe", error)
    throw error.response?.data || { message: "Impossible de traiter votre demande." }
  }
}

// Fonction pour réinitialiser le mot de passe avec un token
export const resetPassword = async (resetToken: string, newPassword: string): Promise<any> => {
  try {
    const response = await axios.post(`${apiUrl}/api/auth/reset-password`, { resetToken, newPassword })
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la réinitialisation du mot de passe", error)
    throw error.response?.data || { message: "Impossible de réinitialiser le mot de passe." }
  }
}

// Fonction pour la déconnexion
export const logoutUser = (): void => {
  removeAuthToken()
  // Vous pouvez ajouter d'autres nettoyages ici si nécessaire
  console.log("Utilisateur déconnecté")
}

// ==================== PRODUITS ====================

// Fonction pour récupérer un produit par son ID
export const getProductById = async (id_produit: number): Promise<any> => {
  try {
    const response = await api.get(`/api/products/get-product/${id_produit}`)
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la récupération du produit", error)
    throw error.response?.data || { message: "Produit non trouvé." }
  }
}

// Fonction pour vérifier le stock d'un produit
export const checkProductStock = async (id_produit: number): Promise<any> => {
  try {
    const response = await api.get(`/api/products/check-stock/${id_produit}`)
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la vérification du stock", error)
    throw error.response?.data || { message: "Impossible de vérifier le stock." }
  }
}

// Fonction pour récupérer tous les produits
export const getAllProducts = async (): Promise<any> => {
  try {
    const response = await api.get("/api/products/get-all-product")
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la récupération des produits", error)
    throw error.response?.data || { message: "Impossible de récupérer les produits." }
  }
}

// ==================== SERVICES ====================

// Fonction pour récupérer un service par son ID
export const getServiceById = async (id_service: string | number): Promise<any> => {
  try {
    // Utiliser l'ID tel quel sans conversion
    const response = await api.get(`/api/services/get-service/${id_service}`)
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la récupération du service", error)
    throw error.response?.data || { message: "Service non trouvé." }
  }
}

// Fonction pour récupérer tous les services actifs
export const getAllActiveServices = async (): Promise<any> => {
  try {
    const response = await api.get("/api/services/get-all-services")
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la récupération des services", error)
    throw error.response?.data || { message: "Impossible de récupérer les services." }
  }
}

// Fonction pour récupérer les services sur devis
export const getServicesSurDevis = async (): Promise<any> => {
  try {
    const response = await api.get("/api/services/services-sur-devis")
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la récupération des services sur devis", error)
    throw error.response?.data || { message: "Impossible de récupérer les services sur devis." }
  }
}

// Ajouter cette nouvelle fonction dans le fichier api.ts
// Fonction pour récupérer les catégories de services
export const getServiceCategories = async (): Promise<string[]> => {
  try {
    const response = await api.get("/api/services/categories")
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la récupération des catégories de services:", error)
    throw error.response?.data || { message: "Impossible de récupérer les catégories de services." }
  }
}

// ==================== PANIER ====================

// Fonction pour ajouter un produit au panier
export const addToCart = async (id_produit: number, quantite: number): Promise<any> => {
  try {
    const response = await api.post("/api/panier/ajouter-panier", { id_produit, quantite })
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de l'ajout au panier", error)
    throw error.response?.data || { message: "Impossible d'ajouter le produit au panier." }
  }
}

// Fonction pour récupérer le panier de l'utilisateur
export const getCart = async (): Promise<any> => {
  try {
    const response = await api.get("/api/panier/mon-panier")
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la récupération du panier", error)
    throw error.response?.data || { message: "Impossible de récupérer le panier." }
  }
}

// Fonction pour supprimer un produit du panier
export const removeFromCart = async (id_produit: number): Promise<any> => {
  try {
    const response = await api.delete("/api/panier/supprimer-panier", { data: { id_produit } })
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la suppression du produit du panier", error)
    throw error.response?.data || { message: "Impossible de supprimer le produit du panier." }
  }
}

// Fonction pour valider le panier - modifiée pour fonctionner sans ID de panier
export const validateCart = async (id_panier?: number): Promise<any> => {
  try {
    // Si un ID de panier est fourni, l'utiliser
    const payload = id_panier ? { id_panier } : {}

    // Le token est automatiquement ajouté par l'intercepteur
    const response = await api.post("/api/panier/valider-panier", payload)
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la validation du panier", error)
    throw error.response?.data || { message: "Impossible de valider le panier." }
  }
}

// Fonction pour réduire la quantité d'un produit dans le panier
export const decrementCartItem = async (id_produit: number): Promise<any> => {
  try {
    const response = await api.put("/api/panier/reduire-quantite-panier", { id_produit })
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la réduction de la quantité", error)
    throw error.response?.data || { message: "Impossible de réduire la quantité." }
  }
}

// ==================== COMMANDES ====================

// Fonction pour passer une commande
export const placeOrder = async (orderData: {
  produits: Array<{ id_produit: number; quantite: number }>
  adresse_livraison: string
  ville: string
  code_postal: string
  telephone: string
  email: string
  mode_livraison: string
  mode_paiement: string
  message?: string
}): Promise<any> => {
  try {
    const response = await api.post("/api/commandes/passer-commande", orderData)
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la création de la commande", error)
    throw error.response?.data || { message: "Impossible de créer la commande." }
  }
}

// Fonction pour annuler une commande
export const cancelOrder = async (id_commande: number): Promise<any> => {
  try {
    const response = await api.put("/api/commandes/annuler-commande", { id_commande })
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de l'annulation de la commande", error)
    throw error.response?.data || { message: "Impossible d'annuler la commande." }
  }
}

// Fonction pour récupérer toutes les commandes de l'utilisateur
export const getUserOrders = async (): Promise<any> => {
  try {
    const response = await api.get("/api/commandes/mes-commandes")
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la récupération des commandes", error)
    throw error.response?.data || { message: "Impossible de récupérer les commandes." }
  }
}

// Fonction pour récupérer les commandes par statut
export const getUserOrdersByStatus = async (statut: string): Promise<any> => {
  try {
    const response = await api.get(`/api/commandes/statut/${statut}`)
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la récupération des commandes par statut", error)
    throw error.response?.data || { message: "Impossible de récupérer les commandes." }
  }
}

// Fonction pour récupérer les détails d'une commande
export const getOrderDetails = async (id_commande: number): Promise<any> => {
  try {
    const response = await api.get(`/api/commandes/commande/${id_commande}`)
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la récupération des détails de la commande", error)
    throw error.response?.data || { message: "Impossible de récupérer les détails de la commande." }
  }
}

// ==================== RÉSERVATIONS ====================

// Fonction pour réserver un service à prix fixe
export const reserveService = async (reservationData: {
  service_id: number
  lieu: string
  date_evenement: string
  adresse: string
  details?: string
  message_client: string
}): Promise<any> => {
  try {
    const response = await api.post("/api/reservations/reserver", reservationData)
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la réservation du service", error)
    throw error.response?.data || { message: "Impossible de réserver le service." }
  }
}

// Fonction pour récupérer toutes les réservations de l'utilisateur
export const getUserReservations = async (): Promise<any> => {
  try {
    const response = await api.get("/api/reservations/mes-reservations")
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la récupération des réservations", error)
    throw error.response?.data || { message: "Impossible de récupérer les réservations." }
  }
}



// Fonction pour annuler une réservation
export const cancelReservation = async (reservation_id: number): Promise<any> => {
  try {
    const response = await api.put("/api/reservations/annuler-reservation", { reservation_id })
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de l'annulation de la réservation", error)
    throw error.response?.data || { message: "Impossible d'annuler la réservation." }
  }
}

// ==================== DISCUSSIONS/DEVIS ====================

// Fonction pour ajouter une discussion pour un service sur devis
export const addDiscussionDevis = async (discussionData: {
  service_id: number
  dimension: string
  nb_personnes: number
  lieu: string
  prix_propose: number
  date_evenement?: string
  adresse?: string
  details?: string
  message_client: string
}): Promise<any> => {
  try {
    const response = await api.post("/api/reservations/ajouter-discussion", discussionData)
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de l'ajout de la discussion", error)
    throw error.response?.data || { message: "Impossible d'ajouter la discussion." }
  }
}

// Fonction pour lister toutes les discussions d'un client
export const getUserDiscussions = async (): Promise<any> => {
  try {
    const response = await api.get("/api/reservations/mes-discussions")
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la récupération des discussions", error)
    throw error.response?.data || { message: "Impossible de récupérer les discussions." }
  }
}

// Fonction pour finaliser une réservation (valider ou annuler)
export const finalizeReservation = async (reservation_id: number, action: "valider" | "annuler"): Promise<any> => {
  try {
    const response = await api.put("/api/reservations/finaliser-reservation", { reservation_id, action })
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la finalisation de la réservation", error)
    throw error.response?.data || { message: "Impossible de finaliser la réservation." }
  }
}

// ==================== PROFIL UTILISATEUR ====================

// Fonction pour récupérer le profil de l'utilisateur
export const getUserProfile = async (): Promise<any> => {
  try {
    const response = await api.get("/api/user/profile")
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la récupération du profil", error)
    throw error.response?.data || { message: "Impossible de récupérer le profil." }
  }
}

// Fonction pour mettre à jour le profil utilisateur
export const updateUserProfile = async (profileData: {
  first_name: string
  last_name: string
  phone: string
}): Promise<any> => {
  try {
    const response = await api.put("/api/user/update-profile", profileData)
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la mise à jour du profil", error)
    throw error.response?.data || { message: "Impossible de mettre à jour le profil." }
  }
}

// Fonction pour mettre à jour le mot de passe
export const updatePassword = async (passwordData: {
  currentPassword: string
  newPassword: string
}): Promise<any> => {
  try {
    const response = await api.put("/api/user/update-password", passwordData)
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la mise à jour du mot de passe", error)
    throw error.response?.data || { message: "Impossible de mettre à jour le mot de passe." }
  }
}

// Fonction pour demander un changement d'email
export const requestEmailChange = async (new_email: string): Promise<any> => {
  try {
    const response = await api.post("/api/user/request-email-change", { new_email })
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la demande de changement d'email", error)
    throw error.response?.data || { message: "Impossible de demander le changement d'email." }
  }
}

// Fonction pour confirmer le changement d'email
export const confirmEmailChange = async (otp_code: string): Promise<any> => {
  try {
    const response = await api.put("/api/user/confirm-email-change", { otp_code })

    // Mettre à jour le token si un nouveau est fourni
    if (response.data && response.data.token) {
      setAuthToken(response.data.token)
    }

    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la confirmation du changement d'email", error)
    throw error.response?.data || { message: "Impossible de confirmer le changement d'email." }
  }
}

// Fonction pour demander la suppression du compte
export const requestAccountDeletion = async (): Promise<any> => {
  try {
    const response = await api.post("/api/user/request-delete-account")
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la demande de suppression du compte", error)
    throw error.response?.data || { message: "Impossible de demander la suppression du compte." }
  }
}

// Fonction pour confirmer la suppression du compte
export const confirmAccountDeletion = async (otp_code: string): Promise<any> => {
  try {
    const response = await api.post("/api/user/confirm-delete-account", { otp_code })
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la confirmation de la suppression du compte", error)
    throw error.response?.data || { message: "Impossible de confirmer la suppression du compte." }
  }
}

// ==================== ABONNEMENTS ====================

// Fonction pour souscrire à un abonnement
export const subscribeToService = async (subscriptionData: {
  type_abonnement: string
  frequence: string
  adresse_livraison?: string
  disponibilites?: string
  dates_ateliers?: string
}): Promise<any> => {
  try {
    const response = await api.post("/api/abonnements/souscrire-abonnement", subscriptionData)
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la souscription à l'abonnement", error)
    throw error.response?.data || { message: "Impossible de souscrire à l'abonnement." }
  }
}

// Fonction pour récupérer les abonnements de l'utilisateur
export const getUserSubscriptions = async (): Promise<any> => {
  try {
    const response = await api.get("/api/abonnements/mes-abonnements")
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la récupération des abonnements", error)
    throw error.response?.data || { message: "Impossible de récupérer les abonnements." }
  }
}

// Fonction pour résilier un abonnement
export const cancelSubscription = async (id_abonnement: number): Promise<any> => {
  try {
    const response = await api.post("/api/abonnements/resilier-abonnement", { id_abonnement })
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la résiliation de l'abonnement", error)
    throw error.response?.data || { message: "Impossible de résilier l'abonnement." }
  }
}

// Fonction pour vérifier si un abonnement expire bientôt
export const checkSubscriptionExpiry = async (): Promise<any> => {
  try {
    const response = await api.get("/api/abonnements/verifier-rappel")
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la vérification de l'expiration de l'abonnement", error)
    throw error.response?.data || { message: "Impossible de vérifier l'expiration de l'abonnement." }
  }
}

// Fonction pour récupérer tous les types d'abonnements disponibles
export const getAllSubscriptionTypes = async (): Promise<any> => {
  try {
    const response = await api.get("/api/abonnements/types-abonnements")
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la récupération des types d'abonnements", error)
    throw error.response?.data || { message: "Impossible de récupérer les types d'abonnements." }
  }
}

// ==================== CONTACT ====================

// Fonction pour récupérer les informations de contact
export const getContactInfo = async (): Promise<any> => {
  try {
    const response = await api.get("/api/contact/info")
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la récupération des informations de contact", error)
    throw error.response?.data || { message: "Impossible de récupérer les informations de contact." }
  }
}

// Fonction pour récupérer les sujets de contact
export const getContactSubjects = async (): Promise<any> => {
  try {
    const response = await api.get("/api/contact/subjects")
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la récupération des sujets de contact", error)
    throw error.response?.data || { message: "Impossible de récupérer les sujets de contact." }
  }
}

// Fonction pour envoyer un message de contact
export const sendContactMessage = async (messageData: {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}): Promise<any> => {
  try {
    const response = await api.post("/api/contact/send", messageData)
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de l'envoi du message de contact", error)
    throw error.response?.data || { message: "Impossible d'envoyer le message de contact." }
  }
}

// Fonction pour récupérer les FAQ
export const getFaqs = async (category?: string): Promise<any> => {
  try {
    const url = category ? `/api/contact/faqs?category=${category}` : "/api/contact/faqs"
    const response = await api.get(url)
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la récupération des FAQ", error)
    throw error.response?.data || { message: "Impossible de récupérer les FAQ." }
  }
}

// ==================== BLOG ====================

// Fonction pour récupérer tous les articles de blog
export const getAllBlogPosts = async (): Promise<any> => {
  try {
    console.log("Récupération de tous les articles de blog...")
    const response = await api.get("/api/blog/posts")
    console.log("Articles récupérés avec succès:", response.data)
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la récupération des articles de blog:", error.message)
    // Retourner un tableau vide au lieu de lancer une erreur
    return []
  }
}

// Fonction pour récupérer un article de blog par son slug
export const getBlogPostBySlug = async (slug: string): Promise<any> => {
  try {
    console.log(`Récupération de l'article avec le slug: ${slug}...`)
    if (!slug) {
      console.error("Slug non fourni")
      throw new Error("Slug non fourni")
    }

    const response = await api.get(`/api/blog/posts/${slug}`)
    console.log("Article récupéré avec succès:", response.data)
    return response.data
  } catch (error: any) {
    console.error(`Erreur lors de la récupération de l'article de blog (slug: ${slug}):`, error.message)

    // Gérer spécifiquement les erreurs réseau
    if (error.message && error.message.includes("Network Error")) {
      throw {
        message:
          "Impossible de se connecter à l'API. Vérifiez votre connexion ou si le serveur est en cours d'exécution.",
      }
    }

    // Gérer les erreurs 404
    if (error.response && error.response.status === 404) {
      throw {
        message: "Article de blog non trouvé.",
      }
    }

    throw error.response?.data || { message: "Erreur lors de la récupération de l'article." }
  }
}

// Fonction pour récupérer les commentaires d'un article de blog
export const getBlogPostComments = async (postId: number): Promise<any> => {
  try {
    console.log(`Récupération des commentaires pour l'article ID: ${postId}...`)
    if (!postId) {
      console.error("ID de l'article non fourni")
      return []
    }

    const response = await api.get(`/api/blog/posts/${postId}/comments`)
    console.log("Commentaires récupérés avec succès:", response.data)
    return response.data
  } catch (error: any) {
    console.error(`Erreur lors de la récupération des commentaires (postId: ${postId}):`, error.message)
    // En cas d'erreur, retourner un tableau vide au lieu de lancer une erreur
    return []
  }
}

// Fonction pour ajouter un commentaire à un article de blog
export const addBlogComment = async (postId: number, content: string): Promise<any> => {
  try {
    console.log(`Ajout d'un commentaire à l'article ID: ${postId}...`)
    if (!postId || !content) {
      console.error("ID de l'article ou contenu du commentaire manquant")
      throw new Error("ID de l'article et contenu du commentaire requis")
    }

    const response = await api.post("/api/blog/comments", { post_id: postId, content })
    console.log("Commentaire ajouté avec succès:", response.data)
    return response.data
  } catch (error: any) {
    console.error(`Erreur lors de l'ajout du commentaire (postId: ${postId}):`, error.message)
    throw error.response?.data || { message: "Impossible d'ajouter le commentaire." }
  }
}

// Fonction pour supprimer un commentaire
export const deleteBlogComment = async (commentId: number): Promise<any> => {
  try {
    console.log(`Suppression du commentaire ID: ${commentId}...`)
    if (!commentId) {
      console.error("ID du commentaire non fourni")
      throw new Error("ID du commentaire requis")
    }

    const response = await api.delete(`/api/blog/comments/${commentId}`)
    console.log("Commentaire supprimé avec succès:", response.data)
    return response.data
  } catch (error: any) {
    console.error(`Erreur lors de la suppression du commentaire (commentId: ${commentId}):`, error.message)
    throw error.response?.data || { message: "Impossible de supprimer le commentaire." }
  }
}

// Fonction pour aimer un article de blog
export const likeBlogPost = async (postId: number): Promise<any> => {
  try {
    console.log(`Like de l'article ID: ${postId}...`)
    if (!postId) {
      console.error("ID de l'article non fourni")
      throw new Error("ID de l'article requis")
    }

    const response = await api.post(`/api/blog/posts/${postId}/like`)
    console.log("Article aimé avec succès:", response.data)
    return response.data
  } catch (error: any) {
    console.error(`Erreur lors de l'ajout du like à l'article (postId: ${postId}):`, error.message)
    throw error.response?.data || { message: "Impossible d'aimer l'article." }
  }
}

// Fonction pour ne plus aimer un article de blog
export const unlikeBlogPost = async (postId: number): Promise<any> => {
  try {
    console.log(`Unlike de l'article ID: ${postId}...`)
    if (!postId) {
      console.error("ID de l'article non fourni")
      throw new Error("ID de l'article requis")
    }

    const response = await api.delete(`/api/blog/posts/${postId}/like`)
    console.log("Like retiré avec succès:", response.data)
    return response.data
  } catch (error: any) {
    console.error(`Erreur lors de la suppression du like de l'article (postId: ${postId}):`, error.message)
    throw error.response?.data || { message: "Impossible de retirer le like de l'article." }
  }
}

// Fonction pour vérifier si l'utilisateur a aimé un article
export const checkBlogPostLike = async (postId: number): Promise<any> => {
  try {
    console.log(`Vérification du like pour l'article ID: ${postId}...`)
    if (!postId) {
      console.error("ID de l'article non fourni")
      return { liked: false }
    }

    const response = await api.get(`/api/blog/posts/${postId}/like`)
    console.log("Statut du like récupéré avec succès:", response.data)
    return response.data
  } catch (error: any) {
    console.error(`Erreur lors de la vérification du like de l'article (postId: ${postId}):`, error.message)
    return { liked: false }
  }
}

// Fonction pour aimer un commentaire
export const likeBlogComment = async (commentId: number): Promise<any> => {
  try {
    console.log(`Like du commentaire ID: ${commentId}...`)
    if (!commentId) {
      console.error("ID du commentaire non fourni")
      throw new Error("ID du commentaire requis")
    }

    const response = await api.post(`/api/blog/comments/${commentId}/like`)
    console.log("Commentaire aimé avec succès:", response.data)
    return response.data
  } catch (error: any) {
    console.error(`Erreur lors de l'ajout du like au commentaire (commentId: ${commentId}):`, error.message)
    throw error.response?.data || { message: "Impossible d'aimer le commentaire." }
  }
}

// Fonction pour ne plus aimer un commentaire
export const unlikeBlogComment = async (commentId: number): Promise<any> => {
  try {
    console.log(`Unlike du commentaire ID: ${commentId}...`)
    if (!commentId) {
      console.error("ID du commentaire non fourni")
      throw new Error("ID du commentaire requis")
    }

    const response = await api.delete(`/api/blog/comments/${commentId}/like`)
    console.log("Like retiré avec succès:", response.data)
    return response.data
  } catch (error: any) {
    console.error(`Erreur lors de la suppression du like du commentaire (commentId: ${commentId}):`, error.message)
    throw error.response?.data || { message: "Impossible de retirer le like du commentaire." }
  }
}

// Fonction pour vérifier si l'utilisateur a aimé un commentaire
export const checkBlogCommentLike = async (commentId: number): Promise<any> => {
  try {
    console.log(`Vérification du like pour le commentaire ID: ${commentId}...`)
    if (!commentId) {
      console.error("ID du commentaire non fourni")
      return { liked: false }
    }

    const response = await api.get(`/api/blog/comments/${commentId}/like`)
    console.log("Statut du like récupéré avec succès:", response.data)
    return response.data
  } catch (error: any) {
    console.error(`Erreur lors de la vérification du like du commentaire (commentId: ${commentId}):`, error.message)
    return { liked: false }
  }
}

// Fonction pour récupérer les catégories du blog
export const getBlogCategories = async (): Promise<any> => {
  try {
    console.log("Récupération des catégories du blog...")
    const response = await api.get("/api/blog/categories")
    console.log("Catégories récupérées avec succès:", response.data)
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la récupération des catégories du blog:", error.message)
    // Si l'endpoint n'existe pas (404), ne pas afficher d'erreur critique
    if (error.response && error.response.status === 404) {
      console.log("L'endpoint des catégories n'est pas encore implémenté")
    }
    // Retourner un tableau vide au lieu de lancer une erreur
    return []
  }
}

// Fonction pour récupérer les tags populaires du blog
export const getPopularBlogTags = async (): Promise<any> => {
  try {
    console.log("Récupération des tags populaires...")
    const response = await api.get("/api/blog/popular-tags")
    console.log("Tags populaires récupérés avec succès:", response.data)
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la récupération des tags populaires:", error.message)
    // Si l'endpoint n'existe pas (404), ne pas afficher d'erreur critique
    if (error.response && error.response.status === 404) {
      console.log("L'endpoint des tags populaires n'est pas encore implémenté")
    }
    // Retourner un tableau vide au lieu de lancer une erreur
    return []
  }
}

// Fonction pour s'abonner à la newsletter
export const subscribeToNewsletter = async (email: string): Promise<any> => {
  try {
    console.log(`Abonnement à la newsletter pour l'email: ${email}...`)
    if (!email) {
      console.error("Email non fourni")
      throw new Error("Email requis")
    }

    const response = await api.post("/api/blog/subscribe-newsletter", { email })
    console.log("Abonnement à la newsletter réussi:", response.data)
    return response.data
  } catch (error: any) {
    console.error(`Erreur lors de l'abonnement à la newsletter (email: ${email}):`, error.message)
    throw error.response?.data || { message: "Impossible de s'abonner à la newsletter." }
  }
}

// Fonction pour récupérer les articles par tag
export const getPostsByTag = async (tag: string): Promise<any> => {
  try {
    console.log(`Récupération des articles avec le tag: ${tag}...`)
    const response = await api.get(`/api/blog/posts/by-tag/${tag}`)
    console.log(`Articles récupérés avec succès pour le tag ${tag}:`, response.data)
    return response.data
  } catch (error: any) {
    console.error(`Erreur lors de la récupération des articles par tag (${tag}):`, error.message)
    // Retourner un tableau vide au lieu de lancer une erreur
    return []
  }
}

// Fonction pour récupérer les articles par catégorie
export const getPostsByCategory = async (category: string): Promise<any> => {
  try {
    console.log(`Récupération des articles de la catégorie: ${category}...`)
    const response = await api.get(`/api/blog/posts/by-category/${category}`)
    console.log(`Articles récupérés avec succès pour la catégorie ${category}:`, response.data)
    return response.data
  } catch (error: any) {
    console.error(`Erreur lors de la récupération des articles par catégorie (${category}):`, error.message)
    // Retourner un tableau vide au lieu de lancer une erreur
    return []
  }
}

// Fonction pour récupérer les articles par auteur
export const getPostsByAuthor = async (author: string): Promise<any> => {
  try {
    console.log(`Récupération des articles de l'auteur: ${author}...`)
    const response = await api.get(`/api/blog/posts/by-author/${author}`)
    console.log(`Articles récupérés avec succès pour l'auteur ${author}:`, response.data)
    return response.data
  } catch (error: any) {
    console.error(`Erreur lors de la récupération des articles par auteur (${author}):`, error.message)
    // Retourner un tableau vide au lieu de lancer une erreur
    return []
  }
}

// Fonction pour récupérer les informations d'un auteur
export const getAuthorInfo = async (author: string): Promise<any> => {
  try {
    console.log(`Récupération des informations de l'auteur: ${author}...`)
    const response = await api.get(`/api/blog/authors/${author}`)
    console.log(`Informations récupérées avec succès pour l'auteur ${author}:`, response.data)
    return response.data
  } catch (error: any) {
    console.error(`Erreur lors de la récupération des informations de l'auteur (${author}):`, error.message)
    // Simuler une réponse en cas d'erreur
    return {
      name: author,
      avatar: "/placeholder.svg?height=100&width=100",
      bio: "Experte en horticulture et passionnée de plantes d'intérieur. Partage ses connaissances et astuces pour aider chacun à créer son propre coin de verdure.",
      specialties: ["Plantes d'intérieur", "Orchidées", "Jardinage urbain"],
    }
  }
}

// Ajouter ces nouvelles fonctions à votre fichier api.ts existant

// Fonction pour récupérer les produits mis en avant
export const getFeaturedProducts = async (): Promise<any> => {
  try {
    const response = await api.get("/api/products/get-featured")
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la récupération des produits mis en avant", error)
    throw error.response?.data || { message: "Impossible de récupérer les produits mis en avant." }
  }
}

// Fonction pour récupérer des articles de blog aléatoires
export const getRandomBlogPosts = async (limit: number): Promise<any> => {
  try {
    const response = await api.get(`/api/blog/random?limit=${limit}`)
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la récupération des articles aléatoires", error)
    throw error.response?.data || { message: "Impossible de récupérer les articles aléatoires." }
  }
}

// Fonctions pour les témoignages
export const getAllTestimonials = async (): Promise<any> => {
  try {
    const response = await api.get("/api/testimonials/get-all")
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la récupération des témoignages", error)
    throw error.response?.data || { message: "Impossible de récupérer les témoignages." }
  }
}

export const getFeaturedTestimonials = async (): Promise<any> => {
  try {
    const response = await api.get("/api/testimonials/get-featured")
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la récupération des témoignages mis en avant", error)
    throw error.response?.data || { message: "Impossible de récupérer les témoignages mis en avant." }
  }
}

export const addTestimonial = async (data: {
  name: string
  text: string
  rating: number
  image?: string
  is_featured?: boolean
}): Promise<any> => {
  try {
    const response = await api.post("/api/testimonials/add", data)
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de l'ajout du témoignage", error)
    throw error.response?.data || { message: "Impossible d'ajouter le témoignage." }
  }
}

export const updateTestimonial = async (
  id: number,
  data: {
    name?: string
    text?: string
    rating?: number
    image?: string
    is_featured?: boolean
  },
): Promise<any> => {
  try {
    const response = await api.put(`/api/testimonials/update/${id}`, data)
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la mise à jour du témoignage", error)
    throw error.response?.data || { message: "Impossible de mettre à jour le témoignage." }
  }
}

export const deleteTestimonial = async (id: number): Promise<any> => {
  try {
    const response = await api.delete(`/api/testimonials/delete/${id}`)
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la suppression du témoignage", error)
    throw error.response?.data || { message: "Impossible de supprimer le témoignage." }
  }
}

export const toggleTestimonialFeatured = async (id: number): Promise<any> => {
  try {
    const response = await api.put(`/api/testimonials/toggle-featured/${id}`)
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la modification du statut du témoignage", error)
    throw error.response?.data || { message: "Impossible de modifier le statut du témoignage." }
  }
}

// Ajouter ces nouvelles fonctions à votre fichier api.ts existant

// Fonctions pour les contenus du site
export const getAllSiteContents = async (): Promise<any> => {
  try {
    const response = await api.get("/api/site-content/all")
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la récupération des contenus du site", error)
    throw error.response?.data || { message: "Impossible de récupérer les contenus du site." }
  }
}

export const getSiteContentByKey = async (key: string): Promise<any> => {
  try {
    const response = await api.get(`/api/site-content/${key}`)
    return response.data
  } catch (error: any) {
    console.error(`Erreur lors de la récupération du contenu "${key}"`, error)
    throw error.response?.data || { message: `Impossible de récupérer le contenu "${key}".` }
  }
}

export const updateSiteContent = async (key: string, value: string): Promise<any> => {
  try {
    const response = await api.put(`/api/site-content/${key}`, { value })
    return response.data
  } catch (error: any) {
    console.error(`Erreur lors de la mise à jour du contenu "${key}"`, error)
    throw error.response?.data || { message: `Impossible de mettre à jour le contenu "${key}".` }
  }
}

export const deleteSiteContent = async (key: string): Promise<any> => {
  try {
    const response = await api.delete(`/api/site-content/${key}`)
    return response.data
  } catch (error: any) {
    console.error(`Erreur lors de la suppression du contenu "${key}"`, error)
    throw error.response?.data || { message: `Impossible de supprimer le contenu "${key}".` }
  }
}

// Ajouter cette fonction pour mettre à jour l'image de profil
export const updateProfileImage = async (file: File) => {
  try {
    const formData = new FormData()
    formData.append("image", file)

    const token = localStorage.getItem("token")
    if (!token) {
      throw new Error("Utilisateur non authentifié")
    }
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/update-profile-image`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Erreur lors de la mise à jour de l'image de profil")
    }

    const data = await response.json()
    return data
  } catch (error: any) {
    console.error("Erreur lors de la mise à jour de l'image de profil:", error)
    throw error
  }
}

export default api
