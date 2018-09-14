import axios from 'axios';
import { Alert } from 'react-native';

export const connectApi = (URL, method, parameter, headers) => {
    return axios({
        method: method,
        url: URL,
        data: parameter,
        headers: headers
    })
        .then((response) => response.data)
        .then((responseData) => {
            return responseData
        })
        .catch((error) => {
            return {
                status: "error"
                , message: error
            };
        });
}

export const alertOops = (title, message, onpress) => {
    Alert.alert(
        title,
        message,
        [
            { text: 'OK', onPress: () => onpress },
        ],
        { cancelable: false }
    )
}