import $api from "../http"

export default class ExecutorTicketService {
    static async create(answers) {
        return $api.post('api/executor-ticket/create', {answers});
    }

    static async getUserTicket() {
        return $api.get('api/executor-ticket/')
    }

    static async uploadScreenshot(screen) {
        return $api.post('api/executor-ticket/screen', screen);
    }
}
