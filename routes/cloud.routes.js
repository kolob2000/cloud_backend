import {Router} from "express";
import CloudController from "../controller/cloud.controller.js";

const router = new Router()

router.get('/cloud', CloudController.getAllFiles)
router.get('/cloud/:id', CloudController.getOneFile)
router.post('/cloud', CloudController.createFolder)
router.post('/cloud/upload', CloudController.uploadFile)
router.put('/cloud/:id', CloudController.updateFile)
router.delete('/cloud/:id', CloudController.deleteFile)


export default router