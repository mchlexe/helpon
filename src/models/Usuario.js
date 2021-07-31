
const { Schema, model } = require('../database/conexao')

const userSchema = new Schema({//Criando a estrutura do documento 

    cpfCnpj: {
        type: String,
        required: true
    },
    nome: {
        type: String,
        required: true
    },
    telefone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    senha: {
        type: String,
        required: true
    }, 
    saldo: {
        type: Number,
        default: 0
    },
    status: {
        type: Boolean,
        default: true //As contas inicialmente são ativas, por isso o true : )
    },
    tipo: {
        type: String, 
        required: true
    },
    uf: {
        type: String
    },
    cidade: {
        type: String
    },
    bairro: {
        type: String
    }, 
    rua: {
        type: String
    },
    numero: {
        type: String
    },
    complemento: {
        type: String
    },
    descricao: {
        type: String
    },
    ramo: {
        type: String
    },
    cupons: {
        type: Array
    }, 
    doacoes: {
        type: Array
    }

})

const Usuario = model('Usuario', userSchema) //Criando a coleção 

module.exports = Usuario;