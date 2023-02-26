import pg from 'pg'

const {Pool} = pg
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'express',
    password: 'Kolob_!1983',
    port: 5432
})



export default pool