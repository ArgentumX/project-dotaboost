import { makeAutoObservable } from "mobx";
import OrderService from "../service/OrderService";

export default class OrderStore {
    constructor() {
        this.order = {};
        makeAutoObservable(this);
    }

    setOrder(order) {
        this.order = order;
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
}