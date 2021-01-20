module.exports = {

    date(timestamp) {
        const date = new Date(timestamp)

        // yyyy
        const year = date.getUTCFullYear()  //universal time

        // mm
        const month = `0${date.getUTCMonth() + 1}`.slice(-2)

        // dd
        const day = `0${date.getUTCDate()}`.slice(-2)

        const hour = date.getHours()
        const minutes = date.getMinutes()

        // return
        return {

            day,
            month,
            year,
            hour,
            minutes,
            iso: `${year}-${month}-${day}`,
            format: `${day}/${month}/${year} `

        }

    }

}