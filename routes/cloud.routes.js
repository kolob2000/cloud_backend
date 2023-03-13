import {Router} from "express";
import CloudController from "../controller/cloud.controller.js";
import passport from "passport";

const router = new Router()

router.get('/cloud',
    passport.authenticate('jwt', {session: false}),
    CloudController.getAllFiles)
router.get('/cloud/:id',
    passport.authenticate('jwt', {session: false}),
    CloudController.getOneFile)
router.post('/cloud',
    passport.authenticate('jwt', {session: false}),
    CloudController.createFolder)
router.post('/cloud/upload',
    passport.authenticate('jwt', {session: false}),
    CloudController.uploadFile)
router.patch('/cloud/:id',
    passport.authenticate('jwt', {session: false}),
    CloudController.updateFile)
router.delete('/cloud',
    passport.authenticate('jwt', {session: false}),
    CloudController.deleteFile)


export default router