import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, ScrollView, Image, AsyncStorage } from 'react-native';
import { Item, Input, Icon, Button, Spinner } from 'native-base';

import LinearGradient from 'react-native-linear-gradient';
import PopupDialog from "react-native-popup-dialog";
import { Actions } from 'react-native-router-flux';
import RF from "react-native-responsive-fontsize";

import { connectApi, alertOops } from "./constants/Function";
import ConstStyle from './constants/ConstStyle';
import Validate from './common/Validate';
import Database from "./database/DbUser";
import Const from "./constants/Const";

// ========== Firebase ==========
import firebase from 'firebase';
global.Symbol = require('core-js/es6/symbol');
require('core-js/fn/symbol/iterator');
// collection fn polyfills
require('core-js/fn/map');
require('core-js/fn/set');
require('core-js/fn/array/find');
// ==============================

const Device = require('react-native-device-detection');
const { width, height } = Dimensions.get('window');

export default class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "sbuyadmin@gmail.com",
            password: "123456",

            showPass: false,
            statusView: true,
            statusSecureText: true
        }
    }

    componentWillMount() {
        const config = {
            apiKey: "AIzaSyBcFn-j1UxxG0-MoREBgEeKiDjlACYchFk",
            authDomain: "sbuywallet-ce2e7.firebaseapp.com",
            databaseURL: "https://sbuywallet-ce2e7.firebaseio.com",
            projectId: "sbuywallet-ce2e7",
            storageBucket: "sbuywallet-ce2e7.appspot.com",
            messagingSenderId: "534424828445"
        };
        firebase.initializeApp(config);
        this.firebaseDbCrypto = firebase.database().ref("sbuywallet/crypto/");
    }

    async componentDidMount() {
        await this.dialogLoading.show();

        await AsyncStorage.getItem('user')
            .then((res) => {
                console.log(res);
                if (res != null) {
                    Actions.PincodeLogin();
                }
            })
            .catch((error) => {
                console.log(error);
            });

        await this.dialogLoading.dismiss();
    }

    onLogin = async (username, password) => {
        await this.dialogLoading.show();

        //Authen with firebase
        await firebase.auth().signInWithEmailAndPassword(this.state.username, this.state.password)
            .then((responeAuthen) => {

                firebase.database().ref("sbuywallet/profile/" + responeAuthen.user.uid).on('value', (snap) => {
                    // get children as an array
                    if (snap.val() != null) {
                        dataSet = {
                            "uid": snap.val().uid,
                            "email": snap.val().email,
                            "key_stellar": snap.val().key_stellar,
                            "cvv": snap.val().cvv
                        }

                        AsyncStorage.setItem('user', JSON.stringify(dataSet))
                            .then((res) => {
                                Actions.Pincode();
                            })
                            .catch((error) => {
                                console.log('================= Login again error ===================');
                                console.log(error);
                                console.log('====================================');
                            });

                        // Database.setUserAuth(dataSet, (error) => { console.log(error) });
                    } else {
                        // Create key wallet and cvv
                        connectApi("https://api.afin.network/sbuy-api/create_wallet", "GET", {}, {})
                            .then((respone) => {
                                dataInsert = {
                                    "uid": responeAuthen.user.uid,
                                    "email": this.state.username,
                                    "cvv": respone.CVV,
                                    "key_stellar": respone.stellar,
                                }
                                //Insert data to firebase database
                                firebase.database().ref('sbuywallet/profile/' + responeAuthen.user.uid).set(dataInsert)
                                    .then((data) => {
                                        //success callback
                                        dataSet = {
                                            "uid": responeAuthen.user.uid,
                                            "email": this.state.username,
                                            "key_stellar": respone.stellar,
                                            "cvv": respone.CVV
                                        }

                                        AsyncStorage.setItem('user', JSON.stringify(dataSet))
                                            .then((res) => {
                                                console.log('================= Login news ===================');
                                                console.log(res);
                                                console.log('====================================');
                                            })
                                            .catch((error) => {
                                                console.log('================= Login news error ===================');
                                                console.log(error);
                                                console.log('====================================');
                                            });
                                        // Database.setUserAuth(dataSet, (error) => { console.log(error) });

                                    }).then((res2) => {
                                        Actions.Pincode();
                                    })
                                    .catch((error) => {
                                        //error callback
                                        alertOops("Opps..!", "Something is wrong, Please try again");

                                        console.log('=============== Error insert firebase =====================');
                                        console.log('error : ', error);
                                        console.log('====================================');
                                    })
                            })
                            .catch((error) => {
                                alertOops("Opps..!", "Something is wrong, Please try again");
                                console.log('=============== Error create wallet =====================');
                                console.log(error);
                                console.log('====================================');
                            })
                    }
                });
            })
            .catch((error) => {
                alertOops(error.code, error.message);
                console.log('=============== Error Authen =====================');
                console.log(error);
                console.log('====================================');
            });

        await this.dialogLoading.dismiss();
    }

    checkPass = () => {
        if (this.state.showPass) {
            this.setState({ showPass: false, statusSecureText: true });
        } else {
            this.setState({ showPass: true, statusSecureText: false });
        }
    }

    render() {
        return (
            <ScrollView scrollEnabled={true} contentContainerStyle={{ flexGrow: 1 }}>
                <LinearGradient
                    colors={['#688EFF', '#58A3EA']}
                    style={styles.linearGradient}
                    start={{ x: 1.0, y: 0.31 }}
                    end={{ x: 0.5, y: 1.0 }}
                >
                    <View style={styles.viewMain}>
                        <Image source={require('../../assets/logo.png')} resizeMode="contain" style={styles.imageLogo} />
                        <Text style={{ fontSize: 14, fontWeight: 'bold', marginTop: height * 0.05, color: '#3A3A3A' }}>อีเมลล์</Text>
                        <Item>
                            <Input
                                value={this.state.username}
                                onChangeText={username => this.setState({ username })}
                                // style={{ fontSize: Device.isTablet ? 16 : height * 0.02, height: height * 0.05, color: "#636363" }}
                                style={{ fontSize: Device.isTablet ? 16 : RF(2.5), height: Device.isTablet ? height * 0.05 : height * 0.06, color: "#636363" }}
                                keyboardType="email-address"
                            />
                        </Item>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', marginTop: 20, color: '#3A3A3A' }}>รหัสผ่าน</Text>
                        <Item>
                            <Input
                                value={this.state.password}
                                onChangeText={password => this.setState({ password })}
                                style={{ fontSize: Device.isTablet ? 16 : RF(2.5), height: Device.isTablet ? height * 0.05 : height * 0.06, color: "#636363" }}
                                secureTextEntry={this.state.statusSecureText}
                            />
                            <Icon active style={{ color: "#315467" }} type="Entypo" name={this.state.showPass ? "eye" : "eye-with-line"} onPress={() => this.checkPass()} />
                        </Item>

                        <Button full style={{ backgroundColor: "#688EFF", height: height * 0.06, marginTop: Device.isTablet ? (width * 0.08) : (width * 0.05), borderRadius: 8, marginBottom: 20 }} onPress={() => this.onLogin(this.state.username, this.state.password)}>
                            <Text style={{ color: "#FFF", fontSize: 16, fontWeight: 'bold' }}>เข้าสู่ระบบ</Text>
                        </Button>

                        <Image source={require('../../assets/logo_under.png')} resizeMode="contain" style={styles.imageLogoUnder} />

                    </View>
                    <PopupDialog
                        ref={(dialogLoading) => {
                            this.dialogLoading = dialogLoading;
                        }}
                        dialogStyle={ConstStyle.styleLoadingDialogMain}
                        containerStyle={{ zIndex: 10, elevation: 10 }}
                        height={130}
                        width={300}
                        dismissOnTouchOutside={false}
                        dismissOnHardwareBackPress={false}
                        haveOverlay>
                        <View style={{
                            alignItems: 'center'
                        }}>
                            <Spinner color={Const.COLORMAIN} />
                            <Text style={{ color: Const.COLORMAIN }}>กำลังดำเนินการ...</Text>
                        </View>
                    </PopupDialog>
                </LinearGradient>
            </ScrollView >
        );
    }
}

const styles = StyleSheet.create({
    linearGradient: {
        flex: 1
    },
    viewMain: {
        flex: 1,
        justifyContent: 'center',
        paddingLeft: 30,
        paddingRight: 30,
        marginTop: height * 0.05,
        marginBottom: height * 0.05,
        marginLeft: width * 0.1,
        marginRight: width * 0.1,
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 1.5,
        elevation: 5
    },
    imageLogo: {
        width: width * 0.4,
        height: height * 0.2,
        alignSelf: 'center',
        marginTop: 20
    },
    imageLogoUnder: {
        width: width * 0.3,
        height: height * 0.1,
        alignSelf: 'center',
    },
});