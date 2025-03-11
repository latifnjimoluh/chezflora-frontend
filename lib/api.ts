import axios from "axios"

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

// Configuration de l'intercepteur pour ajouter le token à chaque requête
const api = axios.create({
  baseURL: apiUrl,
})

// Ajouter un intercepteur pour inclure le token JWT dans les headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// ===== AUTHENTIFICATION =====

// Fonction pour la connexion
export const loginUser = async (identifier: string, password: string): Promise<any> => {
  try {
    const response = await api.post(`/api/auth/login`, {
      identifier,
      password,
    })

    // Stocker le token dans le localStorage
    if (response.data.token) {
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("role", response.data.role || "client")
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
    const response = await api.post(`/api/auth/register`, userData)
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de l'inscription", error)
    throw error.response?.data || { message: "Erreur lors de l'inscription." }
  }
}

// Fonction pour vérifier le code OTP
export const verifyOTP = async (email: string, otp_code: string): Promise<any> => {
  try {
    const response = await api.post(`/api/auth/verify-otp`, { email, otp_code })

    // Stocker le token dans le localStorage si présent
    if (response.data.token) {
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("role", response.data.role || "client")
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
    const response = await api.post(`/api/auth/resend-otp`, { email })
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de l'envoi du nouvel OTP", error)
    throw error.response?.data || { message: "Impossible d'envoyer un nouveau code OTP." }
  }
}

// Fonction pour la déconnexion
export const logoutUser = (): void => {
  localStorage.removeItem("token")
  localStorage.removeItem("role")
}

// Fonction pour vérifier si l'utilisateur est connecté
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("token")
}

// Fonction pour récupérer le rôle de l'utilisateur
export const getUserRole = (): string => {
  return localStorage.getItem("role") || "client"
}

// ===== GESTION DU PROFIL UTILISATEUR =====

// Récupérer le profil de l'utilisateur
export const getUserProfile = async (): Promise<any> => {
  try {
    const response = await api.get(`/api/user/profile`)
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la récupération du profil", error)
    throw error.response?.data || { message: "Erreur lors de la récupération du profil." }
  }
}

// Mettre à jour le profil utilisateur
export const updateUserProfile = async (profileData: {
  first_name?: string
  last_name?: string
  phone?: string
}): Promise<any> => {
  try {
    const response = await api.put(`/api/user/update-profile`, profileData)
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la mise à jour du profil", error)
    throw error.response?.data || { message: "Erreur lors de la mise à jour du profil." }
  }
}

// Demander un changement d'email
export const requestEmailChange = async (new_email: string): Promise<any> => {
  try {
    const response = await api.post(`/api/user/request-email-change`, { new_email })
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la demande de changement d'email", error)
    throw error.response?.data || { message: "Erreur lors de la demande de changement d'email." }
  }
}

// Confirmer le changement d'email avec OTP
export const confirmEmailChange = async (new_email: string, otp_code: string): Promise<any> => {
  try {
    const response = await api.put(`/api/user/confirm-email-change`, { new_email, otp_code })
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la confirmation du changement d'email", error)
    throw error.response?.data || { message: "Code OTP incorrect ou expiré." }
  }
}

// Mettre à jour le mot de passe
export const updatePassword = async (current_password: string, new_password: string): Promise<any> => {
  try {
    const response = await api.put(`/api/user/update-password`, { current_password, new_password })
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la mise à jour du mot de passe", error)
    throw error.response?.data || { message: "Erreur lors de la mise à jour du mot de passe." }
  }
}

// Demander la suppression du compte
export const requestAccountDeletion = async (): Promise<any> => {
  try {
    const response = await api.post(`/api/user/request-delete-account`)
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la demande de suppression du compte", error)
    throw error.response?.data || { message: "Erreur lors de la demande de suppression du compte." }
  }
}

// Confirmer la suppression du compte avec OTP
export const confirmAccountDeletion = async (otp_code: string): Promise<any> => {
  try {
    const response = await api.post(`/api/user/confirm-delete-account`, { otp_code })
    // Déconnecter l'utilisateur après la suppression du compte
    logoutUser()
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la confirmation de suppression du compte", error)
    throw error.response?.data || { message: "Code OTP incorrect ou expiré." }
  }
}

// Mettre à jour l'image de profil
export const updateProfileImage = async (imageFile: File): Promise<any> => {
  try {
    const formData = new FormData()
    formData.append("image", imageFile)

    const response = await api.post(`/api/user/update-profile-image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la mise à jour de l'image de profil", error)
    throw error.response?.data || { message: "Erreur lors de la mise à jour de l'image de profil." }
  }
}

// ===== GESTION DES PRODUITS =====

// Récupérer tous les produits
export const getAllProducts = async (): Promise<any> => {
  try {
    const response = await api.get(`/api/products/get-all-product`)
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la récupération des produits", error)
    throw error.response?.data || { message: "Erreur lors de la récupération des produits." }
  }
}

// Récupérer un produit par son ID
export const getProductById = async (id_produit: number | string): Promise<any> => {
  try {
    const response = await api.get(`/api/products/get-product/${id_produit}`)
    return response.data
  } catch (error: any) {
    console.error(`Erreur lors de la récupération du produit ${id_produit}`, error)
    throw error.response?.data || { message: "Produit non trouvé." }
  }
}

// Vérifier le stock d'un produit
export const checkProductStock = async (id_produit: number | string): Promise<any> => {
  try {
    const response = await api.get(`/api/products/check-stock/${id_produit}`)
    return response.data
  } catch (error: any) {
    console.error(`Erreur lors de la vérification du stock du produit ${id_produit}`, error)
    throw error.response?.data || { message: "Erreur lors de la vérification du stock." }
  }
}

// ===== GESTION DES COMMANDES =====

// Passer une commande
export const placeOrder = async (orderData: {
  id_produit: number
  quantite: number
  livraison: boolean
}): Promise<any> => {
  try {
    const response = await api.post(`/api/commandes/passer-commande`, orderData)
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la commande", error)
    throw error.response?.data || { message: "Erreur lors de la commande." }
  }
}

// Annuler une commande
export const cancelOrder = async (id_commande: number): Promise<any> => {
  try {
    const response = await api.put(`/api/commandes/annuler-commande`, { id_commande })
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de l'annulation de la commande", error)
    throw error.response?.data || { message: "Erreur lors de l'annulation de la commande." }
  }
}

// Annuler uniquement la livraison d'une commande
export const cancelDelivery = async (id_commande: number): Promise<any> => {
  try {
    const response = await api.put(`/api/commandes/annuler-livraison`, { id_commande })
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de l'annulation de la livraison", error)
    throw error.response?.data || { message: "Erreur lors de l'annulation de la livraison." }
  }
}

// Récupérer toutes les commandes de l'utilisateur
export const getUsercommandes = async (): Promise<any> => {
  try {
    const response = await api.get(`/api/commandes/mes-commandes`)
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la récupération des commandes", error)
    throw error.response?.data || { message: "Erreur lors de la récupération des commandes." }
  }
}

// Récupérer les commandes de l'utilisateur par statut
export const getUsercommandesByStatus = async (status: string): Promise<any> => {
  try {
    const response = await api.get(`/api/commandes/mes-commandes/${status}`)
    return response.data
  } catch (error: any) {
    console.error(`Erreur lors de la récupération des commandes avec statut ${status}`, error)
    throw error.response?.data || { message: "Erreur lors de la récupération des commandes." }
  }
}

// ===== GESTION DU PANIER =====

// Ajouter un produit au panier
export const addToCart = async (productData: {
  id_produit: number
  quantite: number
}): Promise<any> => {
  try {
    const response = await api.post(`/api/panier/ajouter-panier`, productData)
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de l'ajout au panier", error)
    throw error.response?.data || { message: "Erreur lors de l'ajout au panier." }
  }
}

// Récupérer le contenu du panier
export const getCart = async (): Promise<any> => {
  try {
    const response = await api.get(`/api/panier/get-panier`)
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la récupération du panier", error)
    throw error.response?.data || { message: "Erreur lors de la récupération du panier." }
  }
}

// Supprimer un produit du panier
export const removeFromCart = async (id_produit: number): Promise<any> => {
  try {
    const response = await api.delete(`/api/panier/supprimer-panier`, {
      data: { id_produit },
    })
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la suppression du produit du panier", error)
    throw error.response?.data || { message: "Erreur lors de la suppression du produit du panier." }
  }
}

// Valider le panier (vider après commande)
export const validateCart = async (): Promise<any> => {
  try {
    const response = await api.post(`/api/panier/valider-panier`)
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la validation du panier", error)
    throw error.response?.data || { message: "Erreur lors de la validation du panier." }
  }
}

// Réduire la quantité d'un produit dans le panier
export const decreaseCartItemQuantity = async (id_produit: number): Promise<any> => {
  try {
    const response = await api.put(`/api/panier/reduire-quantite-panier`, { id_produit })
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la réduction de la quantité", error)
    throw error.response?.data || { message: "Erreur lors de la réduction de la quantité." }
  }
}

// ===== GESTION DES ABONNEMENTS =====

// Souscrire à un abonnement
export const subscribeToService = async (subscriptionData: {
  type_abonnement: string
  frequence: string
  adresse_livraison?: string
  disponibilites?: string
  dates_ateliers?: string
}): Promise<any> => {
  try {
    const response = await api.post(`/api/abonnements/souscrire-abonnement`, subscriptionData)
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la souscription à l'abonnement", error)
    throw error.response?.data || { message: "Erreur lors de la souscription à l'abonnement." }
  }
}

// Résilier un abonnement
export const cancelSubscription = async (id_abonnement: number): Promise<any> => {
  try {
    const response = await api.post(`/api/abonnements/resilier-abonnement`, { id_abonnement })
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la résiliation de l'abonnement", error)
    throw error.response?.data || { message: "Erreur lors de la résiliation de l'abonnement." }
  }
}

// Récupérer les abonnements de l'utilisateur
export const getUserSubscriptions = async (): Promise<any> => {
  try {
    const response = await api.get(`/api/abonnements/mes-abonnements`)
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la récupération des abonnements", error)
    throw error.response?.data || { message: "Erreur lors de la récupération des abonnements." }
  }
}

// ===== GESTION DES SERVICES =====

// Récupérer tous les services
export const getAllServices = async (): Promise<any> => {
  try {
    const response = await api.get(`/api/services/get-all-services`)
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la récupération des services", error)
    throw error.response?.data || { message: "Erreur lors de la récupération des services." }
  }
}

// Récupérer un service par son ID
export const getServiceById = async (id_service: number | string): Promise<any> => {
  try {
    const response = await api.get(`/api/services/get-service/${id_service}`)
    return response.data
  } catch (error: any) {
    console.error(`Erreur lors de la récupération du service ${id_service}`, error)
    throw error.response?.data || { message: "Service non trouvé." }
  }
}

// ===== GESTION DES RÉSERVATIONS =====

// Réserver un service
export const reserveService = async (reservationData: {
  service_id: number
  dimension?: string
  nb_personnes?: number
  lieu?: string
  prix_propose?: number
}): Promise<any> => {
  try {
    const response = await api.post(`/api/reservations/reserver`, reservationData)
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la réservation du service", error)
    throw error.response?.data || { message: "Erreur lors de la réservation du service." }
  }
}

// Récupérer les réservations de l'utilisateur
export const getUserReservations = async (): Promise<any> => {
  try {
    const response = await api.get(`/api/reservations/mes-reservations`)
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la récupération des réservations", error)
    throw error.response?.data || { message: "Erreur lors de la récupération des réservations." }
  }
}

// ===== GESTION DU BLOG =====

// Récupérer tous les articles
export const getAllArticles = async (): Promise<any> => {
  try {
    const response = await api.get(`/api/blog/get-all-article`)
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la récupération des articles", error)
    throw error.response?.data || { message: "Erreur lors de la récupération des articles." }
  }
}

// Récupérer un article par son ID
export const getArticleById = async (id_article: number | string): Promise<any> => {
  try {
    const response = await api.get(`/api/blog/get-article/${id_article}`)
    return response.data
  } catch (error: any) {
    console.error(`Erreur lors de la récupération de l'article ${id_article}`, error)
    throw error.response?.data || { message: "Article non trouvé." }
  }
}

// Exporter un objet API global
export const API = {
  // Authentification
  auth: {
    login: loginUser,
    register: registerUser,
    verifyOTP,
    resendOTP,
    logout: logoutUser,
    isAuthenticated,
    getUserRole,
  },
  // Gestion du profil
  user: {
    getProfile: getUserProfile,
    updateProfile: updateUserProfile,
    requestEmailChange,
    confirmEmailChange,
    updatePassword,
    requestAccountDeletion,
    confirmAccountDeletion,
    updateProfileImage,
  },
  // Gestion des produits
  products: {
    getAllProducts,
    getProductById,
    checkStock: checkProductStock,
  },
  // Gestion des commandes
  commandes: {
    placeOrder,
    cancelOrder,
    cancelDelivery,
    getMycommandes: getUsercommandes,
    getMycommandesByStatus: getUsercommandesByStatus,
  },
  // Gestion du panier
  cart: {
    addToCart,
    getCart,
    removeFromCart,
    validateCart,
    decreaseQuantity: decreaseCartItemQuantity,
  },
  // Gestion des abonnements
  subscriptions: {
    subscribe: subscribeToService,
    cancelSubscription,
    getMySubscriptions: getUserSubscriptions,
  },
  // Gestion des services
  services: {
    getAllServices,
    getServiceById,
  },
  // Gestion des réservations
  reservations: {
    reserveService,
    getMyReservations: getUserReservations,
  },
  // Gestion du blog
  blog: {
    getAllArticles,
    getArticleById,
  },
}

export default API

