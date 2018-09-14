class Validate {

    static isEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    static isEmpty(value) {
        return value === undefined || value === null || value === '';
    }

    static isNotEmpty(value) {
        return value !== undefined && value !== null && value !== '';
    }

}

export default Validate;