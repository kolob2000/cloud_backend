import db from "./db.js";
// import path from "node:path";
import path from "node:path/posix";
import CyrillicToTranslit from 'cyrillic-to-translit-js';

const cyrillicToTranslit = new CyrillicToTranslit()

class FileQuery {
    async getAll(id) {
        try {
            return await db.query(`SELECT *
                                   FROM files
                                   WHERE user_id = ${id};`)
        } catch (e) {
            console.log(e.message)
        }
    }

    async getOne(id) {
        try {
            return (await db.query(`SELECT *
                                    FROM files
                                    WHERE id = ${id}`)).rows[0]
        } catch (e) {
            console.log(e.message)
        }
    }

    async getPathById(id) {
        try {
            return (await this.getOne(id)).file_path
        } catch (e) {
            console.log(e.message)
        }
    }


    async addOne(fileName, parentPath, parentId, userID = 2,
                 fileEntity = 'FOLDER', fileType = '',
                 fileSize = 0) {


        return await db.query(`INSERT INTO files(file_name, file_entity, file_type, file_path, size, parent_id, user_id)
                               VALUES ('${fileName}', '${fileEntity}', '${fileType}',
                                       '${path.join(parentPath,
                                               cyrillicToTranslit.transform(fileName, '_').toLowerCase()
                                       )}',
                                       ${fileSize}, ${parentId}, ${userID})
                               RETURNING id;`)

    }

    async deleteFile(files) {
        try {
            return await db.query(`DELETE
                                   FROM files
                                   WHERE id IN (${files.join(', ')})
                                   RETURNING id;`)
        } catch (e) {
            console.log(e.message)
        }
    }
}


export default new FileQuery()