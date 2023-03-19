import * as dotenv from 'dotenv'
dotenv.config()
import pg from 'pg'

const {Pool} = pg
const pool = new Pool({
    user: process.env.DB_NAME,
    host: 'localhost',
    database: 'express',
    password: process.env.DB_PASSWORD,
    port: 5432
})


export default pool