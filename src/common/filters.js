import moment from 'moment'

const Filters = {
    formatDate: (value) => {
        if (value) {
            return moment(String(value)).format('YYYY/MM/DD hh:mm')
        }
    }
}

export default Filters