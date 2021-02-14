const Base = require('./Base')
const db = require('../../config/db')
const fs = require('fs')

Base.init({ table: 'recipes' })

module.exports = {

    ...Base,

    async all() {

        try {

           let results = await db.query(`
                SELECT recipes.*, chefs.name AS chef_name
                FROM recipes
                LEFT JOIN chefs ON (recipes.chef_id = chefs.id)`
            )

            return results.rows

        } catch (error) {
            console.error(error)
        }
        
    },

    find(id) {

        try {

            return db.query(`
            SELECT recipes.*, chefs.name AS chef_name
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE recipes.id = $1`, [id])

        } catch (error) {
            console.error(error)
        }
        
    },

    findBy(filter, callback) {

            try {

                db.query(`
                SELECT recipes.*, chefs.name AS chef_name
                FROM recipes
                LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
                WHERE recipes.title ILIKE '%${filter}%'
            `, function(err, results){

                if(err) throw `Database Error!!! ${err}`
            
                callback(results.rows)
        })
            } catch (error) {
                console.error(error)
            }

    },

    async findRecipesByUsers(id) {

        try {

            let results = await db.query(`
                SELECT recipes.*, chefs.name AS chef_name
                FROM recipes
                LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
                WHERE recipes.user_id = $1`, [id])

                return results.rows
            
        } catch (error) {
            console.error(error)
        }

    },

    files(id) {

        try {

            return db.query(`
            SELECT files.*, recipe_id, file_id
            FROM files
            LEFT JOIN recipe_files ON (files.id = recipe_files.file_id)
            WHERE recipe_files.recipe_id = $1
        `, [id])

        } catch(err) {
            console.log(err)
        }
    },
    
    async delete(id) {

        try {

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

        } catch(err) {
            console.log(err)
        }
        
    },

    chefsSelectOptions() {
        return db.query(`SELECT name, id FROM chefs`)
    },

    async paginate(params) {

        try {

            const { filter, limit, offset } = params



            let query= "",
                filterQuery = "",
                order="",
                totalQuery = `(
                    SELECT count(*) FROM recipes
                ) AS total`


            if (filter) {
                filterQuery = `
                WHERE recipes.title ILIKE '%${filter}%'
                `
                order = `
                    ORDER BY updated_at DESC
                `
                totalQuery = `(
                    SELECT count(*) FROM recipes
                    ${filterQuery}
                ) AS total`
                
            } else {

                order = `
                    ORDER BY created_at DESC
                `
            }


            query = `SELECT recipes.*, ${totalQuery}, chefs.name AS chef_name
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            ${filterQuery}
            ${order}
            LIMIT $1 OFFSET $2
            `
            let results = await db.query(query, [limit, offset])
            
            return results.rows

        } catch(err) {
            console.log(err)
        }
            
            
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