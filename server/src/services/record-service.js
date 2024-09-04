const ApiError = require("../errors/api-error");
const config = require("../config");
const { Record } = require("../models/record-model");
const RecordDto = require("../dtos/record-dto");
const userService = require("./user-service");
const { createFilter } = require("../utils/db-utils");

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

    async getRecord(recordId) {
        const record = await Record.findByPk(recordId);
        if (!record) {
            throw ApiError.BadRequest("record not found");
        }
        const recordData = new RecordDto(record);
        return { record: recordData };
    }

    async getRecords(options) {
        const records = await Record.findAll({
            limit: config.DB_RECORD_SEARCH_LIMIT,
            offset: options.offset,
            where: createFilter(options, config.ALLOWED_RECORD_FILTERS),
        });
        const recordsData = records.map((record) => new RecordDto(record));
        return { records: recordsData };
    }
}

module.exports = new RecordService();
