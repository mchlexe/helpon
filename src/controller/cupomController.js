var mongoose = require('mongoose');
const { response } = require('express')
const Cupom = require('../models/Cupom')
const Usuario = require('../models/Usuario')
const yup = require('yup')

// Schema de validação
let schema = yup.object().shape({
    autor: yup.string().required(),
    instituicaoAlvo: yup.string().required(),
    data_validade: yup.date().required(),
    descricao: yup.string().required(),
    valor_doado: yup.number().required(),
    valor: yup.number().required(),
})

const verificar = async (cnpj, tipo) => {

    const user = await Usuario.findOne({cpfCnpj: cnpj});

    if ( user ) {
        return user.tipo == tipo
    }

    return false //Se o usuário não existir, o retorno é false :)

}

const inserirCupom = async (req, res) => {

    if ( await verificar(req.body.instituicaoAlvo, 'Instituição') && await verificar(req.body.autor, 'Comércio')) {

        const autor = await Usuario.findOne({cpfCnpj: req.body.autor})
        const instituicaoAlvo = await Usuario.findOne({cpfCnpj: req.body.instituicaoAlvo})

        const novoCupom = {

            autor: autor._id,
            autorNome: autor.nome,
            instituicaoAlvo: instituicaoAlvo._id,
            instituicaoAlvoNome: instituicaoAlvo.nome,
            data_validade: req.body.data_validade,
            descricao: req.body.descricao,
            valor_doado: req.body.valor_doado,
            valor: req.body.valor

        }

        // Validando campos
        schema.isValid({
            autor: autor._id,
            instituicaoAlvo: instituicaoAlvo._id,
            data_validade: req.body.data_validade,
            descricao: req.body.descricao,
            valor_doado: req.body.valor_doado,
            valor: req.body.valor
        }).then(function(valid) {
            if(valid){

                new Cupom(novoCupom)
                    .save()
                    .then(() => {
                        res.status(200).json({message: 'Cupom inserido com sucesso !'})
                    })
                    .catch((err) => {
                        res.status(400).json({error: err})
                    })
            }
            else{
                res.send("Preencha todo o formulário")
            }
        })


    } else {
        res.status(400).json(
            {
                message: 'Erro, o autor ou instituição alvo são invalidos !'
            }
        )
    }

}

const atualizarCupom = (req, res) => { //serve para remover o cupom {"status": "false"}

    Cupom.findOne({ id: req.body.id })
    .then((cupom, err) => {

        if (cupom) {

            Cupom.updateOne({ id: req.body.id }, req.body)
                .then(() => {
                    res.status(200).json({message: 'Cupom atualizado com sucesso!',
                body: cupom});
                    return cupom;
                })
                .catch((err) => {
                    res.status(500).json({message: 'Falha interna ao atualizar o cupom!'});
                })

        } else {
            res.status(404).json({message: 'Cupom não encontrado!'});
        }

    }).catch((err) => {
        res.status(500).json(
            {
                erro: err,
                message: 'Falha interna ao procurar o cupom!',
            }
        )
    })


}

const listarCupons = (req, res) => {

    Cupom.find(req.body).lean()
        .then((cupons) => {
            return res.end(JSON.stringify(cupons))
        }).catch((err) => {
            res.status(500).json({
                erro: err,
                message: 'Falha interna ao procurar cupons!'
            })
        })
}

const listarPorStatusCupons = (req, res) => {

    Cupom.find({status: req.param('status')}).lean()
        .then((cupons) => {
            return res.end(JSON.stringify(cupons))
        }).catch((err) => {
            res.status(500).json({
                erro: err,
                message: 'Falha interna ao procurar cupons!'
            })
        })
}

const listarCupom = (req, res) => {

    Cupom.find({id: req.param('id')}).lean()
        .then((cupons) => {
            return res.end(JSON.stringify(cupons))
        }).catch((err) => {
            rest.status(500).json({
                erro: err,
                message: 'Falha interna ao procurar cupom!'
            })
        })
}


module.exports = {
    inserirCupom,
    atualizarCupom,
    listarCupons,
    listarPorStatusCupons,
    listarCupom
}
