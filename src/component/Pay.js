import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, ScrollView, Image, TouchableOpacity, Modal, } from 'react-native';
import { Container, Icon, Button, Input, Item } from 'native-base';
import axios from 'axios';

import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
import { Actions } from 'react-native-router-flux';
import RF from 'react-native-responsive-fontsize';
import QRCode from 'react-native-qrcode';

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

export default class Pay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataCrypto: [],
            dataProfile: [],

            stateView: "INPUT",//INPUT,QRCODE

            coinImage1: "",
            coinAsset1: "",
            coinName1: "",
            payBalances: "",
        }
    }

    componentWillMount() {
        this.firebaseDbCrypto = firebase.database().ref("sbuywallet/crypto/");
        Database.getUserAuth((result) => {
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
            coinName1: this.state.dataCrypto[index].name
        });
    }

    _renderView = () => {
        if (this.state.stateView == "QRCODE") {
            return (
                <View style={{ backgroundColor: "#FFFFFF", alignItems: "center" }}>
                    <Text style={{
                        fontSize: RF(3.5),
                        color: "#777777",
                        fontWeight: 'bold',
                        textShadowColor: 'rgba(0, 0, 0,0.16)',
                        textShadowOffset: { width: 0, height: 3 },
                        textShadowRadius: 6,
                        elevation: 6,
                    }}>จำนวนเงิน {this.state.payBalances + " " + this.state.coinAsset1} </Text>
                    <View style={{ marginTop: "5%" }}>
                        <QRCode
                            value={this.state.dataProfile.key_stellar + "," + this.state.coinAsset1 + "," + this.state.payBalances}
                            size={170}
                            bgColor='black'
                            fgColor='white' />
                    </View>
                    <Button block style={{ marginTop: "5%", backgroundColor: "#688EFF" }} onPress={() => this.setState({ stateView: "INPUT", payBalances: "" })}>
                        <Text style={{ color: "#FFFFFF" }}>แก้ไขจำนวนเงิน</Text>
                    </Button>
                    <Button block style={{ marginTop: "5%", backgroundColor: "#45D25C" }} onPress={() => alertOops("Oops..!","Coming soon ..!")}>
                        <Text style={{ color: "#FFFFFF" }}>แชร์</Text>
                    </Button>
                </View>
            )
        } else {
            return (
                <View>
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
                        }} numberOfLines={1}>Address : <Text style={{
                            fontSize: RF(3),
                            color: "#777777",
                            fontWeight: 'normal',
                            textShadowColor: 'rgba(0, 0, 0,0.16)',
                            textShadowOffset: { width: 0, height: 3 },
                            textShadowRadius: 3,
                            elevation: 3,
                            marginTop: "5%"
                        }} >{this.state.dataProfile.key_stellar}</Text></Text>
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
                                value={this.state.coinBalances1}
                                onChangeText={(payBalances) => {
                                    this.setState({ payBalances: payBalances })
                                }}
                            />
                            <Text style={{ marginRight: "3%" }}>{this.state.coinAsset1}</Text>
                        </Item>
                        <Button block style={{ marginTop: "5%", marginBottom: "5%", backgroundColor: "#688EFF" }} onPress={() => this.setState({ stateView: "QRCODE" })}>
                            <Text style={{ color: "#FFFFFF" }}>สร้าง Qr code</Text>
                        </Button>
                    </View>
                </View>
            )
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
                            marginBottom: "10%",
                        }}><Icon type="MaterialCommunityIcons" name="qrcode-scan" style={{ fontSize: RF(5), color: "#58A3EA" }} /> รับชำระ</Text>

                        <View style={{ backgroundColor: "#FFFFFF", padding: "5%", borderRadius: 8, width: "100%", height: height * 0.61 }}>

                            {
                                this._renderView()
                            }
                        </View>
                    </MenuProvider>
                </View>
                <Image source={require("../../assets/bg-domepay.png")} style={{ width: width, height: height * 0.2, marginTop: "-20%" }} />
                <TabFooter activeTab="merchant" />
            </ScrollView >
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
        padding: "5%",
        zIndex: 10,
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
