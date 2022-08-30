const express = require('express');
const sessionsModel = require("../models/sessions/sessions");
const userModel = require("../models/users/users");
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

router.post('/registerhour', (req, res) => {
    userModel.getPatientById(req.body.patientId).then(
        rows => {
            if(rows.length > 0){
                sessionsModel.registerSession(req.body).then(
                    () => {
                        res.status(200).send({message: 'Agendada'})
                    }
                ).catch(err => {
                    res.status(400).send({message: err})
                })
            }else{
                userModel.registerPatient(req.body.infoPatient, req.body.userId).then(
                    () => {
                        sessionsModel.registerSession(req.body).then(
                            () => {
                                res.status(200).send({message: 'Agendada'})
                            }
                        ).catch(err => {
                            res.status(400).send({message: err})
                        })
                    }
                ).catch(err => {
                    res.status(400).send({message: err})
                })
            }
        }
    ).catch(err => {
        res.status(400).send({message: err})
    })
})

router.get('/getpatients', (req, res) => {
    const id = req.query.id;
    if(id) {
        userModel.getPatientsByIdPerson(id).then(
            rows => {
                res.status(200).send({patients: rows})
            }
        ).catch(err => {
            res.status(400).send({message: err})
        })
    }else{
        res.status(400).send({message: 'No hay id'})
    }
})

router.post('/createhours', (req, res) => {
    const body = req.body;
    if(body.hours.length > 0){
        sessionsModel.createHours(body).then(
            () => {
                res.status(200).send({message: 'Creadas!'})
            }
        ).catch(err => {
            res.status(400).send({message: err})
        })
    }else{
        res.status(400).send({message: 'No hay horas para crear'})
    }
})

router.get('/gethourscreates', (req, res) => {
    const date = req.query.date;
    sessionsModel.getHoursCreates(date)
        .then(rows => {
            res.status(200).send({response: rows})
        }).catch(err => {
        res.status(400).send({message: 'Error al consultar las horas'})
    })
})

router.get('/schedulesessions', (req, res) => {
    sessionsModel.getScheduledSessions()
        .then(rows => {
            res.status(200).send({response: rows})
        }).catch(err => {
        res.status(400).send({message: 'Error al consultar las sesiones'})
    })
})

router.post('/updatestatesession', (req, res) => {
    console.log(req.body);
    const {sessionId, state} = req.body;
    sessionsModel.updateStateSession(sessionId, state).then(
        () => {
            res.status(200).send({message: 'ok'})
        }
    ).catch(err => {
        res.status(400).send({message: err})
    })
})

router.get('/gethistorysession', (req, res) => {
    const page = req.query.page;
    sessionsModel.getHistorySession(page).then(
        rows => {
            res.status(200).send({sessions: rows})
        }
    ).catch(err => {
        res.status(400).send({message: err})
    })
})

module.exports = router;