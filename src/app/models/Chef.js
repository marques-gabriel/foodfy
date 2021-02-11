const Base = require('./Base')
const db = require('../../config/db')
const fs = require('fs')

Base.init({ table: 'chefs' })


module.exports = {
    
    ...Base,

    async all() {

        try {

            let results = await db.query(`
                SELECT chefs.*, count(recipes) AS total_recipes
                FROM chefs
                LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
                GROUP BY chefs.id`
            )
         
            return results.rows

        } catch(err) {
            console.log(err)
        }
    },

    find(id) {

        try {

            return db.query(`
            SELECT chefs.*, count(recipes) AS total_recipes
            FROM chefs
            LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
            WHERE chefs.id = $1
            GROUP BY chefs.id`, [id])

        } catch (error) {
            console.error(error)
        }
        
    },

    files(id) {

        try {
            return db.query(`
            SELECT files.*, chefs
            FROM files
            LEFT JOIN chefs ON (files.id = chefs.file_id)
            WHERE chefs.file_id = $1
        `, [id])

        } catch(err) {
            console.log(err)
        }
        
    },

    findRecipes(id) {

        try {

            return db.query(`
                SELECT recipes.*, chefs.name AS chef_name
                FROM recipes
                LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
                WHERE recipes.chef_id = $1`, [id])
            
        } catch (error) {
            console.error(error)
        }

    },

    async delete(id, files) {

        try {

            await db.query(`DELETE FROM chefs WHERE id = $1`, [id])
        
            files.map(async file => {
                fs.unlinkSync(file.path)


                await db.query(`
                    DELETE FROM files
                WHERE id = $1
                `, [file.id])

            })
            
            return 

        } catch(err) {
            console.log(err)
        }

    }
}