module.exports = class MessageDto {
    id;
    text;

    constructor(model) {
        this.id = model.id;
        this.text = model.text;
    }
};
