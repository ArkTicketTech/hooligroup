const Utils = {
    includesKeyValueInArray: (key, value, arr) => {
        let isInclude = false
        arr.forEach(element => {
            if (element[key] === element) {
                isInclude = true
            }
        });
        return isInclude
    }
}

export default Utils