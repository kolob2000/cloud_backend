import db from './db.js'

class UserQuery {
    async getAll() {
        try {
            return (await db.query(
                `SELECT *
                 FROM users;`
            )).rows
        } catch (e) {
            console.log(e)
        }
    }

    async getOne(user = {id: null, email: null}) {
        try {
            const {id, email} = user
            if (id) {
                return (await db.query(
                    `SELECT id,
                            uuid,
                            email,
                            disk_quota,
                            is_active,
                            password
                     FROM users
                     WHERE id = ${id};`
                )).rows[0]
            } else if (email) {
                return (await db.query(
                    `SELECT id,
                            uuid,
                            email,
                            disk_quota,
                            is_active,
                            password
                     FROM users
                     WHERE email = '${email}';`
                )).rows[0]
            }
        } catch (e) {
            console.log(e.message)
        }

    }

    async addOne(user = {}) {
        try {
            return (await db.query(
                `INSERT INTO users (email, password)
                 VALUES ('${user.email}',
                         '${user.password}')
                 RETURNING id, email`
            )).rows[0]
        } catch (e) {
            console.log(e.message)
        }

    }

    async updateOne(user = {}) {
        // return (await db.query(
        //     `UPDATE users
        //      where id = ${user.id}
        //      RETURNING id, email;`
        // )).rows[0]
    }

    async setActive(userId) {
        try {
            await db.query(
                `
                    UPDATE "users"
                    SET is_active = true
                    where id = ${userId};
                `
            )
        } catch (e) {
            console.log(e)
            return false
        }
    }

    async deleteOne({id}) {
        try {
            return (await db.query(
                `DELETE
                 FROM users
                 where id = ${id}
                 RETURNING id, email;`
            )).rows[0]
        } catch (e) {
            console.log(e.message)
        }
    }


}

export default new UserQuery()