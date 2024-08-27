const ApiError = require("../errors/api-error");
const config = require("../config");
const { Record } = require("../models/record-model");
const RecordDto = require("../dtos/record-dto");
const userService = require("./user-service");

String.prototype.format = function () {
    let formatted = this;
    for (let i = 0; i < arguments.length; i++) {
        const regexp = new RegExp(`\\{${i}\\}`, "gi");
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

class RecordService {
    async createOrderRecord(order, executor, message, recordType) {
        const { user } = await userService.getUser(executor.userId);
        const record = await Record.create({
            orderId: order.id,
            executorId: executor.id,
            message: message.format(user.username),
            recordType,
        });
        const recordData = new RecordDto(record);
        return { record: recordData };
    }
}

module.exports = new RecordService();
