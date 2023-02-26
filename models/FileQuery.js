import db from "./db.js";
import path from "node:path";

class FileQuery {
    async getAll() {
        try {
            return await db.query(`SELECT *
                                   FROM files;`)
        } catch (e) {
            console.log(e.message)
        }
    }

    async getOne(id) {
        try {
            return (await db.query(`SELECT *
                                    FROM files
                                    WHERE id = ${id}`))
        } catch (e) {
            console.log(e.message)
        }
    }

    async getPathById(id) {
        try {
            return (await this.getOne(id)).rows[0].file_path
        } catch (e) {
            console.log(e.message)
        }
    }

    async getParentPath(id) {
        try {
            const query = await this.getOne(id)
            return query.rows[0].file_path
        } catch (e) {
            console.log(e.message)
        }
    }

    async addOne(fileName, parentPath, parentId,
                 fileEntity = 'FOLDER', fileType = '',
                 fileSize = 0) {
                    console.log('in addOne')


        return await db.query(`INSERT INTO files(file_name, file_entity, file_path, parent_id)
                               VALUES ('${fileName}', '${fileEntity}',
                                       '${path.join(parentPath, fileName)}',
                                       ${parentId})
                               RETURNING id;`)
    }

    async deleteOneFile(id) {
        try {
            return await db.query(`DELETE
                                   FROM files
                                   WHERE id = ${id}`)
        } catch (e) {
            console.log(e.message)
        }
    }
}


export default new FileQuery()