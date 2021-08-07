
const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);

const { Schema, model } = require('../database/conexao')

const cupomSchema = new Schema({


    autor: {
        type: String,
        ref: 'Usuario'
    },
    instituicaoAlvo: {
        type: String,
        ref: 'Usuario'
    },
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

cupomSchema.plugin(AutoIncrement, {inc_field: 'id'});
const Cupom = model('Cupom', cupomSchema) //Criando a coleção

module.exports = Cupom;
