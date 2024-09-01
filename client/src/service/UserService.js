import $api from "../http/axios"

export default class UserService {
    static async uploadAvatar(avatarImg) {
        return $api.post('api/user/avatar', avatarImg)
    }
}
