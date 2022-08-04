const express = require('express');
const jwt = require('jsonwebtoken');
const authModel = require("../models/auth/authModel");
const router = express.Router();


router.post('/auth', async (req, res) => {
    const { email, password } = req.body;

    authModel.login(email, password)
        .then(rows => {
            if(rows.length > 0) {
                const token = jwt.sign(
                    {username: email, role: '1'},
                    process.env.ACCESSTOKENSECRET,
                    {expiresIn: 86400}
                )
                res.status(200).send({
                    id: rows[0].id,
                    email: rows[0].email,
                    role: rows[0].idRole,
                    accessToken: token,
                    info: {
                        name: rows[0].name,
                        lastname: rows[0].lastname,
                        birthday: rows[0].birthday,
                        address: rows[0].address,
                        methodHealth: rows[0].methodHealth,
                    }
                })
            } else{
                res.status(400).send('ERROR')
            }
        }).catch(err => {
        res.status(400).send(err)
    })
})

router.post('/register', async (req, res) => {
    const { email, data } = req.body;
    authModel.checkEmail(email).then(
        rows => {
            if(rows.length === 0){
                authModel.registerUser(data).then(rows => {
                    res.status(200).send({message: 'Registrado', response: rows})
                }).catch(err => {
                    res.status(400).send({message: err})
                })
            }else{
                res.status(400).send({message: 'El correo ya se encuentra registrado'})
            }
        }
    ).catch(err => {
        res.status(400).send({message: err})
    })
})

module.exports = router;