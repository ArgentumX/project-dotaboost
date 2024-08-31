import $api from "../http"

export default class AdminService {
    static async verify(id, success) {
        const { data } = await $api.post('api/admin/verify/', { ticketId: id, success: success });
        return data;
    }

    static async getTickets(offset) {
        const { data } = await $api.get('api/admin/executor-ticket/?offset=' + offset);
        return data;
    }

    static async getTicket(id) {
        const { data } = await $api.get('api/admin/executor-ticket/' + id);
        return data;
    }
}
