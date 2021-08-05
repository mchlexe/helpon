
const { response } = require('express')
const Usuario = require('../models/Usuario')

const inserirUsuario = (req, res) => {

    const novoConsumidor = {
        cpfCnpj: req.body.cpf,
        nome: req.body.nome,
        telefone: req.body.telefone,
        email: req.body.email,
        senha: req.body.senha,
        tipo: 'Consumidor'
    }

    new Usuario(novoConsumidor)
        .save()
        .then(() => {
            res.status(200).json({ message: 'Usuário inserido com sucesso !' })
        })
        .catch((err) => {
            res.status(400).json({
                erro: err
            })
        })

}

const removerUsuario = (req, res) => {

    Usuario.findOne({ cpfCnpj: req.body.cpf })
        .then((user, err) => {

            if (err) throw err;

            else if (user) {

                Usuario.deleteOne({cpfCnpj: req.body.cpf})
                    .then(() => {
                        res.status(200).json({message: 'Usuario deletado com sucesso!'})
                    })
                    .catch((err) => {
                        res.status(400).json({message: 'Falha interna ao deletar o usuario!'})
                    }) 

            } else {
                res.status(404).json({message: 'Usuário não encontrado!'})
            }
 
        }).catch((err) => {
            res.status(400).json(
                {message: 'Falha interna ao procurar o usuario!',
                cpf: req.body.cpf,
                erro: err
                }
            )
        }) 

}


const atualizarUsuario = (req, res) => {

    Usuario.updateOne({ cpfCnpj: req.body.cpf }, req.body, { upsert: false }, function (err, doc) {
        if (err) return res.send(500, { error: err });
        return res.send('Succesfully saved.');
    });
}


module.exports = {
    inserirUsuario,
    removerUsuario,
    atualizarUsuario
}
