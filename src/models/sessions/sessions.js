const {executeStatement} = require("../../db/db");
getAvailableSessionsDates = () => {
    return new Promise( (resolve, reject) =>{
        const query = `SELECT dateSession from sessions
                        WHERE state = ${1}
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

const sessionsModel = {
    getAvailableSessionsDates: getAvailableSessionsDates,
    getHoursForDateSession: getHoursForDateSession,
}

module.exports = sessionsModel;