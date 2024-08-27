import { makeAutoObservable } from "mobx"
import AuthService from "../service/AuthService"
import axios from "axios"
import { API_URL } from "../http"
import UserService from "../service/UserService";
import OrderService from "../service/OrderService";

export default class Store {

    constructor() {
        this.user = {};
        this.isAuth = false;
        this.isLoading = false;
        makeAutoObservable(this)
    }

    setAuth(bool) {
        this.isAuth = bool
    }

    setUser(user) {
        this.user = user
    }

    setLoading(bool) {
        this.isLoading = bool;
    }

    async login(email, password) {
        try {
            const response = await AuthService.login(email, password);
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
            this.user.avatar = this.user.avatar ? API_URL + this.user.avatar : null;
        } catch (e) {
            swal({
                title: "Ошибка",
                text: e.response?.data?.message,
                icon: "error"
            })
        }
    }

    async registration(email, username, password) {
        try {
            const response = await AuthService.registration(email, username, password);
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e) {
            swal({
                title: "Ошибка",
                text: e.response?.data?.message,
                icon: "error"
            })
        }
    }

    async logout() {
        try {
            const response = await AuthService.logout();
            localStorage.removeItem('token');
            this.setAuth(false);
            this.setUser({});
        } catch (e) {
            swal({
                title: "Ошибка",
                text: e.response?.data?.message,
                icon: "error"
            })
        }
    }

    async checkAuth() {
        this.setLoading(true);

        try {
            const response = await axios.get(`${API_URL}api/user/refresh`, { withCredentials: true })

            response.data.accessToken ?
                localStorage.setItem('token', response.data.accessToken) :
                localStorage.removeItem('token')
            this.setAuth(true);
            this.setUser(response.data.user);
            this.user.avatar = this.user.avatar ? API_URL + this.user.avatar : null;
        } catch (e) {
        } finally {
            this.setLoading(false);
        }
    }

    async uploadAvatar(avatar) {
        try {
            const response = await UserService.uploadAvatar(avatar);
            this.user.avatar = API_URL + response.data.avatar
        } catch (e) {
            swal({
                title: "Ошибка",
                text: e.response?.data?.message,
                icon: "error"
            })
        }
    }

    async createOrder(startMMR, endMMR, party, priority, steamguard, playtime, steamUsername, steamPassword) {
        try {
            const response = await OrderService.createOrder(startMMR, endMMR, party, priority, steamguard, playtime, steamUsername, steamPassword);
        } catch (e) {
            swal({
                title: "Ошибка",
                text: e.response?.data?.message,
                icon: "error"
            })
        }
    }
}
