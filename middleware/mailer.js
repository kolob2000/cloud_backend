import nodemailer from 'nodemailer'

export async function mailer(email, subject, letter) {
    try {
        let transporter = nodemailer.createTransport({
            host: 'smtp.mail.ru',
            port: 465,
            secure: true,
            auth: {
                user: 'cloudhit',
                pass: 'qait9h1uNLyJXssnp5CB'
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

