const {executeStatement, executeProcedureRegister} = require("../../db/db");

registerUser = (info, password) => {
    return new Promise((resolve, reject) => {
        executeProcedureRegister(info, password)
            .then(result => {
                resolve(result)
            }).catch(err => {
                reject(err)
        })
    })
}

loginUser = (email, password) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT u.id, u.idRole, u.email, p.* from [user] as u
            inner join person as p on p.idUser = u.id
                       where u.email = '${email}'
                         and u.password = '${password}'`

        executeStatement(query).then(
            result => {
                resolve(result.recordset)
            }
        ).catch(err => {
            reject(err)
        })
    })
}

checkEmailRegister = (email) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT 1 FROM [user]
                       where email = '${email}'`
        executeStatement(query).then(
            result => {
                resolve(result.recordset)
            }
        ).catch(err => {
            reject(err)
        })
    })
}

const authModel = {
    registerUser: registerUser,
    checkEmail: checkEmailRegister,
    login: loginUser,
}

module.exports = authModel;