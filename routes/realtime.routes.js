import {Router} from "express"
import * as events from "events"
import RealtimeController from "../controller/realtime.controller.js";

export const emitter = new events.EventEmitter()

const router = new Router()

router.get('/realtime/files', RealtimeController.updateFiles)

export default router;