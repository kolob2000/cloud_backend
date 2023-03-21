import {emitter} from "../routes/realtime.routes.js";

class RealtimeController {
    async updateFiles(req, res) {

        res.writeHead(200, {
            'Connection': 'keep-alive',
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
        })
        emitter.on('updateFiles', uuid => {
            res.write(`data: ${JSON.stringify(uuid)} \n\n`)
        })
    }
}

export default new RealtimeController()