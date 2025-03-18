// Créer un fichier d'adaptation pour les imports depuis @/services/api
import * as apiService from "@/services/api"

// Fonctions du panier adaptées pour accepter des ID en string ou number
export const getCart = async () => {
  try {
    const response = await apiService.getCart()
    // S'assurer que le résultat est un tableau
    return Array.isArray(response) ? response : response && response.items ? response.items : []
  } catch (error) {
    console.error("Erreur lors de la récupération du panier:", error)
    return [] // Retourner un tableau vide en cas d'erreur
  }
}

export const addToCart = async (id_produit: string | number, quantite: number) => {
  return await apiService.addToCart(Number(id_produit), quantite)
}

export const removeFromCart = async (id_produit: string | number) => {
  return await apiService.removeFromCart(Number(id_produit))
}

export const decrementCartItem = async (id_produit: string | number) => {
  return await apiService.decrementCartItem(Number(id_produit))
}

// Fonction adaptée pour validateCart - ne nécessite pas d'ID de panier
// car le backend identifie l'utilisateur par son token d'authentification
export const validateCart = async (id_panier?: string | number) => {
  // Le token est automatiquement inclus dans les requêtes via l'intercepteur axios
  // L'ID du panier est optionnel car le backend peut identifier le panier de l'utilisateur via son token
  if (id_panier) {
    return await apiService.validateCart(Number(id_panier))
  } else {
    // Appel sans ID de panier - le backend utilisera le token pour identifier l'utilisateur
    return await apiService.validateCart()
  }
}

// Fonction pour passer une commande - utilise également le token pour l'authentification
export const placeOrder = async (orderData: any) => {
  // Le token est automatiquement inclus dans les requêtes via l'intercepteur axios
  return await apiService.placeOrder(orderData)
}

// Réexporter les autres fonctions de l'API
export const loginUser = apiService.loginUser
export const registerUser = apiService.registerUser
export const verifyOTP = apiService.verifyOTP
export const resendOTP = apiService.resendOTP
export const forgotPassword = apiService.forgotPassword
export const resetPassword = apiService.resetPassword
export const logoutUser = apiService.logoutUser
export const getProductById = apiService.getProductById
export const checkProductStock = apiService.checkProductStock
export const getAllProducts = apiService.getAllProducts
export const getServiceById = apiService.getServiceById
export const getAllActiveServices = apiService.getAllActiveServices
export const getServicesSurDevis = apiService.getServicesSurDevis
export const cancelOrder = apiService.cancelOrder
export const getUserOrders = apiService.getUserOrders
export const getUserOrdersByStatus = apiService.getUserOrdersByStatus
export const getOrderDetails = apiService.getOrderDetails
export const reserveService = apiService.reserveService
export const getUserReservations = apiService.getUserReservations
export const cancelReservation = apiService.cancelReservation
export const addDiscussionDevis = apiService.addDiscussionDevis
export const getUserDiscussions = apiService.getUserDiscussions
export const finalizeReservation = apiService.finalizeReservation
export const getUserProfile = apiService.getUserProfile
export const updateUserProfile = apiService.updateUserProfile
export const updatePassword = apiService.updatePassword
export const requestEmailChange = apiService.requestEmailChange
export const confirmEmailChange = apiService.confirmEmailChange
export const requestAccountDeletion = apiService.requestAccountDeletion
export const confirmAccountDeletion = apiService.confirmAccountDeletion
export const subscribeToService = apiService.subscribeToService
export const getUserSubscriptions = apiService.getUserSubscriptions
export const cancelSubscription = apiService.cancelSubscription
export const checkSubscriptionExpiry = apiService.checkSubscriptionExpiry
export const getAuthToken = apiService.getAuthToken
export const setAuthToken = apiService.setAuthToken
export const removeAuthToken = apiService.removeAuthToken
export const getServiceCategories = apiService.getServiceCategories

// Fonction pour récupérer tous les types d'abonnements disponibles
export const getAllSubscriptionTypes = async (): Promise<any> => {
  try {
    // Utiliser apiService directement qui est importé depuis @/api
    const response = await apiService.getAllSubscriptionTypes()
    return response
  } catch (error: any) {
    console.error("Erreur lors de la récupération des types d'abonnements", error)
    throw error.response?.data || { message: "Impossible de récupérer les types d'abonnements." }
  }
}

// Nouvelles fonctions pour le blog
export const getAllBlogPosts = apiService.getAllBlogPosts
export const getBlogPostBySlug = apiService.getBlogPostBySlug
export const getBlogPostComments = apiService.getBlogPostComments
export const addBlogComment = apiService.addBlogComment
export const deleteBlogComment = apiService.deleteBlogComment
export const likeBlogPost = apiService.likeBlogPost
export const unlikeBlogPost = apiService.unlikeBlogPost
export const checkBlogPostLike = apiService.checkBlogPostLike
export const likeBlogComment = apiService.likeBlogComment
export const unlikeBlogComment = apiService.unlikeBlogComment
export const checkBlogCommentLike = apiService.checkBlogCommentLike
export const getBlogCategories = apiService.getBlogCategories
export const getPopularBlogTags = apiService.getPopularBlogTags
export const subscribeToNewsletter = apiService.subscribeToNewsletter

// Nouvelles fonctions pour le blog
export const getPostsByTag = apiService.getPostsByTag
export const getPostsByCategory = apiService.getPostsByCategory
export const getPostsByAuthor = apiService.getPostsByAuthor
export const getAuthorInfo = apiService.getAuthorInfo

