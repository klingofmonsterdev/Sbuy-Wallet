import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, Image, Text, AsyncStorage } from 'react-native';
import { Container, Header, Content, Icon } from 'native-base';

import PINCode from '@haskkor/react-native-pincode';
import { Actions } from 'react-native-router-flux';

const { height, width } = Dimensions.get('screen');
export default class Pincode extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    
    render() {
        return (
            <View style={styles.viewMain}>

                <PINCode
                    titleComponent={() => {
                        return (
                            <View style={{ backgroundColor: '#58A3EA', width: width, height: height * 0.3 }}>
                                <Image source={require('../../assets/logo_light.png')} resizeMode="contain" style={styles.imageLogo} />
                                <Text style={{ fontSize: 16, color: "#FFFFFF", alignSelf: 'center' }}>Set your PIN - 4 digits</Text>
                            </View>
                        )
                    }}

                    status={'choose'}

                    storePin={(pin) => {
                        dataSet = {
                            "passcode": pin,
                        }

                        AsyncStorage.setItem('passcode', JSON.stringify(dataSet))
                            .then((res) => {
                                Actions.Home();
                            })
                            .catch((error) => {
                                console.log('================= Login again error ===================');
                                console.log(error);
                                console.log('====================================');
                            });
                    }}//choose

                    //Style
                    styleMainContainer={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}//พื้นหลังของทั้งหมด
                    stylePinCodeButtonCircle={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 16 * 4,
                        height: 16 * 4,
                        backgroundColor: 'rgba(250,250,250 ,1)',
                        borderRadius: 16 * 2,
                        margin: 10,
                        borderColor: "rgba(119, 119, 119,0.3)",
                        borderWidth: 1
                    }}//พื้นของปุ่มกด
                    stylePinCodeColorTitle="#FFFFFF"//สีของหัวข้อ
                    colorPassword="#32BEDE"//สีของ จุดๆ พาสเวิด
                    stylePinCodeButtonNumber="#777777"//สีตัวเลขปุ่มกด
                    stylePinCodeMainContainer={{
                        flex: 1, alignItems: 'center', height: 40
                    }}//styleMain
                    stylePinCodeRowButtons={{
                        justifyContent: 'center', alignItems: 'center', width: '100%', height: 16 * 5.5
                    }}//style ของพื้นหลังของปุ่มตัวเลข
                    stylePinCodeTextButtonCircle={{
                        fontSize: 16 * 2, fontWeight: '200'
                    }}//style ของ text ในปุ่มวงกลม
                    stylePinCodeTextSubtitle={{
                        fontSize: 5, fontWeight: '200', lineHeight: 0
                    }}//style ของ text title
                    stylePinCodeHiddenPasswordCircle={{
                        flexDirection: 'row', width: width, height: height * 0.06, justifyContent: 'center', alignItems: 'center', marginTop: -(height * 0.03)
                    }}//style พื้นหลังของ จุดพาสเวิด
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    viewMain: {
        flex: 1
    },
    imageLogo: {
        width: width * 0.4,
        height: height * 0.2,
        alignSelf: 'center',
        marginTop: 20
    },
});