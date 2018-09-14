import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Container, Icon, Button, Input, Item } from 'native-base';
import Spinners from 'react-native-spinkit';
import axios from 'axios';

import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
import { Actions } from 'react-native-router-flux';
import RF from 'react-native-responsive-fontsize';
import Camera from 'react-native-camera';

// ========== Firebase ==========
import firebase from 'firebase';
global.Symbol = require('core-js/es6/symbol');
require('core-js/fn/symbol/iterator');
// collection fn polyfills
require('core-js/fn/map');
require('core-js/fn/set');
require('core-js/fn/array/find');
// ==============================

import {
    Menu,
    MenuProvider,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';

import { connectApi, alertOops } from './constants/Function';
import ConstStyle from './constants/ConstStyle';
import TabFooter from './common/TabFooter';
import Validate from './common/Validate';
import Database from './database/DbUser';
import Const from './constants/Const';

const Device = require('react-native-device-detection');
const { width, height } = Dimensions.get('window');

export default class DomePay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataCrypto: [],
            dataProfile: [],

            stateView: "BUTTON",//BUTTON,CAMERA
            stateDialogView: "LOADING",//LOADING,SUCCESS

            coinImage1: "-",
            coinAsset1: "-",
            coinName1: "-",
            coinBalances: "-",//จำนวนเงินคงเหลือ

            payBalances: "",//จำนวนเงินที่ต้องจ่าย
            payAssetName: "",//จำนวนเงินที่ต้องจ่าย
            payeeKeyStellar: ""//Key Stellar ผู้รับชำระ

        }
    }

    componentWillMount() {
        this.firebaseDbCrypto = firebase.database().ref("sbuywallet/crypto/");
        Database.getUserAuth((result) => {
            this._getBalancesAsset(result.key_stellar, "Jfin");
            this.setState({ dataProfile: result });
        });
    }

    componentDidMount() {
        this.firebaseDbCrypto.on('value', (snap) => {
            // get children as an array
            var items = [];
            snap.forEach((child) => {
                items.push({
                    asset_name: child.val().asset_name,
                    icon_white: child.val().icon,
                    icon: child.val().icon,
                    name: child.val().name,
                    key: child.key
                });
            });

            this.setState({
                dataCrypto: items,
                coinAsset1: items[0].asset_name,
                coinImage1: items[0].icon_white,
                coinName1: items[0].name,
            });
        });
    }

    onOpen = (index) => {
        this.setState({
            coinImage1: this.state.dataCrypto[index].icon_white,
            coinAsset1: this.state.dataCrypto[index].asset_name,
            coinName1: this.state.dataCrypto[index].name,
            coinBalances: "-"
        }, () => {
            this._getBalancesAsset(this.state.dataProfile.key_stellar, this.state.dataCrypto[index].asset_name);
        });
    }

    _getBalancesAsset = (key_stellar, asset_name) => {
        connectApi(Const.URL._GET_BALANCES_ASSET, "GET", {}, {
            "asset_name": asset_name,
            "stellar_wallet": key_stellar,
        })
            .then((respone) => {
                this.setState({
                    coinBalances: respone.Balances[0].balance,
                });
            })
            .catch((error) => {
                console.log("_getBalancesAsset error", error);
            })
    }

    _onPay = () => {
        this.popupDialogUp.show(() => {
            let dataSend = {
                "from": this.state.dataProfile.key_stellar,
                // "to": this.state.payeeKeyStellar,
                "to": "GBAKVVUYMZXTG42QTVU3KVQUYDLCZWO33SWRTXBFUN74GHIYUOWBTIPD",
                "amount": this.state.payBalances,
                "description": "Awesome gadgets",
                "asset_name": this.state.coinAsset1,
                "CVV": this.state.dataProfile.cvv
            }

            console.log(dataSend)

            axios.post(Const.URL._POST_PAY_CVV, {
                "from": this.state.dataProfile.key_stellar,
                // "to": this.state.payeeKeyStellar,
                "to": "GBAKVVUYMZXTG42QTVU3KVQUYDLCZWO33SWRTXBFUN74GHIYUOWBTIPD",
                "amount": this.state.payBalances,
                "description": "Awesome gadgets",
                "asset_name": this.state.coinAsset1,
                "CVV": this.state.dataProfile.cvv
            },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then((respone) => {
                    console.log('================ respone _onPay ====================');
                    console.log(respone);
                    console.log(respone.data.hash);
                    console.log(respone.status);
                    console.log('====================================');
                    if (respone.data.hash != undefined) {
                        this.setState({ stateDialogView: "SUCCESS" })
                    } else {
                        this.setState({ stateDialogView: "ERROR" })
                    }
                })
                .catch((error) => {
                    // this.popupDialogUp.dismiss();
                    this.setState({ stateDialogView: "ERROR" })
                    console.log("_POST_SWAP_ASSET error", error);
                })
        })

    }

    onSuccess(e) {
        var str = e.data;
        var array = str.split(",")

        this.setState({
            payeeKeyStellar: array[0],
            payAssetName: array[1],
            payBalances: array[2],
            stateView: "BUTTON"
        })
    }

    _renderView = () => {
        if (this.state.stateView == "CAMERA") {
            return (
                <View>
                    <Camera
                        ref={cam => {
                            this.camera = cam;
                        }}
                        style={{ width: width * 0.65, height: height * 0.3, alignSelf: 'center', marginTop: "5%" }}
                        aspect={Camera.constants.Aspect.fill}
                        barCodeTypes={['qr']}
                        onBarCodeRead={this.onSuccess.bind(this)}
                        captureAudio={false}
                    />
                    <Button block style={{ marginTop: "5%", backgroundColor: "#688EFF" }} onPress={() => this.setState({ stateView: "BUTTON" })}>
                        <Text style={{ color: "#FFFFFF" }}>ย้อนกลับ</Text>
                    </Button>
                </View>
            )
        } else {
            return (
                <View>
                    <Text style={{
                        fontSize: RF(2),
                        color: "#777777",
                        textShadowColor: 'rgba(0, 0, 0,0.16)',
                        textShadowOffset: { width: 0, height: 3 },
                        textShadowRadius: 3,
                        elevation: 3,
                        marginTop: "5%"
                    }}>Address</Text>
                    <Item regular style={{ marginTop: "5%" }}>
                        <Input
                            placeholder="ที่อยู่ปลายทางของ Sbuy (Stellar)"
                            value={this.state.payeeKeyStellar}
                            onChangeText={(payeeKeyStellar) => {
                                this.setState({ payeeKeyStellar })
                            }}
                        />
                    </Item>
                    <Button block style={{ marginTop: "5%", backgroundColor: "#688EFF" }} onPress={() => this.setState({ stateView: "CAMERA" })}>
                        <Text style={{ color: "#FFFFFF" }}>สแกน Qr code</Text>
                    </Button>

                    <Text style={{
                        fontSize: RF(2),
                        color: "#777777",
                        textShadowColor: 'rgba(0, 0, 0,0.16)',
                        textShadowOffset: { width: 0, height: 3 },
                        textShadowRadius: 3,
                        elevation: 3,
                        marginTop: "5%"
                    }}>จำนวน</Text>
                    <Item regular style={{ marginTop: "5%" }}>
                        <Input
                            value={this.state.payBalances}
                            onChangeText={(payBalances) => {
                                this.setState({ payBalances })
                            }}
                        />
                        <Text style={{ marginRight: "3%" }}>{this.state.payAssetName}</Text>
                    </Item>
                    <Button block style={{ marginTop: "5%", backgroundColor: "#45D25C" }} onPress={() => this._onPay()}>
                        <Text style={{ color: "#FFFFFF" }}>ชำระเงิน</Text>
                    </Button>
                </View>
            )
        }
    }

    _renderDialogView = () => {
        switch (this.state.stateDialogView) {
            case "LOADING":
                return (
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: "10%" }}>
                        <Spinners
                            isVisible={true}
                            color="rgba(69, 210, 92,0.31)"
                            size={150}
                            type="FadingCircleAlt"
                        />
                        <Text style={{
                            fontSize: RF(4),
                            color: "#777777",
                            textShadowColor: 'rgba(0, 0, 0,0.16)',
                            textShadowOffset: { width: 0, height: 3 },
                            textShadowRadius: 6,
                            elevation: 6,
                        }}>กำลังทำรายการ...</Text>
                    </View>
                )
                break;
            case "SUCCESS":
                return (
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: "10%" }}>
                        <Icon name="ios-checkmark-circle-outline" type="Ionicons" style={{ fontSize: RF(35), color: "#45D25C" }} />
                        <Text style={{
                            fontSize: RF(4),
                            color: "#777777",
                            textShadowColor: 'rgba(0, 0, 0,0.16)',
                            textShadowOffset: { width: 0, height: 3 },
                            textShadowRadius: 6,
                            elevation: 6,
                        }}>ทำรายการสำเร็จ!</Text>
                        <Button block style={{
                            marginTop: "5%",
                            backgroundColor: "#45D25C",
                            borderRadius: 8,
                            shadowColor: "rgba(0, 0, 0,0.16)",
                            shadowOffset: { width: 0, height: 3 },
                            shadowOpacity: 0.8,
                            shadowRadius: 1.5,
                            elevation: 8
                        }} onPress={() => {
                            this.popupDialogUp.dismiss(() => {
                                this.setState({
                                    stateDialogView: "LOADING",
                                    payBalances: "",//จำนวนเงินที่ต้องจ่าย
                                    payAssetName: "",//จำนวนเงินที่ต้องจ่าย
                                    payeeKeyStellar: ""//Key Stellar ผู้รับชำระ
                                })
                            });
                        }}>
                            <Text style={{ color: "#FFFFFF" }}>ตกลง</Text>
                        </Button>
                    </View>
                )
                break;
            case "ERROR":
                return (
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: "10%" }}>
                        <Icon name="ios-close-circle-outline" type="Ionicons" style={{ fontSize: RF(35), color: "#FF5129" }} />
                        <Text style={{
                            fontSize: RF(4),
                            color: "#777777",
                            textShadowColor: 'rgba(0, 0, 0,0.16)',
                            textShadowOffset: { width: 0, height: 3 },
                            textShadowRadius: 6,
                            elevation: 6,
                        }}>มีบ้างอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง..!</Text>
                        <Button block style={{
                            marginTop: "5%",
                            backgroundColor: "#45D25C",
                            borderRadius: 8,
                            shadowColor: "rgba(0, 0, 0,0.16)",
                            shadowOffset: { width: 0, height: 3 },
                            shadowOpacity: 0.8,
                            shadowRadius: 1.5,
                            elevation: 8
                        }} onPress={() => {
                            this.popupDialogUp.dismiss(() => {
                                this.setState({
                                    stateDialogView: "LOADING",
                                    payBalances: "",//จำนวนเงินที่ต้องจ่าย
                                    payAssetName: "",//จำนวนเงินที่ต้องจ่าย
                                    payeeKeyStellar: ""//Key Stellar ผู้รับชำระ
                                })
                            });
                        }}>
                            <Text style={{ color: "#FFFFFF" }}>ตกลง</Text>
                        </Button>
                    </View>
                )
                break;
            default:
                break;
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <MenuProvider>
                        <View style={{ backgroundColor: "#58A3EA", width: width, height: height * 0.38, padding: "5%" }}>
                            <View style={{ justifyContent: "center" }}>
                                <Text style={{
                                    fontSize: RF(4),
                                    color: "#FFFFFF",
                                    fontWeight: 'bold',
                                    textShadowColor: 'rgba(0, 0, 0,0.16)',
                                    textShadowOffset: { width: 0, height: 3 },
                                    textShadowRadius: 6,
                                    elevation: 6,
                                }}><Image source={require('../../assets/ic_dome_white.png')} resizeMode="cover" style={{
                                    width: width * 0.08,
                                    height: height * 0.05,
                                }} /> ชำระผ่าน DomePay</Text>
                            </View>
                        </View>
                        <View style={{ marginTop: "-45%", padding: "5%" }}>
                            <View style={{ backgroundColor: "#FFFFFF", borderRadius: 8, width: "100%", height: height * 0.87 }}>
                                <View style={{ alignItems: 'center' }}>
                                    <Menu onSelect={value => alert(`Selected number: ${value}`)}>
                                        <MenuTrigger customStyles={triggerStyles} children={<Text style={{
                                            fontSize: RF(3),
                                            color: "#777777",
                                            fontWeight: 'bold',
                                            textShadowColor: 'rgba(0, 0, 0,0.16)',
                                            textShadowOffset: { width: 0, height: 3 },
                                            textShadowRadius: 6,
                                            elevation: 6,
                                        }}>{this.state.coinName1} <Icon type="Entypo" name="chevron-small-down" style={{ fontSize: RF(3), fontWeight: 'blold', color: "#777777" }} /></Text>} />
                                        <MenuOptions customStyles={optionStyles}>
                                            {
                                                this.state.dataCrypto.map((item, index) => {
                                                    return (
                                                        <MenuOption key={index} onSelect={() => this.onOpen(index)}>
                                                            <Text style={styles.textMenuPop}>{item.name}</Text>
                                                        </MenuOption>
                                                    )
                                                })
                                            }
                                        </MenuOptions>
                                    </Menu>
                                    <Image source={{ uri: this.state.coinImage1 }} resizeMode="cover" style={{ width: width * 0.30, height: height * 0.18 }} />
                                    <Text style={{
                                        fontSize: RF(3),
                                        color: "#777777",
                                        fontWeight: "bold",
                                        textShadowColor: 'rgba(0, 0, 0,0.16)',
                                        textShadowOffset: { width: 0, height: 3 },
                                        textShadowRadius: 3,
                                        elevation: 3,
                                        marginTop: "5%"
                                    }}>ยอดคงเหลือ {this.state.coinBalances + " " + this.state.coinAsset1}</Text>
                                </View>

                                <View style={{ paddingLeft: "4%", paddingRight: '4%' }}>
                                    {this._renderView()}
                                </View>
                            </View>
                        </View>
                    </MenuProvider >

                </ScrollView >
                <PopupDialog
                    ref={(popupDialog) => { this.popupDialogUp = popupDialog; }}
                    dialogAnimation={slideAnimation}
                    width={0.8}
                    height={0.6}
                    hasOverlay={true}
                    dismissOnTouchOutside={false}
                >
                    {
                        this._renderDialogView()
                    }
                </PopupDialog>
                <TabFooter activeTab="domepay" />
            </View>
        );
    }
}

const slideAnimation = new SlideAnimation({
    slideFrom: 'bottom',
});

const triggerStyles = {
    triggerText: {
        color: 'white',
    },
    triggerWrapper: {
        padding: 5,
        // backgroundColor: 'rgba(244,67,54,1)',
        // alignSelf: 'flex-end',
    },
    TriggerTouchableComponent: TouchableOpacity,
};

const optionStyles = {
    optionWrapper: {
        width: 200,
        marginRight: 50,
        flexDirection: 'row',
        alignItems: 'center'
    },
    optionsWrapper: {
        borderRadius: 8,
        borderWidth: 0.5,
        borderColor: "rgba(224,224,224 ,1)",
    },
};

const styles = StyleSheet.create({
    imageMenuPop: {
        width: width * 0.1,
        height: height * 0.05,
    },
    textMenuPop: {
        color: '#AEAEAE',
        fontSize: RF(3),
        marginLeft: '7%'
    },
});