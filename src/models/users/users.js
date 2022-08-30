const {executeStatement} = require("../../db/db");

getPatientById = (id) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM patients
                        WHERE idPatient = ${id}`;
        executeStatement(query).then(
            result => {
                resolve(result.recordset)
            }
        ).catch(err => {
            reject(err)
        })
    })
}

registerPatient = (info, idPerson) => {
    return new Promise((resolve, reject) => {
        const query = `insert into patients 
                        (name, lastName, birthday, genere, 
                         reasonConsultarion, diagnostic, 
                         currentCare, idPerson, rut)
                       values ('${info.name}', '${info.lastname}', '${info.birthday}',
                               ${info.genere}, '${info.reasonConsultation}',
                               '${info.diagnostics}', '${info.currentCare}',
                               ${idPerson}, '${info.rut}')`;

        console.log('query ', query);

        executeStatement(query).then(
            result => {
                resolve(result.recordset)
            }
        ).catch(err => {
            reject(err)
        })
    })
}

getPatientsByIdPerson = (idPerson) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT *
                       FROM patients
                       where idPerson = ${idPerson}`;
        executeStatement(query).then(
            result => {
                resolve(result.recordset)
            }
        ).catch(err => {
            reject(err)
        })
    })
}

verifyUserRut = (rut, id) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT *
                       FROM patients
                       where idPerson = ${id}
                       and rut = '${rut}'`;
        executeStatement(query).then(
            result => {
                resolve(result.recordset)
            }
        ).catch(err => {
            reject(err)
        })
    })
}

const usersModel = {
    getPatientById: getPatientById,
    registerPatient: registerPatient,
    getPatientsByIdPerson: getPatientsByIdPerson,
    verifyUserRut: verifyUserRut
}

module.exports = usersModel