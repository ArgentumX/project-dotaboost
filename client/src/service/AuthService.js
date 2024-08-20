import $api from "../http"

export default class AuthService {
    static async login(email, password) {
        return $api.post('api/user/login', {email, password})
    }
    
    static async registration(email, username, password) {
        return $api.post('api/user/registration', {email, username, password})
    }

    static async logout() {
        return $api.post('api/user/logout')
    }
}
