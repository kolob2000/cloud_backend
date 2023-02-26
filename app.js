import * as dotenv from 'dotenv'

dotenv.config()
import express from 'express'
import bodyParser from 'body-parser'
import cloudRouter from "./routes/cloud.routes.js"
import cors from "cors"
import fileUpload from 'express-fileupload'
import process from "node:process";


const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}


const PORT = 3002
const app = express()
app.use(cors(corsOptions))
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(fileUpload({}))
app.use('/api', cloudRouter)

app.get('/', (req, res) => {
    res.status(200).json('hello')
})

app.listen(PORT, () => {
    console.log(`Server running on ${PORT} port...`)
})
