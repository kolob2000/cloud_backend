import * as dotenv from 'dotenv'

dotenv.config()
import bcrypt from 'bcrypt'
import uq from '../models/UserQuery.js'
import vq from '../models/VerifyQuery.js'
import jwt from 'jsonwebtoken'
import {mailer} from "../middleware/mailer.js";
import {confirmLetter} from "../middleware/letters.js";

const regMail = /(\w+\.?|-?\w+?)+@\w+\.?-?\w+?(\.\w{2,3})+/
const regPass = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){6,16}$/


class UserControllers {
    async emailVerify(req, res) {
        try {
            const {token} = req.body
            jwt.verify(token, process.env.PRIVATE_JWT_VERIFY, {}, async (err, decoded) => {
                if (err) {
                    if (err.message === 'jwt expired') {
                        try {
                            const decoded = jwt.decode(token)
                            const result = await vq.getOneByUId(decoded.id)
                            if (result.email === result.email) {
                                jwt.sign({
                                        id: decoded.id,
                                        email: decoded.email
                                    }, process.env.PRIVATE_JWT_VERIFY, {algorithm: 'HS256', expiresIn: 60 * 60 * 24},
                                    async function (err, token) {
                                        if (err) throw err
                                        const link = `https://cloudhit.ru/auth/verify?token=${token}`
                                        await mailer(decoded.email, 'Регистрация',
                                            confirmLetter(decoded.email, decoded.email, link))
                                        res.status(410).json('link expired')
                                    })
                            } else {
                                res.status(404).json('invalid token')
                            }
                        } catch {
                            res.status(500).json('Server error')
                        }
                    } else {
                        res.status(404).json('invalid token')
                    }
                } else {
                    const {email, id} = decoded
                    const result = await vq.getOneByUId(id)
                    if (result && result.email === email) {
                        await uq.setActive(id)
                        await vq.deleteOne(id)
                        res.status(200).json('Success')
                    } else {
                        res.status(404).json('invalid token')
                    }
                }

            })

        } catch (e) {
            console.log(e)
        }
    }

    async repeatEmail(req, res) {
        try {
            const {email, id} = await req.user
            jwt.sign({
                    id: id,
                    email: email
                }, process.env.PRIVATE_JWT_VERIFY, {algorithm: 'HS256', expiresIn: 60 * 60 * 24 * 7},
                async function (err, token) {
                    if (err) {
                        res.status(500).json('Server error')
                    } else {
                        const link = `https://cloudhit.ru/auth/verify?token=${token}`
                        await mailer(email, 'Регистрация',
                            confirmLetter(email, email, link))
                        res.status(200).json('Success')
                    }
                })
        } catch (e) {
            console.log(e)
        }

    }

    async getUser(req, res) {
        try {
            // const users = await uq.getAll()
            res.status(200).json('in development')

        } catch (e) {
            res.status(500).json('server error')

        }

    }

    async auth(req, res) {
        try {
            const {id} = await req.user
            const user = await uq.getOne({id})
            res.status(200).json(
                {
                    ...(({password, ...rest}) => rest)(user),
                })
        } catch (e) {
            res.status(204).json(e)
        }
    }

    async signIn(req, res) {
        try {
            const {email, password} = req.body
            const user = await uq.getOne({email})
            if (user) {
                if (bcrypt.compareSync(password, user.password)) {

                    jwt.sign({
                            id: user.id,
                            email: user.email
                        }, process.env.PRIVATE_JWT_KEY, {algorithm: 'HS256', expiresIn: 60 * 60 * 24},
                        async function (err, token) {
                            if (err) throw err
                            res.status(200).json(
                                {
                                    ...(({password, ...rest}) => rest)(user),
                                    token: `Bearer ${token}`
                                })

                        })

                } else {
                    res.status(401).json({message: 'Неверный пароль.'})
                }
            } else {
                res.status(404).json({message: 'Пользователь не существует.'})

            }
        } catch (e) {
            res.status(500).json('server error')
        }
    }

    async signUp(req, res) {
        console.log('im in signup method')
        try {
            const {email, password} = req.body
            console.log(email, password)
            const candidate = await uq.getOne({email})
            if (candidate) {
                res.status(409).json({message: 'Пользователь существует.'})
            } else {
                if (regMail.test(email)) {
                    if (regPass.test(password)) {
                        const salt = 9
                        const hash = bcrypt.hashSync(password, salt)
                        const {id} = await uq.addOne({email, password: hash})
                        jwt.sign({
                                id: id,
                                email: email
                            }, process.env.PRIVATE_JWT_VERIFY, {algorithm: 'HS256', expiresIn: 25},
                            async function (err, token) {
                                if (err) throw err
                                const link = `https://cloudhit.ru/auth/verify?token=${token}`
                                await vq.addOne(id, email)
                                await mailer(email, 'Регистрация', confirmLetter(email, email, link))
                                res.status(201).json({message: 'Пользователь создан.'})
                            })
                    } else {
                        res.status(400).json({
                            message: 'Некорректный пароль.',
                            description: 'пароль должен включать одну цифру (0-9)\n' +
                                '1 букву в верхнем регистре\n' +
                                '1 букву в нижнем регистре\n' +
                                'один не алфавитный символ\n' +
                                'длина от должна быть от 6 до 16 символов'
                        })
                    }
                } else {
                    res.status(400).json({
                        message: 'Некорректная почта.',
                    })
                }

            }
        } catch (e) {
            res.status(500).json('server error')
        }


    }

    async editUser(req, res) {
        try {
            res.status(200).json('in development')
        } catch (e) {
            res.status(500).json('server error')
        }

    }

    async deleteUser(req, res) {
        try {
            const {id} = req.params
            const result = await uq.deleteOne({id})
            res.status(200).json({message: 'ok', ...result})
        } catch (e) {
            res.status(204).json(e)
        }
    }
}

export default new UserControllers()