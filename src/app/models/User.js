const Base = require('./Base')

Base.init({ table: 'users' })

module.exports = {
    ...Base,

    delete(id) {

        return db.query(`DELETE FROM users WHERE id = $1`, [id])
        
    },

    find(id) {

        try {

            return db.query(`
            SELECT users.*, count(recipes) AS total_recipes
            FROM users
            LEFT JOIN recipes ON (users.id = recipes.user_id)
            WHERE users.id = $1
            GROUP BY users.id`, [id])

        } catch (error) {
            console.error(error)
        }
        
    },
}