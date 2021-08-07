var mongoose = require('mongoose');
const { response } = require('express')
const Cupom = require('../models/Cupom')
const Usuario = require('../models/Usuario')

const inserirCupom = (req, res) => {

    const novoCupom = {
        autor: req.body.autor,
        instituicaoAlvo: req.body.instituicao,
        data_validade: req.body.data_validade,
        descricao: req.body.descricao,
        valor_doado: req.body.valor_doado,
        valor: req.body.valor
    }

    //Tentei fazer a validação do autor e da instituição mas ficou zuado help pls
    // Usuario.findOne({ cpfCnpj: req.body.autor })
    //     .then((autor, err) => {
    //         if (err) throw err;
    //         console.log(autor.cpfCnpj);
    //         if (autor.tipo == 'Comércio') {
    //             usuario_autor = autor.cpfCnpj;
    //         }
    //     }). catch((err) => {
    //         res.status(400).json({erro: err, message: 'Falha interna ao definir autor'})
    //     });

    // Usuario.findOne({ cpfCnpj: req.body.instituicaoAlvo })
    //     .then((instituicao, err) => {
    //         if (err) throw err;
    //         if (instituicao.tipo == 'Instituição') {
    //             usuario_instituicao = instituicao.cpfCnpj;
    //         }
    //         else res.status(400).json('Instituição inválida');
    //     }). catch((err) => {
    //         //res.status(500).json({erro: err, message: 'Falha interna ao definir instituição'})
    //     });

    new Cupom(novoCupom)
        .save()
        .then(() => {
            res.status(200).json({ message: 'Cupom inserido com sucesso!' })
        })
        .catch((err) => {
            res.status(400).json({
                erro: err
            })
        })

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
            rest.status(500).json({
                erro: err,
                message: 'Falha interna ao procurar cupons!'
            })
        })
}


module.exports = {
    inserirCupom,
    atualizarCupom,
    listarCupons
}
