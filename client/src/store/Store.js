import { makeAutoObservable } from "mobx"
import AuthService from "../service/AuthService"
import axios from "axios"
import { API_URL } from "../http/axios"
import UserService from "../service/UserService";
import OrderService from "../service/OrderService";
import ExecutorTicketService from "../service/ExecutorTicketService";

export default class Store {

    constructor() {
        this.user = {};
        this.isAuth = false;
        this.isLoading = false;
        this.order = {};
        this.executorTicket = {};
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

    setOrder(order) {
        this.order = order;
    }
    
    setExecutorTicket(ticket) {
        this.executorTicket = ticket;
    }

    async login(email, password) {
        try {
            const response = await AuthService.login(email, password);
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
            this.user.avatar = this.user.avatar ? API_URL + this.user.avatar : null;
        } catch (e) {
            if (e.response?.data?.message == 'Wrong email or password') {
                swal({
                    title: "Oшибка",
                    text: "Неверный пароль или почта.",
                    icon: "error"
                })

                return;
            }
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
            if (e.response?.data?.message == 'email is already in use') {
                swal({
                    title: "Oшибка",
                    text: "Почта уже используется.",
                    icon: "error"
                })

                return;
            }

            if (e.response?.data?.message == 'username is already in use') {
                swal({
                    title: "Oшибка",
                    text: "Данное имя пользователя уже используется.",
                    icon: "error"
                })

                return;
            }

            if (e.response?.data?.message == 'validation error') {
                if (e.response.data.errors[0].path == 'username') {
                    swal({
                        title: "Ошибка",
                        text: "Имя пользователя слишком длинное или слишком короткое.",
                        icon: "error"
                    })
                    return;
                }

                if (e.response.data.errors[0].path == 'email') {
                    swal({
                        title: "Ошибка",
                        text: "Неверная почта.",
                        icon: "error"
                    })
                    return;
                }

                if (e.response.data.errors[0].path == 'password') {
                    swal({
                        title: "Ошибка",
                        text: "Слишком слабый пароль.",
                        icon: "error"
                    })
                    return;
                }

            }

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
            this.user.avatar = API_URL + response.data.avatar;
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
            this.setOrder(response.data.order);
        } catch (e) {
            if (e.response?.data?.message == 'unable to create new orders before other not payed') {
                swal({
                    title: "Ошибка",
                    text: "Вы не можете создать заказ, если у Вас есть действующие неоплаченные заказы.",
                    icon: "error"
                })
                return;
            }
            swal({
                title: "Ошибка",
                text: e.response?.data?.message,
                icon: "error"
            })
        }
    }

    async uploadScreenshot(screen) {
        try {
            const response = await ExecutorTicketService.uploadScreenshot(screen);
        } catch (e) {
            swal({
                title: "Oшибка",
                text: e.response?.message,
                icon: "error"
            })
        }
    }
}
