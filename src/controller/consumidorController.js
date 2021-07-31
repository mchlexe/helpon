
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
            res.status(200).json({message: 'Usuário inserido com sucesso !'})
        })
        .catch((err) => {
            res.status(400).json({
                erro: err
            })
        })

}

module.exports = {
    inserirUsuario
}
