import { AsyncStorage } from "react-native";

class Database {

    //========== Get data ==========
    static getUserAuth(callback) {
        AsyncStorage.getItem('user', (error, result) => {
            if (result !== null) {
                callback(JSON.parse(result));
            } else {
                callback(null);
            }
        });
    }

    static getCrypto(callback) {
        AsyncStorage.getItem('crypto', (error, result) => {
            if (result !== null) {
                callback(JSON.parse(result));
            } else {
                callback(null);
            }
        });
    }
    
    //========== Set data ==========
    static setUserAuth(userProfile, callback) {
        this.clear.bind(this)
        AsyncStorage.setItem('user', JSON.stringify(userProfile), (error) => {
            callback(error);
        });
    }

    static setCrypto(data, callback) {
        this.clear.bind(this)
        AsyncStorage.setItem('crypto', JSON.stringify(data), (error) => {
            callback(error);
        });
    }

    //========== Other data ==========
    static isUserAuth(callback) {
        AsyncStorage.getItem('user', (error, result) => {
            callback(result !== null);
        });
    }

    static clear(callback) {
        AsyncStorage.removeItem('user', (error) => {
            callback(error);
        });
    }

}
export default Database;