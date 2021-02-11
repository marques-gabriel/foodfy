const db = require('../../config/db')
const Base = require('./Base')

Base.init({ table: 'recipe_files' })

module.exports = {
    
    ...Base,

    async delete(id) {

        try {
            return db.query(`
            DELETE FROM recipe_files WHERE file_id = $1
        `, [id])

        }catch(err) {
            console.error(err)
        }

    }
}