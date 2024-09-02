import { makeAutoObservable } from "mobx";
import ExecutorTicketService from "../service/ExecutorTicketService";

export default class ExecutorStore {
    constructor() {
        this.executorTicket = {};
        makeAutoObservable(this);
    }

    setExecutorTicket(ticket) {
        this.executorTicket = ticket;
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