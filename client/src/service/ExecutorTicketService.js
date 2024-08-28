import $api from "../http"

export default class ExecutorTicketService {
    static async create(answers) {
        return $api.post('api/executor-ticket/create', {answers});
    }
}
