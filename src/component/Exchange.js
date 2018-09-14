import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Container, Icon, Button, Input, Item } from 'native-base';
import Spinners from 'react-native-spinkit';
import axios from 'axios';

import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
import { Actions } from 'react-native-router-flux';
import RF from 'react-native-responsive-fontsize';

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

export default class Test extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataCrypto: [],
            dataProfile: [],

            stateDialogView: "DETAIL", //DETAIL,LOADING,SUCCESS

            coinImage1: "-",
            coinAsset1: "-",
            coinName1: "-",
            coinBalances1: "-",

            coinImage2: "-",
            coinAsset2: "-",
            coinName2: "-",
            coinBalances2: "-",

            amountChange: 0.00,
        }
    }

    componentWillMount() {
        this.firebaseDbCrypto = firebase.database().ref("sbuywallet/crypto/");
        Database.getUserAuth((result) => {
            this.setState({ dataProfile: result }, () => this._getListCrypto(this.state.dataProfile));
        });

    }

    _getListCrypto = () => {
        this.firebaseDbCrypto.on('value', (snap) => {
            // get children as an array
            var items = [];
            snap.forEach((child) => {
                items.push({
                    asset_name: child.val().asset_name,
                    icon_white: child.val().icon_white,
                    icon: child.val().icon,
                    name: child.val().name,
                    key: child.key
                });
            });

            this.setState({
                dataCrypto: items,

                coinImage1: items[0].icon_white,
                coinAsset1: items[0].asset_name,
                coinName1: items[0].name,

                coinImage2: items[1].icon_white,
                coinAsset2: items[1].asset_name,
                coinName2: items[1].name,
            }, () => {
                this._getBalancesAsset(this.state.dataProfile.key_stellar, items[0].asset_name, 1)
                this._getBalancesAsset(this.state.dataProfile.key_stellar, items[1].asset_name, 2)
            });
        });
    }

    _getBalancesAsset = (key_stellar, asset_name, type) => {
        console.log(key_stellar + "//" + asset_name + "//" + type);
        if (key_stellar != undefined) {
            connectApi(Const.URL._GET_BALANCES_ASSET, "GET", {}, {
                "asset_name": asset_name,
                "stellar_wallet": key_stellar,
            })
                .then((respone) => {
                    switch (type) {
                        case 1:
                            this.setState({
                                coinBalances1: respone.Balances[0].balance
                            });
                            break;

                        case 2:
                            this.setState({
                                coinBalances2: respone.Balances[0].balance
                            });
                            break;

                        default:
                            break;
                    }

                })
                .catch((error) => {
                    console.log('=============== _getBalancesAsset error =====================');
                    console.log(error);
                    console.log('====================================');
                })
        }
    }

    onOpen = (index, type) => {
        switch (type) {
            case 1:
                this.setState({
                    coinImage1: this.state.dataCrypto[index].icon_white,
                    coinAsset1: this.state.dataCrypto[index].asset_name,
                    coinName1: this.state.dataCrypto[index].name,
                    coinBalances1: "-"
                }, () => {
                    this._getBalancesAsset(this.state.dataProfile.key_stellar, this.state.dataCrypto[index].asset_name, type);
                });
                break;
            case 2:
                this.setState({
                    coinImage2: this.state.dataCrypto[index].icon_white,
                    coinAsset2: this.state.dataCrypto[index].asset_name,
                    coinName2: this.state.dataCrypto[index].name,
                    coinBalances2: "-"
                }, () => {
                    this._getBalancesAsset(this.state.dataProfile.key_stellar, this.state.dataCrypto[index].asset_name, type);
                });
                break;
            default:
                break;
        }
    }

    onChangeCoin = (type) => {
        //1:up 2:down
        this.setState({ stateDialogView: "LOADING" });
        let data;
        if (type == 1) {
            data = {
                "stellar_wallet": this.state.dataProfile.key_stellar,
                "from_asset": this.state.coinAsset2,
                "to_asset": this.state.coinAsset1,
                "amount": this.state.amountChange
            }
        } else if (type == 2) {
            data = {
                "stellar_wallet": this.state.dataProfile.key_stellar,
                "from_asset": this.state.coinAsset1,
                "to_asset": this.state.coinAsset2,
                "amount": this.state.amountChange
            }
        }

        axios.post(Const.URL._POST_SWAP_ASSET, data,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((respone) => {
                if (respone.status == "error") {
                    this.setState({ stateDialogView: "DETAIL", amountChange: "" }, () => {
                        if (type == 1) {
                            this.popupDialogUp.dismiss(() => {
                                alertOops('Opps..!', respone.message.message);
                            });
                        } else if (type == 2) {
                            this.popupDialogDown.dismiss(() => {
                                alertOops('Opps..!', respone.message.message);
                            });
                        }
                    });
                } else {
                    this.setState({ stateDialogView: "SUCCESS" }, () => {
                        this._getBalancesAsset(this.state.dataProfile.key_stellar, this.state.coinAsset1, 1);
                        this._getBalancesAsset(this.state.dataProfile.key_stellar, this.state.coinAsset2, 2);
                    })
                }
            })
            .catch((error) => {
                this.setState({ stateDialogView: "DETAIL", amountChange: "" }, () => {

                    if (type == 1) {
                        this.popupDialogUp.dismiss();
                    } else if (type == 2) {
                        this.popupDialogDown.dismiss();
                    }
                });
                console.log('=============== _POST_SWAP_ASSET error =====================');
                console.log(error);
                console.log('====================================');
            })
    }

    _renderDialogView = (type) => {
        switch (this.state.stateDialogView) {
            case "DETAIL":
                return (
                    <View>
                        <View style={{ padding: "2.5%", alignItems: 'flex-end' }}>
                            <Icon onPress={() => type == 1 ? this.popupDialogUp.dismiss() : this.popupDialogDown.dismiss()} type="Ionicons" name="md-close-circle" style={{ fontSize: RF(4), color: "#58A3EA" }} />
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <Image source={require('../../assets/sent-currency-icon.png')} resizeMode="contain" style={{ width: width * 0.32, height: height * 0.18 }} />
                            <Text style={{
                                fontSize: RF(3), color: "#777777",
                                textShadowColor: 'rgba(0, 0, 0,0.16)',
                                textShadowOffset: { width: 0, height: 3 },
                                textShadowRadius: 3,
                                elevation: 3,
                                marginTop: "5%"
                            }}>แปลง {type == 1 ? this.state.coinAsset2 : this.state.coinAsset1} เป็น {type == 1 ? this.state.coinAsset1 : this.state.coinAsset2}</Text>
                        </View>
                        <View style={{ paddingLeft: "4%", paddingRight: '4%' }}>
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
                                    value={this.state.amountChange}
                                    onChangeText={(amountChange) => this.setState({ amountChange })}
                                />
                                <Text style={{ marginRight: "5%" }}>{type == 1 ? this.state.coinAsset2 : this.state.coinAsset1}</Text>
                            </Item>
                            <Button block success style={{ marginTop: "5%" }} onPress={() => this.onChangeCoin(type)}>
                                <Text style={{ color: "#FFFFFF" }}>ยืนยัน</Text>
                            </Button>
                            <Text style={{
                                fontSize: RF(1.8),
                                textShadowColor: 'rgba(0, 0, 0,0.16)',
                                textShadowOffset: { width: 0, height: 3 },
                                textShadowRadius: 3,
                                elevation: 3,
                                color: "#FF5129",
                                marginTop: "5%"
                            }}>*กรุณาอย่าปิดหน้าต่างนี้ลง จนกว่าจะทำรายการสำเร็จ</Text>
                        </View>
                    </View>
                )
                break;
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
                        {/* <Button block style={{
                            marginTop: "5%",
                            backgroundColor: "#AEAEAE",
                            borderRadius: 8,
                            shadowColor: "rgba(0, 0, 0,0.16)",
                            shadowOffset: { width: 0, height: 3 },
                            shadowOpacity: 0.8,
                            shadowRadius: 1.5,
                            elevation: 8
                        }} disabled>
                            <Text style={{ color: "#FFFFFF" }}>ยืนยัน</Text>
                        </Button> */}
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
                            type == 1 ?
                                this.popupDialogUp.dismiss(() => {
                                    this.setState({ stateDialogView: "DETAIL", amountChange: "" });
                                })
                                :
                                this.popupDialogDown.dismiss(() => {
                                    this.setState({ stateDialogView: "DETAIL", amountChange: "" });
                                })

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
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.viewMain}>
                    <MenuProvider>
                        <Text style={{
                            fontSize: RF(3.5),
                            color: "#777777",
                            fontWeight: 'bold',
                            textShadowColor: 'rgba(0, 0, 0,0.16)',
                            textShadowOffset: { width: 0, height: 3 },
                            textShadowRadius: 6,
                            elevation: 6,
                        }}></Text>
                        <View style={{ width: "100%", height: height * 0.3, backgroundColor: "#707BCC", marginTop: "5%", justifyContent: "center", alignItems: "center", borderRadius: 8 }}>
                            <Menu onSelect={value => alert(`Selected number: ${value}`)}>
                                <MenuTrigger customStyles={triggerStyles} children={<Text style={{
                                    fontSize: RF(3),
                                    color: "#FFFFFF",
                                    textShadowColor: 'rgba(0, 0, 0,0.16)',
                                    textShadowOffset: { width: 0, height: 3 },
                                    textShadowRadius: 6,
                                    elevation: 6,
                                }}>{this.state.coinName1} <Icon type="Entypo" name="chevron-small-down" style={{ fontSize: RF(3), color: "#FFFFFF" }} /></Text>} />
                                <MenuOptions customStyles={optionStyles}>
                                    {
                                        this.state.dataCrypto.map((item, index) => {
                                            return (
                                                <MenuOption key={index} onSelect={() => this.onOpen(index, 1)}>
                                                    <Text style={styles.textMenuPop}>{item.name}</Text>
                                                </MenuOption>
                                            )
                                        })
                                    }
                                </MenuOptions>
                            </Menu>
                            <Image source={{ uri: this.state.coinImage1 }} resizeMode="cover" style={{ width: width * 0.25, height: height * 0.15 }} />
                            <Text style={{ color: "#FFFFFF", fontSize: RF(2) }}>คงเหลือ {this.state.coinBalances1 + " " + this.state.coinAsset1}</Text>
                        </View>

                        <View style={{ width: "100%", height: height * 0.1, flexDirection: 'row', justifyContent: 'center' }}>
                            <Button style={{ alignSelf: "center", marginRight: "2.5%", backgroundColor: "#45D25C", borderRadius: 8 }} onPress={() => this.popupDialogUp.show()}><Icon name="md-arrow-round-up" type="Ionicons" /></Button>
                            <Button style={{ alignSelf: "center", marginLeft: "2.5%", backgroundColor: "#FF5129", borderRadius: 8 }} onPress={() => this.popupDialogDown.show()}><Icon name="md-arrow-round-down" type="Ionicons" /></Button>
                        </View>

                        <View style={{ width: "100%", height: height * 0.3, backgroundColor: "#32BEDE", justifyContent: "center", alignItems: "center", borderRadius: 8 }}>
                            <Menu onSelect={value => alert(`Selected number: ${value}`)}>
                                <MenuTrigger customStyles={triggerStyles} children={<Text style={{
                                    fontSize: RF(3),
                                    color: "#FFFFFF",
                                    textShadowColor: 'rgba(0, 0, 0,0.16)',
                                    textShadowOffset: { width: 0, height: 3 },
                                    textShadowRadius: 6,
                                    elevation: 6,
                                }}>{this.state.coinName2} <Icon type="Entypo" name="chevron-small-down" style={{ fontSize: RF(3), color: "#FFFFFF" }} /></Text>} />
                                <MenuOptions customStyles={optionStyles}>
                                    {
                                        this.state.dataCrypto.map((item, index) => {
                                            return (
                                                <MenuOption key={index} onSelect={() => this.onOpen(index, 2)}>
                                                    <Text style={styles.textMenuPop}>{item.name}</Text>
                                                </MenuOption>
                                            )
                                        })
                                    }
                                </MenuOptions>
                            </Menu>
                            <Image source={{ uri: this.state.coinImage2 }} resizeMode="cover" style={{ width: width * 0.25, height: height * 0.15 }} />
                            <Text style={{ color: "#FFFFFF", fontSize: RF(2) }}>คงเหลือ {this.state.coinBalances2 + " " + this.state.coinAsset2} </Text>
                        </View>
                    </MenuProvider>
                </View>

                <TabFooter activeTab="exchange" />

                <PopupDialog
                    ref={(popupDialog) => { this.popupDialogUp = popupDialog; }}
                    dialogAnimation={slideAnimation}
                    width={0.8}
                    height={0.6}
                    hasOverlay={true}
                    dismissOnTouchOutside={false}
                >
                    {
                        this._renderDialogView(1)
                    }
                </PopupDialog>

                <PopupDialog
                    ref={(popupDialog) => { this.popupDialogDown = popupDialog; }}
                    dialogAnimation={slideAnimation}
                    width={0.8}
                    height={0.6}
                    hasOverlay={true}
                    dismissOnTouchOutside={false}
                    dismissOnHardwareBackPress={false}
                >
                    {
                        this._renderDialogView(2)
                    }
                </PopupDialog>
            </ScrollView>
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
    viewMain: {
        flex: 1,
        backgroundColor: "#F8F8F8",
        padding: "5%"
    },
    imageMenuPop: {
        width: width * 0.05,
        height: height * 0.05,
        marginLeft: '7%'
    },
    textMenuPop: {
        color: '#AEAEAE',
        fontSize: RF(3),
        marginLeft: '7%'
    },
});