import fq from '../models/FileQuery.js'
import pkg from 'iconv-lite'
// import path from 'node:path'
import path from 'node:path/posix'
import fs from 'node:fs'
import CyrillicToTranslit from 'cyrillic-to-translit-js';

pkg.skipDecodeWarning = true;
const cyrillicToTranslit = new CyrillicToTranslit()


class CloudController {
    async getAllFiles(req, res) {
        try {
            const user = await req.user
            const query = await fq.getAll(user.id)
            res.status(200).json(query.rows)
        } catch (e) {

            res.status(204).json('Ошибка 204. Нет содержимого.')
        }
    }

    async getOneFile(req, res) {
        try {
            const {uuid, id} = (await req.user)
            const {file_name, file_path, user_id} = (await fq.getOne(req.params.id))
            if (id === user_id) {

                res.download(path.join('files', uuid, file_path), file_name)

            } else {
                res.status(403).json('Доступ запрещен!')

            }
        } catch (e) {
            res.status(204).json(`Ошибка. ${e.message}.`)
        }
    }


    async uploadFile(req, res) {
        console.log('im in upload file')
        try {
            const files = req.files
            const parent = JSON.parse(req.body.parent)
            let parentPath = ''


            if (parent) {
                parentPath = await fq.getPathById(parent)
            }
            const {id, uuid} = (await req.user)
            for (const key in files) {
                const name = pkg.decode(files[key].name, 'utf-8')
                const file_name = path.join('files', uuid, parentPath,
                    cyrillicToTranslit.transform(name, '_').toLowerCase())
                files[key].mv(file_name, err => {
                    if (err) throw err
                })
                await fq.addOne(name, parentPath, parent, id,
                    'FILE', files[key].mimetype, files[key].size)

            }
            res.status(201).json('Success!')

        } catch (e) {
            res.status(204).json(`Ошибка. ${e.message}.`)

        }


    }

    async createFolder(req, res) {
        try {
            const {parent, name} = req.body
            const {uuid, id} = (await req.user)
            let parentPath = ''

            if (parent) {
                parentPath = await fq.getPathById(parent)
                console.log(parentPath)
            }
            await fq.addOne(name, parentPath, parent, id)

            fs.mkdir(path.join('files', uuid, parentPath,
                    cyrillicToTranslit.transform(name, '_').toLowerCase()),
                {recursive: true}, err => {
                    if (err) throw err;
                })
            res.status(201).json('helloPost')
        } catch (e) {
            res.status(204).json(`Ошибка. ${e.message}.`)

        }

    }

    async updateFile(req, res) {
        res.status(200).json('helloUpdate')
    }

    async deleteFile(req, res) {
        const uuid = (await req.user).uuid
        try {
            for (const id of req.body) {
                const file_path = await fq.getPathById(id)
                fs.rm(path.join('files', uuid, file_path), {recursive: true, force: true}, err => {
                    if (err) throw err
                })
                // fs.unlink(file_path, (err) => {
                //     if (err) throw err
                // })
            }
            await fq.deleteFile(req.body)
            res.status(200).json(`Файлы успешно удалены.`)
        } catch (e) {
            res.status(204).json(`Ошибка . ${e.message}.`)
        }
    }


}

export default new CloudController()