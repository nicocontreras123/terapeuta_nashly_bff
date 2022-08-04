const express = require('express');
const sessionsModel = require("../models/sessions/sessions");
const router = express.Router();

router.get('/getsessionhour', async(req, res) => {
    sessionsModel.getAvailableSessionsDates()
        .then(rows => {
            if(rows.length > 0 ){
                res.status(200).send({response: rows})
            }else{
                res.status(400).send({message: 'No hay sesiones disponibles'})
            }
        }).catch(err => {
        res.status(400).send({message: 'Error al consultar las horas'})
        })
})

router.get('/gethourssession', async(req, res) => {
    const date = req.query.date;
    sessionsModel.getHoursForDateSession(date)
        .then(rows => {
            if(rows.length > 0 ){
                res.status(200).send({response: rows})
            }else{
                res.status(400).send({message: 'No hay sesiones disponibles'})
            }
        }).catch(err => {
        res.status(400).send({message: 'Error al consultar las horas'})
    })
})

module.exports = router;