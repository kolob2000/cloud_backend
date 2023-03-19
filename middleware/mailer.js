import * as dotenv from 'dotenv'
dotenv.config()
import nodemailer from 'nodemailer'

export async function mailer(email, subject, letter) {
    try {
        let transporter = nodemailer.createTransport({
            host: 'smtp.mail.ru',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_LOGIN,
                pass: process.env.EMAIL_PASSWORD
            }
        })
        let result = await transporter.sendMail({
                from: '"CloudHit.ru" <cloudhit@mail.ru>', // sender address
                to: email, // list of receivers
                subject: subject, // Subject line
                html: letter,

            }
        )
    } catch (e) {
        console.log(e.message)
    }
}

