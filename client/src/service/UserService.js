import $api from "../http"

export default class UserService {
    static async uploadAvatar(avatarImg) {
        return $api.post('api/user/avatar', avatarImg)
    }
}
