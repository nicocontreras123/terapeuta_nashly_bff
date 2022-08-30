const {executeStatement} = require("../../db/db");
const {sendEmail } = require("../../middleware/email");
getAvailableSessionsDates = () => {
    return new Promise( (resolve, reject) =>{
        let nowDate = new Date();
        const offset = nowDate.getTimezoneOffset()
        nowDate = new Date(nowDate.getTime() - (offset*60*1000))

        const query = `SELECT dateSession from sessions
                        WHERE state = ${1}
                        AND dateSession >= '${nowDate.toISOString().split('T')[0]}'
                        group by dateSession
                        order by dateSession asc`

        executeStatement(query).then(
            result => {
                resolve(result.recordset)
            }
        ).catch(err => {
            reject(err)
        })
    })
}

getHoursForDateSession = (date) => {
    return new Promise( (resolve, reject) =>{
        const query = `SELECT id, hourSession from sessions
                       WHERE dateSession = '${date}'
                         and state = 1`

        executeStatement(query).then(
            result => {
                resolve(result.recordset)
            }
        ).catch(err => {
            reject(err)
        })
    })
}

registerSession = (body) => {
    return new Promise( (resolve, reject) =>{
        const query = `UPDATE sessions SET idPerson=${body.userId}, 
                    state=2, 
                    typeSession=${body.typeSessionSelected}
                    where id=${body.idSession}`
        executeStatement(query).then(
            () => {
                resolve(true)
                sendEmail({
                    nameUser: body.userInfo.name,
                    namePatient: body.infoPatient.name,
                    lastnamePatient: body.infoPatient.lastname,
                    address: body.userInfo.address,
                    date: body.date,
                    phone: body.userInfo.phone,
                    hour: body.hour,
                    city: body.userInfo.city,
                })
            }
        ).catch(err => {
            reject(err)
        })

    })
}

createHours = (body) => {
    return new Promise( (resolve, reject) =>{
        let query = `insert into sessions (dateSession, hourSession, description, 
                      state, idPerson, typeSession)
                       values`

        let values = '';
        let separator = '';

        body.hours.forEach((h, i )=> {
            separator = i+1===body.hours.length ? "" : ",";
            values = `${values} ('${body.day}', '${h.init}', '', 1, 0, 0)${separator}`
        })

        query = `${query} ${values}`
        executeStatement(query).then(
            result => {
                resolve(result.recordset)
            }
        ).catch(err => {
            reject(err)
        })
    })
}

getHoursCreates = (date) => {
    return new Promise( (resolve, reject) =>{
        const query = `SELECT id, dateSession, hourSession, state from sessions
                       WHERE dateSession = '${date}'`

        executeStatement(query).then(
            result => {
                resolve(result.recordset)
            }
        ).catch(err => {
            reject(err)
        })
    })
}

getScheduledSessions = () => {
    return new Promise( (resolve, reject) =>{
        let nowDate = new Date();
        const offset = nowDate.getTimezoneOffset()
        nowDate = new Date(nowDate.getTime() - (offset*60*1000))

        const query = `SELECT s.dateSession,  s.hourSession, s.id,
                              p.*, p2.name as patientName, p2.lastName as patientLast from sessions s
                             LEFT JOIN person p on s.idPerson = p.idPerson
                            LEFT JOIN patients p2 on p.idPerson = p2.idPerson
                        WHERE s.state = ${2}
                        AND s.dateSession >= '${nowDate.toISOString().split('T')[0]}'
                        order by hourSession asc`
        executeStatement(query).then(
            result => {
                resolve(result.recordset)
            }
        ).catch(err => {
            reject(err)
        })
    })
}

updateStateSession = (sessionId, state) => {
    return new Promise( (resolve, reject) =>{
        const query = `UPDATE sessions SET state=${state}
                       where id=${sessionId}`
        executeStatement(query).then(
            result => {
                resolve(result.recordset)
            }
        ).catch(err => {
            reject(err)
        })
    })
}

getHistorySession = (page) => {
    return new Promise( (resolve, reject) =>{
        const query = `SELECT s.dateSession, p.name, p.lastName, 
                        s.state, count(s.idPerson) OVER() AS total_registros
                       FROM sessions s
                        LEFT JOIN person p on s.idPerson = p.idPerson
                       order by s.dateSession desc
                       OFFSET ${page} ROWS
                        FETCH FIRST 10 ROWS ONLY`
        executeStatement(query).then(
            result => {
                resolve(result.recordset)
            }
        ).catch(err => {
            reject(err)
        })
    })
}

const sessionsModel = {
    getAvailableSessionsDates: getAvailableSessionsDates,
    getHoursForDateSession: getHoursForDateSession,
    registerSession: registerSession,
    createHours: createHours,
    getHoursCreates: getHoursCreates,
    getScheduledSessions: getScheduledSessions,
    updateStateSession: updateStateSession,
    getHistorySession: getHistorySession,
}

module.exports = sessionsModel;