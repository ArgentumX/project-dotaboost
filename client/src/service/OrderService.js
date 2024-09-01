import $api from "../http/axios"

export default class OrderService {
    static async createOrder(
        startRating, 
        endRating,
        party,
        priority,
        steamGuard,
        playTime,
        steamUsername,
        steamPassword,
    ) {
        return $api.post('api/order/', {party, priority, steamGuard, playTime, steamUsername, steamPassword, startRating, endRating})
    }
}
