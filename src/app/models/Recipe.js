const db =  require('../../config/db')
const { date } = require ('../../lib/utils.js') 
const fs = require('fs')

module.exports = {
    all(callback) {
        db.query(`SELECT recipes.*, chefs.name AS chef_name
         FROM recipes
         LEFT JOIN chefs ON (recipes.chef_id = chefs.id)`, function(err, results) {
            if (err) throw `DATABASE ERRO ${err}`
            callback(results.rows)
        })
    },

    create(data) {
        const query = `
            INSERT INTO recipes (
                chef_id,
                title,
                ingredients,
                preparation,
                information,
                created_at
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
        `

        const values = [
            data.chef,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            date(Date.now()).iso
        ]

        return db.query(query, values)


    },

    find(id) {
        return db.query(`
            SELECT recipes.*, chefs.name AS chef_name
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE recipes.id = $1`, [id])
    },

    findBy(filter, callback) {

            db.query(`
                SELECT recipes.*, chefs.name AS chef_name
                FROM recipes
                LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
                WHERE recipes.title ILIKE '%${filter}%'
            `, function(err, results){

                if(err) throw `Database Error!!! ${err}`
            
            callback(results.rows)
        })
    },

    files(id) {
        return db.query(`
            SELECT files.*, recipe_id, file_id
            FROM files
            LEFT JOIN recipe_files ON (files.id = recipe_files.file_id)
            WHERE recipe_files.recipe_id = $1
        `, [id])
    },


    update(data) {
        const query = `
            UPDATE recipes SET
            chef_id=($1),
            title=($2),
            ingredients=($3),
            preparation=($4),
            information=($5)
        WHERE id = $6
        `

        const values = [
            data.chef,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            data.id
        ]

        return db.query(query, values)

    },

    async delete(id) {

        let results = await db.query(`
            SELECT files.*, recipe_id, file_id
            FROM files
            LEFT JOIN recipe_files ON (files.id = recipe_files.file_id)
            WHERE recipe_files.recipe_id = $1
        `, [id])

        const files = results.rows

        files.map(async file => {
            fs.unlinkSync(file.path)

            await db.query(`
                DELETE FROM recipe_files WHERE file_id = $1
            `, [file.id])

            await db.query(`
                DELETE FROM files
              WHERE id = $1
            `, [file.id])

        })
        await db.query(`DELETE FROM recipes WHERE id = $1`, [id])
        
       return 
    },

    chefsSelectOptions() {
        return db.query(`SELECT name, id FROM chefs`)
    },

    async paginate(params) {
        const { filter, limit, offset } = params



        let query= "",
            filterQuery = "",
            totalQuery = `(
                SELECT count(*) FROM recipes
            ) AS total`


        if (filter) {
            filterQuery = `
            WHERE recipes.title ILIKE '%${filter}%'
            `
            totalQuery = `(
                SELECT count(*) FROM recipes
                ${filterQuery}
            ) AS total`
        }

        query = `SELECT recipes.*, ${totalQuery}, chefs.name AS chef_name
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        ${filterQuery}
        LIMIT $1 OFFSET $2
        `
        let results = await db.query(query, [limit, offset])
        
        return results.rows
            
            
        //     , function(err, results) {
        //     if (results.rows[0]) {
        //         if (err) throw `DATABASE ERRO ${err}`
        //         callback(results.rows)
        //     } else {
        //         if (err) throw `DATABASE ERRO ${err}`
        //         callback()
        //     }
        // })
    }
}