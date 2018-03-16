import moment from 'moment'

const Filters = {
    formatDate: (time) => {
        if (time) {
            return moment(String(time)).format('YYYY/MM/DD hh:mm')
        }
    },
    formatDateDiff: (time) => {
        if (time) {
            return moment(String(time)).from(new Date())
        }
    }
}

export default Filters