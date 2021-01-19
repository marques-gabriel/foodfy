const db =  require('../../config/db')
const { date } = require ('../../lib/utils.js') 
const fs = require('fs')

module.exports = {
    all(callback) {
        db.query(`SELECT chefs.*, count(recipes) AS total_recipes
         FROM chefs
         LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
         GROUP BY chefs.id`, function(err, results) {
            if (err) throw `DATABASE ERRO ${err}`
            callback(results.rows)
        })
    },

    create(data) {
        const query = `
            INSERT INTO chefs (
                name,
                created_at,
                file_id
            ) VALUES ($1, $2, $3)
            RETURNING id
        `

        const values = [
            data.name,
            date(Date.now()).iso,
            data.file_id
        ]

        return db.query(query, values)


    },

    find(id) {
        return db.query(`
            SELECT chefs.*, count(recipes) AS total_recipes
            FROM chefs
            LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
            WHERE chefs.id = $1
            GROUP BY chefs.id`, [id])
    },

    files(id) {
        return db.query(`
            SELECT files.*, chefs
            FROM files
            LEFT JOIN chefs ON (files.id = chefs.file_id)
            WHERE chefs.file_id = $1
        `, [id])
    },

    findRecipes(id) {
           return db.query(`
                SELECT recipes.*, chefs.name AS chef_name
                FROM recipes
                LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
                WHERE recipes.chef_id = $1`, [id])
    },

    update(data) {
        const query = `
            UPDATE chefs SET
            name=($1),
            file_id=($2)

        WHERE id = $3
        `

        const values = [
            data.name,
            data.file_id,
            data.id
        ]

        return db.query(query, values)
    },

    async delete(id, files) {

        // let results = await db.query(`
        //     SELECT files.*, chefs
        //     FROM files
        //     LEFT JOIN chefs ON (files.id = chefs.file_id)
        //     WHERE chefs.file_id = $1
        // `, [id])
        
        
        // const files = results.rows

        await db.query(`DELETE FROM chefs WHERE id = $1`, [id])
        
        files.map(async file => {
            fs.unlinkSync(file.path)


            await db.query(`
                DELETE FROM files
              WHERE id = $1
            `, [file.id])

        })
        
       return 

    }
}