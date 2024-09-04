module.exports = class RecordDto {
    id;
    recordType;
    message;
    createdAt;

    constructor(model) {
        this.id = model.id;
        this.recordType = model.recordType;
        this.message = model.message;
        this.createdAt = model.createdAt;
    }
};
