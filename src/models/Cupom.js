
const { Schema, model } = require('../database/conexao')

const cupomSchema = new Schema({

    autor: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    // instituicaoAlvo: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Usuario'
    // },
    data_validade: {
        type: Date,
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    valor_doado: {
        type: Number,
        required: true
    },
    valor: {
        type: Number,
        required: true }
})

const Cupom = model('Cupom', cupomSchema) //Criando a coleção

module.exports = Cupom;
