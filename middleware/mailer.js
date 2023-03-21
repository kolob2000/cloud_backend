import * as dotenv from 'dotenv'

dotenv.config()
import nodemailer from 'nodemailer'

export async function mailer(email, subject, letter) {
    try {
        let transporter = nodemailer.createTransport({
            pool: true,
            service: 'Gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.G_EMAIL_LOGIN,
                refreshToken: process.env.REFRESH_TOKEN,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET
            },
            from: '"CloudHit.ru" <cloudyhit@gmail.com>'
        })
        await transporter.sendMail({
                to: email, // list of receivers
                subject: subject, // Subject line
                html: letter,

            }
        )
    } catch (e) {
        console.log(e.message)
    }
}

