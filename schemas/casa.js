const joi = require('joi');

const schema = joi.object().keys({
    nome: joi.string().min(1).max(20),
    região: joi.string().min(3).max(8),
});

module.exports = schema;