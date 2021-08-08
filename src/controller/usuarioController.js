
const { response } = require('express')
const Usuario = require('../models/Usuario')

const yup = require('yup')

let schema = yup.object().shape({
    cpfCnpj: yup.string().required(),
    fotoPerfil: yup.string().required(),
    nome: yup.string().required(),
    telefone: yup.string().required(),
    email: yup.string().email().required(),
    senha: yup.string().required(),
    tipo: yup.string().required()
})

const inserirUsuario = (req, res) => {

    let novoUsuario = {
        cpfCnpj: req.body.cpfCnpj,
        fotoPerfil: (req.file) ? `http://localhost:3000/uploads/${req.file.filename}` : 'http://localhost:3000/uploads/userDefaultImage.jpg',
        nome: req.body.nome,
        telefone: req.body.telefone,
        email: req.body.email,
        senha: req.body.senha, 
        tipo: req.body.tipo
    }

    if ( ['Comércio', 'Instituição'].includes(req.body.tipo) ) {

        //campos de endereço
        novoUsuario['cidade'] = ''
        novoUsuario['uf'] = ''
        novoUsuario['bairro'] = ''
        novoUsuario['rua'] = ''
        novoUsuario['numero'] = ''
        novoUsuario['complemento'] = ''
       
        if ( req.body.tipo == 'Instituição' ) {
            novoUsuario['descricao'] =  ''
        }
        
        if ( req.body.tipo == 'Comércio' ) {
            novoUsuario['ramo'] = ''
        }
    }

    schema.isValid({
        cpfCnpj: req.body.cpfCnpj,
        fotoPerfil: (req.file) ? `http://localhost:3000/uploads/${req.file.filename}` : 'http://localhost:3000/uploads/userDefaultImage.jpg',
        nome: req.body.nome,
        telefone: req.body.telefone,
        email: req.body.email,
        senha: req.body.senha, 
        tipo: req.body.tipo
    }).then(function (valid) {
        if(valid){
    Usuario.findOne({ cpfCnpj: req.body.cpfCnpj })
        .then((user, err) => {

            if (user) {
                res.status(400).json({ message: 'CPF/CNPJ já cadastrado!' })
            }

            else {
                new Usuario(novoUsuario)
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
        })
        .catch((err) => {
            res.status(400).json({
                erro: err
            })
        })
    }else{
        res.send("Preencha todo o formulário")
    }
})
}


const removerUsuario = (req, res) => {

    Usuario.findOne({ cpfCnpj: req.body.cpfCnpj })
        .then((user, err) => {

            if (user) {

                Usuario.deleteOne({ cpfCnpj: req.body.cpfCnpj })
                    .then(() => {
                        res.status(200).json({ message: 'Usuario deletado com sucesso!' })
                    })
                    .catch((err) => {
                        res.status(400).json({ message: 'Falha interna ao deletar o usuario!' })
                    })

            } else {
                res.status(404).json({ message: 'Usuário não encontrado!' })
            }

        }).catch((err) => {
            res.status(500).json(
                {
                    message: 'Falha interna ao procurar o usuario!',
                    erro: err
                }
            )
        })

}


const atualizarUsuario = (req, res) => {

    Usuario.findOne({ cpfCnpj: req.body.cpfCnpj })
        .then((user, err) => {

            if (user) {

                Usuario.updateOne({ cpfCnpj: req.body.cpfCnpj }, req.body)
                    .then(() => {
                        res.status(200).json({ message: 'Usuario atualizado com sucesso!' });
                        return user;
                    })
                    .catch((err) => {
                        res.status(500).json({ message: 'Falha interna ao atualizar o usuario!' });
                    })

            } else {
                res.status(404).json({ message: 'Usuário não encontrado!' });
            }

        }).catch((err) => {
            res.status(500).json(
                {
                    erro: err,
                    message: 'Falha interna ao procurar o usuario!',
                }
            )
        })
}

const listarUsuarios = (req, res) => {

    Usuario.find(req.body).lean()
        .then((usuarios) => {
            return res.end(JSON.stringify(usuarios))
        }).catch((err) => {
            rest.status(500).json({
                erro: err,
                message: 'Falha interna ao procurar usuários!'
            })
        })
}


module.exports = {
    inserirUsuario,
    removerUsuario,
    atualizarUsuario,
    listarUsuarios
}
