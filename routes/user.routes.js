import {Router} from 'express'
import uc from '../controller/user.controllers.js'
import passport from "passport";

const router = new Router()

router.get('/users/:id',
    passport.authenticate('jwt', {session: false}),
    uc.getUser)
router.post('/users/signup', uc.signUp)
router.post('/users/verify', uc.emailVerify)
router.post('/users/signin', uc.signIn)
router.post('/users/auth',
    passport.authenticate('jwt', {session: false}),
    uc.auth)
router.post('/users/repeat',
    passport.authenticate('jwt', {session: false}),
    uc.repeatEmail)
router.patch('/users/:id',
    passport.authenticate('jwt', {session: false}),
    uc.editUser)
router.delete('/users/:id',
    passport.authenticate('jwt', {session: false}),
    uc.deleteUser)

export default router