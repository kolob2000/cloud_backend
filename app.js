import * as dotenv from 'dotenv'

dotenv.config()
import express from 'express'
import bodyParser from 'body-parser'
import cors from "cors"
import passport from 'passport'
import fileUpload from 'express-fileupload'
import cloudRouter from "./routes/cloud.routes.js"
import userRouter from './routes/user.routes.js'
import {passportStrategy} from './middleware/passport.js'


const corsOptions = {
    origin: [
        'http://192.168.0.195:3000',
        'http://localhost:3000',
        'https://www.cloudhit.ru',
        'https://cloudhit.ru',

    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
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
// app.use(express.urlencoded({extended: false}))
app.use(passport.initialize())
passportStrategy(passport)
app.use(fileUpload({}))
app.use('/api', cloudRouter)
app.use('/api', userRouter)

app.get('/', (req, res) => {
    res.status(200).json('hello')
})

app.listen(PORT, () => {
    console.log(`Server running on ${PORT} port...`)
})
