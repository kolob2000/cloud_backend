import db from './db.js'

class VerifyQuery {
    async addOne(userId, email, link) {
        try {
            await db.query(
                `INSERT INTO verification (user_id,
                                           email)
                 values (${userId}, '${email}');`
            )
        } catch (e) {
            console.log(e)
        }
    }

    async getOneByUId(userId) {
        try {
            return (await db.query(`
                SELECT *
                FROM verification
                WHERE user_id = ${userId};
            `)).rows[0]
        } catch (e) {
            console.log(e)
        }

    }

    async deleteOne(userId) {
        try {
            await db.query(`
                DELETE
                FROM verification
                WHERE user_id = ${userId};
            `)
            return true
        } catch (e) {
            console.log(e)
            return false
        }

    }
}

export default new VerifyQuery()