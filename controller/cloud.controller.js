import db from '../models/db.js'
import fq from '../models/FileQuery.js'
import path from 'node:path'
import fs from 'node:fs'


const __dirname = path.resolve()
const __basename = path.basename(__dirname)

class CloudController {
    async getAllFiles(req, res) {
        try {
            const query = await fq.getAll()
            res.status(200).json(query.rows)
        } catch (e) {

            res.status(204).json('Ошибка 204. Нет содержимого.')
        }
    }

    async getOneFile(req, res) {
        console.log('im in getOne')
        res.download('files/icon.svg', 'halambalam.svg')
        // res.status(200).json('helloOne')
    }

    async createFolder(req, res) {
        const {parent, name} = req.body
        try {
            let parentPath = ''

            if (parent) {
                parentPath = await fq.getParentPath(parent)
            }
            await fq.addOne(name, parentPath, parent)

            fs.mkdir(path.join('files', parentPath, name), {recursive: true}, err => {
                if (err) throw err;
                console.log('Success created')
            })
            res.status(201).json('helloPost')
        } catch (e) {
            res.status(204).json(`Ошибка. ${e.message}.`)

        }

    }

    async uploadFile(req, res) {
        const file = req.files.file
        file.mv(`files/${file.name}`, err => {
            if (err) throw err
            res.status(201).json('Success!')
        })


    }

    async updateFile(req, res) {
        res.status(200).json('helloUpdate')
    }

    async deleteFile(req, res) {
        const id = req.params.id
        try {
            const file_path = await fq.getPathById(id)
            console.log()
            fs.rm(path.join('files', file_path), {recursive: true, force: true}, err => {
                if (err) throw err
            })
            const query = await fq.deleteOneFile(id)
            console.log(query)
            res.status(200).json(`Файл успешно удален.`)
        } catch (e) {
            console.log(e)
            res.status(204).json(`Ошибка . ${e.message}.`)
        }
    }
}

export default new CloudController()