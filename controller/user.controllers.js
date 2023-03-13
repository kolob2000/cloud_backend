import bcrypt from 'bcrypt'
import uq from '../models/UserQuery.js'
import jwt from 'jsonwebtoken'

const regMail = /(\w+\.?|-?\w+?)+@\w+\.?-?\w+?(\.\w{2,3})+/
const regPass = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){6,16}$/


class UserControllers {

    async getUser(req, res) {
        const users = await uq.getAll()
        res.status(200).json(users)
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
        const {email, password} = req.body
        try {
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

                        });

                } else {
                    res.status(401).json({message: 'Неверный пароль.'})
                }
            } else {
                res.status(404).json({message: 'Пользователь не существует.'})

            }
        } catch (e) {
            console.log(e.message)
        }
    }

    async signUp(req, res) {
        try {
            const {email, password} = req.body
            const candidate = await uq.getOne({email})
            if (candidate) {
                res.status(409).json({message: 'Пользователь существует.'})
            } else {
                if (regMail.test(email)) {
                    if (regPass.test(password)) {
                        const salt = 9
                        const hash = bcrypt.hashSync(password, salt)
                        const result = await uq.addOne({email, password: hash})
                        res.status(201).json({message: 'Пользователь создан.'})
                    } else {
                        res.status(400).json({
                            message: 'Неверный пароль.',
                            description: 'пароль должен включать одну цифру (0-9)\n' +
                                '1 букву в верхнем регистре\n' +
                                '1 букву в нижнем регистре\n' +
                                'один не алфавитный символ\n' +
                                'длина от должна быть от 6 до 16 символов'
                        })
                    }
                } else {
                    res.status(400).json({
                        message: 'Неверный формат электронной почты.',
                    })
                }

            }
        } catch (e) {
            console.log(e.message)
        }


    }

    async editUser(req, res) {
        console.log('im in patch')
        res.status(200).json({message: 'ok'})
    }

    async deleteUser(req, res) {
        const {id} = req.params
        try {
            const result = await uq.deleteOne({id})
            res.status(200).json({message: 'ok', ...result})
        } catch (e) {
            res.status(204).json(e)
        }
    }
}

export default new UserControllers()