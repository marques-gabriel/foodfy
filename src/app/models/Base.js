const db =  require('../../config/db')

const Base = {
    init({ table }) {
        if(!table) throw new Error('Invalid Params')

        this.table = table

        return this
    },

    async create(fields) {
        try {

            let keys = [],
                values = []

            Object.keys(fields).map(key => { 
                keys.push(key)
                values.push(`'${fields[key]}'`)

            })

            const query =  `INSERT INTO ${this.table} (${keys.join(',')})
                VALUES (${values.join(',')})
                RETURNING id
            `
            
            const results = await db.query(query)
            return results.rows[0].id

        } catch (error) {
            console.error(error)
        }
    },

    update(id, fields) {

        try {

            let update = []

            Object.keys(fields).map(key => {

                const line = `${key} = '${fields[key]}'`
                update.push(line)

            })
    
            let query =  `UPDATE ${this.table} SET
            ${update.join(',')} WHERE id = ${id}
            `
    
            return db.query(query)
            


        } catch (error) {
            console.error(erro)
        }

        
    }

}

module.exports = Base