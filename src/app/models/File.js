const db = require('../../config/db')
const fs = require('fs')

module.exports = {
    create(data) {

        try {
            const query = `
                INSERT INTO files (
                    name,
                    path
                ) VALUES ($1, $2)
                RETURNING id
            `
            const values = [
                data.filename,
                data.path
            ]
        
            return db.query(query, values)

        } catch(err) {
            console.log(err)
        }
    
    },

    async delete(id) {

        try {

            const result = await db.query(`SELECT * FROM files WHERE id = $1`, [id])
            const file = result.rows[0]
            fs.unlinkSync(file.path)

            
            return db.query(`
            DELETE FROM files WHERE id = $1
            `, [id])
            
        }catch(err) {
            console.error(err)
        }

    }
}