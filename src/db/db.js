const sql = require('mssql')
const {TYPES} = require("tedious");

const old = {
    authentication: {
        options: {
            userName: process.env.USERNAME_JDC, // update me
            password: process.env.PASSWORD_JDC // update me
        },
        type: "default"
    },
    server: process.env.SERVER_JDC, // update me
    options: {
        database: process.env.DATABASE_JDC, //update me
        encrypt: true,
        port: 1433
    }
};

const configDb = {
    user: process.env.USERNAME_JDC,
    password: process.env.PASSWORD_JDC,
    database: process.env.DATABASE_JDC,
    server:  process.env.SERVER_JDC,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: true, // for azure
        trustServerCertificate: false, // change to true for local dev / self-signed certs
        port: 1433
    }
}

executeStatement = async (statement) => {
    try{
        let pool = await sql.connect(configDb)
        let result = await pool.request().query(statement)
        pool.close()
        return result
    }catch(err){
        throw err
    }
}


executeProcedureRegister = async(info, password) => {
    try{
        let pool = await sql.connect(configDb)

        let result = await pool.request()
            .input('Email', sql.NVarChar, info.email)
        .input('Password', sql.NVarChar, password)
        .input('Rol', sql.Int, 1)
        .input('Name', sql.NVarChar, info.name)
        .input('Lastname', sql.NVarChar, info.lastname)
        .input('Birthday', sql.NVarChar, info.birthday)
        .input('Address', sql.NVarChar, info.address)
        .input('City', sql.NVarChar, info.city)
        .input('Health', sql.NVarChar, info.health)
        .input('Phone', sql.NVarChar, info.phone)
            .execute('CrearUsuario')
        pool.close()
        console.log('result 2', result)

        return result
    }catch(err){
        throw err
    }
}

module.exports = { executeStatement, executeProcedureRegister}