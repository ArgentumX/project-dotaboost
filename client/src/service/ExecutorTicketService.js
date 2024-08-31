import $api from "../http"

export default class ExecutorTicketService {
    static async create(answers) {
        const { data } = await $api.post('api/executor-ticket/create', { answers });
        return data;
    }

    static async getUserTicket() {
        const { data } = await $api.get('api/executor-ticket/');
        return data;
    }

    static async uploadScreenshot(screen) {
        return $api.post('api/executor-ticket/screen', screen);
    }
}
